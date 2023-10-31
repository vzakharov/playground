import path from "path";
import { colored, compile, ensure, shouldNotBe } from ".";
import tmp from "tmp";
import fs from "fs";
import cp from 'child_process';
import Docker from "dockerode";
import crypto from "crypto";

export const DEFAULT_MODEL = "gpt-4";
export const FAST_MODEL = "gpt-3.5-turbo";
// Regular expression for finding a code block
export const CODE_BLOCK_PATTERN = "```(\w*)\n(.*?)\n```" as const;
export const WORKING_DIR = path.join(__dirname, "extensions");
export const UNKNOWN = Symbol("unknown");
export const TIMEOUT_MSG = "Timeout";
export const DEFAULT_TIMEOUT = 600;
export const WIN32 = process.platform == "win32";
export const PATH_SEPARATOR = WIN32 ? "\\" : "/";

export type CodeBlock = [string | typeof UNKNOWN, string];


/**
 * Execute code in a docker container.
 * 
 * This function is not tested on MacOS.
 * 
 * @param code - The code to execute.
 * If `undefined`, the code from the file specified by `filename` will be executed.
 * Either `code` or `filename` must be provided.
 * @param timeout - The maximum execution time in seconds.
 * If `undefined`, a default timeout will be used. The default timeout is 600 seconds. On Windows, the timeout is not enforced when `useDocker` is `false`.
 * @param filename - The file name to save the code or where the code is stored when `code` is `undefined`.
 * If `undefined`, a file with a randomly generated name will be created.
 * The randomly generated file will be deleted after execution.
 * The file name must be a relative path. Relative paths are relative to the working directory.
 * @param workDir - The working directory for the code execution.
 * If `undefined`, a default working directory will be used.
 * The default working directory is the "extensions" directory under
 * "path_to_autogen".
 * @param useDocker - The docker image to use for code execution.
 * If an array or a string of image name(s) is provided, the code will be executed in a docker container
 * with the first image successfully pulled.
 * - If `false`, the code will be executed in the current environment.
 * - If explicitly set to `true`, the code will run in a Docker container.
 * If the code is executed in the current environment,
 * the code must be trusted.
 * 
 * Porting note: The Python version checks if `docker` package is installed and sets `useDocker` to `true`/`false` accordingly. In Node, we can't run code if the package is not installed, so we don't have this check. Instead, we require the user to explicitly set `useDocker` to `false` and the `ALLOW_CODE_EXECUTION_WITHOUT_DOCKER` environment variable to be set to `true` to allow code execution in the current environment.
 * @param lang - The language of the code. Default is "python".
 * 
 * @returns {@link ExecuteCodeResult}
 */
export async function executeCode<CodeOrFilename extends 'code' | 'filename'>({ 
  code, 
  timeout = DEFAULT_TIMEOUT,
  workDir = WORKING_DIR,
  useDocker = true, 
  lang = 'python',
  filename,
}: (
  CodeOrFilename extends 'code' ? {
    code: string;
    filename?: never
  } : {
    code?: never;
    filename: string;
  }
) & {
  timeout: number;
  workDir?: string;
  useDocker: boolean | string | string[];
  lang: string;
}) {
// }): ExecuteCodeResult {
  if ( !code && !filename ) throw new Error(`Either code or filename must be provided.`);
  if ( code && filename ) throw new Error(`Only one of code and filename can be provided.`);

  if ( useDocker === false ) {
    if ( process.env.ALLOW_CODE_EXECUTION_WITHOUT_DOCKER !== "true" )
      throw new Error(`Code execution in the current environment is not allowed. Set ALLOW_CODE_EXECUTION_WITHOUT_DOCKER to true to allow code execution in the current environment (warning: this is not recommended).`);
    console.log(
      colored.yellow(`Warning: executeCode was called with useDocker set to false. Make sure the code is trusted.`)
    );
  };

  const originalFilename = filename;
  if ( WIN32 && lang && ["sh", "shell"].includes(lang) && !useDocker ) 
    lang = "ps1";
  const isPython = lang.startsWith("python");
  filename ||= tmp.tmpNameSync({ postfix: `.${isPython ? "py" : lang}` });
  const filePath = path.join(workDir, filename);
  const fileDir = path.dirname(filePath);
  fs.mkdirSync(fileDir, { recursive: true });
  if ( code ) {
    fs.writeFileSync(filePath, code);
  };
  // check if already running in a docker container
  const inDockerContainer = fs.existsSync("/.dockerenv");
  if ( !useDocker || inDockerContainer ) {
    // already running in a docker container
    const cmd = {
      command: isPython ? process.execPath : getCmd(lang),
      arg: path.join(".", filename),
    };
    if ( WIN32 ) {
      console.log(
        colored.yellow(`Warning: SIGALRM is not supported on Windows. No timeout will be enforced.`)
      );
    };
    const child = cp.spawn(
      cmd.command, [cmd.arg], 
      { cwd: workDir, shell: true }
    );
    const resultPromise = new Promise<cp.SpawnSyncReturns<string>>((resolve, reject) => {
      child.on("error", reject);
      child.on("close", (code, signal) => {
        resolve({ 
          stdout: "", 
          stderr: "", 
          pid: ensure(
            child.pid,
            "child.pid is undefined (this should never happen)"
          ),
          status: code, 
          signal,
          output: [],
        });
      });
      if ( !WIN32 ) {
        setTimeout(() => {
          child.kill("SIGALRM");
        }, timeout * 1000);
      };
    });
    try {
      await resultPromise;
    } catch {
      return { exitCode: 1, logs: TIMEOUT_MSG };
      // TODO: Check if it's actually a timeout error
    } finally {
      !originalFilename && fs.unlinkSync(filePath);
    };
    const result = await resultPromise;
    let logs: string, absPath: string;
    if ( result.status ) {
      logs = result.stderr;
      if ( !originalFilename ) {
        absPath = path.resolve(filePath);
        logs = logs.replace(absPath, "").replace(filename, "");
      } else {
        absPath = path.resolve(workDir);
        logs = logs.replace(absPath, "");
      }
    } else {
      logs = result.stdout;
    };
    return { exitCode: result.status, logs };
  };

  // create a docker client
  const client = new Docker();
  const imageList =
    Array.isArray(useDocker)
      ? useDocker
    : typeof useDocker === "string"
      ? [useDocker]
    : useDocker === true
      ? ["python:3-alpine", "python:3", "python:3-windowsservercore"]
    : shouldNotBe(useDocker);

  for ( const image of imageList ) {
    // check if the image exists
    try {
      await client.getImage(image).inspect();
      break;
    } catch (e: any) {
      if ( e.statusCode !== 404 ) throw e;
      // pull the image
      console.log(`Pulling image ${image}`);
      try {
        await client.pull(image);
        break;
      } catch (e: any) {
        console.log(`Failed to pull image ${image}`);
        // TODO: Why don't we throw the error here?
      };
    };
  };

  // get a randomized str based on current time to wrap the exit code
  const exitCodeStr = `exitcode${Date.now()}`;
  const absPath = path.resolve(workDir);
  const cmd = [
    "sh",
    "-c",
    `${getCmd(lang)} ${filename}; exit_code=$?; echo -n ${exitCodeStr}; echo -n $exit_code; echo ${exitCodeStr}`,
  ];

  // create a docker container
  const container = await client.createContainer({
    Image: imageList[0],
    Cmd: cmd,
    WorkingDir: "/workspace",
    // get absolute path to the working directory
    HostConfig: {
      Binds: [`${absPath}:/workspace:rw`],
    },
  });
  await container.start();
  const startTime = Date.now();
  const containerDidNotExit = () => container.inspect().then(({ State }) => State.Status !== "exited");

  while (
    await containerDidNotExit()
    && Date.now() - startTime < timeout * 1000
  ) {
    await new Promise(resolve => setTimeout(resolve, 100));
  };
  if ( await containerDidNotExit() ) {
    await container.stop();
    await container.remove();
    !originalFilename && fs.unlinkSync(filePath);
    return { exitCode: 1, logs: TIMEOUT_MSG, image: imageList[0] };
  };
  // get the container logs
  const logs = (await container.logs()).toString().trim();

  // commit the image
  const tag = filename.replace("/", "");
  await container.commit({ repo: "python", tag });
  // remove the container
  await container.remove();
  // check if the code executed successfully
  const { State: { ExitCode: containerExitCode }} = await container.inspect();
  if ( containerExitCode === 0 ) {
    // extract the exit code from the logs
    const pattern = new RegExp(`${exitCodeStr}(\\d+)${exitCodeStr}`);
    const match = logs.match(pattern);
    const exitCode = match ? parseInt(match[1]) : 1;
    // remove the exit code from the logs
    logs.replace(pattern, "");
    return { exitCode, logs, image: `python:${tag}` };
  };

  !originalFilename && fs.unlinkSync(filePath);

  // return the exit code, logs and image
  return { exitCode: containerExitCode, logs, image: `python:${tag}` };

};

/**
 * Extract code from a text.
 * 
 * @param text - The text to extract code from.
 * @param pattern - The regular expression pattern for finding the code block. Defaults to {@link CODE_BLOCK_PATTERN}.
 * @param detectSingleLineCode - Enable the new feature for extracting single line code. Defaults to `false`.
 * 
 * @returns A list of tuples, each containing the language and the code.
 *  If there is no code block in the input text, the language will be {@link UNKNOWN}.
 *  If there is code block but the language is not specified, the language will be `""`.
 * 
 * Porting note: When `detectSingleLineCode` is `true`, `pattern` is ignored, so we use a conditional type to avoid passing in `pattern` when `detectSingleLineCode` is `true`.
 */
export function extractCode<DetectSingle extends boolean>(
  text: string, 
  { 
    pattern = CODE_BLOCK_PATTERN as any, 
    detectSingleLineCode 
  }: {
    pattern?: DetectSingle extends true ? never : string;
    detectSingleLineCode?: DetectSingle;
  } = {}
): CodeBlock[] {
  if ( !detectSingleLineCode ) {
    const matches = Array.from(text.matchAll(new RegExp(pattern, "gms")));
    if ( !matches.length ) return [[UNKNOWN, text]];
    return matches.map(match => {
      const [, language, code] = match;
      return [language.trim(), code.trim()];
    });
  };

  // Extract both multi-line and single-line code block, separated by the | operator
  // `{3}(\w+)?\s*([\s\S]*?)`{3}: Matches multi-line code blocks.
  //    The (\w+)? matches the language, where the ? indicates it is optional.
  // `([^`]+)`: Matches inline code.
  const combinedPattern = new RegExp("`{3}(\\w+)?\\s*([\\s\\S]*?)`{3}|`([^`]+)`", "gms");
  // Porting note: Note that the pattern is hardcoded here and doesn't use the `pattern` parameter.

  const matches = Array.from(text.matchAll(combinedPattern));
  return matches.map(match => {
    const [, language, multiline, inline] = match;
    if ( multiline ) return [language.trim(), multiline.trim()];
    if ( inline ) return ["", inline.trim()];
    throw new Error(`Unexpected match: ${match}`);
  });

};

/**
 * Infer the language for the code.
 * 
 * @param code - The code to infer the language for.
 * 
 * NOTE: The current implementation is not robust and just checks whether it's Python or a shell script using simple heuristics.
 */
export function inferLang(code: string) {
  // TODO: (original) Make it robust.
  if ( ["python", "pip", "python3"].some(prefix => code.startsWith(prefix)) ) return "sh";

  // Check if code is a valid python code
  try {
    compile(code, "test", "exec");
    return "python";
  } catch {
    // Not a valid python code
    return UNKNOWN;
  }
};

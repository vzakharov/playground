import tmp from "tmp";
import cp from "child_process";
import fs from "fs";

/**
 * Mimics Python's `compile` function.
 * 
 * @param code - The code to compile.
 * @param filename - The filename to use for run-time error messages.
 * @param mode - The mode to use for compilation, only `"exec"` is supported.
 * 
 * Implementation details: The function effectively creates a new (temporary) .py file that has runs `compile('''<code>''', "<filename>", "<mode>")` and returns the stdout of the command, heuristically parsing it to extract the error message if any.
 */
export function compile(code: string, filename: string, mode: 'exec') {
  const tmpFile = tmp.fileSync({ postfix: ".py" });
  fs.writeFileSync(tmpFile.name, `print(compile('''${code}''', "${filename}", "${mode}"))`);
  const output = cp.execSync(`python ${tmpFile.name}`);
  // TODO: Run in a docker container to avoid security issues
  tmpFile.removeCallback();
  const outputStr = output.toString();
  if ( !outputStr ) return;
  const match = outputStr.match(/File "<string>", line \d+\n(.*)/);
  if ( !match ) return;
  return match[1];
};

import path from "path";

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
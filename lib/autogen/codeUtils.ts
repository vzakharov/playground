import path from "path";

export const DEFAULT_MODEL = "gpt-4";
export const FAST_MODEL = "gpt-3.5-turbo";
// Regular expression for finding a code block
export const CODE_BLOCK_PATTERN = /```(\w*)\n(.*?)\n```/;
export const WORKING_DIR = path.join(__dirname, "extensions");
export const UNKNOWN = "unknown";
export const TIMEOUT_MSG = "Timeout";
export const DEFAULT_TIMEOUT = 600;
export const WIN32 = process.platform == "win32";
export const PATH_SEPARATOR = WIN32 ? "\\" : "/";
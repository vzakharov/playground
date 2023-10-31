import tmp from "tmp";
import cp from "child_process";
import fs from "fs";

/**
 * Mimics Python's `compile` function.
 * 
 * @param code - The code to compile.
 * @param _filename - Only present for API compatibility with Python.
 * @param _mode - Only present for API compatibility with Python.
 * 
 * Implementation details: The function effectively creates a new (temporary) .py file and runs `python -m py_compile` on it.
 */
export function compile(code: string, _filename: string, _mode: 'exec') {
  const tmpFile = tmp.fileSync({ postfix: ".py" });
  const output = cp.execSync(`python -m py_compile ${tmpFile.name}`, { input: code });
  tmpFile.removeCallback();
  // If there is a .pyc file, it means the compilation succeeded.
  if (!fs.existsSync(tmpFile.name + "c")) {
    throw new Error(`Failed to compile code: ${output}`);
  }
};

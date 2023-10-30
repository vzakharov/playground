import path from "path";
import fs from "fs";

/**
 * A filter dict with keys corresponding to a field in each config, and values corresponding to lists of acceptable values for each key.
 * e.g.,
 * @example
 * ```ts
 * const filterDict = {
 *   apiType: ['open_ai', null], // null means a missing key is acceptable
 *   model: ['gpt-3.5-turbo', 'gpt-4'],
 * };
 * ```
 */
export type FilterDict = Record<string, (string | null)[]>;

/**
 * Options for {@link configListFromJson}:
 * 
 * @param fileLocation - The file location.
 * @param filterDict - The filter dict (see {@link FilterDict}).
 */
export type ConfigListFromJsonOptions = {
  fileLocation?: string;
  filterDict?: FilterDict;
};

/**
 * A list of configuration items.
 */
export type ConfigList = Record<string, any>[];
// TODO: correct type for configList


/**
 * Get a list of configs from a json parsed from an env variable or a file.
 * 
 * @param envOrFile - The env variable name or file name.
 * @param options - Options (see {@link ConfigListFromJsonOptions})
 * 
 * @returns A list of configs for openai api calls.
 */
export function configListFromJson(
  envOrFile: string,
  { fileLocation = '', filterDict }: ConfigListFromJsonOptions = {}
) {
  const jsonStr = process.env[envOrFile];
  let configList: ConfigList;
  if (jsonStr) {
    configList = JSON.parse(jsonStr);
  } else {
    const configListPath = path.join(fileLocation, envOrFile);
    try {
      configList = JSON.parse(fs.readFileSync(configListPath, 'utf8'));
    } catch (e) {
      console.warn(`The specified config_list file '${configListPath}' does not exist.`);
      return [];
    }
  };
  return filterConfig(configList, filterDict);
};

/**
 * Filter the config list by provider and model.
 * 
 * @param configList - The config list.
 * @param filterDict - The filter dict with keys corresponding to a field in each config, and values corresponding to lists of acceptable values for each key.
 * 
 * @returns The filtered config list.
 */
export function filterConfig(
  configList: ConfigList,
  filterDict?: FilterDict
) {
  if (filterDict) {
    configList = configList.filter(config => 
      Object.entries(filterDict).every(([key, value]) => 
        value.includes(config[key])
      )
    );
  };
  return configList;
};
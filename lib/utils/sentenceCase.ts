import _ from "lodash";

export function sentenceCase(str: string) {
  return _.upperFirst(_.toLower(_.startCase(str)));
};
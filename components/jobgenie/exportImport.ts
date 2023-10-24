import yaml from 'js-yaml';
import { globalData, globalState } from '~/lib/vue-genie';
import { AppData, replaceAppDataWithUknown } from '~/lib/jobgenie';

export function stringifyData(d: AppData = globalData) {
  return yaml.dump(d);
};

export function parseData(jsonStr: string) {
  return yaml.load(jsonStr);
};

export const stringifiedData = computed({
  get: () => stringifyData(),
  set: (jsonStr: string) => importData(jsonStr)
});

export function exportData() {
  const dataStr = stringifyData();
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `jobgenie-${globalData.username}.yaml`; // replace with actual username
  link.click();
  URL.revokeObjectURL(url);
};

export function importData(stringified: string) {
  try {
    const newData = parseData(stringified);
    const { dataLastLoaded } = toRefs(globalState);
    replaceAppDataWithUknown(globalData, newData, dataLastLoaded);
  } catch (e: any) {
    alert(e.message);
  }
};
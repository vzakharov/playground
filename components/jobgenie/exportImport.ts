import yaml from 'js-yaml';
import { AppData, replaceAppDataWithUknown } from '~/lib/jobgenie';
import { data } from './data';
import { dataLastLoaded } from './refs';

export function stringifyData(d: AppData = data) {
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
  link.download = `jobgenie-${data.username}.yaml`; // replace with actual username
  link.click();
  URL.revokeObjectURL(url);
};

export function importData(stringified: string) {
  try {
    const newData = parseData(stringified);
    replaceAppDataWithUknown(data, newData, dataLastLoaded);
  } catch (e: any) {
    alert(e.message);
  }
};
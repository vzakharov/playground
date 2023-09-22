import yaml from 'js-yaml';
import { forEach, is } from 'vovas-utils';
import { data } from './data';
import { AppData, assertAppData, defaultData, setValue } from '~/lib/jobgenie';
import { dataLastLoaded } from './refs';
import { globalState } from "./state";

export function stringifyData() {
  return yaml.dump(data);
};

export function exportData() {
  // const dataStr = JSON.stringify(data, null, 2);
  const dataStr = stringifyData();
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `jobgenie-${data.username}.json`; // replace with actual username
  link.click();
  URL.revokeObjectURL(url);
};

export function importData(jsonStr: string) {
  try {
    // const newData = JSON.parse(jsonStr);
    const newData = yaml.load(jsonStr);
    assertAppData(newData);
    forEach(data, (value, key) => {
      data[key] = is.undefined(newData[key]) ? defaultData[key] : newData[key];
    });
    setValue(dataLastLoaded, Date.now());
  } catch (e: any) {
    alert(e.message);
  }
};
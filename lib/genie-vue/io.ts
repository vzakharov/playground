import yaml from 'js-yaml';
import { Toolset } from '~/lib/genie';
import { morph } from '~/lib/utils';
import { GlobalData, GlobalState, VueGenie } from '.';


export class DataInputOutput {

  static parse = yaml.load;
  static stringify = yaml.dump;

  constructor(
    public filename: string,
    public data: GlobalData<Toolset>,
    public state: GlobalState<Toolset>,
  ) { }

  get stringifiedData() {
    return DataInputOutput.stringify(this.data);
  };

  set stringifiedData(str: string) {
    this.upload(str);
  };

  download() {
    const dataStr = this.stringifiedData;
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.filename}.yaml`; // replace with actual username
    link.click();
    URL.revokeObjectURL(url);
  };

  upload(str: string) {
    try {
      const { data, state } = this;
      const newData = DataInputOutput.parse(str);
      morph(data, newData as object);
      // TODO: Add typeguards to ensure that the data is valid
      state.dataLastLoaded = Date.now();
    } catch (e: any) {
      alert(e.message);
    }
  }

};
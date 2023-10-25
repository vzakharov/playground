import yaml from 'js-yaml';
import { Toolset } from '~/lib/genie';
import { morph } from '~/lib/utils';
import { GlobalData, GlobalState, VueGenie } from '.';


export class DataInputOutput {

  static parse = yaml.load;
  static stringify = yaml.dump;

  constructor(
    public genie: VueGenie<any, GlobalData<Toolset>, GlobalState<Toolset>>
  ) { }

  get stringifiedData() {
    return DataInputOutput.stringify(this.genie.config.globalData);
  };

  set stringifiedData(str: string) {
    this.upload(str);
  };


  download() {
    const { appId, config: { globalData: { username } } } = this.genie;
    const dataStr = this.stringifiedData;
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${appId}-${username}.yaml`; // replace with actual username
    link.click();
    URL.revokeObjectURL(url);
  };

  upload(str: string) {
    try {
      const { globalData, globalState } = this.genie.config;
      const newData = DataInputOutput.parse(str);
      morph(globalData, newData as object);
      // TODO: Add typeguards to ensure that the data is valid
      globalState.dataLastLoaded = Date.now();
    } catch (e: any) {
      alert(e.message);
    }
  }

};
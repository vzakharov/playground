import _ from "lodash";
import { $throw } from "vovas-utils";
import { concat, getDefaultValue, initialize, morph, uniqueId } from "~/lib/utils";
import { GlobalData, GlobalState, VueGenie, getGlobalDataInitializer } from ".";
import { Genie, Toolset } from "~/lib/genie";

export class ProfileManager {

  constructor(
    private appId: string,
    private data: GlobalData<Toolset>,
    private state: GlobalState<Toolset>,
    private defaultData: GlobalData<Toolset>
  ) { };

  prefix = `${this.appId}-data-` as const;

  get slugs() {
    return _.uniq([
      this.data.profileSlug,
      ...Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.slice(this.prefix.length))
    ])
  };

  storageKey(slug: string) {
    return concat(this.prefix, slug);
  };

  load(slug: string, dontSaveCurrentProfile = false) {
    const { data, state } = this;
    if ( !dontSaveCurrentProfile )
      this.save();
    const localValue = localStorage.getItem(this.storageKey(slug))
      ?? $throw(`Profile ${slug} (key ${this.storageKey(slug)}) not found in localStorage`);
    const newData = JSON.parse(localValue);
    morph(data, newData);
    state.dataLastLoaded = Date.now();
    data.profileSlug = slug;
  };

  save() {
    localStorage.setItem(
      this.storageKey(this.data.profileSlug), 
      JSON.stringify(this.data)
    );
  };

  new(slug?: string | null) {
    // If strictly null, return (it means the user cancelled the dialog)
    if ( slug === null ) return;
    this.save();
    morph(this.data, this.defaultData);
    this.state.dataLastLoaded = Date.now();
  };

  delete() {
    localStorage.removeItem(this.storageKey(this.data.profileSlug));
    this.load('default', true);
  };

};
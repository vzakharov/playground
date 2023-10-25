import _ from "lodash";
import { $throw } from "vovas-utils";
import { replaceAppDataWithUnknown, resetAppData } from "~/lib/jobgenie";
import { concat, uniqueId } from "~/lib/utils";
import { GlobalState } from ".";
import { Genie, GlobalData, Toolset } from "~/lib/genie";

export const localProfilesPrefix = 'jobgenie-data-';

export function useProfiles(
  this: Genie<any, GlobalData<Toolset>, GlobalState<Toolset>>
) {

  const { globalData, globalState } = this.config;

  const slugs = computed( () =>
    _.uniq([
      globalData.profileSlug,
      ...Object.keys(localStorage)
        .filter(key => key.startsWith(localProfilesPrefix))
        .map(key => key.slice(localProfilesPrefix.length))
    ])
  );

  const storageKey = (slug: string) => concat(localProfilesPrefix, slug);

  function loadProfile(slug: string, dontSaveCurrentProfile = false) {
    if ( !dontSaveCurrentProfile )
      saveCurrentProfile();
    const localValue = localStorage.getItem(storageKey(slug))
      ?? $throw(`Profile ${slug} (key ${storageKey(slug)}) not found in localStorage`);
    const newData = JSON.parse(localValue);
    const { dataLastLoaded } = toRefs(globalState);
    replaceAppDataWithUnknown(globalData, newData, dataLastLoaded);
    globalData.profileSlug = slug;
  };

  function saveCurrentProfile() {
    localStorage.setItem(
      storageKey(globalData.profileSlug), 
      JSON.stringify(globalData)
    );
  };

  function newProfile(slug?: string | null) {
    // If strictly null, return (it means the user cancelled the dialog)
    if ( slug === null ) return;
    saveCurrentProfile();
    const { dataLastLoaded } = toRefs(globalState);
    resetAppData(globalData, {
      profileSlug: uniqueId(slug || 'profile', slugs.value)
    }, dataLastLoaded);
  }

  function deleteCurrentProfile() {
    localStorage.removeItem(storageKey(globalData.profileSlug));
    loadProfile('default', true);
  };

  return {
    slugs,
    loadProfile,
    saveCurrentProfile,
    newProfile,
    deleteCurrentProfile,
  };

};
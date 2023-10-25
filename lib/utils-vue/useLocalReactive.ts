import { Initializer, assert, findIndex, initialize } from "~/lib/utils";
import _ from "lodash";
import { $if, $try, JsonableObject, either, give, give$, is } from "vovas-utils"

export function useLocalReactive<T extends object>(
  key: string, 
  initializer: Initializer<T>,
  migrators?: readonly Migrator[]
) {

  const localValue = 
    $if(
      $try( () => JSON.parse(localStorage.getItem(key) ?? 'null') ),
      is.jsonableObject,
      give.itself
    )
    .else( give$({} as JsonableObject) );
  
  if ( migrators ) {
    const { version } = localValue;
    assert( version, either( is.undefined, is.string ) );
    if ( version != migrators.at(-1)?.version ) {
      migrate( localValue, migrators, version );
    };
  };

  const value = reactive(
    initialize( localValue, initializer )
  );

  watch( value, () => localStorage.setItem(key, JSON.stringify(value)), { immediate: true } );

  return value as T;
  
};

export type Migrator = {
  version: string;
  migrate: (value: any) => void;
};

export function migrate(
  value: JsonableObject,
  migrators: readonly Migrator[],
  migrateFrom?: string,
  migrateTo?: string
) {
  const currentIndex = 
    migrateFrom 
      ? findIndex(migrators, { version: migrateFrom })
      : -1;
  if ( currentIndex === undefined ) {
    throw new Error(`Unknown migration version to migrate from: ${migrateFrom}`);
  };
  const lastMigratorIndex =
    migrateTo
      ? findIndex(migrators, { version: migrateTo })
      : migrators.length - 1;
  if ( lastMigratorIndex === undefined ) {
    throw new Error(`Unknown migration version to migrate to: ${migrateTo}`);
  };
  if ( currentIndex >= lastMigratorIndex ) {
    console.debug(`No migrations to run from ${migrateFrom} to ${migrateTo}`);
    return;
  };
  const migratorIndex = currentIndex + 1;
  const migrator = migrators[migratorIndex];
  migrator.migrate(value);
  value.version = migrator.version;
  console.debug(`Migrated from ${migrateFrom} to ${migrator.version}`);
  migrate(value, migrators, migrator.version, migrateTo);
};
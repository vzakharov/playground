#!/bin/bash

# Directories to sync
if [ "$3" == "-back" ]; then
    originalFolder=$2
    duplicateFolder=$1
else
    originalFolder=$1
    duplicateFolder=$2
fi

# If -toMjsImports, set a flag
if [ "$3" == "-toMjsImports" ]; then
    toMjsImports=true
fi


# Check if directories are provided
if [ -z "$originalFolder" ] || [ -z "$duplicateFolder" ]; then
    echo "Usage: ./sync.sh <original_folder> <duplicate_folder>"
    exit 1
fi

# Check if rsync is installed
if ! command -v rsync &> /dev/null; then
    echo "rsync could not be found. Installing..."
    brew install rsync
fi

# Check if fswatch is installed
if ! command -v fswatch &> /dev/null; then
    echo "fswatch could not be found. Installing..."
    brew install fswatch
fi

# Function to sync directories
function syncFolders {
    rsync -av --delete $originalFolder/ $duplicateFolder/

    # If -toMjsImports, convert all `import * as x from 'y'`, if followed by `//@sync-convert`, to `import x from 'y'`, in all .ts files in all nested folders
    if [ "$toMjsImports" = true ]; then
        find $duplicateFolder -type f -name '*.ts' -exec sed -i '' -e 's/import \* as \(.*\) from \(.*\); \/\/@sync-convert/import \1 from \2;/g' {} \;
    fi

}

# Initial sync
syncFolders

# Watch for changes and sync
fswatch -o $originalFolder | while read f; do syncFolders; done
#!/bin/bash

# Directories to sync
if [ "$3" == "-back" ]; then
    originalFolder=$2
    duplicateFolder=$1
else
    originalFolder=$1
    duplicateFolder=$2
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
}

# Initial sync
syncFolders

# Watch for changes and sync
fswatch -o $originalFolder | while read f; do syncFolders; done
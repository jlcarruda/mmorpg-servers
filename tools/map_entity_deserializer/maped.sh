#!/bin/bash

VAR1="$1"

if [ -z "$VAR1" ]
then
  VAR1=./examples/rm_starting_town.yy
fi

FILENAME=$(node ./convert_map.js -rf "$VAR1")
node ./read_deserialized.js $FILENAME

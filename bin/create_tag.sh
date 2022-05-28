#!/bin/zsh

cd `dirname $0`

VERSION_STRING=$(cat ../manifest.json | jq '.version'| sed -e 's/"//g')
VERSION="v$VERSION_STRING"

echo $VERSION

git tag $VERSION
git push origin $VERSION

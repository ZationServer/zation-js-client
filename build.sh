#!/bin/sh

SDK_VERSION=$(cat package.json | sed -n -e '/version/ s/.*: *"\([^"]*\).*/\1/p')
echo "Building Zation Client v$SDK_VERSION...\n"
echo "Cleaning old builds...\n"
rm -rf zation.js zation.min.js
echo "Zation-Client:"
gulp browserify
gulp minify
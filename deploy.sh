#!/bin/bash
set -e

echo "Building"
parcel build index.html
echo "Going to gh-pages branch"
git checkout gh-pages
mv dist/index.html .
git push
git checkout -
echo "Done"

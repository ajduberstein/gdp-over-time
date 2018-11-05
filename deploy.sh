#!/bin/bash
set -e

parcel build index.html
git checkout gh-pages
mv dist/* .
rmdir dist
git push
git checkout -

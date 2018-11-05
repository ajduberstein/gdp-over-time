#!/bin/bash
set -e

parcel --public-url https://duberste.in/gdp-over-time/ build index.html
git checkout gh-pages
mv dist/index.html .
git push
git checkout -

#!/bin/bash
set -e

echo "Building"
parcel build --public-url https://duberste.in/gdp-over-time/ index.html
echo "Going to gh-pages branch"
git checkout gh-pages
rm -f *.js *.css *.html
mv dist/* .
rmdir dist
mv us.*.{jsonx,json}
sed -i '' 's/.jsonx/.json/g' vis.*.js
git push
git checkout -
git commit -am "Bump release"
git push
git checkout -
echo "Done"

# The Great Awakening

Campaign log and diary for local D&D group. `master` branch contains theme and source files, `gh-pages` contains generated and deployed site.

## How to contribute 
Clone repo. Optionally run `npm run install-cli` to install global Hexo CLI but you can always generate new pages without CLI, just create new directory and `index.md` under `/source`. Run `npm run start` to start local server and then create or edit markdown files. Server watches for changes, you just need to reload site. When you want to deploy, run `npm run deploy` from master branch. Master branch is protected, please create new branch and create pull request to get changes merged into master.

## Some notes on organization
Hexo recognizes different page layouts but we are using only pages. Those describe towns, events, characters or any similar piece of knowledge. They can also be used for index pages (lists of other pages) or anything else you might want to post on wiki.
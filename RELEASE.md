
# Instructions for the Maintainer

**********************
## PREPARING A RELEASE - first steps, command line
**********************

### 1. Switch to / create the <rel-4.x.x> branch

`git checkout -b rel-4.x.x`

### 2. Run basic npm security checks;

`npm audit fix`

### 3. update version

* src/js/core/mejs.js:mejs.version = '4.x.x';
* package.js: version: '4.x.x',
* package-lock.json: "version": "4.x.x",
* package.json: "version": "4.x.x",

### 4. check with shell command;
`egrep "version:|mejs.version =" package.js src/js/core/mejs.js`

`head -4 package*.json | grep version`

### 5. Update changelog.md

### 6. Build release;

`grunt`

### 7. check that mejs.version has been updated sucessfully below build/

`grep mejs.version build/* -r`

### 8. add/commit all including build/

`git add --all`

`git commit -am "release 4.x.x`

### 9. carefully, interractivelly rebase, allowing  "reword"ing commits for cleaner git log

`git rebase -i master`

### 10. git push


**********************
# PREPARING A RELEASE - second step on github.com
**********************

* prepare a new release using changelog.md

**********************
# PREPARING A RELEASE - third step on npmjs.com
**********************

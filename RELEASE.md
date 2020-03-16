
Instructions for the Maintainer

**********************
 PREPARING A RELEASE - first steps, command line
**********************

- Create a dedicated branch for the release;

  git checkout master
  git checkout -b release_4.X.X

- Run basic npm security checks;

  npm audit fix

- update version

  src/js/core/mejs.js:mejs.version = '4.x.x';
  package.js: version: '4.x.x',
  package-lock.json: "version": "4.x.x",
  package.json: "version": "4.x.x",

- check with shell command;

  egrep "version:|mejs.version =" package.js src/js/core/mejs.js
  head -4 package*.json | grep version


- Update changelog.md

- Build release;

  grunt

- check that mejs.version has been updated sucessfully below build/

  grep mejs.version build/* -r

- add/commit/push all including build/

  git add --all
  git commit -am "release 4.X.X"
  git push


**********************
 PREPARING A RELEASE - second step on github.com
**********************

- prepare a new release using changelog.md

**********************
 PREPARING A RELEASE - third step on npmjs.com
**********************

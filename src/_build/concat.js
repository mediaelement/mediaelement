const path = require('path');
const fs = require('fs');
const concat = require('concat');

const baseFilename = 'imediaelement.js';
const components = [
  
];

let filename = baseFilename;
let prepend = '(function ($) {';
let append = '\njQuery.fn.extend(cellular);\n})(jQuery);';

const distPath = path.join(__dirname, '..', 'js', filename);
const format = ()=> {
if (drupal === true || 'd9') {
  filename = `drupal9${filename}`;  
  prepend =
    '(function ($, Drupal, once) {\nDrupal.behaviors.cellular = {\nattach: function (context, settings) {\n';
  append = '},\n\n};\n})(jQuery, Drupal, once);';
  /* // Drupal 9
  (function ($, Drupal, once) {
    Drupal.behaviors.cellular = {
      attach: function (context, settings) {
        once('myCustomBehavior', 'input.myCustomBehavior', context).forEach(
          function (element) {
            // Apply the myCustomBehaviour effect to the elements only once.
          },
        );
      },
    };
  })(jQuery, Drupal, once); 
  */
}
if (drupal === 'd7') {
  filename = `drupal9${filename}`;
  prepend = prepend +
    '\nDrupal.behaviors.cellular = {\nattach: function (context, settings) {\n';
  append = '\n //Drupal.behaviors.cellular \n}\n}' + append;

  /* // Drupal7
(function ($) {
  Drupal.behaviors.myModuleBehavior = {
    attach: function (context, settings) {
     $('input.myCustomBehavior', context).once('myCustomBehavior', function () {
      // Apply the myCustomBehaviour effect to the elements only once.
    });
    }
  };
})(jQuery);
  */
}
}

const componentPath = components.map((name) => {
  name = `cellular.${name}.js`;
  return path.resolve('src', 'js', 'components', 'cellular-ui', name);
});

const read = (fName) =>
  new Promise((res, rej) => {
    fs.readFile(path.resolve(fName), (err, str) => {
      if (err) rej(err);
      res(str);
    });
  });

const write = (fName, str) =>
  new Promise((res, rej) => {
    fs.writeFile(path.resolve(fName), str, (err) => {
      if (err) return rej(err);
      return res(str);
    });
  });

concat(componentPath).then((result) => {
  const output = `${prepend}\n${result}\n${append}`;
  write(distPath, output);
});

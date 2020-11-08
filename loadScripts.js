'use strict';

//wait for page to load
window.onload = function() {
  //create array of script filenames
  var scripts = [
    "style.js",
    "lissagen.js"
  ];

  //get head element
  var headElement = document.querySelector("head");

  //define function to recursively load scripts
  var injectScripts = function() {
    if (scripts.length > 0) {
      var scriptToLoad = scripts.shift();

      //create new script element, assign source, append to page
      var newScriptElement = document.createElement("script");
      newScriptElement.src = scriptToLoad;
      headElement.appendChild(newScriptElement);

      //inject next script when current script loaded
      newScriptElement.onload = function() {
        injectScripts();
      };
    } else {
      return;
    }
  }
  injectScripts();
};

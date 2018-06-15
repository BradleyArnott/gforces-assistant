// require V10 scripts default ones jquery and script loader
nd.auto.require(['jquery', 'externalScriptsLoader'], function($, externalScriptsLoader) {
    // uncomment the below to import a external script
    // externalScriptsLoader.loadScriptAfterAllRequireScripts('SCRIPT_SRC');
    // check we are not in the editor before running anything
    if ($('[href*="/templateEditor.css"]').length === 0) {
        var scriptName = 'SCRIPT_NAME'
        console.log('CSS - ' + scriptName);
        // START YOUR CODE HERE
    }
});
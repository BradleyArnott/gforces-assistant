module.exports = {
    "extends": "airbnb-base",
    "env": {
        "browser": true,
        "node": true,
        "jquery": true
    },
    "rules": {
       "linebreak-style": ["error", "windows"],
       "indent": ["error", 4],
       "no-console": "off",
       "no-param-reassign": [2, { "props": false }]
    },
    "globals": {
        "V10settings": false,
        "moment": false,
        "chrome": false
    }
};
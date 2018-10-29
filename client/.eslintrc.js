module.exports = {
    extends: [
        "standard",
        "plugin:vue/recommended"
    ],

    env: {
        browser: true,
        es6: true,
        node: true
    },

    "plugins": [
        'vue'
    ],
    
    "parserOptions": {
        "parser": "babel-eslint"
    },
};
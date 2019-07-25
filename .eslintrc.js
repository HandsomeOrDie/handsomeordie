module.exports = {
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
      "indent": ["error", 4],
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "no-unused-vars": "off",
      "no-unreachable": "off",
      "no-console": ["error", { "allow": ["error","log"] }],
      "no-class-assign": 0
    },
    "globals": {
      "Ext": false,
      "Qit": false,
      "react": false,
      "atmosphere": false,
      "test": false,
      "process": false,
      "date": false,
      "lindex": false,
      "__dirname": false,
      "it": false
    }
}
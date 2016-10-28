module.exports = {
    "extends": "airbnb",
    "installedESLint": true,

    "env": {
        "browser": true
    },
    "plugins": [
        "react"
    ],
    "settings": {
        "react": {
            "pragma": "React", // Pragma to use, default to "React"
            "version": "15.0" // React version, default to the latest React stable release
        }
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        }
    },

    "rules": {
        "space-before-function-paren": ["error", {
            "anonymous": "never",
            "named": "never"
        }],
        // "semi": ["error", "always"],
        // "react/jsx-uses-react": "error",
        // "react/jsx-uses-vars": "error",
        "padded-blocks": ["warn"],

        "import/no-unresolved": ["error", {
            ignore: ['widget']
        }],

        "no-param-reassign": "off",
        "eqeqeq": ["warn"],

        "no-restricted-syntax": ["error", "WithStatement"],
        "arrow-body-style": "off",

        // 对象key引号
        "quote-props": ["warn", "consistent"],
        "global-require": "off",
        // 末尾逗号
        "comma-dangle": "off",

        "no-unused-vars": ["warn"],

        "prefer-template": "off",
    },
    "globals": {
        "require": true,
        "React": true,
        "$": true,

    }
};

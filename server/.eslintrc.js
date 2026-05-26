module.exports = {
    root: true,
    env: {
        node: true,
        jest: true,
        es6: true
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    extends: "eslint:recommended",
    rules: {
        'no-console':
            process.env.NODE_ENV === 'production'
                ? ['error', { allow: ['warn', 'error'] }]
                : ['warn', { allow: ['warn', 'error'] }],
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'space-before-function-paren': ['error', 'never'],
        'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        indent: ["error", 2],
        quotes: ["error", "single"],
        semi: ["error", "never"]
    }
};
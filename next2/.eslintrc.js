module.exports = {
  root: true,

  env: {
    node: true,
    browser: true,
    jasmine: true
  },

  extends: ['eslint:recommended', 'plugin:react/recommended', 'eslint-config-prettier'],

  parser: '@typescript-eslint/parser', // Specifies the ESLint parser

  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },

  plugins: [
    'import',
    '@typescript-eslint',
    'unused-imports', // this automatically removes unused imports
    '@typescript-eslint/tslint',
    'react',
    'react-hooks'
  ],

  settings: {
    react: {
      createClass: 'createReactClass', // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: 'React', // Pragma to use, default to "React"
      fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to "detect" in the future
      flowVersion: '0.53' // Flow version
    },
    propWrapperFunctions: [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      'forbidExtraProps',
      { property: 'freeze', object: 'Object' },
      { property: 'myFavoriteWrapper' }
    ],
    componentWrapperFunctions: [
      // The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
      'observer', // `property`
      { property: 'styled' }, // `object` is optional
      { property: 'observer', object: 'Mobx' },
      { property: 'observer', object: '<pragma>' } // sets `object` to whatever value `settings.react.pragma` is set to
    ],
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      'Hyperlink',
      { name: 'Link', linkAttribute: 'to' }
    ]
  },

  rules: {
    'no-extra-semi': 'warn',
    'no-useless-constructor': 'off',
    '@typescript-eslint/member-ordering': [
      'warn',
      {
        default: {
          order: 'alphabetically',
          memberTypes: [
            // Index signature
            'signature',

            // Fields
            'public-static-field',
            'private-static-field',
            'public-decorated-field',
            'private-decorated-field',
            'public-instance-field',
            'private-instance-field',
            'public-abstract-field',
            'private-abstract-field',

            // Constructors
            'protected-constructor',
            'public-constructor',
            'private-constructor',
            'protected-instance-field',
            'protected-abstract-field',
            'protected-decorated-field',
            'protected-static-field',

            // Methods
            'protected-static-method',
            'public-static-method',
            'private-static-method',
            'protected-decorated-method',
            'public-decorated-method',
            'private-decorated-method',
            'protected-instance-method',
            'public-instance-method',
            'private-instance-method',
            'protected-abstract-method',
            'public-abstract-method',
            'private-abstract-method'
          ]
        }
      }
    ],
    'space-before-blocks': [
      1,
      {
        functions: 'always',
        keywords: 'always',
        classes: 'always'
      }
    ],
    'lines-around-comment': [
      'warn',
      {
        beforeBlockComment: true,
        beforeLineComment: true,
        afterLineComment: false,
        allowBlockStart: true,
        allowBlockEnd: true,
        allowClassStart: true,
        allowClassEnd: true,
        allowArrayStart: true,
        allowArrayEnd: true,
        allowObjectStart: true,
        allowObjectEnd: true,
        ignorePattern: 'eslint-enable',
        applyDefaultIgnorePatterns: false // also check comments with "eslint" in it
      }
    ],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
    'no-multi-spaces': [
      'error',
      {
        exceptions: { Property: true }
      }
    ],

    'unused-imports/no-unused-imports-ts': 'warn',
    'no-unused-vars': 'off',
    'space-before-function-paren': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-vars-ts': [
      'warn',
      {
        vars: 'all'
        // varsIgnorePattern: "^_",
        // args: "after-used",
        // argsIgnorePattern: "^_"
      }
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variableLike', // matches the same as `variable`, `function` and `parameter`
        format: ['StrictPascalCase', 'strictCamelCase'], // required as an empty array if using custom regex
        // "custom": {
        //     "regex": "^(([a-z][a-z0-9]*)((\\d)|([A-Z0-9][a-z0-9]+)*([A-Z])?)|([a-z])|(^[A-Z]+(?:_[A-Z]+)*$))(\\$?)$", /* this checks for camelCaseVars that allow multiple humps i.e. capitals in the middle, but not consecutively, for UPPER_CASE_VARS, a single a-z lowercase var, any set of letters only
        //        (abcdef) and also alphanumeric (mixed123Like567This), allow trailing $ for observables*/
        //     "match": true
        // },
        leadingUnderscore: 'allow'
      },
      {
        selector: 'memberLike',
        format: ['strictCamelCase', 'StrictPascalCase', 'snake_case'], // required as an empty array if using custom regex
        // "custom": {
        //     "regex": "^(([a-z][a-z0-9]*)((\\d)|([A-Z0-9][a-z0-9]+)*([A-Z])?)|([a-z])|(\\d*))(\\$?)$", /* this check for a camelCaseConst that allows multiple humps i.e. capitals in the middle, but not consecutively, and also any set of numbers only (22334455) or any set of letters only (abcdef) and also
        //     alphanumeric (mixed123Like567This), allow trailing $ for observables*/
        //     "match": true
        // },
        leadingUnderscore: 'allow'
      },
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['strictCamelCase'], // required as an empty array if using custom regex
        // "custom": {
        //     "regex": "^(([a-z][a-z0-9]*)((\\d)|([A-Z0-9][a-z0-9]+)*([A-Z])?))(\\$?)$", /* this check for a camelCaseConst that allows multiple humps i.e. capitals in the middle, but not consecutively, or any set of letters only (abcdef) and also alphanumeric (mixed123Like567This), allow trailing $ for observables*/
        //     "match": true
        // },
        leadingUnderscore: 'allow'
      },
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['StrictPascalCase'], // required as an empty array if using custom regex
        // "custom": {
        //     "regex": "^(([A-Z][a-z0-9]*)((\\d)|([A-Z0-9][a-z0-9]+)*([A-Z])?))(\\$?)$", /* this check for a PascalCaseConst that allows multiple humps because the prefix is prepended to the march i.e. "has" + "NoData" = hasNoData. Checks for capitals in the middle, but not consecutively, or any set of letters only (abcdef) and also alphanumeric (mixed123Like567This), allow trailing $ for observables*/
        //     "match": true
        // },
        prefix: ['is', 'should', 'has', 'can', 'did', 'does', 'do', 'will'],
        leadingUnderscore: 'allow'
      },
      {
        selector: 'enumMember',
        format: ['PascalCase']
      },
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
        prefix: ['T']
      },
      {
        selector: 'class',
        format: ['PascalCase']
      },
      {
        selector: 'typeLike',
        format: ['PascalCase']
      }
    ],
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/dot-notation': 'off',
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true
      }
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'off',
      {
        accessibility: 'explicit'
      }
    ],
    semi: 'off', // note you must disable the base rule as it can report incorrect errors
    '@typescript-eslint/semi': ['error', 'always'],
    indent: 'off', // note you must disable the base rule as it can report incorrect errors
    '@typescript-eslint/indent': ['error', 2, { SwitchCase: 1 }],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false
        }
      }
    ],
    '@typescript-eslint/member-ordering': 'warn',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'warn',
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-inferrable-types': 'warn',
    '@typescript-eslint/no-misused-new': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-unused-expressions': 'warn',
    '@typescript-eslint/no-use-before-define': 'warn',
    '@typescript-eslint/prefer-function-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/quotes': ['warn', 'single'],

    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/unified-signatures': 'error',
    'arrow-body-style': ['warn', 'as-needed'],
    'brace-style': ['error', '1tbs'],
    camelcase: 'off',
    'constructor-super': 'error',
    curly: 'error',
    'eol-last': 'error',
    eqeqeq: ['error', 'smart'],
    'guard-for-in': 'error',
    'id-blacklist': 'off',
    'id-match': 'off',
    'import/no-deprecated': 'warn',
    'key-spacing': [
      'warn',
      {
        singleLine: {
          beforeColon: false,
          afterColon: true
        },
        align: {
          beforeColon: false,
          afterColon: true,
          on: 'value'
        }
      }
    ],
    'lines-between-class-members': ['error', 'always'],
    'max-classes-per-file': ['error', 20], // reduce this to a low number such as 2 after refactoring search-types.ts - NPK
    'max-len': [
      'error',
      {
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true,
        code: 3000
      }
    ],
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? ['error', { allow: ['warn', 'error'] }] : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-empty': 'off',
    'no-eval': 'error',
    'no-fallthrough': ['error', { commentPattern: 'fall[\\s\\w]*through' }],
    'no-new-wrappers': 'error',
    'no-restricted-imports': ['error', 'rxjs/Rx'],
    'no-restricted-syntax': 0,
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': [
      'off'
      // {
      //     "hoist": "all"
      // }
    ],
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'warn',
    'no-undef-init': 'error',
    'no-underscore-dangle': 'off',
    'no-unused-labels': 'error',
    'no-var': 'error',
    'object-curly-spacing': [2, 'always'],
    'padding-line-between-statements': [
      // This controls empty lines between blocks and more
      'error',

      // Empty Line BEFORE
      {
        blankLine: 'always',
        prev: '*',
        next: ['block', 'block-like', 'class', 'continue', 'default', 'debugger', 'case', 'export', 'do', 'while', 'if', 'for', 'function', 'return', 'try', 'with']
      },

      // Empty Line AFTER
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var', 'block', 'block-like', 'class', 'continue', 'debugger', 'case', 'do', 'while', 'if', 'for', 'function', 'return', 'try', 'with'],
        next: '*'
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var']
      }
    ],
    'padded-blocks': ['warn', 'never'],
    'prefer-const': 'warn',
    radix: 'error',
    // "selector-pseudo-element-no-unknown": [true, { "ignorePseudoElements": ["/^ng-deep/", "custom-element"] }],
    'keyword-spacing': [
      2,
      {
        before: true,
        after: true,
        overrides: {}
      }
    ],
    'spaced-comment': [
      'error',
      'always',
      {
        markers: ['/']
      }
    ],

    '@typescript-eslint/tslint/config': [
      'warn',
      {
        rules: {
          whitespace: [
            true,
            'check-branch',
            'check-decl',
            'check-operator',
            'check-module',
            'check-separator',
            'check-rest-spread',
            'check-type',
            'check-typecast',
            'check-type-operator',
            'check-preblock'
            // "check-postbrace"
          ]
        }
      }
    ]
  },

  overrides: [
    {
      files: [
        '*.ts',
        '*.tsx', // Your TypeScript files extension,
        '**/__tests__/*.{j,t}s?(x)',
        '**/*.{spec,test}.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    },

    {
      // Enable eslint-plugin-testing-library rules or preset only for matching files
      files: ['**/?(*.)+(test).{j,t}s?(x)', '**/mocks/**'],
      plugins: ['testing-library'],
      extends: ['plugin:testing-library/react'],
      rules: {
        // TODO: Get this working, throwing error " Definition for rule 'testing-library/no-wait-for-multiple-assertions' was not found  testing-library/no-wait-for-multiple-assertions"
        // "testing-library/no-wait-for-multiple-assertions": "error"
      }
    }
  ]
};

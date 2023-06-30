const sortOrderSmacss = require('stylelint-config-property-sort-order-smacss/generate');
const camelCaseRegex = "([a-z][a-z0-9]+)((d)|([A-Z0-9][a-z0-9]+))*([A-Z])?"; // This check for a camelCaseConst that allows multiple humps i.e. capitals in the middle, but not
// consecutively

module.exports = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-sass-guidelines'
        // "stylelint-config-property-sort-order-smacss"
    ],
    plugins: [
        'stylelint-scss'
        // "stylelint-order"
    ],
    ignoreFiles: [
        "build/**/*.*",
        "coverage/**/*.*",
        "examples/**/*.*"
    ],
    rules: {
        'no-descending-specificity': null, // TODO: There are many classes that follow descending specificity - they need to be reorganized to follow ascending specificity as CSS was intended.
        'selector-max-id': 2,
        indentation: 2,
        'no-empty-source': null, // allow empty stylesheets to stick with convention
        'selector-type-no-unknown': null, // allow custom Angular elements
        'max-empty-lines': 1,
        'at-rule-semicolon-newline-after': 'always',
        'selector-no-qualifying-type': null, // use `null` to override a `true` from the extended configs
        'selector-pseudo-element-no-unknown': [
            true,
            {
                ignorePseudoElements: ['ng-deep']
            }
        ],
        'number-leading-zero': null,
        'max-nesting-depth': 10, // This is way too high but will take a lot of work to refactor the SCSS
        'selector-max-compound-selectors': 10, // This is way too high but will take a lot of work to refactor the SCSS

        // "declaration-block-no-redundant-longhand-properties": true,
        'declaration-block-no-duplicate-properties': true,
        'declaration-block-semicolon-space-before': 'never',
        'declaration-colon-space-before': 'never',
        'declaration-colon-space-after': 'always',

        // "order/order": [
        //     // The order here is the order the properties will be sorted in based on the match

        //     // Custom properties (e. g., --property: 10px;)
        //     "custom-properties",

        //     // Dollar variables (e. g., $variable)
        //     "dollar-variables",

        //     {
        //         // SCSS Includes (e. g., @include();)
        //         type: "at-rule",
        //         name: "include"
        //     },

        //     // CSS declarations (e. g., display: block;)
        //     "declarations",

        //     {
        //         // "Pseudo-elements",
        //         type: "rule",
        //         selector: "/^&::[\\w-]+$/"
        //     },

        //     // Nested rules (e. g., a { span {} })
        //     "rules",

        //     {
        //         // Nested @media (e. g., div { @media () {} })
        //         type: "at-rule",
        //         name: "media"
        //     }
        // ],

        // 'order/properties-order': [
        //     sortOrderSmacss() // Stylelint config for Property Sort Ordering based on the SMACSS methodology.
        // ],
        /* Rule: @else is on the same line as the preceding @if/@else's }, space between them. Empty line before all at-rules (except @else), space before {, newline after all }
         except @if's and @else's. */
        'at-rule-empty-line-before': [
            'always',
            {
                ignoreAtRules: ['else', 'include', 'import']
            }
        ],
        'block-opening-brace-space-before': 'always',
        'block-closing-brace-newline-after': [
            'always',
            {
                ignoreAtRules: ['if', 'else']
            }
        ],
        'at-rule-name-space-after': 'always',
        'declaration-empty-line-before': [
            'never',
            {
                except: [],
                ignore: []
            }
        ],
        'rule-empty-line-before': [
            'always',
            {
                except: ['after-single-line-comment'],
                ignore: [
                    // "after-comment",
                    'first-nested'
                ]
            }
        ],
        'comment-empty-line-before': [
            'always',
            {
                except: [
                    // "first-nested"
                ],
                ignore: ['after-comment', 'stylelint-commands']
            }
        ],

        'scss/at-else-closing-brace-newline-after': 'always-last-in-chain',
        'scss/at-else-closing-brace-space-after': 'always-intermediate',
        'scss/at-else-empty-line-before': 'never',
        'scss/at-if-closing-brace-newline-after': 'always-last-in-chain',
        'scss/at-if-closing-brace-space-after': 'always-intermediate',
        /* End @if/@else styling rules */

        'scss/selector-no-redundant-nesting-selector': true,
        'scss/double-slash-comment-empty-line-before': [
            'always',
            {
                except: ['first-nested'],
                ignore: ['between-comments']
            }
        ],
        'scss/at-mixin-pattern': camelCaseRegex,
        // "scss/dollar-variable-default": true,
        'scss/dollar-variable-colon-space-after': 'at-least-one-space',
        'scss/dollar-variable-colon-space-before': 'never',
        'scss/dollar-variable-colon-space-after': 'always',
        'scss/dollar-variable-pattern': camelCaseRegex,
        'scss/at-extend-no-missing-placeholder': null
    }
};


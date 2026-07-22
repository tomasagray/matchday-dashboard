import {defineConfig} from "eslint/config";
import {fixupConfigRules, fixupPluginRules} from "@eslint/compat";
import {FlatCompat} from "@eslint/eslintrc";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import globals from "globals";
import vitest from '@vitest/eslint-plugin';
import path from "node:path";
import {fileURLToPath} from "node:url";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:testing-library/react",
        "plugin:jest-dom/recommended",
    )),

    plugins: {
        react: fixupPluginRules(react),
        "react-hooks": fixupPluginRules(reactHooks),
        "jsx-a11y": fixupPluginRules(jsxA11Y),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
    },
}, {
    files: [
        "**/__tests__/**/*.{js,jsx,ts,tsx}",
        "**/*.{test,spec}.{js,jsx,ts,tsx}",
    ],

    plugins: {
        vitest,
    },

    rules: {
        ...vitest.configs.recommended.rules,
    },

    languageOptions: {
        globals: {
            ...vitest.environments.env.globals,
        },
    },
}]);
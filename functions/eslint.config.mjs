import js from '@eslint/js';
import {defineConfig, globalIgnores} from 'eslint/config';
import google from 'eslint-config-google';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

// eslint-config-google still enables these JSDoc rules, which ESLint 9 removed.
const googleRules = {...google.rules};
delete googleRules['valid-jsdoc'];
delete googleRules['require-jsdoc'];

export default defineConfig(
  globalIgnores(['lib/', 'generated/']),
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {rules: googleRules},
  tseslint.configs.recommended,
  {
    rules: {
      'quotes': ['error', 'single'],
      'import/no-unresolved': 'off',
      'indent': ['error', 2],
      // Git checks out CRLF on Windows and normalises to LF on commit.
      'linebreak-style': 'off',
    },
  },
);

// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigDirName: import.meta.dirname,
            },
        },
        rules: {
            semi: 'error',
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'default',
                    format: ['camelCase'],
                },
                {
                    selector: 'import',
                    format: null,
                },
                {
                    selector: 'variable',
                    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                },
                {
                    selector: ['function', 'objectLiteralMethod'],
                    format: ['camelCase', 'PascalCase'],
                },
                {
                    selector: 'typeLike',
                    format: ['PascalCase'],
                },
                {
                    selector: 'enumMember',
                    format: ['UPPER_CASE'],
                },
                {
                    selector: 'parameter',
                    format: ['camelCase', 'PascalCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'property',
                    format: [
                        'camelCase',
                        'snake_case',
                        'UPPER_CASE',
                        'PascalCase',
                    ],
                    leadingUnderscore: 'allowSingleOrDouble',
                    trailingUnderscore: 'allowSingleOrDouble',
                },
            ],
        },
    },
);

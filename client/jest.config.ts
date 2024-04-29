import type { Config } from 'jest';
import { defaults } from 'jest-config';

const config: Config = {
    preset: 'ts-jest',
    automock: false,
    resetMocks: false,
    setupFiles: ['./jest.polyfills.js'],
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
    moduleDirectories: ['node_modules', 'test', __dirname],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironmentOptions: {
        customExportConditions: [''],
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                diagnostics: {
                    ignoreCodes: [1343],
                },
                astTransformers: {
                    before: [
                        {
                            path: 'node_modules/ts-jest-mock-import-meta',
                            options: {
                                metaObjectReplacement: {
                                    env: {
                                        VITE_API_PATH: 'http://localhost:9080',
                                        VITE_USER_ID_COOKIES_NAME:
                                            'todo_list_user_id',
                                    },
                                },
                            },
                        },
                    ],
                },
            },
        ],
    },
};

export default config;

import type { Config } from 'jest';
import { defaults } from 'jest-config';

const config: Config = {
    preset: 'ts-jest',
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
    moduleDirectories: ['node_modules', 'test', __dirname],
};

export default config;
import { strictEqual } from "assert";
import * as child_process from "child_process";
import { platform } from "os";
import * as path from "path";
import { repoPath } from "../../utils/config";


const settingGenerationFailed = "setting generation failed.";
const generationNotSupported = "setting generation only support linux platform.";

export function resetFixture() {
    const generationScript = path.resolve(__dirname, '../../test-fixtures/generate-fixtures.sh');
    if (platform() === 'linux') {
        child_process.exec(generationScript);
    } else {
        throw generationNotSupported;
    }
}

export function stringArrayStrictEqual(actual: Array<string>, expected: Array<string>) {
    strictEqual(actual.length, expected.length);
    for (let i=0; i<expected.length; i++) {
        strictEqual(actual[i], expected[i]);
    }
}

export function toRepoPath(relativePath: Array<string>) {
    return relativePath.map(realtivePath => path.join(repoPath(), realtivePath)).sort();
}


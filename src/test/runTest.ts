import { runTests } from '@vscode/test-electron';
import { exec } from 'child_process';
import * as os from "os";
import * as path from 'path';

const settingGenerationFailed = "setting generation failed.";
const generationNotSupported = "setting generation only support linux platform.";

export function generateFixtureSettings() {
	const generationScript = path.resolve(__dirname, '../../test-fixtures/generate-fixtures.sh');
	if (os.platform() === 'linux') {
		exec(generationScript, (err, stdout, stderr) => {
			if (err) {
				throw settingGenerationFailed;
			}
		});
	} else {
		throw generationNotSupported;
	}
}


async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');

		// The path to test runner
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		// The path to test workspace
		const testWorkspace = path.resolve(__dirname, '../../test-fixtures/workspace');

		// Download VS Code, unzip it and run the integration test
		await runTests({ extensionDevelopmentPath, extensionTestsPath, launchArgs: [testWorkspace] });
	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();

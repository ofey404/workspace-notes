install:
	yes | vsce package
	code --install-extension workspace-notes-*.vsix 

test:
	npm run test

.PHONY: install test
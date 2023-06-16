const vscode = require('vscode');

function activate(context) {

	let disposable = vscode.commands.registerCommand('magic-notes.open', function () {

		vscode.window.showInformationMessage('Hello World from Magic Notes!');
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}

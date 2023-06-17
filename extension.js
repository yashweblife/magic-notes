const vscode = require('vscode');
const fs = require("fs");
const path = require('path');

function getLocalData() {
	const t = vscode.workspace.workspaceFolders;
	try {
		const p = path.join(t[0].uri.fsPath, "/.vscode/magicNotes.json");
		const f = fs.readFileSync(p, 'utf-8')
		const data = JSON.parse(f)
		return (data);
	}
	catch (err) {
		return (false);
	}

}
function checkIfDataExists() {
	const t = vscode.workspace.workspaceFolders;
	try {
		const p = path.join(t[0].uri.fsPath, "/.vscode/magicNotes.json");
		const f = fs.readFileSync(p, 'utf-8')
		return (true)
	}
	catch (err) {
		return (false);
	}
}
function setupCode() {
	const t = vscode.workspace.workspaceFolders;
	const dir = path.join(t[0].uri.fsPath, "/.vscode/");
	try {
		fs.mkdirSync(dir)
		try {
			fs.writeFileSync(dir + "/magicNotes.json", JSON.stringify([{ name: "Hello World" }]))
		}
		catch (err) {
			return (false)
		}
		return (true)
	} catch (err) { return (false) }
}
function createNewNote(data) {
	const t = vscode.workspace.workspaceFolders;
	const dir = path.join(t[0].uri.fsPath, "/.vscode/");
	try {
		fs.writeFileSync(dir + "/magicNotes.json", JSON.stringify([{ name: "Hello World" }]))
	}
	catch (err) {
		return (false)
	}
	return (true)
}
function loadHTML() {
	const p = path.join(__dirname, "/app/index.html");
	try {
		const data = fs.readFileSync(p, "utf-8")
		return (data)
	} catch (err) {
		return (err)
	}
}
function openWebView(data) {
	const panel = vscode.window.createWebviewPanel("Magic Notes", "magic-notes", vscode.ViewColumn.Beside, {
		enableScripts: true,
	})
	panel.webview.html = loadHTML();
	panel.webview.onDidReceiveMessage((message) => {
		console.log("Recieved: ", message)
	})
	panel.webview.postMessage(data);
}
function activate(context) {
	let disposable = vscode.commands.registerCommand('magic-notes.open', function () {
		if (checkIfDataExists()) {
			const data = getLocalData()
			openWebView(data)
		} else {
			setupCode()
		}
	});

	context.subscriptions.push(disposable);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}

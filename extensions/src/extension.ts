// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { expand } from "@leodurillon/emmet_rs";
import * as vscode from "vscode";
import { createCompletion } from "./lib/emmetrs";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const emmetrs = vscode.commands.registerCommand("emmetrs.expand", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const selection = editor.document.lineAt(editor.selection.active.line);
    const stdout = expand(selection.text);
    if (!stdout) {
      return;
    }
    editor.edit((buff) => {
      buff.replace(selection.range, stdout);
    });
  });

  const provider = vscode.languages.registerCompletionItemProvider(
    { scheme: "file" },
    {
      provideCompletionItems: createCompletion,
    },
    "*"
  );

  context.subscriptions.push(emmetrs);
  context.subscriptions.push(provider);
}

// This method is called when your extension is deactivated
export function deactivate() {}

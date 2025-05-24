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

  const completion = {
    provideCompletionItems: createCompletion,
  };
  const inlineCompletion = {
    async provideInlineCompletionItems(
      document: vscode.TextDocument,
      position: vscode.Position,
      _: vscode.InlineCompletionContext,
      token: vscode.CancellationToken
    ) {
      const items = completion.provideCompletionItems(
        document,
        position,
        token,
        {
          triggerCharacter: undefined,
          triggerKind: vscode.CompletionTriggerKind.Invoke,
        }
      );
      if (!items) {
        return undefined;
      }
      const item = items.items[0];
      if (!item) {
        return undefined;
      }
      const range = item.range as vscode.Range;

      if (document.getText(range) !== item.label) {
        // We only want to show an inline completion if we are really sure the user meant emmet.
        // If the user types `d`, we don't want to suggest `<div></div>`.
        return undefined;
      }

      return [
        {
          insertText: item.insertText as string,
          filterText: item.filterText as string,
          range,
        },
      ];
    },
  };

  const providers = [
    "javascript",
    "typescript",
    "javascriptreact",
    "typescriptreact",
  ].flatMap((language) => [
    vscode.languages.registerCompletionItemProvider(
      { language, scheme: "*" },
      completion,
      "*"
    ),
    vscode.languages.registerInlineCompletionItemProvider(
      { language, scheme: "*" },
      inlineCompletion
    ),
  ]);

  context.subscriptions.push(emmetrs);
  context.subscriptions.push(...providers);
}

// This method is called when your extension is deactivated
export function deactivate() {}

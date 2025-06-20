import { expand } from "@leodurillon/emmet_rs";
import * as vscode from "vscode";

export function createCompletion(
  document: vscode.TextDocument,
  position: vscode.Position,
  token: vscode.CancellationToken,
  context: vscode.CompletionContext
) {
  try {
    const abbr = document
      .lineAt(position)
      .text.substring(0, position.character);

    const completion = new vscode.CompletionItem(
      abbr,
      vscode.CompletionItemKind.Snippet
    );

    const expanded = expand(abbr);

    if (!expanded) {
      return new vscode.CompletionList();
    }

    completion.documentation = expanded;
    completion.detail = vscode.l10n.t("EmmetRS Completion");
    completion.range = new vscode.Range(
      position.line,
      0,
      position.line,
      abbr.length
    );
    completion.insertText = expanded;
    completion.filterText = abbr;
    completion.sortText = "0" + expanded;
    completion.keepWhitespace = true;

    return new vscode.CompletionList([completion]);
  } catch (error) {
    console.error("Error in createCompletion function:", error);
    return new vscode.CompletionList();
  }
}

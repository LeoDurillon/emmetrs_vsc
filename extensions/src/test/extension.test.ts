import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import { expand } from "@leodurillon/emmet_rs";
import * as vscode from "vscode";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Sample test", () => {
    assert.equal(expand("p>p"), "<p>\n\t<p></p>\n</p>");
  });
});

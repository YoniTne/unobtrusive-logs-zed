import {
  createConnection, ProposedFeatures, TextDocuments,
  TextDocumentSyncKind, SemanticTokensBuilder,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);
const legend = { tokenTypes: ["log"], tokenModifiers: [] };

connection.onInitialize(() => ({
  capabilities: {
    textDocumentSync: TextDocumentSyncKind.Incremental,
    semanticTokensProvider: { legend, full: true },
  },
}));

connection.languages.semanticTokens.on((params) => {
  const builder = new SemanticTokensBuilder();
  const doc = documents.get(params.textDocument.uri);
  if (!doc) return builder.build();

  doc.getText().split(/\r?\n/).forEach((line, i) => {
    const col = line.indexOf("console.log");
    if (col !== -1) builder.push(i, col, line.length - col, 0, 0);
  });
  return builder.build();
});

documents.listen(connection);
connection.listen();

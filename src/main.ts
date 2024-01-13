import '@fontsource/jetbrains-mono';
import './style.styl';

import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';
import {
  EditorView,
  highlightActiveLine,
  keymap,
  lineNumbers,
} from '@codemirror/view';
import { EditorState, Extension } from '@codemirror/state';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';

const htmlTemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>HTBox</title>
  </head>

  <body>
    <h1>HTBox</h1>
  </body>
</html>`;

const cssTemplate = `h1 {
  color: #FF5555;
}`;

const baseExtensions: Extension[] = [
  dracula,
  lineNumbers(),
  highlightActiveLine(),
  autocompletion(),
  closeBrackets(),
  EditorView.lineWrapping,
  keymap.of([
    ...closeBracketsKeymap,
    ...completionKeymap,
    ...defaultKeymap,
    indentWithTab,
  ]),
];

new EditorView({
  parent: document.getElementById('html-code')!,
  state: EditorState.create({
    doc: localStorage.getItem('htmlCode') || htmlTemplate,
    extensions: [
      ...baseExtensions,
      html(),
      EditorView.updateListener.of((update) => {
        let isFirstUpdate = true;

        if (isFirstUpdate || update.docChanged) {
          const code = update.state.doc.toString();

          let previewCode = document.querySelector('#preview code')!;
          previewCode.innerHTML = code;

          localStorage.setItem('htmlCode', code);
        }

        isFirstUpdate = false;
      }),
    ],
  }),
}).focus();

new EditorView({
  parent: document.getElementById('css-code')!,
  state: EditorState.create({
    doc: localStorage.getItem('cssCode') || cssTemplate,
    extensions: [
      ...baseExtensions,
      css(),
      EditorView.updateListener.of((update) => {
        let isFirstUpdate = true;

        if (isFirstUpdate || update.docChanged) {
          const code = update.state.doc.toString();

          let previewStyle = document.querySelector('#preview style')!;
          previewStyle.innerHTML = code;

          localStorage.setItem('cssCode', code);
        }

        isFirstUpdate = false;
      }),
    ],
  }),
});

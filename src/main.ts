import '@fontsource/jetbrains-mono';
import './style.styl';

import { html } from '@codemirror/lang-html';
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
import { EditorState } from '@codemirror/state';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { defaultKeymap } from '@codemirror/commands';

const template = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>HTBox</title>
  </head>

  <body>
    <h1>HTBox</h1>
  </body>
</html>`;

const state = EditorState.create({
  doc: localStorage.getItem('code') || template,
  extensions: [
    dracula,
    lineNumbers(),
    highlightActiveLine(),
    html(),
    autocompletion(),
    closeBrackets(),
    keymap.of([...closeBracketsKeymap, ...completionKeymap, ...defaultKeymap]),
    EditorView.updateListener.of((update) => {
      const code = update.state.doc.toString();
      document.getElementById('preview')!.innerHTML = code;
      localStorage.setItem('code', code);
    }),
  ],
});

new EditorView({
  parent: document.getElementById('code')!,
  state,
}).focus();

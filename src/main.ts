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
import { Compartment, EditorState, Extension } from '@codemirror/state';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { defaultKeymap, history, indentWithTab } from '@codemirror/commands';
import { materialLight } from '@uiw/codemirror-theme-material';

let isDark = false;
if (!localStorage.getItem('darkMode')) { 
  isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
} else {
  isDark = localStorage.getItem('darkMode') === 'on';
}

if (!isDark) {
  document.body.classList.add('light');
}

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
  color: red;
}`;

const themeConfig = new Compartment();

const baseExtensions: Extension[] = [
  themeConfig.of([isDark ? dracula : materialLight]),
  lineNumbers(),
  highlightActiveLine(),
  autocompletion(),
  closeBrackets(),
  EditorView.lineWrapping,
  history(),
  keymap.of([
    ...closeBracketsKeymap,
    ...completionKeymap,
    ...defaultKeymap,
    indentWithTab,
  ]),
];

const htmlEditor = new EditorView({
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

          let maybeTitle = document.querySelector('#preview title');
          if (maybeTitle && maybeTitle.textContent) {
            document.title = maybeTitle.textContent;
          }

          localStorage.setItem('htmlCode', code);
        }

        isFirstUpdate = false;
      }),
    ],
  }),
});

htmlEditor.focus();

const cssEditor = new EditorView({
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

const darkMode = document.getElementById('dark-mode')!;
darkMode.addEventListener('click', () => {
  isDark = !isDark;
  localStorage.setItem('darkMode', isDark ? 'on' : 'off');
  document.body.classList.toggle('light');

  [htmlEditor, cssEditor].forEach((e) => e.dispatch({
    effects: themeConfig.reconfigure([isDark ? dracula : materialLight]),
  }));
});

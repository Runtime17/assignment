import { keymap } from 'prosemirror-keymap';
import { history, undo, redo } from 'prosemirror-history';
import { baseKeymap, chainCommands, exitCode } from 'prosemirror-commands';
import { Plugin } from 'prosemirror-state';
import { inputRules, smartQuotes, emDash, ellipsis } from 'prosemirror-inputrules';

// Create plugins for the editor
export function createPlugins(): Plugin[] {
  return [
    // History plugin for undo/redo functionality
    history(),

    // Input rules for smart quotes, em-dashes, and ellipses
    inputRules({ rules: [...smartQuotes, emDash, ellipsis] }),

    // Base keymap with standard shortcuts
    keymap(baseKeymap),

    // Keymap for custom functionality
    keymap({
      // Undo/redo keybindings
      'Mod-z': undo,
      'Mod-y': redo,
      'Mod-Shift-z': redo,

      // Auto-closing brackets
      '(': (state, dispatch) => {
        if (dispatch) {
          const { tr } = state;
          tr.insertText('()');
          tr.setSelection(state.selection.constructor.near(tr.doc.resolve(state.selection.from + 1)));
          dispatch(tr);
        }
        return true;
      },
      '[': (state, dispatch) => {
        if (dispatch) {
          const { tr } = state;
          tr.insertText('[]');
          tr.setSelection(state.selection.constructor.near(tr.doc.resolve(state.selection.from + 1)));
          dispatch(tr);
        }
        return true;
      },
      '{': (state, dispatch) => {
        if (dispatch) {
          const { tr } = state;
          tr.insertText('{}');
          tr.setSelection(state.selection.constructor.near(tr.doc.resolve(state.selection.from + 1)));
          dispatch(tr);
        }
        return true;
      },

      // Tab for indentation
      'Tab': (state, dispatch) => {
        if (dispatch) {
          const { tr } = state;
          tr.insertText('  '); // 2 spaces for tab
          dispatch(tr);
        }
        return true;
      },
    }),
  ];
}

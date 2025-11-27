import { toggleMark, setBlockType } from 'prosemirror-commands';
import { wrapInList, liftListItem } from 'prosemirror-schema-list';
import { EditorView } from 'prosemirror-view';
import { schema } from './schema';
import type { MarkType, NodeType } from 'prosemirror-model';

// Helper to check if a mark is active
export function isMarkActive(view: EditorView, markType: MarkType): boolean {
  const { from, to } = view.state.selection;
  let active = false;
  view.state.doc.nodesBetween(from, to, (node) => {
    if (node.marks.find((mark) => mark.type === markType)) {
      active = true;
    }
  });
  return active;
}

// Helper to check if a node type is active
export function isNodeTypeActive(view: EditorView, nodeType: NodeType): boolean {
  const { $from, to } = view.state.selection;
  let isActive = false;
  view.state.doc.nodesBetween($from.pos, to, (node) => {
    if (node.type === nodeType) {
      isActive = true;
    }
  });
  return isActive;
}

// Toggle bold
export function toggleBold(view: EditorView): boolean {
  return toggleMark(schema.marks.strong)(view.state, view.dispatch);
}

// Toggle italic
export function toggleItalic(view: EditorView): boolean {
  return toggleMark(schema.marks.em)(view.state, view.dispatch);
}

// Toggle code
export function toggleCode(view: EditorView): boolean {
  return toggleMark(schema.marks.code)(view.state, view.dispatch);
}

// Set heading level
export function setHeading(view: EditorView, level: number): boolean {
  return setBlockType(schema.nodes.heading, { level })(view.state, view.dispatch);
}

// Set paragraph
export function setParagraph(view: EditorView): boolean {
  return setBlockType(schema.nodes.paragraph)(view.state, view.dispatch);
}

// Toggle bullet list
export function toggleBulletList(view: EditorView): boolean {
  const listType = schema.nodes.bullet_list;
  const itemType = schema.nodes.list_item;

  // Check if we're already in a list
  const { $from } = view.state.selection;
  const range = $from.blockRange();

  if (range && range.$from.parent.type === itemType) {
    // We're in a list, lift out of it
    return liftListItem(itemType)(view.state, view.dispatch);
  }

  // We're not in a list, wrap in one
  return wrapInList(listType)(view.state, view.dispatch);
}

// Toggle ordered list
export function toggleOrderedList(view: EditorView): boolean {
  const listType = schema.nodes.ordered_list;
  const itemType = schema.nodes.list_item;

  // Check if we're already in a list
  const { $from } = view.state.selection;
  const range = $from.blockRange();

  if (range && range.$from.parent.type === itemType) {
    // We're in a list, lift out of it
    return liftListItem(itemType)(view.state, view.dispatch);
  }

  // We're not in a list, wrap in one
  return wrapInList(listType)(view.state, view.dispatch);
}

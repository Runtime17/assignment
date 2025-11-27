import { Schema } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';

// Create a schema that extends the basic schema with list support
const schemaWithLists = new Schema({
  nodes: addListNodes(basicSchema.spec.nodes, 'paragraph block*', 'block'),
  marks: basicSchema.spec.marks.addToEnd('highlight', {
    toDOM: () => ['span', { class: 'highlight' }, 0],
  }),
});

export { schemaWithLists as schema };

// Helper function to get text content from editor state
export function getEditorText(state: any): string {
  let text = '';
  state.doc.descendants((node: any) => {
    if (node.isText) {
      text += node.text;
    } else if (node.isBlock && text.length > 0) {
      text += '\n';
    }
  });
  return text.trim();
}

// Helper function to insert text at the end of the document
export function insertTextAtEnd(state: any, text: string) {
  const { tr, doc, schema } = state;
  const endPos = doc.content.size;

  // Insert a space before the new text if the document doesn't end with whitespace
  const lastChar = getEditorText(state).slice(-1);
  const prefix = lastChar && lastChar !== ' ' && lastChar !== '\n' ? ' ' : '';
  const textToInsert = prefix + text;
  
  const highlightMark = schema.marks.highlight.create();
  const textNode = schema.text(textToInsert, [highlightMark]);

  return tr.replaceWith(endPos, endPos, textNode);
}

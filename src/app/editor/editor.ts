import { AffineEditorContainer } from '@blocksuite/presets';
import { Doc, Schema } from '@blocksuite/store';
import { DocCollection } from '@blocksuite/store';
import { AffineSchemas } from '@blocksuite/blocks';
import '@blocksuite/presets/themes/affine.css';


export function initEditor() {
  const schema = new Schema().register(AffineSchemas);
  const collection = new DocCollection({ schema });
  collection.meta.initialize();

  const doc = collection.createDoc({ id: 'page1' });
  let noteId: string | undefined;

  doc.load(() => {
    const pageBlockId = doc.addBlock('affine:page', {});
    doc.addBlock('affine:surface', {}, pageBlockId);
    noteId = doc.addBlock('affine:note', {}, pageBlockId);

    // Initial paragraphs
    const textNode1 = new doc.Text('Write something!');
    doc.addBlock('affine:paragraph', { text: textNode1 }, noteId);

    const textNode2 = new doc.Text('Lorem ipsum dolor sit amet, consectetur adipiscing elit...');
    doc.addBlock('affine:paragraph', { text: textNode2 }, noteId);
  });

  const editor = new AffineEditorContainer();
  editor.doc = doc;
  editor.slots.docLinkClicked.on(({ docId }) => {
    const target = collection.getDoc(docId) as Doc;
    editor.doc = target;
  });

  return { editor, collection };
}

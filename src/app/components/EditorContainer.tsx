'use client';

import { useEffect, useRef } from 'react';
import { useEditor } from '../editor/context';
import axios from 'axios';
import { Job, JobMiddleware, Schema } from '@blocksuite/store';
import '@blocksuite/presets/themes/affine.css';
import { AffineSchemas, MarkdownAdapter } from '@blocksuite/blocks';
import { AffineEditorContainer } from '@blocksuite/presets';
import { DocCollection, Text } from '@blocksuite/store';


interface EditorContainerProps {
  id?: string | null;
}

const EditorContainer: React.FC<EditorContainerProps> = ({ id }) => {
  const editorContext = useEditor();
  const editorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeEditor = async (markdownContent: string) => {
      const schema = new Schema().register(AffineSchemas);
      const collection = new DocCollection({ schema });
      collection.meta.initialize();

      const middleware: JobMiddleware = ({ adapterConfigs }) => {
        adapterConfigs.set('title:deadbeef', 'test');
      };

      const job = new Job({ collection, middlewares: [middleware] });
      const adapter = new MarkdownAdapter(job);

      const markdownResult = await adapter.toDocSnapshot({
        file: markdownContent,
        assets: job.assetsManager,
      });

      const doc2 = await job.snapshotToDoc(markdownResult);
      doc2.load(() => {
        const pageBlockId = doc2.addBlock('affine:page', {
          title: new Text('New Title'),
        });
        doc2.addBlock('affine:surface', {}, pageBlockId);
        const noteId = doc2.addBlock('affine:note', {}, pageBlockId);
        doc2.addBlock(
          'affine:paragraph',
          { text: new Text('Hello World!') },
          noteId
        );
      });

      const editor = new AffineEditorContainer();
      editor.doc = doc2;
      if (editorContainerRef.current) {
        editorContainerRef.current.innerHTML = '';
        editorContainerRef.current.appendChild(editor);
      }
    };
    
    const markdownContent = "# Loading Content...";

    initializeEditor(markdownContent);
    const fetchContent = async () => {
      try {
        const response = await axios.post('https://dev.chainai.com/api/v1/chat/get-message', {
          id,
        });
        const content = response.data.content;
        if (content) {
          await initializeEditor(content);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, [editorContext, id]);

  return (
    <div>
      <div className="editor-container" ref={editorContainerRef}></div>
    </div>
  );
};

export default EditorContainer;
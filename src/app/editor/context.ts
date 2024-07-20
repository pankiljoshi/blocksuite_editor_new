import { createContext, useContext } from 'react';
import { AffineEditorContainer } from '@blocksuite/presets';
import { DocCollection } from '@blocksuite/store';

export const EditorContext = createContext<{
  editor: AffineEditorContainer;
  collection: DocCollection;
} | null>(null);

export function useEditor() {
  return useContext(EditorContext);
}

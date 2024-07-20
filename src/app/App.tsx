"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { EditorProvider } from './components/EditorProvider';
import TopBar from './components/TopBar';
import EditorContainer from './components/EditorContainer';
import './index.css';

const App: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  console.log('id:', id);

  return (
    <EditorProvider>
      <div className="app">
        <div className="main-content">
          <TopBar />
          <EditorContainer id={id} />
        </div>
      </div>
    </EditorProvider>
  );
};

export default App;

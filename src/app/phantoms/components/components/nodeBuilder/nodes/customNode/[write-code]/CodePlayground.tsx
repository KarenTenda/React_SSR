"use client";

import React from 'react';
import Editor from '@monaco-editor/react';

const CodePlayground = ({ code, setCode }: { code: string, setCode: (value: string) => void }) => {
  return (
    <Editor
      height="50vh"
      width="100%"
      defaultLanguage="python"
      value={code}  
      onChange={(value) => setCode(value || '')} 
      theme='vs-dark'
    />
  );
};

export default CodePlayground;

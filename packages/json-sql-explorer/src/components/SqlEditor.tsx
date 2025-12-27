'use client';

import React, { useRef, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { TableSchema } from '../types';
import { generateCompletionItems } from '../utils/schema';

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onExecute: () => void;
  schema?: TableSchema;
  theme?: 'light' | 'dark' | 'vs-dark';
  readOnly?: boolean;
  height?: number | string;
}

export const SqlEditor: React.FC<SqlEditorProps> = ({
  value,
  onChange,
  onExecute,
  schema,
  theme = 'light',
  readOnly = false,
  height = 200,
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  useEffect(() => {
    if (!monacoRef.current || !schema) return;

    const monaco = monacoRef.current;
    const completionItems = generateCompletionItems(schema);

    // Register completion provider
    const disposable = monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: () => {
        return {
          suggestions: completionItems,
        };
      },
    });

    return () => {
      disposable.dispose();
    };
  }, [schema]);

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Add Ctrl+Enter / Cmd+Enter keybinding
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onExecute();
    });

    // Focus editor
    editor.focus();
  };

  const handleChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <div style={styles.container}>
      <Editor
        height={height}
        defaultLanguage="sql"
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          lineNumbers: 'on',
          readOnly,
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          wordBasedSuggestions: 'off',
        }}
      />
    </div>
  );
};

const styles = {
  container: {
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
};

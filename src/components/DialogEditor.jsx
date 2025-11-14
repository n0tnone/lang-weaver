import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, FileText, AlertTriangle } from 'lucide-react';
import Editor from '@monaco-editor/react';

function DialogEditor({ dialogFiles, keys, onRefresh }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [missingKeys, setMissingKeys] = useState([]);

  useEffect(() => {
    if (selectedFile) {
      const file = dialogFiles.find(f => f.filename === selectedFile);
      if (file) {
        setEditorContent(file.content);
        validateDialog(file.content);
      }
    }
  }, [selectedFile, dialogFiles]);

  const validateDialog = (content) => {
    const errors = [];
    const missing = [];
    
    try {
      const dialog = JSON.parse(content);
      
      // Проверка структуры
      if (!dialog.dialog_id) {
        errors.push('Missing dialog_id');
      }
      
      if (!dialog.nodes || !Array.isArray(dialog.nodes)) {
        errors.push('Missing or invalid nodes array');
      } else {
        // Извлечение ключей и проверка их существования
        const usedKeys = new Set();
        
        dialog.nodes.forEach((node, idx) => {
          if (!node.id) {
            errors.push(`Node ${idx}: missing id`);
          }
          if (!node.type) {
            errors.push(`Node ${idx}: missing type`);
          }
          
          if (node.text) usedKeys.add(node.text);
          
          if (node.choices && Array.isArray(node.choices)) {
            node.choices.forEach(choice => {
              if (choice.text) usedKeys.add(choice.text);
            });
          }
        });
        
        // Проверка существования ключей
        const existingKeys = new Set(keys.map(k => k.key));
        usedKeys.forEach(key => {
          if (!existingKeys.has(key)) {
            missing.push(key);
          }
        });
      }
      
      setValidationErrors(errors);
      setMissingKeys(missing);
    } catch (e) {
      setValidationErrors(['Invalid JSON: ' + e.message]);
      setMissingKeys([]);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    
    const result = await window.electron.saveDialogFile({
      filename: selectedFile,
      content: editorContent
    });
    
    if (result.success) {
      onRefresh();
      alert('Dialog saved successfully!');
    } else {
      alert('Error saving dialog: ' + result.error);
    }
  };

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return;
    
    const filename = newFileName.endsWith('.json') 
      ? newFileName 
      : newFileName + '.json';
    
    const template = {
      dialog_id: filename.replace('.json', ''),
      nodes: [
        {
          id: 'start',
          type: 'text',
          text: 'dialog.example.greeting',
          next: 'end'
        },
        {
          id: 'end',
          type: 'end'
        }
      ]
    };
    
    const result = await window.electron.saveDialogFile({
      filename,
      content: JSON.stringify(template, null, 2)
    });
    
    if (result.success) {
      setNewFileName('');
      setSelectedFile(filename);
      onRefresh();
    } else {
      alert('Error creating file: ' + result.error);
    }
  };

  const handleDeleteFile = async () => {
    if (!selectedFile) return;
    if (!confirm(`Delete ${selectedFile}?`)) return;
    
    const result = await window.electron.deleteDialogFile(selectedFile);
    if (result.success) {
      setSelectedFile(null);
      setEditorContent('');
      onRefresh();
    }
  };

  const handleEditorChange = (value) => {
    setEditorContent(value || '');
    validateDialog(value || '');
  };

  // Monaco настройка
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    theme: 'vs-dark'
  };

  return (
    <div className="h-full flex bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="dialog_name.json"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleCreateFile}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
              title="Create file"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2">
          {dialogFiles.map(file => (
            <button
              key={file.filename}
              onClick={() => setSelectedFile(file.filename)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-left text-sm transition ${
                selectedFile === file.filename
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              <FileText size={16} />
              {file.filename}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {selectedFile ? (
          <>
            {/* Toolbar */}
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">{selectedFile}</span>
                {validationErrors.length > 0 && (
                  <span className="flex items-center gap-1 text-xs text-red-400">
                    <AlertTriangle size={14} />
                    {validationErrors.length} errors
                  </span>
                )}
                {missingKeys.length > 0 && (
                  <span className="flex items-center gap-1 text-xs text-yellow-400">
                    <AlertTriangle size={14} />
                    {missingKeys.length} missing keys
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteFile}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-sm transition"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm transition"
                >
                  <Save size={14} />
                  Save
                </button>
              </div>
            </div>

            {/* Validation Panel */}
            {(validationErrors.length > 0 || missingKeys.length > 0) && (
              <div className="bg-gray-800 border-b border-gray-700 p-3 space-y-2">
                {validationErrors.map((error, idx) => (
                  <div key={idx} className="text-sm text-red-400 flex items-start gap-2">
                    <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                    {error}
                  </div>
                ))}
                {missingKeys.map((key, idx) => (
                  <div key={idx} className="text-sm text-yellow-400 flex items-start gap-2">
                    <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                    Missing key: <span className="font-mono">{key}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Monaco Editor */}
            <div className="flex-1">
              <Editor
                language="json"
                value={editorContent}
                onChange={handleEditorChange}
                options={editorOptions}
                theme="vs-dark"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a dialog file or create a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* Help Panel */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-auto">
        <h3 className="font-bold text-blue-400 mb-3">Dialog Structure</h3>
        <pre className="text-xs bg-gray-900 p-3 rounded overflow-x-auto">
{`{
  "dialog_id": "intro",
  "nodes": [
    {
      "id": "start",
      "type": "text",
      "text": "dialog.intro.greeting",
      "next": "choice1"
    },
    {
      "id": "choice1",
      "type": "choice",
      "text": "dialog.intro.question",
      "choices": [
        {
          "text": "dialog.intro.yes",
          "next": "yes_path"
        },
        {
          "text": "dialog.intro.no",
          "next": "no_path"
        }
      ]
    },
    {
      "id": "yes_path",
      "type": "text",
      "text": "dialog.intro.response",
      "next": "end"
    },
    {
      "id": "end",
      "type": "end"
    }
  ]
}`}
        </pre>

        <h3 className="font-bold text-blue-400 mt-4 mb-2">Node Types</h3>
        <ul className="text-sm space-y-2 text-gray-300">
          <li><code className="text-green-400">text</code> - Display text</li>
          <li><code className="text-green-400">choice</code> - Player choice</li>
          <li><code className="text-green-400">end</code> - End dialog</li>
        </ul>

        <h3 className="font-bold text-blue-400 mt-4 mb-2">Available Keys</h3>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {keys.slice(0, 50).map(key => (
            <div key={key.id} className="text-xs font-mono text-gray-400">
              {key.key}
            </div>
          ))}
          {keys.length > 50 && (
            <div className="text-xs text-gray-500 italic">
              ...and {keys.length - 50} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DialogEditor;
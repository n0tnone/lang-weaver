import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, FileText, AlertTriangle } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useTranslation } from '../i18n';

function DialogEditor({ dialogFiles, keys, onRefresh, appLang }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [missingKeys, setMissingKeys] = useState([]);

  const { t } = useTranslation(appLang);

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
      
      if (!dialog.dialog_id) {
        errors.push(t('validation_missing_id'));
      }
      
      if (!dialog.nodes || !Array.isArray(dialog.nodes)) {
        errors.push(t('validation_missing_nodes'));
      } else {
        const usedKeys = new Set();
        
        dialog.nodes.forEach((node, idx) => {
          if (!node.id) {
            errors.push(t('validation_node_missing_id').replace('{idx}', idx));
          }
          if (!node.type) {
            errors.push(t('validation_node_missing_type').replace('{idx}', idx));
          }
          
          if (node.text) usedKeys.add(node.text);
          
          if (node.choices && Array.isArray(node.choices)) {
            node.choices.forEach(choice => {
              if (choice.text) usedKeys.add(choice.text);
            });
          }
        });
        
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
      setValidationErrors([t('validation_invalid_json') + ': ' + e.message]);
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
      alert(t('dialog_saved'));
    } else {
      alert(t('dialog_error_save') + ': ' + result.error);
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
      alert(t('dialog_error_create') + ': ' + result.error);
    }
  };

  const handleDeleteFile = async () => {
    if (!selectedFile) return;
    if (!confirm(`${t('dialog_delete_confirm')} ${selectedFile}?`)) return;
    
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

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 13,
    fontFamily: 'JetBrains Mono, monospace',
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    theme: 'vs-dark'
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('dialog_create_placeholder')}
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
              className="input flex-1"
            />
            <button
              onClick={handleCreateFile}
              className="btn btn-primary p-2"
              title={t('dialog_create_button')}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="sidebar-content">
          {dialogFiles.map(file => (
            <button
              key={file.filename}
              onClick={() => setSelectedFile(file.filename)}
              className={`sidebar-item ${selectedFile === file.filename ? 'active' : ''}`}
            >
              <FileText size={16} />
              {file.filename}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="editor-container">
        {selectedFile ? (
          <>
            {/* Toolbar */}
            <div className="editor-toolbar">
              <div className="flex items-center gap-3">
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {selectedFile}
                </span>
                {validationErrors.length > 0 && (
                  <span className="flex items-center gap-1" style={{ fontSize: '12px', color: 'var(--text-error)' }}>
                    <AlertTriangle size={14} />
                    {validationErrors.length} {t('dialog_errors')}
                  </span>
                )}
                {missingKeys.length > 0 && (
                  <span className="flex items-center gap-1" style={{ fontSize: '12px', color: 'var(--text-warning)' }}>
                    <AlertTriangle size={14} />
                    {missingKeys.length} {t('dialog_missing_keys')}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteFile}
                  className="btn btn-danger"
                >
                  <Trash2 size={14} />
                  {t('dialog_delete_button')}
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-success"
                >
                  <Save size={14} />
                  {t('dialog_save_button')}
                </button>
              </div>
            </div>

            {/* Validation Panel */}
            {(validationErrors.length > 0 || missingKeys.length > 0) && (
              <div style={{ 
                background: 'var(--bg-secondary)', 
                borderBottom: '1px solid var(--border-color)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {validationErrors.map((error, idx) => (
                  <div key={idx} className="alert error">
                    <AlertTriangle size={14} />
                    {error}
                  </div>
                ))}
                {missingKeys.map((key, idx) => (
                  <div key={idx} className="alert warning">
                    <AlertTriangle size={14} />
                    {t('validation_missing_key')}: <span className="font-mono">{key}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Monaco Editor */}
            <div className="editor-content">
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
          <div className="flex-1 flex items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
            <div className="text-center">
              <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>{t('dialog_select_message')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Help Panel */}
      <div className="sidebar" style={{ width: '320px', borderRight: 'none', borderLeft: '1px solid var(--border-color)' }}>
        <div style={{ padding: '16px', overflowY: 'auto' }}>
          <h3 style={{ fontWeight: 'bold', color: 'var(--accent-orange)', marginBottom: '12px' }}>
            {t('help_dialog_structure')}
          </h3>
          <pre className="font-mono" style={{ 
            fontSize: '11px', 
            background: 'var(--bg-primary)', 
            padding: '12px', 
            borderRadius: 'var(--radius-sm)',
            overflowX: 'auto'
          }}>
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

          <h3 style={{ 
            fontWeight: 'bold', 
            color: 'var(--accent-orange)', 
            marginTop: '16px',
            marginBottom: '8px' 
          }}>
            {t('help_node_types')}
          </h3>
          <ul style={{ fontSize: '13px', paddingLeft: '20px', color: 'var(--text-primary)' }}>
            <li style={{ marginBottom: '4px' }}>
              <code style={{ color: 'var(--accent-green)' }}>text</code> - {t('help_node_text')}
            </li>
            <li style={{ marginBottom: '4px' }}>
              <code style={{ color: 'var(--accent-green)' }}>choice</code> - {t('help_node_choice')}
            </li>
            <li style={{ marginBottom: '4px' }}>
              <code style={{ color: 'var(--accent-green)' }}>end</code> - {t('help_node_end')}
            </li>
          </ul>

          <h3 style={{ 
            fontWeight: 'bold', 
            color: 'var(--accent-orange)', 
            marginTop: '16px',
            marginBottom: '8px' 
          }}>
            {t('help_available_keys')}
          </h3>
          <div style={{ maxHeight: '256px', overflowY: 'auto' }}>
            {keys.slice(0, 50).map(key => (
              <div key={key.id} className="font-mono" style={{ 
                fontSize: '11px', 
                color: 'var(--text-secondary)',
                marginBottom: '2px'
              }}>
                {key.key}
              </div>
            ))}
            {keys.length > 50 && (
              <div className="italic" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                ...{t('help_and_more')} {keys.length - 50}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DialogEditor;
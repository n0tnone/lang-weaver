import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

function TranslationTable({ languages, keys, translations, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [editingCell, setEditingCell] = useState(null);
  const [cellValue, setCellValue] = useState('');

  // Преобразование данных в таблицу
  const tableData = useMemo(() => {
    const data = [];
    
    keys.forEach(key => {
      const row = {
        keyId: key.id,
        key: key.key,
        category: key.category,
        usedIn: key.used_in,
        translations: {}
      };
      
      languages.forEach(lang => {
        const trans = translations.find(
          t => t.key_id === key.id && t.lang_id === lang.id
        );
        row.translations[lang.code] = {
          value: trans?.value || '',
          langId: lang.id
        };
      });
      
      data.push(row);
    });
    
    return data;
  }, [keys, languages, translations]);

  // Фильтрация
  const filteredData = useMemo(() => {
    if (!searchTerm) return tableData;
    
    const lower = searchTerm.toLowerCase();
    return tableData.filter(row =>
      row.key.toLowerCase().includes(lower) ||
      Object.values(row.translations).some(t => 
        t.value.toLowerCase().includes(lower)
      )
    );
  }, [tableData, searchTerm]);

  const handleAddKey = async () => {
    if (!newKey.trim()) return;
    
    const result = await window.electron.addKey({
      key: newKey.trim(),
      category: newCategory
    });
    
    if (result.success) {
      setNewKey('');
      onRefresh();
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleCellEdit = (keyId, langCode, currentValue, langId) => {
    setEditingCell({ keyId, langCode });
    setCellValue(currentValue);
  };

  const handleCellSave = async () => {
    if (!editingCell) return;
    
    const result = await window.electron.updateTranslation({
      keyId: editingCell.keyId,
      languageId: languages.find(l => l.code === editingCell.langCode).id,
      value: cellValue
    });
    
    if (result.success) {
      setEditingCell(null);
      onRefresh();
    }
  };

  const handleDeleteKey = async (keyId) => {
    if (!confirm('Delete this key and all its translations?')) return;
    
    const result = await window.electron.deleteKey(keyId);
    if (result.success) {
      onRefresh();
    }
  };

  const getRowStatus = (row) => {
    const hasTranslations = Object.values(row.translations).some(t => t.value.trim());
    const isUsed = row.usedIn && row.usedIn.trim();
    
    if (!hasTranslations) return 'missing';
    if (!isUsed) return 'unused';
    return 'ok';
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 space-y-3">
        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search keys or translations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Add Key */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="New key (e.g. ui.menu.start)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddKey()}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="general">General</option>
            <option value="ui">UI</option>
            <option value="dialog">Dialog</option>
            <option value="item">Item</option>
            <option value="quest">Quest</option>
          </select>
          <button
            onClick={handleAddKey}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
          >
            <Plus size={18} />
            Add Key
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-300 w-8"></th>
              <th className="px-4 py-3 text-left font-medium text-gray-300 min-w-[250px]">Key</th>
              <th className="px-4 py-3 text-left font-medium text-gray-300 w-32">Category</th>
              {languages.map(lang => (
                <th key={lang.id} className="px-4 py-3 text-left font-medium text-gray-300 min-w-[200px]">
                  {lang.name} ({lang.code})
                </th>
              ))}
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(row => {
              const status = getRowStatus(row);
              
              return (
                <tr
                  key={row.keyId}
                  className={`border-b border-gray-700 hover:bg-gray-800 transition ${
                    status === 'missing' ? 'bg-red-900/20' :
                    status === 'unused' ? 'bg-yellow-900/20' : ''
                  }`}
                >
                  <td className="px-4 py-2">
                    {status === 'missing' && <AlertCircle size={16} className="text-red-400" />}
                    {status === 'unused' && <AlertCircle size={16} className="text-yellow-400" />}
                    {status === 'ok' && <CheckCircle size={16} className="text-green-400" />}
                  </td>
                  <td className="px-4 py-2 font-mono text-sm text-blue-300">
                    {row.key}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                      {row.category}
                    </span>
                  </td>
                  {languages.map(lang => {
                    const trans = row.translations[lang.code];
                    const isEditing = editingCell?.keyId === row.keyId && editingCell?.langCode === lang.code;
                    
                    return (
                      <td key={lang.id} className="px-4 py-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={cellValue}
                            onChange={(e) => setCellValue(e.target.value)}
                            onBlur={handleCellSave}
                            onKeyPress={(e) => e.key === 'Enter' && handleCellSave()}
                            autoFocus
                            className="w-full px-2 py-1 bg-gray-700 border border-blue-500 rounded focus:outline-none"
                          />
                        ) : (
                          <div
                            onClick={() => handleCellEdit(row.keyId, lang.code, trans.value, trans.langId)}
                            className={`px-2 py-1 rounded cursor-pointer hover:bg-gray-700 transition ${
                              !trans.value.trim() ? 'text-gray-500 italic' : ''
                            }`}
                          >
                            {trans.value || 'Click to edit...'}
                          </div>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteKey(row.keyId)}
                      className="p-1 hover:bg-red-600 rounded transition"
                      title="Delete key"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TranslationTable;
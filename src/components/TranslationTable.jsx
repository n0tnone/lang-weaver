import React, { useState, useMemo } from 'react';
import { Plus, Search, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { useTranslation } from '../i18n';

function TranslationTable({ languages, keys, translations, onRefresh, appLang }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [editingCell, setEditingCell] = useState(null);
  const [cellValue, setCellValue] = useState('');

  const { t } = useTranslation(appLang);

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
      alert(t('msg_error_prefix') + ': ' + result.error);
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
    if (!confirm(t('trans_delete_confirm'))) return;
    
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
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="glass-panel" style={{ margin: '16px', padding: '16px' }}>
        {/* Search */}
        <div className="flex items-center gap-2" style={{ marginBottom: '12px' }}>
          <div className="flex-1 relative">
            <Search 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }} 
              size={18} 
            />
            <input
              type="text"
              placeholder={t('trans_search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>

        {/* Add Key */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={t('trans_new_key_placeholder')}
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddKey()}
            className="input flex-1"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="select"
          >
            <option value="general">{t('category_general')}</option>
            <option value="ui">{t('category_ui')}</option>
            <option value="dialog">{t('category_dialog')}</option>
            <option value="item">{t('category_item')}</option>
            <option value="quest">{t('category_quest')}</option>
          </select>
          <button
            onClick={handleAddKey}
            className="btn btn-primary"
          >
            <Plus size={18} />
            {t('trans_add_key')}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: '32px' }}></th>
              <th style={{ minWidth: '250px' }}>{t('trans_key')}</th>
              <th style={{ width: '120px' }}>{t('trans_category')}</th>
              {languages.map(lang => (
                <th key={lang.id} style={{ minWidth: '200px' }}>
                  {lang.name} ({lang.code})
                </th>
              ))}
              <th style={{ width: '60px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(row => {
              const status = getRowStatus(row);
              
              return (
                <tr
                  key={row.keyId}
                  className={`${
                    status === 'missing' ? 'row-missing' :
                    status === 'unused' ? 'row-unused' : ''
                  }`}
                >
                  <td>
                    {status === 'missing' && <AlertCircle size={16} color="var(--text-error)" />}
                    {status === 'unused' && <AlertCircle size={16} color="var(--text-warning)" />}
                    {status === 'ok' && <CheckCircle size={16} color="var(--text-success)" />}
                  </td>
                  <td className="font-mono" style={{ color: 'var(--text-accent)' }}>
                    {row.key}
                  </td>
                  <td>
                    <span className="badge">
                      {t(`category_${row.category}`)}
                    </span>
                  </td>
                  {languages.map(lang => {
                    const trans = row.translations[lang.code];
                    const isEditing = editingCell?.keyId === row.keyId && editingCell?.langCode === lang.code;
                    
                    return (
                      <td key={lang.id}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={cellValue}
                            onChange={(e) => setCellValue(e.target.value)}
                            onBlur={handleCellSave}
                            onKeyPress={(e) => e.key === 'Enter' && handleCellSave()}
                            autoFocus
                            className="input"
                          />
                        ) : (
                          <div
                            onClick={() => handleCellEdit(row.keyId, lang.code, trans.value, trans.langId)}
                            className="cursor-pointer"
                            style={{
                              padding: '8px',
                              borderRadius: 'var(--radius-sm)',
                              color: !trans.value.trim() ? 'var(--text-secondary)' : 'inherit',
                              fontStyle: !trans.value.trim() ? 'italic' : 'normal'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            {trans.value || t('trans_edit_placeholder')}
                          </div>
                        )}
                      </td>
                    );
                  })}
                  <td>
                    <button
                      onClick={() => handleDeleteKey(row.keyId)}
                      className="btn btn-danger p-1"
                      title={t('dialog_delete_button')}
                      style={{ padding: '4px' }}
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
import React, { useState } from 'react';
import { Plus, Globe, Search } from 'lucide-react';
import { useTranslation } from '../i18n';

function KeyManager({ keys, languages, onRefresh, appLang }) {
  const [newLangCode, setNewLangCode] = useState('');
  const [newLangName, setNewLangName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { t } = useTranslation(appLang);

  const handleAddLanguage = async () => {
    if (!newLangCode.trim() || !newLangName.trim()) return;
    
    const result = await window.electron.addLanguage({
      code: newLangCode.trim().toLowerCase(),
      name: newLangName.trim()
    });
    
    if (result.success) {
      setNewLangCode('');
      setNewLangName('');
      onRefresh();
    } else {
      alert(t('keys_error_add_lang') + ': ' + result.error);
    }
  };

  const filteredKeys = keys.filter(key =>
    key.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedKeys = filteredKeys.reduce((acc, key) => {
    if (!acc[key.category]) {
      acc[key.category] = [];
    }
    acc[key.category].push(key);
    return acc;
  }, {});

  return (
    <div className="h-full flex">
      {/* Languages Panel */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="flex items-center gap-2" style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            color: 'var(--text-accent)',
            marginBottom: '16px'
          }}>
            <Globe size={20} />
            {t('keys_languages_title')}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="text"
              placeholder={t('keys_add_lang_code')}
              value={newLangCode}
              onChange={(e) => setNewLangCode(e.target.value)}
              className="input"
            />
            <input
              type="text"
              placeholder={t('keys_add_lang_name')}
              value={newLangName}
              onChange={(e) => setNewLangName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
              className="input"
            />
            <button
              onClick={handleAddLanguage}
              className="btn btn-primary w-full"
            >
              <Plus size={16} />
              {t('keys_add_language')}
            </button>
          </div>
        </div>

        <div className="sidebar-content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {languages.map(lang => (
              <div
                key={lang.id}
                className="glass-panel"
                style={{ padding: '12px' }}
              >
                <div style={{ fontWeight: '500' }}>{lang.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{lang.code}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keys Statistics */}
      <div className="flex-1" style={{ padding: '24px', overflowY: 'auto' }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: 'var(--text-accent)',
          marginBottom: '24px'
        }}>
          {t('keys_overview_title')}
        </h2>

        {/* Search */}
        <div style={{ marginBottom: '24px' }}>
          <div className="relative">
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
              placeholder={t('keys_search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full"
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>

        {/* Statistics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '16px',
          marginBottom: '24px'
        }}>
          <StatCard
            title={t('keys_stat_total')}
            value={keys.length}
            color="orange"
          />
          <StatCard
            title={t('keys_stat_categories')}
            value={Object.keys(groupedKeys).length}
            color="green"
          />
          <StatCard
            title={t('keys_stat_used')}
            value={keys.filter(k => k.used_in && k.used_in.trim()).length}
            color="purple"
          />
          <StatCard
            title={t('keys_stat_unused')}
            value={keys.filter(k => !k.used_in || !k.used_in.trim()).length}
            color="yellow"
          />
        </div>

        {/* Grouped Keys */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {Object.entries(groupedKeys).map(([category, categoryKeys]) => (
            <div key={category} className="glass-panel">
              <div style={{ 
                padding: '12px 16px',
                background: 'var(--bg-tertiary)',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h3 style={{ 
                  fontWeight: 'bold', 
                  color: 'var(--accent-orange)',
                  fontSize: '13px',
                  textTransform: 'uppercase'
                }}>
                  {t(`category_${category}`)}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {categoryKeys.length} {t('stats_keys').toLowerCase()}
                </span>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '8px'
                }}>
                  {categoryKeys.map(key => (
                    <div
                      key={key.id}
                      style={{ 
                        padding: '12px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px'
                      }}
                    >
                      <div className="font-mono" style={{ color: 'var(--accent-orange)' }}>
                        {key.key}
                      </div>
                      {key.used_in && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {t('keys_used_in')}: {key.used_in}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colorMap = {
    orange: 'var(--accent-orange)',
    green: 'var(--accent-green)',
    purple: 'var(--accent-purple)',
    yellow: 'var(--accent-yellow)'
  };

  return (
    <div className="stat-card" style={{ borderLeftColor: colorMap[color] }}>
      <div className="stat-card-label">{title}</div>
      <div className="stat-card-value" style={{ color: colorMap[color] }}>
        {value}
      </div>
    </div>
  );
}

export default KeyManager;
import React, { useState, useEffect } from 'react';
import { FileText, Database, Settings, Download, Globe } from 'lucide-react';
import ProjectManager from './components/ProjectManager';
import TranslationTable from './components/TranslationTable';
import DialogEditor from './components/DialogEditor';
import KeyManager from './components/KeyManager';
import ExportDialog from './components/ExportDialog';
import { useTranslation, availableLanguages } from './i18n';
import { getFlag } from './i18n';

function App() {
  const [projectOpen, setProjectOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('translations');
  const [languages, setLanguages] = useState([]);
  const [keys, setKeys] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [dialogFiles, setDialogFiles] = useState([]);
  const [showExport, setShowExport] = useState(false);
  const [stats, setStats] = useState({ total: 0, translated: 0, unused: 0 });
  const [appLang, setAppLang] = useState('ru');
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const { t } = useTranslation(appLang);

  useEffect(() => {
    if (projectOpen) {
      loadProjectData();
    }
  }, [projectOpen]);

  const loadProjectData = async () => {
    const [langs, allKeys, trans, dialogs] = await Promise.all([
      window.electron.getLanguages(),
      window.electron.getAllKeys(),
      window.electron.getTranslations(),
      window.electron.getDialogFiles()
    ]);
    
    setLanguages(langs);
    setKeys(allKeys);
    setTranslations(trans);
    setDialogFiles(dialogs);
    calculateStats(allKeys, trans);
  };

  const calculateStats = (allKeys, trans) => {
    const total = allKeys.length;
    const translatedKeys = new Set();
    
    trans.forEach(t => {
      if (t.value && t.value.trim()) {
        translatedKeys.add(t.key_id);
      }
    });
    
    const unused = allKeys.filter(k => !k.used_in || k.used_in.trim() === '').length;
    
    setStats({
      total,
      translated: translatedKeys.size,
      unused
    });
  };

  const handleProjectOpen = () => {
    setProjectOpen(true);
    loadProjectData();
  };

  if (!projectOpen) {
    return <ProjectManager onProjectOpen={handleProjectOpen} appLang={appLang} />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="app-header">
        <div className="flex items-center gap-4">
          <h1 className="app-title">{t('app_title')}</h1>
          <div className="stats-container">
            <span className="stat-badge">
              {t('stats_keys')}: {stats.total}
            </span>
            <span className="stat-badge success">
              {t('stats_translated')}: {stats.translated}
            </span>
            <span className="stat-badge warning">
              {t('stats_unused')}: {stats.unused}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="lang-switcher">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="lang-button"
            >
              <Globe size={14} />
              {React.createElement(getFlag(appLang), { style: { width: '20px', height: '14px' } })}
            </button>
            {showLangDropdown && (
              <div className="lang-dropdown">
                {availableLanguages.map(lang => {
                  const Flag = getFlag(lang.code);
                  return (
                    <div
                      key={lang.code}
                      onClick={() => {
                        setAppLang(lang.code);
                        setShowLangDropdown(false);
                      }}
                      className={`lang-option ${appLang === lang.code ? 'active' : ''}`}
                    >
                      <Flag style={{ width: '20px', height: '14px', marginRight: '8px' }} />
                      {lang.name}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowExport(true)}
            className="btn btn-primary"
          >
            <Download size={16} />
            {t('export_button')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <TabButton
          active={currentTab === 'translations'}
          onClick={() => setCurrentTab('translations')}
          icon={<Database size={16} />}
        >
          {t('tab_translations')}
        </TabButton>
        <TabButton
          active={currentTab === 'dialogs'}
          onClick={() => setCurrentTab('dialogs')}
          icon={<FileText size={16} />}
        >
          {t('tab_dialogs')}
        </TabButton>
        <TabButton
          active={currentTab === 'keys'}
          onClick={() => setCurrentTab('keys')}
          icon={<Settings size={16} />}
        >
          {t('tab_keys')}
        </TabButton>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {currentTab === 'translations' && (
          <TranslationTable
            languages={languages}
            keys={keys}
            translations={translations}
            onRefresh={loadProjectData}
            appLang={appLang}
          />
        )}
        {currentTab === 'dialogs' && (
          <DialogEditor
            dialogFiles={dialogFiles}
            keys={keys}
            onRefresh={loadProjectData}
            appLang={appLang}
          />
        )}
        {currentTab === 'keys' && (
          <KeyManager
            keys={keys}
            languages={languages}
            onRefresh={loadProjectData}
            appLang={appLang}
          />
        )}
      </div>

      {showExport && (
        <ExportDialog
          onClose={() => setShowExport(false)}
          onExport={loadProjectData}
          appLang={appLang}
        />
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`tab-button ${active ? 'active' : ''}`}
    >
      {icon}
      {children}
    </button>
  );
}

document.addEventListener('DOMContentLoaded', function() {
    const minimizeBtn = document.getElementById('minimizeBtn');
    const maximizeBtn = document.getElementById('maximizeBtn');
    const closeBtn = document.getElementById('closeBtn');
    
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            window.electron.minimizeWindow();
        });
    }
    
    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', () => {
            window.electron.maximizeWindow();
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            window.electron.closeWindow();
        });
    }
});

export default App;
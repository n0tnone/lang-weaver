import React, { useState, useEffect } from 'react';
import { FileText, Database, Settings, Upload, Download, Plus, Trash2, Save } from 'lucide-react';
import ProjectManager from './components/ProjectManager';
import TranslationTable from './components/TranslationTable';
import DialogEditor from './components/DialogEditor';
import KeyManager from './components/KeyManager';
import ExportDialog from './components/ExportDialog';

function App() {
  const [projectOpen, setProjectOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('translations');
  const [languages, setLanguages] = useState([]);
  const [keys, setKeys] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [dialogFiles, setDialogFiles] = useState([]);
  const [showExport, setShowExport] = useState(false);
  const [stats, setStats] = useState({ total: 0, translated: 0, unused: 0 });

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
    return <ProjectManager onProjectOpen={handleProjectOpen} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-blue-400">Game Localization Tool</h1>
          <div className="flex gap-2 text-sm">
            <span className="px-2 py-1 bg-gray-700 rounded">
              Keys: {stats.total}
            </span>
            <span className="px-2 py-1 bg-green-900 rounded">
              Translated: {stats.translated}
            </span>
            <span className="px-2 py-1 bg-yellow-900 rounded">
              Unused: {stats.unused}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowExport(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 flex gap-1">
        <TabButton
          active={currentTab === 'translations'}
          onClick={() => setCurrentTab('translations')}
          icon={<Database size={16} />}
        >
          Translations
        </TabButton>
        <TabButton
          active={currentTab === 'dialogs'}
          onClick={() => setCurrentTab('dialogs')}
          icon={<FileText size={16} />}
        >
          Dialogs
        </TabButton>
        <TabButton
          active={currentTab === 'keys'}
          onClick={() => setCurrentTab('keys')}
          icon={<Settings size={16} />}
        >
          Keys Manager
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
          />
        )}
        {currentTab === 'dialogs' && (
          <DialogEditor
            dialogFiles={dialogFiles}
            keys={keys}
            onRefresh={loadProjectData}
          />
        )}
        {currentTab === 'keys' && (
          <KeyManager
            keys={keys}
            languages={languages}
            onRefresh={loadProjectData}
          />
        )}
      </div>

      {showExport && (
        <ExportDialog
          onClose={() => setShowExport(false)}
          onExport={loadProjectData}
        />
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 border-b-2 transition ${
        active
          ? 'border-blue-500 text-blue-400'
          : 'border-transparent text-gray-400 hover:text-gray-200'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

export default App;
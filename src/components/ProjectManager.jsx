import React from 'react';
import { FolderPlus, FolderOpen } from 'lucide-react';
import { useTranslation } from '../i18n';

function ProjectManager({ onProjectOpen, appLang }) {
  const { t } = useTranslation(appLang);

  const handleCreateProject = async () => {
    const result = await window.electron.showSaveDialog();
    if (result.canceled) return;
    
    const createResult = await window.electron.createProject(result.filePath);
    if (createResult.success) {
      onProjectOpen();
    } else {
      alert(t('msg_error_prefix') + ': ' + createResult.error);
    }
  };

  const handleOpenProject = async () => {
    const result = await window.electron.showOpenDialog();
    if (result.canceled) return;
    
    const openResult = await window.electron.openProject(result.filePaths[0]);
    if (openResult.success) {
      onProjectOpen();
    } else {
      alert(t('msg_error_prefix') + ': ' + openResult.error);
    }
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-card animate-fade-in">
        <h1 className="welcome-title">
          {t('project_title')}
        </h1>
        <p className="welcome-subtitle">{t('project_subtitle')}</p>

        <div className="welcome-buttons">
          <button
            onClick={handleCreateProject}
            className="welcome-button"
          >
            <FolderPlus size={48} style={{ color: 'var(--accent-orange)' }} />
            <span>{t('project_create')}</span>
          </button>

          <button
            onClick={handleOpenProject}
            className="welcome-button"
          >
            <FolderOpen size={48} style={{ color: 'var(--accent-green)' }} />
            <span>{t('project_open')}</span>
          </button>
        </div>

        <div style={{ paddingTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <p>{t('project_extension_note')}</p>
        </div>
      </div>
    </div>
  );
}

export default ProjectManager;
import React, { useState } from 'react';
import { X, Download, Check } from 'lucide-react';
import { useTranslation } from '../i18n';

function ExportDialog({ onClose, onExport, appLang }) {
  const [minify, setMinify] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { t } = useTranslation(appLang);

  const handleExport = async () => {
    const result = await window.electron.showExportDialog();
    if (result.canceled) return;

    setExporting(true);
    
    const exportResult = await window.electron.exportTranslations({
      exportPath: result.filePaths[0],
      minify
    });

    setExporting(false);

    if (exportResult.success) {
      setSuccess(true);
      setTimeout(() => {
        onExport();
        onClose();
      }, 1500);
    } else {
      alert(t('export_error') + ': ' + exportResult.error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal animate-fade-in">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{t('export_title')}</h2>
          <button
            onClick={onClose}
            className="btn btn-secondary p-1"
            style={{ padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {!success ? (
            <>
              <p style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
                {t('export_description')}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={minify}
                    onChange={(e) => setMinify(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--accent-orange)' }}
                  />
                  <span style={{ fontSize: '13px' }}>{t('export_minify')}</span>
                </label>

                <div className="glass-panel" style={{ padding: '12px' }}>
                  <div style={{ 
                    fontWeight: '500', 
                    marginBottom: '8px',
                    fontSize: '13px'
                  }}>
                    {t('export_format')}
                  </div>
                  <div className="font-mono" style={{ fontSize: '12px' }}>
                    ru.json<br />
                    en.json<br />
                    jp.json<br />
                    ...
                  </div>
                </div>
              </div>

              <div className="flex gap-3" style={{ paddingTop: '16px' }}>
                <button
                  onClick={onClose}
                  className="btn btn-secondary flex-1"
                >
                  {t('export_cancel')}
                </button>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="btn btn-primary flex-1"
                >
                  {exporting ? (
                    <>
                      <div className="animate-spin" style={{ 
                        width: '16px', 
                        height: '16px', 
                        border: '2px solid rgba(0, 0, 0, 0.3)',
                        borderTopColor: '#000',
                        borderRadius: '50%'
                      }} />
                      {t('export_exporting')}
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      {t('export_button')}
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center" style={{ padding: '32px 0' }}>
              <div style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                background: 'var(--accent-green)',
                borderRadius: '50%',
                marginBottom: '16px'
              }}>
                <Check size={32} color="#000" />
              </div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: 'var(--accent-green)',
                marginBottom: '8px'
              }}>
                {t('export_success_title')}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {t('export_success_message')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExportDialog;
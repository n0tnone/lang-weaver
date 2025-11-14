import React, { useState } from 'react';
import { X, Download, FolderOpen, Check } from 'lucide-react';

function ExportDialog({ onClose, onExport }) {
  const [minify, setMinify] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);

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
      alert('Export failed: ' + exportResult.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-blue-400">Export Translations</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!success ? (
            <>
              <p className="text-gray-300">
                Export translations to JSON files (one per language).
              </p>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={minify}
                    onChange={(e) => setMinify(e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm">Minify JSON output</span>
                </label>

                <div className="bg-gray-900 rounded p-3 text-xs text-gray-400">
                  <div className="font-medium mb-2">Output format:</div>
                  <div className="font-mono">
                    ru.json<br />
                    en.json<br />
                    jp.json<br />
                    ...
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition"
                >
                  {exporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Export
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                <Check size={32} />
              </div>
              <h3 className="text-xl font-bold text-green-400 mb-2">
                Export Successful!
              </h3>
              <p className="text-gray-400">
                Translation files have been created.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExportDialog;
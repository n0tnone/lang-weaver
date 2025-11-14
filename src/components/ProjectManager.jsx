import React from 'react';
import { FolderPlus, FolderOpen } from 'lucide-react';

function ProjectManager({ onProjectOpen }) {
  const handleCreateProject = async () => {
    const result = await window.electron.showSaveDialog();
    if (result.canceled) return;
    
    const createResult = await window.electron.createProject(result.filePath);
    if (createResult.success) {
      onProjectOpen();
    } else {
      alert('Error creating project: ' + createResult.error);
    }
  };

  const handleOpenProject = async () => {
    const result = await window.electron.showOpenDialog();
    if (result.canceled) return;
    
    const openResult = await window.electron.openProject(result.filePaths[0]);
    if (openResult.success) {
      onProjectOpen();
    } else {
      alert('Error opening project: ' + openResult.error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-blue-400 mb-2">
            Game Localization Tool
          </h1>
          <p className="text-gray-400">Manage your game translations efficiently</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCreateProject}
            className="group flex flex-col items-center gap-3 px-8 py-6 bg-gray-800 hover:bg-gray-750 border-2 border-gray-700 hover:border-blue-500 rounded-lg transition"
          >
            <FolderPlus size={48} className="text-blue-400" />
            <span className="text-lg font-medium">Create New Project</span>
          </button>

          <button
            onClick={handleOpenProject}
            className="group flex flex-col items-center gap-3 px-8 py-6 bg-gray-800 hover:bg-gray-750 border-2 border-gray-700 hover:border-green-500 rounded-lg transition"
          >
            <FolderOpen size={48} className="text-green-400" />
            <span className="text-lg font-medium">Open Existing Project</span>
          </button>
        </div>

        <div className="pt-4 text-sm text-gray-500">
          <p>Project files use .locproj extension</p>
        </div>
      </div>
    </div>
  );
}

export default ProjectManager;
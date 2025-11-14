import React, { useState } from 'react';
import { Plus, Trash2, Globe, Search } from 'lucide-react';

function KeyManager({ keys, languages, onRefresh }) {
  const [newLangCode, setNewLangCode] = useState('');
  const [newLangName, setNewLangName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
      alert('Error adding language: ' + result.error);
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
    <div className="h-full flex bg-gray-900">
      {/* Languages Panel */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
            <Globe size={20} />
            Languages
          </h2>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Language code (e.g. de)"
              value={newLangCode}
              onChange={(e) => setNewLangCode(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Language name (e.g. Deutsch)"
              value={newLangName}
              onChange={(e) => setNewLangName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddLanguage}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
            >
              <Plus size={16} />
              Add Language
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-2">
            {languages.map(lang => (
              <div
                key={lang.id}
                className="flex items-center justify-between px-3 py-2 bg-gray-700 rounded"
              >
                <div>
                  <div className="font-medium">{lang.name}</div>
                  <div className="text-xs text-gray-400">{lang.code}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keys Statistics */}
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-bold text-blue-400 mb-6">Keys Overview</h2>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search keys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Keys"
            value={keys.length}
            color="blue"
          />
          <StatCard
            title="Categories"
            value={Object.keys(groupedKeys).length}
            color="green"
          />
          <StatCard
            title="Used in Dialogs"
            value={keys.filter(k => k.used_in && k.used_in.trim()).length}
            color="purple"
          />
          <StatCard
            title="Unused"
            value={keys.filter(k => !k.used_in || !k.used_in.trim()).length}
            color="yellow"
          />
        </div>

        {/* Grouped Keys */}
        <div className="space-y-6">
          {Object.entries(groupedKeys).map(([category, categoryKeys]) => (
            <div key={category} className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-750 border-b border-gray-700 flex items-center justify-between">
                <h3 className="font-bold text-blue-300 uppercase text-sm">
                  {category}
                </h3>
                <span className="text-xs text-gray-400">
                  {categoryKeys.length} keys
                </span>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  {categoryKeys.map(key => (
                    <div
                      key={key.id}
                      className="px-3 py-2 bg-gray-700 rounded text-sm font-mono"
                    >
                      <div className="text-blue-300">{key.key}</div>
                      {key.used_in && (
                        <div className="text-xs text-gray-400 mt-1">
                          Used in: {key.used_in}
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
  const colorClasses = {
    blue: 'border-blue-500 text-blue-400',
    green: 'border-green-500 text-green-400',
    purple: 'border-purple-500 text-purple-400',
    yellow: 'border-yellow-500 text-yellow-400'
  };

  return (
    <div className={`bg-gray-800 border-l-4 ${colorClasses[color]} p-4 rounded`}>
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      <div className={`text-3xl font-bold ${colorClasses[color]}`}>
        {value}
      </div>
    </div>
  );
}

export default KeyManager;
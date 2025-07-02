import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface SheetTab {
  id: string;
  name: string;
  active: boolean;
}

interface SheetTabsProps {
  tabs: SheetTab[];
  onTabChange: (tabId: string) => void;
  onTabAdd: () => void;
  onTabRemove: (tabId: string) => void;
  onTabRename: (tabId: string, name: string) => void;
}

const SheetTabs: React.FC<SheetTabsProps> = ({
  tabs,
  onTabChange,
  onTabAdd,
  onTabRemove,
  onTabRename,
}) => {
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleTabClick = (tabId: string) => {
    console.log(`📑 Switching to tab: ${tabs.find(t => t.id === tabId)?.name} (${tabId})`);
    onTabChange(tabId);
  };

  const handleAddTab = () => {
    const newTabNumber = tabs.length + 1;
    console.log(`➕ Adding new tab: Sheet${newTabNumber}`);
    onTabAdd();
  };

  const handleRemoveTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    const tabName = tabs.find(t => t.id === tabId)?.name;
    console.log(`❌ Removing tab: ${tabName} (${tabId})`);
    onTabRemove(tabId);
  };

  const handleDoubleClick = (tab: SheetTab) => {
    console.log(`✏️ Starting to rename tab: ${tab.name}`);
    setEditingTab(tab.id);
    setEditValue(tab.name);
  };

  const handleRename = (tabId: string) => {
    if (editValue.trim()) {
      const oldName = tabs.find(t => t.id === tabId)?.name;
      console.log(`📝 Renaming tab from "${oldName}" to "${editValue.trim()}"`);
      onTabRename(tabId, editValue.trim());
    }
    setEditingTab(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === 'Enter') {
      handleRename(tabId);
    }
    if (e.key === 'Escape') {
      console.log(`🚫 Cancelled renaming tab`);
      setEditingTab(null);
      setEditValue('');
    }
  };

  return (
    <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
      <div className="flex items-center space-x-1">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`group relative px-4 py-2 rounded-t-lg cursor-pointer transition-colors duration-150 ${
              tab.active
                ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleTabClick(tab.id)}
            onDoubleClick={() => handleDoubleClick(tab)}
          >
            {editingTab === tab.id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleRename(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, tab.id)}
                className="bg-transparent text-sm font-medium text-gray-700 outline-none border-none p-0 w-20"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-sm font-medium select-none">
                {tab.name}
              </span>
            )}
            
            {tabs.length > 1 && (
              <button
                onClick={(e) => handleRemoveTab(e, tab.id)}
                className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center"
                title="Remove sheet"
              >
                <X size={10} />
              </button>
            )}
          </div>
        ))}
        
        <button
          onClick={handleAddTab}
          className="p-2 hover:bg-gray-200 rounded transition-colors duration-150 ml-2"
          title="Add sheet"
        >
          <Plus size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default SheetTabs;
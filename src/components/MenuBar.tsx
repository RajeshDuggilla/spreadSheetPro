import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface MenuBarProps {
  onMenuAction: (action: string) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ onMenuAction }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuItems = [
    {
      label: 'File',
      items: ['New', 'Open', 'Save', 'Save As', 'Export', 'Print', 'Close']
    },
    {
      label: 'Edit',
      items: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'Find', 'Replace']
    },
    {
      label: 'View',
      items: ['Zoom In', 'Zoom Out', 'Full Screen', 'Grid Lines', 'Formula Bar']
    },
    {
      label: 'Insert',
      items: ['Rows', 'Columns', 'Cells', 'Chart', 'Image', 'Function']
    },
    {
      label: 'Format',
      items: ['Font', 'Bold', 'Italic', 'Underline', 'Borders', 'Fill Color']
    },
    {
      label: 'Data',
      items: ['Sort', 'Filter', 'Validate', 'Pivot Table', 'Import', 'Refresh']
    },
    {
      label: 'Tools',
      items: ['Spell Check', 'Goal Seek', 'Solver', 'Options', 'Add-ins']
    },
    {
      label: 'Help',
      items: ['Documentation', 'Keyboard Shortcuts', 'About']
    }
  ];

  const handleMenuClick = (menuLabel: string) => {
    const newActiveMenu = activeMenu === menuLabel ? null : menuLabel;
    setActiveMenu(newActiveMenu);
    console.log(`📋 Menu ${menuLabel} ${newActiveMenu ? 'opened' : 'closed'}`);
  };

  const handleMenuItemClick = (action: string, menuLabel: string) => {
    const actionKey = action.toLowerCase().replace(' ', '-');
    console.log(`🎯 Menu action executed: ${menuLabel} > ${action}`);
    onMenuAction(actionKey);
    setActiveMenu(null);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (activeMenu) {
        setActiveMenu(null);
        console.log(`📋 Menu closed (clicked outside)`);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenu]);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center px-4 py-1">
        {menuItems.map((menu) => (
          <div key={menu.label} className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMenuClick(menu.label);
              }}
              className={`px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors duration-150 flex items-center space-x-1 ${
                activeMenu === menu.label ? 'bg-gray-100' : ''
              }`}
            >
              <span>{menu.label}</span>
              <ChevronDown size={12} />
            </button>
            
            {activeMenu === menu.label && (
              <div className="absolute top-full left-0 z-50 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                <div className="py-1">
                  {menu.items.map((item) => (
                    <button
                      key={item}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuItemClick(item, menu.label);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuBar;
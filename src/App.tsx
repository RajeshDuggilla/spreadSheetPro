import React, { useState, useCallback } from 'react';
import MenuBar from './components/MenuBar';
import Toolbar from './components/Toolbar';
import FormulaBar from './components/FormulaBar';
import SpreadsheetGrid from './components/SpreadsheetGrid';
import SheetTabs from './components/SheetTabs';
import { SpreadsheetData } from './types/spreadsheet';

interface SheetTab {
  id: string;
  name: string;
  active: boolean;
}

function App() {
  const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetData>({
    '0-0': { id: '0-0', value: 'Sample Data', row: 0, col: 0 },
    '0-1': { id: '0-1', value: '123', row: 0, col: 1 },
    '1-0': { id: '1-0', value: 'Hello World', row: 1, col: 0 },
    '2-2': { id: '2-2', value: '=A1+B1', row: 2, col: 2 },
  });

  const [selectedCellId, setSelectedCellId] = useState<string>('A1');
  const [selectedCellValue, setSelectedCellValue] = useState<string>('Sample Data');
  const [isDocumentSaved, setIsDocumentSaved] = useState<boolean>(true);

  const [tabs, setTabs] = useState<SheetTab[]>([
    { id: 'sheet1', name: 'Sheet1', active: true },
    { id: 'sheet2', name: 'Sheet2', active: false },
    { id: 'sheet3', name: 'Sheet3', active: false },
  ]);

  const handleDataChange = useCallback((newData: SpreadsheetData) => {
    setSpreadsheetData(newData);
    setIsDocumentSaved(false);
    console.log('📊 Spreadsheet data updated - document marked as unsaved');
  }, []);

  const handleCellSelect = useCallback((cellId: string, value: string) => {
    setSelectedCellId(cellId);
    setSelectedCellValue(value);
    console.log(`🎯 Cell selected: ${cellId} with value: "${value}"`);
  }, []);

  const handleCellValueChange = useCallback((value: string) => {
    console.log(`💾 Updating cell ${selectedCellId} with value: "${value}"`);
    
    // Parse the cell ID to get row and col
    const match = selectedCellId.match(/([A-Z]+)(\d+)/);
    if (match) {
      const colStr = match[1];
      const rowStr = match[2];
      
      // Convert column letters to number
      let col = 0;
      for (let i = 0; i < colStr.length; i++) {
        col = col * 26 + (colStr.charCodeAt(i) - 64);
      }
      col -= 1; // Convert to 0-based
      
      const row = parseInt(rowStr) - 1; // Convert to 0-based
      
      const cellId = `${row}-${col}`;
      const newData = { ...spreadsheetData };
      
      if (value === '') {
        delete newData[cellId];
      } else {
        newData[cellId] = {
          id: cellId,
          value,
          row,
          col,
        };
      }
      
      setSpreadsheetData(newData);
      setSelectedCellValue(value);
      setIsDocumentSaved(false);
    }
  }, [selectedCellId, spreadsheetData]);

  const handleMenuAction = (action: string) => {
    console.log(`🎯 Menu action executed: ${action}`);
    
    // Handle specific menu actions with state changes
    switch (action) {
      case 'save':
        setIsDocumentSaved(true);
        console.log('💾 Document saved successfully');
        break;
      case 'new':
        setSpreadsheetData({});
        setIsDocumentSaved(true);
        console.log('📄 New document created');
        break;
      default:
        console.log(`📋 Menu action "${action}" logged to console`);
    }
  };

  const handleToolbarAction = (action: string) => {
    console.log(`🔧 Toolbar action executed: ${action}`);
    
    // Handle specific toolbar actions
    switch (action) {
      case 'save':
        setIsDocumentSaved(true);
        console.log('💾 Document saved via toolbar');
        break;
      default:
        console.log(`🔧 Toolbar action "${action}" logged to console`);
    }
  };

  const handleTabChange = (tabId: string) => {
    const newTabs = tabs.map(tab => ({ ...tab, active: tab.id === tabId }));
    setTabs(newTabs);
    const activeTab = newTabs.find(tab => tab.active);
    console.log(`📑 Switched to tab: ${activeTab?.name} (${tabId})`);
  };

  const handleTabAdd = () => {
    const newTabNumber = tabs.length + 1;
    const newTab: SheetTab = {
      id: `sheet${newTabNumber}`,
      name: `Sheet${newTabNumber}`,
      active: false,
    };
    setTabs([...tabs, newTab]);
    console.log(`➕ Added new tab: ${newTab.name}`);
  };

  const handleTabRemove = (tabId: string) => {
    if (tabs.length > 1) {
      const tabToRemove = tabs.find(tab => tab.id === tabId);
      const newTabs = tabs.filter(tab => tab.id !== tabId);
      
      // If we're removing the active tab, make the first tab active
      if (tabToRemove?.active && newTabs.length > 0) {
        newTabs[0].active = true;
        console.log(`📑 Removed active tab "${tabToRemove.name}", switched to "${newTabs[0].name}"`);
      } else {
        console.log(`❌ Removed tab: ${tabToRemove?.name}`);
      }
      
      setTabs(newTabs);
    } else {
      console.log('⚠️ Cannot remove the last remaining tab');
    }
  };

  const handleTabRename = (tabId: string, newName: string) => {
    const oldTab = tabs.find(tab => tab.id === tabId);
    setTabs(tabs.map(tab => 
      tab.id === tabId ? { ...tab, name: newName } : tab
    ));
    console.log(`📝 Renamed tab from "${oldTab?.name}" to "${newName}"`);
  };

  const handleSave = () => {
    setIsDocumentSaved(true);
    console.log('💾 Document saved via header button');
  };

  const handleShare = () => {
    console.log('🔗 Share button clicked - opening share dialog');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Application Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">Spreadsheet Pro</h1>
            <div className={`text-sm transition-colors duration-150 ${
              isDocumentSaved ? 'text-gray-500' : 'text-orange-600'
            }`}>
              {isDocumentSaved ? 'All changes saved' : 'Unsaved changes'}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleShare}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-150"
            >
              Share
            </button>
            <button 
              onClick={handleSave}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                isDocumentSaved 
                  ? 'text-gray-500 bg-gray-100 cursor-not-allowed' 
                  : 'text-white bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isDocumentSaved}
            >
              {isDocumentSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Bar */}
      <MenuBar onMenuAction={handleMenuAction} />

      {/* Toolbar */}
      <Toolbar onAction={handleToolbarAction} />

      {/* Formula Bar */}
      <FormulaBar
        selectedCell={selectedCellId}
        cellValue={selectedCellValue}
        onCellValueChange={handleCellValueChange}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <SpreadsheetGrid
          data={spreadsheetData}
          onDataChange={handleDataChange}
          onCellSelect={handleCellSelect}
          rows={100}
          cols={26}
        />
      </div>

      {/* Sheet Tabs */}
      <SheetTabs
        tabs={tabs}
        onTabChange={handleTabChange}
        onTabAdd={handleTabAdd}
        onTabRemove={handleTabRemove}
        onTabRename={handleTabRename}
      />
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { Save, Download, Upload, Printer, Undo, Redo, Copy, Cast as Paste, Scissors, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette, Type, Plus, Minus } from 'lucide-react';

interface ToolbarProps {
  onAction: (action: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAction }) => {
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const handleButtonClick = (action: string) => {
    console.log(`🔧 Toolbar action executed: ${action}`);
    
    // Toggle formatting states for visual feedback
    if (['bold', 'italic', 'underline'].includes(action)) {
      const newFormats = new Set(activeFormats);
      if (newFormats.has(action)) {
        newFormats.delete(action);
        console.log(`📝 Removed ${action} formatting`);
      } else {
        newFormats.add(action);
        console.log(`📝 Applied ${action} formatting`);
      }
      setActiveFormats(newFormats);
    }
    
    onAction(action);
  };

  const getButtonClass = (action: string, baseClass: string) => {
    const isActive = activeFormats.has(action);
    return `${baseClass} ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center space-x-1">
        {/* File Actions */}
        <div className="flex items-center space-x-1 border-r border-gray-200 pr-3 mr-3">
          <button
            onClick={() => handleButtonClick('save')}
            className="p-2 hover:bg-gray-100 rounded transition-colors duration-150"
            title="Save"
          >
            <Save size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => handleButtonClick('download')}
            className="p-2 hover:bg-gray-100 rounded transition-colors duration-150"
            title="Download"
          >
            <Download size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => handleButtonClick('upload')}
            className="p-2 hover:bg-gray-100 rounded transition-colors duration-150"
            title="Upload"
          >
            <Upload size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => handleButtonClick('print')}
            className="p-2 hover:bg-gray-100 rounded transition-colors duration-150"
            title="Print"
          >
            <Printer size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Edit Actions */}
        <div className="flex items-center space-x-1 border-r border-gray-200 pr-3 mr-3">
          <button
            onClick={() => handleButtonClick('undo')}
            className="p-2 hover:bg-gray-100 rounded transition-colors duration-150"
            title="Undo"
          >
            <Undo size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => handleButtonClick('redo')}
            className="p-2 hover:bg-gray-100 rounded transition-colors duration-150"
            title="Redo"
          >
            <Redo size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Clipboard Actions */}
        <div className="flex items-center space-x-1 border-r border-gray-200 pr-3 mr-3">
          <button
            onClick={() => handleButtonClick('cut')}
            className="p-2 hover:bg-gray-100 rounded transition-colors duration-150"
            title="Cut"
          >
            <Scissors size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => handleButtonClick('copy')}
            className="p-2 hover:bg-gray-100 rounded transition-colors duration-150"
            title="Copy"
          >
            <Copy size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => handleButtonClick('paste')}
            className="p-2 hover:bg-gray-100 rounded transition-colors duration-150"
            title="Paste"
          >
            <Paste size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Formatting Actions */}
        <div className="flex items-center space-x-1 border-r border-gray-200 pr-3 mr-3">
          <button
            onClick={() => handleButtonClick('bold')}
            className={getButtonClass('bold', 'p-2 rounded transition-colors duration-150')}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => handleButtonClick('italic')}
            className={getButtonClass('italic', 'p-2 rounded transition-colors duration-150')}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => handleButtonClick('underline')}
            className={getButtonClass('underline', 'p-2 rounded transition-colors duration-150')}
            title="Underline"
          >
            <Underline size={16} />
          </button>
        </div>

        {/* Alignment Actions */}
        <div className="flex items-center space-x-1 border-r border-gray-200 pr-3 mr-3">
          <button
            onClick={() => handleButtonClick('align-left')}
            className="p-2 hover:bg-gray-100 rounded transition-colors duration-150"
            title="Align Left"
          >
            <AlignLeft size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => handleButtonClick('align-center')}
            className="p-2 hover:bg-gray-100 rounded transition-colors duration-150"
            title="Align Center"
          >
            <AlignCenter size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => handleButtonClick('align-right')}
            className="p-2 hover:bg-gray-100 rounded transition-colors duration-150"
            title="Align Right"
          >
            <AlignRight size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Style Actions */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleButtonClick('font-color')}
            className="p-2 hover:bg-gray-100 rounded transition-colors duration-150"
            title="Font Color"
          >
            <Type size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => handleButtonClick('fill-color')}
            className="p-2 hover:bg-gray-100 rounded transition-colors duration-150"
            title="Fill Color"
          >
            <Palette size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
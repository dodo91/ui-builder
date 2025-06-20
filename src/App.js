import React, { useState } from 'react';
import './App.css';
import { ButtonComponent, ComboBoxComponent, DatePickerComponent, TableComponent } from './components/BasicComponents';
import NodeRenderer from './components/NodeRenderer';
import PropertiesEditor from './components/PropertiesEditor';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useHoverState } from './hooks/useHoverState';
import { generateCode } from './utils/codeGenerator';
import { updateNodeAtPath } from './utils/treeUtils';

function App() {
  const [components, setComponents] = useState([]);
  const [activeTab, setActiveTab] = useState('components');
  const [selectedComponent, setSelectedComponent] = useState(null);

  const {
    dragOverMap,
    handleDragStart,
    handleExistingDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDelete,
    mousePosition,
    draggedElementPosition,
    isDragging,
    draggedNode,
    virtualPositions,
    currentContainer,
    candidateContainerId,
    candidateDropIndex,
    invalidDropTarget
  } = useDragAndDrop(components, setComponents);

  const {
    hoverStack,
    handleMouseEnter,
    handleMouseLeave,
    deepestHoveredId
  } = useHoverState();

  const handleComponentClick = (node, path) => {
    setSelectedComponent({ ...node, path });
    setActiveTab('editor');
  };

  const handleComponentUpdate = (updatedComponent) => {
    setComponents(prev => updateNodeAtPath(prev, updatedComponent.path, updatedComponent));
    setSelectedComponent(updatedComponent);
  };

  const handlers = { 
    handleDragOver, 
    handleDragLeave, 
    handleDrop, 
    handleDelete,
    handleExistingDragStart 
  };

  return (
    <div className="app-root">
      {/* Top Blue Bar */}
      <div className="top-bar">
        <div className="logo">sparx</div>
        <div className="top-tabs">
          <button 
            className={`top-tab-btn${activeTab === 'components' ? ' active' : ''}`} 
            onClick={() => setActiveTab('components')}
          >
            Components
          </button>
          <button 
            className={`top-tab-btn${activeTab === 'editor' ? ' active' : ''}`} 
            onClick={() => setActiveTab('editor')}
          >
            Editor
          </button>
          <button 
            className={`top-tab-btn${activeTab === 'code' ? ' active' : ''}`} 
            onClick={() => setActiveTab('code')}
          >
            &lt;/&gt;
          </button>
        </div>
      </div>
      <div className="main-layout">
        {/* Left Sidebar */}
        <div className="left-sidebar">
          {activeTab === 'components' && (
            <div className="components-panel">
              <div 
                className="component-item" 
                draggable 
                onDragStart={(e) => handleDragStart(e, 'row')}
              >
                <div className="component-preview">
                  <div className="preview-placeholder"></div>
                </div>
                <div className="component-label">Row</div>
              </div>
              <div
                className="component-item"
                draggable
                onDragStart={(e) => handleDragStart(e, 'col')}
              >
                <div className="component-preview">
                  <div className="preview-placeholder"></div>
                </div>
                <div className="component-label">Col</div>
              </div>
              <div
                className="component-item"
                draggable
                onDragStart={(e) => handleDragStart(e, 'form')}
              >
                <div className="component-preview">
                  <div className="preview-placeholder"></div>
                </div>
                <div className="component-label">Form</div>
              </div>
              <div
                className="component-item"
                draggable
                onDragStart={(e) => handleDragStart(e, 'formItem')}
              >
                <div className="component-preview">
                  <div className="preview-placeholder"></div>
                </div>
                <div className="component-label">Form Item</div>
              </div>
              <div 
                className="component-item" 
                draggable 
                onDragStart={(e) => handleDragStart(e, 'button')}
              >
                <div className="component-preview">
                  <ButtonComponent label="Button" />
                </div>
                <div className="component-label">Button</div>
              </div>
              <div 
                className="component-item" 
                draggable 
                onDragStart={(e) => handleDragStart(e, 'combobox')}
              >
                <div className="component-preview">
                  <ComboBoxComponent options={['Option 1', 'Option 2', 'Option 3']} />
                </div>
                <div className="component-label">ComboBox</div>
              </div>
              <div 
                className="component-item" 
                draggable 
                onDragStart={(e) => handleDragStart(e, 'datepicker')}
              >
                <div className="component-preview">
                  <DatePickerComponent />
                </div>
                <div className="component-label">DatePicker</div>
              </div>
              <div 
                className="component-item" 
                draggable 
                onDragStart={(e) => handleDragStart(e, 'table')}
              >
                <div className="component-preview">
                  <div className="table-preview">Table</div>
                </div>
                <div className="component-label">Table</div>
              </div>
            </div>
          )}
          {activeTab === 'editor' && (
            <PropertiesEditor 
              selectedComponent={selectedComponent}
              onUpdate={handleComponentUpdate}
            />
          )}
          {activeTab === 'code' && (
            <div className="code-panel">
              <pre className="code-output">
                {generateCode(components)}
              </pre>
            </div>
          )}
        </div>
        {/* Main Content Area */}
        <div className="main-content">
          {/* Secondary Bar (like 'Pano') */}
          <div className="secondary-bar">
            <div className="secondary-tab">Canvas</div>
          </div>
          {/* Canvas Area */}
          <div className="canvas-area">
            <div
              className={`canvas${invalidDropTarget === 'root' ? ' invalid-drop' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDragOver(e, 'root');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDrop(e, []);
              }}
            >
              {components.length === 0 && (
                <div className="empty-canvas">Drag components here. Start with a Row.</div>
              )}
              <NodeRenderer 
                nodes={components} 
                path={[]} 
                handlers={handlers} 
                dragOverMap={dragOverMap} 
                hoverStack={hoverStack}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                deepestHoveredId={deepestHoveredId}
                onComponentClick={handleComponentClick}
                selectedComponent={selectedComponent}
                mousePosition={mousePosition}
                draggedElementPosition={draggedElementPosition}
                isDragging={isDragging}
                draggedNode={draggedNode}
                virtualPositions={virtualPositions}
                currentContainer={currentContainer}
                candidateContainerId={candidateContainerId}
                candidateDropIndex={candidateDropIndex}
                invalidDropTarget={invalidDropTarget}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
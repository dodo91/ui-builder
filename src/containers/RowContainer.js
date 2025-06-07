import React from 'react';

const RowContainer = ({ 
  id, 
  children, 
  onDragOver, 
  onDragLeave, 
  onDrop, 
  isOver, 
  onDelete, 
  hoverStack, 
  handleMouseEnter, 
  handleMouseLeave, 
  deepestHoveredId, 
  draggable, 
  onDragStart, 
  onComponentClick, 
  node, 
  path, 
  selectedComponent 
}) => {
  const isActive = hoverStack.includes(id) && deepestHoveredId === id;
  const isSelected = selectedComponent && selectedComponent.id === id;
  
  return (
    <div 
      id={id}
      className={`canvas-row${isActive ? ' hovered' : ''} ${isOver ? ' drag-over' : ''} ${isSelected ? ' selected' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onMouseEnter={() => handleMouseEnter(id)}
      onMouseLeave={() => handleMouseLeave(id)}
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={(e) => {
        e.stopPropagation();
        onComponentClick(node, path);
      }}
    >
      <div className="builder-row">
        {children}
      </div>
      {onDelete && (
        <button className="delete-row-btn" onClick={onDelete} style={{display: isActive ? 'flex' : 'none'}}>×</button>
      )}
    </div>
  );
};

export default RowContainer; 
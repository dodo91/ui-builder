import React from 'react';
import { Row } from 'antd';

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
  selectedComponent,
  style
}) => {
  const isActive = hoverStack.includes(id) && deepestHoveredId === id;
  const isSelected = selectedComponent && selectedComponent.id === id;
  
  return (
    <Row
      id={id}
      className={`canvas-row builder-row${isActive ? ' hovered' : ''} ${isOver ? ' drag-over' : ''} ${isSelected ? ' selected' : ''}`}
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
      style={style}
    >
      {children}
      {onDelete && (
        <button className="delete-row-btn" onClick={onDelete} style={{display: isActive ? 'flex' : 'none'}}>×</button>
      )}
    </Row>
  );
};

export default RowContainer; 
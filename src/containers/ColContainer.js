import React from 'react';
import { Col } from 'antd';

const ColContainer = ({
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
  span,
  onComponentClick,
  node,
  path,
  selectedComponent,
  style
}) => {
  const isActive = hoverStack.includes(id) && deepestHoveredId === id;
  const isSelected = selectedComponent && selectedComponent.id === id;
  
  return (
    <Col
      id={id}
      span={span}
      data-span={span}
      className={`canvas-col builder-col${isActive ? ' hovered' : ''} ${isOver ? ' drag-over' : ''} ${isSelected ? ' selected' : ''}`}
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
        <button className="delete-btn" onClick={onDelete} style={{display: isActive ? 'flex' : 'none'}}>×</button>
      )}
    </Col>
  );
};

export default ColContainer; 
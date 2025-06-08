import React from 'react';
import { Form } from 'antd';

const FormContainer = ({
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
    <Form
      id={id}
      className={`canvas-form builder-form${isActive ? ' hovered' : ''} ${isOver ? ' drag-over' : ''} ${isSelected ? ' selected' : ''}`}
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
    </Form>
  );
};

export default FormContainer;

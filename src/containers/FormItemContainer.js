import React from 'react';
import { Form } from 'antd';

const FormItemContainer = ({
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
  label,
  name,
  onComponentClick,
  node,
  path,
  selectedComponent,
  style
}) => {
  const isActive = hoverStack.includes(id) && deepestHoveredId === id;
  const isSelected = selectedComponent && selectedComponent.id === id;

  return (
    <Form.Item
      id={id}
      label={label}
      name={name}
      className={`canvas-form-item builder-form-item${isActive ? ' hovered' : ''} ${isOver ? ' drag-over' : ''} ${isSelected ? ' selected' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      draggable={draggable}
      onDragStart={onDragStart}
      style={style}
    >
      <div
        onMouseEnter={() => handleMouseEnter(id)}
        onMouseLeave={() => handleMouseLeave(id)}
        onClick={(e) => {
          e.stopPropagation();
          onComponentClick(node, path);
        }}
      >
        {children}
      </div>
      {onDelete && (
        <button className="delete-btn" onClick={onDelete} style={{display: isActive ? 'flex' : 'none'}}>×</button>
      )}
    </Form.Item>
  );
};

export default FormItemContainer;

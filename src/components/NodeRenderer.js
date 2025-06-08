import React from 'react';
import RowContainer from '../containers/RowContainer';
import ColContainer from '../containers/ColContainer';
import FormContainer from '../containers/FormContainer';
import FormItemContainer from '../containers/FormItemContainer';
import { ButtonComponent, ComboBoxComponent, DatePickerComponent, TableComponent } from './BasicComponents';
import { Input } from 'antd';

const NodeRenderer = ({ 
  nodes, 
  path, 
  handlers, 
  dragOverMap, 
  hoverStack, 
  handleMouseEnter, 
  handleMouseLeave, 
  deepestHoveredId, 
  onComponentClick, 
  selectedComponent,
  mousePosition,
  draggedElementPosition,
  isDragging,
  draggedNode,
  dragOverIndex,
  virtualPositions,
  currentContainer,
  candidateContainerId,
  candidateDropIndex
}) => {
  const renderDraggedElement = () => {
    if (!isDragging || !draggedNode) return null;
    const style = {
      left: mousePosition.x - draggedElementPosition.x,
      top: mousePosition.y - draggedElementPosition.y,
    };
    return (
      <div className="dragging" style={style}>
        {draggedNode.type === 'button' && <ButtonComponent label={draggedNode.props.label} />}
        {draggedNode.type === 'combobox' && <ComboBoxComponent options={draggedNode.props.options} />}
        {draggedNode.type === 'datepicker' && <DatePickerComponent />}
        {draggedNode.type === 'table' && <TableComponent />}
        {draggedNode.type === 'row' && <div className="preview-placeholder">Row</div>}
        {draggedNode.type === 'col' && <div className="preview-placeholder">Col</div>}
        {draggedNode.type === 'form' && <div className="preview-placeholder">Form</div>}
        {draggedNode.type === 'formItem' && <div className="preview-placeholder">Form.Item</div>}
      </div>
    );
  };

  const renderPreview = () => {
    if (!isDragging || !virtualPositions.preview) return null;
    return <div className="drop-preview" style={virtualPositions.preview} />;
  };

  // Helper to get the container id for this level
  const getContainerId = () => {
    if (path.length === 0) return 'root';
    // Use the last node id in the path as the container id
    return nodes && nodes[0] && nodes[0].parentId ? nodes[0].parentId : path.join('-');
  };

  return (
    <>
      {path.length === 0 && renderDraggedElement()}
      {path.length === 0 && renderPreview()}
      {nodes.map((node, index) => {
        const currentPath = [...path, index];
        const key = node.id;
        const isOver = dragOverMap[node.id];
        let shiftStyle = { transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' };

        // Apply virtual positions if available
        if (virtualPositions[key]) {
          shiftStyle = { ...shiftStyle, ...virtualPositions[key] };
        }

        // Only animate siblings in the candidate container
        const thisContainerId = getContainerId();
        if (isDragging && candidateContainerId === thisContainerId && candidateDropIndex !== null) {
          if (index >= candidateDropIndex) {
            shiftStyle = { transform: 'translateY(40px)', transition: 'transform 0.2s ease-out' };
          }
        }

        if (node.type === 'row') {
          return (
            <RowContainer
              key={key}
              id={key}
              style={shiftStyle}
              onDragOver={(e) => handlers.handleDragOver(e, key, index)}
              onDragLeave={() => handlers.handleDragLeave(key)}
              onDrop={(e) => handlers.handleDrop(e, currentPath)}
              isOver={isOver}
              onDelete={() => handlers.handleDelete(currentPath)}
              hoverStack={hoverStack}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              deepestHoveredId={deepestHoveredId}
              draggable
              onDragStart={(e) => {
                e.stopPropagation();
                handlers.handleExistingDragStart(e, node, currentPath);
              }}
              onComponentClick={onComponentClick}
              node={node}
              path={currentPath}
              selectedComponent={selectedComponent}
            >
              <NodeRenderer 
                nodes={node.children} 
                path={currentPath} 
                handlers={handlers} 
                dragOverMap={dragOverMap} 
                hoverStack={hoverStack}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                deepestHoveredId={deepestHoveredId}
                onComponentClick={onComponentClick}
                selectedComponent={selectedComponent}
                mousePosition={mousePosition}
                draggedElementPosition={draggedElementPosition}
                isDragging={isDragging}
                draggedNode={draggedNode}
                dragOverIndex={dragOverIndex}
                virtualPositions={virtualPositions}
                currentContainer={currentContainer}
                candidateContainerId={candidateContainerId}
                candidateDropIndex={candidateDropIndex}
              />
            </RowContainer>
          );
        } else if (node.type === 'col') {
          return (
            <ColContainer
              key={key}
              id={key}
              style={shiftStyle}
              onDragOver={(e) => handlers.handleDragOver(e, key, index)}
              onDragLeave={() => handlers.handleDragLeave(key)}
              onDrop={(e) => handlers.handleDrop(e, currentPath)}
              isOver={isOver}
              onDelete={() => handlers.handleDelete(currentPath)}
              hoverStack={hoverStack}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              deepestHoveredId={deepestHoveredId}
              draggable
              onDragStart={(e) => {
                e.stopPropagation();
                handlers.handleExistingDragStart(e, node, currentPath);
              }}
              span={node.span}
              onComponentClick={onComponentClick}
              node={node}
              path={currentPath}
              selectedComponent={selectedComponent}
            >
              <NodeRenderer 
                nodes={node.children} 
                path={currentPath} 
                handlers={handlers} 
                dragOverMap={dragOverMap} 
                hoverStack={hoverStack}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                deepestHoveredId={deepestHoveredId}
                onComponentClick={onComponentClick}
                selectedComponent={selectedComponent}
                mousePosition={mousePosition}
                draggedElementPosition={draggedElementPosition}
                isDragging={isDragging}
                draggedNode={draggedNode}
                dragOverIndex={dragOverIndex}
                virtualPositions={virtualPositions}
                currentContainer={currentContainer}
                candidateContainerId={candidateContainerId}
                candidateDropIndex={candidateDropIndex}
              />
            </ColContainer>
          );
        } else if (node.type === 'form') {
          return (
            <FormContainer
              key={key}
              id={key}
              style={shiftStyle}
              onDragOver={(e) => handlers.handleDragOver(e, key, index)}
              onDragLeave={() => handlers.handleDragLeave(key)}
              onDrop={(e) => handlers.handleDrop(e, currentPath)}
              isOver={isOver}
              onDelete={() => handlers.handleDelete(currentPath)}
              hoverStack={hoverStack}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              deepestHoveredId={deepestHoveredId}
              draggable
              onDragStart={(e) => {
                e.stopPropagation();
                handlers.handleExistingDragStart(e, node, currentPath);
              }}
              onComponentClick={onComponentClick}
              node={node}
              path={currentPath}
              selectedComponent={selectedComponent}
            >
              <NodeRenderer
                nodes={node.children}
                path={currentPath}
                handlers={handlers}
                dragOverMap={dragOverMap}
                hoverStack={hoverStack}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                deepestHoveredId={deepestHoveredId}
                onComponentClick={onComponentClick}
                selectedComponent={selectedComponent}
                mousePosition={mousePosition}
                draggedElementPosition={draggedElementPosition}
                isDragging={isDragging}
                draggedNode={draggedNode}
                dragOverIndex={dragOverIndex}
                virtualPositions={virtualPositions}
                currentContainer={currentContainer}
                candidateContainerId={candidateContainerId}
                candidateDropIndex={candidateDropIndex}
              />
            </FormContainer>
          );
        } else if (node.type === 'formItem') {
          return (
            <FormItemContainer
              key={key}
              id={key}
              label={node.props.label}
              name={node.props.name}
              style={shiftStyle}
              onDragOver={(e) => handlers.handleDragOver(e, key, index)}
              onDragLeave={() => handlers.handleDragLeave(key)}
              onDrop={(e) => handlers.handleDrop(e, currentPath)}
              isOver={isOver}
              onDelete={() => handlers.handleDelete(currentPath)}
              hoverStack={hoverStack}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              deepestHoveredId={deepestHoveredId}
              draggable
              onDragStart={(e) => {
                e.stopPropagation();
                handlers.handleExistingDragStart(e, node, currentPath);
              }}
              onComponentClick={onComponentClick}
              node={node}
              path={currentPath}
              selectedComponent={selectedComponent}
            >
              {node.children && node.children.length > 0 ? (
                <NodeRenderer
                  nodes={node.children}
                  path={currentPath}
                  handlers={handlers}
                  dragOverMap={dragOverMap}
                  hoverStack={hoverStack}
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                  deepestHoveredId={deepestHoveredId}
                  onComponentClick={onComponentClick}
                  selectedComponent={selectedComponent}
                  mousePosition={mousePosition}
                  draggedElementPosition={draggedElementPosition}
                  isDragging={isDragging}
                  draggedNode={draggedNode}
                  dragOverIndex={dragOverIndex}
                  virtualPositions={virtualPositions}
                  currentContainer={currentContainer}
                  candidateContainerId={candidateContainerId}
                  candidateDropIndex={candidateDropIndex}
                />
              ) : (
                <Input disabled placeholder="Input" />
              )}
            </FormItemContainer>
          );
        }
        // leaf components
        const isActive = hoverStack.includes(key) && deepestHoveredId === key;
        const isSelected = selectedComponent && selectedComponent.id === key;
        return (
          <div 
            key={key} 
            id={key}
            className={`component-wrapper${isActive ? ' hovered' : ''} ${dragOverMap[key] ? ' drag-over' : ''} ${isSelected ? ' selected' : ''}`}
            data-type={node.type}
            style={{
              ...shiftStyle,
              // Hide the original only if dragging an existing node
              opacity: isDragging && draggedNode && draggedNode.id === node.id ? 0 : 1
            }}
            onMouseEnter={() => handleMouseEnter(key)}
            onMouseLeave={() => handleMouseLeave(key)}
            draggable="true"
            onDragStart={(e) => {
              e.stopPropagation();
              e.dataTransfer.effectAllowed = 'move';
              handlers.handleExistingDragStart(e, node, currentPath);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlers.handleDragOver(e, key, index);
            }}
            onDragLeave={() => handlers.handleDragLeave(key)}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlers.handleDrop(e, currentPath);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onComponentClick(node, currentPath);
            }}
          >
            <div style={{ pointerEvents: 'none' }}>
              {node.type === 'button' && <ButtonComponent label={node.props.label} />}
              {node.type === 'combobox' && <ComboBoxComponent options={node.props.options} />}
              {node.type === 'datepicker' && <DatePickerComponent />}
              {node.type === 'table' && <TableComponent />}
            </div>
            <button 
              className="delete-btn" 
              onClick={(e) => {
                e.stopPropagation();
                handlers.handleDelete(currentPath);
              }}
              style={{display: isActive ? 'flex' : 'none'}}
            >
              ×
            </button>
          </div>
        );
      })}
    </>
  );
};

export default NodeRenderer; 
import { useState, useEffect } from 'react';
import { createNode, addNodeAtPath, removeNodeAtPath } from '../utils/treeUtils';

export const useDragAndDrop = (components, setComponents) => {
  const [draggedType, setDraggedType] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [draggedPath, setDraggedPath] = useState(null);
  const [dragOverMap, setDragOverMap] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [draggedElementPosition, setDraggedElementPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [virtualPositions, setVirtualPositions] = useState({});
  const [currentContainer, setCurrentContainer] = useState(null);
  const [candidateContainerId, setCandidateContainerId] = useState(null);
  const [candidateDropIndex, setCandidateDropIndex] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setVirtualPositions({});
      setCurrentContainer(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const calculateVirtualPositions = (containerId, draggedIndex, mouseY) => {
    const container = document.getElementById(containerId);
    if (!container) return {};

    const siblings = Array.from(container.children);
    const positions = {};
    
    siblings.forEach((sibling, index) => {
      if (index === draggedIndex) return;
      
      const rect = sibling.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      
      if (mouseY < centerY && index > draggedIndex) {
        positions[sibling.id] = { transform: 'translateY(-40px)' };
      } else if (mouseY > centerY && index < draggedIndex) {
        positions[sibling.id] = { transform: 'translateY(40px)' };
      } else {
        positions[sibling.id] = { transform: 'translateY(0)' };
      }
    });
    
    return positions;
  };

  const handleDragStart = (e, type) => {
    setDraggedType(type);
    setDraggedNode(null);
    setDraggedPath(null);
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX, y: e.clientY });
    setDraggedElementPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    e.dataTransfer.effectAllowed = 'move';
    // Hide the native drag preview so our custom element is used
    if (e.dataTransfer.setDragImage) {
      const img = new Image();
      img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';
      e.dataTransfer.setDragImage(img, 0, 0);
    }
  };

  const handleExistingDragStart = (e, node, path) => {
    console.log('Drag Start:', { node, path });
    setDraggedNode(node);
    setDraggedPath(path);
    setDraggedType(null);
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX, y: e.clientY });
    setDraggedElementPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    e.dataTransfer.effectAllowed = 'move';
    if (e.dataTransfer.setDragImage) {
      const img = new Image();
      img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';
      e.dataTransfer.setDragImage(img, 0, 0);
    }
  };

  // Helper to find the candidate container and drop index
  const findCandidateContainerAndIndex = (e) => {
    let container = e.currentTarget;
    let containerId = container.id || container.getAttribute('data-id');
    if (!containerId) {
      // fallback: try parent
      container = container.parentElement;
      containerId = container?.id || container?.getAttribute('data-id');
    }
    if (!containerId) return { containerId: null, dropIndex: null };

    // Find all children (siblings)
    const siblings = Array.from(container.querySelectorAll(':scope > .component-wrapper, :scope > .canvas-row, :scope > .canvas-col'));
    // Find the index where the mouse is
    let dropIndex = siblings.length;
    for (let i = 0; i < siblings.length; i++) {
      const rect = siblings[i].getBoundingClientRect();
      if (e.clientY < rect.top + rect.height / 2) {
        dropIndex = i;
        break;
      }
    }
    return { containerId, dropIndex };
  };

  const handleDragOver = (e, id, index) => {
    e.preventDefault();
    setDragOverMap(prev => ({ ...prev, [id]: true }));
    setDragOverIndex(index);
    setMousePosition({ x: e.clientX, y: e.clientY });

    // Find candidate container and drop index
    const { containerId, dropIndex } = findCandidateContainerAndIndex(e);
    setCandidateContainerId(containerId);
    setCandidateDropIndex(dropIndex);

    // Calculate virtual positions for all affected elements
    if (containerId) {
      const container = document.getElementById(containerId) || document.querySelector(`[data-id='${containerId}']`);
      if (container) {
        const positions = {};
        
        // Get the actual height of the dragged element
        const draggedElementHeight = draggedNode ? 
          (draggedNode.type === 'row' ? 80 : 
           draggedNode.type === 'col' ? 60 : 40) : 40;

        // Get all elements in the container
        const siblings = Array.from(container.querySelectorAll(':scope > .component-wrapper, :scope > .canvas-row, :scope > .canvas-col'));
        
        // Calculate the original positions
        const originalPositions = siblings.map(sibling => {
          const rect = sibling.getBoundingClientRect();
          return {
            id: sibling.id,
            top: rect.top,
            height: rect.height
          };
        });

        // Calculate new positions as if the element was dropped
        siblings.forEach((sibling, i) => {
          const originalPos = originalPositions[i];
          let newTop = originalPos.top;

          if (i === dropIndex) {
            // Move the element at drop index down
            newTop += draggedElementHeight;
          } else if (i > dropIndex) {
            // Move all elements after drop index down
            newTop += draggedElementHeight;
          }

          // Calculate the transform needed to reach the new position
          const transform = newTop - originalPos.top;
          
          positions[sibling.id] = {
            transform: `translateY(${transform}px)`,
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          };
        });

        // Add preview for the dragged element
        if (draggedNode) {
          const dropTarget = siblings[dropIndex];
          if (dropTarget) {
            const rect = dropTarget.getBoundingClientRect();
            positions['preview'] = {
              position: 'absolute',
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: draggedElementHeight,
              background: 'rgba(3, 102, 214, 0.1)',
              border: '2px dashed #0366d6',
              borderRadius: '4px',
              pointerEvents: 'none',
              zIndex: 999,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            };
          }
        }

        setVirtualPositions(positions);
      }
    }
  };

  const handleDragLeave = (id) => {
    setDragOverMap(prev => ({ ...prev, [id]: false }));
    setDragOverIndex(null);
    setVirtualPositions({});
    setCandidateContainerId(null);
    setCandidateDropIndex(null);
  };

  const handleDrop = (e, path) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Drop:', { 
      draggedType, 
      draggedNode, 
      draggedPath, 
      dropPath: path 
    });
    
    if (draggedType) {
      // Handle new component drop
      const newNode = createNode(draggedType);
      setComponents(prev => addNodeAtPath(prev, path, newNode));
    } else if (draggedNode) {
      // Handle existing component move
      setComponents(prev => {
        console.log('Previous components:', prev);
        
        // Check if we're trying to drop into the same path
        if (JSON.stringify(draggedPath) === JSON.stringify(path)) {
          console.log('Same path, ignoring drop');
          return prev;
        }

        // Check if we're trying to drop into a child of the dragged node
        const isDroppingIntoChild = path.length > draggedPath.length && 
          draggedPath.every((item, index) => item === path[index]) &&
          path[draggedPath.length] !== undefined;
        
        if (isDroppingIntoChild) {
          console.log('Dropping into child, ignoring drop');
          return prev;
        }

        // Create a deep copy of the dragged node
        const nodeToMove = JSON.parse(JSON.stringify(draggedNode));
        
        // First remove the node from its original position
        const withoutNode = removeNodeAtPath(prev, draggedPath);
        console.log('After removal:', withoutNode);
        
        // Adjust the target path if we're moving within the same parent
        let adjustedPath = [...path];
        if (draggedPath.length === path.length && 
            draggedPath.slice(0, -1).every((item, index) => item === path[index])) {
          // If we're moving within the same parent, adjust the target index
          const sourceIndex = draggedPath[draggedPath.length - 1];
          const targetIndex = path[path.length - 1];
          if (targetIndex > sourceIndex) {
            adjustedPath[adjustedPath.length - 1] = targetIndex - 1;
          }
        }
        
        // Then add it to the new position
        const result = addNodeAtPath(withoutNode, adjustedPath, nodeToMove);
        console.log('After adding:', result);
        return result;
      });
    }
    
    setDragOverMap({});
    setDraggedType(null);
    setDraggedNode(null);
    setDraggedPath(null);
    setIsDragging(false);
    setDragOverIndex(null);
    setVirtualPositions({});
    setCurrentContainer(null);
    setCandidateContainerId(null);
    setCandidateDropIndex(null);
  };

  const handleDelete = (path) => {
    setComponents(prev => removeNodeAtPath(prev, path));
  };

  return {
    draggedType,
    draggedNode,
    draggedPath,
    dragOverMap,
    mousePosition,
    draggedElementPosition,
    isDragging,
    dragOverIndex,
    virtualPositions,
    currentContainer,
    candidateContainerId,
    candidateDropIndex,
    handleDragStart,
    handleExistingDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDelete
  };
}; 
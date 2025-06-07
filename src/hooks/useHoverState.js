import { useState } from 'react';

export const useHoverState = () => {
  const [hoverStack, setHoverStack] = useState([]);

  const handleMouseEnter = (id) => {
    setHoverStack((prev) => [...prev, id]);
  };

  const handleMouseLeave = (id) => {
    setHoverStack((prev) => prev.filter((item) => item !== id));
  };

  // The deepest hovered element is the last in the stack
  const deepestHoveredId = hoverStack.length > 0 ? hoverStack[hoverStack.length - 1] : null;

  return {
    hoverStack,
    handleMouseEnter,
    handleMouseLeave,
    deepestHoveredId
  };
}; 
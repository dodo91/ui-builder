export const createNode = (type) => {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  switch(type) {
    case 'row': return { id, type, children: [] };
    case 'col': return { id, type, children: [], span: 12 };
    case 'button': return { id, type, props: { label: 'Button' }, children: [] };
    case 'combobox': return { id, type, props: { options: ['Option 1','Option 2','Option 3'] }, children: [] };
    case 'datepicker': return { id, type, props: {}, children: [] };
    case 'table': return { id, type, props: {}, children: [] };
    default: return null;
  }
};

export const addNodeAtPath = (nodes, path, newNode) => {
  console.log('Adding at path:', { nodes, path, newNode });
  if (path.length === 0) {
    const result = [...nodes, newNode];
    console.log('Added at root level:', result);
    return result;
  }
  const [idx, ...rest] = path;
  const result = nodes.map((n, i) => 
    i === idx 
      ? { ...n, children: addNodeAtPath(n.children, rest, newNode) }
      : n
  );
  console.log('Added at nested level:', result);
  return result;
};

export const removeNodeAtPath = (nodes, path) => {
  console.log('Removing at path:', { nodes, path });
  if (path.length === 1) {
    const idx = path[0];
    const result = [...nodes.slice(0, idx), ...nodes.slice(idx + 1)];
    console.log('Removed at root level:', result);
    return result;
  }
  const [idx, ...rest] = path;
  const result = nodes.map((n, i) => 
    i === idx 
      ? { ...n, children: removeNodeAtPath(n.children, rest) }
      : n
  );
  console.log('Removed at nested level:', result);
  return result;
};

export const updateNodeAtPath = (nodes, path, updatedNode) => {
  if (path.length === 0) return nodes;
  const [idx, ...rest] = path;
  return nodes.map((node, i) => 
    i === idx 
      ? rest.length === 0 
        ? updatedNode 
        : { ...node, children: updateNodeAtPath(node.children, rest, updatedNode) }
      : node
  );
}; 
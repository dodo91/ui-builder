export const createNode = (type) => {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  switch(type) {
    case 'row': return { id, type, children: [] };
    case 'col': return { id, type, children: [], span: 12 };
    case 'form': return { id, type, children: [], props: {} };
    case 'formItem': return { id, type, children: [], props: { label: 'Label', name: 'field' } };
    case 'button': return { id, type, props: { label: 'Button' }, children: [] };
    case 'combobox': return { id, type, props: { options: ['Option 1','Option 2','Option 3'] }, children: [] };
    case 'datepicker': return { id, type, props: {}, children: [] };
    case 'table': return { id, type, props: {}, children: [] };
    default: return null;
  }
};

export const addNodeAtPath = (nodes, path, newNode) => {
  if (path.length === 0) {
    return [...nodes, newNode];
  }
  const [idx, ...rest] = path;
  const result = nodes.map((n, i) =>
    i === idx
      ? { ...n, children: addNodeAtPath(n.children, rest, newNode) }
      : n
  );
  return result;
};

export const removeNodeAtPath = (nodes, path) => {
  if (path.length === 1) {
    const idx = path[0];
    return [...nodes.slice(0, idx), ...nodes.slice(idx + 1)];
  }
  const [idx, ...rest] = path;
  const result = nodes.map((n, i) =>
    i === idx
      ? { ...n, children: removeNodeAtPath(n.children, rest) }
      : n
  );
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

export const getNodeAtPath = (nodes, path) => {
  let current = { children: nodes };
  for (let idx of path) {
    if (!current.children || !current.children[idx]) return null;
    current = current.children[idx];
  }
  return current;
};

export const findPathById = (nodes, id, currentPath = []) => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.id === id) {
      return [...currentPath, i];
    }
    if (node.children) {
      const childPath = findPathById(node.children, id, [...currentPath, i]);
      if (childPath) {
        return childPath;
      }
    }
  }
  return null;
};

export const insertNodeAtPath = (nodes, path, newNode) => {
  if (path.length === 1) {
    const index = path[0];
    return [
      ...nodes.slice(0, index),
      newNode,
      ...nodes.slice(index)
    ];
  }
  const [idx, ...rest] = path;
  return nodes.map((n, i) =>
    i === idx
      ? { ...n, children: insertNodeAtPath(n.children, rest, newNode) }
      : n
  );
};

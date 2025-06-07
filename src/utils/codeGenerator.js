export const generateCode = (components) => {
  function renderNode(node, indent = 6) {
    const spaces = ' '.repeat(indent);
    if (node.type === 'row') {
      return `${spaces}<Row>\n${node.children.map(child => renderNode(child, indent + 2)).join('\n')}\n${spaces}</Row>`;
    } else if (node.type === 'col') {
      return `${spaces}<Col>\n${node.children.map(child => renderNode(child, indent + 2)).join('\n')}\n${spaces}</Col>`;
    } else if (node.type === 'button') {
      return `${spaces}<button>${node.props.label}</button>`;
    } else if (node.type === 'combobox') {
      return `${spaces}<select>\n${node.props.options.map(opt => `${spaces}  <option>${opt}</option>`).join('\n')}\n${spaces}</select>`;
    } else if (node.type === 'datepicker') {
      return `${spaces}<DatePicker />`;
    } else if (node.type === 'table') {
      return `${spaces}<TableComponent />`;
    }
    return '';
  }

  return `import React from 'react';\n\nfunction MyComponent() {\n  return (\n    <div>\n${components.map(node => renderNode(node)).join('\n')}\n    </div>\n  );\n}\n\nexport default MyComponent;`;
}; 
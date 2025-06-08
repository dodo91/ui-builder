import React from 'react';
import { Input, InputNumber } from 'antd';

const PropertiesEditor = ({ selectedComponent, onUpdate }) => {
  if (!selectedComponent) {
    return <div className="properties-panel">Select a component to edit its properties</div>;
  }

  const handlePropertyChange = (key, value) => {
    onUpdate({
      ...selectedComponent,
      props: {
        ...selectedComponent.props,
        [key]: value
      }
    });
  };

  const renderPropertyEditor = () => {
    switch (selectedComponent.type) {
      case 'button':
        return (
          <div className="property-group">
            <label>Label</label>
            <Input
              value={selectedComponent.props.label}
              onChange={(e) => handlePropertyChange('label', e.target.value)}
            />
          </div>
        );
      case 'combobox':
        return (
          <div className="property-group">
            <label>Options</label>
            <Input.TextArea
              value={selectedComponent.props.options.join('\n')}
              onChange={(e) => handlePropertyChange('options', e.target.value.split('\n'))}
              rows={4}
            />
          </div>
        );
      case 'col':
        return (
          <div className="property-group">
            <label>Span</label>
            <InputNumber
              min={1}
              max={24}
              value={selectedComponent.span}
              onChange={(value) => onUpdate({ ...selectedComponent, span: value })}
            />
          </div>
        );
      case 'formItem':
        return (
          <>
            <div className="property-group">
              <label>Label</label>
              <Input
                value={selectedComponent.props.label}
                onChange={(e) => handlePropertyChange('label', e.target.value)}
              />
            </div>
            <div className="property-group">
              <label>Name</label>
              <Input
                value={selectedComponent.props.name}
                onChange={(e) => handlePropertyChange('name', e.target.value)}
              />
            </div>
          </>
        );
      default:
        return <div>No properties available for this component</div>;
    }
  };

  return (
    <div className="properties-panel">
      <h4>Properties</h4>
      {renderPropertyEditor()}
    </div>
  );
};

export default PropertiesEditor; 
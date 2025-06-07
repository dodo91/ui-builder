import React from 'react';
import { DatePicker, Table, Button, Select } from 'antd';
import { dataSource, columns } from '../constants/componentData';

export const ButtonComponent = ({ label }) => <Button>{label}</Button>;

export const ComboBoxComponent = ({ options }) => (
  <Select
    style={{ width: '100%' }}
    defaultValue={options[0]}
  >
    {options.map((option, index) => (
      <Select.Option key={index} value={option}>{option}</Select.Option>
    ))}
  </Select>
);

export const DatePickerComponent = () => <DatePicker />;

export const TableComponent = () => <Table dataSource={dataSource} columns={columns} />; 
import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Checkbox, Radio, Select, AutoComplete, Spin } from 'antd';
import axios from 'axios';

const { Option } = Select;

const DynamicField = ({ field }) => {
  const [options, setOptions] = useState(field.options || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (field.api) {
      setLoading(true);
      axios.get(field.api)
        .then(response => {
          const data = response.data;
          setOptions(Array.isArray(data) ? data : []);
        })
        .catch(error => {
          console.error(`Error fetching data for ${field.label}:`, error);
        })
        .finally(() => setLoading(false));
    }
  }, [field.api, field.label]);

  const commonProps = {
    label: field.label,
    name: field.label.replace(/\s+/g, '_').toLowerCase(),
    rules: field.required ? [{ required: true, message: `${field.label} is required` }] : []
  };

  const renderOptions = () => options.map(opt => (
    <Option key={opt} value={opt}>{opt}</Option>
  ));

  switch (field.type) {
    case 'text':
      return <Form.Item {...commonProps}><Input maxLength={field.maxLength} /></Form.Item>;
    case 'date':
      return <Form.Item {...commonProps}><DatePicker style={{ width: '100%' }} /></Form.Item>;
    case 'checkbox':
      return <Form.Item {...commonProps} valuePropName="checked"><Checkbox>{field.label}</Checkbox></Form.Item>;
    case 'radio':
      return (
        <Form.Item {...commonProps}>
          <Radio.Group>
            {options.map(opt => <Radio key={opt} value={opt}>{opt}</Radio>)}
          </Radio.Group>
        </Form.Item>
      );
    case 'autocomplete':
      return (
        <Form.Item {...commonProps}>
          <AutoComplete options={options.map(opt => ({ value: opt }))} />
        </Form.Item>
      );
    case 'select':
      return (
        <Form.Item {...commonProps}>
          <Select loading={loading}>{renderOptions()}</Select>
        </Form.Item>
      );
    case 'multiselect':
      return (
        <Form.Item {...commonProps}>
          <Select mode="multiple" loading={loading}>{renderOptions()}</Select>
        </Form.Item>
      );
    default:
      return null;
  }
};

const DynamicForm = ({ fields }) => (
  <Form layout="vertical">
    {fields.map((field, idx) => <DynamicField key={idx} field={field} />)}
  </Form>
);

export default DynamicForm;
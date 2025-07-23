import React from 'react';
import { Table } from 'antd';

// Main table data
const mainData = [
  {
    key: '1',
    name: 'John Doe',
    age: 32,
    address: 'New York',
    details: [
      { key: '1-1', date: '2025-07-01', activity: 'Logged in' },
      { key: '1-2', date: '2025-07-02', activity: 'Changed password' },
    ],
  },
  {
    key: '2',
    name: 'Jane Smith',
    age: 28,
    address: 'London',
    details: [
      { key: '2-1', date: '2025-07-03', activity: 'Logged out' },
    ],
  },
];

// Columns for main table
const mainColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
];

// Columns for nested table
const nestedColumns = [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Activity', dataIndex: 'activity', key: 'activity' },
];

const NestedTable = () => {
  return (
    <Table
      columns={mainColumns}
      dataSource={mainData}
      expandable={{
        expandedRowRender: (record) => (
          <Table
            columns={nestedColumns            dataSource={record.details}
            pagination={false}
          />
        ),
        rowExpandable: (record) => record.details.length > 0,
      }}
    />
  );
};

export default NestedTable;

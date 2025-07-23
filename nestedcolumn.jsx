import React, { useState } from 'react';
import { Table, Button } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

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

const mainColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
];

const nestedColumns = [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Activity', dataIndex: 'activity', key: 'activity' },
];

const CustomExpandTable = () => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const toggleExpand = (record) => {
    const key = record.key;
    setExpandedRowKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const columnsWithAction = [
    ...mainColumns,
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => toggleExpand(record)}
          icon={expandedRowKeys.includes(record.key) ? <DownOutlined /> : <RightOutlined />}
        >
          {expandedRowKeys.includes(record.key) ? 'Collapse' : 'Expand'}
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columnsWithAction}
      dataSource={mainData}
      expandable={{
        expandedRowRender: (record) => (
          <Table
            columns={nestedColumns}
            dataSource={record.details}
            pagination={false}
          />
        ),
        expandedRowKeys,
        onExpandedRowsChange: setExpandedRowKeys,
        expandIconColumnIndex: -1, // disables default expand icon
      }}
    />
  );
};

export default CustomExpandTable;

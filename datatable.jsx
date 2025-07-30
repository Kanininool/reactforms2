import React, { useState } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const data = [
  { key: '1', firstName: 'John', lastName: 'Brown', age: 32 },
  { key: '2', firstName: 'Jim', lastName: 'Green', age: 42 },
  { key: '3', firstName: 'Joe', lastName: 'Black', age: 29 },
  { key: '4', firstName: 'Jake', lastName: 'White', age: 36 },
];

const App = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      `${item.firstName} ${item.lastName}`.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleReset = () => {
    setSearchText('');
    setFilteredData(data);
  };

  const columns = [
    {
      title: 'Full Name',
      key: 'fullName',
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search First or Last Name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={handleSearch}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={handleReset}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => document.querySelector('input')?.focus(), 100);
        }
      },
      render: (_, record) => (
        <div>
          <div>{record.firstName}</div>
          <div style={{ color: 'gray' }}>{record.lastName}</div>
             title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
  ];

  return <Table columns={columns} dataSource={filteredData} />;
};

export default App;

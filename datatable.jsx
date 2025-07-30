import React, { useState, useRef } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const data = [
  { key: '1', firstName: 'John', lastName: 'Brown', age: 32 },
  { key: '2', firstName: 'Jim', lastName: 'Green', age: 42 },
  { key: '3', firstName: 'Joe', lastName: 'Black', age: 29 },
];

const App = () => {
  const [searchFirst, setSearchFirst] = useState('');
  const [searchLast, setSearchLast] = useState('');
  const searchInputFirst = useRef(null);
  const searchInputLast = useRef(null);

  const handleSearch = (confirm) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchFirst('');
    setSearchLast('');
  };

  const columns = [
    {
      title: 'Full Name',
      key: 'fullName',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInputFirst}
            placeholder="Search First Name"
            value={searchFirst}
            onChange={(e) => setSearchFirst(e.target.value)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Input
            ref={searchInputLast}
            placeholder="Search Last Name"
            value={searchLast}
            onChange={(e) => setSearchLast(e.target.value)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(confirm)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
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
      onFilter: (_, record) => {
        const firstMatch = record.firstName
          .toLowerCase()
          .includes(searchFirst.toLowerCase());
        const lastMatch = record.lastName
          .toLowerCase()
          .includes(searchLast.toLowerCase());
        return firstMatch && lastMatch;
      },
      render: (_, record) => (
        <div>
          <div>
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
             searchFirst]}
              autoEscape
              textToHighlight={record.firstName}
            />
          </div>
          <div style={{ color: 'gray' }}>
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[searchLast]}
              autoEscape
              textToHighlight={record.lastName}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default App;

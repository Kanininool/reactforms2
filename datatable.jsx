import React, { useState } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const initialData = [
  {
    key: '1',
    firstName: 'John', lastName: 'Doe',
    ageYears: '30', ageMonths: '6',
    gender: 'Male', pronouns: 'He/Him',
    dob: '1993-01-15', birthPlace: 'New York',
    primarySkill: 'React', secondarySkill: 'Node.js',
    totalExpYears: '8', totalExpMonths: '3',
    relevantExpYears: '5', relevantExpMonths: '2',
    teamLead: 'Alice Smith', teamLeadEmail: 'alice@example.com',
    manager: 'Bob Johnson', managerEmail: 'bob@example.com',
    company: 'TechCorp', location: 'San Francisco',
  },
  {
    key: '2',
    firstName: 'Jane', lastName: 'Smith',
    ageYears: '28', ageMonths: '2',
    gender: 'Female', pronouns: 'She/Her',
    dob: '1995-05-20', birthPlace: 'Chicago',
    primarySkill: 'Angular', secondarySkill: 'Java',
    totalExpYears: '6', totalExpMonths: '10',
    relevantExpYears: '4', relevantExpMonths: '6',
    teamLead: 'Charlie Ray', teamLeadEmail: 'charlie@example.com',
    manager: 'Dana Lee', managerEmail: 'dana@example.com',
    company: 'InnovateX', location: 'Austin',
  },
];

const App = () => {
  const [filters, setFilters] = useState({});
  const [filteredData, setFilteredData] = useState(initialData);

  const handleSearch = (fieldA, fieldB, valueA, valueB) => {
    const newFilters = { ...filters, [fieldA]: valueA, [fieldB]: valueB };
    setFilters(newFilters);

    const filtered = initialData.filter((item) => {
      const matchA = (item[fieldA] || '').toLowerCase().includes(valueA.toLowerCase());
      const matchB = fieldB
        ? (item[fieldB] || '').toLowerCase().includes(valueB.toLowerCase())
        : true;
      return matchA && matchB;
    });

    setFilteredData(filtered);
  };

  const handleReset = (fieldA, fieldB) => {
    const newFilters = { ...filters, [fieldA]: '', [fieldB]: '' };
    setFilters(newFilters);
    setFilteredData(initialData);
  };

  const getColumn = (title, fieldA, fieldB = null) => ({
    title,
    key: fieldA,
    filterDropdown: () => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${fieldA}`}
          value={filters[fieldA] || ''}
          onChange={(e) =>
            handleSearch(fieldA, fieldB, e.target.value, filters[fieldB] || '')
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        {fieldB && (
          <Input
            placeholder={`Search ${fieldB}`}
            value={filters[fieldB] || ''}
            onChange={(e) =>
              handleSearch(fieldA, fieldB, filters[fieldA] || '', e.target.value)
            }
            style={{ marginBottom: 8, display: 'block' }}
          />
        )}
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(
                fieldA,
                fieldB,
                filters[fieldA] || '',
                fieldB ? filters[fieldB] || '' : ''
              )
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(fieldA, fieldB)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: () => {
      const isFiltered =
        (filters[fieldA] && filters[fieldA].trim() !== '') ||
        (fieldB && filters[fieldB] && filters[fieldB].trim() !== '');
      return <SearchOutlined style={{ color: isFiltered ? '#1890ff' : undefined }} />;
    },
    render: (_, record) => (
      <div>
        <div>{record[fieldA] || '-'}</div>
        {fieldB && <div style={{ color: 'gray' }}>{record[fieldB] || '-'}</div>}
      </div>
    ),
  });

  const columns = [
    getColumn('Name', 'firstName', 'lastName'),
    getColumn('Age', 'ageYears', 'ageMonths'),
    getColumn('Gender', 'gender', 'pronouns'),
    getColumn('Date of Birth', 'dob', 'birthPlace'),
    getColumn('Skills', 'primarySkill', 'secondarySkill'),
    getColumn('Total Experience', 'totalExpYears', 'totalExpMonths'),
    getColumn('Relevant Experience', 'relevantExpYears', 'relevantExpMonths'),
    getColumn('Team Lead', 'teamLead', 'teamLeadEmail'),
    getColumn('Manager', 'manager', 'managerEmail'),
    getColumn('Company', 'company', 'location'), // Can also be just getColumn('Company', 'company') if needed
  ];

  return <Table columns={columns} dataSource={filteredData} />;
};

export default App;

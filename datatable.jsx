import React, { useState } from 'react';
import { Table, Input, InputNumber, Button, Space, DatePicker } from 'antd';
import { SearchOutlined, FilterFilled } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

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

  const handleSearch = (fieldA, fieldB, valueA, valueB, isRange = false, isDate = false) => {
    const newFilters = { ...filters, [fieldA]: valueA, [fieldB]: valueB };
    setFilters(newFilters);

    const filtered = initialData.filter((item) => {
      if (isRange) {
        const totalMonths =
          parseInt(item[fieldA] || 0) * 12 + parseInt(item[fieldB] || 0);
        const min = valueA ?? 0;
        const max = valueB ?? Infinity;
        return totalMonths >= min && totalMonths <= max;
      } else if (isDate) {
        const dob = dayjs(item[fieldA]);
        const start = valueA ? dayjs(valueA) : null;
        const end = valueB ? dayjs(valueB) : null;
        return (!start || dob.isAfter(start) || dob.isSame(start)) &&
               (!end || dob.isBefore(end) || dob.isSame(end));
      } else {
        const matchA = (item[fieldA] || '').toLowerCase().includes((valueA || '').toLowerCase());
        const matchB = fieldB
          ? (item[fieldB] || '').toLowerCase().includes((valueB || '').toLowerCase())
          : true;
        return matchA && matchB;
      }
    });

    setFilteredData(filtered);
  };

  const handleReset = (fieldA, fieldB) => {
    const newFilters = { ...filters, [fieldA]: '', [fieldB]: '' };
    setFilters(newFilters);
    setFilteredData(initialData);
  };

  const getColumn = (title, fieldA, fieldB = null, isRange = false, isDate = false) => ({
    title,
    key: fieldA,
    filterDropdown: () => (
      <div style={{ padding: 8 }}>
        {isRange ? (
          <>
            <InputNumber
              placeholder="Min (months)"
              value={filters[fieldA]}
              onChange={(value) =>
                handleSearch(fieldA, fieldB, value, filters[fieldB], true)
              }
              style={{ marginBottom: 8, display: 'block', width: '100%' }}
            />
            <InputNumber
              placeholder="Max (months)"
              value={filters[fieldB]}
              onChange={(value) =>
                handleSearch(fieldA, fieldB, filters[fieldA], value, true)
              }
              style={{ marginBottom: 8, display: 'block', width: '100%' }}
            />
          </>
        ) : isDate ? (
          <RangePicker
            style={{ width: '100%' }}
            onChange={(dates) =>
              handleSearch(
                fieldA,
                fieldB,
                dates?.[0]?.format('YYYY-MM-DD'),
                dates?.[1]?.format('YYYY-MM-DD'),
                false,
                true
              )
            }
          />
        ) : (
          <>
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
          </>
        )}
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(
                fieldA,
                fieldB,
                filters[fieldA] || '',
                filters[fieldB] || '',
                isRange,
                isDate
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
        (filters[fieldA] && filters[fieldA].toString().trim() !== '') ||
        (fieldB && filters[fieldB] && filters[fieldB].toString().trim() !== '');
      return isFiltered ? (
        <FilterFilled style={{ color: '#1890ff' }} />
      ) : (
        <SearchOutlined />
      );
    },
    render: (_, record) => {
      const valueA = record[fieldA] || '-';
      const valueB = fieldB ? record[fieldB] || '-' : null;
      return (
        <div>
          <div>{valueA}</div>
          {fieldB && <div style={{ color: 'gray' }}>{valueB}</div>}
        </div>
      );
    },
  });

  const columns = [
    getColumn('Name', 'firstName', 'lastName'),
    getColumn('Age', 'ageYears', 'ageMonths'),
    getColumn('Gender', 'gender', 'pronouns'),
    getColumn('Date of Birth', 'dob', 'birthPlace', false, true),
    getColumn('Skills', 'primarySkill', 'secondarySkill'),
    getColumn('Total Experience', 'totalExpYears', 'totalExpMonths', true),
    getColumn('Relevant Experience', 'relevantExpYears', 'relevantExpMonths', true),
    getColumn('Team Lead', 'teamLead', 'teamLeadEmail'),
    getColumn('Manager', 'manager', 'managerEmail'),
    getColumn('Company', 'company', 'location'),
  ];

  return <Table columns={columns} dataSource={filteredData} />;
};

export default App;

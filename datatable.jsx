
import React, { useState } from 'react';
import {
  Table,
  Input,
  Button,
  DatePicker,
  InputNumber,
} from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const generateData = () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      name: `Name ${i}`,
      id: `ID${1000 + i}`,
      age: 20 + (i % 30),
      city: `City ${i % 10}`,
      status: i % 2 === 0 ? 'Active' : 'Inactive',
      department: `Dept ${i % 5}`,
      salary: 30000 + (i * 100),
      joinDate: dayjs().subtract(i, 'day').format('YYYY-MM-DD'),
      project: `Project ${i % 7}`,
      manager: `Manager ${i % 4}`,
    });
  }
  return data;
};

const App = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(generateData());

  const handleGlobalSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = generateData().filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(value)
      )
    );
    setFilteredData(filtered);
  };

  const getCombinedFilterDropdown = (fields, types, setSelectedKeys, selectedKeys, confirm, clearFilters) => {
    const filters = selectedKeys[0] || {};
    return (
      <div style={{ padding: 8 }}>
        {fields.map((field, index) => {
          const type = types[index];
          if (type === 'date') {
            return (
              <div key={field} style={{ marginBottom: 8 }}>
                <div>{field}</div>
                <RangePicker
                  onChange={(dates) => {
                    const [start, end] = dates || [];
                    setSelectedKeys([
                      {
                        ...filters,
                        [field]: start && end ? [start, end] : [],
                      },
                    ]);
                  }}
                />
              </div>
            );
          } else if (type === 'number') {
            return (
              <div key={field} style={{ marginBottom: 8 }}>
                <div>{field}</div>
                <InputNumber
                  placeholder="Min"
                  onChange={(val) =>
                    setSelectedKeys([
                      {
                        ...filters,
                        [field]: [val, filters?.[field]?.[1]],
                      },
                    ])
                  }
                  style={{ width: 90 }}
                />
                <InputNumber
                  placeholder="Max"
                  onChange={(val) =>
                    setSelectedKeys([
                      {
                        ...filters,
                        [field]: [filters?.[field]?.[0], val],
                      },
                    ])
                  }
                  style={{ width: 90, marginLeft: 8 }}
                />
              </div>
            );
          } else {
            return (
              <div key={field} style={{ marginBottom: 8 }}>
                <Input
                  placeholder={`Search ${field}`}
                  value={filters?.[field] || ''}
                  onChange={(e) =>
                    setSelectedKeys([
                      {
                        ...filters,
                        [field]: e.target.value,
                      },
                    ])
                  }
                />
              </div>
            );
          }
        })}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: '48%' }}
          >
            Filter
          </Button>
          <Button
            onClick={() => {
              setSelectedKeys([]);
              confirm();
            }}
            size="small"
            style={{ width: '48%' }}
          >
            Reset
          </Button>
        </div>
      </div>
    );
  };

  const getCombinedFilter = (fields, types) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>
      getCombinedFilterDropdown(fields, types, setSelectedKeys, selectedKeys, confirm, clearFilters),
    onFilter: (value, record) => {
      const filters = value || {};
      return fields.every((field, index) => {
        const val = filters[field];
        if (!val || val.length === 0) return true;
        if (types[index] === 'date') {
          const [start, end] = val;
          const date = dayjs(record[field]);
          return date.isAfter(start) && date.isBefore(end);
        } else if (types[index] === 'number') {
          const [min, max] = val;
          return record[field] >= min && record[field] <= max;
        } else {
          return String(record[field]).toLowerCase().includes(String(val).toLowerCase());
        }
      });
    },
  });

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'table_data.xlsx');
  };

  const columns = [
    {
      title: 'Name & ID',
      key: 'nameId',
      render: (_, record) => (
        <div>
          <div><strong>{record.name}</strong></div>
          <div style={{ color: 'gray' }}>{record.id}</div>
        </div>
      ),
      ...getCombinedFilter(['name', 'id'], ['text', 'text']),
    },
    {
      title: 'Age & City',
      key: 'ageCity',
      render: (_, record) => (
        <div>
          <div>Age: {record.age}</div>
          <div>City: {record.city}</div>
        </div>
      ),
      ...getCombinedFilter(['age', 'city'], ['number', 'text']),
    },
    {
      title: 'Status & Department',
      key: 'statusDept',
      render: (_, record) => (
        <div>
          <div>Status: {record.status}</div>
          <div>Dept: {record.department}</div>
        </div>
      ),
      ...getCombinedFilter(['status', 'department'], ['text', 'text']),
    },
    {
      title: 'Salary & Join Date',
      key: 'salaryJoinDate',
      render: (_, record) => (
        <div>
          <div>Salary: {record.salary}</div>
          <div>Date: {record.joinDate}</div>
        </div>
      ),
      ...getCombinedFilter(['salary', 'joinDate'], ['number', 'date']),
    },
    {
      title: 'Project & Manager',
      key: 'projectManager',
      render: (_, record) => (
        <div>
          <div>Project: {record.project}</div>
          <div>Manager: {record.manager}</div>
        </div>
      ),
      ...getCombinedFilter(['project', 'manager'], ['text', 'text']),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Input
        placeholder="Global Search"
        value={searchText}
        onChange={handleGlobalSearch}
        style={{ marginBottom: 16, width: 300 }}
        prefix={<SearchOutlined />}
      />
      <Button
        icon={<DownloadOutlined />}
        onClick={downloadExcel}
        style={{ marginLeft: 16 }}
      >
        Download Excel
      </Button>
      <Table columns={columns} dataSource={filteredData} />
    </div>
  );
};

export default App;

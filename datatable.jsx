
import React, { useState, useMemo } from 'react';
import {
  Table,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Select,
} from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const fieldTypes = {
  name: 'text',
  id: 'text',
  age: 'number',
  city: 'text',
  status: 'text',
  department: 'text',
  salary: 'number',
  joinDate: 'date',
  project: 'text',
  manager: 'text',
};

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
  const originalData = useMemo(() => generateData(), []);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({});

  const handleGlobalSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const getUniqueValues = (field) => [
    ...new Set(originalData.map((item) => item[field])),
  ];

  const filteredData = useMemo(() => {
    return originalData.filter((record) => {
      const globalMatch = Object.values(record).some((val) =>
        String(val).toLowerCase().includes(searchText)
      );

      const fieldMatch = Object.entries(filters).every(([field, val]) => {
        const type = fieldTypes[field];
        if (!val || val.length === 0) return true;

        if (type === 'date') {
          const [start, end] = val;
          const date = dayjs(record[field]);
          return date.isAfter(start) && date.isBefore(end);
        } else if (type === 'number') {
          const [min, max] = val;
          return record[field] >= min && record[field] <= max;
        } else if (type === 'text') {
          return val.includes(record[field]);
        }

        return true;
      });

      return globalMatch && fieldMatch;
    });
  }, [originalData, searchText, filters]);

  const getCombinedFilterDropdown = (fields, confirm) => {
    return (
      <div style={{ padding: 8, maxHeight: 400, overflowY: 'auto' }}>
        {fields.map((field) => {
          const type = fieldTypes[field];
          const uniqueOptions = getUniqueValues(field);
          if (type === 'date') {
            return (
              <div key={field} style={{ marginBottom: 8 }}>
                <div>{field}</div>
                <RangePicker
                  onChange={(dates) => {
                    const [start, end] = dates || [];
                    setFilters((prev) => ({
                      ...prev,
                      [field]: start && end ? [start, end] : [],
                    }));
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
                    setFilters((prev) => ({
                      ...prev,
                      [field]: [val, prev?.[field]?.[1]],
                    }))
                  }
                  style={{ width: 90 }}
                />
                <InputNumber
                  placeholder="Max"
                  onChange={(val) =>
                    setFilters((prev) => ({
                      ...prev,
                      [field]: [prev?.[field]?.[0], val],
                    }))
                  }
                  style={{ width: 90, marginLeft: 8 }}
                />
              </div>
            );
          } else {
            return (
              <div key={field} style={{ marginBottom: 8 }}>
                <div>{field}</div>
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '100%' }}
                  placeholder={`Select ${field}`}
                  value={filters?.[field] || []}
                  onChange={(vals) =>
                    setFilters((prev) => ({
                      ...prev,
                      [field]: vals,
                    }))
                  }
                >
                  {uniqueOptions.map((val) => (
                    <Option key={val} value={val}>
                      {val}
                    </Option>
                  ))}
                </Select>
              </div>
            );
          }
        })}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <Button type="primary" onClick={confirm} size="small" style={{ width: '48%' }}>
            Filter
          </Button>
          <Button
            onClick={() => {
              const resetFields = {};
              fields.forEach((f) => (resetFields[f] = []));
              setFilters((prev) => ({ ...prev, ...resetFields }));
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

  const getCombinedColumn = (title, fields) => ({
    title,
    key: title,
    sorter: (a, b) => {
      const fieldA = a[fields[0]];
      const fieldB = b[fields[0]];
      return typeof fieldA === 'number'
        ? fieldA - fieldB
        : String(fieldA).localeCompare(String(fieldB));
    },
    render: (_, record) => (
      <div>
        {fields.map((field) => (
          <div key={field}>
            <strong>{field}:</strong> {record[field]}
          </div>
        ))}
      </div>
    ),
    filterDropdown: ({ confirm }) =>
      getCombinedFilterDropdown(fields, confirm),
    onFilterDropdownVisibleChange: () => {},
  });

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FilteredData');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'filtered_table_data.xlsx');
  };

  const columns = [
    getCombinedColumn('Name & ID', ['name', 'id']),
    getCombinedColumn('Age & City', ['age', 'city']),
    getCombinedColumn('Status & Department', ['status', 'department']),
    getCombinedColumn('Salary & Join Date', ['salary', 'joinDate']),
    getCombinedColumn('Project & Manager', ['project', 'manager']),
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
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default App;

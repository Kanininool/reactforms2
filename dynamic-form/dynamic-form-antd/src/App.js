import React from 'react';
import { Tabs } from 'antd';
import DynamicForm from './components/DynamicForm';
import config from './config/formConfig.json';
import 'antd/dist/antd.css';

const { TabPane } = Tabs;

function App() {
  return (
    <div style={{ padding: 24 }}>
      <Tabs defaultActiveKey="0">
        {config.tabs.map((tab, index) => (
          <TabPane tab={tab.name} key={index}>
            <DynamicForm fields={tab.fields} />
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
}

export default App;
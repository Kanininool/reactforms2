// App.js
import React, { useState } from "react";
import { Tabs, Badge, Table, Layout } from "antd";
import "antd/dist/reset.css"; // Ant Design v5 uses reset.css
import "./App.css"; // Optional for custom styling

const { TabPane } = Tabs;
const { Header, Content } = Layout;

const sampleData = [
  { key: 1, name: "Alice", role: "Engineer" },
  { key: 2, name: "Bob", role: "Designer" },
  { key: 3, name: "Charlie", role: "Manager" },
  { key: 4, name: "David", role: "Intern" },
  { key: 5, name: "Eve", role: "Engineer" }
];

const columns = [
  { title: "ID", dataIndex: "key", key: "key" },
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Role", dataIndex: "role", key: "role" }
];

function App() {
  const [activeKey, setActiveKey] = useState("1");

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ color: "#fff", fontSize: "20px" }}>Ant Design Tabbed Table</Header>
      <Content style={{ padding: "20px" }}>
        <Tabs activeKey={activeKey} onChange={handleTabChange} centered>
          {[...Array(5)].map((_, index) => {
            const tabKey = (index + 1).toString();
            return (
              <TabPane
                tab={
                  <Badge count={sampleData.length} offset={[10, 0]}>
                    {`Tab ${tabKey}`}
                  </Badge>
                }
                key={tabKey}
              >
                <Table columns={columns} dataSource={sampleData} pagination={false} />
              </TabPane>
            );
          })}
        </Tabs>
      </Content>
    </Layout>
  );
}

export default App;

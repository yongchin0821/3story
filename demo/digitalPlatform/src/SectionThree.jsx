import React from "react";
import {
  CreditCardOutlined,
  FundProjectionScreenOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card } from "antd";

const cardStyle = {
  width: 400,
  background: "rgba(255,255,255,0)",
  marginBottom: 20,
  boxShadow: "10px 10px 14px 5px rgba(0,0,0,0.05)",
};

const iconStyle = {
  fontSize: 50,
};

const SectionThree = () => {
  return (
    <div className="flex justify-around">
      <div>
        <Card style={cardStyle}>
          <Card.Meta
            avatar={<CreditCardOutlined style={iconStyle} />}
            title="数据平台化"
            description={
              <p style={{ color: "black" }}>
                数据资产、元数据、数据血缘、数据质控
              </p>
            }
          ></Card.Meta>
        </Card>
        <Card style={cardStyle}>
          <Card.Meta
            avatar={<FundProjectionScreenOutlined style={iconStyle} />}
            title="数据可视化"
            description={
              <p style={{ color: "black" }}>
                全生命周期监控、数字大屏、数字孪生、数据治理工作台
              </p>
            }
          ></Card.Meta>
        </Card>
        <Card style={cardStyle}>
          <Card.Meta
            avatar={<UserOutlined style={iconStyle} />}
            title="数据智能化"
            description={
              <p style={{ color: "black" }}>
                自动探查数据质量、只能扫描敏感数据、强化学习决策
              </p>
            }
          ></Card.Meta>
        </Card>
      </div>
      <div style={{zIndex:'1'}}>
        <img src="/ai.svg" className="section-img"></img>
      </div>
    </div>
  );
};

export default SectionThree;

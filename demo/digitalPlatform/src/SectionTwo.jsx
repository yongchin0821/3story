import React, { useState, useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { motion } from "motion/react";
import { countAtom } from "./atoms";
import { Statistic, Card, Avatar } from "antd";

const cardStyle = {
  width: 300,
  background: "rgba(255,255,255,0)",
  marginBottom: 20,
  borderColor: "#DCD9D9",
};

const SectionTwo = () => {
  const [animations, setAnimations] = useState([]);
  const [animations2, setAnimations2] = useState([]);
  const [animations3, setAnimations3] = useState([]);

  const batteryVal = useRef(123233);
  const lampVal = useRef(2332);
  const stationVal = useRef(2222);

  const animeAtom = useAtomValue(countAtom);
  console.log("Sectwo");

  useEffect(() => {
    const id = Date.now();
    switch (animeAtom.iconindex) {
      case 0:
        if (animeAtom.play) {
          setAnimations2([{ id: id }]);
          lampVal.current += 1;
        } else {
          setAnimations2([]);
        }
        break;
      case 1:
        if (animeAtom.play) {
          setAnimations3([{ id: id }]);
          stationVal.current += 1;
        } else {
          setAnimations3([]);
        }
        break;
      case 2:
        if (animeAtom.play) {
          batteryVal.current += 1;
          setAnimations([{ id: id }]);
        } else {
          setAnimations([]);
        }
        break;
    }
  }, [animeAtom]);

  return (
    <>
      <div className="flex justify-between">
        <div className="order-1"></div>
        <div className="order-2">
          <h1 className="home-title2" style={{ marginBottom: 28 }}>
            数据织网综合系统
          </h1>
          <h2 style={{ fontSize: "24px", marginBottom: 28 }}>
            构建全域联动的数据生态，赋能精准决策与高效协同‌
          </h2>
          <Card style={cardStyle}>
            <Card.Meta
              avatar={<Avatar shape="square" src={"/protect.svg"} size={60} />}
              description={
                <>
                  <Statistic
                    title="累计下单（单）"
                    value={batteryVal.current}
                    style={{ fontWeight: 700 }}
                  />
                  {animations.map((anim) => (
                    <span key={anim.id} className="count-float">
                      +1
                    </span>
                  ))}
                </>
              }
            ></Card.Meta>
          </Card>
          <Card style={cardStyle}>
            <Card.Meta
              avatar={<Avatar shape="square" src={"/lamp.svg"} size={60} />}
              description={
                <>
                  <Statistic
                    title="累计设备预警（次）"
                    value={lampVal.current}
                    style={{ fontWeight: 700 }}
                  />
                  {animations2.map((anim) => (
                    <span key={anim.id} className="count-float">
                      +1
                    </span>
                  ))}
                </>
              }
            ></Card.Meta>
          </Card>
          <Card style={cardStyle}>
            <Card.Meta
              avatar={<Avatar shape="square" src={"/star.svg"} size={60} />}
              description={
                <>
                  <Statistic
                    title="累计抢救站点（座）"
                    value={stationVal.current}
                    style={{ fontWeight: 700 }}
                  />
                  {animations3.map((anim) => (
                    <span key={anim.id} className="count-float">
                      +1
                    </span>
                  ))}
                </>
              }
            ></Card.Meta>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SectionTwo;

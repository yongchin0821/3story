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
  const animations = useRef([]);
  const animations2 = useRef([]);
  const animations3 = useRef([]);

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
          animations2.current = [{ id: id }];
          lampVal.current += 1;
        } else {
          animations2.current = [];
        }
        break;
      case 1:
        if (animeAtom.play) {
          animations3.current = [{ id: id }];
          stationVal.current += 1;
        } else {
          animations3.current = [];
        }
        break;
      case 2:
        if (animeAtom.play) {
          animations.current = [{ id: id }];
          batteryVal.current += 1;
        } else {
          animations.current = [];
        }
        break;
    }
  }, [animeAtom]);

  return (
    <>
      <div className="flex justify-between">
        <div className="order-1"></div>
        <div className="order-2">
          <h1 className="page-title2" style={{ marginBottom: 28 }}>
            全方位运营护航
          </h1>
          <h2 style={{ fontSize: "24px", marginBottom: 28 }}>
            治理赋能,稳健前行
          </h2>
          <Card style={cardStyle}>
            <Card.Meta
              avatar={<Avatar shape="square" src={"/protect.svg"} size={60} />}
              description={
                <>
                  <Statistic
                    title="累计换电（单）"
                    value={batteryVal.current}
                    style={{ fontWeight: 700 }}
                  />
                  {animations.current.map((anim) => (
                    <span key={anim.id} className="addcount">
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
                  {animations2.current.map((anim) => (
                    <span key={anim.id} className="addcount">
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
                    title="累计抢救车站（座）"
                    value={stationVal.current}
                    style={{ fontWeight: 700 }}
                  />
                  {animations3.current.map((anim) => (
                    <span key={anim.id} className="addcount">
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

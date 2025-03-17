import React, { useState, useEffect } from "react";
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

  const [batteryVal, setBatteryVal] = useState(123233);
  const [lampVal, setLampVal] = useState(2332);
  const [stationVal, setStationVal] = useState(2222);
  const animeAtom = useAtomValue(countAtom);

  useEffect(() => {
    const id = Date.now();
    switch (animeAtom.iconindex) {
      case 0:
        if (animeAtom.play) {
          setAnimations2([{ id: id }]);
          setLampVal(lampVal + 1);
        } else {
          // setAnimations2([]);
        }
        break;
      case 1:
        if (animeAtom.play) {
          setAnimations3([{ id: id }]);
          setStationVal(stationVal + 1);
        } else {
          // setAnimations3([]);
        }
        break;
      case 2:
        if (animeAtom.play) {
          setAnimations((prev) => [...prev, { id }]);
          setBatteryVal(batteryVal + 1);
        } else {
          // setAnimations([]);
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
          <h2 style={{ fontSize: "24px", marginBottom: 28 }}>全方位运营护航</h2>
          <Card style={cardStyle}>
            <Card.Meta
              avatar={<Avatar shape="square" src={"/protect.svg"} size={60} />}
              description={
                <>
                  <Statistic
                    title="累计换电（单）"
                    value={batteryVal}
                    style={{ fontWeight: 700 }}
                  />
                  {/* {animations.map((anim) => {
                    <span key={anim.id} className="addcount">
                      +1
                    </span>;
                  })} */}
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
                    value={lampVal}
                    style={{ fontWeight: 700 }}
                  />
                  {/* {animations2.map((anim) => {
                    <span key={anim.id} className="addcount">
                      +1
                    </span>;
                  })} */}
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
                    value={stationVal}
                    style={{ fontWeight: 700 }}
                  />
                  {/* {animations3.map((anim) => {
                    <span key={anim.id} className="addcount">
                      +1
                    </span>;
                  })} */}
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

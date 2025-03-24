import React from "react";
import { Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

import { motion } from "motion/react";

const TypingText = () => {
  // 父容器动画变体：控制子元素的触发顺序
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3, // 每个字符之间延迟 0.1 秒
      },
    },
  };

  // 子元素动画变体：定义每个字符的动画
  const itemVariants = {
    hidden: { opacity: 0, y: 50 }, // 初始状态：透明且位于下方 20px
    visible: {
      opacity: 1, // 目标状态：不透明
      y: 0, // 目标状态：移动到正常位置
      transition: {
        duration: 1,
        ease: "easeOut", // 缓动函数，使动画更自然
      },
    },
  };
  const spanVal = "质量中心数字化智慧平台";
  const spanVal2 = "数据为翼,治理为舵";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden" // 初始状态
      animate="visible" // 动画目标状态
    >
      <h1 style={{ fontSize: "60px", fontWeight: 600 }}>
        {spanVal.split("").map((char, index) => (
          <motion.span
            key={index} // 唯一 key
            variants={itemVariants}
            className={char !== "\n" ? "inline-block" : "inline"}
          >
            {char}
          </motion.span>
        ))}
      </h1>
      <p style={{ fontSize: "24px" }}>
        {spanVal2.split("").map((char, index) => (
          <motion.span
            key={index} // 唯一 key
            variants={itemVariants}
            className={char !== "\n" ? "inline-block" : "inline"}
          >
            {char}
          </motion.span>
        ))}
      </p>
      <motion.div>
        <Button
          variant="soild"
          style={{
            width: 100,
            height: 40,
            backgroundColor: "#00C9A7",
            color: "white",
          }}
        >
          立即进入
        </Button>
      </motion.div>
    </motion.div>
  );
};

const SectionOne = () => {
  return (
    <>
      <div className="header"></div>
      <div className="body flex flex-col justify-center">
        <h1 className="home-title">
          Smart<span className="font-gradient">Digital</span>
        </h1>
        <TypingText />
      </div>

      <div className="footer">
        <div className="mb-2">加速世界向可持续能源的转变</div>
        <span className="mt-15">
          <DownOutlined className="animate-bounce" />
        </span>
      </div>
    </>
  );
};
export default SectionOne;

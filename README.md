# 🌉 Cross-Chain NFT Protocol（跨链 NFT 协议）

基于 Ethereum 的跨链 NFT 协议，实现不同链之间的资产映射与转移。  
通过 Chainlink CCIP 实现跨链消息传递，支持资产在源链锁定、目标链映射 NFT。

---

## 🚀 功能特性

- ERC721 NFT 标准实现
- 跨链资产转移（Cross-chain Transfer）
- Lock & Mint 跨链模型
- Burn & Release 回收模型
- NFT Metadata 去中心化存储（IPFS）
- 完整智能合约测试覆盖

---

## 🏗 系统架构

### 跨链流程图
源链 Source Chain 【用户锁定资产（Token） → 合约触发事件（Lock Event） →  Chainlink CCIP 发送跨链消息 】 →  目标链 Destination Chain【接收消息并验证  →  Mint 对应 NFT（映射资产）】

目标链 Destination Chain【用户销毁NFT  →  合约触发事件（Burn Event） →  Chainlink CCIP 发送跨链消息】 → 源链 Source Chain 【接收消息并验证 → 解锁对应资产（Token）】

---

## 🔁 跨链核心机制

### 🔒 Lock & Mint（锁定 + 铸造）

1. 用户在源链锁定 Token
2. 合约生成唯一资产标识（assetId）
3. 通过 CCIP 发送跨链消息
4. 目标链接收消息并 mint NFT

### 🔥 Burn & Release（销毁 + 释放）

1. 用户在目标链销毁 NFT
2. 触发跨链消息
3. 源链验证消息
4. 解锁对应 Token

---
## 🔑 核心合约设计

### 1️⃣ NFT合约实现
基于 OpenZeppelin ERC721 标准
每个 NFT 对应一个跨链锁定资产

### 2️⃣ 跨链通信机制

集成 Chainlink CCIP
实现链与链之间的消息传递

设计原因：
避免手动 Relayer 带来的信任问题
提供更安全的跨链通信方案

### 🔒 安全性设计
使用唯一 assetId 确保资产唯一性
校验跨链消息来源（CCIP sender 验证）
强制 Burn → Release 顺序
状态记录防止重复执行

### 🧪 测试
测试框架：
- Hardhat
- Mocha
- Chai

测试覆盖率：
✅ 95%+

攻击测试用例：
- 重放攻击
- 伪装发送者进行攻击
- 伪装链进行攻击
- 使用未授权的路由攻击
- 重复铸造攻击

单元测试用例:
- NFT mint 正常流程
- Lock → Mint 跨链流程
- Burn → Release 回收流程
---

## 📌 项目总结

- 实现跨链 NFT 映射协议
- 设计 Lock & Mint / Burn & Release 模型
- 解决跨链一致性与安全问题
- 构建高覆盖率测试体系（接近生产级）


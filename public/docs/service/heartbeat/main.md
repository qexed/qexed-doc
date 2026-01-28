# qexed_heartbeat 心跳服务
**文档信息**

* **配置版本**：0
* **最后更新**：2025年12月22日 15:35
## 功能
1. 维护配置阶段与游戏阶段tcp连接心跳
## 服务关系图
```mermaid
graph TD
    %% 定义节点样式
    A[qexed_heartbeat<br/>心跳模块]:::mainNode
    B[qexed_packet_split<br/>数据包分割]:::processNode
    C[qexed_game_logic<br/>游戏逻辑]:::processNode
    
    %% 主样式定义
    classDef mainNode fill:#4CAF50,stroke:#388E3C,stroke-width:2px,color:white,font-weight:bold
    classDef processNode fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:white
    classDef gameFlow fill:none,stroke:#4CAF50,stroke-width:2px,color:#4CAF50,font-weight:bold
    classDef configFlow fill:none,stroke:#FF9800,stroke-width:2px,color:#FF9800,font-weight:bold
    
    %% 游戏阶段心跳流
    subgraph "游戏阶段心跳"
        direction LR
        A -- "发送游戏阶段心跳" --> B
        B -. "游戏阶段心跳返回结果" .-> A
    end
    
    %% 配置阶段心跳流
    subgraph "配置阶段心跳"
        direction LR
        A == "发送配置阶段心跳" ==> C
        C -. "配置阶段心跳返回结果" .-> A
    end
    
    %% 应用样式到连线
    linkStyle 0 stroke:#4CAF50,stroke-width:2px
    linkStyle 1 stroke:#4CAF50,stroke-width:2px,stroke-dasharray:5
    linkStyle 2 stroke:#FF9800,stroke-width:2px
    linkStyle 3 stroke:#FF9800,stroke-width:2px,stroke-dasharray:5
    
    %% 图例
    subgraph "图例"
        Legend1[实线箭头: 请求]:::legend
        Legend2[虚线箭头: 响应]:::legend
        Legend3[绿色: 游戏阶段]:::legend
        Legend4[橙色: 配置阶段]:::legend
    end
    
    classDef legend fill:#f9f9f9,stroke:#ddd,stroke-width:1px,color:#333
```
## 配置文件
``` toml
interval_seconds = 5
timeout_seconds = 30
max_consecutive_misses = 3
enabled = true
```
### 参数说明
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| interval_seconds |  i32 |  心跳间隔（秒）（超过大概30秒左右的时间客户端会断开连接！！！） | 
| timeout_seconds |  i32 | 超时时间（秒） | 
| max_consecutive_misses |  u32 | 最大连续丢失次数 | 
| enabled |  bool | 是否启用心跳 | 
## 命令
无
## 常见问题
无
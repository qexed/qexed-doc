# qexed_chat 聊天
**文档信息**

* **配置版本**：0
* **最后更新**：2025年12月22日 14:45
## 功能
1. 聊天
## 游戏内截图
![alt text](image.png)
## 服务关系图
```mermaid
graph TD
    subgraph "游戏逻辑层"
        F[qexed_game_logic]
    end
    
    subgraph "聊天管理层"
        C[qexed_chat:manage]
    end
    
    subgraph "聊天任务层"
        B[qexed_chat:task]
        D[qexed_chat:task]
        E[qexed_chat:task]
    end
    
    subgraph "数据包处理层"
        A[qexed_packet_split]
    end
    
    F -->|1.获取聊天管理器| C
    C -->|2.创建聊天服务| B
    B -->|3.返回聊天服务句柄| F
    F -->|4.移交聊天管道| A
    A -->|5.分发聊天数据包| B
    B -->|6.广播聊天事件| C
    C -->|7.分发给所有客户端| B
    C -->|7.分发给所有客户端| D
    C -->|7.分发给所有客户端| E
```
## 配置文件
``` toml
version = 0
```
### 参数说明
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| version | i32 | 配置文件版本 | 
## 命令
暂无
## 常见问题
暂无
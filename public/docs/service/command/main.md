# qexed_command 指令
**文档信息**

* **配置版本**：0
* **最后更新**：2025年12月22日 15:25
## 功能
1. 注册指令
2. 校验权限
3. 执行指令
## 游戏内截图
![alt text](image.png)
## 服务关系图
```mermaid
graph TD
    %% 输入层
    subgraph "输入层"
        B[qexed_cli<br/>终端命令行]
        A[qexed_one<br/>统一入口]
        F[qexed_packet_split<br/>数据包处理]
    end
    
    subgraph "游戏逻辑层"
        G[qexed_game_logic<br/>游戏主逻辑]
    end
    
    %% 指令管理层
    subgraph "指令管理层"
        
        H[qexed_command:manage<br/>指令管理器]
    end
    
    %% 指令执行层
    subgraph "指令执行层"
        C[qexed_command:task<br/>指令任务]
        D[qexed_permission<br/>权限验证]
        N[qexed_command:command<br/>指令执行器]
    end
    
    %% 网络层
    subgraph "网络层"
        E[qexed_tcp_connect_app<br/>TCP连接应用]
    end
    
    %% 条件判断节点
    I{是否已注册?}
    J{是否具备权限?}
    L{检测调用者类型}
    M{指令是否执行成功?}
    
    %% 流程连接
    %% 1. 终端指令流程
    B -->|终端命令行| A
    A -->|传递终端指令| H
    H -->|解析指令| I
    
    %% 2. 游戏内指令流程
    G -->|创建玩家指令任务| C
    C -->|转让任务所有权| F
    F -->|传递玩家指令| C
    C -->|解析指令| I
    
    %% 3. 权限验证流程
    I -->|请求权限检查| D
    D -->|验证结果| J
    
    %% 4. 权限分支
    J -->|有权限| N
    J -->|无权限| L
    
    %% 5. 调用者检测分支
    L -->|玩家调用| C
    L -->|终端调用| H
    
    %% 6. 指令执行流程
    N -->|执行指令| M
    M -->|执行成功| E
    M -->|执行失败| L
    
    %% 7. 结果发送
    N -->|构建数据包并发送| E
    
    %% 样式定义
    classDef input fill:#2d5f91,stroke:#1e3a5f,color:#fff
    classDef logic fill:#4a148c,stroke:#1e3a5f,color:#fff
    classDef management fill:#0d47a1,stroke:#1e3a5f,color:#fff
    classDef execution fill:#006064,stroke:#1e3a5f,color:#fff
    classDef network fill:#1b5e20,stroke:#1e3a5f,color:#fff
    classDef condition fill:#bf360c,stroke:#1e3a5f,color:#fff
    
    %% 应用样式
    class B,F input
    class G logic
    class A,H management
    class C,D,N execution
    class E network
    class I,J,L,M condition
    
    %% 添加图例
    subgraph "图例"
        LR1[输入层]:::input
        LR2[游戏逻辑层]:::logic
        LR3[指令管理层]:::management
        LR4[指令执行层]:::execution
        LR5[网络层]:::network
        LR6[条件判断]:::condition
    end
```
## 配置文件
```toml
version = 0
tab = true
game_stop_cmd = false
game_var_cmd = true
```
### 参数说明
| 参数 | 类型 | 说明 |
| --- | --- | --- |
| version | i32 | 配置文件版本 | 
| tab | bool | 启用tab补全功能(如果禁用意味着你只能手动help查询帮助了)(暂未启用) | 
| game_stop_cmd | bool |启用服内stop命令(高风险命令!!!)| 
| game_var_cmd | bool | 启用服内version命令(查看服务器信息)(暂未启用) | 
## 命令
玩家列表的命令相对简单，只有查询功能而已
### /help 帮助指令
描述: 查询已注册且有权限的指令

权限组要求: `exed.help`

另名:`帮助`、`?`、`helpme`

参数:`page_or_command`

指令说明:
每页10个指令，如下:
```shell
/list [页码:int]
/list [指令:String]
```
## 常见问题
暂无
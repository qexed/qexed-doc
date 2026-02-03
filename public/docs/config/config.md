# 配置文件列表
## 文档版本信息
| 作者 | 适用版本 | 更新日期 |
| --- | --- | --- |
| InotArt | v0.1.0a? | 2026.2.3 | 
# 介绍
Qexed 的配置文件使用的是`toml`格式,有关`toml`格式的介绍请前往[toml](https://toml.io/)官网了解学习。
此外Qexed的配置文件是分散的,因此您需要根据本文档中的文件路径来查找你要编辑的配置文件。（例如主配置文件是 config/qexed.toml）
# 文件列表
> qexed 并没有 
> `server.properties`,
> `whitelist.json`,
> `version_history.json`,
> `usercache.json`,
> `ops.json`,
> `banned-ips.json`,
> `banned-players.json` 
> 这样的文件，他们在 Qexed 中分布在如下服务中代替的
> 
> | spigot文件 | qexed文件 | 备注 |
> | --- | --- | --- |
> | server.properties | / | 注:此模块拆分的非常彻底,你可能需要在多个文件中才能找齐`server.properties`中原有的配置 | 
> | server.properties | config/qexed.toml | `server-ip`与`server-port`,被 `server.ip` 替代| 
> | server.properties | config/qexed.toml | `online-mode`,被 `server.online` 替代| 


- [config/qexed.toml 主文件](./qexed.md)
<!-- - [config] -->
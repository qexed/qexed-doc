# config/qexed.md
## 文档版本信息
| 作者 | 适用版本 | 更新日期 |
| --- | --- | --- |
| InotArt | v0.1.0a? | 2026.2.3 | 
# 配置
| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| version | i32 | 1 |配置文件版本号 |
| update_check | bool |true| 服务端更新检查(此参数不会影响正常运行) |
| plugin_download.enable | bool |false| 是否启用插件下载功能 |
| plugin_download.download | String | https://api.example.com/plugins/ | 插件下载服务器地址(后续提供搭建方式) |
| plugin_download.download_token | String | 123456 | 下载token,请自行设置 |
| server.ip | string | 0.0.0.0:25565 | 服务器ip地址 |
| server.online | bool | true | 启用正版验证 | 
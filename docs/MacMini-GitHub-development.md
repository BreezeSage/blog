# brew 安装 

## 安装 oh-my-zsh 的时候发生报错

> [!CAUTION]
> fatal: unable to access 'https://github.com/ohmyzsh/ohmyzsh.git/': Failed to connect to github.com port 443 after 5 ms: Couldn't connect to server

## 解决步骤

> 参考 [Github 访问不了解决方案（Mac）](https://blog.csdn.net/weixin_47470990/article/details/144538665)

1. 进入网址 [服务器-网站测速-站长工具](https://ping.chinaz.com/raw.githubusercontent.com)

2. 分别查询 `github.com` 和 `raw.githubusercontent.com` 获取到对应延迟最低的 `ip`。

2. 进入终端 `sudo vi /etc/hosts`

3. 添加下面俩行内容

    ```sh
    20.27.177.133 github.com
    20.xx.xxx.xxx raw.githubusercontent.com
    ```

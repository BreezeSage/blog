# Git

## 常用指令

> [Git 分支管理 | 菜鸟教程](http://runoob.com/git/git-branch.html)

`git branch` 查看当前分支

`git branch -r` 查看远程分支

`git branch -a` 查看所有本地和远程分支

`git checkout <branch_name>` 切换到目标分支

`git checkout -b <branch_name>` 创建并立即切换到目标分支

`git checkout -` 快速在俩个分支之间切换

`git merge <branch_name>` 将其他分支合并到当前分支

`git branch -d <branch_name>` 删除本地分支

`git branch -D <branch_name>` 强制删除未合并的分支

`git push origin --delete <branch_name>` 删除远程分支

`git clone <repo>` 克隆仓库

`git clone <repo> <directory>` 克隆仓库到指定文件夹

## 配置

`git config --list` 显示当前的 git 配置信息

`git config --global user.name "username"`

`git config --global user.email "test@163.com"`

`git log` 查看历史提交记录

## 常见错误
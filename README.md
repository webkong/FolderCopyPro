# FolderCopyPro - VS Code 插件

`FolderCopyPro` 是一个 VS Code 插件，允许您在资源管理器中右键点击文件或文件夹，将其快速复制到预定义的多个目标项目目录中，并支持 Git 提交操作。

## 功能特点

- 支持多个目标目录的配置，可自由选择复制到哪个目标
- 支持三种复制模式：覆盖、合并、备份
- 支持在目标项目中自动执行 Git 提交
- 右键菜单动态展示配置的目标及其别名，操作快捷

---

## 安装

### 通过 VS Code Marketplace 安装

1. 打开 VS Code，按 `Ctrl + Shift + X` 打开扩展市场
2. 在搜索框中输入插件名称 **"FolderCopyPro"** 并安装

### 通过 VSIX 文件安装

1. 前往 [GitHub 仓库](https://github.com/webkong/FolderCopyPro) 或 [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=your-publisher-name.copy-to-target) 下载 `.vsix` 文件
2. 在 VS Code 中按 `Ctrl + Shift + P`，输入 **"Install from VSIX"**
3.

---

## 配置方法

在 VS Code 的 `settings.json` 中添加如下配置：

```json
"copyToTarget.targets": [
  {
    "alias": "项目 A",
    "targetDirectory": "/path/to/projectA",
    "copyMode": "overwrite",
    "git": { "enable": true }
  },
  {
    "alias": "项目 B",
    "targetDirectory": "/path/to/projectB",
    "copyMode": "merge",
    "git": { "enable": false }
  },
  {
    "alias": "项目 C",
    "targetDirectory": "/path/to/projectC",
    "copyMode": "backup",
    "git": { "enable": true }
  }
]
```

### 配置参数说明

| 配置项            | 类型      | 说明                                           |
| ----------------- | --------- | ---------------------------------------------- |
| `alias`           | `string`  | 目标目录的别名，右键菜单显示用                 |
| `targetDirectory` | `string`  | 目标项目的绝对路径                             |
| `copyMode`        | `string`  | 复制模式，可选：`overwrite`、`merge`、`backup` |
| `git.enable`      | `boolean` | 是否在目标项目中执行 Git 提交                  |

---

## 使用方法

1. 在资源管理器中右键选中要复制的文件或文件夹
2. 选择 **"复制到目标目录"** 菜单
3. 从弹出的目标列表中选择目标项目
4. 根据配置执行文件复制和 Git 提交操作

---

## 复制模式说明

- **overwrite**：直接覆盖目标文件或文件夹
- **merge**：合并文件夹，仅覆盖冲突的文件
- **backup**：备份目标目录中原有文件，再复制新的文件

---

## 示例场景

- 在多个项目中同步代码片段或资源文件
- 快速更新多个项目的公共配置或组件
- 批量将开发代码同步至测试或生产环境

---

## 注意事项

- 确保目标目录路径正确且有写权限
- Git 提交功能依赖目标项目中存在有效的 Git 仓库
- 如果选择 **overwrite** 或 **merge** 复制模式，请谨慎操作，避免覆盖误删

---

## 贡献和反馈

如果有问题或建议，欢迎提交 Issue 或 Pull Request！  
GitHub 地址：[Your Repository URL](https://github.com/webkong/FolderCopyPro)

---

## 许可证

MIT License

---

希望这个 README 文件能帮助用户快速理解插件的功能和配置方式。如果有需要调整或补充的地方，请随时反馈！ 😊

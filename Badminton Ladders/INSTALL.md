# 安装指南

## 第一步：安装 Node.js

1. 访问 Node.js 官网：https://nodejs.org/
2. 下载 LTS 版本（推荐 18.x 或更高版本）
3. 运行安装程序，按默认选项安装
4. 安装完成后，重启命令行窗口

验证安装：
```bash
node --version
npm --version
```

## 第二步：安装项目依赖

在项目目录下运行：
```bash
npm install
```

## 第三步：启动项目

```bash
npm run dev
```

浏览器会自动打开 http://localhost:3000

## 如果遇到问题

### npm 命令找不到
- 确保 Node.js 已正确安装
- 重启命令行窗口或 VS Code
- 检查环境变量中是否包含 Node.js 路径

### 端口被占用
修改 vite.config.js 中的端口号：
```js
server: {
  port: 3001  // 改成其他端口
}
```

### 依赖安装失败
尝试使用国内镜像：
```bash
npm install --registry=https://registry.npmmirror.com
```

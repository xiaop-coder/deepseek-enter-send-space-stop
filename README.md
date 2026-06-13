# DeepSeek Enter Send Space Stop

English | [中文](#中文)

A small userscript for the DeepSeek web app. It makes `Enter` send the current message and lets `Space` stop generation when DeepSeek is responding.

I built this for convenience: in Microsoft Edge, DeepSeek web would only insert a new line when pressing `Enter`, while Chrome could send normally. This script makes the keyboard behavior consistent for my daily use.

## Features

- `Enter`: send the message in the DeepSeek input box.
- `Shift + Enter`: keep DeepSeek's normal multiline behavior.
- `Space`: stop generation when the stop button is visible.
- No build step, no dependency, no external network request.

## Install

1. Install a userscript manager such as Tampermonkey or Violentmonkey.
2. Create a new userscript.
3. Paste the contents of [`deepseek-enter-send-space-stop.user.js`](./deepseek-enter-send-space-stop.user.js).
4. Save the script and refresh `https://chat.deepseek.com/`.

After the project is pushed to GitHub, you can also install it from the raw `.user.js` file URL.

## Compatibility

Tested against the DeepSeek web UI at `https://chat.deepseek.com/`. DeepSeek may change its DOM structure over time; if the send or stop button changes, selectors may need updating.

## License

MIT

## 中文

一个用于 DeepSeek 网页版的小型油猴脚本。它让 `Enter` 发送当前消息，并在 DeepSeek 正在生成回复时，让 `Space` 触发停止生成。

我开发这个脚本主要是为了方便：在 Microsoft Edge 里，DeepSeek 网页版按 `Enter` 只会换行，不能直接发送；但在 Chrome 里可以正常回车发送。所以写了这个脚本，让日常使用里的键盘行为更一致。

## 功能

- `Enter`：发送 DeepSeek 输入框里的消息。
- `Shift + Enter`：保留 DeepSeek 原本的多行输入行为。
- `Space`：当页面上有停止生成按钮时，停止当前生成。
- 不需要构建，不依赖第三方库，不发起额外网络请求。

## 安装

1. 安装 Tampermonkey、Violentmonkey 等用户脚本管理器。
2. 新建一个用户脚本。
3. 粘贴 [`deepseek-enter-send-space-stop.user.js`](./deepseek-enter-send-space-stop.user.js) 的内容。
4. 保存脚本并刷新 `https://chat.deepseek.com/`。

项目推送到 GitHub 后，也可以直接通过 `.user.js` 文件的 raw 链接安装。

## 兼容性

脚本针对 `https://chat.deepseek.com/` 的 DeepSeek 网页版编写。DeepSeek 可能会更新页面结构；如果发送按钮或停止按钮 DOM 改变，选择器可能需要同步调整。

## 许可证

MIT

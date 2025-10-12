# 模块脚本加载失败

## MIME 类型错误（application/octet-stream）

> [!CAUTION]
> Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "application/octet-stream". Strict MIME type checking is enforced for module scripts per HTML spec.

> 加载模块脚本失败：预期为JavaScript或Wasm模块脚本，但服务器响应为MIME类型的 "application/位元流"。严格的MIME类型检查是针对HTML规范中的模块脚本执行的。

基本的含义就是服务端返回 `Javascript` 文件的时候使用了 `Application/octet-stream` 流的方式进行了范围。问题出现在了服务端，服务端错误的设置了 `Javascript` 返回 `Header` 中的 `Content-Type`

## 解决方式

```ts
const mimeTypes: Record<string, string> = {
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.map': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.woff2': 'font/woff2',
    '.html': 'text/html',
}
const ext = extname(url.pathname)
const mime = mimeTypes[ext]
const headers = mime ? { "Content-Type": mime } : undefined
return new Response(await file(filePath).bytes(), headers ? { headers } : undefined)
```
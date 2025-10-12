# Bun

Bun is a fast JavaScript runtime


## Elysiajs

### @elysiajs/static

描述：Elysiajs 在使用静态资源插件的时候无法访问 Not Found，在访问除了 index.html 之外的文件都返回 Not Found

解答：[@laidrivm您是否尝试过alwaysStatic: false在 staticPlugin 配置中进行设置？](https://github.com/elysiajs/elysia/issues/1303#issuecomment-3311520423)

正确配置
```typescript
const app = new Elysia()
    .use(
        staticPlugin({
            alwaysStatic: true,
        })
    )
```
# 通用代码片段

This page demonstrates some of the built-in markdown extensions provided by VitePress.

## css

```css
/* 单行文本省略号 */
.ellipsis-single {
  width: 200px;              /* 固定宽度 */
  overflow: hidden;          /* 隐藏溢出文本 */
  text-overflow: ellipsis;   /* 显示省略号 */
  white-space: nowrap;       /* 防止换行 */
}

/* 多行文本省略号 */
.ellipsis-multi {
  width: 200px;              /* 固定宽度 */
  overflow: hidden;          /* 隐藏溢出文本 */
  display: -webkit-box;      /* 必须使用 flex 布局 */
  -webkit-box-orient: vertical; /* 设置盒子方向为垂直 */
  -webkit-line-clamp: 3;     /* 限制显示的行数 */
}
```

## typescript

## cmd

```sh
Set-ExecutionPolicy Remotesigned
```
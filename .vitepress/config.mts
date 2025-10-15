import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Awesome",
  description: "A VitePress Site",
  markdown: {
    theme: {
      light: "min-light",
      dark: "min-dark",
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
    },
    server: {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Resource-Policy": "cross-origin",
        "Origin-Agent-Cluster": "?1",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept, Range",
      },
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/docs/创意工作室" },
    ],

    search: {
      provider: "local",
    },

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "邮件发送", link: "/docs/邮件发送" },
          { text: "创意工作室", link: "/docs/创意工作室" },
          { text: "brew 安装", link: "/docs/MacMini-GitHub-development.md" },
          {
            text: "模块脚本加载失败",
            link: "/docs/application-octet-stream.md",
          },
          { text: "通用代码片段", link: "/docs/code-snippets.md" },
          { text: "异常问题处理集合", link: "/docs/troubleshooting.md" },
          { text: "Webrtc", link: "/docs/Webrtc.md" },
          { text: "FFmpeg", link: "/docs/FFmpeg.md" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/BreezeSage/blog" },
    ],
  },
});

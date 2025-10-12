import { createTransport } from "nodemailer";
import { renderToStaticMarkup } from "react-dom/server";
import Email from "../components/Email.tsx";
import { createElement } from "react";
import { unescape } from "lodash-es";

const transporter = createTransport({
  host: Deno.env.get("EMAIL_HOST"),
  port: 465,
  auth: {
    user: Deno.env.get("EMAIL_AUTH_USER"),
    pass: Deno.env.get("EMAIL_AUTH_PASS"),
  },
});

export async function sendEmail(to: string) {
  const users = to.split(",");
  if (users.length === 0) {
    console.log("没有收件人，跳过发送邮件");
    return;
  }
  transporter.sendMail({
    from: "研究生小助手 18267094443@163.com",
    to: users,
    subject: "每日一言",
    html: await renderEmail(),
  });
}

export async function renderEmail() {
  let title = "";
  let subTitle = "";
  let imageUrl = "";

  const response1 = await fetch("https://v1.hitokoto.cn").then((res) =>
    res.json()
  );
  title = response1.hitokoto;
  subTitle = response1.from;

  const response2 = await fetch(
    "http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1",
  ).then((res) => res.json());

  imageUrl = `https://cn.bing.com${response2.images[0]?.url}`;

  return unescape(renderToStaticMarkup(
    createElement(Email, { title, subTitle, imageUrl }, null),
  ));
}

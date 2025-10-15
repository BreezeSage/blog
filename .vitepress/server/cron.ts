import { sendEmail } from "./email.ts";
// 每分钟运行一次    */1 * * * *
// 每一小时运行一次  * */1 * * *

/**
 * 在使用 Deno.cron 定时任务时，需要注意时区问题。
 * Deno.cron 默认采用的是 UTC 时间（协调世界时），
 * 而中国东八区（北京时间）比 UTC 快 8 个小时。
 * 因此，如果你希望定时任务在北京时间的某个时刻执行，
 * 需要将该时间减去 8 个小时，转换为 UTC 时间。
 * 例如，如果你希望任务在北京时间每天早上 8 点执行，
 * 应该将 Deno.cron 的时间设置为每天的 0 点（UTC 时间）。
 */
Deno.cron("Run every day at 1am", "56 0 * * *", async () => {
  await sendEmail(Deno.env.get("EMAIL_DEFAULT_TO")!);
});

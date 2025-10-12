import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { sendEmail } from './server/email.ts'

const app = new Hono()

app.post("/api/send-email", async (c) => {
    const body = await c.req.json() as {
        to: string;
    }
    console.log("Request to send email to:", body);

    try {
        sendEmail(body.to)
    } catch (error) {
        console.error("Error sending email:", error);
        return c.json({ message: "Failed to send email.", error: error }, 500);
    }
    return c.json({ message: "Email sent successfully!", to: body.to });
});
app.use("*", serveStatic({ root: "./.vitepress/dist/" }));

Deno.serve(app.fetch);
<script setup lang="ts">
import { ref } from 'vue'

const input = ref<string>("18267094443@163.com,3195844119@qq.com")
const sending = ref<boolean>(false)

const sendEmail = async () => {
    if (sending.value) return
    sending.value = true
    try {
        const res = await fetch("/api/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                to: input.value
            })
        })

        if (!res.ok) {
            // try to extract a helpful message from the response
            let bodyText: string | null = null
            try {
                bodyText = await res.text()
            } catch (e) {
                // ignore
            }
            let message = bodyText || `请求失败，状态码: ${res.status}`
            // If body is JSON with message field, try to parse it
            try {
                const parsed = bodyText ? JSON.parse(bodyText) : null
                if (parsed && parsed.message) message = parsed.message
            } catch (e) {
                // ignore parse errors
            }
            alert(`服务器返回错误：${message}`)
            return
        }

        const data = await res.json()
        alert(`${data.message} to: ${data.to}`)
    } catch (err: any) {
        // Network error (e.g. server not started / connection refused)
        const msg = err && err.message ? err.message : String(err)
        alert(`无法连接到服务器，请确保后端服务已启动。
错误信息: ${msg}`)
    } finally {
        sending.value = false
    }
}

</script>

<template>
    <div>
    <input :class="$style['email-input']" v-model="input" /><br />
    <button :class="$style['email-submit']" @click="sendEmail" :disabled="sending">{{ sending ? 'Sending...' : 'send request' }}</button>
    </div>
</template>

<style module>
.email-input {
    width: 380px;
    border: 1px solid var(--vp-c-divider);;
    border-radius: 4px;
    padding: 4px 12px;
}

.email-submit {
    border-radius: 4px;
    background-color: purple;
    color: white;
    height: 34px;
    padding: 4px 12px;
    margin-top: 8px;
}
</style>
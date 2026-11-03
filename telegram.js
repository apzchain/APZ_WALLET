export async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { skipped: true };

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({ chat_id: chatId, text })
    }
  );
  if (!response.ok) throw new Error(`Telegram HTTP ${response.status}`);
  return { sent: true };
}

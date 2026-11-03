export async function sendDiscord(text) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return { skipped: true };

  const response = await fetch(webhook, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({ content: text })
  });
  if (!response.ok) throw new Error(`Discord HTTP ${response.status}`);
  return { sent: true };
}

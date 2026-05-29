// PATTERN: Abstract Factory (Product)
// RATIONALE: Creates Slack notification channel

class SlackChannel {
    constructor(config = {}) {
        this.webhookUrl = config.webhookUrl || 'https://hooks.slack.com/services/xxx/yyy/zzz';
        this.channel = config.channel || '#security-alerts';
    }

    async send(notification) {
        const { channel, message, attachments } = notification;
        
        const slackMessage = {
            channel: channel || this.channel,
            text: message || 'SDA-Pro Alert',
            attachments: attachments || [
                {
                    color: '#ff0000',
                    text: message,
                    ts: Math.floor(Date.now() / 1000)
                }
            ]
        };
        
        console.log(`[SlackChannel] Sending to Slack channel: ${slackMessage.channel}`);
        console.log(`[SlackChannel] Message: ${slackMessage.text}`);
        
        // In production, use @slack/webhook
        // For demo, simulate successful send
        return {
            success: true,
            channel: 'slack',
            messageId: `slack_${Date.now()}`,
            sentAt: new Date().toISOString()
        };
    }

    getName() {
        return 'SlackChannel';
    }
}

module.exports = SlackChannel;
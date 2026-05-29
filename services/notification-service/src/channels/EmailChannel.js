// PATTERN: Abstract Factory (Product)
// RATIONALE: Creates email notification channel

class EmailChannel {
    constructor(config = {}) {
        this.host = config.host || 'smtp.gmail.com';
        this.port = config.port || 587;
        this.user = config.user || 'noreply@sdapro.com';
        this.pass = config.pass || '';
    }

    async send(notification) {
        const { to, subject, body, attachments } = notification;
        
        console.log(`[EmailChannel] Sending email to: ${to}`);
        console.log(`[EmailChannel] Subject: ${subject}`);
        console.log(`[EmailChannel] Body: ${body}`);
        
        // In production, use nodemailer or AWS SES
        // For demo, simulate successful send
        return {
            success: true,
            channel: 'email',
            messageId: `email_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            sentAt: new Date().toISOString()
        };
    }

    getName() {
        return 'EmailChannel';
    }
}

module.exports = EmailChannel;
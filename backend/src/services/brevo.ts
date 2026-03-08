import * as SibApiV3Sdk from '@getbrevo/brevo';

// Lazily initialise so the module loads fine if BREVO_API_KEY is absent
let apiInstance: SibApiV3Sdk.TransactionalEmailsApi | null = null;

const getBrevoClient = (): SibApiV3Sdk.TransactionalEmailsApi => {
    if (!apiInstance) {
        apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        apiInstance.setApiKey(
            SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
            process.env.BREVO_API_KEY!
        );
    }
    return apiInstance;
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@devfolio.com';
const SENDER_NAME = process.env.SENDER_NAME || 'DevFolio';
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@devfolio.com';

/**
 * Sends a confirmation email to the visitor with a copy of their message.
 * Per design spec Section 5.7 Brevo Email Flow (template 1).
 */
export const sendContactConfirmation = async (
    toEmail: string,
    name: string,
    message: string
): Promise<void> => {
    if (!process.env.BREVO_API_KEY) {
        console.log(`[Dev] Mock confirmation email → ${toEmail} (${name})`);
        return;
    }

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
    sendSmtpEmail.to = [{ email: toEmail, name }];
    sendSmtpEmail.subject = `Got your message, ${name}! 👋`;
    sendSmtpEmail.htmlContent = `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #F8FAFC; background: #0A0F1E; padding: 32px; border-radius: 12px;">
            <h2 style="color: #3B82F6; margin-bottom: 8px;">Thanks for reaching out, ${name}!</h2>
            <p style="color: #94A3B8;">I've received your message and will get back to you as soon as possible.</p>
            <div style="background: #0D1626; border: 1px solid #1E293B; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <p style="color: #475569; font-size: 12px; margin: 0 0 8px 0;">YOUR MESSAGE</p>
                <p style="color: #94A3B8; margin: 0;">${message.replace(/\n/g, '<br/>')}</p>
            </div>
            <p style="color: #475569; font-size: 12px;">— DevFolio</p>
        </div>
    `;

    await getBrevoClient().sendTransacEmail(sendSmtpEmail);
};

/**
 * Sends a notification to the admin with reply-to set to the sender.
 * Per design spec Section 5.7 Brevo Email Flow (template 2).
 */
export const sendAdminNotification = async (
    fromEmail: string,
    fromName: string,
    subject: string,
    message: string
): Promise<void> => {
    if (!process.env.BREVO_API_KEY) {
        console.log(`[Dev] Mock admin notification from ${fromEmail}: "${subject}"`);
        return;
    }

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { name: SENDER_NAME, email: SENDER_EMAIL };
    sendSmtpEmail.to = [{ email: ADMIN_EMAIL, name: 'Admin' }];
    sendSmtpEmail.replyTo = { email: fromEmail, name: fromName }; // One-click reply goes to sender
    sendSmtpEmail.subject = `[Portfolio Contact] ${subject}`;
    sendSmtpEmail.htmlContent = `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #F8FAFC; background: #0A0F1E; padding: 32px; border-radius: 12px;">
            <h2 style="color: #3B82F6; margin-bottom: 4px;">New Portfolio Message</h2>
            <p style="color: #475569; margin: 0 0 24px 0; font-size: 14px;">Reply to this email to respond directly to ${fromName}.</p>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="color: #475569; padding: 6px 0; font-size: 12px; width: 80px;">FROM</td><td style="color: #94A3B8;">${fromName} &lt;${fromEmail}&gt;</td></tr>
                <tr><td style="color: #475569; padding: 6px 0; font-size: 12px;">SUBJECT</td><td style="color: #94A3B8;">${subject}</td></tr>
            </table>
            <div style="background: #0D1626; border: 1px solid #1E293B; border-radius: 8px; padding: 16px; margin-top: 24px;">
                <p style="color: #94A3B8; margin: 0;">${message.replace(/\n/g, '<br/>')}</p>
            </div>
        </div>
    `;

    await getBrevoClient().sendTransacEmail(sendSmtpEmail);
};

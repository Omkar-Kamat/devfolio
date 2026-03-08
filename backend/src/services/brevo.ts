export const sendContactConfirmation = async (email: string, name: string, message: string) => {
    if (!process.env.BREVO_API_KEY) {
        console.log('[Dev Mode] Mock Email sending to:', email, 'Hello', name);
        return;
    }
    // TODO: Implement Brevo v2 API
    console.log('[Email Sent via Brevo Placeholder]');
};

export const sendAdminNotification = async (email: string, name: string, subject: string, message: string) => {
    if (!process.env.BREVO_API_KEY) {
        console.log('[Dev Mode] Mock Admin Notification from:', email, 'Subject:', subject);
        return;
    }
    // TODO: Implement Brevo v2 API
    console.log('[Admin Notification Sent via Brevo Placeholder]');
};

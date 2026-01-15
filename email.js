// Intégration réelle de l'API Brevo (Sendinblue)
class EmailService {
    constructor(apiKey, senderEmail, senderName) {
        this.apiKey = apiKey;
        this.senderEmail = senderEmail;
        this.senderName = senderName;
        this.brevoApiUrl = 'https://api.brevo.com/v3/smtp/email';
    }

    // Générer un template HTML pour l'email du code promo
    generateEmailHtml(prize, brandName, websiteUrl) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { background: white; max-width: 600px; margin: 0 auto; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #667eea; margin: 0; font-size: 28px; }
        .emoji { font-size: 48px; display: block; margin: 10px 0; }
        .prize { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .prize h2 { margin: 0 0 10px 0; font-size: 24px; }
        .prize p { margin: 0; font-size: 16px; }
        .code { background: #f9f9f9; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
        .code-label { color: #666; font-size: 14px; margin-bottom: 10px; }
        .code-value { font-size: 32px; font-weight: bold; color: #667eea; font-family: monospace; letter-spacing: 2px; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${brandName}</h1>
            <span class="emoji">${prize.icon}</span>
        </div>

        <h2 style="text-align: center; color: #333;">🎉 Félicitations !</h2>
        <p style="text-align: center; color: #666; font-size: 16px;">Vous avez gagné une réduction avec <strong>${brandName}</strong> !</p>

        <div class="prize">
            <h2>${prize.label}</h2>
            <p>Profitez de votre réduction dès maintenant !</p>
        </div>

        <div class="code">
            <div class="code-label">Votre code promo :</div>
            <div class="code-value">${prize.code}</div>
        </div>

        <p style="text-align: center; color: #666;">
            <a href="${websiteUrl}" class="button">Utiliser mon code →</a>
        </p>

        <p style="color: #666; line-height: 1.6;">
            <strong>Comment l'utiliser ?</strong><br>
            Rendez-vous sur ${brandName} et saisissez le code <strong>${prize.code}</strong> lors du paiement pour appliquer votre réduction.
        </p>

        <div class="footer">
            <p>Merci de votre participation à la Roue de la Fortune ! 🎡</p>
            <p style="margin: 10px 0 0 0;">© ${new Date().getFullYear()} ${brandName}. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
        `.trim();
    }

    async send(to, subject, prize, brandName, websiteUrl) {
        console.log(`📨 EmailService.send -> to=${to}, subject=${subject}, prize=${prize && prize.code}`);

        try {
            const htmlContent = this.generateEmailHtml(prize, brandName, websiteUrl);

            const payload = {
                sender: {
                    name: this.senderName,
                    email: this.senderEmail
                },
                to: [
                    {
                        email: to
                    }
                ],
                subject: subject,
                htmlContent: htmlContent
            };

            const response = await fetch(this.brevoApiUrl, {
                method: 'POST',
                headers: {
                    'api-key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ Erreur Brevo:', errorData);
                return { success: false, error: errorData.message || 'Erreur Brevo' };
            }

            const data = await response.json();
            console.log('✅ Email envoyé avec succès via Brevo:', data);
            return { success: true, data: data };
        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi d\'email:', error);
            return { success: false, error: error.message };
        }
    }
}

window.EmailService = EmailService;

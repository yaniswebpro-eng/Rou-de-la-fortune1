// ============================================
// APPLICATION PRINCIPALE
// ============================================

class RoueFortuneApp {
    constructor() {
        this.userEmail = '';
        this.currentPrize = null;
        
        // Initialiser les services
        this.wheel = new Wheel('wheel', CONFIG.prizes);
        this.emailService = new EmailService(
            CONFIG.brevo.apiKey,
            CONFIG.brevo.senderEmail,
            CONFIG.brevo.senderName
        );
        this.storage = new StorageService(CONFIG.googleSheetUrl);
        
        // Initialiser l'interface
        this.init();
    }

    init() {
        // Dessiner la roue
        this.wheel.draw();
        
        // Appliquer la marque
        const modalTitle = document.querySelector('.modal h2');
        const modalSubtitle = document.querySelector('.modal p');
        const btnPrimary = document.querySelector('.btn-primary');
        const containerH1 = document.querySelector('.container h1');
        
        if (modalTitle) modalTitle.textContent = CONFIG.texts.modalTitle;
        if (modalSubtitle) {
            modalSubtitle.innerHTML = CONFIG.texts.modalSubtitle.replace(
                '20%',
                '<span class="highlight">20%</span>'
            );
        }
        if (btnPrimary) btnPrimary.textContent = CONFIG.texts.buttonText;
        if (containerH1) containerH1.textContent = `${CONFIG.brand.logo} ${CONFIG.brand.name}`;
        
        console.log('✅ Application initialisée');
        console.log('📊 Probabilités:', CONFIG.prizes.map(p => `${p.label}: ${p.probability}%`));
    }

    // Valider l'email
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Vérifier si l'email a déjà joué cette année
    hasPlayedThisYear(email) {
        // Email de test exempté de la restriction
        if (email === 'yaniswebpro@gmail.com') {
            console.log('🧪 Email de test détecté - restriction désactivée');
            return false;
        }

        const storageKey = `roufortune_${email}`;
        const lastPlayDate = localStorage.getItem(storageKey);
        
        if (!lastPlayDate) {
            return false; // Jamais joué
        }
        
        const lastDate = new Date(lastPlayDate);
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        
        return lastDate > oneYearAgo; // True si joué dans les 12 derniers mois
    }

    // Enregistrer la date de jeu pour cet email
    recordEmailPlay(email) {
        const storageKey = `roufortune_${email}`;
        localStorage.setItem(storageKey, new Date().toISOString());
    }

    // Obtenir la date du prochain essai possible
    getNextPlayDate(email) {
        const storageKey = `roufortune_${email}`;
        const lastPlayDate = localStorage.getItem(storageKey);
        
        if (!lastPlayDate) {
            return null;
        }
        
        const lastDate = new Date(lastPlayDate);
        const nextDate = new Date(lastDate.getFullYear() + 1, lastDate.getMonth(), lastDate.getDate());
        return nextDate;
    }

    // Démarrer le jeu
    start() {
        const emailInput = document.getElementById('email');
        
        if (!emailInput) {
            console.error('❌ Input email non trouvé');
            return;
        }
        
        const email = emailInput.value.trim();

        if (!this.validateEmail(email)) {
            alert('Veuillez entrer une adresse email valide');
            return;
        }

        // Vérifier si l'email a déjà joué cette année
        if (this.hasPlayedThisYear(email)) {
            const nextDate = this.getNextPlayDate(email);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const dateStr = nextDate.toLocaleDateString('fr-FR', options);
            alert(`❌ Vous avez déjà participé cette année.\n\nVous pourrez rejouer à partir du ${dateStr}.`);
            return;
        }

        this.userEmail = email;
        console.log('📧 Email validé:', email);
        
        // Enregistrer que cet email a joué aujourd'hui
        this.recordEmailPlay(email);
        
        // Fermer la modal et afficher la roue
        const modal = document.getElementById('modal');
        const main = document.getElementById('main');
        
        if (modal) modal.classList.add('hidden');
        if (main) main.classList.remove('hidden');

        // Lancer la roue après un court délai
        setTimeout(() => {
            console.log('🎡 Lancement de la roue...');
            // Disable primary button while spinning
            const btnPrimary = document.querySelector('.btn-primary');
            if (btnPrimary) btnPrimary.disabled = true;

            this.wheel.spin((prize) => {
                this.onWin(prize);
                // Réactiver le bouton après affichage du résultat
                if (btnPrimary) btnPrimary.disabled = false;
            });
        }, 500);
    }

    // Quand l'utilisateur gagne
    async onWin(prize) {
        this.currentPrize = prize;
        
        console.log('🎉 Lot gagné:', prize.label);
        
        // Mettre à jour l'interface
        const subtitle = document.getElementById('subtitle');
        const emoji = document.getElementById('emoji');
        const prizeEl = document.getElementById('prize');
        const code = document.getElementById('code');
        const result = document.getElementById('result');
        
        if (subtitle) subtitle.textContent = CONFIG.texts.congratsText;
        if (emoji) emoji.textContent = prize.icon;
        if (prizeEl) prizeEl.textContent = prize.label;
        if (code) code.textContent = prize.code;
        if (result) result.classList.remove('hidden');

        // L'email s'envoie seulement après que l'utilisateur clique sur "Laisser un avis"
        // Sauvegarder dans Google Sheets
        this.saveData(prize);
    }

    // Envoyer l'email
    async sendEmail(prize) {
        console.log('📧 Envoi de l\'email...');
        
        const result = await this.emailService.send(
            this.userEmail,
            CONFIG.texts.emailSubject,
            prize,
            CONFIG.brand.name,
            CONFIG.brand.websiteUrl
        );

        if (result.success) {
            console.log('✅ Email envoyé avec succès');
            this.showNotification('📧 Email envoyé ! Vérifiez votre boîte mail', 'success');
        } else {
            console.error('❌ Échec envoi email:', result.error);
            this.showNotification('⚠️ Erreur lors de l\'envoi de l\'email', 'error');
        }
    }

    // Sauvegarder les données
    async saveData(prize) {
        const result = await this.storage.save(this.userEmail, prize);
        
        if (result.success) {
            console.log('✅ Données sauvegardées');
        } else {
            console.warn('⚠️ Sauvegarde échouée:', result.error);
        }
    }

    // Ouvrir la page d'avis Google
    openReview() {
        window.open(CONFIG.googleReviewUrl, '_blank');
        
        // Envoyer l'email après que l'utilisateur ait cliqué sur "Laisser un avis"
        console.log('📧 Envoi de l\'email suite au clic sur "Laisser un avis"...');
        if (this.currentPrize) {
            this.sendEmail(this.currentPrize);
        }
        
        // Afficher le code après 2 secondes
        setTimeout(() => {
            const reviewBox = document.getElementById('reviewBox');
            const codeBox = document.getElementById('codeBox');
            const useBtn = document.getElementById('useBtn');
            
            if (reviewBox) reviewBox.classList.add('hidden');
            if (codeBox) codeBox.classList.remove('hidden');
            if (useBtn) useBtn.classList.remove('hidden');
        }, 10000);
    }

    // Afficher une notification
    showNotification(message, type = 'info') {
        // Créer la notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Supprimer après 3 secondes
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialisation au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation de l\'application...');
    
    try {
        window.app = new RoueFortuneApp();
        console.log('🎡 Roue de la Fortune chargée avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
    }
});
// ============================================
// CONFIGURATION GLOBALE
// ============================================
// Modifiez ces valeurs pour personnaliser la roue

const CONFIG = {
    // === INTÉGRATIONS ===
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/VOTRE_LIEN/edit#gid=0',
    googleReviewUrl: 'https://g.page/r/VOTRE_LIEN/review',
    
    // === BREVO EMAIL ===
    brevo: {
        apiKey: 'VOTRE_CLE_API_BREVO',
        senderEmail: 'email@votresite.com',
        senderName: 'Roue de la Fortune'
    },
    
    // === MARQUE ===
    brand: {
        name: 'Votre Marque',
        logo: '🎡', // Emoji ou URL d'image
        websiteUrl: 'https://votresite.com'
    },
    
    // === TEXTES ===
    texts: {
        modalTitle: 'Tentez Votre Chance !',
        modalSubtitle: 'Tournez la roue et gagnez un lot !',
        buttonText: 'TOURNER LA ROUE 🎯',
        emailSubject: '🎉 Votre code est arrivé !',
        congratsText: 'Félicitations !'
    },
    
    // === COULEURS ===
    colors: {
        primary: '#000000ff',
        secondary: '#764ba2',
        background: '#ffffff'
    },
    
    // === LOTS ET PROBABILITÉS ===
    prizes: [
        { 
            label: 'Frites', 
            code: 'FRITES', 
            icon: '🍟', 
            probability: 50,  // 50% de chance
            segments: 4       // 4 segments sur la roue
        },
        { 
            label: 'Boisson', 
            code: 'BOISSON', 
            icon: '🥤', 
            probability: 25,  // 25% de chance
            segments: 2
        },
        { 
            label: 'Tiramisu', 
            code: 'TIRAMISU', 
            icon: '🍰', 
            probability: 12.5,  // 12.5% de chance
            segments: 1
        },
        { 
            label: 'Menu Complet', 
            code: 'MENU_COMPLET', 
            icon: '🏆', 
            probability: 12.5,  // 12.5% de chance (le plus rare)
            segments: 1
        }
    ]
};

// Validation : le total des probabilités doit faire 100%
const totalProba = CONFIG.prizes.reduce((sum, p) => sum + p.probability, 0);
if (Math.abs(totalProba - 100) > 0.1) {
    console.warn(`⚠️ Les probabilités totales font ${totalProba}% (doivent faire 100%)`);
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
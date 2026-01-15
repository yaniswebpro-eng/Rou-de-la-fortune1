# Rou-de-la-fortune1
# 🎡 Roue de la Fortune - Documentation

## 📁 Structure du Projet

```
roue-fortune/
├── index.html          # Page HTML principale
├── style.css           # Tous les styles CSS
├── config.js           # Configuration (API keys, probabilités, textes)
├── wheel.js            # Logique de la roue (dessin, rotation, sélection)
├── email.js            # Gestion des emails (Brevo)
├── storage.js          # Sauvegarde Google Sheets
├── main.js             # Application principale (orchestration)
└── README.md           # Cette documentation
```

## 🚀 Installation

### 1. Télécharger les fichiers

Copie tous les fichiers dans un même dossier :
- `index.html`
- `style.css`
- `config.js`
- `wheel.js`
- `email.js`
- `storage.js`
- `main.js`

### 2. Configuration

Ouvre `config.js` et modifie les valeurs :

```javascript
// Tes clés API
googleSheetUrl: 'TON_URL_GOOGLE_APPS_SCRIPT',
googleReviewUrl: 'TON_LIEN_GOOGLE_REVIEW',
brevo: {
    apiKey: 'TA_CLE_API_BREVO',
    senderEmail: 'ton@email.com',
    senderName: 'Ton Nom'
},

// Ta marque
brand: {
    name: 'Ta Marque',
    logo: '🎡',
    websiteUrl: 'https://tonsite.com'
},

// Les lots et probabilités
prizes: [
    { label: '5% OFF', code: 'SPIN5', probability: 70, ... },
    ...
]
```

### 3. Lancement

Ouvre `index.html` dans ton navigateur !

## 📝 Fichiers Expliqués

### `config.js` - Configuration
**Ce qu'il fait :** Contient TOUTES les configurations
- Clés API (Brevo, Google Sheets)
- Textes de l'interface
- Couleurs
- Lots et probabilités

**Quand le modifier :** À chaque nouveau client, change les couleurs, textes, et lots.

---

### `wheel.js` - La Roue
**Ce qu'il fait :** Gère la roue de la fortune
- Dessine la roue avec les segments
- Fait tourner la roue avec animation
- Sélectionne un lot selon les probabilités

**Fonctions principales :**
- `draw()` : Dessine la roue
- `spin()` : Lance la rotation
- `selectPrize()` : Choisit un lot selon les probabilités

**Quand le modifier :** Rarement. Sauf si tu veux changer l'animation ou le design de la roue.

---

### `email.js` - Emails
**Ce qu'il fait :** Envoie les emails via Brevo
- Génère le template HTML de l'email
- Envoie l'email avec le code promo

**Fonctions principales :**
- `send()` : Envoie un email
- `generateEmailTemplate()` : Crée le HTML de l'email

**Quand le modifier :** Si tu veux changer le design de l'email.

---

### `storage.js` - Sauvegarde
**Ce qu'il fait :** Sauvegarde les emails dans Google Sheets
- Envoie les données vers Google Apps Script
- Gère les erreurs

**Fonctions principales :**
- `save()` : Sauvegarde un email et un résultat

**Quand le modifier :** Rarement.

---

### `main.js` - Application
**Ce qu'il fait :** Orchestre tout le système
- Initialise la roue, les emails, le storage
- Gère les événements (clic sur boutons)
- Coordonne les différents services

**Fonctions principales :**
- `start()` : Démarre le jeu
- `onWin()` : Quand l'utilisateur gagne
- `sendEmail()` : Envoie l'email
- `saveData()` : Sauvegarde dans Google Sheets

**Quand le modifier :** Si tu veux ajouter de nouvelles fonctionnalités.

---

## 🎨 Personnalisation Rapide

### Changer les couleurs
Ouvre `config.js` :
```javascript
colors: {
    primary: '#667eea',      // Couleur principale
    secondary: '#764ba2',    // Couleur secondaire
    background: 'linear-gradient(...)' // Fond
}
```

### Modifier les lots
Ouvre `config.js` :
```javascript
prizes: [
    { 
        label: 'TON LOT',
        code: 'TON_CODE',
        color: '#FF0000',
        icon: '🎁',
        probability: 50,  // % de chances de gagner
        segments: 4       // Nombre de parts sur la roue
    }
]
```

**IMPORTANT :** Le total des `probability` doit faire 100% !

### Modifier les textes
Ouvre `config.js` :
```javascript
texts: {
    modalTitle: 'Ton titre',
    modalSubtitle: 'Ton sous-titre',
    buttonText: 'Ton bouton',
    emailSubject: 'Ton sujet email'
}
```

## 🐛 Débogage

### L'email ne part pas
1. Vérifie que l'API Key Brevo est correcte dans `config.js`
2. Ouvre la console (F12) et regarde les erreurs
3. Vérifie que ton email expéditeur est vérifié dans Brevo

### Google Sheets ne fonctionne pas
1. Vérifie que l'URL Google Apps Script est correcte
2. Vérifie que le script est déployé en mode "Tout le monde"
3. Ouvre la console (F12) et regarde les erreurs

### La roue ne tourne pas
1. Ouvre la console (F12) et regarde les erreurs
2. Vérifie que tous les fichiers JS sont bien chargés
3. Vérifie qu'il n'y a pas d'erreur de syntaxe dans `config.js`

## 📊 Comment ça marche ?

1. **Utilisateur arrive** → `index.html` charge tous les fichiers
2. **`main.js` s'initialise** → Crée la roue, les services email et storage
3. **Utilisateur entre son email** → Validation
4. **Roue tourne** → `wheel.js` sélectionne un lot selon les probabilités
5. **Affichage du résultat** → Interface mise à jour
6. **Email envoyé** → `email.js` via Brevo
7. **Sauvegarde** → `storage.js` vers Google Sheets

## 🚀 Déploiement

### Option 1 : Hébergement gratuit
- **Netlify** : Glisse-dépose tous les fichiers
- **Vercel** : Connecte ton repo Git
- **GitHub Pages** : Push sur GitHub

### Option 2 : Serveur classique
- Upload tous les fichiers via FTP
- Pas besoin de serveur backend !

## 💡 Conseils

1. **Teste toujours en local d'abord** avant de déployer
2. **Vérifie la console (F12)** pour les erreurs
3. **Fais des sauvegardes** de `config.js` avant de modifier
4. **Documente tes modifications** pour tes clients

## 📞 Support

Si tu as des questions :
1. Ouvre la console (F12)
2. Note les erreurs
3. Vérifie la configuration dans `config.js`

---

**Bon courage ! 🎡**

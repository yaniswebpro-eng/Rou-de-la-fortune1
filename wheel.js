// Wheel with CSS animations - responsive design
class Wheel {
    constructor(wheelId, prizes) {
        this.wheelElement = document.getElementById(wheelId);
        this.prizes = prizes || [];
        this.rotation = 0; // degrees
        this.isSpinning = false;

        // Build segments list based on `segments` count on each prize
        this.segments = [];
        this.prizes.forEach(p => {
            const count = p.segments || 1;
            for (let i = 0; i < count; i++) this.segments.push(p);
        });

        this.sliceAngle = 360 / Math.max(1, this.segments.length);
        
        // Initialize wheel with segments
        this.initializeWheel();
    }

    initializeWheel() {
        if (!this.wheelElement) return;
        
        this.wheelElement.innerHTML = '';
        
        // Calculer la longueur maximale du texte
        const maxTextLength = Math.max(...this.segments.map(p => p.label.length));
        
        // Adapter la taille de la roue selon la longueur du texte
        // Augmenté à 380px pour une roue plus grande au démarrage
        const baseSize = 500;
        const additionalSize = Math.ceil(maxTextLength / 10) * 40;
        const wheelSize = baseSize + additionalSize;
        
        // Appliquer la taille calculée
        this.wheelElement.style.maxWidth = wheelSize + 'px';
        
        // Créer une roue avec SVG pour un meilleur contrôle
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 400 400');
        svg.setAttribute('style', 'width: 100%; height: 100%; display: block;');
        
        const radius = 180;
        const centerX = 200;
        const centerY = 200;
        
        this.segments.forEach((p, i) => {
            const startAngle = i * this.sliceAngle;
            const endAngle = (i + 1) * this.sliceAngle;
            
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;
            
            const x1 = centerX + radius * Math.cos(startRad);
            const y1 = centerY + radius * Math.sin(startRad);
            const x2 = centerX + radius * Math.cos(endRad);
            const y2 = centerY + radius * Math.sin(endRad);
            
            const largeArc = this.sliceAngle > 180 ? 1 : 0;
            
            // Alterner les couleurs noir et orange en fonction de l'index du segment
            const segmentColor = i % 2 === 0 ? '#000000' : '#FF9500';
            
            // Créer le segment (slice de camembert)
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const d = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
            
            path.setAttribute('d', d);
            path.setAttribute('fill', segmentColor);
            path.setAttribute('stroke', 'white');
            path.setAttribute('stroke-width', '3');
            path.setAttribute('class', 'segment-path');
            
            svg.appendChild(path);
            
            // Ajouter le texte et l'emoji
            const midAngle = (startAngle + endAngle) / 2;
            const midRad = (midAngle - 90) * Math.PI / 180;
            const textRadius = radius * 0.65;
            const textX = centerX + textRadius * Math.cos(midRad);
            const textY = centerY + textRadius * Math.sin(midRad);
            
            // Emoji - adapter la taille selon la longueur du texte
            const emojiSize = Math.max(24, Math.min(36, 24 + Math.floor(maxTextLength / 8) * 2));
            
            const emoji = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            emoji.setAttribute('x', textX);
            emoji.setAttribute('y', textY - 15);
            emoji.setAttribute('text-anchor', 'middle');
            emoji.setAttribute('font-size', emojiSize);
            emoji.setAttribute('dominant-baseline', 'middle');
            emoji.setAttribute('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))');
            emoji.textContent = p.icon;
            svg.appendChild(emoji);
            
            // Label - adapter la taille selon la longueur du texte
            const labelSize = Math.max(11, Math.min(16, 11 + Math.floor(maxTextLength / 12)));
            
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', textX);
            label.setAttribute('y', textY + 15);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('font-size', labelSize);
            label.setAttribute('font-family', 'Poppins, sans-serif');
            label.setAttribute('fill', 'white');
            label.setAttribute('dominant-baseline', 'middle');
            label.setAttribute('letter-spacing', '0.5');
            label.setAttribute('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))');
            label.setAttribute('class', 'wheel-label');
            
            // Gérer les textes longs sur plusieurs lignes
            const words = p.label.split(' ');
            if (words.length > 1 && p.label.length > 10) {
                // Multi-ligne
                const tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                tspan1.setAttribute('x', textX);
                tspan1.setAttribute('dy', 0);
                tspan1.textContent = words.slice(0, Math.ceil(words.length / 2)).join(' ');
                label.appendChild(tspan1);
                
                const tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                tspan2.setAttribute('x', textX);
                tspan2.setAttribute('dy', labelSize + 2);
                tspan2.textContent = words.slice(Math.ceil(words.length / 2)).join(' ');
                label.appendChild(tspan2);
            } else {
                label.textContent = p.label;
            }
            
            svg.appendChild(label);
        });
        
        this.wheelElement.appendChild(svg);
        
        // Centre de la roue
        const center = document.createElement('div');
        center.className = 'wheel-center';
        this.wheelElement.appendChild(center);
    }

    // Alias pour compatibilité avec ancien code
    draw() {
        this.initializeWheel();
    }

    // Easing for natural deceleration
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Choose prize by weighted probability and animate rotation
    spin(callback) {
        if (this.isSpinning) return;
        this.isSpinning = true;

        console.log('🔄 spin(): sélection du lot...');

        // Weighted selection by prize probabilities
        const total = this.prizes.reduce((s, p) => s + (p.probability || 0), 0);
        let r = Math.random() * total;
        let chosenPrize = this.prizes[this.prizes.length - 1];
        for (const p of this.prizes) {
            r -= (p.probability || 0);
            if (r <= 0) { chosenPrize = p; break; }
        }

        // Find indices of segments matching chosenPrize and pick one randomly
        const candidateIndices = [];
        this.segments.forEach((s, idx) => { if (s === chosenPrize) candidateIndices.push(idx); });
        const chosenIndex = candidateIndices.length ? candidateIndices[Math.floor(Math.random() * candidateIndices.length)] : 0;

        // Target angle such that the chosen segment center aligns with top (arrow pointing up)
        const segmentCenter = (chosenIndex + 0.5) * this.sliceAngle; // degrees
        const desiredRotationBase = -segmentCenter;

        // Add several full turns for drama
        const fullTurns = 4 + Math.floor(Math.random() * 3); // 4-6 turns
        const targetRotation = desiredRotationBase + fullTurns * 360;

        const startRotation = this.rotation;
        const rotationDelta = targetRotation - startRotation;

        const duration = 4200 + Math.random() * 1800; // 4.2s - 6s for suspense
        const startTime = performance.now();

        const step = (now) => {
            const elapsed = now - startTime;
            let t = Math.min(1, elapsed / duration);
            const eased = this.easeOutCubic(t);
            this.rotation = startRotation + rotationDelta * eased;
            
            // Apply rotation to wheel
            if (this.wheelElement) {
                this.wheelElement.style.transform = `rotate(${this.rotation}deg)`;
            }

            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                this.isSpinning = false;
                console.log('✅ spin terminé, lot choisi:', chosenPrize.label);
                if (typeof callback === 'function') callback(chosenPrize);
            }
        };

        requestAnimationFrame(step);
    }
}

// Expose globally
window.Wheel = Wheel;

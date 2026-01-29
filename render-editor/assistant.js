// ============================================
// Animated Assistant - "Archi"
// ============================================

const Assistant = {
    element: null,
    messageElement: null,
    isMinimized: false,
    currentState: 'idle',

    tips: {
        welcome: [
            "¡Hola! Soy Archi, tu asistente de edición 👋",
            "Estoy aquí para ayudarte a crear contenido increíble"
        ],
        upload: [
            "💡 Tip: Puedes arrastrar múltiples imágenes a la vez",
            "Usa Ctrl+Click para seleccionar varios archivos"
        ],
        filters: [
            "🎨 El filtro 'Vibrante' es perfecto para redes sociales",
            "Prueba 'Profesional' para presentaciones formales",
            "El filtro 'Cálido' funciona genial con renders de día"
        ],
        collage: [
            "🖼️ ¿Sabías que puedes crear collages con tus renders?",
            "Los collages son perfectos para mostrar múltiples vistas"
        ],
        video: [
            "🎬 Crea videos con transiciones entre tus renders",
            "Los videos generan más engagement en redes sociales"
        ],
        export: [
            "✨ ¡Excelente trabajo! Tu imagen quedó increíble",
            "💾 Recuerda usar PNG para máxima calidad",
            "🚀 ¡Listo para compartir en redes sociales!"
        ],
        keyboard: [
            "⌨️ Atajos útiles: Ctrl+Z para deshacer",
            "Presiona Espacio para vista previa rápida"
        ]
    },

    states: {
        idle: '😊',
        thinking: '🤔',
        excited: '✨',
        celebrating: '🎉',
        sleeping: '😴'
    },

    init() {
        this.createElement();
        this.attachEventListeners();
        setTimeout(() => this.showTip('welcome'), 1000);
    },

    createElement() {
        // Create assistant container
        const container = document.createElement('div');
        container.id = 'assistant';
        container.className = 'assistant';
        container.innerHTML = `
            <div class="assistant-character" id="assistantCharacter">
                <div class="assistant-face">😊</div>
            </div>
            <div class="assistant-message" id="assistantMessage" style="display: none;">
                <div class="assistant-message-text" id="assistantMessageText"></div>
                <button class="assistant-close" id="assistantCloseMsg">×</button>
            </div>
            <button class="assistant-toggle" id="assistantToggle" title="Minimizar/Expandir">
                <span>−</span>
            </button>
        `;

        document.body.appendChild(container);

        this.element = container;
        this.messageElement = document.getElementById('assistantMessage');
        this.characterElement = document.getElementById('assistantCharacter');
        this.faceElement = container.querySelector('.assistant-face');
    },

    attachEventListeners() {
        const toggleBtn = document.getElementById('assistantToggle');
        const closeBtn = document.getElementById('assistantCloseMsg');
        const character = document.getElementById('assistantCharacter');

        toggleBtn.addEventListener('click', () => this.toggle());
        closeBtn.addEventListener('click', () => this.hideMessage());
        character.addEventListener('click', () => this.showRandomTip());
    },

    toggle() {
        this.isMinimized = !this.isMinimized;
        this.element.classList.toggle('minimized', this.isMinimized);

        const toggleBtn = document.getElementById('assistantToggle');
        toggleBtn.querySelector('span').textContent = this.isMinimized ? '+' : '−';

        if (this.isMinimized) {
            this.hideMessage();
            this.setState('sleeping');
        } else {
            this.setState('idle');
        }
    },

    setState(state) {
        this.currentState = state;
        const emoji = this.states[state] || this.states.idle;
        this.faceElement.textContent = emoji;

        // Add animation
        this.characterElement.classList.remove('bounce', 'shake', 'pulse');

        if (state === 'excited' || state === 'celebrating') {
            this.characterElement.classList.add('bounce');
        } else if (state === 'thinking') {
            this.characterElement.classList.add('shake');
        }
    },

    showTip(category) {
        if (this.isMinimized) return;

        const tips = this.tips[category];
        if (!tips || tips.length === 0) return;

        const tip = tips[Math.floor(Math.random() * tips.length)];
        this.showMessage(tip);

        if (category === 'export') {
            this.setState('celebrating');
        } else {
            this.setState('excited');
        }

        setTimeout(() => this.setState('idle'), 3000);
    },

    showRandomTip() {
        const categories = Object.keys(this.tips).filter(c => c !== 'welcome');
        const category = categories[Math.floor(Math.random() * categories.length)];
        this.showTip(category);
    },

    showMessage(text) {
        const messageText = document.getElementById('assistantMessageText');
        messageText.textContent = text;
        this.messageElement.style.display = 'block';

        // Auto-hide after 8 seconds
        setTimeout(() => this.hideMessage(), 8000);
    },

    hideMessage() {
        this.messageElement.style.display = 'none';
    },

    // Context-aware tips
    onImageUpload() {
        setTimeout(() => this.showTip('upload'), 500);
    },

    onFilterApply() {
        if (Math.random() > 0.7) { // 30% chance
            setTimeout(() => this.showTip('filters'), 500);
        }
    },

    onExport() {
        this.showTip('export');
    },

    onMultipleImages() {
        setTimeout(() => this.showTip('collage'), 1000);
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Assistant.init());
} else {
    Assistant.init();
}

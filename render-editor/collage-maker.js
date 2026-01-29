// ============================================
// Collage Maker Module
// ============================================

const CollageMaker = {
    layouts: {
        '2-horizontal': {
            name: '2 Horizontal',
            icon: '▬▬',
            positions: [
                { x: 0, y: 0, w: 0.5, h: 1 },
                { x: 0.5, y: 0, w: 0.5, h: 1 }
            ]
        },
        '2-vertical': {
            name: '2 Vertical',
            icon: '▭',
            positions: [
                { x: 0, y: 0, w: 1, h: 0.5 },
                { x: 0, y: 0.5, w: 1, h: 0.5 }
            ]
        },
        '3-grid': {
            name: '3 Grid (1+2)',
            icon: '▬\n▬▬',
            positions: [
                { x: 0, y: 0, w: 1, h: 0.5 },
                { x: 0, y: 0.5, w: 0.5, h: 0.5 },
                { x: 0.5, y: 0.5, w: 0.5, h: 0.5 }
            ]
        },
        '3-horizontal': {
            name: '3 Horizontal',
            icon: '▬▬▬',
            positions: [
                { x: 0, y: 0, w: 0.333, h: 1 },
                { x: 0.333, y: 0, w: 0.333, h: 1 },
                { x: 0.666, y: 0, w: 0.334, h: 1 }
            ]
        },
        '3-vertical': {
            name: '3 Vertical',
            icon: '▭\n▭\n▭',
            positions: [
                { x: 0, y: 0, w: 1, h: 0.333 },
                { x: 0, y: 0.333, w: 1, h: 0.333 },
                { x: 0, y: 0.666, w: 1, h: 0.334 }
            ]
        },
        '3-grid-alt': {
            name: '3 Grid (2+1)',
            icon: '▬▬\n▬',
            positions: [
                { x: 0, y: 0, w: 0.5, h: 0.5 },
                { x: 0.5, y: 0, w: 0.5, h: 0.5 },
                { x: 0, y: 0.5, w: 1, h: 0.5 }
            ]
        },
        '4-grid': {
            name: '4 Grid (2x2)',
            icon: '▬▬\n▬▬',
            positions: [
                { x: 0, y: 0, w: 0.5, h: 0.5 },
                { x: 0.5, y: 0, w: 0.5, h: 0.5 },
                { x: 0, y: 0.5, w: 0.5, h: 0.5 },
                { x: 0.5, y: 0.5, w: 0.5, h: 0.5 }
            ]
        },
        '4-horizontal': {
            name: '4 Horizontal',
            icon: '▬▬▬▬',
            positions: [
                { x: 0, y: 0, w: 0.25, h: 1 },
                { x: 0.25, y: 0, w: 0.25, h: 1 },
                { x: 0.5, y: 0, w: 0.25, h: 1 },
                { x: 0.75, y: 0, w: 0.25, h: 1 }
            ]
        },
        '4-grid-alt': {
            name: '4 Grid (1+3)',
            icon: '▬\n▬▬▬',
            positions: [
                { x: 0, y: 0, w: 1, h: 0.5 },
                { x: 0, y: 0.5, w: 0.333, h: 0.5 },
                { x: 0.333, y: 0.5, w: 0.333, h: 0.5 },
                { x: 0.666, y: 0.5, w: 0.334, h: 0.5 }
            ]
        },
        '5-grid': {
            name: '5 Grid (2+3)',
            icon: '▬▬\n▬▬▬',
            positions: [
                { x: 0, y: 0, w: 0.5, h: 0.5 },
                { x: 0.5, y: 0, w: 0.5, h: 0.5 },
                { x: 0, y: 0.5, w: 0.333, h: 0.5 },
                { x: 0.333, y: 0.5, w: 0.333, h: 0.5 },
                { x: 0.666, y: 0.5, w: 0.334, h: 0.5 }
            ]
        },
        '5-grid-alt': {
            name: '5 Grid (1+4)',
            icon: '▬\n▬▬▬▬',
            positions: [
                { x: 0, y: 0, w: 1, h: 0.5 },
                { x: 0, y: 0.5, w: 0.25, h: 0.5 },
                { x: 0.25, y: 0.5, w: 0.25, h: 0.5 },
                { x: 0.5, y: 0.5, w: 0.25, h: 0.5 },
                { x: 0.75, y: 0.5, w: 0.25, h: 0.5 }
            ]
        },
        '6-grid': {
            name: '6 Grid (2x3)',
            icon: '▬▬▬\n▬▬▬',
            positions: [
                { x: 0, y: 0, w: 0.333, h: 0.5 },
                { x: 0.333, y: 0, w: 0.333, h: 0.5 },
                { x: 0.666, y: 0, w: 0.334, h: 0.5 },
                { x: 0, y: 0.5, w: 0.333, h: 0.5 },
                { x: 0.333, y: 0.5, w: 0.333, h: 0.5 },
                { x: 0.666, y: 0.5, w: 0.334, h: 0.5 }
            ]
        },
        '6-grid-alt': {
            name: '6 Grid (3x2)',
            icon: '▬▬\n▬▬\n▬▬',
            positions: [
                { x: 0, y: 0, w: 0.5, h: 0.333 },
                { x: 0.5, y: 0, w: 0.5, h: 0.333 },
                { x: 0, y: 0.333, w: 0.5, h: 0.333 },
                { x: 0.5, y: 0.333, w: 0.5, h: 0.333 },
                { x: 0, y: 0.666, w: 0.5, h: 0.334 },
                { x: 0.5, y: 0.666, w: 0.5, h: 0.334 }
            ]
        },
        '8-grid': {
            name: '8 Grid (4x2)',
            icon: '▬▬▬▬\n▬▬▬▬',
            positions: [
                { x: 0, y: 0, w: 0.25, h: 0.5 },
                { x: 0.25, y: 0, w: 0.25, h: 0.5 },
                { x: 0.5, y: 0, w: 0.25, h: 0.5 },
                { x: 0.75, y: 0, w: 0.25, h: 0.5 },
                { x: 0, y: 0.5, w: 0.25, h: 0.5 },
                { x: 0.25, y: 0.5, w: 0.25, h: 0.5 },
                { x: 0.5, y: 0.5, w: 0.25, h: 0.5 },
                { x: 0.75, y: 0.5, w: 0.25, h: 0.5 }
            ]
        }
    },

    settings: {
        spacing: 10,
        borderWidth: 0,
        borderColor: '#ffffff',
        backgroundColor: '#000000'
    },

    generateCollage(images, layoutKey, template, settings = {}) {
        const layout = this.layouts[layoutKey];
        if (!layout) return null;

        // Merge settings
        const config = { ...this.settings, ...settings };

        // Get template dimensions
        const templateConfig = templates[template];
        const width = templateConfig.width;
        const height = templateConfig.height;

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Fill background
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Draw images in layout positions
        const positions = layout.positions;
        const imageCount = Math.min(images.length, positions.length);

        for (let i = 0; i < imageCount; i++) {
            const img = images[i];
            const pos = positions[i];

            // Calculate position with spacing
            const spacing = config.spacing;
            const x = pos.x * width + (pos.x > 0 ? spacing / 2 : 0);
            const y = pos.y * height + (pos.y > 0 ? spacing / 2 : 0);
            const w = pos.w * width - (pos.x > 0 || pos.x + pos.w < 1 ? spacing : spacing / 2);
            const h = pos.h * height - (pos.y > 0 || pos.y + pos.h < 1 ? spacing : spacing / 2);

            // Draw image (cover fit)
            this.drawImageCover(ctx, img, x, y, w, h);

            // Draw border if enabled
            if (config.borderWidth > 0) {
                ctx.strokeStyle = config.borderColor;
                ctx.lineWidth = config.borderWidth;
                ctx.strokeRect(x, y, w, h);
            }
        }

        return canvas;
    },

    drawImageCover(ctx, img, x, y, w, h) {
        const imgRatio = img.width / img.height;
        const boxRatio = w / h;

        let sourceX, sourceY, sourceW, sourceH;

        if (imgRatio > boxRatio) {
            // Image is wider - crop sides
            sourceH = img.height;
            sourceW = img.height * boxRatio;
            sourceX = (img.width - sourceW) / 2;
            sourceY = 0;
        } else {
            // Image is taller - crop top/bottom
            sourceW = img.width;
            sourceH = img.width / boxRatio;
            sourceX = 0;
            sourceY = (img.height - sourceH) / 2;
        }

        ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, x, y, w, h);
    },

    getLayoutsForImageCount(count) {
        const available = [];
        for (const [key, layout] of Object.entries(this.layouts)) {
            if (layout.positions.length === count) {
                available.push({ key, ...layout });
            }
        }
        return available;
    }
};

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CollageMaker;
}

// ============================================
// GIF Generator Module using gif.js
// ============================================

const GIFGenerator = {
    transitions: {
        fade: {
            name: 'Fade',
            icon: '◐',
            frames: 10
        },
        slide: {
            name: 'Slide',
            icon: '→',
            frames: 10
        },
        zoom: {
            name: 'Zoom',
            icon: '⊕',
            frames: 10
        },
        none: {
            name: 'Sin transición',
            icon: '▢',
            frames: 0
        }
    },

    settings: {
        duration: 1000, // milliseconds per image
        transition: 'fade',
        quality: 10, // 1-20, lower is better quality but slower
        width: 800,
        height: 800
    },

    async generateGIF(images, template, settings = {}) {
        const config = { ...this.settings, ...settings };

        return new Promise((resolve, reject) => {
            try {
                // Create canvas for rendering
                const canvas = document.createElement('canvas');
                const templateConfig = templates[template];

                // Scale down for GIF (GIFs can be large)
                const scale = Math.min(config.width / templateConfig.width, config.height / templateConfig.height);
                canvas.width = templateConfig.width * scale;
                canvas.height = templateConfig.height * scale;
                const ctx = canvas.getContext('2d');

                // Create GIF encoder (we'll use a simple frame-based approach)
                const frames = [];
                const transition = this.transitions[config.transition];
                const transitionFrames = transition.frames;

                // Generate frames for each image
                images.forEach((img, index) => {
                    // Main image frame
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    this.drawImageCover(ctx, img, 0, 0, canvas.width, canvas.height);

                    // Capture frame
                    frames.push({
                        data: ctx.getImageData(0, 0, canvas.width, canvas.height),
                        delay: config.duration
                    });

                    // Add transition frames if not last image
                    if (index < images.length - 1 && transitionFrames > 0) {
                        const nextImg = images[index + 1];

                        for (let t = 1; t <= transitionFrames; t++) {
                            const progress = t / transitionFrames;
                            ctx.clearRect(0, 0, canvas.width, canvas.height);

                            if (config.transition === 'fade') {
                                // Fade transition
                                ctx.globalAlpha = 1 - progress;
                                this.drawImageCover(ctx, img, 0, 0, canvas.width, canvas.height);
                                ctx.globalAlpha = progress;
                                this.drawImageCover(ctx, nextImg, 0, 0, canvas.width, canvas.height);
                                ctx.globalAlpha = 1;
                            } else if (config.transition === 'slide') {
                                // Slide transition
                                const offset = canvas.width * progress;
                                this.drawImageCover(ctx, img, -offset, 0, canvas.width, canvas.height);
                                this.drawImageCover(ctx, nextImg, canvas.width - offset, 0, canvas.width, canvas.height);
                            } else if (config.transition === 'zoom') {
                                // Zoom transition
                                const scale1 = 1 + progress * 0.3;
                                const scale2 = 1.3 - progress * 0.3;

                                ctx.globalAlpha = 1 - progress;
                                const w1 = canvas.width * scale1;
                                const h1 = canvas.height * scale1;
                                this.drawImageCover(ctx, img, -(w1 - canvas.width) / 2, -(h1 - canvas.height) / 2, w1, h1);

                                ctx.globalAlpha = progress;
                                const w2 = canvas.width * scale2;
                                const h2 = canvas.height * scale2;
                                this.drawImageCover(ctx, nextImg, -(w2 - canvas.width) / 2, -(h2 - canvas.height) / 2, w2, h2);
                                ctx.globalAlpha = 1;
                            }

                            frames.push({
                                data: ctx.getImageData(0, 0, canvas.width, canvas.height),
                                delay: 100 // Transition frames are faster
                            });
                        }
                    }
                });

                // Convert frames to GIF using simple encoding
                // For a real implementation, you'd use gif.js library
                // For now, we'll create an APNG (animated PNG) which is simpler
                this.createAnimatedImage(frames, canvas.width, canvas.height)
                    .then(blob => resolve(blob))
                    .catch(err => reject(err));

            } catch (error) {
                reject(error);
            }
        });
    },

    drawImageCover(ctx, img, x, y, w, h) {
        const imgRatio = img.width / img.height;
        const boxRatio = w / h;

        let sourceX, sourceY, sourceW, sourceH;

        if (imgRatio > boxRatio) {
            sourceH = img.height;
            sourceW = img.height * boxRatio;
            sourceX = (img.width - sourceW) / 2;
            sourceY = 0;
        } else {
            sourceW = img.width;
            sourceH = img.width / boxRatio;
            sourceX = 0;
            sourceY = (img.height - sourceH) / 2;
        }

        ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, x, y, w, h);
    },

    async createAnimatedImage(frames, width, height) {
        // Create a simple animated WebP or fallback to creating multiple images
        // For browser compatibility, we'll create a canvas animation and record it

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Use MediaRecorder to capture the animation
        const stream = canvas.captureStream(10); // 10 fps
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm',
            videoBitsPerSecond: 2500000
        });

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        return new Promise((resolve, reject) => {
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                resolve(blob);
            };

            mediaRecorder.onerror = reject;

            mediaRecorder.start();

            let frameIndex = 0;
            const animate = () => {
                if (frameIndex >= frames.length) {
                    mediaRecorder.stop();
                    return;
                }

                const frame = frames[frameIndex];
                ctx.putImageData(frame.data, 0, 0);

                setTimeout(() => {
                    frameIndex++;
                    animate();
                }, frame.delay);
            };

            animate();
        });
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GIFGenerator;
}

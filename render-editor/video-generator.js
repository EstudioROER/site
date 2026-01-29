// ============================================
// Video Generator Module
// ============================================

const VideoGenerator = {
    transitions: {
        fade: {
            name: 'Fade',
            icon: '◐',
            apply: (ctx, img1, img2, progress, width, height) => {
                ctx.globalAlpha = 1 - progress;
                ctx.drawImage(img1, 0, 0, width, height);
                ctx.globalAlpha = progress;
                ctx.drawImage(img2, 0, 0, width, height);
                ctx.globalAlpha = 1;
            }
        },
        slide: {
            name: 'Slide',
            icon: '→',
            apply: (ctx, img1, img2, progress, width, height) => {
                const offset = width * progress;
                ctx.drawImage(img1, -offset, 0, width, height);
                ctx.drawImage(img2, width - offset, 0, width, height);
            }
        },
        zoom: {
            name: 'Zoom',
            icon: '⊕',
            apply: (ctx, img1, img2, progress, width, height) => {
                // Zoom out img1
                const scale1 = 1 + progress * 0.5;
                const offset1 = (width * scale1 - width) / 2;
                ctx.globalAlpha = 1 - progress;
                ctx.drawImage(img1, -offset1, -offset1 * (height / width), width * scale1, height * scale1);

                // Zoom in img2
                const scale2 = 1.5 - progress * 0.5;
                const offset2 = (width * scale2 - width) / 2;
                ctx.globalAlpha = progress;
                ctx.drawImage(img2, -offset2, -offset2 * (height / width), width * scale2, height * scale2);
                ctx.globalAlpha = 1;
            }
        },
        dissolve: {
            name: 'Dissolve',
            icon: '◇',
            apply: (ctx, img1, img2, progress, width, height) => {
                ctx.drawImage(img1, 0, 0, width, height);

                // Create dissolve effect
                const imageData = ctx.getImageData(0, 0, width, height);
                const data = imageData.data;

                // Draw img2 to temp canvas
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = width;
                tempCanvas.height = height;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.drawImage(img2, 0, 0, width, height);
                const img2Data = tempCtx.getImageData(0, 0, width, height).data;

                // Blend pixels based on random threshold
                for (let i = 0; i < data.length; i += 4) {
                    if (Math.random() < progress) {
                        data[i] = img2Data[i];
                        data[i + 1] = img2Data[i + 1];
                        data[i + 2] = img2Data[i + 2];
                    }
                }

                ctx.putImageData(imageData, 0, 0);
            }
        },
        wipe: {
            name: 'Wipe',
            icon: '▶',
            apply: (ctx, img1, img2, progress, width, height) => {
                const wipeX = width * progress;

                ctx.drawImage(img1, 0, 0, width, height);
                ctx.save();
                ctx.beginPath();
                ctx.rect(0, 0, wipeX, height);
                ctx.clip();
                ctx.drawImage(img2, 0, 0, width, height);
                ctx.restore();
            }
        }
    },

    settings: {
        duration: 3, // seconds per image
        transitionDuration: 0.5, // seconds
        fps: 30,
        quality: 1080,
        transition: 'fade'
    },

    async generateVideo(images, audioFile = null, settings = {}) {
        const config = { ...this.settings, ...settings };

        // Setup canvas
        const canvas = document.createElement('canvas');
        const scale = config.quality / 1080;
        canvas.width = 1920 * scale;
        canvas.height = 1080 * scale;
        const ctx = canvas.getContext('2d');

        // Setup MediaRecorder
        const stream = canvas.captureStream(config.fps);

        // Add audio if provided
        if (audioFile) {
            const audioContext = new AudioContext();
            const source = audioContext.createMediaElementSource(audioFile);
            const dest = audioContext.createMediaStreamDestination();
            source.connect(dest);
            source.connect(audioContext.destination);

            const audioTrack = dest.stream.getAudioTracks()[0];
            stream.addTrack(audioTrack);
        }

        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: 5000000
        });

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data);
            }
        };

        return new Promise((resolve, reject) => {
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                resolve(blob);
            };

            mediaRecorder.onerror = reject;

            // Start recording
            mediaRecorder.start();

            // Animate frames
            this.animateFrames(ctx, images, canvas.width, canvas.height, config, () => {
                mediaRecorder.stop();
            });
        });
    },

    animateFrames(ctx, images, width, height, config, onComplete) {
        const transition = this.transitions[config.transition];
        const fps = config.fps;
        const frameDuration = 1000 / fps;
        const imageDuration = config.duration * 1000;
        const transitionDuration = config.transitionDuration * 1000;

        let currentImageIndex = 0;
        let frameCount = 0;
        let startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const imageElapsed = elapsed % imageDuration;

            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Determine if in transition
            const isTransitioning = imageElapsed > (imageDuration - transitionDuration);

            if (isTransitioning && currentImageIndex < images.length - 1) {
                // Transition between images
                const transitionProgress = (imageElapsed - (imageDuration - transitionDuration)) / transitionDuration;
                const img1 = images[currentImageIndex];
                const img2 = images[currentImageIndex + 1];

                transition.apply(ctx, img1, img2, transitionProgress, width, height);
            } else {
                // Show current image
                const img = images[currentImageIndex];
                this.drawImageCover(ctx, img, 0, 0, width, height);
            }

            // Move to next image
            if (imageElapsed >= imageDuration) {
                currentImageIndex++;
                startTime = Date.now();

                if (currentImageIndex >= images.length) {
                    onComplete();
                    return;
                }
            }

            frameCount++;
            setTimeout(animate, frameDuration);
        };

        animate();
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
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoGenerator;
}

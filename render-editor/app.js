// State Management
// ============================================
const state = {
    images: [], // Array of {id, img, name}
    currentImageId: null,
    canvas: null,
    ctx: null,
    currentTemplate: 'instagram-post',
    currentFilter: 'none',
    adjustments: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0
    },
    textOverlay: {
        text: '',
        font: 'Inter',
        size: 32,
        color: '#ffffff',
        position: 'bottom'
    }
};

// ============================================
// Template Configurations
// ============================================
const templates = {
    'instagram-post': { width: 1080, height: 1080, name: 'Instagram Post' },
    'instagram-story': { width: 1080, height: 1920, name: 'Instagram Story' },
    'facebook-post': { width: 1200, height: 630, name: 'Facebook Post' },
    'linkedin-post': { width: 1200, height: 627, name: 'LinkedIn Post' }
};

// ============================================
// Filter Presets
// ============================================
const filters = {
    'none': {},
    'professional': {
        brightness: 105,
        contrast: 110,
        saturation: 95
    },
    'vibrant': {
        brightness: 110,
        contrast: 120,
        saturation: 130
    },
    'bw': {
        brightness: 100,
        contrast: 110,
        saturation: 0
    },
    'warm': {
        brightness: 108,
        contrast: 105,
        saturation: 115,
        hue: 10
    },
    'cool': {
        brightness: 102,
        contrast: 108,
        saturation: 110,
        hue: -10
    }
};

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    setupEventListeners();
});

function initializeElements() {
    state.canvas = document.getElementById('mainCanvas');
    state.ctx = state.canvas.getContext('2d');
}

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
    // Upload
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const selectFileBtn = document.getElementById('selectFileBtn');

    uploadArea.addEventListener('click', () => fileInput.click());
    selectFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });

    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            loadImage(file);
        }
    });

    // Templates
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentTemplate = btn.dataset.template;
            renderCanvas();
        });
    });

    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentFilter = btn.dataset.filter;
            applyFilter(btn.dataset.filter);
        });
    });

    // Adjustments
    setupAdjustmentListeners();

    // Text
    setupTextListeners();

    // Controls
    document.getElementById('resetBtn').addEventListener('click', resetImage);
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
    document.getElementById('exportBtn').addEventListener('click', downloadImage);
    document.getElementById('addMoreBtn').addEventListener('click', () => fileInput.click());
}

function setupAdjustmentListeners() {
    const adjustments = ['brightness', 'contrast', 'saturation', 'blur'];

    adjustments.forEach(adj => {
        const input = document.getElementById(adj);
        const valueDisplay = document.getElementById(`${adj}Value`);

        input.addEventListener('input', (e) => {
            const value = e.target.value;
            state.adjustments[adj] = parseInt(value);

            if (adj === 'blur') {
                valueDisplay.textContent = `${value}px`;
            } else {
                valueDisplay.textContent = `${value}%`;
            }

            renderCanvas();
        });
    });
}

function setupTextListeners() {
    const textInput = document.getElementById('textInput');
    const fontFamily = document.getElementById('fontFamily');
    const fontSize = document.getElementById('fontSize');
    const textColor = document.getElementById('textColor');
    const addTextBtn = document.getElementById('addTextBtn');
    const textOverlay = document.getElementById('textOverlay');

    // Text template presets
    const textTemplates = {
        title: {
            text: 'PROYECTO ARQUITECTÓNICO',
            font: 'Outfit',
            size: 48,
            color: '#ffffff',
            position: 'top'
        },
        subtitle: {
            text: 'Diseño Moderno y Funcional',
            font: 'Inter',
            size: 28,
            color: '#e0e0e0',
            position: 'center'
        },
        quote: {
            text: '"Arquitectura que inspira"',
            font: 'Georgia',
            size: 36,
            color: '#f0f0f0',
            position: 'center'
        },
        watermark: {
            text: '© Tu Estudio 2026',
            font: 'Inter',
            size: 18,
            color: '#ffffff',
            position: 'bottom'
        },
        location: {
            text: '📍 Santiago, Chile',
            font: 'Inter',
            size: 24,
            color: '#ffffff',
            position: 'bottom'
        },
        price: {
            text: 'Desde UF 3.500',
            font: 'Outfit',
            size: 32,
            color: '#ffffff',
            position: 'bottom'
        }
    };

    // Template buttons
    document.querySelectorAll('.template-text-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const template = btn.dataset.template;
            const preset = textTemplates[template];

            if (preset) {
                // Update UI
                textInput.value = preset.text;
                fontFamily.value = preset.font;
                fontSize.value = preset.size;
                textColor.value = preset.color;

                // Update state
                state.textOverlay.text = preset.text;
                state.textOverlay.font = preset.font;
                state.textOverlay.size = preset.size;
                state.textOverlay.color = preset.color;
                state.textOverlay.position = preset.position;

                // Apply
                updateTextOverlay();

                // Visual feedback
                document.querySelectorAll('.template-text-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    });

    addTextBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (text) {
            state.textOverlay.text = text;
            state.textOverlay.font = fontFamily.value;
            state.textOverlay.size = parseInt(fontSize.value);
            state.textOverlay.color = textColor.value;
            updateTextOverlay();
        }
    });

    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTextBtn.click();
        }
    });

    document.querySelectorAll('.position-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.textOverlay.position = btn.dataset.position;
            updateTextOverlay();
        });
    });
}

// ============================================
// Image Handling
// ============================================
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        loadImages(files);
    }
}

function loadImages(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) return;

    let loadedCount = 0;

    imageFiles.forEach(file => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const imageId = Date.now() + Math.random();

                state.images.push({
                    id: imageId,
                    img: img,
                    name: file.name,
                    dataUrl: e.target.result
                });

                loadedCount++;

                // When all images are loaded
                if (loadedCount === imageFiles.length) {
                    // Show editor, hide upload
                    document.getElementById('uploadSection').style.display = 'none';
                    document.getElementById('editorSection').style.display = 'block';

                    // Set first image as active
                    if (!state.currentImageId && state.images.length > 0) {
                        state.currentImageId = state.images[0].id;
                    }

                    // Update gallery
                    updateGallery();

                    // Render
                    renderCanvas();

                    // Initialize advanced features (collage, video)
                    setTimeout(() => {
                        initializeAdvancedFeatures();
                        updateAdvancedSections();
                    }, 100);
                }
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    });
}

function updateGallery() {
    const gallery = document.getElementById('imageGallery');
    const galleryGrid = document.getElementById('galleryGrid');
    const imageCount = document.getElementById('imageCount');

    // Show gallery if multiple images
    if (state.images.length > 1) {
        gallery.style.display = 'block';
    } else {
        gallery.style.display = 'none';
    }

    // Update count
    imageCount.textContent = state.images.length;

    // Clear grid
    galleryGrid.innerHTML = '';

    // Add thumbnails
    state.images.forEach((imageData, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.draggable = true;
        item.dataset.imageId = imageData.id;

        if (imageData.id === state.currentImageId) {
            item.classList.add('active');
        }

        const img = document.createElement('img');
        img.src = imageData.dataUrl;
        img.alt = imageData.name;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'gallery-item-remove';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = (e) => {
            e.stopPropagation();
            removeImage(imageData.id);
        };

        item.appendChild(img);
        item.appendChild(removeBtn);

        // Click to select
        item.onclick = () => {
            selectImage(imageData.id);
        };

        // Drag and drop handlers
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragleave', handleDragLeave);

        galleryGrid.appendChild(item);
    });
}

// Drag and drop functions
let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';

    if (this !== draggedItem) {
        this.classList.add('drag-over');
    }
    return false;
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (draggedItem !== this) {
        // Get the IDs
        const draggedId = draggedItem.dataset.imageId;
        const targetId = this.dataset.imageId;

        // Find indices
        const draggedIndex = state.images.findIndex(img => img.id == draggedId);
        const targetIndex = state.images.findIndex(img => img.id == targetId);

        // Swap in array
        if (draggedIndex !== -1 && targetIndex !== -1) {
            const temp = state.images[draggedIndex];
            state.images[draggedIndex] = state.images[targetIndex];
            state.images[targetIndex] = temp;

            // Update gallery
            updateGallery();
        }
    }

    this.classList.remove('drag-over');
    return false;
}

function selectImage(imageId) {
    state.currentImageId = imageId;
    updateGallery();
    renderCanvas();
}

function removeImage(imageId) {
    const index = state.images.findIndex(img => img.id === imageId);
    if (index === -1) return;

    state.images.splice(index, 1);

    // If removed image was active, select another
    if (state.currentImageId === imageId) {
        if (state.images.length > 0) {
            state.currentImageId = state.images[0].id;
        } else {
            state.currentImageId = null;
            // Return to upload screen
            document.getElementById('uploadSection').style.display = 'block';
            document.getElementById('editorSection').style.display = 'none';
            document.getElementById('fileInput').value = '';
            return;
        }
    }

    updateGallery();
    renderCanvas();
}

function getCurrentImage() {
    const imageData = state.images.find(img => img.id === state.currentImageId);
    return imageData ? imageData.img : null;
}

function resetState() {
    state.currentFilter = 'none';
    state.adjustments = {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0
    };

    // Reset UI
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === 'none');
    });

    document.getElementById('brightness').value = 100;
    document.getElementById('contrast').value = 100;
    document.getElementById('saturation').value = 100;
    document.getElementById('blur').value = 0;

    document.getElementById('brightnessValue').textContent = '100%';
    document.getElementById('contrastValue').textContent = '100%';
    document.getElementById('saturationValue').textContent = '100%';
    document.getElementById('blurValue').textContent = '0px';
}

// ============================================
// Canvas Rendering
// ============================================
function renderCanvas() {
    const currentImage = getCurrentImage();
    if (!currentImage) return;

    const template = templates[state.currentTemplate];

    // Set canvas size
    state.canvas.width = template.width;
    state.canvas.height = template.height;

    // Calculate image dimensions to fit canvas while maintaining aspect ratio
    const imgRatio = currentImage.width / currentImage.height;
    const canvasRatio = template.width / template.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgRatio > canvasRatio) {
        // Image is wider
        drawHeight = template.height;
        drawWidth = drawHeight * imgRatio;
        offsetX = (template.width - drawWidth) / 2;
        offsetY = 0;
    } else {
        // Image is taller
        drawWidth = template.width;
        drawHeight = drawWidth / imgRatio;
        offsetX = 0;
        offsetY = (template.height - drawHeight) / 2;
    }

    // Clear canvas
    state.ctx.clearRect(0, 0, template.width, template.height);

    // Apply filters
    const filterString = buildFilterString();
    state.ctx.filter = filterString;

    // Draw image
    state.ctx.drawImage(currentImage, offsetX, offsetY, drawWidth, drawHeight);

    // Reset filter
    state.ctx.filter = 'none';
}

function buildFilterString() {
    const { brightness, contrast, saturation, blur } = state.adjustments;

    let filters = [];

    if (brightness !== 100) {
        filters.push(`brightness(${brightness}%)`);
    }
    if (contrast !== 100) {
        filters.push(`contrast(${contrast}%)`);
    }
    if (saturation !== 100) {
        filters.push(`saturate(${saturation}%)`);
    }
    if (blur > 0) {
        filters.push(`blur(${blur}px)`);
    }

    return filters.join(' ') || 'none';
}

// ============================================
// Filter Application
// ============================================
function applyFilter(filterName) {
    const preset = filters[filterName];

    if (preset) {
        // Apply preset values
        state.adjustments.brightness = preset.brightness || 100;
        state.adjustments.contrast = preset.contrast || 100;
        state.adjustments.saturation = preset.saturation || 100;
        state.adjustments.blur = preset.blur || 0;

        // Update UI
        document.getElementById('brightness').value = state.adjustments.brightness;
        document.getElementById('contrast').value = state.adjustments.contrast;
        document.getElementById('saturation').value = state.adjustments.saturation;
        document.getElementById('blur').value = state.adjustments.blur;

        document.getElementById('brightnessValue').textContent = `${state.adjustments.brightness}%`;
        document.getElementById('contrastValue').textContent = `${state.adjustments.contrast}%`;
        document.getElementById('saturationValue').textContent = `${state.adjustments.saturation}%`;
        document.getElementById('blurValue').textContent = `${state.adjustments.blur}px`;

        renderCanvas();
    }
}

// ============================================
// Text Overlay
// ============================================
function updateTextOverlay() {
    const overlay = document.getElementById('textOverlay');
    const { text, font, size, color, position } = state.textOverlay;

    overlay.textContent = text;
    overlay.style.fontFamily = font;
    overlay.style.fontSize = `${size}px`;
    overlay.style.color = color;

    // Position
    overlay.style.top = '';
    overlay.style.bottom = '';
    overlay.style.left = '50%';
    overlay.style.transform = 'translateX(-50%)';

    switch (position) {
        case 'top':
            overlay.style.top = '20px';
            break;
        case 'center':
            overlay.style.top = '50%';
            overlay.style.transform = 'translate(-50%, -50%)';
            break;
        case 'bottom':
            overlay.style.bottom = '20px';
            break;
    }
}

// ============================================
// Export & Download
// ============================================
function downloadImage() {
    if (!state.canvas) return;

    // Create a temporary canvas to merge canvas and text
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    const template = templates[state.currentTemplate];

    tempCanvas.width = template.width;
    tempCanvas.height = template.height;

    // Draw the main canvas
    tempCtx.drawImage(state.canvas, 0, 0);

    // Draw text if exists
    if (state.textOverlay.text) {
        const { text, font, size, color, position } = state.textOverlay;

        tempCtx.font = `600 ${size}px ${font}`;
        tempCtx.fillStyle = color;
        tempCtx.textAlign = 'center';
        tempCtx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        tempCtx.shadowBlur = 8;
        tempCtx.shadowOffsetX = 2;
        tempCtx.shadowOffsetY = 2;

        let yPos;
        switch (position) {
            case 'top':
                yPos = size + 40;
                break;
            case 'center':
                yPos = template.height / 2;
                break;
            case 'bottom':
                yPos = template.height - 40;
                break;
        }

        // Word wrap for long text
        const maxWidth = template.width * 0.9;
        const words = text.split(' ');
        let line = '';
        let lines = [];

        words.forEach(word => {
            const testLine = line + word + ' ';
            const metrics = tempCtx.measureText(testLine);

            if (metrics.width > maxWidth && line !== '') {
                lines.push(line);
                line = word + ' ';
            } else {
                line = testLine;
            }
        });
        lines.push(line);

        // Draw each line
        const lineHeight = size * 1.2;
        const startY = yPos - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, index) => {
            tempCtx.fillText(line.trim(), template.width / 2, startY + (index * lineHeight));
        });
    }

    // Get format
    const format = document.getElementById('exportFormat').value;
    let mimeType, extension;

    switch (format) {
        case 'png':
            mimeType = 'image/png';
            extension = 'png';
            break;
        case 'jpeg':
            mimeType = 'image/jpeg';
            extension = 'jpg';
            break;
        case 'webp':
            mimeType = 'image/webp';
            extension = 'webp';
            break;
        default:
            mimeType = 'image/png';
            extension = 'png';
    }

    // Download
    tempCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `render-${state.currentTemplate}-${Date.now()}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, mimeType, 0.95);
}

function resetImage() {
    if (confirm('¿Quieres cargar nuevas imágenes? Esto eliminará todas las imágenes actuales.')) {
        state.images = [];
        state.currentImageId = null;
        document.getElementById('uploadSection').style.display = 'block';
        document.getElementById('editorSection').style.display = 'none';
        document.getElementById('fileInput').value = '';
        document.getElementById('textInput').value = '';
        document.getElementById('textOverlay').textContent = '';
        state.textOverlay.text = '';
    }
}

// ============================================
// Collage Integration
// ============================================
function initializeAdvancedFeatures() {
    // Show/hide collage section based on image count
    updateAdvancedSections();

    // Collage controls
    setupCollageControls();

    // Comparison controls
    setupComparisonControls();
}

function updateAdvancedSections() {
    const collageSection = document.getElementById('collageSection');
    const comparisonSection = document.getElementById('comparisonSection');

    // Show collage options only when multiple images are loaded
    if (state.images.length >= 2) {
        collageSection.style.display = 'block';
        comparisonSection.style.display = 'block';

        // Update collage layouts
        updateCollageLayouts();

        // Update comparison dropdowns
        updateComparisonDropdowns();

        // Notify assistant
        if (typeof Assistant !== 'undefined' && state.images.length === 2) {
            Assistant.onMultipleImages();
        }
    } else {
        collageSection.style.display = 'none';
        comparisonSection.style.display = 'none';
    }
}

function updateComparisonDropdowns() {
    const beforeSelect = document.getElementById('beforeImage');
    const afterSelect = document.getElementById('afterImage');

    if (!beforeSelect || !afterSelect) return;

    // Clear existing options except first
    beforeSelect.innerHTML = '<option value="">Selecciona imagen...</option>';
    afterSelect.innerHTML = '<option value="">Selecciona imagen...</option>';

    // Add image options
    state.images.forEach((imageData, index) => {
        const option1 = document.createElement('option');
        option1.value = imageData.id;
        option1.textContent = `Imagen ${index + 1} - ${imageData.name}`;
        beforeSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = imageData.id;
        option2.textContent = `Imagen ${index + 1} - ${imageData.name}`;
        afterSelect.appendChild(option2);
    });

    // Auto-select first two if available
    if (state.images.length >= 2) {
        beforeSelect.value = state.images[0].id;
        afterSelect.value = state.images[1].id;
    }
}

function setupComparisonControls() {
    const generateBtn = document.getElementById('generateComparisonBtn');

    if (generateBtn) {
        generateBtn.addEventListener('click', generateComparison);
    }
}

function generateComparison() {
    const beforeId = document.getElementById('beforeImage').value;
    const afterId = document.getElementById('afterImage').value;
    const orientation = document.getElementById('comparisonOrientation').value;

    if (!beforeId || !afterId) {
        alert('Por favor selecciona ambas imágenes');
        return;
    }

    if (beforeId === afterId) {
        alert('Por favor selecciona imágenes diferentes');
        return;
    }

    const beforeImg = state.images.find(img => img.id == beforeId);
    const afterImg = state.images.find(img => img.id == afterId);

    if (!beforeImg || !afterImg) return;

    const template = templates[state.currentTemplate];

    // Create comparison canvas
    const canvas = document.createElement('canvas');
    canvas.width = template.width;
    canvas.height = template.height;
    const ctx = canvas.getContext('2d');

    // Draw before image (left/top half)
    if (orientation === 'vertical') {
        // Vertical split (slider moves horizontally)
        const halfWidth = template.width / 2;

        // Draw before (left half)
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, halfWidth, template.height);
        ctx.clip();
        drawImageCover(ctx, beforeImg.img, 0, 0, template.width, template.height);
        ctx.restore();

        // Draw after (right half)
        ctx.save();
        ctx.beginPath();
        ctx.rect(halfWidth, 0, halfWidth, template.height);
        ctx.clip();
        drawImageCover(ctx, afterImg.img, 0, 0, template.width, template.height);
        ctx.restore();

        // Draw divider line
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(halfWidth, 0);
        ctx.lineTo(halfWidth, template.height);
        ctx.stroke();

        // Draw labels
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Inter';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 8;
        ctx.fillText('ANTES', 40, 60);
        ctx.fillText('DESPUÉS', halfWidth + 40, 60);

    } else {
        // Horizontal split (slider moves vertically)
        const halfHeight = template.height / 2;

        // Draw before (top half)
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, template.width, halfHeight);
        ctx.clip();
        drawImageCover(ctx, beforeImg.img, 0, 0, template.width, template.height);
        ctx.restore();

        // Draw after (bottom half)
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, halfHeight, template.width, halfHeight);
        ctx.clip();
        drawImageCover(ctx, afterImg.img, 0, 0, template.width, template.height);
        ctx.restore();

        // Draw divider line
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, halfHeight);
        ctx.lineTo(template.width, halfHeight);
        ctx.stroke();

        // Draw labels
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Inter';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 8;
        ctx.fillText('ANTES', 40, 60);
        ctx.fillText('DESPUÉS', 40, halfHeight + 60);
    }

    // Replace main canvas with comparison
    state.canvas.width = canvas.width;
    state.canvas.height = canvas.height;
    state.ctx.drawImage(canvas, 0, 0);

    // Notify assistant
    if (typeof Assistant !== 'undefined') {
        Assistant.showMessage('¡Comparativa creada! ⚖️ Perfecta para mostrar antes/después');
    }
}

function drawImageCover(ctx, img, x, y, w, h) {
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

function setupCollageControls() {
    const spacingInput = document.getElementById('collageSpacing');
    const spacingValue = document.getElementById('collageSpacingValue');
    const generateBtn = document.getElementById('generateCollageBtn');

    if (spacingInput) {
        spacingInput.addEventListener('input', (e) => {
            spacingValue.textContent = `${e.target.value}px`;
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', generateCollage);
    }
}

function updateCollageLayouts() {
    const layoutsContainer = document.getElementById('collageLayouts');
    if (!layoutsContainer) return;

    layoutsContainer.innerHTML = '';

    const imageCount = state.images.length;
    const availableLayouts = CollageMaker.getLayoutsForImageCount(imageCount);

    availableLayouts.forEach(layout => {
        const btn = document.createElement('button');
        btn.className = 'collage-layout-btn';
        btn.dataset.layout = layout.key;
        btn.innerHTML = `
            <div class="collage-layout-icon">${layout.icon}</div>
            <div>${layout.name}</div>
        `;

        btn.addEventListener('click', () => {
            document.querySelectorAll('.collage-layout-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show preview when layout is selected
            showCollagePreview(layout.key);
        });

        layoutsContainer.appendChild(btn);
    });

    // Select first layout by default
    if (availableLayouts.length > 0) {
        layoutsContainer.firstChild.classList.add('active');
        showCollagePreview(availableLayouts[0].key);
    }
}

// State for collage image assignments
let collageAssignments = [];

function showCollagePreview(layoutKey) {
    const preview = document.getElementById('collagePreview');
    const previewGrid = document.getElementById('collagePreviewGrid');

    if (!preview || !previewGrid) return;

    const layout = CollageMaker.layouts[layoutKey];
    if (!layout) return;

    preview.style.display = 'block';
    previewGrid.innerHTML = '';

    // Initialize assignments if needed
    if (collageAssignments.length !== layout.positions.length) {
        collageAssignments = layout.positions.map((_, index) =>
            index < state.images.length ? state.images[index].id : null
        );
    }

    // Set grid layout based on positions
    const cols = Math.max(...layout.positions.map(p => Math.ceil((p.x + p.w) * 10)));
    const rows = Math.max(...layout.positions.map(p => Math.ceil((p.y + p.h) * 10)));

    previewGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    previewGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    // Create slots
    layout.positions.forEach((pos, index) => {
        const slot = document.createElement('div');
        slot.className = 'collage-preview-slot';
        slot.dataset.slotIndex = index;

        // Set grid position
        const colStart = Math.floor(pos.x * 10) + 1;
        const colEnd = Math.ceil((pos.x + pos.w) * 10) + 1;
        const rowStart = Math.floor(pos.y * 10) + 1;
        const rowEnd = Math.ceil((pos.y + pos.h) * 10) + 1;

        slot.style.gridColumn = `${colStart} / ${colEnd}`;
        slot.style.gridRow = `${rowStart} / ${rowEnd}`;

        // Add slot number
        const slotNumber = document.createElement('div');
        slotNumber.className = 'slot-number';
        slotNumber.textContent = index + 1;
        slot.appendChild(slotNumber);

        // Check if image is assigned
        const assignedImageId = collageAssignments[index];
        if (assignedImageId) {
            const imageData = state.images.find(img => img.id === assignedImageId);
            if (imageData) {
                const img = document.createElement('img');
                img.src = imageData.dataUrl;
                img.draggable = true;
                img.dataset.imageId = imageData.id;
                img.dataset.fromSlot = index;

                img.addEventListener('dragstart', handleCollageImageDragStart);
                img.addEventListener('dragend', handleCollageImageDragEnd);

                slot.appendChild(img);
                slot.classList.add('has-image');
            }
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'slot-placeholder';
            placeholder.textContent = 'Arrastra imagen aquí';
            slot.appendChild(placeholder);
        }

        // Slot drop handlers
        slot.addEventListener('dragover', handleCollageSlotDragOver);
        slot.addEventListener('drop', handleCollageSlotDrop);
        slot.addEventListener('dragleave', handleCollageSlotDragLeave);

        previewGrid.appendChild(slot);
    });
}

let draggedCollageImage = null;

function handleCollageImageDragStart(e) {
    draggedCollageImage = {
        imageId: this.dataset.imageId,
        fromSlot: parseInt(this.dataset.fromSlot)
    };
    this.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
}

function handleCollageImageDragEnd(e) {
    this.style.opacity = '1';
}

function handleCollageSlotDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('drag-over');
    return false;
}

function handleCollageSlotDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleCollageSlotDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    this.classList.remove('drag-over');

    if (!draggedCollageImage) return false;

    const toSlot = parseInt(this.dataset.slotIndex);
    const fromSlot = draggedCollageImage.fromSlot;

    // Swap assignments
    const temp = collageAssignments[toSlot];
    collageAssignments[toSlot] = collageAssignments[fromSlot];
    collageAssignments[fromSlot] = temp;

    // Refresh preview
    const activeLayout = document.querySelector('.collage-layout-btn.active');
    if (activeLayout) {
        showCollagePreview(activeLayout.dataset.layout);
    }

    draggedCollageImage = null;
    return false;
}

function generateCollage() {
    const activeLayout = document.querySelector('.collage-layout-btn.active');
    if (!activeLayout) {
        alert('Por favor selecciona un layout');
        return;
    }

    const layoutKey = activeLayout.dataset.layout;
    const spacing = parseInt(document.getElementById('collageSpacing').value);

    // Get images in the order specified by assignments
    const orderedImages = collageAssignments
        .map(imageId => {
            if (!imageId) return null;
            const imageData = state.images.find(img => img.id === imageId);
            return imageData ? imageData.img : null;
        })
        .filter(img => img !== null);

    // If not enough images assigned, use default order
    const images = orderedImages.length > 0 ? orderedImages : state.images.map(img => img.img);

    // Generate collage
    const collageCanvas = CollageMaker.generateCollage(
        images,
        layoutKey,
        state.currentTemplate,
        { spacing }
    );

    if (collageCanvas) {
        // Replace main canvas with collage
        state.canvas.width = collageCanvas.width;
        state.canvas.height = collageCanvas.height;
        state.ctx.drawImage(collageCanvas, 0, 0);

        // Notify assistant
        if (typeof Assistant !== 'undefined') {
            Assistant.showMessage('¡Collage generado! 🎨');
        }
    }
}

// Also update when images change
const originalUpdateGallery = updateGallery;
updateGallery = function () {
    originalUpdateGallery.call(this);
    updateAdvancedSections();
};

// Notify assistant on filter apply
const originalApplyFilter = applyFilter;
applyFilter = function (filterName) {
    originalApplyFilter.call(this, filterName);
    if (typeof Assistant !== 'undefined') {
        Assistant.onFilterApply();
    }
};

// Notify assistant on export
const originalDownloadImage = downloadImage;
downloadImage = function () {
    originalDownloadImage.call(this);
    if (typeof Assistant !== 'undefined') {
        Assistant.onExport();
    }
};

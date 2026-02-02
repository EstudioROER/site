// Evaluación Wizard - Formularios Dinámicos por Tipo de Proyecto

let currentStep = 1;
const totalSteps = 10; // Updated to include file upload step
let formData = {};
let uploadedFiles = {
    planos: [],
    fotos: [],
    documentos: []
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing wizard...');

    // Initialize
    updateProgress();
    updateButtons();

    // Setup button event listeners
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Previous button clicked, current step:', currentStep);
            changeStep(-1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Next button clicked, current step:', currentStep);
            changeStep(1);
        });
    }

    // Option card selection
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function () {
            console.log('Project type selected:', this.dataset.value);
            document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            formData.tipoProyecto = this.dataset.value;
            formData.tipoProyectoNombre = this.querySelector('.title').textContent;

            // Generate dynamic step based on project type
            generateDynamicStep(formData.tipoProyecto);

            // Auto-advance to next step
            setTimeout(() => {
                changeStep(1);
            }, 400);
        });
    });

    // Initialize file upload handlers
    handleFileUpload('archivosPlanos', 'planos', 10, 5);
    handleFileUpload('archivosFotos', 'fotos', 5, 10);
    handleFileUpload('archivosDocumentos', 'documentos', 5, 5);
});

// ============================================
// VALIDATION FUNCTIONS - Anti-Spam
// ============================================

function validateTextQuality(text, minWords = 3) {
    // Remove extra spaces
    const cleaned = text.trim().replace(/\s+/g, ' ');

    // Check minimum length
    if (cleaned.length < 10) {
        return { valid: false, message: 'El texto es demasiado corto (mínimo 10 caracteres)' };
    }

    // Check for spam patterns
    const spamPatterns = [
        { pattern: /(.)\1{5,}/, message: 'No se permiten caracteres repetidos excesivamente' },
        { pattern: /^[^a-zA-ZáéíóúñÁÉÍÓÚÑ]*$/, message: 'El texto debe contener letras' },
        { pattern: /(test|asdf|qwer|xxxx|1234|aaaa|bbbb)/i, message: 'El texto parece no ser válido' },
        { pattern: /(https?:\/\/|www\.)/i, message: 'No se permiten URLs en este campo' }
    ];

    for (const { pattern, message } of spamPatterns) {
        if (pattern.test(cleaned)) {
            return { valid: false, message };
        }
    }

    // Check word count
    const words = cleaned.split(' ').filter(w => w.length > 2);
    if (words.length < minWords) {
        return { valid: false, message: `Debe contener al menos ${minWords} palabras` };
    }

    // Check word diversity
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    if (uniqueWords.size < Math.min(minWords, words.length * 0.5)) {
        return { valid: false, message: 'El texto parece repetitivo o sin sentido' };
    }

    return { valid: true };
}

function validateEmail(email) {
    const cleaned = email.trim().toLowerCase();

    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleaned)) {
        return { valid: false, message: 'Formato de email inválido' };
    }

    // Check for temporary email domains
    const tempDomains = ['tempmail', 'guerrillamail', '10minutemail', 'throwaway', 'mailinator'];
    if (tempDomains.some(domain => cleaned.includes(domain))) {
        return { valid: false, message: 'No se permiten emails temporales' };
    }

    // Check for valid TLD
    const validTLDs = /\.(com|cl|net|org|edu|gov|mil|info|biz|co)$/;
    if (!validTLDs.test(cleaned)) {
        return { valid: false, message: 'Dominio de email no válido' };
    }

    return { valid: true };
}

function validatePhone(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Chilean phone validation
    // Formats accepted: +56912345678, 56912345678, 912345678, 12345678
    if (cleaned.length < 8) {
        return { valid: false, message: 'Teléfono demasiado corto' };
    }

    // Check if it's a valid Chilean mobile (starts with 9 after country code)
    const mobileRegex = /^(56)?9\d{8}$/;
    const landlineRegex = /^(56)?\d{8,9}$/;

    if (!mobileRegex.test(cleaned) && !landlineRegex.test(cleaned)) {
        return { valid: false, message: 'Formato de teléfono chileno inválido' };
    }

    return { valid: true };
}

function validateName(name) {
    const cleaned = name.trim();

    if (cleaned.length < 3) {
        return { valid: false, message: 'El nombre es demasiado corto' };
    }

    // Check for at least one space (first and last name)
    if (!cleaned.includes(' ')) {
        return { valid: false, message: 'Por favor ingresa nombre y apellido' };
    }

    // Check for valid characters (letters, spaces, accents)
    const nameRegex = /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/;
    if (!nameRegex.test(cleaned)) {
        return { valid: false, message: 'El nombre solo debe contener letras' };
    }

    return { valid: true };
}

// ============================================
// FILE UPLOAD FUNCTIONS
// ============================================

function handleFileUpload(inputId, fileType, maxSize, maxFiles) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('change', function (e) {
        const files = Array.from(e.target.files);
        const previewId = inputId + 'Preview';
        const preview = document.getElementById(previewId);

        if (!preview) return;

        // Validate file count
        if (files.length > maxFiles) {
            alert(`Máximo ${maxFiles} archivos permitidos`);
            input.value = '';
            return;
        }

        // Validate each file
        const validFiles = [];
        for (const file of files) {
            // Check size
            if (file.size > maxSize * 1024 * 1024) {
                alert(`${file.name} excede el tamaño máximo de ${maxSize}MB`);
                continue;
            }

            validFiles.push(file);
        }

        // Store files
        uploadedFiles[fileType] = validFiles;

        // Update preview
        preview.innerHTML = validFiles.map(file => `
            <div class="file-item">
                <span>📎 ${file.name}</span>
                <span class="file-size">(${(file.size / 1024).toFixed(1)} KB)</span>
            </div>
        `).join('');

        console.log(`${fileType} files uploaded:`, validFiles.length);
    });
}

function getRequirementsHtml(projectType) {
    let reqs = [];
    switch (projectType) {
        case 'obra-nueva': reqs = ['Copie de Inscripción de Dominio (CBR)', 'Certificado de Informaciones Previas (CIP)', 'Topografía (si existe)']; break;
        case 'ampliacion': reqs = ['Permiso de Edificación de la casa original', 'Planos de la casa existente', 'Certificado de Informaciones Previas']; break;
        case 'regularizacion': reqs = ['Certificado de Avalúo Fiscal detallado', 'Escritura de la propiedad', 'Boleta de servicios (luz/agua)']; break;
        case 'subdivision': reqs = ['Escritura con inscripción CBR (fojas/número)', 'Certificado de Informaciones Previas', 'Plano Topográfico']; break;
        case 'fusion-predial': reqs = ['Escrituras de todos los roles a fusionar', 'Certificado de Informaciones Previas', 'Certificados de número']; break;
        case 'remodelacion': reqs = ['Planos de arquitectura actuales', 'Fotos del estado actual']; break;
        case 'cambio-destino': reqs = ['Certificado de Informaciones Previas (CIP)', 'Recepción Final del destino actual', 'Planos aprobados']; break;
        default: return '';
    }

    if (reqs.length === 0) return '';

    return `
        <div style="background: #E8F5F5; border-left: 4px solid #3FB8AF; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
            <p style="color: #2B4B4B; font-weight: 700; margin-bottom: 0.5rem; font-size: 0.95rem;">💡 Documentos ideales para el estudio:</p>
            <ul style="margin: 0; padding-left: 1.2rem; color: #2B4B4B; font-size: 0.9rem; line-height: 1.5;">
                ${reqs.map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>
    `;
}

function generateDynamicStep(projectType) {
    console.log('Generating dynamic step for:', projectType);
    const step3 = document.getElementById('step3Dynamic');
    if (!step3) {
        console.error('step3Dynamic element not found!');
        return;
    }

    let html = '<h2 class="step-title">Detalles Específicos del Proyecto</h2>';
    html += getRequirementsHtml(projectType);

    switch (projectType) {
        case 'obra-nueva':
            html += `
                <div class="form-group">
                    <label for="tipoVivienda">Tipo de vivienda *</label>
                    <select id="tipoVivienda" required>
                        <option value="">Selecciona</option>
                        <option value="casa">Casa</option>
                        <option value="departamento">Departamento</option>
                        <option value="local-comercial">Local Comercial</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="numDormitorios">Número de dormitorios</label>
                        <select id="numDormitorios">
                            <option value="">Selecciona</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5+">5 o más</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="numBanos">Número de baños</label>
                        <select id="numBanos">
                            <option value="">Selecciona</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4+">4 o más</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="metrosConstruir">Metros cuadrados a construir *</label>
                    <input type="number" id="metrosConstruir" placeholder="Ej: 120" required>
                </div>
                <div class="form-group">
                    <label>¿Tiene proyecto aprobado?</label>
                    <div class="radio-group">
                        <div class="radio-option">
                            <input type="radio" id="proyectoSi" name="proyectoAprobado" value="si">
                            <label for="proyectoSi">Sí</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="proyectoNo" name="proyectoAprobado" value="no">
                            <label for="proyectoNo">No</label>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'ampliacion':
            html += `
                <div class="form-group">
                    <label>¿Qué desea ampliar? *</label>
                    <div class="checkbox-group">
                        <div class="checkbox-option">
                            <input type="checkbox" id="amp1" value="segundo-piso">
                            <label for="amp1">Segundo piso</label>
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="amp2" value="cocina">
                            <label for="amp2">Cocina</label>
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="amp3" value="bano">
                            <label for="amp3">Baño</label>
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="amp4" value="dormitorio">
                            <label for="amp4">Dormitorio</label>
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="amp5" value="otro">
                            <label for="amp5">Otro</label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="metrosAmpliacion">Metros cuadrados de la ampliación *</label>
                    <input type="number" id="metrosAmpliacion" placeholder="Ej: 40" required>
                </div>
                <div class="form-group">
                    <label>¿La estructura actual soporta ampliación?</label>
                    <div class="radio-group">
                        <div class="radio-option">
                            <input type="radio" id="estructuraSi" name="estructuraSoporta" value="si">
                            <label for="estructuraSi">Sí</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="estructuraNo" name="estructuraSoporta" value="no">
                            <label for="estructuraNo">No</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="estructuraNoSe" name="estructuraSoporta" value="no-se">
                            <label for="estructuraNoSe">No sé</label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>¿Tiene estudio de mecánica de suelos?</label>
                    <div class="radio-group">
                        <div class="radio-option">
                            <input type="radio" id="suelosSi" name="estudioSuelos" value="si">
                            <label for="suelosSi">Sí</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="suelosNo" name="estudioSuelos" value="no">
                            <label for="suelosNo">No</label>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'regularizacion':
            html += `
                <div class="form-group">
                    <label for="cuandoConstruyo">¿Cuándo construyó sin permiso? *</label>
                    <select id="cuandoConstruyo" required>
                        <option value="">Selecciona</option>
                        <option value="menos-1">Hace menos de 1 año</option>
                        <option value="1-3">Hace 1-3 años</option>
                        <option value="3-5">Hace 3-5 años</option>
                        <option value="5-10">Hace 5-10 años</option>
                        <option value="mas-10">Hace más de 10 años</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>¿Ha recibido multas de la municipalidad?</label>
                    <div class="radio-group">
                        <div class="radio-option">
                            <input type="radio" id="multasSi" name="multas" value="si">
                            <label for="multasSi">Sí</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="multasNo" name="multas" value="no">
                            <label for="multasNo">No</label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>¿Qué construyó sin permiso? *</label>
                    <div class="checkbox-group">
                        <div class="checkbox-option">
                            <input type="checkbox" id="reg1" value="ampliacion">
                            <label for="reg1">Ampliación</label>
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="reg2" value="cierre">
                            <label for="reg2">Cierre/Reja</label>
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="reg3" value="segundo-piso">
                            <label for="reg3">Segundo piso</label>
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="reg4" value="quincho">
                            <label for="reg4">Quincho/Terraza</label>
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="reg5" value="otro">
                            <label for="reg5">Otro</label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>¿Tiene planos de lo construido?</label>
                    <div class="radio-group">
                        <div class="radio-option">
                            <input type="radio" id="planosConstrSi" name="planosConstr" value="si">
                            <label for="planosConstrSi">Sí</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="planosConstrNo" name="planosConstr" value="no">
                            <label for="planosConstrNo">No</label>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'subdivision':
            html += `
                <div class="form-group">
                    <label for="numLotes">¿Cuántos lotes quiere dividir? *</label>
                    <select id="numLotes" required>
                        <option value="">Selecciona</option>
                        <option value="2">2 lotes</option>
                        <option value="3">3 lotes</option>
                        <option value="4">4 lotes</option>
                        <option value="5+">5 o más lotes</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>¿Tiene factibilidad de servicios (agua, luz, alcantarillado)?</label>
                    <div class="radio-group">
                        <div class="radio-option">
                            <input type="radio" id="factibilidadSi" name="factibilidad" value="si">
                            <label for="factibilidadSi">Sí</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="factibilidadNo" name="factibilidad" value="no">
                            <label for="factibilidadNo">No</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="factibilidadNoSe" name="factibilidad" value="no-se">
                            <label for="factibilidadNoSe">No sé</label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>¿El predio tiene deudas (contribuciones, servicios)?</label>
                    <div class="radio-group">
                        <div class="radio-option">
                            <input type="radio" id="deudasSi" name="deudas" value="si">
                            <label for="deudasSi">Sí</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="deudasNo" name="deudas" value="no">
                            <label for="deudasNo">No</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="deudasNoSe" name="deudas" value="no-se">
                            <label for="deudasNoSe">No sé</label>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'fusion-predial':
            html += `
                <div class="form-group">
                    <label for="numPredios">¿Cuántos predios va a fusionar? *</label>
                    <select id="numPredios" required>
                        <option value="">Selecciona</option>
                        <option value="2">2 predios</option>
                        <option value="3">3 predios</option>
                        <option value="4">4 predios</option>
                        <option value="5+">5 o más predios</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>¿Los predios son colindantes (están uno al lado del otro)?</label>
                    <div class="radio-group">
                        <div class="radio-option">
                            <input type="radio" id="colindantesSi" name="colindantes" value="si">
                            <label for="colindantesSi">Sí</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="colindantesNo" name="colindantes" value="no">
                            <label for="colindantesNo">No</label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>¿Están a nombre del mismo propietario?</label>
                    <div class="radio-group">
                        <div class="radio-option">
                            <input type="radio" id="propietarioSi" name="mismoPropietario" value="si">
                            <label for="propietarioSi">Sí</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="propietarioNo" name="mismoPropietario" value="no">
                            <label for="propietarioNo">No</label>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'remodelacion':
            html += `
                <div class="form-group">
                    <label>¿Qué espacios va a remodelar? *</label>
                    <div class="checkbox-group">
                        <div class="checkbox-option">
                            <input type="checkbox" id="rem1" value="cocina">
                            <label for="rem1">Cocina</label>
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="rem2" value="bano">
                            <label for="rem2">Baño</label>
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="rem3" value="dormitorios">
                            <label for="rem3">Dormitorios</label>
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="rem4" value="living">
                            <label for="rem4">Living/Comedor</label>
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="rem5" value="fachada">
                            <label for="rem5">Fachada</label>
                        </div>
                        <div class="checkbox-option">
                            <input type="checkbox" id="rem6" value="otro">
                            <label for="rem6">Otro</label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label>¿Incluye cambios estructurales (demoler/agregar muros)?</label>
                    <div class="radio-group">
                        <div class="radio-option">
                            <input type="radio" id="estructuralesSi" name="cambiosEstructurales" value="si">
                            <label for="estructuralesSi">Sí</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="estructuralesNo" name="cambiosEstructurales" value="no">
                            <label for="estructuralesNo">No</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="estructuralesNoSe" name="cambiosEstructurales" value="no-se">
                            <label for="estructuralesNoSe">No sé</label>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'cambio-destino':
            html += `
                <div class="form-group">
                    <label for="usoActual">Uso actual de la propiedad *</label>
                    <select id="usoActual" required>
                        <option value="">Selecciona</option>
                        <option value="vivienda">Vivienda</option>
                        <option value="comercial">Comercial</option>
                        <option value="industrial">Industrial</option>
                        <option value="oficina">Oficina</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="usoDeseado">Uso deseado *</label>
                    <select id="usoDeseado" required>
                        <option value="">Selecciona</option>
                        <option value="vivienda">Vivienda</option>
                        <option value="comercial">Comercial</option>
                        <option value="industrial">Industrial</option>
                        <option value="oficina">Oficina</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>¿Tiene factibilidad municipal para el cambio de destino?</label>
                    <div class="radio-group">
                        <div class="radio-option">
                            <input type="radio" id="factMunicipalSi" name="factMunicipal" value="si">
                            <label for="factMunicipalSi">Sí</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="factMunicipalNo" name="factMunicipal" value="no">
                            <label for="factMunicipalNo">No</label>
                        </div>
                        <div class="radio-option">
                            <input type="radio" id="factMunicipalNoSe" name="factMunicipal" value="no-se">
                            <label for="factMunicipalNoSe">No sé</label>
                        </div>
                    </div>
                </div>
            `;
            break;

        default:
            html += `
                <div class="form-group">
                    <label for="otroDetalle">Describe tu proyecto en detalle *</label>
                    <textarea id="otroDetalle" rows="5" placeholder="Cuéntanos qué necesitas..." required></textarea>
                </div>
            `;
    }

    step3.innerHTML = html;
    console.log('Dynamic step generated successfully');
}

function changeStep(direction) {
    console.log(`changeStep called: direction=${direction}, currentStep=${currentStep}`);

    if (direction === 1 && !validateStep(currentStep)) {
        console.log('Validation failed for step', currentStep);
        return;
    }

    // Hide current step
    const currentStepElement = currentStep === 3 ?
        document.getElementById('step3Dynamic') :
        document.getElementById(`step${currentStep}`);

    if (currentStepElement) {
        currentStepElement.classList.remove('active');
        console.log('Removed active from step', currentStep);
    }

    // Update step number
    currentStep += direction;
    console.log('New currentStep:', currentStep);

    // Generate budget options when entering step 6
    if (currentStep === 6) {
        generateBudgetOptions(formData.tipoProyecto);
    }

    // Show new step
    const newStepElement = currentStep === 3 ?
        document.getElementById('step3Dynamic') :
        document.getElementById(`step${currentStep}`);

    if (newStepElement) {
        newStepElement.classList.add('active');
        console.log('Added active to step', currentStep);
    } else {
        console.error('Step element not found for step', currentStep);
    }

    updateProgress();
    updateButtons();

    if (currentStep === 9) {
        updateSummary();
    }

    if (currentStep === 10) {
        submitForm();
    }
}

function generateBudgetOptions(projectType) {
    console.log('Generating budget options for:', projectType);
    const presupuestoSelect = document.getElementById('presupuesto');
    if (!presupuestoSelect) {
        console.error('Presupuesto select not found');
        return;
    }

    // Clear existing options except the first one
    presupuestoSelect.innerHTML = '<option value="">Selecciona un rango</option>';

    let budgetRanges = [];

    switch (projectType) {
        case 'obra-nueva':
            budgetRanges = [
                { value: '1-2', label: '$1.000.000 - $2.000.000 (Vivienda pequeña)' },
                { value: '2-3.5', label: '$2.000.000 - $3.500.000 (Vivienda mediana)' },
                { value: '3.5-5', label: '$3.500.000 - $5.000.000 (Vivienda grande)' },
                { value: '5-8', label: '$5.000.000 - $8.000.000 (Vivienda premium)' },
                { value: 'mas-8', label: 'Más de $8.000.000 (Proyecto especial)' }
            ];
            break;

        case 'ampliacion':
            budgetRanges = [
                { value: '800k-1.5', label: '$800.000 - $1.500.000 (Ampliación pequeña)' },
                { value: '1.5-2.5', label: '$1.500.000 - $2.500.000 (Ampliación mediana)' },
                { value: '2.5-4', label: '$2.500.000 - $4.000.000 (Ampliación grande)' },
                { value: '4-6', label: '$4.000.000 - $6.000.000 (Segundo piso completo)' },
                { value: 'mas-6', label: 'Más de $6.000.000' }
            ];
            break;

        case 'regularizacion':
            budgetRanges = [
                { value: '500k-1', label: '$500.000 - $1.000.000 (Obra menor)' },
                { value: '1-1.8', label: '$1.000.000 - $1.800.000 (Obra mediana)' },
                { value: '1.8-3', label: '$1.800.000 - $3.000.000 (Obra mayor)' },
                { value: '3-5', label: '$3.000.000 - $5.000.000 (Obra compleja)' },
                { value: 'mas-5', label: 'Más de $5.000.000 (Múltiples irregularidades)' }
            ];
            break;

        case 'subdivision':
            budgetRanges = [
                { value: '1.2-2', label: '$1.200.000 - $2.000.000 (2 lotes)' },
                { value: '2-3', label: '$2.000.000 - $3.000.000 (3-4 lotes)' },
                { value: '3-5', label: '$3.000.000 - $5.000.000 (5+ lotes)' },
                { value: '5-8', label: '$5.000.000 - $8.000.000 (Proyecto complejo)' },
                { value: 'mas-8', label: 'Más de $8.000.000 (Loteo grande)' }
            ];
            break;

        case 'fusion-predial':
            budgetRanges = [
                { value: '800k-1.5', label: '$800.000 - $1.500.000 (2 predios)' },
                { value: '1.5-2.5', label: '$1.500.000 - $2.500.000 (3 predios)' },
                { value: '2.5-4', label: '$2.500.000 - $4.000.000 (4+ predios)' },
                { value: '4-6', label: '$4.000.000 - $6.000.000 (Caso complejo)' },
                { value: 'mas-6', label: 'Más de $6.000.000' }
            ];
            break;

        case 'remodelacion':
            budgetRanges = [
                { value: '600k-1.2', label: '$600.000 - $1.200.000 (Remodelación menor)' },
                { value: '1.2-2', label: '$1.200.000 - $2.000.000 (Remodelación mediana)' },
                { value: '2-3.5', label: '$2.000.000 - $3.500.000 (Remodelación mayor)' },
                { value: '3.5-5', label: '$3.500.000 - $5.000.000 (Remodelación integral)' },
                { value: 'mas-5', label: 'Más de $5.000.000 (Proyecto complejo)' }
            ];
            break;

        case 'cambio-destino':
            budgetRanges = [
                { value: '1-2', label: '$1.000.000 - $2.000.000 (Cambio simple)' },
                { value: '2-3.5', label: '$2.000.000 - $3.500.000 (Cambio con modificaciones)' },
                { value: '3.5-5', label: '$3.500.000 - $5.000.000 (Cambio complejo)' },
                { value: '5-8', label: '$5.000.000 - $8.000.000 (Proyecto integral)' },
                { value: 'mas-8', label: 'Más de $8.000.000' }
            ];
            break;

        default:
            budgetRanges = [
                { value: '500k-1.5', label: '$500.000 - $1.500.000' },
                { value: '1.5-3', label: '$1.500.000 - $3.000.000' },
                { value: '3-5', label: '$3.000.000 - $5.000.000' },
                { value: '5-8', label: '$5.000.000 - $8.000.000' },
                { value: 'mas-8', label: 'Más de $8.000.000' }
            ];
    }

    // Add options to select
    budgetRanges.forEach(range => {
        const option = document.createElement('option');
        option.value = range.value;
        option.textContent = range.label;
        presupuestoSelect.appendChild(option);
    });

    console.log('Budget options generated:', budgetRanges.length, 'options');
}

function validateStep(step) {
    console.log('Validating step:', step);

    switch (step) {
        case 1:
            if (!formData.tipoProyecto) {
                alert('Por favor selecciona un tipo de proyecto');
                return false;
            }
            break;
        case 2:
            const comuna = document.getElementById('comuna').value;
            if (!comuna) {
                alert('Por favor selecciona una comuna');
                return false;
            }
            formData.comuna = comuna;
            formData.direccion = document.getElementById('direccion').value;
            break;
        case 3:
            // Validate dynamic step based on project type
            if (!validateDynamicStep(formData.tipoProyecto)) {
                return false;
            }
            break;
        case 4:
            const terreno = document.getElementById('superficieTerreno').value;
            if (!terreno) {
                alert('Por favor ingresa la superficie del terreno');
                return false;
            }
            formData.superficieTerreno = terreno;
            formData.superficieConstruida = document.getElementById('superficieConstruida').value || 'No especificado';
            formData.numeroPisos = document.getElementById('numeroPisos').value || 'No especificado';
            formData.anoConstruccion = document.getElementById('anoConstruccion').value || 'No especificado';
            break;
        case 5:
            const planos = document.querySelector('input[name="planos"]:checked');
            const recepcion = document.querySelector('input[name="recepcion"]:checked');
            if (!planos || !recepcion) {
                alert('Por favor responde ambas preguntas');
                return false;
            }
            formData.planos = planos.value;
            formData.recepcion = recepcion.value;
            break;
        case 6:
            const descripcion = document.getElementById('descripcion').value;
            const presupuesto = document.getElementById('presupuesto').value;

            // Validate description quality
            const descValidation = validateTextQuality(descripcion, 5);
            if (!descValidation.valid) {
                alert('Descripción del proyecto: ' + descValidation.message);
                return false;
            }

            if (!presupuesto) {
                alert('Por favor selecciona un rango de presupuesto para honorarios de arquitectura');
                return false;
            }

            formData.descripcion = descripcion;
            formData.presupuesto = presupuesto;
            formData.urgencia = document.getElementById('urgencia').value || 'No especificado';
            break;
        case 7:
            // Files are optional, just continue
            break;
        case 8:
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;

            // Validate name
            const nameValidation = validateName(nombre);
            if (!nameValidation.valid) {
                alert('Nombre: ' + nameValidation.message);
                return false;
            }

            // Validate email
            const emailValidation = validateEmail(email);
            if (!emailValidation.valid) {
                alert('Email: ' + emailValidation.message);
                return false;
            }

            // Validate phone
            const phoneValidation = validatePhone(telefono);
            if (!phoneValidation.valid) {
                alert('Teléfono: ' + phoneValidation.message);
                return false;
            }

            formData.nombre = nombre;
            formData.email = email;
            formData.telefono = telefono;
            break;
        default:
            console.log('No specific validation for step', step);
    }
    console.log('Validation passed for step', step);
    return true;
}

function validateDynamicStep(projectType) {
    console.log('Validating dynamic step for:', projectType);
    // Store dynamic form data based on project type
    formData.detallesEspecificos = {};

    switch (projectType) {
        case 'obra-nueva':
            const tipoVivienda = document.getElementById('tipoVivienda').value;
            const metrosConstruir = document.getElementById('metrosConstruir').value;
            if (!tipoVivienda || !metrosConstruir) {
                alert('Por favor completa los campos obligatorios');
                return false;
            }
            formData.detallesEspecificos = {
                tipoVivienda,
                numDormitorios: document.getElementById('numDormitorios').value,
                numBanos: document.getElementById('numBanos').value,
                metrosConstruir,
                proyectoAprobado: document.querySelector('input[name="proyectoAprobado"]:checked')?.value || 'No especificado'
            };
            break;
        case 'ampliacion':
            const metrosAmpliacion = document.getElementById('metrosAmpliacion').value;
            if (!metrosAmpliacion) {
                alert('Por favor ingresa los metros cuadrados de la ampliación');
                return false;
            }
            const ampliaciones = [];
            document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                ampliaciones.push(cb.value);
            });
            formData.detallesEspecificos = {
                queAmpliar: ampliaciones.join(', ') || 'No especificado',
                metrosAmpliacion,
                estructuraSoporta: document.querySelector('input[name="estructuraSoporta"]:checked')?.value || 'No especificado',
                estudioSuelos: document.querySelector('input[name="estudioSuelos"]:checked')?.value || 'No especificado'
            };
            break;
        case 'regularizacion':
            const cuandoConstruyo = document.getElementById('cuandoConstruyo').value;
            if (!cuandoConstruyo) {
                alert('Por favor indica cuándo construyó sin permiso');
                return false;
            }
            const construido = [];
            document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                construido.push(cb.value);
            });
            formData.detallesEspecificos = {
                cuandoConstruyo,
                multas: document.querySelector('input[name="multas"]:checked')?.value || 'No especificado',
                queConstruyo: construido.join(', ') || 'No especificado',
                planosConstr: document.querySelector('input[name="planosConstr"]:checked')?.value || 'No especificado'
            };
            break;
        case 'subdivision':
            const numLotes = document.getElementById('numLotes').value;
            if (!numLotes) {
                alert('Por favor indica cuántos lotes quiere dividir');
                return false;
            }
            formData.detallesEspecificos = {
                numLotes,
                factibilidad: document.querySelector('input[name="factibilidad"]:checked')?.value || 'No especificado',
                deudas: document.querySelector('input[name="deudas"]:checked')?.value || 'No especificado'
            };
            break;
        case 'fusion-predial':
            const numPredios = document.getElementById('numPredios').value;
            if (!numPredios) {
                alert('Por favor indica cuántos predios va a fusionar');
                return false;
            }
            formData.detallesEspecificos = {
                numPredios,
                colindantes: document.querySelector('input[name="colindantes"]:checked')?.value || 'No especificado',
                mismoPropietario: document.querySelector('input[name="mismoPropietario"]:checked')?.value || 'No especificado'
            };
            break;
        case 'remodelacion':
            const espacios = [];
            document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                espacios.push(cb.value);
            });
            formData.detallesEspecificos = {
                espacios: espacios.join(', ') || 'No especificado',
                cambiosEstructurales: document.querySelector('input[name="cambiosEstructurales"]:checked')?.value || 'No especificado'
            };
            break;
        case 'cambio-destino':
            const usoActual = document.getElementById('usoActual').value;
            const usoDeseado = document.getElementById('usoDeseado').value;
            if (!usoActual || !usoDeseado) {
                alert('Por favor completa los campos de uso actual y deseado');
                return false;
            }
            formData.detallesEspecificos = {
                usoActual,
                usoDeseado,
                factMunicipal: document.querySelector('input[name="factMunicipal"]:checked')?.value || 'No especificado'
            };
            break;
        default:
            const otroDetalle = document.getElementById('otroDetalle')?.value;
            if (!otroDetalle) {
                alert('Por favor describe tu proyecto');
                return false;
            }
            formData.detallesEspecificos = { detalle: otroDetalle };
    }
    console.log('Dynamic step validation passed');
    return true;
}

function updateProgress() {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const actions = document.getElementById('wizardActions');

    // Ensure actions are visible by default
    actions.style.display = 'flex';

    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }

    if (currentStep === 9) {
        nextBtn.textContent = 'Confirmar y Enviar';
        nextBtn.style.background = '#2B4B4B'; // Highlight explicit action
    } else if (currentStep === 10) {
        actions.style.display = 'none';
    } else {
        nextBtn.textContent = 'Siguiente';
        nextBtn.style.background = ''; // Reset style
    }
}

function updateSummary() {
    const container = document.getElementById('summaryContainer');
    let html = `
        <div class="summary-section">
            <h3>Tipo de Proyecto</h3>
            <div class="summary-item">
                <span class="label">Proyecto:</span>
                <span class="value">${formData.tipoProyectoNombre}</span>
            </div>
        </div>
        <div class="summary-section">
            <h3>Ubicación</h3>
            <div class="summary-item">
                <span class="label">Comuna:</span>
                <span class="value">${formData.comuna}</span>
            </div>
        </div>
        <div class="summary-section">
            <h3>Detalles Específicos</h3>
    `;

    // Add specific details based on project type
    for (const [key, value] of Object.entries(formData.detallesEspecificos)) {
        html += `
            <div class="summary-item">
                <span class="label">${formatLabel(key)}:</span>
                <span class="value">${value}</span>
            </div>
        `;
    }

    html += `
        </div>
        <div class="summary-section">
            <h3>Características</h3>
            <div class="summary-item">
                <span class="label">Superficie Terreno:</span>
                <span class="value">${formData.superficieTerreno} m²</span>
            </div>
            <div class="summary-item">
                <span class="label">Planos Aprobados:</span>
                <span class="value">${formData.planos === 'si' ? 'Sí' : formData.planos === 'no' ? 'No' : 'No sabe'}</span>
            </div>
        </div>
        <div class="summary-section">
            <h3>Contacto</h3>
            <div class="summary-item">
                <span class="label">Nombre:</span>
                <span class="value">${formData.nombre}</span>
            </div>
            <div class="summary-item">
                <span class="label">Email:</span>
                <span class="value">${formData.email}</span>
            </div>
            <div class="summary-item">
                <span class="label">Teléfono:</span>
                <span class="value">${formData.telefono}</span>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function formatLabel(key) {
    const labels = {
        tipoVivienda: 'Tipo de Vivienda',
        numDormitorios: 'Dormitorios',
        numBanos: 'Baños',
        metrosConstruir: 'Metros a Construir',
        proyectoAprobado: 'Proyecto Aprobado',
        queAmpliar: 'Qué Ampliar',
        metrosAmpliacion: 'Metros Ampliación',
        estructuraSoporta: 'Estructura Soporta',
        estudioSuelos: 'Estudio de Suelos',
        cuandoConstruyo: 'Cuándo Construyó',
        multas: 'Multas',
        queConstruyo: 'Qué Construyó',
        planosConstr: 'Planos de lo Construido',
        numLotes: 'Número de Lotes',
        factibilidad: 'Factibilidad',
        deudas: 'Deudas',
        numPredios: 'Número de Predios',
        colindantes: 'Colindantes',
        mismoPropietario: 'Mismo Propietario',
        espacios: 'Espacios a Remodelar',
        cambiosEstructurales: 'Cambios Estructurales',
        usoActual: 'Uso Actual',
        usoDeseado: 'Uso Deseado',
        factMunicipal: 'Factibilidad Municipal',
        detalle: 'Detalle'
    };
    return labels[key] || key;
}

function submitForm() {
    // Build detailed message
    let detallesText = '';
    for (const [key, value] of Object.entries(formData.detallesEspecificos)) {
        detallesText += `${formatLabel(key)}: ${value}\n`;
    }

    const whatsappMessage = `
🏗️ *NUEVA PRE-EVALUACIÓN*

*Tipo de Proyecto:* ${formData.tipoProyectoNombre}

*📍 Ubicación:*
Comuna: ${formData.comuna}
${formData.direccion ? 'Dirección: ' + formData.direccion : ''}

*🔍 Detalles Específicos:*
${detallesText}

*🏠 Características:*
Terreno: ${formData.superficieTerreno} m²
Construido: ${formData.superficieConstruida} m²
Pisos: ${formData.numeroPisos}
Año construcción: ${formData.anoConstruccion}

*📋 Estado Legal:*
Planos aprobados: ${formData.planos}
Recepción final: ${formData.recepcion}

*💬 Descripción:*
${formData.descripcion}

*💰 Presupuesto:* ${formData.presupuesto}
*⏰ Urgencia:* ${formData.urgencia}

*👤 Contacto:*
Nombre: ${formData.nombre}
Email: ${formData.email}
Teléfono: ${formData.telefono}
    `.trim();

    const whatsappNumber = '56950196861';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    document.getElementById('whatsappBtn').href = whatsappUrl;

    const emailSubject = `Pre-Evaluación: ${formData.tipoProyectoNombre} - ${formData.nombre}`;
    const emailBody = whatsappMessage.replace(/\*/g, '');
    const mailtoUrl = `mailto:contacto@estudioroer.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailtoUrl;

    console.log('Form Data:', formData);
}

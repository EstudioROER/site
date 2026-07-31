# Estudio ROER Arquitectura - Plataforma Web Oficial

Sitio web moderno, limpio y minimalista para **Estudio ROER Arquitectura**, optimizado con paleta de colores pastel, diseño profesional responsivo y sin elementos innecesarios.

## 📁 Estructura del Proyecto

El proyecto está organizado de manera estándar para publicarse directamente en **GitHub Pages**:

```
.
├── index.html              # Página principal (HTML5 semántico)
├── README.md               # Instrucciones del proyecto
└── assets/
    ├── css/
    │   └── styles.css      # Sistema de diseño pastel & estilos responsive
    ├── js/
    │   └── main.js         # Lógica interactiva (Calculadora, Tabs, FAQ, Formulario)
    └── images/
        ├── house-santiago.jpg
        ├── ampliacion-piso2.jpg
        └── interior-living.jpg
```

---

## 🚀 Pasos para Subir y Publicar en GitHub Pages

### Opción 1: Usando la Interfaz Web de GitHub

1. Ingresa a [GitHub](https://github.com/) y crea un nuevo repositorio público llamado `estudio-roer` (o el nombre de tu preferencia).
2. Sube todos los archivos de esta carpeta (`index.html`, `README.md` y la carpeta `assets/`).
3. En GitHub, ve a la pestaña **Settings** (Configuración) de tu repositorio.
4. En el menú lateral izquierdo, haz clic en **Pages**.
5. En **Build and deployment** > **Branch**, selecciona `main` (o `master`) y la carpeta `/ (root)`.
6. Haz clic en **Save**. En 1-2 minutos tu sitio estará publicado en `https://tu-usuario.github.io/estudio-roer/`.

---

### Opción 2: Usando Git desde la Terminal

```bash
# 1. Inicializar git si no lo has hecho
git init

# 2. Agregar los archivos
git add .

# 3. Crear el primer commit
git commit -m "Publicación inicial sitio Estudio ROER Arquitectura"

# 4. Conectar con tu repositorio de GitHub
git remote add origin https://github.com/TU_USUARIO/estudio-roer.git
git branch -M main
git push -u origin main
```

---

## 📞 Datos de Contacto Integrados

- **Teléfono / WhatsApp**: +56 9 5019 6861
- **Correo Electrónico**: roer.arquitectura@gmail.com
- **Zonas de Atención**: Santiago, San Bernardo, El Bosque, Peñaflor, Valparaíso, Viña del Mar y Región Metropolitana.

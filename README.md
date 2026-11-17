# DESIAHO — Sistema Integral de Riesgos

**Inspección y Gestión de Tanques Atmosféricos de Techo Cónico**

PWA ( Progressive Web App ) que funciona **con y sin conexión a internet**: instalable en dispositivos móviles y escritorio, con modo offline garantizado por un Service Worker.

## 🚀 Uso

Abrir `desiaho.html` en el navegador, o usar la versión publicada en GitHub Pages.

| Ruta | Acceso |
|---|---|
| `desiaho.html` | Inicio de la app |
| `desiaho.html#campo` | Inspección de campo (una pregunta a la vez) |
| `desiaho.html#tecnico` | Formulario técnico completo |
| `desiaho.html?admin=1` | Panel de administración |

## 📋 Contenido técnico

- **63 preguntas** de inspección organizadas en 8 secciones (Base/Fundación, Cuerpo, Accesorios, Techo Cónico, Contra Incendio, Venteo, Puesta a Tierra, Protección Catódica)
- Cálculo de riesgo ponderado con barreras Preventivas (×0.7) y de Mitigación (×0.3)
- Niveles: EXCELENTE → DEFICIENTE con acción correctiva sugerida
- Captura de fotos, notas y dictado por voz (SpeechRecognition)
- Reporte imprimible con firma
- Estándares: API 650/653/2000 · NFPA 11/30/780 · IEC 61511 · NACE SP0169

## 🏗️ Estructura

```
├── desiaho.html           # App principal (HTML + CSS + JS autocontenido)
├── sw.js                  # Service Worker (offline, estrategia de caché)
├── manifest.webmanifest   # Manifiesto PWA (instalación, iconos, shortcuts)
├── desiaho_system.jsx     # Versión anterior en React (referencia)
├── icon-192.png           # Icono 192×192
├── icon-512.png           # Icono 512×512 (any + maskable)
└── apple-touch-icon.png   # Icono iOS
```

## 💾 Persistencia

Los datos de inspección se guardan en `localStorage` del dispositivo (no se envían a ningún servidor).

## 📦 Instalación como app

En Chrome/Android: botón **"⬇ Instalar DESIAHO"** en el inicio.
En iOS/Safari: Compartir → **Agregar a pantalla de inicio**.

## 💾 Datos: almacenamiento, respaldo y nube

| Dato | Dónde se guarda |
|---|---|
| Tanques | `localStorage["desiaho-tanks"]` |
| Inspecciones | `localStorage["desiaho-insps"]` |
| Fotos | IndexedDB `desiaho-db` (redimensionadas a 1280px JPEG) |
| Sesión (si hay nube) | Firebase Auth (persiste al recargar) |

### 📥 Exportar / Importar backup
**Panel Admin → ☁ Datos → 📦 Exportar backup** genera un `.json` con tanques, inspecciones y fotos. **📥 Importar backup** fusiona sin duplicados (gana el que ya existe localmente). El archivo sirve para migrar entre dispositivos o como copia de seguridad ante fallos del navegador.

### ☁️ Sincronización con Firebase (opcional)
La app funciona 100% offline por defecto. Para compartir datos entre dispositivos/usuarios:

1. Crea el proyecto en [console.firebase.google.com](https://console.firebase.google.com)
2. **Authentication → Get started → Email/Password → habilitar**
3. **Firestore Database → Create database** (modo *production*) y publica estas reglas:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{doc=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
4. **Authentication → Settings → Authorized domains → Add domain** → añade el dominio donde publicas la app (p. ej. `davidsona01.github.io` o tu dominio propio). Sin esto, el login falla con `unauthorized-domain`.
5. **Project settings → Your apps → Web app** → copia el objeto `config` (JSON)
6. Pega ese JSON en `FB_DEFAULT` dentro de `desiaho.html` (const cerca de la sección Firebase). *Alternativa sin tocar código:* en la app, **Panel Admin → ☁ Datos → pegar el JSON → ✔ Guardar configuración** (aplica solo a ese dispositivo)

Una vez conectado:
- El login pasa a ser **email + contraseña** (las cuentas nuevas inician como *Inspector*)
- El formulario de registro incluye **confirmar contraseña**, un botón **👁 Ver/Ocultar** para revisar lo tecleado y **🔑 ¿Olvidaste tu contraseña?** envía un enlace de restablecimiento por correo
- El **correo y el panel de restablecimiento de Google salen en español** (la app fija `languageCode='es'`) y, al cambiar la clave, el enlace **vuelve al inicio de la app** con el aviso *"✔ Contraseña cambiada…"*
- **Primer admin:** crea tu cuenta desde el login y luego sube su rol desde la consola de Firebase: **Firestore → colección `users` → tu documento → editar campo `role` → `admin`**. Al volver a iniciar sesión entrarás como admin y ya podrás ascender a otros desde **☁ Datos → 👥 Usuarios**
- **Roles:** el *Inspector* usa los módulos de inspección; el *admin* accede a todo (inspección + panel de administración)
- Los datos se suben al guardar y se bajan con **↻ Sincronizar con la nube ahora** (también al iniciar sesión)
- Las **fotos se guardan localmente y en el backup**; no se sincronizan a la nube en esta versión

> ⚠️ La ruta `?admin=1` (modo demo) queda deshabilitada cuando la nube está configurada.

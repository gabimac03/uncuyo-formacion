// Archivo: javascript/module-data.js
// Rellená los contenidos de cada módulo. Podés editar libremente.
// - resumenCorto: 2–3 líneas. Si no lo completás, se usa el 'desc' de main.js.
// - puntos: bullets del "Resumen del módulo".
// - ejemplos: contenido HTML mostrado al hacer click en los botones (podés usar <h3>, <p>, <ol>, <pre><code>, <img>, etc.).

window.MODULO_DETALLE = {
// --- MOD. 1 COMPLETO ---
1: {
  resumenCorto:
    "La información es un activo esencial en la universidad. Además de proteger su confidencialidad, integridad y disponibilidad, debemos clasificarla, respaldarla y eliminarla de forma segura. Los errores humanos, los insiders y los ciberdelincuentes son fuentes habituales de incidentes.",
  puntos: [
    { titulo: "Activos y amenazas", texto: "Accidentales, insiders y ciberdelincuentes (ej. ransomware)." },
    { titulo: "Inventario y clasificación", texto: "Antes de actuar: inventariar, clasificar y etiquetar." },
    { titulo: "Cifrado y metadatos", texto: "Cifrar sensible y eliminar metadatos antes de compartir." },
    { titulo: "Backups 3-2-1", texto: "Tipos de copia y estrategia fuera del sitio." },
    { titulo: "Almacenamiento adecuado", texto: "Local vs. red vs. nube según criticidad." }
  ],

  contenido: [
    {
      icon: "🏷️",
      titulo: "1) Activos y amenazas típicas",
      texto: `• Accidentales: borrados, correos a destinatario equivocado, fallas de disco.<br>
              • Insiders: accesos/filtraciones desde dentro de la comunidad.<br>
              • Ciberdelincuentes: malware/ingeniería social (p.ej., ransomware).`,
      aciertos: ["Conciencia de riesgos", "Principio de mínimo privilegio"],
      peligros: ["Correo mal enviado", "Uso de dispositivos sin controles"]
    },

    {
      icon: "🔐",
      titulo: "2) Tres pilares (CIA)",
      texto: `• Disponibilidad: acceso cuando se necesita (ransomware la afecta).<br>
              • Integridad: que no se altere sin autorización.<br>
              • Confidencialidad: que no accedan personas no autorizadas.`,
      aciertos: ["MFA", "Backups probados", "Registros de cambios"],
      peligros: ["Sin respaldos", "Enlaces públicos", "Repositorios abiertos"]
    },

    {
      icon: "🧭",
      titulo: "3) Inventario y clasificación",
      texto: `• Inventariar: listar activos (físicos/digitales), ubicación y responsables.<br>
              • Criterios: confidencialidad, integridad y disponibilidad requeridas.<br>
              • Niveles: Confidencial / Restringida / Uso interno / Pública.<br>
              • Etiquetado sugerido: [confidencial]Proyectos.docx, [restringida]Nóminas.xlsx, etc.`,
      aciertos: ["Activos etiquetados", "Dueños/roles definidos"],
      peligros: ["Sin inventario", "Accesos amplios por defecto"]
    },

    {
      icon: "🧩",
      titulo: "4) Tratamiento según clasificación",
      texto: `• Limitar acceso por rol; control de accesos y registro.<br>
              • Cifrado (en reposo y en tránsito).<br>
              • Copias de seguridad.<br>
              • Medidas específicas (acuerdos de confidencialidad, cumplimiento legal).`,
      aciertos: ["Necesidad de saber", "Trazabilidad"],
      peligros: ["‘Todos’ con acceso", "Compartir por link público"]
    },

    {
      icon: "🔒",
      titulo: "5) Cifrado — buenas prácticas",
      texto: `• Claves robustas y gestión segura (no en papel/correo).<br>
              • Algoritmos fuertes (p.ej., AES-256).<br>
              • Revisar periódicamente la robustez del método.<br>
              • Herramientas actualizadas.`,
      aciertos: ["Cifrado aplicado", "Gestor de contraseñas"],
      peligros: ["Claves débiles", "Software desactualizado"]
    },

    {
      icon: "🧾",
      titulo: "6) Metadatos: riesgos y borrado",
      texto: `• Metadatos revelan autor, fechas, ubicación (imágenes), etc.<br>
              • Antes de publicar/compartir: limpiar metadatos.<br>
              • Windows: Propiedades → Detalles → Quitar propiedades e información personal → Seleccionar todo.`,
      aciertos: ["Metadatos eliminados", "Control de versiones"],
      peligros: ["Subir originales con metadatos", "Exponer ubicación/firma"]
    },

    {
      icon: "🗄️",
      titulo: "7) Almacenamiento (local / red / nube)",
      texto: `• Local: rápido, pero aislado y frágil (riesgo de pérdida).<br>
              • Red: centralizado y con controles institucionales (preferible).<br>
              • Nube: accesible; cifrar y aplicar permisos cuando haya datos sensibles.`,
      aciertos: ["Carpetas de red institucional", "Cifrado en nube"],
      peligros: ["Descargas locales sin backup", "Nube sin controles"]
    },

    {
      icon: "💾",
      titulo: "8) Backups: tipos + regla 3-2-1",
      texto: `• Espejo/RAID: copia en tiempo real; rápido pero replica errores/malware.<br>
              • Completa: todo el contenido; recuperación simple, ocupa más.<br>
              • Diferencial: cambios desde la última completa; restauración simple.<br>
              • Incremental: cambios desde la última copia (de cualquier tipo); eficiente, restauración más compleja.<br><br>
              • Regla 3-2-1: 3 copias, 2 soportes distintos, 1 fuera (off-site).`,
      aciertos: ["Pruebas de restauración", "Copias off-site"],
      peligros: ["Una sola copia", "Sin verificación de restauración"]
    },

    {
      icon: "🗑️",
      titulo: "9) Borrado seguro",
      texto: `• Papel/DVD: triturado. <br>
              • Discos reutilizables: sobreescritura múltiple. <br>
              • Pendrives/móviles: cifrar y restaurar a valores de fábrica. <br>
              • Obsoletos/dañados: destrucción física o certificada (con acta).`,
      aciertos: ["Inventario de baja", "Certificados de destrucción"],
      peligros: ["Entregar equipos sin limpiar", "Tirar papeles enteros"]
    },

    {
      icon: "⚖️",
      titulo: "10) Privacidad y la Ley (AR)",
      texto: `• Ley 25.326 (Habeas Data): derechos de acceso, rectificación, actualización y supresión.<br>
              • Consentimiento informado; finalidad explicada.<br>
              • AAIP como autoridad; obligación de resguardar seguridad y confidencialidad.`,
      aciertos: ["Avisos de privacidad", "Consentimiento válido"],
      peligros: ["Tratar datos sin base legal", "No informar incidentes"]
    }
  ],

  ejemplos: {
    // (se mantienen ej1–ej3) y agregamos dos más
    ej1: `
      <div class="quiz">
        <div class="quiz-q">¿Qué pilar protege contra el acceso no autorizado a la información?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Disponibilidad</button>
          <button class="btn quiz-option">Integridad</button>
          <button class="btn quiz-option" data-correct="true"
                  data-explain="Confidencialidad = acceso sólo para personas autorizadas.">Confidencialidad</button>
        </div>
        <div class="badges"><span class="badge badge--ok">CIA</span></div>
      </div>`,

    ej2: `
      <div class="quiz">
        <div class="quiz-q">Un listado con DNI y datos personales de estudiantes. ¿Qué clasificación corresponde?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Pública</button>
          <button class="btn quiz-option">Uso interno</button>
          <button class="btn quiz-option">Restringida</button>
          <button class="btn quiz-option" data-correct="true"
                  data-explain="Datos personales → confidencial. Minimizar acceso y proteger con controles.">Confidencial</button>
        </div>
        <div class="badges"><span class="badge badge--ok">Privacidad</span></div>
      </div>`,

    ej3: `
      <div class="quiz">
        <div class="quiz-q">¿Cuál enuncia correctamente la regla 3–2–1 de respaldo?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">3 copias en el mismo disco externo</button>
          <button class="btn quiz-option">3 copias, 1 soporte, 1 fuera</button>
          <button class="btn quiz-option" data-correct="true"
                  data-explain="3 copias, 2 soportes diferentes, 1 fuera de la institución.">3 copias, 2 soportes, 1 fuera</button>
          <button class="btn quiz-option">2 copias, 2 soportes, 1 en nube</button>
        </div>
        <div class="badges"><span class="badge badge--ok">Backups</span></div>
      </div>`,

    // Nuevo — Metadatos
    ej4: `
      <div class="quiz">
        <div class="quiz-q">Vas a publicar un PDF en la web institucional. ¿Qué hacés con los metadatos?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Nada; publicarlo tal cual</button>
          <button class="btn quiz-option" data-correct="true"
                  data-explain="En Windows: Propiedades → Detalles → Quitar propiedades e información personal.">Quitar propiedades e información personal</button>
          <button class="btn quiz-option">Solo cambiar el nombre del archivo</button>
        </div>
        <div class="badges"><span class="badge badge--warn">Metadatos</span></div>
      </div>`,

    // Nuevo — Dónde guardar
    ej5: `
      <div class="quiz">
        <div class="quiz-q">Tenés actas con datos confidenciales. ¿Dónde las guardás?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Pendrive sin cifrar</button>
          <button class="btn quiz-option">Carpeta “Descargas” del equipo personal</button>
          <button class="btn quiz-option" data-correct="true"
                  data-explain="Carpeta de red institucional (permisos/backup). En nube, sólo cifrada y con controles.">Carpeta de red institucional o nube cifrada con permisos</button>
        </div>
        <div class="badges"><span class="badge badge--ok">Almacenamiento</span></div>
      </div>`
  }
},


2: {
  resumenCorto:
    "El correo electrónico es esencial en la universidad, pero también una de las vías favoritas para fraudes y malware. Para reducir riesgos, hay que validar remitente y dominio real, desconfiar de urgencias, cuidar adjuntos/enlaces y aplicar buenas prácticas (CCO, desactivar descarga automática de imágenes, etc.).",
  puntos: [
    { titulo: "Sospechá de lo inesperado", texto: "Remitentes extraños, tono urgente, enlaces/adjuntos." },
    { titulo: "Verificá el dominio real", texto: "Pasá el mouse o copiá la URL; no te fíes del texto visible." },
    { titulo: "Buenas prácticas", texto: "Usar CCO, revisar autocompletado, desactivar imágenes automáticas." }
  ],

  contenido: [
    {
      icon: "📧",
      titulo: "1) El correo como herramienta… y vector de ataque",
      texto: `El correo es rápido y ubicuo, pero su diseño original no priorizaba la seguridad. Hoy es un canal común para:
              <br>• Robar credenciales/datos (phishing, scam)<br>• Infectar equipos (malware, ransomware)
              <br><br>Recordá: en un correo malicioso TODO puede estar manipulado (remitente, asunto, cuerpo, firma, adjuntos, enlaces).`,
      aciertos: ["Capacitación continua", "Políticas claras de uso"],
      peligros: ["Confiar “porque parece oficial”", "Responder impulsivamente"]
    },

    {
      icon: "🚨",
      titulo: "2) Tipos de correos fraudulentos",
      texto: `1) Phishing → suplantación de entidades para robar claves/datos.<br>
              2) Scam → falsas herencias/premios/ofertas de empleo para estafar.<br>
              3) Sextorsión → chantaje con supuestos videos (suelen ser falsos).<br>
              4) Malware → adjuntos o links que instalan código malicioso.
              `,
      aciertos: ["Reportar a TI/Seguridad", "Borrar sin abrir adjuntos"],
      peligros: ["Pagar extorsiones", "Abrir adjuntos de origen desconocido"]
    },

    {
      icon: "🔎",
      titulo: "3) Cómo detectarlos (señales clave)",
      texto: `• Remitente sospechoso o falseado (spoofing).<br>
              • Asuntos alarmistas/urgentes (ej.: “tu cuenta será desactivada en 2 h”).<br>
              • Mensajes impersonales (“Estimado cliente/usuario”).<br>
              • Adjuntos riesgosos: .exe, .vbs, .docm/.xlsm, .zip, .rar, etc.<br>
              • Mala redacción/errores de ortografía.<br>
              • Enlaces falseados: el texto dice una cosa, el dominio real es otro.`,
      aciertos: ["Leer con calma", "Dudar ante la urgencia"],
      peligros: ["Dar clic “para ver”", "Habilitar macros"]
    },

    {
      icon: "🌐",
      titulo: "4) Enlaces: dominio visible vs. dominio real",
      texto: `Antes de hacer clic:<br>
              • En PC: pasá el mouse y mirá el destino real (barra de estado).<br>
              • En móvil: copiá el enlace y pegalo en notas para verlo completo.<br>
              • Comprobá el dominio principal (ej.: “uncuyo.edu.ar”). Subdominios largos suelen engañar.
              `,
      aciertos: ["Ir por la web oficial", "Analizar en VirusTotal si dudás"],
      peligros: ["Confiar en el texto visible", "Ingresar credenciales “para probar”"]
    },

    {
      icon: "📎",
      titulo: "5) Adjuntos y macros: manejo seguro",
      texto: `• Nunca abras adjuntos inesperados (aunque “parezcan” del área).<br>
              • Desconfiá de ZIP/RAR que piden descomprimir y abrir rápido.<br>
              • DOCM/XLSM → no habilites macros salvo absoluta certeza.<br>
              • Si hace falta, analizá el archivo con tu antivirus o un servicio multi–motor.`,
      aciertos: ["Validar por canal oficial", "Escanear antes de abrir"],
      peligros: ["Abrir “para ver de qué se trata”", "Habilitar macros de Office"]
    },

    {
      icon: "⚠️",
      titulo: "6) Otros riesgos de uso",
      texto: `• CC vs CCO: para envíos masivos, usá CCO (no expongas direcciones).<br>
              • Autocompletado: puede enviar al destinatario equivocado (revisá).<br>
              • Descarga automática de imágenes: desactivala (rastreo/privacidad).`,
      aciertos: ["Usar CCO", "Revisar destinatarios", "Bloquear imágenes automáticas"],
      peligros: ["Exponer correos", "Confirmar lectura sin querer"]
    },

    {
      icon: "🧭",
      titulo: "7) Qué hacer ante la sospecha",
      texto: `1) No hagas clic ni abras adjuntos; no respondas.<br>
              2) Reportá al área de TI/Seguridad (reenviá como adjunto el correo).<br>
              3) Si hiciste clic/ingresaste datos, cambiá contraseñas y avisá de inmediato.<br>
              4) Escaneá el equipo; si hay indicios, desconectalo de la red y contactá soporte.`,
      aciertos: ["Reporte temprano", "Cambio de claves y 2FA"],
      peligros: ["Ocultar el incidente", "Seguir usando el equipo sospechoso"]
    }
  ],

  ejemplos: {
    // 1 — Enlace sospechoso (phishing)
    ej1: `
      <div class="quiz">
        <div class="quiz-q">Recibís “Actualizá tu cuenta” con link <strong>Acceso Cuenta UNCuyo</strong>, pero el dominio real es <code>uncuyo-seguridad-support.com</code>. ¿Qué hacés?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="El texto visible no garantiza el dominio.">Hacer clic igual</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Dominio real ≠ <code>uncuyo.edu.ar</code>. Es señuelo. Reportá y borrá.">Reportar como phishing y borrar</button>
          <button class="btn quiz-option" data-explain="No pruebes a ver qué pasa. Verificá por el sitio oficial.">Entrar pero sin poner datos</button>
        </div>
        <div class="badges"><span class="badge badge--danger">Phishing</span><span class="badge badge--warn">Dominio</span></div>
      </div>`,

    // 2 — Adjuntos peligrosos
    ej2: `
      <div class="quiz">
        <div class="quiz-q">Te llega “RRHH” con <code>Planilla_sueldos.zip</code> y urgencia para hoy. ¿Acción correcta?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="La urgencia es un gatillo típico.">Abrir el ZIP porque viene de RRHH</button>
          <button class="btn quiz-option" data-explain="Habilitar macros es vector común de malware.">Abrir y habilitar macros si lo pide</button>
          <button class="btn quiz-option" data-correct="true" data-explain="No abrir; validar por canal oficial y analizar con antivirus/VirusTotal si hace falta.">No abrir; validar por canal oficial y analizar</button>
        </div>
        <div class="badges"><span class="badge badge--danger">Malware</span><span class="badge badge--ok">Validación</span></div>
      </div>`,

    // 3 — CC vs CCO
    ej3: `
      <div class="quiz">
        <div class="quiz-q">Vas a avisar a 200 estudiantes de carreras distintas. ¿Cómo evitás exponer direcciones?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Con CC todos ven las direcciones.">Usar CC con todos</button>
          <button class="btn quiz-option" data-correct="true" data-explain="CCO oculta direcciones entre sí.">Usar CCO y tu correo en “Para”</button>
          <button class="btn quiz-option" data-explain="Pegar correos en el cuerpo también los expone.">Pegar la lista en el cuerpo</button>
        </div>
        <div class="badges"><span class="badge badge--ok">Privacidad</span></div>
      </div>`,

    // 4 — Verificación de enlace (nuevo)
    ej4: `
      <div class="quiz">
        <div class="quiz-q">Antes de entrar a un link dudoso, ¿qué paso es correcto?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Hacer clic y ver si carga</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Mirar el destino real (hover/copy) y comprobar el dominio principal.">Ver el destino real y comprobar el dominio</button>
          <button class="btn quiz-option">Fiarme del texto azul sin más</button>
        </div>
        <div class="badges"><span class="badge badge--warn">Enlaces</span></div>
      </div>`,

    // 5 — Imágenes automáticas (nuevo)
    ej5: `
      <div class="quiz">
        <div class="quiz-q">Para evitar rastreo y reducir riesgo, ¿qué hacés con la descarga automática de imágenes?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">La dejo activada (me gusta verlas)</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Bloquealas por defecto; cargalas manualmente si confiás en el remitente.">La desactivo por defecto</button>
          <button class="btn quiz-option">Depende del día</button>
        </div>
        <div class="badges"><span class="badge badge--ok">Privacidad</span></div>
      </div>`
  }
},


  3: {
  resumenCorto:
    "Las contraseñas son la primera barrera de seguridad. Si son débiles, compartidas o reutilizadas, facilitan el acceso no autorizado y ponen en riesgo la continuidad académica y administrativa.",
  puntos: [
    { titulo: "Usá contraseñas largas, complejas y únicas", texto: "Idealmente frases; una distinta por servicio." },
    { titulo: "No las compartas jamás", texto: "Son personales e intransferibles." },
    { titulo: "Usá un gestor de contraseñas", texto: "Para generar/guardar claves robustas (no confundir con apps de códigos 2FA)." }
  ],

  contenido: [
    {
      icon: "🛡️",
      titulo: "1) Robustez",
      texto: `
        • Mínimo recomendado: 12–16 caracteres (el documento indica como base 8; cuanto más larga, mejor).<br>
        • Combiná mayúsculas, minúsculas, números y símbolos.<br>
        • Evitá patrones obvios (123456, qwerty, nombre+fecha).<br>
        • Frases de paso o generador del gestor = más entropía.
      `,
      aciertos: ["Frases largas", "Generador activo"],
      peligros: ["Patrones previsibles", "Demasiado corta"]
    },

    {
      icon: "🙅‍♂️",
      titulo: "2) No compartidas",
      texto: `
        • Las contraseñas son personales e intransferibles.<br>
        • Si otro la usa, las acciones figuran como tuyas (responsabilidad).<br>
        • Para accesos compartidos, usá cofres/colecciones del gestor.
      `,
      aciertos: ["Uso personal", "Cofres compartidos"],
      peligros: ["Enviar por chat/correo", "Anotarlas en papel"]
    },

    {
      icon: "🚫",
      titulo: "3) No reutilizarlas",
      texto: `
        • Usá una contraseña distinta por servicio.<br>
        • Si una se filtra (phishing/fuga), no debe abrir otras cuentas.<br>
        • Si hubo filtración: cambiá, activá MFA y cerrá sesiones.
      `,
      aciertos: ["Única por servicio"],
      peligros: ["Reutilización en varios sitios"]
    },

    {
      icon: "🔐",
      titulo: "4) Doble factor (2FA/MFA)",
      texto: `
        • Activalo siempre que puedas (app autenticadora TOTP o llave física).<br>
        • Mejor TOTP/llaves FIDO/U2F que SMS como único factor.<br>
        • Guardá códigos de recuperación en lugar seguro.
      `,
      aciertos: ["MFA activo", "Códigos de backup"],
      peligros: ["Solo contraseña", "Usar solo SMS"]
    },

    {
      icon: "🗂️",
      titulo: "5) Gestores de contraseñas",
      texto: `
        • Guardan y autocompletan de forma segura todas tus claves.<br>
        • Generan contraseñas aleatorias robustas automáticamente.<br>
        • Solo recordás la “maestra”: debe ser muy fuerte.
      `,
      aciertos: ["Gestor en uso", "Generador"],
      peligros: ["Maestra débil", "Post-it en el monitor"]
    }
  ],

  ejemplos: {
    // Ejemplo 1 — Elegir la contraseña más robusta
    ej1: `
      <div class="quiz">
        <div class="quiz-q">¿Cuál de estas contraseñas es la más robusta?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Incluye nombre y año: patrón previsible y fácil de adivinar.">M@teo2024</button>
          <button class="btn quiz-option" data-explain="Es aleatoria, pero corta (8). Mejor 12–16+ o frase.">Ls!r72qP</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Frase larga con palabras no relacionadas, símbolos y espacios → alta entropía.">Cactus-cielo_caracol 19!</button>
        </div>
        <div class="badges">
          <span class="badge badge--ok">Robustez</span>
          <span class="badge badge--warn">Frases largas</span>
        </div>
      </div>`,

    // Ejemplo 2 — Reutilización y respuesta ante filtraciones
    ej2: `
      <div class="quiz">
        <div class="quiz-q">Usaste la misma contraseña en tu correo institucional y en un campus virtual. Te llega alerta de filtración del campus. ¿Qué hacés?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Ignorar aumenta el riesgo: si ya la tienen, probarán en otros servicios.">No hago nada</button>
          <button class="btn quiz-option" data-explain="Si reutilizaste, cambiar solo uno deja el otro expuesto.">Cambio la del campus y listo</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Cambiá en ambos, activá MFA, cerrá sesiones abiertas y revisá reenvíos sospechosos.">Cambio ambas, activo MFA y reviso sesiones</button>
        </div>
        <div class="badges">
          <span class="badge badge--danger">No reutilizar</span>
          <span class="badge badge--ok">Respuesta a incidentes</span>
        </div>
      </div>`,

    // Ejemplo 3 — Mejor segundo factor (MFA)
    ej3: `
      <div class="quiz">
        <div class="quiz-q">¿Qué opción de segundo factor (MFA) es MÁS recomendable?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Mejor que nada, pero vulnerable a SIM swapping y desvíos.">Código por SMS</button>
          <button class="btn quiz-option" data-correct="true" data-explain="App autenticadora (TOTP) o llave física FIDO2/U2F → más resistente a phishing y robo de SIM.">App autenticadora o llave física</button>
          <button class="btn quiz-option" data-explain="El correo puede estar comprometido; no es un canal robusto para MFA.">Código enviado por e-mail</button>
        </div>
        <div class="badges">
          <span class="badge badge--ok">MFA</span>
          <span class="badge badge--warn">Buenas prácticas</span>
        </div>
      </div>`
  }
},


  4: {
  resumenCorto:
    "El puesto de trabajo (oficina, equipos, documentos y periféricos) es un punto crítico: allí accedemos a sistemas y datos sensibles. Para evitar fugas, accesos indebidos o malware, aplicamos ‘mesa limpia’, bloqueo de sesión, software/antivirus/firewall actualizados, uso institucional de recursos y manejo seguro de soportes.",
  puntos: [
    { titulo: "Mesa limpia y bloqueo", texto: "Guardar documentos y bloquear el equipo al ausentarse." },
    { titulo: "Actualizar y proteger", texto: "SO y apps al día; antivirus y firewall siempre activos." },
    { titulo: "Uso institucional", texto: "Internet y sistemas sólo para fines de la universidad; software legítimo." },
    { titulo: "Confidencialidad y reporte", texto: "Acuerdos cuando aplique y notificar incidentes de inmediato." },
    { titulo: "USB/soportes", texto: "Uso autorizado, cifrado y borrado/ destrucción seguros." }
  ],

  contenido: [
    {
      icon: "🧹",
      titulo: "1) Organización y documentación",
      texto: `
        • Mantener el puesto limpio y ordenado (sin contraseñas a la vista).<br>
        • Guardar documentación sensible al finalizar la jornada (cajón/armario).<br>
        • Retirar documentos de impresoras/escáneres y destruir en forma segura al final de su ciclo de vida.`,
      aciertos: ["Mesa limpia", "Documentos bajo llave"],
      peligros: ["Papeles a la vista", "Post-it con contraseñas"]
    },
    {
      icon: "💻",
      titulo: "2) Bloqueo de sesión y fin de jornada",
      texto: `
        • Bloqueá al levantarte: Windows Win+L · macOS Ctrl+⌥+Q · Linux Ctrl+Alt+L.<br>
        • Configurá bloqueo automático por inactividad; en móviles, bloqueo corto con PIN/biometría.<br>
        • Al terminar, apagá equipos y guardá portátiles/móviles bajo llave.`,
      aciertos: ["Bloqueo inmediato", "Auto-bloqueo"],
      peligros: ["Equipo desbloqueado", "Dejar equipos encendidos"]
    },
    {
      icon: "🛠️",
      titulo: "3) Software actualizado, antivirus y firewall",
      texto: `
        • Activá actualizaciones automáticas de SO y aplicaciones.<br>
        • Antivirus y firewall siempre ACTIVOS y actualizados; son complementarios.<br>
        • Un equipo desactualizado es vulnerable a exploits y ransomware.`,
      aciertos: ["Auto-update", "AV/Firewall activos"],
      peligros: ["Parcheo tardío", "Desactivar protección"]
    },
    {
      icon: "🌐",
      titulo: "4) Uso responsable de recursos e Internet",
      texto: `
        • Los recursos institucionales son para fines de la universidad.<br>
        • Evitá webs de riesgo (descargas, juego, adultos) y publicidad engañosa/pop-ups.<br>
        • No alteres configuración ni instales software sin autorización.`,
      aciertos: ["Uso institucional", "Políticas claras"],
      peligros: ["Webs dudosas", "Cambios no autorizados"]
    },
    {
      icon: "✅",
      titulo: "5) Software legítimo",
      texto: `
        • Usá software con licencia. Nada de programas pirata ni cracks.<br>
        • El software ilegal suele traer adware/malware o pedir “parches” maliciosos.`,
      aciertos: ["Licencias válidas"],
      peligros: ["Instalar cracks", "Descargas de sitios no oficiales"]
    },
    {
      icon: "📢",
      titulo: "6) Confidencialidad e incidentes",
      texto: `
        • Establecé acuerdos de confidencialidad cuando corresponda (definición, duración, jurisdicción).<br>
        • Ante incidentes: identificar tipo (acceso no autorizado, DDoS/indisponibilidad, malware, robo de info), avisar a los responsables y, si aplica, denunciar.`,
      aciertos: ["Acuerdos firmados", "Reporte inmediato"],
      peligros: ["No informar", "Minimizar el impacto"]
    },
    {
      icon: "💾",
      titulo: "7) Dispositivos extraíbles (USB, discos, tarjetas, CD)",
      texto: `
        • Usalos sólo si está permitido y con criterios claros; cifrá si llevan datos sensibles.<br>
        • No conectar USB desconocidos; ante pérdida/robo, reportar de inmediato.<br>
        • Borrado/ destrucción segura al reutilizar o desechar los soportes.`,
      aciertos: ["USB cifrado", "Canal oficial de reporte"],
      peligros: ["USB hallado sin control", "Reutilizar sin borrar seguro"]
    }
  ],

  ejemplos: {
    // Ejemplo 1 — Bloqueo de sesión y mesa limpia
    ej1: `
      <div class="quiz">
        <div class="quiz-q">Tenés que levantarte 5 minutos del puesto. ¿Qué corresponde hacer?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Equipo desbloqueado = riesgo de acceso/robo de info.">Irme sin bloquear, total es un momento</button>
          <button class="btn quiz-option" data-explain="Tapar la pantalla no impide uso del teclado/ratón.">Poner un papel tapando el monitor</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Bloqueá (Win+L / Ctrl+⌥+Q / Ctrl+Alt+L) y guardá documentos sensibles.">Bloquear la sesión y guardar documentos</button>
        </div>
        <div class="badges">
          <span class="badge badge--ok">Mesa limpia</span>
          <span class="badge badge--ok">Bloqueo de sesión</span>
          <span class="badge badge--warn">Datos a la vista</span>
        </div>
      </div>`,

    // Ejemplo 2 — USB desconocido
    ej2: `
      <div class="quiz">
        <div class="quiz-q">Encontrás un pendrive en un aula con etiqueta “Actas”. ¿Qué hacés?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Puede ejecutar malware o filtrar datos.">Lo conecto para ver de quién es</button>
          <button class="btn quiz-option" data-explain="En tu equipo personal también es riesgoso.">Lo conecto en mi equipo personal</button>
          <button class="btn quiz-option" data-correct="true" data-explain="No lo conectes. Entregalo a Soporte/Seguridad para tratamiento seguro.">No conectar; derivar a Soporte/Informática</button>
        </div>
        <div class="badges">
          <span class="badge badge--danger">USB desconocido</span>
          <span class="badge badge--ok">Canal oficial</span>
        </div>
      </div>`,

    // Ejemplo 3 — “Actualización” sospechosa / software legítimo
    ej3: `
      <div class="quiz">
        <div class="quiz-q">Aparece un pop-up: “Tu reproductor está desactualizado. Descargá este <em>codec</em>”. ¿Cómo procedés?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Vector típico de adware/malware.">Descargo e instalo desde esa ventana</button>
          <button class="btn quiz-option" data-explain="No actualizar nunca deja vulnerabilidades sin parche.">Ignoro siempre las actualizaciones</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Cerrá el pop-up. Si necesitás actualizar, hacelo desde tienda/sitio oficial o pedilo a Soporte.">Actualizar sólo desde tienda/sitio oficial</button>
        </div>
        <div class="badges">
          <span class="badge badge--ok">Software legítimo</span>
          <span class="badge badge--warn">Evitar pop-ups</span>
        </div>
      </div>`,

    // Ejemplo 4 — Documentos en impresora (nuevo)
    ej4: `
      <div class="quiz">
        <div class="quiz-q">Al pasar por la impresora ves listados con DNI olvidados. ¿Qué hacés?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Los dejo, no son míos</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Retiralos y avisá/entregá al responsable o a Soporte; evitás exposición de datos.">Retirarlos y avisar/entregar al responsable</button>
          <button class="btn quiz-option">Les saco foto por si alguien los reclama</button>
        </div>
        <div class="badges">
          <span class="badge badge--ok">Custodia</span>
          <span class="badge badge--warn">Evitar exposición</span>
        </div>
      </div>`,

    // Ejemplo 5 — Antivirus/Firewall (nuevo)
    ej5: `
      <div class="quiz">
        <div class="quiz-q">Tu PC está lento y pensás desactivar el antivirus y el firewall. ¿Qué corresponde?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Desactivarlos “un rato” para que rinda</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Nunca desactives protección. Pedí a Soporte revisión/optimización y mantené todo actualizado.">Mantenerlos activos y pedir soporte</button>
          <button class="btn quiz-option">Desactivar el firewall pero dejar el antivirus</button>
        </div>
        <div class="badges">
          <span class="badge badge--ok">Protección activa</span>
          <span class="badge badge--warn">Soporte</span>
        </div>
      </div>`
  }
},

  5: {
  resumenCorto:
    "Los dispositivos móviles (portátiles, smartphones, tablets) habilitan estudiar y trabajar desde cualquier lugar, pero traen riesgos: pérdida/robo, malware, apps con permisos excesivos y redes Wi-Fi inseguras. La protección exige bloqueo, cifrado, software legítimo/actualizado, no recordar contraseñas, y evitar Wi-Fi pública salvo con VPN.",

  puntos: [
    { titulo: "Bloqueo y cifrado", texto: "Bloqueo de pantalla rápido y cifrado del dispositivo." },
    { titulo: "Software y apps", texto: "Actualizaciones, antimalware y descargas sólo de tiendas oficiales." },
    { titulo: "Contraseñas y gestor", texto: "No ‘recordar’ en el dispositivo; usar gestor de contraseñas." },
    { titulo: "Redes seguras", texto: "Evitar Wi-Fi públicas; preferir datos o usar VPN institucional." },
    { titulo: "BYOD responsable", texto: "Nada de root/jailbreak; normativa y no prestar el equipo." }
  ],

  contenido: [
    {
      icon: "⚠️",
      titulo: "1) Riesgos principales",
      texto: `
        • Robo o pérdida (incidente más frecuente).<br>
        • Malware/phishing y sitios web fraudulentos, especialmente en móviles.<br>
        • Wi-Fi inseguras que permiten interceptar comunicaciones o suplantan redes legítimas.<br>
        • Apps con permisos excesivos; controles de acceso débiles; sistemas desactualizados.<br>
        • Root/jailbreak que elimina controles de seguridad del fabricante.
      `,
      aciertos: ["Equipo cifrado", "Accesos robustos"],
      peligros: ["Wi-Fi pública", "Apps no oficiales"]
    },

    {
      icon: "🛡️",
      titulo: "2) Medidas de protección",
      texto: `
        • Antimalware actualizado; ideal que bloquee webs de phishing/peligrosas.<br>
        • Bloqueo automático y contraseña/PIN robusto + biometría cuando aplique.<br>
        • Cifrado del dispositivo y tratamiento prudente de la información (evitar descargas locales de info sensible).<br>
        • Apps sólo de tiendas oficiales; software y SO siempre actualizados y con licencia.<br>
        • NO usar “Recordar contraseña” en el dispositivo; preferí un gestor de contraseñas.<br>
        • Evitá Wi-Fi públicas; si es imprescindible, conectá primero la VPN institucional.<br>
        • En casa: Wi-Fi con WPA2/WPA3, clave robusta y WPS desactivado.<br>
        • No rootear ni hacer jailbreak.
      `,
      aciertos: ["Antivirus/antiphishing", "Auto-bloqueo y cifrado"],
      peligros: ["Recordar contraseñas", "Descargas fuera de tiendas"]
    },

    {
      icon: "👨‍💻",
      titulo: "3) BYOD (Trae tu propio dispositivo)",
      texto: `
        • Beneficios: flexibilidad y costos.<br>
        • Riesgos: distracciones, mezcla personal/laboral, prestar el dispositivo, salida del empleado con datos.<br>
        • Medidas: normativa interna, registro de equipos y apps autorizadas, configuraciones seguras, custodia permanente, prohibido root/jailbreak.
      `,
      aciertos: ["Normativa clara", "Apps controladas"],
      peligros: ["Prestado a terceros", "Datos laborales mezclados"]
    },

    {
      icon: "🆘",
      titulo: "4) En caso de robo o pérdida",
      texto: `
        • Avisar de inmediato a la institución y hacer la denuncia policial cuando aplique.<br>
        • Bloqueo y geolocalización remotos; si no se recupera, ejecutar BORRADO remoto.<br>
        • Revisar y cerrar sesiones, cambiar contraseñas críticas y aplicar MFA.
      `,
      aciertos: ["Bloqueo/borrado remoto", "Notificación inmediata"],
      peligros: ["No reportar", "Dejar sesiones abiertas"]
    }
  ],

  ejemplos: {
    // 1 — Wi-Fi pública y acceso a sistemas
    ej1: `
      <div class="quiz">
        <div class="quiz-q">Estás en una cafetería con Wi-Fi pública “Gratis_Uni”. Tenés que entrar al correo institucional y a un sistema interno. ¿Qué hacés?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="La Wi-Fi pública permite interceptar tráfico / ataques MITM.">Me conecto y entro normalmente</button>
          <button class="btn quiz-option" data-explain="HTTPS ayuda, pero no elimina riesgos (captura de sesión, portales falsos).">Entro si veo el candado (HTTPS)</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Usá datos móviles o conectate sólo si primero levantás la VPN institucional.">Uso datos móviles o VPN institucional antes de ingresar</button>
        </div>
        <div class="badges">
          <span class="badge badge--danger">Wi-Fi pública</span><span class="badge badge--ok">VPN</span>
        </div>
      </div>`,

    // 2 — Instalación y permisos de apps
    ej2: `
      <div class="quiz">
        <div class="quiz-q">Una app promete “mejorar seguridad” pero pide <em>leer SMS</em> y <em>accesibilidad</em>. ¿Cuál es la opción correcta?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="SMS/Accesibilidad pueden robar códigos 2FA o controlar el equipo.">Aceptar permisos para que funcione</button>
          <button class="btn quiz-option" data-explain="Instalar APK fuera de la tienda salta controles y aumenta riesgo.">Instalar el APK desde un blog</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Instalá sólo desde tiendas oficiales; revisá y negá permisos innecesarios.">Instalar sólo desde tienda oficial y denegar permisos excesivos</button>
        </div>
        <div class="badges">
          <span class="badge badge--ok">Apps oficiales</span><span class="badge badge--danger">Permisos excesivos</span>
        </div>
      </div>`,

    // 3 — Robo o pérdida del dispositivo
    ej3: `
      <div class="quiz">
        <div class="quiz-q">Perdiste el celular con correo institucional abierto. ¿Qué pasos tomás?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Esperar agrava el riesgo.">Espero a ver si aparece</button>
          <button class="btn quiz-option" data-explain="Cambiar sólo una clave no frena acceso si el equipo sigue sin bloquear.">Cambio sólo la contraseña del correo</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Bloqueo/ubicación y, si no aparece, borrado remoto; aviso a la institución; revocar sesiones y cambiar claves críticas.">Bloqueo/ubicación remota; aviso y borrado si hace falta</button>
        </div>
        <div class="badges">
          <span class="badge badge--ok">Borrado remoto</span><span class="badge badge--ok">Notificación</span>
        </div>
      </div>`,

    // 4 — BYOD y separación de datos
    ej4: `
      <div class="quiz">
        <div class="quiz-q">Usás tu teléfono personal para el correo institucional (BYOD). Un familiar te pide prestarlo “un minuto”. ¿Qué corresponde?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Prestar el dispositivo expone apps/correos y puede cambiar ajustes.">Prestárselo un minuto y mirar</button>
          <button class="btn quiz-option" data-explain="Quitar el PIN viola normas básicas.">Quito el PIN para que no moleste</button>
          <button class="btn quiz-option" data-correct="true" data-explain="No compartir; usar perfil de trabajo/MDM para apps institucionales, con bloqueo activo.">No prestar; usar perfil de trabajo/MDM</button>
        </div>
        <div class="badges">
          <span class="badge badge--ok">BYOD controlado</span><span class="badge badge--ok">Bloqueo activo</span>
        </div>
      </div>`,

    // 5 — Wi-Fi del hogar segura (nuevo)
    ej5: `
      <div class="quiz">
        <div class="quiz-q">En tu casa vas a usar el portátil para el campus. ¿Qué ajustes de Wi-Fi son correctos?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Dejo WPS activado para conectar rápido</button>
          <button class="btn quiz-option" data-explain="WPA/WPA débil + clave floja = fácil de romper.">WPA con clave corta “12345678”</button>
          <button class="btn quiz-option" data-correct="true" data-explain="WPA2/WPA3, clave robusta y WPS desactivado endurecen la red doméstica.">WPA2/WPA3, clave robusta y WPS desactivado</button>
        </div>
        <div class="badges">
          <span class="badge badge--ok">WPA2/WPA3</span><span class="badge badge--warn">WPS off</span>
        </div>
      </div>`
  }
},


6: {
  resumenCorto:
    "Las redes sociales potencian la visibilidad y la marca de la universidad, pero un error humano, una configuración de privacidad débil o el fraude (suplantación, malware, phishing) pueden dañar la reputación e incluso comprometer datos. Protegé tus perfiles con contraseñas robustas + 2FA, privacidad bien configurada, gobernanza (quién publica) y prudencia con enlaces/adjuntos.",

  puntos: [
    { titulo: "Valor y riesgo", texto: "Aportan alcance y marca; un mal uso daña reputación." },
    { titulo: "Gobernanza", texto: "Solo personal autorizado publica; políticas claras." },
    { titulo: "Privacidad y seguridad", texto: "Contraseñas fuertes + 2FA; revisar apps conectadas." },
    { titulo: "Prudencia al publicar", texto: "Pensar la audiencia y evitar datos sensibles." },
    { titulo: "Enlaces/adjuntos", texto: "Desconfiar y analizar; ante duda, no abrir." }
  ],

  contenido: [
    {
      icon: "📣",
      titulo: "1) Valor y reputación",
      texto: `
        • Las redes sociales acercan la universidad a su comunidad y refuerzan la marca institucional (más tráfico y visibilidad).<br>
        • Un comentario inoportuno o una mala gestión puede afectar negativamente la imagen institucional.`,
      aciertos: ["Estrategia y tono definidos", "Objetivos claros"],
      peligros: ["Publicar sin revisar", "Reacciones impulsivas"]
    },
    {
      icon: "👥",
      titulo: "2) Gobernanza de cuentas",
      texto: `
        • Definí roles: ¿quiénes administran? ¿quién aprueba? ¿qué se publica y cómo se responde?<br>
        • Solo personal autorizado publica contenidos; evitá que “cualquiera” tenga permisos.<br>
        • Revisá periódicamente apps de terceros conectadas al perfil y retirales acceso si no son necesarias.`,
      aciertos: ["Roles y permisos controlados", "Revisión de accesos"],
      peligros: ["Permisos abiertos", "Apps con acceso innecesario"]
    },
    {
      icon: "🔐",
      titulo: "3) Acceso seguro (contraseña + 2FA)",
      texto: `
        • Usá contraseña robusta para cada perfil institucional y activá el doble factor (2FA).<br>
        • Si un atacante roba la contraseña, el segundo factor bloquea el acceso.`,
      aciertos: ["2FA activado", "Claves robustas"],
      peligros: ["Una sola clave débil", "Sin segundo factor"]
    },
    {
      icon: "🕵️",
      titulo: "4) Privacidad y audiencia",
      texto: `
        • Configurá la privacidad de forma restrictiva sin afectar el objetivo del perfil.<br>
        • Antes de publicar, verificá si la audiencia es la correcta (público, listas, grupos) y si el contenido podría usarse en contra.`,
      aciertos: ["Audiencias adecuadas", "Privacidad revisada"],
      peligros: ["Perfiles abiertos sin control", "Datos sensibles expuestos"]
    },
    {
      icon: "⚠️",
      titulo: "5) Fraudes y suplantación",
      texto: `
        • Suplantación: perfiles falsos que imitan a la universidad para engañar seguidores (piden datos, cambian contactos).<br>
        • Phishing: enlaces a sitios fraudulentos para robar credenciales o información.<br>
        • Malware: adjuntos o webs maliciosas enviadas por DM o publicaciones.`,
      aciertos: ["Verificar identidad del perfil", "Reportar suplantaciones"],
      peligros: ["Seguir perfiles falsos", "Compartir sorteos dudosos"]
    },
    {
      icon: "🧷",
      titulo: "6) Enlaces y adjuntos",
      texto: `
        • Considerá cualquier adjunto recibido por redes como potencialmente malicioso; analizalo con tu antivirus o servicios como VirusTotal.<br>
        • Ante la duda con un enlace, no hagas clic; accedé a la información desde los canales oficiales.`,
      aciertos: ["Analizar adjuntos", "Comprobar enlaces"],
      peligros: ["Abrir sin verificar", "Confiar en acortadores"]
    },
    {
      icon: "🧭",
      titulo: "7) Sentido común y conducta",
      texto: `
        • Evitá discutir, insultar, difundir noticias falsas o publicar información confidencial/PI.<br>
        • Recordá que lo publicado puede ser capturado y difundido fuera de contexto.`,
      aciertos: ["Tono profesional", "Chequeo previo"],
      peligros: ["Juicios de valor", "Filtrar datos por error"]
    }
  ],

  ejemplos: {
    // 1 — DM con enlace acortado (phishing)
    ej1: `
      <div class="quiz">
        <div class="quiz-q">Te llega un mensaje privado: “Tu cuenta será desactivada por incumplir normas. Verificá acá: <code>bit.ly/seguridad-uncuyo</code> – Soporte”. ¿Qué hacés?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Los acortadores esconden el dominio real; típico señuelo de phishing.">Entrar y verificar rápido para no perder la cuenta</button>
          <button class="btn quiz-option" data-explain="Responder confirma actividad del perfil ante el atacante.">Responder y pedir más información</button>
          <button class="btn quiz-option" data-correct="true" data-explain="No hagas clic. Reportá el mensaje y, si dudás, verificá notificaciones SOLO desde la app oficial (Centro de ayuda) sin usar el enlace del DM.">No clicar; reportar y comprobar en la app oficial</button>
        </div>
        <div class="badges">
          <span class="badge badge--danger">Phishing</span>
          <span class="badge badge--warn">Enlace acortado</span>
          <span class="badge badge--ok">Verificación segura</span>
        </div>
      </div>`,

    // 2 — Audiencia/privacidad de la publicación
    ej2: `
      <div class="quiz">
        <div class="quiz-q">Querés subir fotos personales pero NO querés que estudiantes/colegas las vean. ¿Qué configuración usás?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="‘Público’ lo ve cualquiera, incluso buscadores.">Público</button>
          <button class="btn quiz-option" data-explain="‘Solo amigos’ puede incluir a colegas/estudiantes si los agregaste.">Solo amigos</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Usá listas/público personalizado (Close Friends / Amigos excepto / Listas) y revisá la audiencia en cada post.">Listas/Close Friends y público personalizado por post</button>
        </div>
        <div class="badges">
          <span class="badge badge--ok">Privacidad</span>
          <span class="badge badge--warn">Audiencias</span>
        </div>
      </div>`,

    // 3 — Impersonación / sorteos falsos
    ej3: `
      <div class="quiz">
        <div class="quiz-q">Un perfil “UNCuy0_oficial” (con un cero) anuncia un sorteo y pide datos de tarjeta para “verificación”. ¿Qué corresponde?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Nunca entregues datos financieros por redes; es una estafa.">Enviar los datos por DM para participar</button>
          <button class="btn quiz-option" data-explain="Seguir/compartir lo legitima ante tus contactos.">Seguir el perfil y compartir el sorteo</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Es suplantación (typosquatting). Reportá y validá sorteos sólo en canales verificados de la institución.">Reportar y validar en canal oficial</button>
        </div>
        <div class="badges">
          <span class="badge badge--danger">Suplantación</span>
          <span class="badge badge--ok">Verificar fuente</span>
        </div>
      </div>`,

    // 4 — Exposición de datos en imágenes
    ej4: `
      <div class="quiz">
        <div class="quiz-q">Vas a publicar una foto del escritorio con credenciales/DNI visibles. ¿Qué hacés?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Publicar así expone datos personales y accesos.">Publico igual, casi no se notan</button>
          <button class="btn quiz-option" data-explain="Recortar no siempre elimina la información (zoom/metadatos).">Recorto un poco y listo</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Ocultá/borrá (blur/redact) ANTES de la foto o no publiques. Revisá también metadatos.">Ocultar/borrar datos sensibles o no publicar</button>
        </div>
        <div class="badges">
          <span class="badge badge--warn">Reputación</span>
          <span class="badge badge--ok">Datos minimizados</span>
        </div>
      </div>`,

    // 5 — Acceso con 2FA en cuenta institucional (nuevo)
    ej5: `
      <div class="quiz">
        <div class="quiz-q">Administrás la cuenta oficial en dos redes. ¿Qué práctica es correcta?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Compartir una contraseña debilita el control y la trazabilidad.">Compartir la misma contraseña con el equipo</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Claves únicas y 2FA activado en cada red; accesos nominativos/roles administrados.">Clave única + 2FA y accesos nominativos</button>
          <button class="btn quiz-option" data-explain="Las apps de terceros deben ser mínimas y auditadas.">Dar acceso a cualquier app de programación de posts</button>
        </div>
        <div class="badges">
          <span class="badge badge--ok">2FA</span>
          <span class="badge badge--ok">Gobernanza</span>
        </div>
      </div>`,

    // 6 — Adjuntos y análisis (nuevo)
    ej6: `
      <div class="quiz">
        <div class="quiz-q">Recibís por DM un PDF “Listado de inscriptos” desde un perfil desconocido. ¿Cómo procedés?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Lo abro, después veo</button>
          <button class="btn quiz-option" data-explain="Pedir más info en el mismo hilo puede darte más señuelos.">Respondo y pido detalles</button>
          <button class="btn quiz-option" data-correct="true" data-explain="No lo abras. Reportá; si fuera necesario, analizalo con antivirus/servicios multi–motor y validá por canal oficial.">No abrir; reportar y validar por canal oficial</button>
        </div>
        <div class="badges">
          <span class="badge badge--danger">Adjunto sospechoso</span>
          <span class="badge badge--ok">Validación</span>
        </div>
      </div>`
  }
},

7: {
  resumenCorto:
    "La Inteligencia Artificial automatiza tareas, optimiza decisiones y mejora la productividad. Aporta beneficios en bienestar laboral, pero implica riesgos: dependencia, sesgos, errores, privacidad y seguridad. Usala con límites claros, capacitación y controles éticos.",

  puntos: [
    { titulo: "Definición", texto: "Rama de la informática que simula la inteligencia humana." },
    { titulo: "Utilización", texto: "Automatiza, optimiza procesos y complementa tareas." },
    { titulo: "Bienestar laboral", texto: "Mejora seguridad y salud en el trabajo." },
    { titulo: "Vulnerabilidades", texto: "Carga de datos sensibles, ciberataques." },
    { titulo: "Riesgos", texto: "Dependencia, sesgos, privacidad y errores." },
    { titulo: "Prevención", texto: "Límites, gestión de accesos, monitoreo y capacitación." }
  ],

  contenido: [
    {
      icon: "🤖",
      titulo: "1) ¿Qué es la IA?",
      texto: `
        • Rama de la informática que desarrolla sistemas capaces de simular la inteligencia humana.<br>
        • Incluye aprendizaje, razonamiento, percepción y resolución de problemas.<br>
        • Puede operar de manera autónoma o con mínima intervención humana.`,
      aciertos: ["Comprensión clara del alcance", "Uso responsable"],
      peligros: ["Expectativas irreales", "Aplicaciones sin supervisión"]
    },
    {
      icon: "⚙️",
      titulo: "2) Usos de la IA en el trabajo",
      texto: `
        • Chatbots y servicio al cliente.<br>
        • Optimización de documentos y recursos.<br>
        • Automatización de tareas repetitivas.<br>
        • Soporte en la toma de decisiones.`,
      aciertos: ["Mejora de productividad", "Ahorro de tiempo"],
      peligros: ["Automatización sin control", "Errores no revisados"]
    },
    {
      icon: "🩺",
      titulo: "3) Bienestar laboral",
      texto: `
        • La IA puede mejorar la salud y seguridad en el lugar de trabajo.<br>
        • Sistemas de vigilancia que detectan riesgos.<br>
        • Es clave mantener un enfoque centrado en el bienestar humano.`,
      aciertos: ["Ambientes más seguros", "Supervisión eficiente"],
      peligros: ["Exceso de control", "Afectar privacidad del empleado"]
    },
    {
      icon: "🔓",
      titulo: "4) Vulnerabilidades",
      texto: `
        • Riesgo al subir información confidencial.<br>
        • Posibles fallas de seguridad en datos.<br>
        • Mayor exposición a ciberataques.`,
      aciertos: ["Gestión de accesos", "Protección de datos"],
      peligros: ["Filtrar info sensible", "Apps sin seguridad"]
    },
    {
      icon: "⚠️",
      titulo: "5) Riesgos",
      texto: `
        • Dependencia tecnológica excesiva.<br>
        • Sesgos y discriminación por datos incompletos.<br>
        • Problemas de privacidad por uso masivo de datos.<br>
        • Errores o imprecisiones que afecten reputación o cumplimiento normativo.`,
      aciertos: ["Revisar resultados", "Datos de calidad"],
      peligros: ["Sesgos no detectados", "Errores no corregidos"]
    },
    {
      icon: "🛡️",
      titulo: "6) Cómo evitar riesgos",
      texto: `
        • Definir límites claros en el uso de herramientas (ej. ChatGPT).<br>
        • Gestionar accesos y privilegios.<br>
        • Monitorear la actividad y capacitar a empleados.<br>
        • Asegurar un uso ético y planes de respuesta rápida.`,
      aciertos: ["Políticas claras", "Capacitación continua"],
      peligros: ["Uso sin reglas", "Falta de monitoreo"]
    }
  ],

  ejemplos: {
    // 1 — Subida de datos sensibles
    ej1: `
      <div class="quiz">
        <div class="quiz-q">Un compañero sube a la IA un documento con datos de clientes. ¿Es correcto?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Sí, total es solo para análisis</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Nunca cargues información confidencial en IA pública; puede quedar expuesta.">No, la información sensible no debe compartirse</button>
          <button class="btn quiz-option">Sí, si el archivo no tiene contraseñas</button>
        </div>
        <div class="badges">
          <span class="badge badge--danger">Datos sensibles</span>
          <span class="badge badge--ok">Protección</span>
        </div>
      </div>`,

    // 2 — Sesgos en resultados
    ej2: `
      <div class="quiz">
        <div class="quiz-q">El sistema de IA devuelve un resultado con sesgo. ¿Qué hacés?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Lo acepto, seguro es correcto</button>
          <button class="btn quiz-option" data-explain="No alcanza con revisar después; siempre cuestioná los resultados.">Lo uso sin verificar</button>
          <button class="btn quiz-option" data-correct="true" data-explain="La IA puede equivocarse o estar sesgada. Verificá con datos y criterio humano antes de decidir.">Lo reviso críticamente antes de aplicarlo</button>
        </div>
        <div class="badges">
          <span class="badge badge--warn">Sesgos</span>
          <span class="badge badge--ok">Validación</span>
        </div>
      </div>`,

    // 3 — Dependencia tecnológica
    ej3: `
      <div class="quiz">
        <div class="quiz-q">La empresa empieza a depender totalmente de la IA para tomar decisiones clave. ¿Cuál es la mejor práctica?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Dejar que la IA decida sola, es más rápida</button>
          <button class="btn quiz-option" data-correct="true" data-explain="La IA debe complementar al juicio humano, no reemplazarlo completamente.">Usar la IA como apoyo, pero con supervisión humana</button>
          <button class="btn quiz-option">Ignorar siempre las sugerencias de IA</button>
        </div>
        <div class="badges">
          <span class="badge badge--danger">Dependencia</span>
          <span class="badge badge--ok">Supervisión</span>
        </div>
      </div>`,

    // 4 — Privacidad y vigilancia
    ej4: `
      <div class="quiz">
        <div class="quiz-q">La empresa instala IA de vigilancia que graba todo lo que hacen los empleados. ¿Es correcto?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Sí, porque aumenta la seguridad</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Debe existir un equilibrio: la vigilancia no puede vulnerar la privacidad ni generar un ambiente tóxico.">No, debe haber límites y respeto a la privacidad</button>
          <button class="btn quiz-option">Sí, mientras lo informen después</button>
        </div>
        <div class="badges">
          <span class="badge badge--warn">Privacidad</span>
          <span class="badge badge--ok">Bienestar</span>
        </div>
      </div>`,

    // 5 — Errores y revisión
    ej5: `
      <div class="quiz">
        <div class="quiz-q">La IA genera un informe con algunos errores de cálculo. ¿Qué corresponde hacer?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Confiar igual, seguro es un detalle menor</button>
          <button class="btn quiz-option">Publicarlo rápido para ganar tiempo</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Siempre revisá resultados de IA antes de usarlos; un error puede comprometer decisiones o reputación.">Revisar y validar antes de usar</button>
        </div>
        <div class="badges">
          <span class="badge badge--danger">Errores</span>
          <span class="badge badge--ok">Revisión</span>
        </div>
      </div>`
  }
}

};

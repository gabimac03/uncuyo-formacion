// Archivo: javascript/module-data.js
// Rellená los contenidos de cada módulo. Podés editar libremente.
// - resumenCorto: 2–3 líneas. Si no lo completás, se usa el 'desc' de main.js.
// - puntos: bullets del "Resumen del módulo".
// - ejemplos: contenido HTML mostrado al hacer click en los botones (podés usar <h3>, <p>, <ol>, <pre><code>, <img>, etc.).

window.MODULO_DETALLE = {
1: {
  titulo: "Protección de la Información",
  resumen:
    "La información es uno de los activos más importantes dentro de la universidad. Este módulo explica cómo reconocer amenazas, clasificar y proteger datos, aplicar buenas prácticas de almacenamiento, cifrado y respaldos, y cómo cumplir con la legislación argentina sobre privacidad y seguridad de datos.",
  pdf: "./recursos/modulos/Modulo 1 - Informacion - TxD.pdf", // 🔹 nuevo campo
  contenidoNarrativo: `

    <h2>Video: Protección de la Información</h2>
      <div class="video-container">
        <iframe 
          src="https://www.youtube.com/embed/851CLZcqoXE" 
          title="Protección de la Información - Video"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>

    <p>En la universidad, la información es un recurso esencial que sostiene procesos académicos, investigativos y administrativos. Incluye desde bases de datos de estudiantes hasta resultados de investigación y documentación interna. Su disponibilidad, integridad y confidencialidad son clave para el funcionamiento institucional.</p>

    <p>Los sistemas de información incluyen datos, recursos materiales (ordenadores, teléfonos, dispositivos de almacenamiento), recursos intangibles (know-how, reputación, propiedad intelectual) y las personas que los gestionan. Si esta información se altera, se difunde sin autorización o se pierde, puede afectar gravemente la actividad y reputación de la universidad.</p>

    <h2>Amenazas más comunes</h2>
    <ul>
      <li><strong>Errores humanos:</strong> borrado accidental de archivos, envío de correos al destinatario equivocado, fallas de configuración.</li>
      <li><strong>Insiders:</strong> miembros de la comunidad universitaria que filtran o modifican información, cambian notas, roban exámenes o facilitan acceso a terceros.</li>
      <li><strong>Ciberdelincuentes:</strong> malware, ransomware o ingeniería social que explota vulnerabilidades y la falta de preparación.</li>
    </ul>

    <h2>Los tres pilares de la seguridad (CIA)</h2>
    <p><strong>Confidencialidad:</strong> la información no debe estar disponible para personas no autorizadas.<br>
       <strong>Integridad:</strong> la información debe mantenerse correcta y sin alteraciones no autorizadas.<br>
       <strong>Disponibilidad:</strong> la información debe estar accesible cuando se la necesita (un ataque de ransomware puede comprometerla).</p>

    <h2>Inventario y clasificación de activos</h2>
    <p>Antes de aplicar medidas de seguridad hay que saber qué activos tenemos. El inventario debe incluir documentos digitales, dispositivos físicos, bases de datos y aplicaciones, registrando atributos como ubicación, tamaño, departamentos responsables y criticidad.</p>
    <p>Clasificamos la información según sensibilidad:</p>
    <ul>
      <li><em>Confidencial:</em> datos personales, contratos, información financiera o estratégica.</li>
      <li><em>Restringida:</em> documentos internos críticos para el trabajo de ciertos sectores.</li>
      <li><em>Uso interno:</em> información de bajo riesgo que solo circula dentro de la institución.</li>
      <li><em>Pública:</em> datos abiertos al público, por ejemplo lo publicado en el sitio web.</li>
    </ul>
    <p>Etiquetar archivos (ej. <code>[confidencial]Proyecto.docx</code>) y usar marcas de agua o códigos de color ayuda a gestionarlos.</p>

    <h2>Tratamiento y controles de seguridad</h2>
    <p>Una vez clasificada la información se aplican controles como:</p>
    <ul>
      <li>Limitar el acceso según roles y llevar registros de accesos.</li>
      <li>Cifrar datos en reposo y en tránsito (especialmente en dispositivos móviles o nube).</li>
      <li>Firmar acuerdos de confidencialidad.</li>
      <li>Mantener copias de seguridad confiables y probadas.</li>
      <li>Evitar permisos globales (ej. “para todos”) o enlaces públicos sin control.</li>
    </ul>

    <h2>Cifrado</h2>
    <p>El cifrado hace ilegible la información a quienes no tengan la clave. Es clave para almacenar y transmitir datos sensibles, especialmente en portátiles, pendrives y nube. Usar algoritmos fuertes (AES-256), gestionar las claves de forma segura (no enviarlas por correo ni guardarlas en papel) y mantener el software actualizado.</p>

    <h2>Metadatos</h2>
    <p>Los archivos digitales contienen metadatos (autor, fechas, ubicación GPS, software usado). Pueden filtrar información sensible. En Windows: <em>Propiedades → Detalles → Quitar propiedades e información personal</em>. En suites ofimáticas también existe la opción de limpiar metadatos antes de compartir.</p>

    <h2>Opciones de almacenamiento</h2>
    <ul>
      <li><strong>Local:</strong> rápido y cómodo, pero riesgoso ante fallas o pérdida del equipo y genera silos de información.</li>
      <li><strong>Red interna:</strong> centraliza y permite controles y respaldos institucionales; recomendado.</li>
      <li><strong>Nube:</strong> accesible desde cualquier lugar; usar solo servicios institucionales o cifrar antes de subir información sensible y configurar permisos adecuados.</li>
    </ul>

    <h2>Copias de seguridad</h2>
    <p>Son esenciales para recuperarse de incidentes. Pasos clave:</p>
    <ol>
      <li>Determinar qué información copiar según clasificación.</li>
      <li>Definir periodicidad adecuada (diaria, semanal, mensual según riesgo).</li>
      <li>Elegir soporte:</li>
    </ol>
    <ul>
      <li><strong>Cintas magnéticas:</strong> muy económicas para grandes volúmenes, alta vida útil (>30 años), pero acceso lento.</li>
      <li><strong>Discos duros externos:</strong> fáciles de usar, buen rendimiento, pero vida útil menor y coste mayor por TB.</li>
      <li><strong>NAS:</strong> dispositivos centralizados con aplicaciones de backup y gestión sencilla.</li>
      <li><strong>Nube:</strong> acceso remoto y protección ante incidentes físicos, pero exige cifrado y buena conexión.</li>
      <li><strong>Discos ópticos (Blu-ray):</strong> económicos, resistentes a ransomware (por no estar conectados), pero capacidad limitada.</li>
    </ul>
    <p>Tipos de copia:</p>
    <ul>
      <li><strong>Espejo / RAID 1:</strong> copia en tiempo real; rápido de recuperar pero replica errores y malware.</li>
      <li><strong>Completa:</strong> copia todo; fácil restauración pero ocupa mucho espacio y tarda más.</li>
      <li><strong>Diferencial:</strong> guarda cambios desde la última completa; fácil restaurar, uso moderado de espacio.</li>
      <li><strong>Incremental:</strong> solo cambios desde la última copia (eficiente pero restauración más compleja).</li>
    </ul>
    <p><strong>Regla 3-2-1:</strong> mantener 3 copias (1 original + 2 backups), en 2 soportes diferentes, con al menos 1 copia fuera de la institución.</p>

    <h2>Borrado seguro</h2>
    <ul>
      <li>Papel y soportes ópticos: triturar.</li>
      <li>Discos y USB reutilizables: sobrescribir varias veces.</li>
      <li>Teléfonos: cifrar antes de restaurar a valores de fábrica.</li>
      <li>Dispositivos obsoletos: desmagnetizar o destruir físicamente.</li>
      <li>Puede usarse destrucción certificada, que emite un documento legal del proceso.</li>
    </ul>

    <h2>Privacidad y legislación argentina</h2>
    <p>La <strong>Ley 25.326</strong> y su Decreto 1558/2001 protegen los datos personales. Dato personal es cualquier información sobre una persona identificada o identificable (DNI, foto, altura, etc.).</p>
    <p>La autoridad de control es la <strong>AAIP</strong>, que administra el Registro Nacional de Bases de Datos (RNBD). El artículo 43 de la Constitución garantiza el hábeas data (acceso, rectificación y supresión de datos propios).</p>
    <p>Las universidades deben:</p>
    <ul>
      <li>Publicar avisos de privacidad claros en formularios y sistemas.</li>
      <li>Llevar inventario de tratamientos y registrar bases en el RNBD si corresponde.</li>
      <li>Firmar contratos con proveedores que procesen datos (incluir ubicación y cláusulas si hay nube internacional).</li>
      <li>Implementar controles técnicos: acceso restringido, cifrado, registros de actividad, segmentación de redes, gestión de vulnerabilidades y notificación de incidentes.</li>
      <li>Capacitar periódicamente a su comunidad en protección de datos.</li>
    </ul>

    <h2>Gestión segura de dispositivos</h2>
    <p>Mantener sistemas actualizados, cifrado de disco, bloqueo de pantalla, no compartir cuentas y guardar datos institucionales solo en ubicaciones autorizadas.</p>

    <h2>Respuesta ante incidentes</h2>
    <p>Si sospechás de un ataque (archivo cifrado inesperadamente, mensajes pidiendo datos), desconectá el equipo, informá al área de ciberseguridad y no intentes soluciones improvisadas. Actuar rápido limita el daño.</p>
  `,

  ejemplos: {
    ej1: `
      <div class="quiz">
        <div class="quiz-q">¿Qué pilar protege contra el acceso no autorizado a la información?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Disponibilidad</button>
          <button class="btn quiz-option">Integridad</button>
          <button class="btn quiz-option" data-correct="true"
                  data-explain="Confidencialidad = acceso solo para personas autorizadas.">Confidencialidad</button>
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
    ej5: `
      <div class="quiz">
        <div class="quiz-q">Tenés actas con datos confidenciales. ¿Dónde las guardás?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Pendrive sin cifrar</button>
          <button class="btn quiz-option">Carpeta “Descargas” del equipo personal</button>
          <button class="btn quiz-option" data-correct="true"
                  data-explain="Carpeta de red institucional (permisos/backup). En nube, solo cifrada y con controles.">Carpeta de red institucional o nube cifrada con permisos</button>
        </div>
        <div class="badges"><span class="badge badge--ok">Almacenamiento</span></div>
      </div>`
  }
},

2: {
  titulo: "Correo Electrónico Seguro",
  resumen:
    "El correo electrónico es una herramienta esencial para la universidad, pero también uno de los canales preferidos para fraudes y malware. Este módulo enseña cómo reconocer mensajes sospechosos, validar remitentes y dominios reales, evitar la descarga de archivos maliciosos y aplicar buenas prácticas para mantener la seguridad y la privacidad en cada envío y recepción.",
  pdf: null, // 🔹 aún no disponible
  contenidoNarrativo: `
    <p>El <strong>correo electrónico</strong> es una de las herramientas más utilizadas en la universidad para la comunicación oficial y académica. Sin embargo, su diseño original no priorizó la seguridad, por lo que hoy es uno de los vectores más explotados por los atacantes para <strong>robar información</strong>, <strong>infectar dispositivos</strong> y <strong>comprometer cuentas institucionales</strong>.</p>

    <h2>1. Por qué el correo es tan atractivo para los atacantes</h2>
    <p>Los ciberdelincuentes prefieren el correo porque es barato, masivo y permite personalizar ataques (spear phishing). Además, muchas personas confían ciegamente en mensajes que parecen legítimos. A menudo, un solo clic basta para:</p>
    <ul>
      <li>Robar <strong>credenciales</strong> y acceder a sistemas internos.</li>
      <li>Instalar <strong>malware</strong> que roba datos o cifra archivos (ransomware).</li>
      <li>Lanzar campañas de <strong>fraude económico</strong> o desinformación.</li>
    </ul>

    <h2>2. Señales de un correo sospechoso</h2>
    <ul>
      <li><strong>Remitente falso o extraño</strong>: direcciones que imitan dominios oficiales (ej. <code>uncuyo-seguridad-support.com</code> en lugar de <code>uncuyo.edu.ar</code>).</li>
      <li><strong>Asuntos alarmistas o urgentes</strong>: “tu cuenta será desactivada en 2 h”, “pago inmediato”.</li>
      <li><strong>Mensajes impersonales</strong>: “Estimado cliente/usuario”.</li>
      <li><strong>Errores de ortografía y redacción</strong>: comunes en campañas maliciosas.</li>
      <li><strong>Adjuntos peligrosos</strong>: .exe, .vbs, .docm, .xlsm, .zip, .rar.</li>
      <li><strong>Enlaces engañosos</strong>: texto visible que no coincide con el dominio real.</li>
    </ul>

    <h2>3. Tipos de fraudes y ataques más comunes</h2>
    <ul>
      <li><strong>Phishing genérico</strong>: suplantación masiva para robar credenciales o datos personales.</li>
      <li><strong>Spear phishing</strong>: mensajes dirigidos a personas específicas con información personalizada.</li>
      <li><strong>Business Email Compromise (BEC)</strong>: suplantación de jefes o proveedores para transferencias bancarias fraudulentas.</li>
      <li><strong>Scam</strong>: falsas herencias, premios o trabajos para estafar dinero.</li>
      <li><strong>Sextorsión</strong>: chantaje con supuestos videos íntimos (casi siempre falsos).</li>
      <li><strong>Malware y ransomware</strong>: enlaces o adjuntos que instalan software malicioso.</li>
    </ul>

    <h2>4. Buenas prácticas para tu bandeja de entrada</h2>
    <ul>
      <li><strong>Verificá el dominio real</strong>: pasá el mouse sobre el enlace (PC) o copialo en una nota (móvil) para comprobar el dominio principal.</li>
      <li><strong>No confíes en la apariencia</strong>: logos y firmas pueden falsificarse.</li>
      <li><strong>No habilites macros</strong> en documentos de Office sin certeza total.</li>
      <li><strong>Usá CCO</strong> para envíos masivos y proteger direcciones.</li>
      <li><strong>Desactivá la descarga automática de imágenes</strong> para evitar rastreo.</li>
      <li><strong>Confirmá remitentes por otro canal</strong> si el mensaje es extraño (teléfono, Teams, WhatsApp institucional).</li>
      <li><strong>Analizá archivos</strong> con antivirus o VirusTotal antes de abrirlos.</li>
      <li><strong>Revisá la configuración de reenvío automático</strong> en tu cuenta para detectar reglas creadas por atacantes.</li>
    </ul>

    <h2>5. Cómo actuar ante un posible ataque</h2>
    <p>Si recibís un correo sospechoso:</p>
    <ol>
      <li>No hagas clic en enlaces ni abras adjuntos.</li>
      <li>No respondas al remitente.</li>
      <li>Reportá al área de TI o Seguridad reenviando el correo como <em>adjunto</em>.</li>
      <li>Si ya hiciste clic o ingresaste credenciales, cambiá la contraseña de inmediato y activá MFA.</li>
      <li>Escaneá tu equipo y, si hay indicios de infección, desconectalo de la red y avisá a soporte.</li>
    </ol>

    <h2>6. Configuraciones recomendadas</h2>
    <ul>
      <li>Activá <strong>autenticación en dos pasos (2FA)</strong> en tu cuenta institucional.</li>
      <li>Revisá destinatarios antes de enviar para evitar errores.</li>
      <li>Usá gestores de contraseñas para no repetir claves y mantenerlas seguras.</li>
      <li>Deshabilitá la descarga automática de contenido remoto en clientes de correo.</li>
      <li>Configurá <strong>firmas digitales o certificados</strong> para correos oficiales si la institución lo permite.</li>
    </ul>

    <h2>7. Políticas institucionales</h2>
    <p>En la universidad existen políticas de uso seguro del correo. Estas suelen incluir:</p>
    <ul>
      <li>Prohibición de compartir credenciales o reenviar correos sospechosos a terceros.</li>
      <li>Reportar incidentes de inmediato al área de ciberseguridad.</li>
      <li>Uso de cuentas institucionales solo para actividades académicas o laborales.</li>
      <li>Restricciones para configurar reenvíos a cuentas personales sin autorización.</li>
    </ul>

    <h2>8. Riesgos de no seguir estas prácticas</h2>
    <p>No aplicar estas medidas puede llevar a:</p>
    <ul>
      <li>Robo de identidad y acceso no autorizado a sistemas internos.</li>
      <li>Pérdida de información confidencial y datos personales de estudiantes o docentes.</li>
      <li>Instalación de ransomware que paraliza la operación administrativa.</li>
      <li>Compromiso de la reputación institucional y posibles sanciones legales.</li>
    </ul>
  `,

  ejemplos: {
    ej1: `
      <div class="quiz">
        <div class="quiz-q">Recibís “Actualizá tu cuenta” con link <strong>Acceso Cuenta UNCuyo</strong>, pero el dominio real es <code>uncuyo-seguridad-support.com</code>. ¿Qué hacés?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="El texto visible no garantiza el dominio.">Hacer clic igual</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Dominio real ≠ <code>uncuyo.edu.ar</code>. Es phishing. Reportá y borrá.">Reportar como phishing y borrar</button>
          <button class="btn quiz-option" data-explain="No pruebes a ver qué pasa; verificá desde el sitio oficial.">Entrar pero sin poner datos</button>
        </div>
        <div class="badges"><span class="badge badge--danger">Phishing</span><span class="badge badge--warn">Dominio</span></div>
      </div>`,

    ej2: `
      <div class="quiz">
        <div class="quiz-q">Te llega “RRHH” con <code>Planilla_sueldos.zip</code> y urgencia para hoy. ¿Acción correcta?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="La urgencia es un truco típico.">Abrir el ZIP porque parece oficial</button>
          <button class="btn quiz-option" data-explain="Habilitar macros es vector común de malware.">Abrir y habilitar macros si lo pide</button>
          <button class="btn quiz-option" data-correct="true" data-explain="No abrir; validar por canal oficial y analizar con antivirus/VirusTotal.">No abrir; validar por canal oficial y analizar</button>
        </div>
        <div class="badges"><span class="badge badge--danger">Malware</span><span class="badge badge--ok">Validación</span></div>
      </div>`,

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
  titulo: "Contraseñas Seguras",
  resumen:
    "Las contraseñas son la primera barrera de defensa frente a accesos no autorizados. Este módulo explica por qué es esencial que sean fuertes, únicas y bien gestionadas, cómo complementar su seguridad con factores adicionales y cómo actuar ante filtraciones.",
  pdf: null, // 🔹 aún no disponible
  contenidoNarrativo: `
    <p>Las contraseñas son como la cerradura de nuestra vida digital. Aunque parezcan un simple requisito de ingreso, de su fortaleza depende la protección de correos, sistemas académicos, plataformas de gestión y datos personales. Una contraseña débil o repetida puede abrir la puerta a intrusos que buscan robar información o sabotear servicios críticos de la universidad.</p>

    <h2>El verdadero valor de una contraseña fuerte</h2>
    <p>Muchos ataques informáticos no son tan sofisticados como imaginamos. Los ciberdelincuentes suelen comenzar probando combinaciones simples con herramientas automáticas: contraseñas comunes como <em>123456</em>, <em>qwerty</em> o nombres propios aparecen entre los primeros intentos. También aprovechan filtraciones previas; si una contraseña fue expuesta en otra web y la reutilizaste, la probarán en tu correo institucional u otros sistemas.</p>
    <p>Además existen técnicas como la <strong>fuerza bruta</strong> (probar millones de combinaciones), el <strong>ataque de diccionario</strong> (usar listas de palabras y variantes) y el <strong>credential stuffing</strong> (usar contraseñas filtradas de otras plataformas). Todo esto hace que una clave débil pueda caer en segundos.</p>

    <h2>Cómo construir contraseñas robustas</h2>
    <p>La regla de oro es la <strong>longitud</strong>: mientras más larga sea la contraseña, más difícil será descifrarla. Hoy se recomienda un mínimo de 12 a 16 caracteres, pero una frase completa es todavía mejor. Combinar <strong>mayúsculas, minúsculas, números y símbolos</strong> añade entropía y vuelve más costoso el ataque.</p>
    <p>Evita datos personales (nombre, fecha de nacimiento, DNI) y patrones obvios (palabras del teclado, fechas importantes). Una buena estrategia son las <strong>frases de paso</strong>, como: <code>ElCactus_Baila+en2025!</code>. Son fáciles de recordar y muy difíciles de adivinar.</p>

    <h2>No compartir ni anotar claves</h2>
    <p>Tu contraseña es personal e intransferible. Compartirla, enviarla por chat o dejarla anotada en un papel visible puede implicar que acciones maliciosas aparezcan como si las hubieras hecho vos. Si un equipo necesita acceso compartido, existen <strong>cofres seguros dentro de gestores de contraseñas</strong> que permiten administrar claves sin divulgarlas.</p>

    <h2>El peligro de reutilizar contraseñas</h2>
    <p>Usar la misma clave en varios servicios es como tener una llave que abre todas las puertas: basta que un sitio se vea comprometido para que los atacantes entren a todo lo demás. Si alguna vez te avisan que una plataforma sufrió una filtración, cambiá tu contraseña en todos los lugares donde la hayas usado y activá MFA.</p>

    <h2>Autenticación multifactor: un refuerzo esencial</h2>
    <p>Incluso la mejor contraseña puede ser robada mediante phishing. Por eso se recomienda añadir un <strong>segundo factor de autenticación</strong> (MFA). Una app de códigos temporales (TOTP) como Google Authenticator o una llave física FIDO/U2F es mucho más segura que depender sólo de SMS. Los mensajes de texto son vulnerables a robo de SIM y redirecciones. Guardá tus <strong>códigos de recuperación</strong> en un lugar seguro (no en tu correo electrónico).</p>

    <h2>Gestores de contraseñas: aliados imprescindibles</h2>
    <p>Recordar docenas de contraseñas complejas es imposible sin ayuda. Un <strong>gestor de contraseñas</strong> (como Bitwarden, KeePassXC o 1Password) guarda todas tus claves de forma cifrada y puede generar contraseñas aleatorias muy fuertes. Solo necesitás una contraseña maestra, que debe ser extremadamente sólida y complementarse con MFA. Además, estos gestores suelen avisarte si alguna de tus claves aparece en filtraciones conocidas.</p>

    <h2>Qué hacer ante una filtración</h2>
    <p>Si sospechás que tu contraseña fue comprometida: cambiála inmediatamente, activá MFA si no lo tenías, cerrá todas las sesiones abiertas y revisá si tu cuenta tiene reglas de reenvío sospechosas. Sitios como <a href="https://haveibeenpwned.com/" target="_blank">Have I Been Pwned</a> pueden ayudarte a saber si tu correo apareció en alguna filtración.</p>

    <h2>Políticas recomendadas</h2>
    <p>Las organizaciones modernas recomiendan evitar cambios de contraseña periódicos sin motivo; lo importante es <strong>rotar solo si hay riesgo o evidencia de compromiso</strong>. Lo esencial es que sean largas, únicas y estén protegidas con MFA. También se aconseja bloquear cuentas tras múltiples intentos fallidos y avisar al usuario ante accesos sospechosos.</p>
  `,

  ejemplos: {
    ej1: `
      <div class="quiz">
        <div class="quiz-q">¿Cuál de estas contraseñas es la más robusta?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Incluye nombre y año: patrón previsible y fácil de adivinar.">M@teo2024</button>
          <button class="btn quiz-option" data-explain="Es aleatoria, pero corta (8). Mejor 12–16+ o frase.">Ls!r72qP</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Frase larga con palabras no relacionadas, símbolos y espacios → alta entropía.">Cactus-cielo_caracol 19!</button>
        </div>
        <div class="badges"><span class="badge badge--ok">Robustez</span><span class="badge badge--warn">Frases largas</span></div>
      </div>`,
    ej2: `
      <div class="quiz">
        <div class="quiz-q">Usaste la misma contraseña en tu correo institucional y en un campus virtual. Te llega alerta de filtración del campus. ¿Qué hacés?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Ignorar aumenta el riesgo: si ya la tienen, probarán en otros servicios.">No hago nada</button>
          <button class="btn quiz-option" data-explain="Si reutilizaste, cambiar solo uno deja el otro expuesto.">Cambio la del campus y listo</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Cambiá en ambos, activá MFA, cerrá sesiones abiertas y revisá reenvíos sospechosos.">Cambio ambas, activo MFA y reviso sesiones</button>
        </div>
        <div class="badges"><span class="badge badge--danger">No reutilizar</span><span class="badge badge--ok">Respuesta a incidentes</span></div>
      </div>`,
    ej3: `
      <div class="quiz">
        <div class="quiz-q">¿Qué opción de segundo factor (MFA) es MÁS recomendable?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Mejor que nada, pero vulnerable a SIM swapping y desvíos.">Código por SMS</button>
          <button class="btn quiz-option" data-correct="true" data-explain="App autenticadora (TOTP) o llave física FIDO2/U2F → más resistente a phishing y robo de SIM.">App autenticadora o llave física</button>
          <button class="btn quiz-option" data-explain="El correo puede estar comprometido; no es un canal robusto para MFA.">Código enviado por e-mail</button>
        </div>
        <div class="badges"><span class="badge badge--ok">MFA</span><span class="badge badge--warn">Buenas prácticas</span></div>
      </div>`
  }
},

4: {
  titulo: "Puesto de Trabajo Seguro",
  resumen:
    "El lugar donde trabajamos —nuestro escritorio físico y digital— puede ser una puerta de entrada para fugas de información o malware. Este módulo explica cómo protegerlo, desde el orden físico y el bloqueo de la pantalla hasta el software actualizado, el uso responsable de Internet y la gestión segura de dispositivos externos.",
  pdf: null, // 🔹 aún no disponible
  contenidoNarrativo: `
    <p>Un puesto de trabajo desordenado, con documentos a la vista y un equipo sin protección, es un blanco fácil para ataques internos y externos. En oficinas y aulas circulan muchas personas y cualquier descuido puede permitir el acceso a información sensible. Mantener el espacio físico y digital seguro no solo te protege a vos: resguarda los datos y servicios de toda la universidad.</p>

    <h2>La importancia de una “mesa limpia”</h2>
    <p>El concepto de <strong>mesa limpia</strong> implica que al finalizar tu jornada no quede información sensible sobre el escritorio: papeles, notas con contraseñas, dispositivos externos. Guardar documentación bajo llave y retirar impresiones olvidadas de la fotocopiadora o impresora evita que terceros puedan acceder a datos personales o académicos.</p>

    <h2>Bloqueo de sesión cada vez que te alejás</h2>
    <p>Un equipo desbloqueado es una invitación abierta a cualquiera que pase. Aunque te ausentes solo unos minutos, bloqueá tu sesión con:</p>
    <ul>
      <li><kbd>Win + L</kbd> en Windows</li>
      <li><kbd>Ctrl + ⌥ + Q</kbd> en macOS</li>
      <li><kbd>Ctrl + Alt + L</kbd> en Linux</li>
    </ul>
    <p>Configura también el <strong>bloqueo automático por inactividad</strong> y usa PIN o biometría en dispositivos móviles. Si el equipo queda expuesto por la noche, apágalo y guárdalo en un lugar seguro.</p>

    <h2>Software actualizado, antivirus y firewall</h2>
    <p>Los atacantes suelen explotar vulnerabilidades conocidas en sistemas desactualizados. Mantener el sistema operativo y las aplicaciones al día es esencial para cerrar puertas a malware y ransomware. Además, el <strong>antivirus y el firewall</strong> deben estar siempre activos y actualizados. Evitá la tentación de desactivarlos “porque ralentizan” el equipo: el costo de una infección supera con creces cualquier demora.</p>

    <h2>Uso responsable de Internet y recursos</h2>
    <p>El acceso institucional debe destinarse a fines académicos y laborales. Navegar en sitios de descargas ilegales, apuestas o contenido adulto no solo compromete la reputación, sino que expone a malware y phishing. Tampoco instales software no autorizado ni alteres configuraciones críticas sin consultar al área de TI.</p>

    <h2>Software legítimo</h2>
    <p>Instalar programas piratas o cracks es abrir la puerta a adware, spyware y puertas traseras. Siempre descargá software desde sitios oficiales o tiendas reconocidas, y si necesitás una herramienta específica, pedí ayuda a soporte técnico.</p>

    <h2>Dispositivos externos y USB</h2>
    <p>Los pendrives y discos externos son una de las vías más comunes para introducir malware. Nunca conectes dispositivos desconocidos, aunque parezcan inofensivos. Si necesitás transportar datos sensibles, <strong>cifralos</strong> y, en caso de pérdida, informá inmediatamente. Antes de desechar un dispositivo, realizá un <strong>borrado seguro</strong> o solicitá destrucción certificada.</p>

    <h2>Confidencialidad y respuesta rápida ante incidentes</h2>
    <p>En entornos con datos sensibles se recomienda firmar <strong>acuerdos de confidencialidad</strong> y comprender su alcance. Ante cualquier sospecha de incidente —desde malware hasta robo de información— no intentes resolverlo por tu cuenta: desconectá el equipo de la red y avisá inmediatamente al área de seguridad informática. Actuar rápido puede limitar el daño y evitar que el incidente se propague.</p>

    <h2>Entorno físico seguro</h2>
    <p>No dejes laptops ni dispositivos móviles sin supervisión en espacios compartidos. Usá <strong>candados de seguridad</strong> si tu equipo queda expuesto y asegurate de controlar quién tiene acceso físico a tu oficina. La seguridad empieza con las pequeñas decisiones cotidianas.</p>
  `,

  ejemplos: {
    ej1: `
      <div class="quiz">
        <div class="quiz-q">Tenés que levantarte 5 minutos del puesto. ¿Qué corresponde hacer?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Equipo desbloqueado = riesgo de acceso/robo de info.">Irme sin bloquear, total es un momento</button>
          <button class="btn quiz-option" data-explain="Tapar la pantalla no impide uso del teclado/ratón.">Poner un papel tapando el monitor</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Bloqueá (Win+L / Ctrl+⌥+Q / Ctrl+Alt+L) y guardá documentos sensibles.">Bloquear la sesión y guardar documentos</button>
        </div>
        <div class="badges"><span class="badge badge--ok">Mesa limpia</span><span class="badge badge--ok">Bloqueo</span></div>
      </div>`,
    ej2: `
      <div class="quiz">
        <div class="quiz-q">Encontrás un pendrive en un aula con etiqueta “Actas”. ¿Qué hacés?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Puede ejecutar malware o filtrar datos.">Lo conecto para ver de quién es</button>
          <button class="btn quiz-option" data-explain="En tu equipo personal también es riesgoso.">Lo conecto en mi equipo personal</button>
          <button class="btn quiz-option" data-correct="true" data-explain="No lo conectes. Entregalo a Soporte/Seguridad para tratamiento seguro.">No conectar; derivar a Soporte/Informática</button>
        </div>
        <div class="badges"><span class="badge badge--danger">USB desconocido</span><span class="badge badge--ok">Canal oficial</span></div>
      </div>`,
    ej3: `
      <div class="quiz">
        <div class="quiz-q">Aparece un pop-up: “Tu reproductor está desactualizado. Descargá este <em>codec</em>”. ¿Cómo procedés?</div>
        <div class="quiz-options">
          <button class="btn quiz-option" data-explain="Vector típico de adware/malware.">Descargo e instalo desde esa ventana</button>
          <button class="btn quiz-option" data-explain="No actualizar nunca deja vulnerabilidades sin parche.">Ignoro siempre las actualizaciones</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Cerrá el pop-up. Si necesitás actualizar, hacelo desde tienda/sitio oficial o pedilo a Soporte.">Actualizar sólo desde tienda/sitio oficial</button>
        </div>
        <div class="badges"><span class="badge badge--ok">Software legítimo</span><span class="badge badge--warn">Evitar pop-ups</span></div>
      </div>`,
    ej4: `
      <div class="quiz">
        <div class="quiz-q">Al pasar por la impresora ves listados con DNI olvidados. ¿Qué hacés?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Los dejo, no son míos</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Retiralos y avisá/entregá al responsable o a Soporte; evitás exposición de datos.">Retirarlos y avisar/entregar al responsable</button>
          <button class="btn quiz-option">Les saco foto por si alguien los reclama</button>
        </div>
        <div class="badges"><span class="badge badge--ok">Custodia</span><span class="badge badge--warn">Evitar exposición</span></div>
      </div>`,
    ej5: `
      <div class="quiz">
        <div class="quiz-q">Tu PC está lento y pensás desactivar el antivirus y el firewall. ¿Qué corresponde?</div>
        <div class="quiz-options">
          <button class="btn quiz-option">Desactivarlos “un rato” para que rinda</button>
          <button class="btn quiz-option" data-correct="true" data-explain="Nunca desactives protección. Pedí a Soporte revisión/optimización y mantené todo actualizado.">Mantenerlos activos y pedir soporte</button>
          <button class="btn quiz-option">Desactivar el firewall pero dejar el antivirus</button>
        </div>
        <div class="badges"><span class="badge badge--ok">Protección activa</span><span class="badge badge--warn">Soporte</span></div>
      </div>`
  }
},

5: {
  titulo: "Dispositivos Móviles Seguros",
  resumen:
    "Los dispositivos móviles permiten estudiar y trabajar desde cualquier lugar, pero también son blancos fáciles para robo, malware y espionaje. Este módulo enseña cómo protegerlos con bloqueo y cifrado, apps seguras y actualizadas, gestión correcta de contraseñas y redes, y qué hacer ante pérdida o robo.",
  pdf: null, // 🔹 aún no disponible
  contenidoNarrativo: `
    <p>Celulares, tablets y portátiles son herramientas clave para acceder a correo, sistemas académicos y documentos en todo momento. Su movilidad es una ventaja enorme, pero también abre la puerta a riesgos importantes: basta un descuido para que un atacante robe información o controle el dispositivo.</p>

    <h2>Riesgos frecuentes en movilidad</h2>
    <p>El incidente más común es la <strong>pérdida o el robo</strong> del equipo. Si no está cifrado ni protegido con bloqueo seguro, cualquiera podría acceder a correos, documentos y cuentas guardadas. Otro riesgo creciente es el <strong>malware móvil</strong>: aplicaciones que espían conversaciones, capturan contraseñas o muestran publicidad invasiva. Los <strong>ataques de phishing</strong> también están diseñados para pantallas pequeñas, donde es fácil no notar una URL sospechosa.</p>
    <p>Las <strong>redes Wi-Fi abiertas</strong> —cafeterías, aeropuertos, hoteles— permiten que un atacante intercepte tráfico, robe sesiones o monte portales falsos para obtener credenciales. Además, muchas apps piden <strong>permisos excesivos</strong>: acceso a SMS, micrófono, cámara o contactos sin una justificación real. Y el <em>root</em> o <em>jailbreak</em> elimina protecciones críticas, dejando al dispositivo sin defensas frente a malware.</p>

    <h2>Protección esencial: bloqueo y cifrado</h2>
    <p>Activá un <strong>bloqueo de pantalla robusto</strong>: PIN largo, contraseña alfanumérica o biometría confiable (huella/rostro). Evitá patrones simples y deslizamientos sin clave. Comprobá que el <strong>cifrado completo</strong> esté habilitado: en Android desde “Seguridad > Cifrado”, en iOS es automático, y en portátiles activá BitLocker (Windows) o FileVault (macOS). Un dispositivo cifrado impide que un atacante lea datos sin tu clave.</p>

    <h2>Software y apps de confianza</h2>
    <p>Mantené el <strong>sistema operativo y las aplicaciones actualizadas</strong>; activá actualizaciones automáticas cuando sea posible. Instalá apps solo desde tiendas oficiales y revisá los permisos: una app de linterna no necesita tu lista de contactos ni SMS. Desconfiá de APK descargadas de blogs o sitios no verificados. Un <strong>antimalware confiable</strong> ayuda a bloquear phishing, sitios maliciosos y aplicaciones peligrosas.</p>

    <h2>Contraseñas y gestores</h2>
    <p>No uses la función de “recordar contraseñas” del navegador si no está protegida por clave maestra. Preferí un <strong>gestor de contraseñas</strong> que guarde de forma cifrada y sincronizada tus credenciales. Configurá <strong>MFA (doble factor)</strong> en servicios críticos y guarda los códigos de recuperación en un lugar seguro.</p>

    <h2>Redes Wi-Fi y VPN</h2>
    <p>Usar <strong>Wi-Fi pública sin protección</strong> es un riesgo serio: un atacante puede interceptar tus datos (ataques MITM). Si debés conectarte, hacelo solo mediante una <strong>VPN institucional</strong> o preferí usar <strong>datos móviles</strong>. En casa, protegé tu red con <strong>WPA2/WPA3, contraseña fuerte, WPS desactivado y firmware del router actualizado</strong>. Evitá compartir tu clave doméstica con terceros.</p>

    <h2>BYOD (Bring Your Own Device) con responsabilidad</h2>
    <p>Usar el dispositivo personal para trabajar o estudiar es cómodo, pero mezcla datos y responsabilidades. Seguí las <strong>políticas de la institución</strong>, mantené un perfil de trabajo separado si es posible y nunca prestes el equipo a terceros. Evitá el <em>root</em>/<em>jailbreak</em> y mantené controles de acceso activos.</p>

    <h2>Qué hacer ante pérdida o robo</h2>
    <p>Actuá de inmediato: <strong>bloqueá y localizá</strong> el equipo desde servicios como “Buscar mi iPhone” o “Encontrar mi dispositivo”. Si no podés recuperarlo, hacé un <strong>borrado remoto</strong>. Cambiá contraseñas críticas (correo institucional, gestores de contraseñas, banca) y cerrá sesiones abiertas. Avisá al área de TI o ciberseguridad de tu institución y realizá denuncia policial si corresponde.</p>

    <h2>Extra: copias de seguridad y datos sensibles</h2>
    <p>Mantené <strong>copias de seguridad cifradas</strong> de la información importante. Así, si el equipo se pierde o sufre ransomware, podés recuperar tu contenido. Guardá documentos sensibles solo si es imprescindible y eliminá archivos temporales que ya no necesites.</p>
  `,
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
  titulo: "Redes Sociales Seguras",
  resumen:
    "Las redes sociales son una herramienta poderosa para comunicar y fortalecer la imagen institucional, pero un mal uso o un ataque puede dañar la reputación y comprometer datos. Este módulo explica cómo gestionarlas con seguridad y responsabilidad.",
  pdf: null, // 🔹 aún no disponible
  contenidoNarrativo: `
    <p>Facebook, Instagram, X y LinkedIn son canales vitales para la universidad: informan, atraen estudiantes y construyen reputación. Sin embargo, también son un objetivo frecuente para atacantes y pueden volverse un problema si se administran sin políticas claras. Un comentario impulsivo, un enlace malicioso o una filtración puede viralizarse en minutos y dañar la imagen institucional.</p>

    <h2>Gobernanza y control de cuentas</h2>
    <p>Es fundamental definir <strong>quién administra cada cuenta</strong>, qué roles existen (propietario, editor, moderador) y cómo se aprueba el contenido antes de publicarlo. Nunca uses una sola contraseña compartida entre varios. Preferí accesos nominativos y, cuando la plataforma lo permita, configurá <strong>roles oficiales</strong> para cada usuario.</p>
    <p>Revisá periódicamente las <strong>aplicaciones de terceros conectadas</strong> (programadores de posts, herramientas de análisis) y revocá las que ya no uses. Cada integración extra es un punto de riesgo.</p>

    <h2>Acceso seguro: contraseñas fuertes y 2FA</h2>
    <p>Una cuenta institucional robada puede publicar mensajes falsos o distribuir malware. Protegela con una <strong>contraseña robusta y única</strong>, guardada en un gestor seguro, y activá siempre la <strong>autenticación en dos pasos</strong> (TOTP o llaves físicas). Evitá SMS como único segundo factor cuando sea posible, ya que pueden ser vulnerables a ataques de SIM swapping.</p>

    <h2>Privacidad y segmentación de audiencias</h2>
    <p>Antes de publicar, revisá quién puede ver el contenido. Algunas plataformas permiten <strong>listas o públicos personalizados</strong> para evitar que información interna llegue a todos. Pensá que todo lo que publiques puede ser capturado, recortado y difundido fuera de contexto, incluso si lo borrás luego.</p>

    <h2>Fraudes y suplantación de identidad</h2>
    <p>Los <strong>perfiles falsos</strong> que imitan a la universidad (typosquatting: “UNCuy0” con cero en vez de “O”) buscan engañar a estudiantes y pedir datos o pagos. También circulan <strong>mensajes de phishing</strong> con enlaces acortados que llevan a sitios falsos. Ante la mínima duda, <strong>no hagas clic</strong>, validá con los canales oficiales y reportá el perfil falso.</p>

    <h2>Enlaces y archivos adjuntos</h2>
    <p>Cualquier archivo recibido por mensaje privado puede contener malware. Analizalo antes con antivirus o herramientas como VirusTotal. Los enlaces acortados ocultan su destino real; usá servicios para previsualizarlos o accedé a la información desde la web oficial directamente.</p>

    <h2>Conducta profesional y reputación</h2>
    <p>Las redes son una extensión de la imagen institucional. Mantené un <strong>tono profesional y respetuoso</strong> al responder comentarios, incluso ante críticas. Evitá discusiones personales, publicar datos internos o información que pueda ser malinterpretada. Antes de compartir, verificá fuentes y asegurate de no difundir noticias falsas.</p>

    <h2>Gestión de incidentes</h2>
    <p>Si una cuenta es hackeada, actuá rápido: cambiá la contraseña, revocá accesos sospechosos, activá 2FA si no estaba habilitado y notificá públicamente que la cuenta fue comprometida para evitar engaños a los seguidores. Documentá lo sucedido para mejorar políticas y prevenir futuros incidentes.</p>

    <h2>Extra: monitoreo y auditoría</h2>
    <p>Implementá <strong>monitoreo de menciones y actividad</strong> para detectar intentos de suplantación o publicaciones no autorizadas. Guardá registros de quién accedió y qué cambios realizó para tener trazabilidad ante un incidente.</p>
  `,

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
  titulo: "Uso Responsable de la Inteligencia Artificial",
  resumen:
    "La Inteligencia Artificial automatiza tareas, optimiza decisiones y mejora la productividad. Puede beneficiar la experiencia educativa y el bienestar laboral, pero también implica riesgos: dependencia, sesgos, errores, filtración de datos y problemas de privacidad y seguridad. Su uso debe ser ético, con límites claros, capacitación y controles adecuados.",
  pdf: null, // 🔹 aún no disponible
  puntos: [
    { titulo: "Definición", texto: "Rama de la informática que simula la inteligencia humana." },
    { titulo: "Utilización", texto: "Automatiza, optimiza procesos y complementa tareas." },
    { titulo: "Bienestar laboral", texto: "Mejora seguridad y salud en el trabajo." },
    { titulo: "Vulnerabilidades", texto: "Carga de datos sensibles, ciberataques y manipulación de modelos." },
    { titulo: "Riesgos", texto: "Dependencia, sesgos, privacidad y errores." },
    { titulo: "Prevención", texto: "Límites claros, gestión de accesos, monitoreo y capacitación." }
  ],

  contenidoNarrativo: `
    <p>La <strong>Inteligencia Artificial (IA)</strong> es una rama de la informática dedicada a crear sistemas capaces de realizar tareas que normalmente requieren inteligencia humana, como aprender, razonar, analizar información, identificar patrones y tomar decisiones. Hoy la IA está presente en asistentes virtuales, buscadores, generación de contenido, detección de amenazas y automatización de procesos en casi todos los sectores.</p>

    <h2>¿Por qué es relevante?</h2>
    <p>La IA <strong>aumenta la productividad</strong> al reducir el trabajo repetitivo y mejorar la toma de decisiones. En universidades ayuda a analizar grandes volúmenes de datos, responder consultas de estudiantes, recomendar contenidos y optimizar procesos administrativos. En el ámbito laboral libera tiempo para tareas estratégicas y mejora la seguridad mediante análisis predictivos de amenazas.</p>

    <h2>Principales usos en educación y trabajo</h2>
    <ul>
      <li>Chatbots y asistentes para responder preguntas frecuentes.</li>
      <li>Corrección automática y análisis de desempeño estudiantil.</li>
      <li>Clasificación de documentos y análisis de datos administrativos.</li>
      <li>Generación de reportes, resúmenes y material de apoyo.</li>
      <li>Herramientas de ciberseguridad con IA para detectar amenazas.</li>
    </ul>
    <p>Sin embargo, estos usos requieren <strong>vigilancia humana constante</strong> para asegurar que la IA no produzca información incorrecta o sesgada.</p>

    <h2>Impacto en el bienestar laboral</h2>
    <p>La IA puede mejorar la seguridad y la salud en el trabajo, reduciendo la carga de tareas repetitivas y ayudando a identificar riesgos antes de que ocurran. También permite trabajar con mayor flexibilidad. Sin embargo, una vigilancia excesiva o decisiones automatizadas sin transparencia pueden generar estrés, sensación de control permanente y pérdida de confianza.</p>

    <h2>Vulnerabilidades y riesgos principales</h2>
    <p>Su uso no está exento de riesgos importantes:</p>
    <ul>
      <li><strong>Filtración de datos:</strong> subir información confidencial a IA públicas puede exponerla sin control.</li>
      <li><strong>Sesgos en resultados:</strong> la IA aprende de datos existentes y puede perpetuar prejuicios o errores históricos.</li>
      <li><strong>Dependencia excesiva:</strong> delegar decisiones clave sin supervisión humana puede ser costoso y peligroso.</li>
      <li><strong>Alucinaciones o errores:</strong> la IA puede generar contenido falso con apariencia confiable.</li>
      <li><strong>Ciberataques:</strong> actores maliciosos pueden manipular modelos para generar resultados engañosos.</li>
      <li><strong>Privacidad y cumplimiento legal:</strong> el uso indebido puede violar la Ley 25.326 de Protección de Datos Personales en Argentina u otras normativas de privacidad.</li>
    </ul>

    <h2>Uso ético y cumplimiento normativo</h2>
    <p>El uso responsable de IA implica respetar la privacidad de las personas, proteger información sensible y garantizar la transparencia en los procesos. Si una herramienta de IA interactúa con estudiantes o personal, es importante <strong>informar que se trata de un sistema automatizado</strong> y explicar sus limitaciones.</p>
    <p>Siempre revisá los términos de servicio y las políticas de datos de la plataforma. Nunca subas contraseñas, información personal identificable ni datos institucionales críticos a sistemas que no tengan garantías claras de seguridad.</p>

    <h2>Buenas prácticas para un uso seguro</h2>
    <ul>
      <li>Definí <strong>qué datos están permitidos</strong> y cuáles jamás deben cargarse en sistemas externos.</li>
      <li>Activá <strong>autenticación multifactor</strong> en herramientas que utilicen IA para proteger accesos.</li>
      <li>Usá <strong>cuentas institucionales</strong> para evitar mezclar información personal con la de la universidad.</li>
      <li>Mantené un <strong>monitoreo y registro</strong> de las interacciones con IA, para detectar abusos o fugas.</li>
      <li>Capacitá a los usuarios para entender cómo funciona la IA y sus limitaciones.</li>
      <li>Revisá críticamente todos los resultados antes de publicarlos o tomarlos como definitivos.</li>
      <li>Establecé un <strong>plan de respuesta</strong> para incidentes (errores críticos, filtración de datos, contenido inapropiado).</li>
    </ul>

    <h2>IA generativa y reputación institucional</h2>
    <p>Los modelos que crean texto, imágenes o código pueden producir resultados sesgados, incorrectos o que infringen derechos de autor. Antes de publicar material generado con IA, <strong>revisá la exactitud y adecuación del contenido</strong>. Difundir información errónea puede afectar la credibilidad y la imagen de la universidad o la organización.</p>

    <h2>Supervisión humana: clave para el éxito</h2>
    <p>La IA debe complementar, no reemplazar, la toma de decisiones humanas. Mantener el juicio crítico, revisar datos y resultados, y usar la experiencia profesional para interpretar lo que la IA genera es fundamental para prevenir errores y asegurar un uso ético y seguro.</p>
  `,

  ejemplos: {
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

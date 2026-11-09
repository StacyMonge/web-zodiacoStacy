
/* JavaScript Document
   Cierre automático de sesión después de
   3 minutos sin actividad del usuario
*/

const tiempoLimite = 3 * 60 * 1000;
const claveActividad = "ultimaActividadZodiaco";

let temporizadorInactividad = null;
let cerrandoSesion = false;
let sesionActiva = false;

// Cerrar sesión por inactividad
async function cerrarPorInactividad() {

    if (cerrandoSesion || !sesionActiva) {
        return;
    }

    cerrandoSesion = true;
    clearTimeout(temporizadorInactividad);

    try {

        await firebase.auth().signOut();

    } catch (error) {

        console.error("Error al cerrar sesión:", error);

    }

    sessionStorage.removeItem(claveActividad);

    alert("Tu sesión se cerró por 3 minutos de inactividad.");

    window.location.replace("login.html");
}

// Verificar el tiempo transcurrido
function verificarInactividad() {

    if (cerrandoSesion || !sesionActiva) {
        return;
    }

    const ultimaActividad = Number(
        sessionStorage.getItem(claveActividad)
    );

    if (
        ultimaActividad &&
        Date.now() - ultimaActividad >= tiempoLimite
    ) {

        cerrarPorInactividad();
        return;

    }

    clearTimeout(temporizadorInactividad);

    const tiempoRestante = ultimaActividad
        ? Math.max(
            0,
            tiempoLimite - (Date.now() - ultimaActividad)
        )
        : tiempoLimite;

    temporizadorInactividad = setTimeout(
        verificarInactividad,
        tiempoRestante
    );
}

// Registrar actividad del usuario
function registrarActividad() {

    if (cerrandoSesion || !sesionActiva) {
        return;
    }

    sessionStorage.setItem(
        claveActividad,
        Date.now().toString()
    );

    verificarInactividad();
}

// Detectar actividad del usuario
[
    "mousemove",
    "mousedown",
    "keydown",
    "touchstart",
    "scroll"
].forEach(function (evento) {

    window.addEventListener(
        evento,
        registrarActividad,
        { passive: true }
    );

});

// Revisar al regresar a la pestaña
document.addEventListener("visibilitychange", function () {

    if (!document.hidden) {
        verificarInactividad();
    }

});

// Revisar al enfocar la ventana
window.addEventListener("focus", verificarInactividad);

// Esperar a que Firebase esté inicializado
function iniciarControlInactividad() {

    if (
        typeof firebase === "undefined" ||
        firebase.apps.length === 0
    ) {

        console.error(
            "Firebase todavía no está inicializado."
        );

        return;
    }

    firebase.auth().onAuthStateChanged(function (usuario) {

        if (!usuario) {

            sesionActiva = false;
            clearTimeout(temporizadorInactividad);
            sessionStorage.removeItem(claveActividad);
            return;

        }

        sesionActiva = true;

        const ultimaActividad = Number(
            sessionStorage.getItem(claveActividad)
        );

        if (!ultimaActividad) {

            registrarActividad();

        } else {

            verificarInactividad();

        }

    });

}

// Iniciar después de cargar la página
window.addEventListener("load", iniciarControlInactividad);

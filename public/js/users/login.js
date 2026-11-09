
/* JavaScript Document
   Autenticación de usuarios con Firebase
   Actualización del último acceso
   Reinicio del contador de inactividad
*/

const authLogin = firebase.auth();
const dbLogin = firebase.firestore();

// Iniciar sesión
async function iniciarSesion() {

    const correo = document.getElementById("txtEmail").value.trim();
    const clave = document.getElementById("txtContra").value;

    if (correo === "" || clave === "") {
        alert("Debe ingresar su correo y contraseña.");
        return;
    }

    try {

        // Autenticar usuario en Firebase
        const resultado = await authLogin.signInWithEmailAndPassword(
            correo,
            clave
        );

        const usuario = resultado.user;

        // Actualizar la fecha del último acceso
        try {

            const consulta = await dbLogin
                .collection("datosUsuarios")
                .where("idemp", "==", usuario.uid)
                .get();

            if (!consulta.empty) {

                const actualizaciones = consulta.docs.map(function (doc) {

                    return doc.ref.update({
                        ultAcceso: firebase.firestore.FieldValue.serverTimestamp()
                    });

                });

                await Promise.all(actualizaciones);

            } else {

                console.warn(
                    "No se encontró el registro del usuario en Firestore."
                );

            }

        } catch (errorFirestore) {

            console.error(
                "Error al actualizar el último acceso:",
                errorFirestore
            );

        }

        // Reiniciar contador de inactividad
        sessionStorage.setItem(
            "ultimaActividadZodiaco",
            Date.now().toString()
        );

        // Ir a la página principal
        window.location.replace("index.html");

    } catch (error) {

        console.error("Error al iniciar sesión:", error);

        switch (error.code) {

            case "auth/invalid-email":
                alert("El correo electrónico no es válido.");
                break;

            case "auth/invalid-credential":
            case "auth/wrong-password":
            case "auth/user-not-found":
                alert("Correo o contraseña incorrectos.");
                break;

            case "auth/too-many-requests":
                alert("Demasiados intentos. Intente más tarde.");
                break;

            default:
                alert("No se pudo iniciar sesión.");
                break;

        }
    }
}

// Conectar el botón de autenticación
document.addEventListener("DOMContentLoaded", function () {

    const boton = document.getElementById("btnLogin");

    if (boton) {

        boton.addEventListener("click", function () {
            iniciarSesion();
        });

    }

});

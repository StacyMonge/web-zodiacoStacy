
// JavaScript Document
// Registro de usuarios con fecha de creación y último acceso

var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();

// Campos del formulario
const txtNombre = document.querySelector('#txtNombre');
const txtEmail = document.querySelector('#txtEmail');
const txtContra = document.querySelector('#txtContra');
const txtFechaCreacion = document.querySelector('#txtFechaCreacion');
const btnInsUser = document.querySelector('#btnInsUser');

// Mostrar la fecha y hora actual en el formulario
function mostrarFechaCreacion() {
    const ahora = new Date();
    const fechaLocal = new Date(
        ahora.getTime() - ahora.getTimezoneOffset() * 60000
    );

    txtFechaCreacion.value = fechaLocal.toISOString().slice(0, 16);
}

mostrarFechaCreacion();

// Registrar nuevo usuario
btnInsUser.addEventListener('click', async function () {
    const nombre = txtNombre.value.trim();
    const email = txtEmail.value.trim();
    const contrasena = txtContra.value;

    if (!nombre || !email || !contrasena) {
        alert('Debe completar todos los campos');
        return;
    }

    btnInsUser.disabled = true;

    try {
        // Crear usuario en Firebase Authentication
        const userCredential =
            await auth.createUserWithEmailAndPassword(email, contrasena);

        const user = userCredential.user;

        // Fecha real de creación de la cuenta
        const fechaCreacion =
            firebase.firestore.FieldValue.serverTimestamp();

        // Guardar información en Firestore
        await db.collection('datosUsuarios').add({
            idemp: user.uid,
            usuario: nombre,
            email: user.email,
            fechaCreacion: fechaCreacion,
            ultAcceso: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert('Usuario agregado satisfactoriamente');
        limpiar();

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario: ' + error.message);

    } finally {
        btnInsUser.disabled = false;
    }
});

// Limpiar formulario
function limpiar() {
    txtNombre.value = '';
    txtEmail.value = '';
    txtContra.value = '';
    mostrarFechaCreacion();
    txtNombre.focus();
}

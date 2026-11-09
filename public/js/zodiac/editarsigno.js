
/* JavaScript Document
   Editar signos zodiacales en Firebase Firestore
*/

var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();

// Obtener el ID del signo desde la URL
const parametros = new URLSearchParams(window.location.search);
const idSigno = parametros.get('id');

// Elementos del formulario
const formulario = document.querySelector('#formEditar');
const mensajeEstado = document.querySelector('#mensajeEstado');

const txtPosic = document.querySelector('#txtPosic');
const txtSigno = document.querySelector('#txtSigno');
const txtRango = document.querySelector('#txtRango');
const txtElemento = document.querySelector('#txtElemento');
const txtAstro = document.querySelector('#txtAstro');
const txtPiedra = document.querySelector('#txtPiedra');
const txtUrl = document.querySelector('#txtUrl');

const imagenActual = document.querySelector('#imagenActual');
const btnGuardar = document.querySelector('#btnGuardar');

// Mostrar mensajes
function mostrarMensaje(texto, tipo = 'info') {
    mensajeEstado.textContent = texto;
    mensajeEstado.className = 'alert alert-' + tipo;
    mensajeEstado.classList.remove('d-none');
}

// Recuperar los datos del signo
async function cargarSigno() {

    if (!idSigno) {
        mostrarMensaje(
            'No se ha seleccionado ningún signo zodiacal.',
            'warning'
        );
        return;
    }

    try {
        const documento = await db
            .collection('datosZodiaco')
            .doc(idSigno)
            .get();

        if (!documento.exists) {
            mostrarMensaje(
                'El signo zodiacal no existe.',
                'warning'
            );
            return;
        }

        const datos = documento.data();

        // Mostrar los datos existentes
        txtPosic.value = datos.posic ?? '';
        txtSigno.value = datos.signo ?? '';
        txtRango.value = datos.rango ?? '';

        txtElemento.value = datos.elemento ?? '';
        txtAstro.value = datos.astro ?? '';
        txtPiedra.value = datos.piedra ?? '';

        txtUrl.value = datos.url ?? '';
        imagenActual.src = datos.url ?? '';

        // Mostrar el formulario
        formulario.classList.remove('d-none');
        mensajeEstado.classList.add('d-none');

    } catch (error) {
        console.error('Error al cargar el signo:', error);

        mostrarMensaje(
            'Error al recuperar el signo: ' + error.message,
            'danger'
        );
    }
}

// Actualizar vista previa de la imagen
txtUrl.addEventListener('input', function () {
    imagenActual.src = txtUrl.value.trim();
});

// Guardar cambios
formulario.addEventListener('submit', async function (evento) {

    evento.preventDefault();

    const posicion = Number(txtPosic.value);
    const signo = txtSigno.value.trim();
    const rango = txtRango.value.trim();
    const elemento = txtElemento.value;
    const astro = txtAstro.value.trim();
    const piedra = txtPiedra.value.trim();
    const url = txtUrl.value.trim();

    // Validar información
    if (
        !Number.isInteger(posicion) ||
        posicion < 1 ||
        posicion > 12 ||
        !signo ||
        !rango ||
        !elemento ||
        !astro ||
        !piedra ||
        !url
    ) {
        alert('Debe completar correctamente todos los campos.');
        return;
    }

    // Validar ruta de imagen
    if (!/^imagenes\/[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp)$/i.test(url)) {
        alert(
            'La imagen debe tener una ruta válida. ' +
            'Ejemplo: imagenes/01_Acuario.png'
        );
        return;
    }

    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Guardando...';

    try {

        // Verificar que no exista otra posición igual
        const existentes = await db
            .collection('datosZodiaco')
            .where('posic', '==', posicion)
            .get();

        const posicionOcupada = existentes.docs.some(function (doc) {
            return doc.id !== idSigno;
        });

        if (posicionOcupada) {
            alert('Ya existe otro signo con esa posición.');
            return;
        }

        // Actualizar el documento seleccionado
        await db
            .collection('datosZodiaco')
            .doc(idSigno)
            .update({
                posic: posicion,
                signo: signo,
                rango: rango,
                elemento: elemento,
                astro: astro,
                piedra: piedra,
                url: url
            });

        alert('Signo zodiacal actualizado correctamente.');

        // Regresar a la lista
        window.location.href = 'lista.html';

    } catch (error) {

        console.error('Error al actualizar el signo:', error);

        alert(
            'No se pudieron guardar los cambios: ' +
            error.message
        );

    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = 'Guardar cambios';
    }
});

// Esperar a que Firebase confirme la sesión
auth.onAuthStateChanged(function (usuario) {

    if (usuario) {
        cargarSigno();
    }

});

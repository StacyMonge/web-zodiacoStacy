
/* JavaScript Document
   Registro de signos zodiacales en Firestore
*/

var db = firebase.apps[0].firestore();

// Campos del formulario
const txtPosic = document.querySelector('#txtPosic');
const txtSigno = document.querySelector('#txtSigno');
const txtRango = document.querySelector('#txtRango');
const txtElemento = document.querySelector('#txtElemento');
const txtAstro = document.querySelector('#txtAstro');
const txtPiedra = document.querySelector('#txtPiedra');
const txtArchi = document.querySelector('#txtArchi');
const btnLoad = document.querySelector('#btnLoad');

// Registrar signo zodiacal
btnLoad.addEventListener('click', async function () {

    const posicion = Number(txtPosic.value);
    const signo = txtSigno.value.trim();
    const rango = txtRango.value.trim();
    const elemento = txtElemento.value;
    const astro = txtAstro.value.trim();
    const piedra = txtPiedra.value.trim();
    const archivo = txtArchi.files[0];

    // Validar campos obligatorios
    if (
        !Number.isInteger(posicion) ||
        posicion < 1 ||
        posicion > 12 ||
        !signo ||
        !rango ||
        !elemento ||
        !astro ||
        !piedra
    ) {
        alert('Debe completar correctamente todos los campos.');
        return;
    }

    // Validar imagen
    if (!archivo) {
        alert('Debe seleccionar una imagen.');
        return;
    }

    const nombreArchivo = archivo.name;

    if (!/^[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp)$/i.test(nombreArchivo)) {
        alert('Seleccione una imagen con un nombre válido.');
        return;
    }

    // Las imágenes están almacenadas en public/imagenes
    const urlImagen = 'imagenes/' + nombreArchivo;

    btnLoad.disabled = true;

    try {
        // Evitar registrar dos signos con la misma posición
        const existentes = await db.collection('datosZodiaco')
            .where('posic', '==', posicion)
            .get();

        if (!existentes.empty) {
            alert('Ya existe un signo registrado con esa posición.');
            return;
        }

        // Guardar el signo con los nuevos datos
        const docRef = await db.collection('datosZodiaco').add({
            posic: posicion,
            signo: signo,
            rango: rango,
            elemento: elemento,
            astro: astro,
            piedra: piedra,
            url: urlImagen
        });

        alert('Signo registrado satisfactoriamente. ID: ' + docRef.id);

        limpiar();

    } catch (error) {
        console.error('Error al registrar el signo:', error);
        alert('Error al registrar el signo: ' + error.message);

    } finally {
        btnLoad.disabled = false;
    }
});

// Limpiar formulario
function limpiar() {
    txtPosic.value = '';
    txtSigno.value = '';
    txtRango.value = '';
    txtElemento.value = '';
    txtAstro.value = '';
    txtPiedra.value = '';
    txtArchi.value = '';

    txtPosic.focus();
}

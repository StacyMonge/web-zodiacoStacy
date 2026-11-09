
/* JavaScript Document
   Mostrar signos zodiacales y permitir su edición
*/

var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();

const tabla = document.querySelector('#tabla');

// Recuperar signos después de confirmar la sesión
auth.onAuthStateChanged(function (usuario) {

    if (!usuario) {
        return;
    }

    db.collection('datosZodiaco')
        .orderBy('posic', 'asc')
        .get()
        .then(function (query) {

            tabla.innerHTML = '';

            if (query.empty) {
                tabla.textContent =
                    'No hay signos zodiacales registrados.';
                return;
            }

            query.forEach(function (doc) {

                const datos = doc.data();

                // Crear tarjeta seleccionable
                const tarjeta = document.createElement('a');

                tarjeta.className = 'divAnuncio m-3';
                tarjeta.href =
                    'editar.html?id=' + encodeURIComponent(doc.id);

                tarjeta.style.textDecoration = 'none';
                tarjeta.style.color = 'inherit';
                tarjeta.style.cursor = 'pointer';
                tarjeta.style.display = 'block';

                tarjeta.setAttribute(
                    'aria-label',
                    'Editar signo zodiacal ' + datos.signo
                );

                // Contenedor de imagen
                const contenedorImagen =
                    document.createElement('div');

                contenedorImagen.className = 'imgBlock';

                const imagen = document.createElement('img');

                imagen.src = datos.url;
                imagen.alt = datos.signo;
                imagen.style.width = '100%';

                contenedorImagen.appendChild(imagen);

                // Contenedor de información
                const informacion =
                    document.createElement('div');

                informacion.className = 'p-2';

                // Nombre
                const nombre = document.createElement('h5');
                nombre.textContent = datos.signo || 'Sin nombre';

                // Rango
                const rango = document.createElement('p');
                rango.textContent = datos.rango || 'Sin rango';

                // Elemento
                const elemento = document.createElement('p');

                elemento.textContent =
                    'Elemento: ' +
                    (datos.elemento || 'Pendiente de registrar');

                // Astro celeste
                const astro = document.createElement('p');

                astro.textContent =
                    'Astro celeste: ' +
                    (datos.astro || 'Pendiente de registrar');

                // Piedra preciosa
                const piedra = document.createElement('p');

                piedra.textContent =
                    'Piedra preciosa: ' +
                    (datos.piedra || 'Pendiente de registrar');

                // Indicación de edición
                const editar = document.createElement('small');

                editar.className = 'text-primary d-block mt-2';
                editar.textContent = 'Seleccionar para editar';

                // Agregar información
                informacion.appendChild(nombre);
                informacion.appendChild(rango);
                informacion.appendChild(elemento);
                informacion.appendChild(astro);
                informacion.appendChild(piedra);
                informacion.appendChild(editar);

                // Construir tarjeta
                tarjeta.appendChild(contenedorImagen);
                tarjeta.appendChild(informacion);

                // Mostrar tarjeta
                tabla.appendChild(tarjeta);

            });

        })
        .catch(function (error) {

            console.error(
                'Error al recuperar los signos:',
                error
            );

            tabla.textContent =
                'No se pudieron cargar los signos zodiacales.';
        });

});

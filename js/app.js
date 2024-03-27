// Comprobar que el DOM se ha construido
document.addEventListener('DOMContentLoaded', function(){
    // Llama de funciones
    darkMode();

    // cuando el usuario agrega un nuevo mensaje
    formulario.addEventListener('submit', agregarNota);

    // Cuando el documento esta listo
    obtenerInformacionLocal();
});


// Referencias
const body = document.querySelector('body');
const botonDarkMode = document.querySelector('.modo'); 
const formulario = document.querySelector('#formulario');
const listaNotas = document.querySelector('#lista-notas ul');
let notas = [];

/*------------------------- Funciones --------------------------------*/

// cuando el documento esta listo
function obtenerInformacionLocal(){
    // Se intenta buscar en local Storage las notas y se convierten en JSON
    //      Pero si marca Null se asignará como un arreglo vació 
    notas = JSON.parse( localStorage.getItem('notas')) || [];
    crearHTML();
}

function darkMode(){
    // Escucha por el evento click
    botonDarkMode.addEventListener('click', toggleDarkMode);
};  
// Función que aplica la clase del modo nocturno
function toggleDarkMode(){
    if(body.classList.contains('noche')){
        body.classList.remove('noche');
    } else {
        body.classList.add('noche')
    }
}
// Agregar nota
function agregarNota(e){
    // Prevenir que el formulario se envíe
    e.preventDefault();
    // Establecer referencia al campo de texto, obtiene el valor y elimina espacios en blanco
    const elementoNota = document.querySelector('#nota');
    const notaTexto = elementoNota.value.trim();
    
    // Valida si el campo contiene algo
    if(notaTexto){
        // Objeto para identificar cada nota
        const notaObj = {
            id: Date.now(),
            notaTexto
        }

        // Añade la información al arreglo de notas
        notas = [...notas, notaObj];
        // pasa el elemento creado al area de notas
        crearHTML();
        // Limpiar el campo de nota
        formulario.reset();
        return;
    }
    //  Valida si ya fue creado el mensaje de error
    if(!document.querySelector('.error')){
        mostrarError('La nota no puede ir vacía, escribe algo.');
        return;
    }
}
// Mostrar mensaje de error
function mostrarError(e){
    //  Crear el mensaje de error
    const mensajeError = document.createElement('p');
    mensajeError.classList.add('error');
    mensajeError.textContent = e;

    //  Agrega el elemento al DOM
    body.appendChild(mensajeError);
    
    //  Elimina el elemento luego de un tiempo
    setTimeout(()=>{
        mensajeError.remove();
    }, 3500)
}

// Muestra el listado de notas
function crearHTML(){
    limpiarHTML();
    if(notas.length > 0){
        notas.forEach( (nota)=>{
            // Agregar un botón
            const btnEliminar = document.createElement('a');
            btnEliminar.classList.add('borrar-nota');
            btnEliminar.innerText = 'X';

            // Añadir la función de eliminar
            btnEliminar.onclick = () => {
                borrarMensaje(nota.id);
            }

            // Crear el html
            const nuevaNota = document.createElement('li');
            nuevaNota.innerText = nota.notaTexto;

            // Asignar botón de borrar
            nuevaNota.appendChild(btnEliminar);

            // Agregarlo al DOM 
            listaNotas.appendChild(nuevaNota);
        });
    }
    // Almacenar en el localStorage
    sincronizarStorage();
}

// Eliminar un mensaje
function borrarMensaje(id) {
    notas = notas.filter( elemento => elemento.id !== id );
    crearHTML();
}

//Limpiar el html
function limpiarHTML(){
    while( listaNotas.firstChild ){
        listaNotas.removeChild(listaNotas.firstChild);
    }
}

// Almacenar en el localStorage
function sincronizarStorage(){
    localStorage.setItem('notas', JSON.stringify(notas));
}

/* --------- ASSIGNAR L'ESTAT CORRESPONENT A CADA COR INICIALMENT: --------- */

document.addEventListener("DOMContentLoaded", function () {

    // Recollir totes les icones de cors:
    const heartIcons = document.querySelectorAll('#heart-icon');

    heartIcons.forEach(icon => {
        // Comprovar si la peli és favorita:
        const isFavorite = icon.getAttribute('data-is-favorite') === 'true';

        // Assignar l'estil correcte:
        if (isFavorite) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
        } else {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
        }
    });
});

/* --------- CANVIAR L'ESTAT D'UN COR QUAN ES CLICKA: --------- */

async function toggleFav(element, movieId) {

    // Obtenir l'estat actual:
    const isActive = element.classList.contains('fa-solid');

    // Canvia l'aparença:
    element.classList.toggle('fa-regular', isActive);  // Es desactiva
    element.classList.toggle('fa-solid', !isActive);  // S'activa

    // Actualitza l'estat a la BD:
    try {
        const response = await fetch(`/movies/patch/${movieId}`, {
            method: 'POST', // S'utilitza POST per a ajustar-nos a la ruta existent (creada inicialment per al formulari).
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isFavorite: !isActive }),
        });

        if (!response.ok) {
            throw new Error('No s\'ha pogut actualitzar la pel·lícula.');
        }

        console.log('Pel·lícula actualitzada correctament.');
    } catch (error) {
        console.error('Error:', error);

        // Si hi ha un error, tornem el botó al seu estat original:
        element.classList.toggle('fa-regular', !isActive);
        element.classList.toggle('fa-solid', isActive);
        alert('Ha ocorregut un error en actualitzar l\'estat de la pel·lícula.');
    }
}

/* --------- MOSTRAR UN TOAST D'ÈXIT AL GUARDAR UNA PEL·LÍCULA: --------- */

// Espera a que el DOM esté cargado:
document.addEventListener("DOMContentLoaded", function () {
    // Selecciona el toast:
    const toastElement = document.getElementById("successToast");

    if (toastElement) {
        // Inicializa el toast con el tiempo de desaparición:
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });

        // Muestra el toast:
        toast.show();
    }
});
// Espera a que el contenido del DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // Obtén referencias a los elementos del formulario una sola vez
    const form = document.getElementById('dilutionForm');
    const finalVolumeInput = document.getElementById('finalVolume');
    const unitSelect = document.getElementById('unit');
    const ratioAInput = document.getElementById('ratioA');
    const ratioBInput = document.getElementById('ratioB');
    const calculateButton = document.getElementById('calculateButton'); // *** Necesitarás añadir id="calculateButton" al botón en HTML ***
    const resultsDiv = document.getElementById('results');
    const reagentVolumeP = document.getElementById('reagentVolume');
    const diluentVolumeP = document.getElementById('diluentVolume');
    const errorMessagesDiv = document.getElementById('errorMessages'); // *** Necesitarás añadir este div en HTML ***

    // Añade el listener al botón
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateDilution);
    }

    // Función para mostrar errores en la página
    function displayError(message) {
        if (errorMessagesDiv) {
            errorMessagesDiv.textContent = message;
            errorMessagesDiv.classList.remove('hidden'); // Muestra el div de errores
        }
        resultsDiv.classList.add('hidden'); // Oculta resultados si hay error
    }

    // Función para limpiar errores
    function clearError() {
        if (errorMessagesDiv) {
            errorMessagesDiv.textContent = '';
            errorMessagesDiv.classList.add('hidden'); // Oculta el div de errores
        }
    }

    function calculateDilution() {
        clearError(); // Limpia errores anteriores al empezar

        // 1. Obtener y convertir valores
        const finalVolume = parseFloat(finalVolumeInput.value);
        const unit = unitSelect.value;
        const ratioA = parseFloat(ratioAInput.value);
        const ratioB = parseFloat(ratioBInput.value);

        // 2. Validar las entradas
        if (isNaN(finalVolume) || isNaN(ratioA) || isNaN(ratioB)) {
            displayError('Por favor, ingrese valores numéricos en todos los campos.');
            return;
        }
        if (finalVolume <= 0 || ratioA <= 0 || ratioB <= 0) {
            displayError('Los valores de volumen y ratio deben ser positivos.');
            return;
        }
         if (ratioA >= ratioB) {
             // Generalmente, la primera parte del ratio es menor que el total.
             // Puedes decidir si esto es un error o una advertencia.
             // displayError('La primera parte del ratio (A) debe ser menor que la segunda (B).');
             // return;
             console.warn('Ratio A es mayor o igual a Ratio B. Asegúrate de que esto es correcto.'); // Opcional: advertencia en consola
         }


        // 3. Realizar el cálculo (misma lógica que antes)
        // Interpretación: A:B -> A partes de reactivo en B partes totales.
        const reagentFraction = ratioA / ratioB;
        const reagentVolume = finalVolume * reagentFraction;
        const diluentVolume = finalVolume - reagentVolume;

        // 4. Mostrar los resultados
        reagentVolumeP.textContent = `Reactivo/Muestra: ${reagentVolume.toFixed(2)} ${unit}`;
        diluentVolumeP.textContent = `Diluyente: ${diluentVolume.toFixed(2)} ${unit}`;
        resultsDiv.classList.remove('hidden'); // Muestra la sección de resultados
    }

    // (Opcional) Escuchar cambios en los inputs para ocultar resultados/errores antiguos
    form.addEventListener('input', () => {
        resultsDiv.classList.add('hidden');
        clearError();
    });

}); // Fin de DOMContentLoaded

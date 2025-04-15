function calculateDilution() {
    const finalVolume = parseFloat(document.getElementById('finalVolume').value);
    const unit = document.getElementById('unit').value;
    const ratioA = parseFloat(document.getElementById('ratioA').value);
    const ratioB = parseFloat(document.getElementById('ratioB').value);

    if (isNaN(finalVolume) || isNaN(ratioA) || isNaN(ratioB) || finalVolume <= 0 || ratioA <= 0 || ratioB <= 0) {
        alert('Por favor, ingrese valores válidos y positivos.');
        return;
    }

    const reagentFraction = ratioA / ratioB;
    const reagentVolume = finalVolume * reagentFraction;
    const diluentVolume = finalVolume - reagentVolume;

    document.getElementById('reagentVolume').textContent = `Reactivo/Muestra: ${reagentVolume.toFixed(2)} ${unit}`;
    document.getElementById('diluentVolume').textContent = `Diluyente: ${diluentVolume.toFixed(2)} ${unit}`;
    document.getElementById('results').classList.remove('hidden');
}
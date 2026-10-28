document.addEventListener('DOMContentLoaded', () => {
    const modelViewer = document.getElementById('phone-model');
    const colorButtons = document.querySelectorAll('.color-btn');
    const colorNameDisplay = document.getElementById('color-name');

    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            colorButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Берет прямую ссылку на 3D-модель из нажатой кнопки
            const newModelSrc = button.getAttribute('data-model');
            const newColorName = button.getAttribute('data-color');

            // Меняет модель и текст
            modelViewer.src = newModelSrc;
            colorNameDisplay.textContent = `Цвет: ${newColorName}`;
        });
    });
});

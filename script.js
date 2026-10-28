let scene, camera, renderer, controls;
let backMesh, frameMesh, bumpMesh;

function init() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Сцена
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f7);

    // 2. Камера
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 10);

    // 3. Рендерер
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 4. Интерактивное управление (вращение мышью / пальцем)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 5. Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 8, 5);
    scene.add(mainLight);

    const sideLight = new THREE.DirectionalLight(0xffffff, 0.5);
    sideLight.position.set(-5, 0, -5);
    scene.add(sideLight);

    // 6. Построение 3D-модели в стиле iPhone 18 Pro
    const phoneGroup = new THREE.Group();

    // Цвета (глубокий бордово-красный и тёмно-синий)
    const redHex = 0x581c24;
    const blueHex = 0x1a3144;

    // Материалы
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: redHex, metalness: 0.5, roughness: 0.35 });
    const bumpMaterial = new THREE.MeshStandardMaterial({ color: redHex, metalness: 0.6, roughness: 0.25 });
    const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1 });
    const lensMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.05 });
    const flashMaterial = new THREE.MeshStandardMaterial({ color: 0xeef2f5, metalness: 0.1, roughness: 0.1 });
    const sensorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.2 });

    // Основной корпус (скругленные грани)
    const frameGeo = new THREE.BoxGeometry(3.1, 6.3, 0.28);
    frameMesh = new THREE.Mesh(frameGeo, bodyMaterial);
    phoneGroup.add(frameMesh);

    // Экран
    const screenGeo = new THREE.BoxGeometry(2.98, 6.18, 0.02);
    const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
    screenMesh.position.z = 0.141;
    phoneGroup.add(screenMesh);

    // Вырез под «Dynamic Island» на экране
    const islandGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 16);
    islandGeo.rotateZ(Math.PI / 2);
    const islandMesh = new THREE.Mesh(islandGeo, sensorMaterial);
    islandMesh.position.set(0, 2.7, 0.152);
    phoneGroup.add(islandMesh);

    // Широкий верхний модуль камер (по всей ширине корпуса)
    const bumpGeo = new THREE.BoxGeometry(2.8, 1.8, 0.09);
    bumpMesh = new THREE.Mesh(bumpGeo, bumpMaterial);
    bumpMesh.position.set(0, 1.95, -0.18);
    phoneGroup.add(bumpMesh);

    // Создание 3 объективов (треугольником слева на широком плато)
    const lensGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.06, 32);
    lensGeo.rotateX(Math.PI / 2);

    const lens1 = new THREE.Mesh(lensGeo, lensMaterial);
    lens1.position.set(-0.8, 2.3, -0.23);

    const lens2 = new THREE.Mesh(lensGeo, lensMaterial);
    lens2.position.set(-0.8, 1.6, -0.23);

    const lens3 = new THREE.Mesh(lensGeo, lensMaterial);
    lens3.position.set(-0.15, 1.95, -0.23);

    phoneGroup.add(lens1);
    phoneGroup.add(lens2);
    phoneGroup.add(lens3);

    // Элементы справа на плато: Вспышка, Микрофон и LiDAR
    const flashGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.03, 16);
    flashGeo.rotateX(Math.PI / 2);
    const flashMesh = new THREE.Mesh(flashGeo, flashMaterial);
    flashMesh.position.set(0.85, 2.3, -0.23);
    phoneGroup.add(flashMesh);

    const lidarGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.03, 16);
    lidarGeo.rotateX(Math.PI / 2);
    const lidarMesh = new THREE.Mesh(lidarGeo, sensorMaterial);
    lidarMesh.position.set(0.85, 1.6, -0.23);
    phoneGroup.add(lidarMesh);

    scene.add(phoneGroup);

    // 7. Переключение цвета (Красный / Синий)
    const btnRed = document.getElementById('btn-red');
    const btnBlue = document.getElementById('btn-blue');
    const colorName = document.getElementById('color-name');

    btnRed.addEventListener('click', () => {
        frameMesh.material.color.setHex(redHex);
        bumpMesh.material.color.setHex(redHex);
        colorName.textContent = 'Цвет: Красный';
        btnRed.classList.add('active');
        btnBlue.classList.remove('active');
    });

    btnBlue.addEventListener('click', () => {
        frameMesh.material.color.setHex(blueHex);
        bumpMesh.material.color.setHex(blueHex);
        colorName.textContent = 'Цвет: Синий';
        btnBlue.classList.add('active');
        btnRed.classList.remove('active');
    });

    // Адаптация под размер экрана
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    // Анимационный цикл
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

document.addEventListener('DOMContentLoaded', init);

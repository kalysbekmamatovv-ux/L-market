let scene, camera, renderer, controls;
let backMesh, frameMesh;

function init() {
    const container = document.getElementById('canvas-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Сцена
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfb0f0f0);

    // 2. Камера
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 11);

    // 3. Рендерер
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 4. Управление мышью / пальцем (3D Вращение)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 5. Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 10, 7);
    scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.6);
    backLight.position.set(-5, -5, -5);
    scene.add(backLight);

    // 6. Построение 3D модели смартфона
    const phoneGroup = new THREE.Group();

    // Материалы
    const redColor = 0xa50011;
    const backMaterial = new THREE.MeshStandardMaterial({ color: redColor, metalness: 0.3, roughness: 0.2 });
    const frameMaterial = new THREE.MeshStandardMaterial({ color: redColor, metalness: 0.9, roughness: 0.1 });
    const screenMaterial = new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.1 });
    const cameraBoxMaterial = new THREE.MeshStandardMaterial({ color: 0x151515, metalness: 0.8, roughness: 0.2 });
    const lensMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.05 });

    // Корпус (Рамка)
    const frameGeo = new THREE.BoxGeometry(3.2, 6.5, 0.3);
    frameMesh = new THREE.Mesh(frameGeo, frameMaterial);
    phoneGroup.add(frameMesh);

    // Задняя панель
    const backGeo = new THREE.BoxGeometry(3.14, 6.44, 0.05);
    backMesh = new THREE.Mesh(backGeo, backMaterial);
    backMesh.position.z = -0.14;
    phoneGroup.add(backMesh);

    // Экран (Спереди)
    const screenGeo = new THREE.BoxGeometry(3.05, 6.35, 0.02);
    const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
    screenMesh.position.z = 0.15;
    phoneGroup.add(screenMesh);

    // Блок камер (Сзади слева)
    const bumpGeo = new THREE.BoxGeometry(1.2, 1.2, 0.12);
    const bumpMesh = new THREE.Mesh(bumpGeo, cameraBoxMaterial);
    bumpMesh.position.set(-0.7, 2.0, -0.2);
    phoneGroup.add(bumpMesh);

    // Объективы камер
    const lensGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.06, 32);
    lensGeo.rotateX(Math.PI / 2);

    const lens1 = new THREE.Mesh(lensGeo, lensMaterial);
    lens1.position.set(-0.9, 2.3, -0.26);
    phoneGroup.add(lens1);

    const lens2 = new THREE.Mesh(lensGeo, lensMaterial);
    lens2.position.set(-0.9, 1.7, -0.26);
    phoneGroup.add(lens2);

    const lens3 = new THREE.Mesh(lensGeo, lensMaterial);
    lens3.position.set(-0.45, 2.0, -0.26);
    phoneGroup.add(lens3);

    scene.add(phoneGroup);

    // 7. Переключение цветов
    const btnRed = document.getElementById('btn-red');
    const btnBlue = document.getElementById('btn-blue');
    const colorName = document.getElementById('color-name');

    btnRed.addEventListener('click', () => {
        backMesh.material.color.setHex(0xa50011);
        frameMesh.material.color.setHex(0xa50011);
        colorName.textContent = 'Цвет: Красный';
        btnRed.classList.add('active');
        btnBlue.classList.remove('active');
    });

    btnBlue.addEventListener('click', () => {
        backMesh.material.color.setHex(0x1a3d54);
        frameMesh.material.color.setHex(0x1a3d54);
        colorName.textContent = 'Цвет: Синий';
        btnBlue.classList.add('active');
        btnRed.classList.remove('active');
    });

    // 8. Адаптивность под размер экрана
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    // Анимация
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

document.addEventListener('DOMContentLoaded', init);

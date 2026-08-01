let cartItemCount = 0;
let allProducts = []; // Хранилище всех загруженных товаров

// Отрисовка товаров на странице
function renderProducts(products) {
    const grid = document.getElementById('recommendationsGrid');
    grid.innerHTML = ''; 
    
    if (products.length === 0) {
        grid.innerHTML = '<p>Товары не найдены.</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.title}" class="product-img" onerror="this.src='https://via.placeholder.com/250x200/eee/cb11ab?text=Товар'">
            <div class="product-price">${product.price}</div>
            <div class="product-title">${product.title}</div>
            <button class="add-to-cart" onclick="addToCart(event)">В корзину</button>
        `;
        grid.appendChild(card);
    });
}

// Запрос товаров с Python-бэкенда
async function fetchProductsFromBackend() {
    try {
        const response = await fetch('https://l-market.onrender.com/api/products');
        allProducts = await response.json();
        renderProducts(allProducts);
    } catch (error) {
        console.error("Ошибка сервера:", error);
        document.getElementById('recommendationsGrid').innerHTML = '<p>Сервер недоступен. Запустите Python скрипт (python3 app.py).</p>';
    }
}

// Добавление в корзину
function addToCart(event) {
    event.stopPropagation();
    cartItemCount++;
    document.getElementById('cartCount').innerText = cartItemCount;
}

// Управление модальным окном
function uploadProduct() {
    document.getElementById('uploadModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('uploadModal').style.display = 'none';
}

// Добавление нового товара пользователем
function submitProduct() {
    const title = document.getElementById('newTitle').value;
    const price = document.getElementById('newPrice').value;
    const img = document.getElementById('newImg').value;

    if (!title || !price) {
        alert("Пожалуйста, заполните название и цену товара!");
        return;
    }

    const newProd = {
        id: allProducts.length + 1,
        title: title,
        price: price.includes('c.') ? price : price + ' c.',
        img: img || 'https://via.placeholder.com/250x200/eee/cb11ab?text=Новинка'
    };

    allProducts.unshift(newProd);
    renderProducts(allProducts);
    closeModal();

    // Очистка полей ввода
    document.getElementById('newTitle').value = '';
    document.getElementById('newPrice').value = '';
    document.getElementById('newImg').value = '';
}

// Живой поиск товаров
function searchItems() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allProducts.filter(item => item.title.toLowerCase().includes(query));
    renderProducts(filtered);
}

// Пополнение кошелька карты
function topUpWallet() {
    const amount = prompt("Введите сумму для пополнения карты L-Market (сом):", "1000");
    if (amount) {
        alert(`Успешно! Ваша карта пополнена на ${amount} сом.`);
    }
}

// Запуск загрузки товаров при старте
fetchProductsFromBackend();

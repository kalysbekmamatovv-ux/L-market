from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Разрешаем фронтенду запрашивать данные

# Имитация базы данных товаров
products_db = [
    { "id": 1, "title": "Беспроводные наушники Pro Max", "price": "2 500 c.", "img": "https://via.placeholder.com/250x200/eee/cb11ab?text=Наушники" },
    { "id": 2, "title": "Умные часы Series 8", "price": "3 200 c.", "img": "https://via.placeholder.com/250x200/eee/cb11ab?text=Часы" },
    { "id": 3, "title": "Кроссовки спортивные", "price": "4 100 c.", "img": "https://via.placeholder.com/250x200/eee/cb11ab?text=Кроссовки" },
    { "id": 4, "title": "Рюкзак городской", "price": "1 800 c.", "img": "https://via.placeholder.com/250x200/eee/cb11ab?text=Рюкзак" },
    { "id": 5, "title": "Игровая мышь RGB", "price": "1 200 c.", "img": "https://via.placeholder.com/250x200/eee/cb11ab?text=Мышь" }
]

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(products_db)

import os

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

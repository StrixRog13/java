class ApiMock {
    constructor() {

    }

    fetch() {
      return [
          { title: 'Shirt', price: 150 },
          { title: 'Socks', price: 50 },
          { title: 'Jacket', price: 350 },
          { title: 'Shoes', price: 250 },
        ];
    }
}


class GoodsItem {
    constructor(title, price) {
      this.title = title;
      this.price = price;
    }

    getHtml() {
      return `<div>
            <div class="goods-item">
            <img src="200x150.jpg" alt="some img">
            <h3>${this.title}</h3>
            <p>${this.price}$</p>
            <button class="cart-button">Купить</button>
            </div>
            </div>`;
            }
    }

class GoodsList {
    constructor() {
      this.api = new ApiMock();
      this.$goodsList = document.querySelector('.goods-list');
      this.goods = [];
    }

    fetchGoods() {
      this.goods = this.api.fetch().map(({title, price}) => new GoodsItem(title, price));
    }

    render() {
      this.$goodsList.textContent = '';
      this.goods.forEach((good) => {
          this.$goodsList.insertAdjacentHTML('beforeend', good.getHtml());
      })
    }
    getSum() {
        let res = this.goods.reduce((sum, item) => sum += item.price, 0);
        alert('полная стоимость товаров в корзине: ' + res);
    }    
}

const goodsList = new GoodsList();

goodsList.fetchGoods();
goodsList.render();
goodsList.getSum();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//пустой класс корзина
class Cart {
    addGoods() {

    }
    removeGoods() {

    }
    changeGoods() {

    }
}

class ElemCart {

}

/*
МЕТОДЫ КОТОРЫЕ МОГУТ ПОНАДОБИТЬСЯ ПРИ РАБОТЕ С КОРЗИНОЙ
1. updateData - обновляем данные из localStorage, записываем содержимое в переменную cartData
2. getData - возвращаем данные
3. saveData - сохраняем корзину в localStorage
4. clearData - очищаем корзину
5. getById - ищем элемент корзины по id товара
6. add - добавляем товар в корзину
7. remove - удаляем товар из корзины
8. changeCount - меняем количество
9. getCount - возвращаем число уникальных товаров корзины
10. getCountAll - возвращаем число всех товаров корзины
11. getSumma - возвращаем общую сумму заказа
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
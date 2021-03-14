class Api {
    constructor() {
      this.url = 'goods.json';
    }

    fetch(error, success) {
      let xhr;
    
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else if (window.ActiveXObject) { 
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
    
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if(xhr.status === 200) {
            success(JSON.parse(xhr.responseText));
          } else if(xhr.status > 400) {
            error('все пропало');
          }
        }
      }
    
      xhr.open('GET', this.url, true);
      xhr.send();
    }

    fetchPromise() {
      return new Promise((resolve, reject) => {
        this.fetch(reject, resolve)
      }) 
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
            //<div><h3>${this.res}</h3></div>
            }
    }

class Header {
  constructor() {
    this.$container = document.querySelector('header');
    this.$button = this.$container.querySelector('.cart-button');
    this.$search = this.$container.querySelector('#search');
  }

  setSearchHandler(callback) {
    this.$search.addEventListener('input', callback);
  }

  setButtonHandler(callback) {
    this.$button.addEventListener('click', callback);
  }
}

class GoodsList {
    constructor() {
      this.api = new Api();
      this.header = new Header();
      this.$goodsList = document.querySelector('.goods-list');
      this.goods = [];
      this.filteredGoods = [];
      //this.api.fetch(this.onFetchError.bind(this), this.onFetchSuccess.bind(this));

      this.header.setSearchHandler((evt) => {
        this.search(evt.target.value);
      })

    //fetchGoods() {
    //  this.goods = this.api.fetch().map(({title, price}) => new GoodsItem(title, price));
    //}

    //onFetchError(err) {
      const fetch = this.api.fetchPromise();

      fetch.then((data) => { this.onFetchSuccess(data) })
        .catch((err) => { this.onFetchError(err) });
      console.log(fetch);
    }
//
    search(str) {
      if(str === '') {
        this.filteredGoods = this.goods;
      }
      const regexp = new RegExp(str, 'gi');
      this.filteredGoods = this.goods.filter((good) => regexp.test(good.title));
      this.render();
    }

    onFetchSuccess(data) {
      this.goods = data.map(({title, price}) => new GoodsItem(title, price));
      this.filteredGoods = this.goods;
      this.render();
    }

    onFetchError(err) {
      this.$goodsList.insertAdjacentHTML('beforeend', `<h3>${err}</h3>`);
    }

    render() {
      this.$goodsList.textContent = '';
      this.filteredGoods.forEach((good) => {
          this.$goodsList.insertAdjacentHTML('beforeend', good.getHtml());
      })
    }

    getSum() {
        let res = this.filteredGoods.reduce((sum, item) => sum += item.price, 0);
        console.log('полная стоимость товаров в корзине: ' + res + '$');
        //alert('полная стоимость товаров в корзине: ' + res + '$');
    } 
}

function openCart () {
  console.log('cart');
}

const goodsList = new GoodsList();

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
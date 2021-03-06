// шаг 3 итог
const baseGood = {
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

    function Good(title, price) {
        this.title = title;
        this.price = price;

        // this.__proto__=baseGood; передача свойств прототипа 
    
       /* this.getHtml = function() {
            return `<div>
            <div class="goods-item">
            <img src="200x150.jpg" alt="some img">
            <h3>${this.title}</h3>
            <p>${this.price}$</p>
            <button class="cart-button">Купить</button>
            </div>
            </div>`;
            } */
}

Good.prototype = baseGood; // тоже самое что this.__proto__=baseGood

/* function GoodBestseller() { пример!!!
    this.getHtml = function() {
            return `<div>
            <div class="goods-item bestseller">
            <img src="200x150.jpg" alt="some img">
            <h3>Хит продаж</h3>
            <p>${this.price}$</p>
            <button class="cart-button">Купить</button>
            </div>
            </div>`;
            }
}
*/

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*function GoodBestSeller(title, price) { //пример!!!
    const parent = new Good(title, price);
    this.__proto__=parent;
    this.getHtml = function() {
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

GoodBestSeller.prototype = Good;
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const api = {
    fetch() {
        const goods =[ //имитация прогрузки с сервера товаров 
            {title: 'Good1', price: 5}, 
            {title: 'Good2', price: 15},
            {title: 'Good3', price: 25}
        ]; //обращение к серверу
        return goods;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const apiMock = { 
    names: ['Shirt','Socks','Jacket','Shoes'],
    colors: ['Red','Blue','Yellow','Purple'],

    getNumber(max) {
        return Math.floor(Math.random() * (max));
    },

    getRandomName() {
        return `${this.colors[this.getNumber(this.colors.length)]} ${this.names[this.getNumber(this.names.length)]}`
    },

    fetch() {
        return Array(this.getNumber(5)).fill('').map(() => ({title: this.getRandomName(), price: this.getNumber(999)}));
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const goodsList = {
         apiObject: apiMock, //apiMock
         goods: [
                    //new Good('Shirt', 150),
                    //new Good('Socks', 50),
                    //new Good('Jacket', 350),
                    //new Good('Shoes', 250),
                    // для примера!!! // new GoodBestseller()
                ],
    container: document.querySelector('.goods-list'),

    getData() {
        this.goods = this.apiObject.fetch().map(({title, price}) => new Good(title, price));
    },

    render() {
        this.goods.forEach(
            item => this.container.insertAdjacentHTML('beforeend', item.getHtml())
        );
    }
}
    goodsList.getData();

    goodsList.render();              


/*
///////////////////////////////////////////////////////////////////// шаг 1
 const goods = [
    { 
        title: 'Shirt', 
        price: 150 ,

        renderGoodsItem = ({ title, price }) => {
        return `<div><div class="goods-item">
        <img src="200x150.jpg" alt="some img"> 
        <h3>${title}</h3>
        <p>${price}$</p>
        <button class="cart-button">Купить</button>
        </div>
        </div>`;
    };
    },
    { 
        title: 'Socks', 
        price: 50 
            renderGoodsItem = ({ title, price }) => {
        return `<div><div class="goods-item">
        <img src="200x150.jpg" alt="some img"> 
        <h3>${title}</h3>
        <p>${price}$</p>
        <button class="cart-button">Купить</button>
        </div>
        </div>`;
    };
    },
    { 
        title: 'Jacket', 
        price: 350 
            renderGoodsItem = ({ title, price }) => {
        return `<div><div class="goods-item">
        <img src="200x150.jpg" alt="some img"> 
        <h3>${title}</h3>
        <p>${price}$</p>
        <button class="cart-button">Купить</button>
        </div>
        </div>`;
    };
    },
    { 
        title: 'Shoes', 
        price: 250 
            renderGoodsItem = ({ title, price }) => {
        return `<div><div class="goods-item">
        <img src="200x150.jpg" alt="some img"> 
        <h3>${title}</h3>
        <p>${price}$</p>
        <button class="cart-button">Купить</button>
        </div>
        </div>`;
    };
    },
];


const $goodsList = document.querySelector('.goods-list');
  


//
const renderGoodsList = (list) => {
let goodsList = list.map(item => renderGoodsItem(item.title, item.price));
document .querySelector( '.goods-list' ).innerHTML = goodsList;
}

renderGoodsList(goods);

//

const renderGoodsList = (list = goods) => {
    let goodsList = list.map(
            item => renderGoodsItem(item)
        ).join('');

    $goodsList.insertAdjacentHTML('beforeend', goodsList);
}
  
renderGoodsList();

///////////////////////////////////////////////////////////////////// шаг 2
const goodsList = {
    goods: [
    { 
        title: 'Shirt', 
        price: 150 ,

            getHtml() => {
        return `<div><div class="goods-item"><img src="200x150.jpg" alt="some img"> <h3>${this.title}</h3><p>${this.price}$</p><button class="cart-button">Купить</button></div></div>`;
        },
    },
    { 
        title: 'Socks', 
        price: 50 
            getHtml() => {
        return `<div><div class="goods-item"><img src="200x150.jpg" alt="some img"> <h3>${this.title}</h3><p>${this.price}$</p><button class="cart-button">Купить</button></div></div>`;
        },
    },
    { 
        title: 'Jacket', 
        price: 350 
            getHtml() => {
        return `<div><div class="goods-item"><img src="200x150.jpg" alt="some img"> <h3>${this.title}</h3><p>${this.price}$</p><button class="cart-button">Купить</button></div></div>`;
        },
    },
    { 
        title: 'Shoes', 
        price: 250 
            getHtml() => {
        return `<div><div class="goods-item"><img src="200x150.jpg" alt="some img"> <h3>${this.title}</h3><p>${this.price}$</p><button class="cart-button">Купить</button></div></div>`;
        },
    },

    ]
    container: document.querySelector('.goods-list'),

    render() {
    this.goods.forEach(
        item =>
        this.container.insertAdjacentHTML('beforeend', item.getHtml())
        );

    }

}

goodsList.render();

*//////////////////////////////////////////////////////////////////////
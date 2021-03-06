const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

class Api {
    constructor() {
      this.url = `${API_URL}/catalogData.json`;
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
    constructor (product_name, price, id_product) {
      this.product_name = product_name;
      this.price = price;        
      this.id_product = id_product;
  }

    getHtml () {
      return `<div>
            <div class="goods-item">
            <img src="200x150.jpg" alt="some img">
            <h3>${this.product_name}</h3>
            <p>${this.price}$</p>
            <button class="goods-item-button" id="${this.id_product}">Купить</button>
            </div>
            </div>`;
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

class BodyContainer extends Header {
    constructor(){
      super();
      this.$container = document.querySelector('.goods-list');
      this.$buttons = this.$container.querySelectorAll('.goods-item-button');
      this.$buttonsDelete = document.querySelectorAll('.cart-item__button');    
  }
    setButtonHandler(callback) {        
      this.$buttons.forEach((item) => item.addEventListener('click', callback)); 
  }
  
    setDeleteHandler(callback) {     
      console.log(this.$buttonsDelete);   
      this.$buttonsDelete.forEach((item) => item.addEventListener('click', callback)); 
  }
  
    setQntButtonHandler(isClass,callback) {  
      let $buttonQnt = document.querySelectorAll('.' + isClass);   
      console.log($buttonQnt);   
      $buttonQnt.forEach((item) => item.addEventListener('click', callback)); 
  }
}

class GoodsList {
    constructor() {
      this.api = new Api();
      this.header = new Header();      
      const arrCart = [];
      this.cart = new CartList('cart-list', arrCart); 
      this.$goodsList = document.querySelector('.goods-list');
      this.goods = []; 
      this.filteredGoods = [];  
      this.body = new BodyContainer();
      this.header.setSearchHandler((evt) => {
        this.search(evt.target.value);
      })     

      const fetch = this.api.fetchPromise();

      fetch.then((data) => { this.onFetchSuccess(data) })
        .catch((err) => { this.onFetchError(err) });
      console.log(fetch);
    }

    search(str) {
      if(str === '') {
        this.filteredGoods = this.goods;
      }
      const regexp = new RegExp(str, 'gi');
      this.filteredGoods = this.goods.filter((good) => regexp.test(good.product_name));
      this.render();
    }

    onFetchSuccess(data) {
      this.goods = data.map(({product_name, price, id_product}) => new GoodsItem(product_name, price, id_product));
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
      });
      this.body = new BodyContainer;
      this.body.setButtonHandler((evt) => {
        this.cart.addToCart(evt);
      });      
      this.cart.arrCart = this.goods; 
    }
}

class CartItem extends GoodsItem { 
    constructor (product_name, price, id_product, qnt) {
      super(product_name, price, id_product);
      this.qnt = qnt; // 
  }

    getHtml () { 
      return `
              <div class="cart-item">
              <img src="200x150.jpg" alt="some img">
              <h3 class="cart-item__title">${this.product_name}</h3>
              <p class="cart-item__price">Цена: ${this.price} $</p>
              <button type="button" id="delete_id_${this.id_product}" name="delete" class="cart-item__qnt">    -    </button>
              <span class="cart-item__quantity">Кол-во:${this.qnt}</span>
              <button type="button" id="add_id_${this.id_product}" name="add" class="cart-item__qnt">+</button>
              <div class="cart-item__delete"><button class="cart-item__button" id="${this.id_product}">Убрать из корзины</button></div>
              
              </div>`;
  }

    addQuantity(a){ 
      this.qnt = a; 
  }; 
}

class CartList {
    constructor(isClass, arrCart){
      this.$container = document.querySelector(`.${isClass}`); 
      this.arrCart = []; 
      this.cartItems = []; 
      this.body = null;
  }

    setButtonCardHand(callback) {
      this.$search.addEventListener('input', callback);
  }

    addToCart(e) {
      let id = e.target.id; 
      let ind = this.arrCart.findIndex( obj => {
        return obj.id_product == id 
      });
      let {product_name, price} = this.arrCart[ind];
  
  
      ind = this.cartItems.findIndex( obj => { 
        return obj.id_product == id
      });
      console.log(ind);

      if (ind == -1) { 
        this.cartItems.push(new CartItem(product_name, price, id, 1)); 
        console.log(this.cartItems);      
      } else {           
        this.cartItems[ind].qnt = parseInt(this.cartItems[ind].qnt) + 1;
        console.log(this.cartItems);
      } 
      this.renderCart();
  }

    deleteFromCart(e){
      let id = e.target.id;
      let ind = this.cartItems.findIndex( obj => {
          return obj.id_product == id
      });
      this.cartItems.splice(ind, 1);
      console.log(this.cartItems)
      this.renderCart(); 
  }
  
    addQuantity(e){
      let id = e.target.id.split('_', e.target.id)[1];
      console.log(e.target.id);
  }

    changeQuantity(e){
      let id = e.target.id.split('_')[2];
      let ind = this.cartItems.findIndex( obj => {
        return obj.id_product == id
      });
  
      let action = e.target.id.split('_')[0];
      console.log(id); 
      console.log(this.cartItems[ind].qnt);
      switch(action) { 
     
        case 'delete':  
          if (this.cartItems[ind].qnt >= 1) {
            this.cartItems[ind].qnt = this.cartItems[ind].qnt - 1;
          }
          if((this.cartItems[ind].qnt) == 0){
            this.cartItems.splice(ind, 1);
          }
          this.renderCart();
          break;
        
          case 'add': 
            this.cartItems[ind].qnt = this.cartItems[ind].qnt + 1; 
            this.renderCart();
            break;  
    }    
  }

    renderCart() {            
      this.$container.textContent = '';
      this.cartItems.forEach(
          item => this.$container.insertAdjacentHTML('beforeend', item.getHtml())                
      );
    
      this.body = new BodyContainer;
      this.body.setDeleteHandler((evt) => {
            this.deleteFromCart(evt);
          });      
        
      this.body.setQntButtonHandler('cart-item__qnt', (evt) => {
        this.changeQuantity(evt);
      });
      
      this.$container.insertAdjacentHTML('beforeend', `<div class="good-items__total-price">Итого  ${this.sumGoods()}$</div>`)
      console.log(this.sumGoods());    
  }

    sumGoods() { 
      let totalPrice = 0;
      this.cartItems.forEach( ({price, qnt}) =>  { totalPrice += (parseInt(price)  * parseInt(qnt));} );
      return totalPrice;             
  } 
}

function openCart () {
  console.log('cart');
}

const goodsList = new GoodsList();

const form = document.querySelector('form');
const userName = document.querySelector('.name');
const userNameError = document.querySelector('.name__error');
const userTel = document.querySelector('.tel');
const userTelError = document.querySelector('.tel__error');
const userEmail = document.querySelector('.email');
const userEmailError = document.querySelector('.email__error');

const regexName = /^([a-z\s]+|[а-яё\s]+)$/i; //валидация имени
const regexTel = /\+7|8\d{3}(\d){7}/; //валидация номера телефона
const regexEmail = /^(\w+\.?-?\w*@\w+\.(ru|com))$/i; //валидация емейла

form.addEventListener('submit', () => {
  if(regexName.test(userName.value) && regexTel.test(userTel.value) && regexEmail.test(userEmail.value)) {
    alert('Ваше обращение зарегистрированно');
  }
  if (!regexName.test(userName.value)) {
    userName.style.border='1px solid #DA0101';
    userNameError.style.display='block';
  } else {
    userName.style.border='1px solid green';
    userNameError.style.display='none';
  }
  if (!regexTel.test(userTel.value)) {
    userTel.style.border='1px solid #DA0101';
    userTelError.style.display='block';
  } else {
    userTel.style.border='1px solid green';
    userTelError.style.display='none';
  }
  if (!regexEmail.test(userEmail.value)) {
    userEmail.style.border='1px solid #DA0101';
    userEmailError.style.display='block';
  } else {
    userEmail.style.border='1px solid green';
    userEmailError.style.display='none';
  }
});
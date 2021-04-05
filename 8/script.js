const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

Vue.component('server-error', {
  template: `<h3 class="goods-null" v-if="iserror">Ошибка сервера</h3>`,
  props: ['iserror'],
});

Vue.component('cart',{ // вывод корзины в main. Кнопка вызывающая  козину здесь отдельно в header
  template: `
      <div v-if="visible" class="cart-list" >
        <div class="cart-list__price">Сумма товаров: {{price}}</div>
        <div class="cart-item" v-for="item in cart">
          <div class="cart-item__img"></div>
          <h3 class="cart-item__title">{{item.product_name}}</h3>
          <p class="cart-item__price">Цена: {{item.price}} у.е.</p>
          <button type="button"  name="delete" class="cart-item__qnt" v-bind:data-qntid="item.id_product" v-on:click="deleteQuantity">-</button>
          <span class="cart-item__quantity">Количество: <b>{{item.qnt}}</b></span>
          <button type="button"  name="add" class="cart-item__qnt" v-bind:data-qntid="item.id_product" v-on:click="addQuantity">+</button>
                  <div class="cart-item__delete">
                    <button class="cart-item__button" v-bind:data-id="item.id_product" v-on:click="deleteFromCartHandler">Удалить из корзины</button>
                  </div>
        </div>                  
      </div>
  `,
  props: ['visible','price', 'cart'],
  methods: {
    deleteQuantity(e){
      this.$emit('delete-qnt', e);
    },

    addQuantity(e){
      this.$emit('add-qnt', e);
    },

    deleteFromCartHandler(e){
      this.$emit('delete-from-cart', e);
    },

  },
});


Vue.component('goods-list', {
  template: `<div class="goods-list">
                <h3 class="goods-null" v-if="goods.length == 0">Нет данных / Товары не найдены</h3>
                <goods-item v-for="good in goods" :good="good" v-bind:key="good.id_product" v-on:add-to-cart="addToCartHandler">
                </goods-item>
            </div>`, 
  props: ['goods'], // goods = filteredgood
  methods: {
    addToCartHandler(e) {
    this.$emit('add-to-cart2', e) // Генерируем пользовательское событие
    }
  }
});

Vue.component('goods-item', {
  template: `<div class="goods-item">
                <div class="goods-item__img"></div>
                <h3 class="goods-item__title">{{ good.product_name }}
                </h3><p class="goods-item__price">Цена:{{ good.price }} у.е.</p>
                <button class="goods-item-button" v-on:click="addToCartHandler" v-bind:id="good.id_product">Добавить</button>   
            </div>
`,
  props: ['good'],
  methods: {
    addToCartHandler(e) {
    this.$emit('add-to-cart', e) // Генерируем пользовательское событие
    }
  }
});

Vue.component('searching',{
  template: '<div><input id="search" v-model="searchLine" v-on:input="isSearchHandler" placeholder="Фильтр товаров.."> </div>',
  data() {
    return {
      searchLine: '',
    }
  },
  methods: {
    isSearchHandler(e) {
      this.$emit('searchitem', this.searchLine) // Генерируем пользовательское событие
    }
  }
});

const vue = new Vue({
  el: "#app",
  data: {
    url: `${API_URL}/catalogData.json`,
    goods: [],
    filteredGoods: [],
    cartItems: [],
    searchLine: '',
    isVisibleCart: false,
  },
  computed:{
    //считает количество товаров в корзине
    summCartItemsquant(){
      let summQnt = 0;
      this.cartItems.forEach(({qnt}) => { summQnt += qnt});
      return summQnt;        
    },      
    

    totalPrice(){
      let summ = 0;
      this.cartItems.forEach(({price,qnt}) => { summ += (qnt*price)});
      return summ;
    }
  },
  methods: {

    searchHandler(){
      if(this.searchLine === '') {
        this.filteredGoods = this.goods;
      }
      const regexp = new RegExp(this.searchLine, 'gi');
      this.filteredGoods = this.goods.filter((good) => regexp.test(good.product_name));
    },
    
    addToCartHandler(e) {      
      const id = e.target.id;
      
      let indexCart = this.cartItems.findIndex((item) => item.id_product == id);
      console.log(indexCart);
      if(indexCart==-1) {
        const good = this.goods.find((item) => item.id_product == id);        
        let {product_name, price} = good; 
        this.cartItems.push({product_name: product_name, price: price, id_product: id, qnt: 1});
      } else {
        console.log(this.cartItems[indexCart]);
        this.cartItems[indexCart].qnt = parseInt(this.cartItems[indexCart].qnt)+1;
      }      
      console.log(this.cartItems);
      this.isVisibleCart = true; // делаем корзину видимой при любой покупке
    },
    // удалить товар корзины
    deleteFromCartHandler(e){
      const id = e.target.dataset.id;
      let ind = this.cartItems.findIndex((item) => item.id_product == id);
      this.cartItems.splice(ind, 1);
    },
    
    // показать корзину
    showCart(){

      this.isVisibleCart = !this.isVisibleCart;    
    },

    //уменьшить количество товара в корзине
    deleteQuantity(e){
      const id = e.target.dataset.qntid;
      let indexCart = this.cartItems.findIndex((item) => item.id_product == id);
      if (this.cartItems[indexCart].qnt >1){
        this.cartItems[indexCart].qnt = parseInt( this.cartItems[indexCart].qnt) - 1;
      } else {
        this.cartItems.splice(indexCart, 1);
      }        
    },
     
    //увеличить количество товара в корзине
    addQuantity(e){
      const id = e.target.dataset.qntid;
      let indexCart = this.cartItems.findIndex((item) => item.id_product == id);
      this.cartItems[indexCart].qnt = parseInt( this.cartItems[indexCart].qnt) +1;
    },

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
    },

    fetchPromise() {
      return new Promise((resolve, reject) => {
        this.fetch(reject, resolve)
      }) 
    }
  },
  mounted(){
    this.fetchPromise()
    .then(data => {
      this.goods = data;
      this.filteredGoods = data;
    })
  }
})

//function openCart () {
//  console.log('cart');
//}
//
//const goodsList = new GoodsList();
//
//const form = document.querySelector('form');
//const userName = document.querySelector('.name');
//const userNameError = document.querySelector('.name__error');
//const userTel = document.querySelector('.tel');
//const userTelError = document.querySelector('.tel__error');
//const userEmail = document.querySelector('.email');
//const userEmailError = document.querySelector('.email__error');
//
//const regexName = /^([a-z\s]+|[а-яё\s]+)$/i; //валидация имени
//const regexTel = /\+7|8\d{3}(\d){7}/; //валидация номера телефона
//const regexEmail = /^(\w+\.?-?\w*@\w+\.(ru|com))$/i; //валидация емейла
//
//form.addEventListener('submit', () => {
//  if(regexName.test(userName.value) && regexTel.test(userTel.value) && regexEmail.test(userEmail.value)) {
//    alert('Ваше обращение зарегистрированно');
//  }
//  if (!regexName.test(userName.value)) {
//    userName.style.border='1px solid #DA0101';
//    userNameError.style.display='block';
//  } else {
//    userName.style.border='1px solid green';
//    userNameError.style.display='none';
//  }
//  if (!regexTel.test(userTel.value)) {
//    userTel.style.border='1px solid #DA0101';
//    userTelError.style.display='block';
//  } else {
//    userTel.style.border='1px solid green';
//    userTelError.style.display='none';
//  }
//  if (!regexEmail.test(userEmail.value)) {
//    userEmail.style.border='1px solid #DA0101';
//    userEmailError.style.display='block';
//  } else {
//    userEmail.style.border='1px solid green';
//    userEmailError.style.display='none';
//  }
//});



const a = 5;
const b = prompt("dsa");
console.log(a==b);
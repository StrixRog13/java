const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";

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
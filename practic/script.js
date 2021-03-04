const goods = [
    { title: 'Shirt', price: 150 },
    { title: 'Socks', price: 50 },
    { title: 'Jacket', price: 350 },
    { title: 'Shoes', price: 250 },
];


const $goodsList = document.querySelector('.goods-list');
  
const renderGoodsItem = ({ title, price }) => {
    return `<div><div class="goods-item">
    <img src="200x150.jpg" alt="some img"> 
    <h3>${title}</h3>
    <p>${price}$</p>
    <button class="cart-button">Купить</button>
    </div>
    </div>`;
};
  
/*

const renderGoodsList = (list) => {
let goodsList = list.map(item => renderGoodsItem(item.title, item.price));
document .querySelector( '.goods-list' ).innerHTML = goodsList;
}

renderGoodsList(goods);

*/

const renderGoodsList = (list = goods) => {
    let goodsList = list.map(
            item => renderGoodsItem(item)
        ).join('');

    $goodsList.insertAdjacentHTML('beforeend', goodsList);
}
  
renderGoodsList();
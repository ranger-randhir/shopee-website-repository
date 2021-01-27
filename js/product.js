const shopCenter = document.querySelector(".shop-center");
const cartDOM = document.querySelector(".whole-cart");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-count");
const toggleCart = document.querySelector(".cart-overlay");
const clearBtn = document.querySelector(".clear-cart");
const productCenter = document.querySelector(".product-center");
const latestCenter = document.querySelector(".latest-center");
const recentCenter = document.querySelector(".recent-center");
const catContainer = document.querySelector(".sort-category");


let cart =[];
let buttonsDOM = [];
let specialProducts = [];
let filterBtns = [];
let featuredProducts = [];



const getProducts = async () => {
    const res = await fetch("products.json");
    const data = await res.json();
    const products = data.products;
    return products;
};


class Products{
    async getProducts(){
        try{
            let result = await fetch("products.json");
            let data = await result.json();
            let products = data.products;
            return products;
        }
        catch{
            console.log(error);
        }
    }
}

class UI{
    displayProducts(products,center){
        let display="";
        products.forEach(product=>
            display += `<div class="product">
            <div class="product-header">
                <img src=${product.image} alt="Product">
            </div>
            <button class="bag-btn" data-id=${product.id}><i class="fas fa-shopping-cart"></i>Add to Cart </button>
            <div class="product-footer">
                <h3>${product.title}</h3>
               
                <div class="product-price">
                    <h4>$${product.price}</h4>
                </div>
            </div>
        </div>`
        )
        center.innerHTML = display;
    }

    addCartItem(item){
        
        const div = document.createElement("div");
        div.classList.add('cart-item');
        div.innerHTML = `
            <img src=${item.image} alt="">
            <div>
                <h3>${item.title}</h3>
                <p>$${item.price}</p>
                <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div class="item-count">
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">1</p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
        `

        cartDOM.appendChild(div);
    }
    getFilterBtns() {
        filterBtns = [...document.querySelectorAll(".filter-btn")];
    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button=>{
            let id = button.dataset.id;
            
            let inCart = cart.find(item=> item.id==id);
            if(inCart){
                button.innerText = 'In Cart';
                button.classList.add("deactive");
                button.disabled = true;
            }
            button.addEventListener("click",event => {
                event.target.innerText = "In Cart";
                event.target.classList.add("deactive");
                event.target.disabled = true;
                let cartItem = {...Storage.getProducts(id),amount:1};
                cart = [...cart,cartItem];
                Storage.saveCart(cart);
                this.setCartValues(cart);

                this.addCartItem(cartItem);
                this.showCart();
            })

        })
    }

    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price*item.amount;
            itemsTotal += item.amount;
        })

        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }

    showCart(){
        toggleCart.classList.toggle("show");
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }

    setUpAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
    }

    cartLogic(){
        clearBtn.addEventListener('click',()=>{
            this.clearCart();
        });
        cartDOM.addEventListener("click",event=>{
            if(event.target.classList.contains('remove-item')){
                let removeItem = event.target;
                let id =removeItem.dataset.id;
                cartDOM.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            }
            else if(event.target.classList.contains('fa-chevron-up')){
                let addAmount = event.target;
                let id = addAmount.dataset.id;

                let tempItem = cart.find(item => item.id==id);
                tempItem.amount+=1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }
            else if(event.target.classList.contains('fa-chevron-down')){
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;

                let tempItem = cart.find(item => item.id==id);

                tempItem.amount-=1;
                if(tempItem.amount>0){
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }
                else{
                    cartDOM.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                    let tempCart = Storage.getCart();
                    if(tempCart.length==0){
                        this.showCart();
                    }
                }
            }
        })
    }

    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartDOM.children.length>0){
            cartDOM.removeChild(cartDOM.children[0]);
        }
        this.showCart();
    }

    removeItem(id){
        cart = cart.filter(item => item.id != id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled =false;
        button.classList.remove("deactive");
        button.innerHTML = `<i class="fas fa-shopping-cart"></i> Add To cart`;
    }

    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id == id);
    }
}


class Storage {
    static saveProducts(products){
        localStorage.setItem("products",JSON.stringify(products));
    }

    static getProducts(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id== id);
    }
    
    static saveCart(cart){
        localStorage.setItem("cart",JSON.stringify(cart));
    }

    static getCart(){
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

window.addEventListener("DOMContentLoaded", async()=>{
    const products = new Products();
    const ui  = new UI();

    ui.setUpAPP();

    products.getProducts().then(products =>{
        const defaultProducts = filterArray(products,"trend");
        const latestProducts = filterArray(products,"latest");
        const recentProducts = filterArray(products,'recent');
        ui.displayProducts(defaultProducts,productCenter);
        ui.displayProducts(latestProducts,latestCenter);
        ui.displayProducts(recentProducts,recentCenter);
        ui.displayProducts(products,shopCenter);
        Storage.saveProducts(products);
    }).then(()=>{
        ui.getBagButtons();
        ui.cartLogic();
    });
})


const filterArray = (products,type) =>{
    return products.filter(product=> product.category == type);
}

catContainer.addEventListener("click", async e=>{
    const catProducts = new Products();
    const ui = new UI();
    const target = e.target.closest(".section-title");
    if (!target) return;
    const id = target.dataset.id;
    ui.setUpAPP();
    catProducts.getProducts().then(products =>{
            if(id=="special"){
                specialProducts = filterArray(products,'special');
                ui.displayProducts(specialProducts,productCenter);
            }
            else if(id=="featured"){
                featuredProducts = filterArray(products,'featured');
                ui.displayProducts(featuredProducts,productCenter);
            }
            else{
                ui.displayProducts(filterArray(products,'trend'),productCenter);
            }
            productCenter.classList.add("animate__animated", "animate__backInUp");
            setTimeout(() => {
                productCenter.classList.remove(
                "animate__animated",
                "animate__backInUp"
                );
            }, 1000);
            filterBtns.forEach(btn=> btn.classList.remove("active"));
            target.classList.add("active");
    }).then(()=>{
        ui.getFilterBtns();
        ui.getBagButtons();
        ui.cartLogic();
    })
})
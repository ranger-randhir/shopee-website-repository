const nav =document.querySelector(".nav-menu");
const navigation = document.querySelector(".navigation");
const openBtn = document.querySelector(".hamburger");
const closeBtn = document.querySelector(".close");
const openCart = document.querySelector(".cart");
const closeCart =document.querySelector(".close-cart");
const cartOverlay = document.querySelector(".cart-overlay");


openCart.addEventListener("click",()=>{
        cartOverlay.classList.toggle("show");
})

closeCart.addEventListener("click",()=>{
        cartOverlay.classList.toggle("show");
})

openBtn.addEventListener("click",()=>{
        navigation.classList.toggle("show");
        nav.classList.toggle("show");
        document.body.classList.toggle("show");
})

closeBtn.addEventListener("click",()=>{
        navigation.classList.toggle("show");
        nav.classList.toggle("show");
        document.body.classList.toggle("show");
})

const navBar = document.querySelector(".navigation");
const navHeight = navBar.getBoundingClientRect().height;

window.addEventListener("scroll",()=>{
        const scrollHeight = window.pageYOffset;
        if(navHeight < scrollHeight){
                navBar.classList.add("fix-nav");
        }else{
                navBar.classList.remove("fix-nav");
        }
});

const popup = document.querySelector(".popup");
const popupClose = document.querySelector(".popup-close");


popupClose.addEventListener("click",()=>{
        popup.classList.remove("show");
});

window.addEventListener("load",()=>{
        setTimeout(()=>{
               popup.classList.add("show")
        },4000);
})

window.addEventListener("load",()=>{
        const loader = document.querySelector("#pre-loader");
        setTimeout(()=>{
                loader.classList.add("hide");
        },3000);
});

const links = [...document.querySelectorAll(".scroll-link")];

links.map(link => {
        link.addEventListener("click", e=>{
                e.preventDefault();

                const id = e.target.getAttribute("href").slice(1);
                const element = document.getElementById(id);
                const fixNav = navBar.classList.contains("fix-nav");
                let position = element.offsetTop - navHeight;


                if(!fixNav){
                        position = position - navHeight;
                }

                window.scrollTo({
                        top:position,
                        left:0,
                });

                navigation.classList.remove("show");
                nav.classList.remove("show"),
                document.body.classList.remove("show");
        })
})
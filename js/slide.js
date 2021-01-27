const glide1 = document.getElementById("glide1");
const glide2 = document.getElementById("glide2");

if (glide1)
  new Glide(glide1, {
    type: "carousel",
    startAt: 0,
    autoplay: 3000,
    hoverpause: true,
    perView: 1,
    animationDuration: 800,
    animationTimingFunc: "linear",
  }).mount();

if(glide2)
  new Glide(glide2,{
    type:"carousel",
    startAt:0,
    perView:5,
    hoverpause:true,
    autoplay:2000,
    animationDuration:800,
    animationTimingFunc: "linear",
    breakpoints: {
      1200: {
        perView: 3,
      },
      768: {
        perView: 2,
      }
    }
  }).mount();





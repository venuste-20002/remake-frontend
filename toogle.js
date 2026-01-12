const btn = document.getElementById("nav");
const burger1 = document.getElementById("burger1");
const burger2 = document.getElementById("burger2");
const burger3 = document.getElementById("burger3");
const burger = document.getElementsByClassName("burger");

const resetBurgers = () => {
  burger1.style.transform = "rotate(0deg)";
  burger1.style.position = "static";
  burger1.style.display = "block";
  burger2.style.transform = "rotate(0deg)";
  burger2.style.position = "static";
  burger2.style.display = "block";
  burger2.style.transition = "all 0.3s ease-in";
  burger[0].classList.add("shadow");
  burger3.style.transform = "rotate(0deg)";
  burger3.style.position = "static";
  burger3.style.display = "block";
};
const handleBurger1 = () => {
  burger1.style.transform = "rotate(-45deg)";
  burger1.style.transition = "all 0.3s ease-in";
  burger1.style.position = "absolute";
  burger1.style.top = "15px";
  burger1.style.width = "30px";
};

const handleBurger3 = () => {
  burger3.style.transform = "rotate(45deg)";
  burger3.style.transition = "all 0.3s ease-in";
  burger3.style.position = "absolute";
  burger3.style.top = "15px";
  burger3.style.width = "30px";
};

const handleBurger2 = () => {
  burger2.style.transition = "display 0.3s ease-in";
  burger2.style.display = "none";
};

const handleBurger = () => {
  burger[0].classList.remove("shadow");
  burger[0].style.transition = "all 0.3s ease-in";
};

let div = document.getElementById("reveal");
div.style.left = "-300px";
const toggleNavBar = () => {
  //alert(div.textContent);

  if (div.style.left === "-300px") {
    div.style.left = "0";
    handleBurger();
    handleBurger1();
    handleBurger3();
    handleBurger2();

    console.log("Set to 0 (SHow)");
  } else {
    div.style.left = "-300px";
    console.log("Set to -250px (Hide) ");
    resetBurgers();
  }
};

const hideNav = () => {
  div.style.left = "-300px";
  resetBurgers();
};

btn.addEventListener("click", () => {
  console.log("clicked");
});

const showUserName = document.getElementById("show-username");
const showUserRole = document.getElementById("show-role");
let token;
let decodedToken;
const goHome = document.getElementById("go-home");

// go Home
goHome.addEventListener("click", () => {
  window.location = "./index.html"
  console.log("Going home...")
})


if (!localStorage.getItem("token")) {
  window.location = "./login.html";
}else {
  token = localStorage.getItem("token");
  decodedToken = JSON.parse(atob(token.split(".")[1]));
  showUserName.innerHTML = decodedToken.name
  showUserRole.innerHTML = `"${decodedToken.role}"`
  
}



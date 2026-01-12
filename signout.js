document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("signout");
  button.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location = "./login.html";
    //alert("yo");
  });
});

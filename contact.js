const signOut = () => {
  localStorage.removeItem("token");
  location.reload();
};

const toDashboard = () => {
  window.location = "./dashboard.html";
};

let token;
let decodedToken;

let role;

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  const userName = document.getElementById("user-name");
  const userEmail = document.getElementById("user-email");
  const userMessage = document.getElementById("user-message");
  const loading = document.getElementsByClassName("success");
  const loginBtn = document.querySelector("a.login");
  const logoutBtn = document.getElementById("logout");
  const floatingLogout = document.getElementsByClassName("floating-logout");
  const floatingDashboard =
    document.getElementsByClassName("floating-dashboard");
  console.log(floatingDashboard[0]);
  console.log(floatingLogout[0]);
  console.log(logoutBtn);
  console.log(loginBtn);

  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
    decodedToken = JSON.parse(atob(token.split(".")[1]));
    role = decodedToken.role;

    console.log(role);
    console.log(decodedToken);
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    floatingLogout[0].style.display = "block";
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      location.reload();
    });

    if (role !== "user") {
      floatingDashboard[0].style.display = "block";
    }
  }
  function showSuccessMessage(arg, bgColor) {
    let successDiv = document.getElementsByClassName("success");
    successDiv[0].style.backgroundColor = bgColor;
    successDiv[0].innerHTML = arg;
    successDiv[0].style.display = "block";
    userEmail.value = "";
    userMessage.value = "";
    userName.value = "";
    console.log(arg);
  }

  const closeSuccessMessage = () => {
    let successDiv = document.getElementsByClassName("success");
    setTimeout(function () {
      successDiv[0].style.display = "none";
      window.location = "./index.html#about";
    }, 7000);
  };

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let userNameValue = userName.value.trim();
    let userEmailValue = userEmail.value.trim();
    let userMessageValue = userMessage.value.trim();

    const userData = {
      fullname: userNameValue,
      email: userEmailValue,
      message: userMessageValue,
    };

    //let's do the signup process
    // const sendMessageEndpoint ="http://localhost:5000/api/messages";
    const sendMessageEndpoint = "https://remake-backend-dmm6.onrender.com/api/messages";

    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };

    const sendMessages = async () => {
      try {
        showSuccessMessage("...sending", "#0b5ed7");
        const response = await fetch(sendMessageEndpoint, fetchOptions);
        console.log(response);
        if (!response.ok) {
          showSuccessMessage("Fail: " + response.statusText, "#bb2d3b");
          throw new Error("Error sending message: " + response.statusText);
        } else {
          showSuccessMessage("Success. Thank you!", "#198754");
          closeSuccessMessage();
        }
      } catch (e) {
        console.log(`Something went wrong: ${e}`);
        showSuccessMessage(`${e}`, "#bb2d3b");
        console.log(e);
      }
    };

    sendMessages();

    // showSuccessMessage();
  });

  //subscribe
  const subscribeForm = document.getElementById("subs-form");
  const notYou = document.getElementsByClassName("not-you");
  const logoutSpan = document.getElementsByClassName("logout-span");
  const nameField = document.getElementById("full-name-sub");
  const emailField = document.getElementById("email-sub");
  const toggleSubModal = document.getElementById("subscribe");
  const subModal = document.getElementById("subscribe-modal");
  const closeSubModal = document.getElementById("x");
  const subStatus = document.getElementsByClassName("sub-status");
  console.log(subStatus[0]);

  const showStatus = (text, color, display) => {
    subStatus[0].style.display = display;
    subStatus[0].style.backgroundColor = color;
    subStatus[0].innerHTML = text;
  };

  const reload = () => {
    setTimeout(() => {
      window.location = "./blog.html";
    }, 5000);
  };
  const closeModal = () => {
    subModal.style.display = "none";
  };

  const openModal = () => {
    subModal.style.display = "block";
  };

  toggleSubModal.addEventListener("click", () => {
    openModal();
  });

  closeSubModal.addEventListener("click", () => {
    closeModal();
  });

  logoutSpan[0].addEventListener("click", () => {
    console.log("clicked");
    localStorage.removeItem("token");
    location.reload();
  });

  if (token) {
    const name = decodedToken.name;
    const email = decodedToken.email;
    nameField.value = name;
    emailField.value = email;
    nameField.disabled = true;
    emailField.disabled = true;

    notYou[0].style.display = "block";
  } else {
    notYou[0].style.display = "none";
  }

  subscribeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userData = {
      fullname: nameField.value.trim(),
      email: emailField.value.trim(),
    };
    console.log(userData);

    //attempt adding subscriber
    // const addSubscriberEndpoint = "http://localhost:5000/api/subscribe";
    const addSubscriberEndpoint = "https://remake-backend-dmm6.onrender.com/api/subscribe";
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };

    const AddSubscriber = async () => {
      try {
        showStatus("Saving", "#0b5ed7", "block");
        const response = await fetch(addSubscriberEndpoint, fetchOptions);
        if (!response.ok) {
          console.log(response);
          if (response.status == "409") {
            console.log("Duplicate");
            showStatus("Already subscribed.", "#bb2d3b", "block");
            reload();
          } else if (response.status == "400") {
            console.log("Joi validation error");
            showStatus(
              "Validation error: Check your Inputs",
              "#bb2d3b",
              "block"
            );
          } else if (response.status == "500") {
            console.log("Server error");
            showStatus(
              "Server Erro: Please Try again later",
              "#bb2d3b",
              "block"
            );
          } else {
            console.log("Can't tell: Need to verify");
            showStatus("Something went wrong", "#bb2d3b", "block");
          }
        } else {
          showStatus("Thank you for subscribing!", "#198754", "block");
          reload();
        }
      } catch (e) {
        console.log("something went wrong: " + e);
      }
    };

    AddSubscriber();
  });
});

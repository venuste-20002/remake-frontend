document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const signupSuccessDiv = document.getElementById("signup-success");

  const signupMessage = (arg, text, color) => {
    arg.style.display = "block";
    arg.style.backgroundColor = color;
    arg.innerHTML = text;
  };

  const resetField = (arg1, arg2) => {
    (arg1.value = ""), (arg2.value = "");
  };

  const redirect = (time, path) => {
    setTimeout(function () {
      //window.location = "./login.html";
      window.location = path;
    }, time);
  };

  let obj = {
    name: null,
    password: null,
  };

  const setError = (element, message) => {
    const field = element.parentElement;
    const errorField = field.querySelector(".error");
    errorField.innerHTML = message;
    errorField.style.marginTop = "5px";
    field.classList.add("error");
    field.classList.remove("success");
  };

  const setSuccess = (element) => {
    const field = element.parentElement;
    const errorField = field.querySelector(".error");
    errorField.innerText = "";
    field.classList.remove("error");
    field.classList.add("success");
  };

  const isValidEmail = (arg) => {
    const regExp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(arg);
  };

  const checkTruthy = (arg) => {
    for (let key in arg) {
      if (!arg[key]) {
        return false;
      }
    }

    return true;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    validateInputs();
    if (checkTruthy(obj) === true) {
      //signupMessage(signupSuccessDiv,"Good job", "#198754")
      // const loginEndpoint = "http://localhost:5000/api/login";
      const loginEndpoint = "https://remake-backend-dmm6.onrender.com/api/login";
      const userData = {
        email: email.value,
        password: password.value,
      };
      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      };

      const startLogin = async () => {
        try {
          signupMessage(signupSuccessDiv, "... processing", "#0b5ed7");
          const response = await fetch(loginEndpoint, fetchOptions);
          if (!response.ok) {
            if (response.status === 401) {
              signupMessage(signupSuccessDiv, "Wrong credentials", "#bb2d3b");
              resetField(email, password);
            } else if (response.status === 404) {
              signupMessage(signupSuccessDiv, "User not found", "#bb2d3b");
              resetField(email, password);
            } else {
              signupMessage(
                signupSuccessDiv,
                "Check credentials format",
                "#bb2d3b"
              );
              resetField(email, password);
            }
            throw new Error("Something went wrong");
          }

          signupMessage(signupSuccessDiv, "Success", "#198754");
          const data = await response.json();
          const token = data.token;
          localStorage.setItem("token", token);
          const decodedToken = JSON.parse(atob(token.split(".")[1]));

          console.log(decodedToken.role);
          if (decodedToken.role === "user") {
            redirect(3000, "./blog.html");
          } else if (decodedToken.role === "superadmin") {
            redirect(3000, "./dashboard.html");
          } else if (decodedToken.role === "blogger") {
            redirect(3000, "./blog-dashboard.html");
          } else {
            redirect(3000, "./dashboard.html");
          }
          // redirect(3000, "./blog.html")
        } catch (e) {
          console.log(`Something went wrong: ${e}`);
        }
      };

      startLogin();
    }
  });

  const validateInputs = () => {
    let emailText = email.value.trim();
    let passwordText = password.value.trim();

    //validate email
    if (emailText === "") {
      setError(email, "Please enter your email");
      obj.name = false;
    } else if (isValidEmail(emailText) === false) {
      setError(email, "Invalid email");
      obj.name = false;
    } else {
      setSuccess(email);
      obj.name = true;
    }

    //validate password
    if (passwordText === "") {
      setError(password, "Please enter your password");
      obj.password = false;
    } else {
      setSuccess(password);
      obj.password = true;
    }
  };
});

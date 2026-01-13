document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const fullName = document.getElementById("names");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const verifyPassword = document.getElementById("confirmPassword");
  const signupSuccessDiv = document.getElementById("signup-success");

  const signupMessage = (arg, text, color) => {
    arg.style.display = "block";
    arg.style.backgroundColor = color;
    arg.innerHTML = text;
  };

  const redirect = (time, path) => {
    setTimeout(function () {
      //window.location = "./login.html";
      window.location = path;
    }, time);
  };

  let obj = {
    name: null,
    email: null,
    password: null,
    confirmPassword: null,
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

  // password validator helper function
  const isValidPassword = (arg) => {
    const regExp =
      /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    return regExp.test(arg);
  };

  //email validator helper function
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

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    validateInputs();
    if (checkTruthy(obj) === true) {
      //alert("We are good to go!")

      //let's do the signup process
      const signupEndpoint = "https://remake-backend-dmm6.onrender.com/api/register";

      const userData = {
        name: fullName.value,
        email: email.value,
        password: password.value,
        verifyPassword: password.value,
      };

      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      };

      const startSignup = async () => {
        try {
          signupMessage(signupSuccessDiv, "...Signing you up", "#0b5ed7");
          const response = await fetch(signupEndpoint, fetchOptions);
          console.log(response);
          if (!response.ok) {
            if (response.status === 400) {
              signupMessage(
                signupSuccessDiv,
                "...Email already exist",
                "#bb2d3b"
              );
              email.value = "";
              obj = {
                name: null,
                email: null,
                password: null,
                confirmPassword: null,
              };
            } else if (response.status === 500) {
              signupMessage(signupSuccessDiv, "...Server error", "#bb2d3b");
            }
            throw new Error("Error signing up: " + response.statusText);
          }
          signupMessage(signupSuccessDiv, "Success! Now login...", "#198754");
          const data = await response.json();
          redirect(5000, "./login.html");
          console.log(data);
        } catch (e) {
          console.log(`Something went wrong: ${e}`);
        }
      };

      startSignup();
    }
  });

  const validateInputs = () => {
    let fullnameText = fullName.value.trim();
    let emailText = email.value.trim();
    let passwordText = password.value.trim();
    let verifyPasswordText = verifyPassword.value.trim();

    //validate fullname
    if (fullnameText === "") {
      setError(fullName, "Please enter your fullnames");
      obj.name = false;
    } else if (fullnameText.length < 3 || fullnameText.length > 50) {
      setError(fullName, " failed: Min allowed character 3 to 50");
      obj.name = false;
    } else {
      setSuccess(fullName);
      obj.name = true;
    }

    //validate Email
    if (emailText === "") {
      setError(email, "Please Provide an email");
      obj.email = false;
    } else if (isValidEmail(emailText) == false) {
      setError(email, "Please use a valid email");
      obj.email = false;
    } else {
      setSuccess(email);
      obj.email = true;
    }

    //validate password
    if (passwordText === "") {
      setError(password, "Please choose your password");
      obj.password = false;
    } else if (isValidPassword(passwordText) == false) {
      setError(
        password,
        `<ul class="password-error">
  <li>Minimum password length is 6</li>
  <li>with at least one number</li>
  <li>one uppercase letter</li>
  <li>and one special characte</li>
</ul>`
      );
      obj.password = false;
    } else {
      setSuccess(password);
      obj.password = true;
    }

    //validate verify Password
    if (verifyPasswordText == "") {
      setError(verifyPassword, "Please choose your password");
      obj.confirmPassword = false;
    } else if (passwordText !== verifyPasswordText) {
      setError(verifyPassword, "password mismatch");
      obj.confirmPassword = false;
    } else {
      setSuccess(verifyPassword);
      obj.confirmPassword = true;
    }
  };
});

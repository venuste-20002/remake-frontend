const respTable = document.getElementById("resp-table");
const senderName = document.getElementById("sender-name");
const senderEmail = document.getElementById("sender-email");
const senderContent = document.getElementById("sender-content");
let success = document.getElementById("success");
let form = document.getElementById("view-email");
let closeDeleteMessageModal = document.getElementById("eyo");
let token;
let decodedToken;
const showUserName = document.getElementById("show-username");
const showUserRole = document.getElementById("show-role");
const goHome = document.getElementById("go-home");

// go Home
goHome.addEventListener("click", () => {
  window.location = "./index.html";
  console.log("Going home...");
});

const deleteMsgForm = document.getElementById("delete-msg-form");
let idToDelete = "";
const notification = document.getElementsByClassName("notification");
const handleNotification = (div, text, color) => {
  div.style.display = "block";
  div.innerHTML = text;
  div.style.backgroundColor = color;
};
const deleteMessage = (name, email, content, id) => {
  let emailDiv = document.getElementById("sender-email-del");
  let nameDiv = document.getElementById("sender-name-del");
  let contentDiv = document.getElementById("sender-content-del");
  idToDelete = id;
  emailDiv.value = email;
  nameDiv.value = name;
  contentDiv.value = content;
  openConfirmModal();
  console.log(idToDelete);
};

deleteMsgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const deleteMessagesEndpoint = `https://remake-backend-dmm6.onrender.com/api/messages/${idToDelete}`;
  const fetchOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const performDelete = async () => {
    try {
      handleNotification(notification[0], "Deleting... please wait", "#0b5ed7");
      const response = await fetch(deleteMessagesEndpoint, fetchOptions);
      if (!response.ok) {
        handleNotification(
          notification[0],
          "something went wrong... Please try again later",
          "#bb2d3b"
        );
        setTimeout(() => {
          window.location = "./messages.html";
        }, 2000);

        throw new Error("Error Deleting message: " + response.statusText);
      } else {
        handleNotification(notification[0], "Success", "#198754");
        setTimeout(() => {
          window.location = "./messages.html";
        }, 1000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  performDelete();
});

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
    decodedToken = JSON.parse(atob(token.split(".")[1]));
    showUserName.innerHTML = decodedToken.name;
    showUserRole.innerHTML = `"${decodedToken.role}"`;
  } else {
    window.location = "./login.html";
  }

  if (decodedToken.role === "user") {
    window.location = "./blog.html";
  }

  const listMessages = (arg) => {
    console.log(arg);
    if (arg.length === 0) {
      console.log("data has zero Item");
      respTable.innerHTML = `
        <li class="table-header">
        <div class="col col-1">#</div>
          <div class="col col-2">Sender</div>
          <div class="col col-3">Messages</div>
          <div class="col col-4">Action</div>
        </li>
        <h3 class="empty-blog">Mailbox Empty</h3>`;
    } else {
      console.log("data has more Item");
      console.log(arg.length);
      respTable.innerHTML = `
        <li class="table-header">
            <div class="col col-1">#</div>
            <div class="col col-2">Sender</div>
            <div class="col col-3">Messages</div>
            <div class="col col-4">Action</div>
      </li>`;
      console.log(respTable);

      arg.forEach((item, index) => {
        // console.log(item);
        // console.log(index);
        let newTitle = "";
        //format Title
        const formatTitle = (x) => {
          if (x.length <= 10) {
            return x;
          }

          for (let i = 0; i <= 10; i++) {
            newTitle += x[i];
          }

          newTitle += "...";
          return newTitle;
        };

        let name = item.fullname.toString();
        let email = item.email.toString();
        let content = item.messageContent.toString();
        let id = item._id.toString();

        respTable.innerHTML += `<li class="table-row">
        <div class="col col-1" data-label="#">${index + 1}</div>
                <div class="col col-2" data-label="Sender">${name}</div>
                <div class="col col-3" data-label="Message">${formatTitle(
                  content
                )}</div>
                <div class="col col-4 action-icon" data-label="Action">
                   <i class="fa-solid fa-eye" onClick="showModal('${name}','${email}','${content}')"></i>
                   
                    
   
                    <i  onClick="deleteMessage('${name}','${email}','${content}','${id}')" class="fa-solid fa-trash"></i>
                    
                    
  
                </div>
            </li>`;
      });
    }
  };

  const refresh = document.getElementById("refresh");
  refresh.addEventListener("click", () => {
    getMessages();
  });

  const getMessages = async () => {
    const messagesEndpoint = "https://remake-backend-dmm6.onrender.com/api/messages";
    const fetchOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      respTable.innerHTML = `<h2 class="empty-blog">Loading, Please wait...</h2>`;

      const response = await fetch(messagesEndpoint, fetchOptions);
      const jsonToUse = await response.json();
      const arrayToUse = await jsonToUse.data;
      console.log(arrayToUse);
      console.log(typeof arrayToUse);
      // console.log(await response.json().data);
      // const jsonResponse = await response.json();
      // const data = await jsonResponse.data;
      if (response.ok === false) {
        if (response.status == "403") {
          respTable.innerHTML = `<h2 class="empty-blog">Access Denied</h2>`;
        } else {
          respTable.innerHTML = `<h2 class="empty-blog">Something went wrong</h2>`;
        }
      } else {
        listMessages(arrayToUse);
      }
    } catch (e) {
      console.error(`Error fetching Data: ${e}`);
    }
  };

  getMessages();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendEmail();
});

const handleSubmitReplyToaster = (color, text, display) => {
  success.innerHTML = text;
  success.style.display = display;
  success.style.backgroundColor = color;
};

const sendEmail = () => {
  handleSubmitReplyToaster("#0b5ed7", "Sending...", "block");
  Email.send({
    SecureToken: "2c632859-77ec-4616-8879-7f2917905917",
    To: senderEmail.value,
    From: "developer.purpose@gmail.com",
    Subject: "Thanks for contacting Me",
    Body: document.getElementById("textinput").value.trim(),
  }).then((message) => {
    if (message === "OK") {
      handleSubmitReplyToaster("#198754", "Message delivered!", "block");
      hideSuccess();
    } else {
      handleSubmitReplyToaster("#bb2d3b", message, "block");
      hideSuccess();
    }
    console.log(message);
  });
};

const hideSuccess = () => {
  setTimeout(function () {
    success.style.display = "none";
    hideModal();
    reset();
  }, 5000);
};

//target the Div that has textarea to reply
const replyContainer = document.getElementById("reply");

//target the P element that will be used to reveal replyContainer
const pButton = document.getElementById("p-button");

//Target submit button
const submitButton = document.getElementById("submit");

// Get the icon and tooltip elements

const showReplySection = () => {
  replyContainer.style.display = "block";
  pButton.style.display = "none";
  submitButton.style.display = "block";
};

const reset = () => {
  replyContainer.style.display = "none";
  pButton.style.display = "block";
  submitButton.style.display = "none";
};

const showModal = (name, email, content) => {
  senderName.value = name;
  senderEmail.value = email;
  senderContent.value = content;
  modal.style.display = "block";
};

const hideModal = () => {
  modal.style.display = "none";
  reset();
};

// Get the modal
let modal = document.getElementById("myModal");

// Get the button that opens the modal
let btnModal = document.getElementById("myBtn");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btnModal.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
  reset();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    reset();
  }
};

// Get the modal
let deleteMessageModal = document.getElementById("deleteMessageModal");

closeDeleteMessageModal.addEventListener("click", () => {
  deleteMessageModal.style.display = "none";
});

const openConfirmModal = () => {
  deleteMessageModal.style.display = "block";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == deleteMessageModal) {
    deleteMessageModal.style.display = "none";
  }
};

const resetDelMsg = document.getElementById("reset-del-message");
resetDelMsg.addEventListener("click", () => {
  deleteMessageModal.style.display = "none";
});

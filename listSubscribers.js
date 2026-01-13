//For listing users
let token;
let decodedToken;
const container = document.getElementById("resp-table");
const showUserName = document.getElementById("show-username");
const showUserRole = document.getElementById("show-role");

// go Home
const goHome = document.getElementById("go-home");
goHome.addEventListener("click", () => {
  window.location = "./index.html";
  console.log("Going home...");
});

//Date format
const formatDate = (arg) => {
  const date = new Date(arg);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate;
};

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
    decodedToken = JSON.parse(atob(token.split(".")[1]));
    showUserName.innerHTML = decodedToken.name;
    showUserRole.innerHTML = `"${decodedToken.role}"`;
    console.log(decodedToken);
  }

  if (!localStorage.getItem("token")) {
    window.location = "./login.html";
  }

  if (decodedToken.role === "user") {
    window.location = "./blog.html";
  }

  const subscribersEndpoint = "https://remake-backend-dmm6.onrender.com/api/subscribe";

  const fetchOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const getSubscribers = async () => {
    try {
      container.innerHTML = `<h2 class="empty-blog">Loading, Please wait...</h2>`;
      const response = await fetch(subscribersEndpoint, fetchOptions);
      const jsonResponse = await response.json();
      const data = jsonResponse.data;
      if (!response.ok) {
        if (response.status == "401") {
          container.innerHTML = `<h2 class="empty-blog">Loading, Please wait...</h2>`;
        } else if (response.status == "403") {
          container.innerHTML = `<h2 class="empty-blog">Loading, Please wait...</h2>`;
        } else if (response.status == "404") {
          container.innerHTML = `<h2 class="empty-blog">Loading, Please wait...</h2>`;
        } else {
          container.innerHTML = `<h2 class="empty-blog">Loading, Please wait...</h2>`;
        }
      } else {
        listSubscribers(data);
      }
    } catch (e) {
      console.error("something went wrong: " + e);
    }
  };

  getSubscribers();
});

const listSubscribers = (arg) => {
  const shortEmail = (short) => {
    let longEmail = short;
    let smallEmail = "";
    if (longEmail.length < 10) {
      smallEmail = longEmail;
    } else {
      for (let i = 0; i <= 10; i++) {
        smallEmail += longEmail[i];
      }

      smallEmail += `...`;
    }

    return smallEmail;
  };
  if (arg.length === 0) {
    container.innerHTML = `<h2 class="empty-blog">Empty</h2>`;
  } else {
    console.log(arg);
    container.innerHTML = `
    <li class="table-header">
    <div class="col col-1">#</div>
    <div class="col col-2">Date</div>
    <div class="col col-3">email</div>
    <div class="col col-3">Acton</div>
  </li>`;
    arg.forEach((item, index) => {
      let date1 = formatDate(item.createdAt);
      let date2 = formatDate(item.updatedAt);
      let status = item.subscribeStatus;
      let id = item._id;
      let email = item.email;
      let fullName = item.name;

      container.innerHTML += `
        <li class="table-row">
      <div class="col col-1" data-label="#">${index + 1}</div>   
        <div class="col col-2" data-label="date">${formatDate(
          item.createdAt
        )}</div>
        <div class="col col-3" data-label="email">${shortEmail(
          item.email
        )}</div>
        <div class="col col-3 action-icon" data-label="Action">
        <i  onClick="viewSubscriber('${date1}','${date2}','${id}','${email}','${fullName}','${status}')" class="fa-solid fa-eye"></i>
        <i  onClick="editSubscriber('${id}','${email}','${fullName}','${status}')" class="fa-solid fa-pen-to-square"></i>
        <i  onClick="deleteSubscriber()" class="fa-solid fa-trash"></i>
        </div>
    </li>
        `;
    });
  }
};
// handle view modal
const viewUserModal = document.getElementById("myModal");
const closeElement = document.getElementsByClassName("close");
const subDate1 = document.getElementById("sub-date-1");
const subDate2 = document.getElementById("sub-date-2");
const subId = document.getElementById("sub-id");
const subEmail = document.getElementById("sub-email");
const subName = document.getElementById("sub-name");
const subStatus = document.getElementById("sub-status");
closeElement[0].addEventListener("click", () => {
  viewUserModal.style.display = "none";
});

const viewSubscriber = (date1, date2, id, email, fullName, status) => {
  viewUserModal.style.display = "block";
  subDate1.value = date1;
  subDate2.value = date2;
  subId.value = id;
  subEmail.value = email;
  subName.value = fullName;
  subStatus.value = status == "true" ? "Active" : "Inactive";
};

//handle Edit Modal
const subId2 = document.getElementById("sub-id-2");
const subEmail2 = document.getElementById("sub-email-2");
const subName2 = document.getElementById("sub-name-2");
const subStatus2 = document.getElementById("sub-status-2");
const currentStatus2 = document.getElementById("current-status");
const EditSubscriberModal = document.getElementById("myEditModal");
const updateNotification = document.getElementById("update-notification");

const editSubForm = document.getElementById("edit-subscriber-form");
closeElement[1].addEventListener("click", () => {
  EditSubscriberModal.style.display = "none";
});

const showNot = (text, color) => {
  updateNotification.innerHTML = text;
  updateNotification.style.display = "block";
  updateNotification.style.backgroundColor = color;
};

const redirect = () => {
  setTimeout(() => {
    location.reload();
  }, 2000);
};
const editSubscriber = (id, email, fullName, status) => {
  EditSubscriberModal.style.display = "block";
  subId2.value = id;
  subEmail2.value = email;
  subName2.value = fullName;
  currentStatus2.value = status == "true" ? "subscribed" : "Unsubscribed";

  editSubForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const updateSub = async () => {
      const statusData = {
        status: subStatus2.value,
      };
      const updateSubEndpoint = `https://remake-backend-dmm6.onrender.com/api/subscribe/${id}`;
      const fetchOptions = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statusData),
      };
      try {
        showNot("Updating...", "#0b5ed7");
        const response = await fetch(updateSubEndpoint, fetchOptions);
        if (!response.ok) {
          showNot("Fail", "#bb2d3b");
          redirect();
        } else {
          showNot("Success", "#198754");
          redirect();
        }

        console.log("edited");
      } catch (e) {
        console.log("something is off: " + e);
      }
    };

    updateSub();
  });
};

//handdle Delete Modal
const deleteSubscriberModal = document.getElementById("deleteMessageModal");
closeElement[2].addEventListener("click", () => {
  deleteSubscriberModal.style.display = "none";
});
const deleteSubscriber = () => {
  deleteSubscriberModal.style.display = "block";
  console.log("delete");
};

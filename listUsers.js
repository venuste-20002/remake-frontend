//For listing users
let token;
let decodedToken;
const usersContainer = document.getElementById("display");
const showUserName = document.getElementById("show-username");
const showUserRole = document.getElementById("show-role");
const goHome = document.getElementById("go-home");
console.log(showUserName);

// go Home
goHome.addEventListener("click", () => {
  window.location = "./index.html";
  console.log("Going home...");
});

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

  const usersEndpoint = "https://my-brand-atlp-be.onrender.com/api/users";
  // const usersEndpoint = "http://localhost:5025/api/users";
  const fetchOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const getUser = async () => {
    try {
      console.log("loading");
      usersContainer.innerHTML = `<h2 class="empty-blog">Loading, Please wait...</h2`;
      const response = await fetch(usersEndpoint, fetchOptions);
      console.log(response);
      if (!response.ok) {
        if (response.status == "403") {
          usersContainer.innerHTML = `<h2 class="empty-blog">Access Denied</h2`;
        } else {
          usersContainer.innerHTML = `<h2 class="empty-blog">Something went wrong</h2`;
        }
      } else {
        const jsonResponse = await response.json();
        const data = await jsonResponse.data;
        console.log(data);
        listUsers(data);
      }
    } catch (e) {
      console.error(`Error fetching Data`);
    }
  };

  getUser();
});

const listUsers = (arg) => {
  usersContainer.innerHTML = `
  <li class="table-header">
  <div class="col col-1">#</div>
  <div class="col col-2">Joined on</div>
  <div class="col col-3">Name</div>
  <div class="col col-4">Acton</div>
</li>`;

  if (arg.length === 0) {
    usersContainer.innerHTML += `<h2 class="empty-blog">No User found</h2>`;
  } else {
    console.log(arg);
    arg.forEach((item, index) => {
      const date = formatDate(item.createdAt);
      let name = item.name.toString();
      name = name.replace(/'/g, "");
      let role = item.role.toString();
      let id = item._id.toString();
      let email = item.email.toString();

      usersContainer.innerHTML += `<li class="table-row">
      <div class="col col-1" data-label="Joined on">${index + 1}</div>   
        <div class="col col-2" data-label="Joined on">${date}</div>
        <div class="col col-3" data-label="Name">${item.name}</div>
        <div class="col col-4 action-icon" data-label="Action">
           <i onClick="openViewUserModal('${id}','${name}','${role}','${date}','${email}')" class="fa-solid fa-eye"></i>
            <i  onClick ="openEditUserModal('${name}','${role}','${id}')" class="fa-solid fa-pen-to-square"></i>
            <i onClick="openDelModal('${name}','${role}','${id}')" class="fa-solid fa-trash"></i>
        </div>
    </li>`;
    });
  }
};

const delModal = document.getElementById("myDeleteModal");
const closeModal = () => {
  delModal.style.display = "none";
  //clearInputs();
};

let idDel = document.getElementById("show-id");

let nameDel = document.getElementById("show-the-name");

let roleDel = document.getElementById("show-the-role");

let delUserForm = document.getElementById("delete-user-form");

const toaster = (arg, text, color) => {
  arg.style.display = "block";
  arg.style.backgroundColor = color;
  arg.innerHTML = text;
};

const delay = (arg) => {
  setTimeout(() => {
    arg();
    window.location = "./users.html";
  }, 3000);
};

let delUserToaster = document.getElementById("del-user-toaster");

console.log(delUserToaster);
const openDelModal = (name, role, id) => {
  delModal.style.display = "block";
  // console.log(name, role, id);
  idDel.value = id;
  nameDel.value = name;
  roleDel.value = role;
};

delUserForm.addEventListener("submit", (e) => {
  const id = idDel.value;
  e.preventDefault();

  const userEndpoint = `https://my-brand-atlp-be.onrender.com/api/users/${id}`;
  const fetchOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const deleteUser = async () => {
    try {
      toaster(delUserToaster, "Deleting...", "#0b5ed7");
      const response = await fetch(userEndpoint, fetchOptions);
      if (!response.ok) {
        toaster(delUserToaster, "Error, Something went wrong", "#bb2d3b");
        delay(closeModal);
      } else {
        toaster(delUserToaster, "User Deleted succssefully", "#198754");
        delay(closeModal);
        //window.location = "./users.html";
      }
    } catch (e) {
      console.error(e);
    }
  };

  deleteUser();
});

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  closeModal();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == delModal) {
    closeModal();
  }
};

//Modal for View users
const viewUserModal = document.getElementById("view-user-modal");

let closeViewUserModalBtn = document.getElementsByClassName("close")[1];

const closeViewUserModal = () => {
  viewUserModal.style.display = "none";
};

const openViewUserModal = (id, fullName, role, date, email) => {
  viewUserModal.style.display = "block";
  document.getElementById("show-id-2").value = id;
  document.getElementById("show-the-name-2").value = fullName;
  document.getElementById("show-the-email-2").value = email;
  document.getElementById("show-the-role-2").value = role;
  document.getElementById("show-the-date-2").value = date;
};

closeViewUserModalBtn.addEventListener("click", () => {
  closeViewUserModal();
});

window.onclick = function (event) {
  if (event.target == viewUserModal) {
    closeViewUserModal();
  }
};

//Modal for Edit users
const editUserModal = document.getElementById("edit-user-modal");

let closeEditUserModalBtn = document.getElementsByClassName("close")[2];

const closeEditUserModal = () => {
  editUserModal.style.display = "none";
};

const openEditUserModal = (name, role, id) => {
  editUserModal.style.display = "block";
  document.getElementById("show-the-name-3").value = name;
  document.getElementById("select-role").value = role;
  document.getElementById("show-the-id-3").value = id;
  // document.getElementById("show-the-role-2").value = role;
  // document.getElementById("show-the-date-2").value = date;
};

closeEditUserModalBtn.addEventListener("click", () => {
  closeEditUserModal();
});

window.onclick = function (event) {
  if (event.target == editUserModal) {
    editUserModal.style.display = "none";
  }
};

const editUserForm = document.getElementById("edit-user-form");
editUserForm.addEventListener("submit", (e) => {
  const id = document.getElementById("show-the-id-3").value;
  const updateUserData = {
    name: document.getElementById("show-the-name-3").value,
    role: document.getElementById("select-role").value,
    password: document.getElementById("show-the-password-3").value,
    verifyPassword: document.getElementById("show-the-password-3").value,
  };
  console.log(id);
  e.preventDefault();
  console.log("Yay");
  const toEdit = `https://my-brand-atlp-be.onrender.com/api/users/${id}`;
  const fetchOptions = {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateUserData),
  };

  const editToaster = (text, color) => {
    document.getElementById("edit-user-toaster").style.display = "block";
    document.getElementById("edit-user-toaster").innerHTML = text;
    document.getElementById("edit-user-toaster").style.backgroundColor = color;
  };

  const saveUser = async () => {
    try {
      editToaster("Updating", "#0b5ed7");
      const response = await fetch(toEdit, fetchOptions);
      const jsonResponse = await response.json();
      if (!response.ok) {
        // editToaster("Error", "#bb2d3b");
        // console.log(response);
        if (response.status == "400") {
          editToaster(
            `<ul>
          <li>Minimum password length is 6</li>
          <li>with at least one number</li>
          <li>one uppercase letter</li>
          <li>and one special character</li>
        </ul>`,
            "#bb2d3b"
          );
        } else {
          editToaster("Something went wrong", "#bb2d3b");
        }
      } else {
        editToaster("Updated!", "#198754");
        setTimeout(() => {
          window.location = "./users.html";
        }, 3000);
      }
    } catch (e) {}
  };

  saveUser();
});

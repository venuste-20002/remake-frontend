const addBlogForm = document.getElementById("add-blog");
const inputBlogAuthor = document.getElementById("input-blog-author");
const inputBlogTitle = document.getElementById("input-blog-title");
const blogContent = document.getElementById("blog-content");
const respTable = document.getElementById("resp-table");
let saveBlogToasterDiv = document.getElementById("save-blog-toaster");
const showUserName = document.getElementById("show-username");
const showUserRole = document.getElementById("show-role");
const goHome = document.getElementById("go-home");
console.log(goHome);
let token;
let decodedToken;
let username;
let deleteModal = document.getElementById("myDeleteModal");

// go Home
goHome.addEventListener("click", () => {
  window.location = "./index.html";
  console.log("Going home...");
});
const clearInputs = () => {
  inputBlogTitle.value = "";
  blogContent.value = "";
  saveBlogToasterDiv.style.display = "none";
};
// Open Modal 2
const deleteBlogForm = document.getElementById("delete-blog-form");
const showId = document.getElementById("show-id");
const showAuthor = document.getElementById("show-author");
const showTitle = document.getElementById("show-title");
const deleteToaster = document.getElementsByClassName("delete-toaster");
function handleDelete(id, author, title) {
  deleteModal.style.display = "block";
  showId.value = id;
  showAuthor.value = author;
  showTitle.value = title;
}
const toasterMessage = (div, text, color) => {
  div.style.display = "block";
  div.style.backgroundColor = color;
  div.innerHTML = text;
};

// close button | modal2
var span2 = document.getElementById("x");

// function to close modal
function closeDeleteModal() {
  deleteModal.style.display = "none";
}

// close action | modal 2
span2.onclick = function () {
  closeDeleteModal();
};

deleteModal.addEventListener("click", (event) => {
  if (event.target == deleteModal) {
    closeDeleteModal();
  }
});

const reset = document.getElementById("abort-delete");
reset.addEventListener("click", () => {
  closeDeleteModal();
});

deleteBlogForm.addEventListener("submit", (e) => {
  e.preventDefault();
  deleteBlog(showId.value);
});

const deleteBlog = async (arg) => {
  //console.log(arg);
  let id = showId.value;
  const deleteBlogEndpoint = `https://my-brand-atlp-be.onrender.com/api/blogs/${id}`;
  const fetchOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    toasterMessage(deleteToaster[0], "Deleting...", "#0b5ed7");
    const response = await fetch(deleteBlogEndpoint, fetchOptions);
    if (!response.ok) {
      toasterMessage(
        deleteToaster[0],
        "something went wrong... Please try again later",
        "#bb2d3b"
      );
      throw new Error("Error sending message: " + response.statusText);
    } else {
      toasterMessage(deleteToaster[0], "Success", "#198754");
      setTimeout(() => {
        window.location = "./blog-dashboard.html";
      }, 2000);
    }
  } catch (e) {
    console.error(e);
  }
};

const editBlog = (i) => {
  //window.location.href = `./edit-blog.html?id=${arg}`;
  console.log(i);
  //alert(arg);
};

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
    decodedToken = JSON.parse(atob(token.split(".")[1]));
    username = decodedToken.name;
    inputBlogAuthor.value = username;
    showUserName.innerHTML = decodedToken.name;
    showUserRole.innerHTML = `"${decodedToken.role}"`;
  } else {
    window.location = "./login.html";
  }

  if (decodedToken.role === "user") {
    window.location = "./blog.html";
  }

  const blogsEndpoint = "https://my-brand-atlp-be.onrender.com/api/blogs";
  const fetchOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const getBlogs = async () => {
    try {
      respTable.innerHTML = `<h2 class="empty-blog">Loading, Please wait...</h2>`;
      console.log("loading");
      const response = await fetch(blogsEndpoint, fetchOptions);
      const jsonResponse = await response.json();
      const data = await jsonResponse.data;
      console.log(data);
      listBlogs(data);
    } catch (e) {
      console.error(`Error fetching Data`);
    }
  };

  getBlogs();

  addBlogForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const blog = {
      title: inputBlogTitle.value.trim(),
      author: inputBlogAuthor.value.trim(),
      content: blogContent.value.trim(),
    };

    saveBlog(blog);
    console.log(blog);
  });

  const saveBlog = async (blog) => {
    const blogData = {
      title: inputBlogTitle.value.trim(),
      author: inputBlogAuthor.value.trim(),
      content: blogContent.value.trim(),
    };
    const addBlogsEndpoint = "https://my-brand-atlp-be.onrender.com/api/blogs";
    const fetchOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
    };
    try {
      toasterMessage(saveBlogToasterDiv, "Saving blog...", "#0b5ed7");
      const response = await fetch(addBlogsEndpoint, fetchOptions);
      if (!response.ok) {
        if (response.status == "401") {
          toasterMessage(saveBlogToasterDiv, "Access Denied", "#bb2d3b");
        } else if (response.status == "500") {
          toasterMessage(saveBlogToasterDiv, "Something went wrong", "#bb2d3b");
          console.log("Internal server");
        } else if (response.status == "400") {
          toasterMessage(
            saveBlogToasterDiv,
            `<ul>
          <li>Author should have a min of 3 Characters</li>
          <li>Title should have a min of 6 Character</li>
          <li>content should have a min of 10 Character</li>
        </ul>`,
            "#bb2d3b"
          );
          console.log(response.status);
        } else {
          toasterMessage(saveBlogToasterDiv, "Something went wrong", "#bb2d3b");
          console.log(response.status);
        }
        throw new Error("Error sending message: " + response.statusText);
      } else {
        toasterMessage(saveBlogToasterDiv, "Blog Published", "#198754");
        setTimeout(function () {
          clearInputs();
          closeModal();
          getBlogs();
        }, 2000);
      }

      //alert("Blog Added");
    } catch (e) {
      console.log(`Something went wrong: ${e}`);
    }
  };

  const listBlogs = (arg) => {
    if (localStorage.getItem("token") === null) {
      respTable.innerHTML = `
      <li class="table-header">
        
        <div class="col col-2">Author</div>
        <div class="col col-3">Title</div>
        <div class="col col-4">Acton</div>
      </li>
      <h2 class="empty-blog">Please Login to view blogs</h2>`;
    } else if (localStorage.getItem("token") && arg.length === 0) {
      console.log("zero");
      respTable.innerHTML = `
      <li class="table-header">
        
        <div class="col col-2">Author</div>
        <div class="col col-3">Title</div>
        <div class="col col-4">Acton</div>
      </li>
      <h2 class="empty-blog">Empty</h2>`;
    } else {
      respTable.innerHTML = `
      <li class="table-header">
      <div class="col col-1">#</div>
          <div class="col col-2">Author</div>
          <div class="col col-3">Title</div>
          <div class="col col-4">Acton</div>
    </li>`;

      arg.forEach((item, index) => {
        let newTitle = "";
        let newAuthor = "";
        //format Title
        const formatTitle = (arg) => {
          if (arg.length <= 10) {
            return arg;
          }

          for (let i = 0; i < 10; i++) {
            newTitle += arg[i];
          }

          newTitle += "...";
          return newTitle;
        };

        //format Title
        const formatAuthor = (arg) => {
          if (arg.length <= 10) {
            return arg;
          }

          for (let i = 0; i < 10; i++) {
            newAuthor += arg[i];
          }

          newAuthor += "...";
          return newAuthor;
        };

        let x = item._id.toString();
        let y = item.author.toString();
        let z = item.title.toString();
        console.log(x);

        respTable.innerHTML += `<li class="table-row">
        <div class="col col-1" data-label="#">${index + 1}</div>
              <div class="col col-2" data-label="Author">${formatAuthor(
                item.author
              )}</div>
              <div class="col col-3" data-label="Title">${formatTitle(
                item.title
              )}</div>
              <div class="col col-4 action-icon" data-label="Action">
                 <a href="./read.html?id=${
                   item._id
                 }" target="_blank"><i class="fa-solid fa-eye"></i></a> 
                  <a href = "./edit-blog.html?id=${
                    item._id
                  }"><i class="fa-solid fa-pen-to-square"></i></a>
                  <i   onClick= "handleDelete('${x}','${y}','${z}')" class="fa-solid fa-trash delete"></i>
              </div>
          </li>`;
      });
    }
  };

  const closeModal = () => {
    modal.style.display = "none";
    clearInputs();
  };

  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btnModal = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  btnModal.onclick = function () {
    modal.style.display = "block";
  };

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
    closeModal();
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      closeModal();
    }
  };
});

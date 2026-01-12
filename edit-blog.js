const form = document.getElementById("edit-blog-form");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const contentInput = document.getElementById("content");
const loadingDiv = document.getElementsByClassName("loading");

const waiting = (load, loadState, form, formState, message) => {
  load.style.display = loadState;
  load.innerHTML = message;
  form.style.display = formState;
};
let urlParams = new URLSearchParams(window.location.search);
let idFromUrl = urlParams.get("id");
let token;
let username;
console.log(idFromUrl);
tinymce.init({
  selector: "#content",

  tinycomments_mode: "embedded",
  tinycomments_author: "Author name",

  ai_request: (request, respondWith) =>
    respondWith.string(() =>
      Promise.reject("See docs to implement AI Assistant")
    ),
});

document.addEventListener("DOMContentLoaded", () => {
  let cancelBtn = document.getElementsByClassName("cancel");
  cancelBtn[0].addEventListener("click", () => {
    waiting(loadingDiv[0], "block", form, "none", "Redirecting...");
    window.location = "blog-dashboard.html";
  });

  const showExistingData = (data) => {
    titleInput.value = data.title;
    //contentInput.value = "none";
    tinymce.get("content").setContent(data.content);
  };

  if (!localStorage.getItem("token")) {
    window.location.href = "./login.html";
  } else {
    token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    username = decodedToken.name;
    authorInput.value = username;
  }

  const blogEndpoint = `https://my-brand-atlp-be.onrender.com/api/blogs/${idFromUrl}`;
  const fetchOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  //Lets get one blog with a specific ID
  const getBlog = async () => {
    try {
      waiting(loadingDiv[0], "block", form, "none", "Fetching...");
      const response = await fetch(blogEndpoint, fetchOptions);
      const jsonResponse = await response.json();
      const data = await jsonResponse.data;
      // console.log(data);
      // console.log(response);
      if (!response.ok) {
        waiting(loadingDiv[0], "block", form, "none", "Something went wrong");
      } else {
        showExistingData(data);
        waiting(loadingDiv[0], "none", form, "block");
      }
    } catch (e) {
      console.error(`Error fetching Data`);
    }
  };

  getBlog();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const updateBlogData = {
      title: titleInput.value.trim(),
      content: contentInput.value.trim(),
      author: authorInput.value.trim(),
    };
    console.log(updateBlogData);
    const updateBlogEndpoint = `https://my-brand-atlp-be.onrender.com/api/blogs/${idFromUrl}`;
    const fetchOptions2 = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateBlogData),
    };

    const updateBlog = async () => {
      try {
        waiting(loadingDiv[0], "block", form, "block", "Updating...");
        const response = await fetch(updateBlogEndpoint, fetchOptions2);
        const jsonResponse = await response.json();
        if (!response.ok) {
          waiting(
            loadingDiv[0],
            "block",
            form,
            "none",
            "Faile.. try again later"
          );
          console.log("somthing went wrong");
        } else {
          console.log("Updated successfully");
          waiting(loadingDiv[0], "block", form, "block", "Success!");
          setTimeout(() => {
            window.location = "./blog-dashboard.html";
          }, 1000);
        }
      } catch (e) {
        console.error(`Error fetching Data`);
      }
    };

    updateBlog();
  });
});

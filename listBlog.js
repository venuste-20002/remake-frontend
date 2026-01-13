const signOut = () => {
  localStorage.removeItem("token");
  window.location = "./login.html";
};

document.addEventListener("DOMContentLoaded", () => {
  //div to render blog lists
  const blogSection = document.querySelector("section#blog-section");

  const loginBtn = document.querySelector(".item.login");
  const logoutBtn = document.querySelector(".item.logout");

  if (localStorage.getItem("token")) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
  } else {
    logoutBtn.style.display = "none";
    loginBtn.style.display = "block";
  }

  //Date formater
  const formatDate = (arg) => {
    const date = new Date(arg);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  //return blog Description - Minified
  const generateShortDesc = (arg) => {
    let longTitle = arg;
    let smallTitle = "";
    if (longTitle.length < 200) {
      smallTitle = longTitle;
    } else {
      for (let i = 0; i <= 200; i++) {
        smallTitle += longTitle[i];
      }

      smallTitle += `...`;
    }

    return smallTitle;
  };

  // Data fetching
  const fetchData = async () => {
    try {
      blogSection.innerHTML = `<h2 class="empty-blog">Loading, please wait...</h2>`;
      const response = await fetch(
        "https://remake-backend-dmm6.onrender.com/api/blogs"
      );
      const jsonResponse = await response.json();
      const data = jsonResponse.data;
      return data;
    } catch (e) {
      console.error(`Error fecthing Data: ${e}`);
    }
  };

  //Render Data
  const renderData = async () => {
    const data = await fetchData();

    if (!data) {
      blogSection.innerHTML = `<h2 class="empty-blog">Nothing to show</h2>`;
    } else {
      console.log(data);
      blogSection.innerHTML = "";
      data.forEach((item) => {
        const newDate = formatDate(item.createdAt);
        blogSection.innerHTML += `
        <div>
          <p class="date">${newDate}</p>
            <p class="title">
              ${item.title}
            </p>
            <p class="description">
             ${generateShortDesc(item.content)}
            </p>
            <a target="_blank" href="./read.html?id=${
              item._id
            }"><button>FULL STORY</button></a>
        
        </div>
        `;
      });
    }
  };

  renderData();
});

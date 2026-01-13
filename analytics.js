const countBlog = document.getElementById("count-blog");
const countUser = document.getElementById("count-user");
const countMessage = document.getElementById("count-message");
const countSubscriber = document.getElementById("count-subscriber");

let blogCount;
let userCount;
let messageCount;
let subscribeCount;

document.addEventListener("DOMContentLoaded", () => {
  const getBlogs = async () => {
    // const getBogCount = "http://localhost:5000/api/blogcount";
    const getBlogCount = "https://remake-backend-dmm6.onrender.com/api/blogcount";

    try {
      countBlog.innerHTML = "calculating...";
      const response = await fetch(getBogCount);
      if (!response.ok) {
        throw new Error("Fail to fetch");
      } else {
        const data = await response.json();
        blogCount = data.data;

        countBlog.innerHTML = blogCount;
      }
    } catch (e) {
      console.error(e);
    }
  };
  const getUsers = async () => {
    // const getUserCount = "http://localhost:5000/api/usercount";
    const getUserCount = "https://remake-backend-dmm6.onrender.com/api/usercount";

    try {
      countUser.innerHTML = "calculating...";
      const response = await fetch(getUserCount);
      if (!response.ok) {
        throw new Error("Fail to fetch");
      } else {
        const data = await response.json();
        userCount = data.data;
        countUser.innerHTML = userCount;
      }
    } catch (e) {
      console.error(e);
    }
  };
  const getMessagesCount = async () => {
    // const getMessageCount = "http://localhost:5000/api/messagecount";
    const getMessageCount = "https://remake-backend-dmm6.onrender.com/api/messagecount";

    try {
      countMessage.innerHTML = "calculating...";
      const response = await fetch(getMessageCount);
      if (!response.ok) {
        throw new Error("Fail to fetch");
      } else {
        const data = await response.json();
        messageCount = data.data;
        countMessage.innerHTML = messageCount;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getSubscribers = async () => {
    // const getSubscriberCount = "http://localhost:5000/api/subscribercount";
    const getSubscriberCount = "https://remake-backend-dmm6.onrender.com/api/subscribercount";
    try {
      countSubscriber.innerHTML = "Calculating...";
      const response = await fetch(getSubscriberCount);
      if (!response.ok) {
        throw new Error("Fail to fetch");
      } else {
        const data = await response.json();
        subscribeCount = data.data;
        countSubscriber.innerHTML = subscribeCount;
      }
    } catch (e) {
      console.log(e);
    }
  };

  getBlogs();
  getUsers();
  getMessagesCount();
  getSubscribers();
});

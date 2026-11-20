const API_BASE = "https://jsonplaceholder.typicode.com";

const loadBtn = document.getElementById("load-btn");
const searchInput = document.getElementById("search-input");
const usersList = document.getElementById("users-list");
const postsList = document.getElementById("posts-list");
const messageArea = document.getElementById("message-area");

let allUsers = [];

function showMessage(text, type) {
    messageArea.textContent = text;
    messageArea.className = "";
    if (type) {
        messageArea.classList.add(type);
    }
}

async function loadUsers() {
    loadBtn.disabled = true;
    searchInput.disabled = true;
    showMessage("Загрузка пользователей...", "loading");

    try {
        const response = await fetch(`${API_BASE}/users`);

        if (!response.ok) {
            throw new Error(`HTTP-ошибка: ${response.status} ${response.statusText}`);
        }

        allUsers = await response.json();

        usersList.textContent = "";
        postsList.textContent = "";
        searchInput.value = "";
        renderUsers(allUsers);

        showMessage(`Загружено ${allUsers.length} пользователей.`, "success");
    } catch (error) {
        showMessage(`Ошибка загрузки: ${error.message}`, "error");
    } finally {
        loadBtn.disabled = false;
        searchInput.disabled = false;
    }
}

function renderUsers(users) {
    usersList.textContent = "";

    if (users.length === 0) {
        showMessage("Пользователи не найдены", "error");
        return;
    }

    for (const user of users) {
        const card = document.createElement("div");
        card.className = "user-card";

        const name = document.createElement("h3");
        name.textContent = user.name;
        card.appendChild(name);

        const email = document.createElement("p");
        email.className = "user-email";
        email.textContent = user.email;
        card.appendChild(email);

        const city = document.createElement("p");
        city.className = "user-city";
        city.textContent = `Город: ${user.address.city}`;
        card.appendChild(city);

        const postsBtn = document.createElement("button");
        postsBtn.className = "btn-posts";
        postsBtn.textContent = "Показать публикации";
        postsBtn.addEventListener("click", () => loadPosts(user.id));
        card.appendChild(postsBtn);

        usersList.appendChild(card);
    }
}

function filterUsersByName(query) {
    const lowerQuery = query.toLowerCase().trim();

    if (lowerQuery === "") {
        renderUsers(allUsers);
        return;
    }

    const filtered = allUsers.filter(user =>
        user.name.toLowerCase().includes(lowerQuery)
    );

    renderUsers(filtered);
}

async function loadPosts(userId) {
    postsList.textContent = "";
    postsList.innerHTML = "<p class=\"loading\">Загрузка публикаций...</p>";

    try {
        const response = await fetch(`${API_BASE}/posts?userId=${userId}`);

        if (!response.ok) {
            throw new Error(`HTTP-ошибка: ${response.status} ${response.statusText}`);
        }

        const posts = await response.json();

        postsList.textContent = "";

        const firstThree = posts.slice(0, 3);

        for (const post of firstThree) {
            const card = document.createElement("div");
            card.className = "post-card";

            const title = document.createElement("h3");
            title.textContent = post.title;
            card.appendChild(title);

            const body = document.createElement("p");
            body.textContent = post.body;
            card.appendChild(body);

            postsList.appendChild(card);
        }

        if (firstThree.length === 0) {
            postsList.textContent = "Публикации не найдены";
        }
    } catch (error) {
        postsList.textContent = `Ошибка загрузки публикаций: ${error.message}`;
    }
}

loadBtn.addEventListener("click", loadUsers);

searchInput.addEventListener("input", (e) => {
    filterUsersByName(e.target.value);
});

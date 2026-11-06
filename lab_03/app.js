const API_BASE = "http://localhost:3333"
// const API_BASE = "jsonplaceholder.typicode.com"

const loadBtn = document.getElementById("load-btn");
const createBtn = document.getElementById("create-btn");
const messageArea = document.getElementById("message-area");
const postsList = document.getElementById("posts-list");

function showMessage(text, type) {
    messageArea.textContent = text;
    messageArea.className = "";
    if (type) {
        messageArea.classList.add(type);
    }
}

async function loadPosts() {
    loadBtn.disabled = true;
    showMessage("Загрузка публикаций...", "loading");

    try {
        const response = await fetch(`${API_BASE}/posts?_limit=5`);

        if (!response.ok) {
            throw new Error(`HTTP-ошибка: ${response.status} ${response.statusText}`);
        }

        const posts = await response.json();

        postsList.textContent = "";

        for (const post of posts) {
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

        showMessage(`(status-code=200) Загружено ${posts.length} публикаций.`, "success");
    } catch (error) {
        showMessage(`(status-code=404) Ошибка загрузки: ${error.message}`, "error");
    } finally {
        loadBtn.disabled = false;
    }
}

async function createPost() {
    const titleInput = document.getElementById("title");
    const bodyInput = document.getElementById("body");

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (title === "" || body === "") {
        showMessage("Заголовок и текст не могут быть пустыми.", "error");
        return;
    }

    createBtn.disabled = true;
    showMessage("Отправка публикации...", "loading");

    try {
        const response = await fetch(`${API_BASE}/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, body, userId: 1 })
        });

        if (!response.ok) {
            throw new Error(`HTTP-ошибка: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        showMessage(`Публикация создана! Заголовок: "${data.title}", ID: ${data.id}`, "success");

        titleInput.value = "";
        bodyInput.value = "";

        const card = document.createElement("div");
        card.className = "post-card";

        const cardTitle = document.createElement("h3");
        cardTitle.textContent = data.title;
        card.appendChild(cardTitle);

        const cardBody = document.createElement("p");
        cardBody.textContent = data.body;
        card.appendChild(cardBody);

        postsList.prepend(card);
    } catch (error) {
        showMessage(`(status-code=500)Ошибка отправки: ${error.message}`, "error");
    } finally {
        createBtn.disabled = false;
    }
}

loadBtn.addEventListener("click", loadPosts);

document.getElementById("create-form").addEventListener("submit", function (event) {
    event.preventDefault();
    createPost();
});

const { createServer } = require('node:http');

const posts = [
  { id: 1, title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit', body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto', userId: 1 },
  { id: 2, title: 'qui est esse', body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla', userId: 1 },
  { id: 3, title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut', body: 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut', userId: 2 },
  { id: 4, title: 'eum et est occaecati', body: 'ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit', userId: 3 },
  { id: 5, title: 'nesciunt quas odio', body: 'aut voluptatum libero nisi omnis dolor enim ut hic\nconsequatur saepe enim esse\nsapiente at consequatur sit\nconsequatur laudantium sed iure', userId: 1 }
];

let nextId = 100;

const server = createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // GET /posts?_limit=5
  if (method === 'GET' && url.startsWith('/posts')) {
    const match = url.match(/_limit=(\d+)/);
    const limit = match ? Math.min(parseInt(match[1], 10), posts.length) : posts.length;
    const result = posts.slice(0, limit);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
    return;
  }

  if (method === 'GET' && url.startsWith('/postz')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
    return;
  }

  if (method === 'POST' && url === '/posts') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const newPost = { id: nextId++, title: data.title, body: data.body, userId: data.userId || 1 };
        posts.push(newPost);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newPost));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(3333, () => {
  console.log('Mock API server running at http://localhost:3333');
});

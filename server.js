const { readFileSync } = require("fs");
const { createServer } = require("http");
const { parse } = require("url");
const { renderToString } = require("react-dom/server");
const React = require("react");

const pizzas = [
  { name: "Focaccia", price: 6 },
  { name: "Pizza Margherita", price: 10 },
  { name: "Pizza Spinaci", price: 12 },
  { name: "Pizza Funghi", price: 12 },
  { name: "Pizza Prosciutto", price: 15 },
];

// Компонент страницы
function Home() {
  return (
    <div>
      <h1>🍕 Fast React Pizza Co.</h1>
      <p>This page has been rendered with React on the server 🤯</p>
      <h2>Menu</h2>
      <ul>
        {pizzas.map((pizza) => (
          <MenuItem pizza={pizza} key={pizza.name} />
        ))}
      </ul>
    </div>
  );
}

// Компонент счетчика
function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <span>{count}</span>
    </div>
  );
}

// Компонент пункта меню
function MenuItem({ pizza }) {
  return (
    <li>
      <h4>
        {pizza.name} (${pizza.price})
      </h4>
      <Counter />
    </li>
  );
}

// Чтение HTML-шаблона и клиентского JavaScript
const htmlTemplate = readFileSync(`${__dirname}/index.html`, "utf-8");
const clientJS = readFileSync(`${__dirname}/client.js`, "utf-8");

// Создание HTTP-сервера
const server = createServer((req, res) => {
  const pathName = parse(req.url, true).pathname;

  // Если запрошен корневой URL
  if (pathName === "/") {
    // Рендеринг React-компонента на сервере
    const renderedReact = renderToString(<Home />);
    const html = htmlTemplate.replace("%%%CONTENT%%%", renderedReact);

    res.writeHead(200, { "Content-type": "text/html" });
    res.end(html);
  }
  // Если запрашивается клиентский JavaScript
  else if (pathName === "/client.js") {
    res.writeHead(200, { "Content-type": "application/javascript" });
    res.end(clientJS);
  } else {
    res.end("The URL cannot be found");
  }
});

// Запуск сервера на порту 8000
server.listen(8000, () => console.log("Listening for requests on port 8000"));

// What is Next.js?

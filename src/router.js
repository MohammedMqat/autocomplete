const fs = require("fs");
const path = require("path");
const url = require("url");
const wordsPath = path.join(__dirname, "words.txt");
const wordsBuffer = fs.readFileSync(wordsPath);
const wordsArray = wordsBuffer.toString().split("\n");

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const MIME = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "application/javascript",
};

const NOT_FOUND_HTTP_STATUS_CODE = 404;
const OK_HTTP_STATUS_CODE = 200;

const serveStatic = (res, filePath) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(NOT_FOUND_HTTP_STATUS_CODE);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(OK_HTTP_STATUS_CODE, { "Content-Type": MIME[ext] || "text/plain" });
    res.end(data);
  });
}

const registerLogger = (req,res) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.url} ${res.statusCode} ${ms}ms`);
  });
}

module.exports = (req, res) => {
  registerLogger(req,res);
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === "/api/autocomplete") {
    return handleAutoComplete(query, res);
  }

  const file = pathname === "/" ? "index.html" : pathname.slice(1);
  serveStatic(res, path.join(PUBLIC_DIR, file));
};

const handleAutoComplete = (query, res) => {
  const searchValue = query.q;
  const results = wordsArray
    .filter((words) => words.startsWith(searchValue))
    .slice(0, 10);
  res.writeHead(OK_HTTP_STATUS_CODE, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ results }));

  return;
}


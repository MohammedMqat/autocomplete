const fs = require("fs");
const path = require("path");
const url = require("url");

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
};

function serveStatic(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "text/plain" });
    res.end(data);
  });
}

module.exports = function router(req, res) {
  const start = Date.now();
  const { pathname, query } = url.parse(req.url, true);

  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${pathname} ${res.statusCode} ${ms}ms`);
  });

  if (pathname === "/api/autocomplete") {
    const result = query.filter();
    // TODO: implement autocomplete logic using query.q
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ results: [] }));
    return;
  }

  const file = pathname === "/" ? "index.html" : pathname.slice(1);
  serveStatic(res, path.join(PUBLIC_DIR, file));
};

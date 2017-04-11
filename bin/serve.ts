import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import * as url from "url";

const log = (msg: string) => console.log(`[${(new Date()).toJSON()}] ${msg}`);

http.createServer((req, res) => {
  const uri = url.parse(req.url || "").pathname;
  let filename = path.join("./dist", uri || "");
  let stats;

  try {
    stats = fs.lstatSync(filename);
  } catch (e) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.write("404 Not Found");
    res.end();
    return;
  }

  if (stats.isDirectory()) {
    filename += "index.html";
  }

  fs.createReadStream(filename)
    .on("error", (err: Error) => {
      log(err.message);
      res.writeHead(500, { "content-type": "text/plain" });
      res.write("500 Not supported");
      res.end();
    })
    .on("open", () => {
      res.writeHead(200);
    })
    .on("end", () => {
      log(filename);
    })
    .pipe(res);
})
.listen(8080);

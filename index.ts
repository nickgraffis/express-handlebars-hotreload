import { WebSocketServer } from "ws";
import * as glob from "glob";
import * as fs from "fs";
import { spawn } from "child_process";
import { engine, create } from "./lib";
export { engine, create };

export function __hotreload({
  port = 8080,
  _glob = "**/*",
}) {
  // Creating a new websocket server
  const wss = new WebSocketServer({ port })
  
  // Creating connection using websocket
  wss.on("connection", ws => {
    // listen for changes in a glob of files and send a message to the client
    // when a change occurs
    glob.sync(process.cwd() + _glob).forEach((file: fs.PathLike) => {
      fs.watch(file, () => {
        console.log(`🔥 File ${file} changed - reloading...`);
        ws.send("refresh");
      });
    });
    // handling client connection error
    ws.onerror = function () {
      console.log("Some Error occurred")
    }
  });

  return port;
}

export function hotreload(options: { port?: number, glob?: string } = {}) { 
  // get the current file
  const __port = options.port || 8080;
  const __glob = options.glob || "**/*";
  const file = fs.readFileSync(__filename, "utf8").replace(`var lib_1 = require("./lib");`, "");
  const fn = file + `\n__hotreload({ port: ${__port}, _glob: "${__glob}" });`;
  const child = spawn("node", ["-e", fn])

  child.stdout.on("data", data => {
    console.log(data.toString());
  })

  child.stderr.on("data", data => {
    console.log(data.toString());
  })

  child.on("close", code => {
    console.log(`🔥 Stopping hotreload server with code ${code}`);
  })

  // if the main thread exits, kill the child process
  process.on("exit", () => {
    child.kill();
  });
}
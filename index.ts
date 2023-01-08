import { WebSocketServer } from "ws";
import * as glob from "glob";
import * as fs from "fs";
import * as chokidar from "chokidar";
import { spawn } from "child_process";
import { engine, create } from "./lib";
export { engine, create };

const DEFAULT_GLOB = "**/*"

export function __hotreload({
  port = 8080,
  _glob = DEFAULT_GLOB,
}) {
  // Creating a new websocket server
  const wss = new WebSocketServer({ port })
  // Creating connection using websocket
  wss.on("connection", ws => {
    // listen for changes in a glob of files and send a message to the client
    // when a change occurs
    const watcher = chokidar.watch(process.cwd() + _glob)
    // glob sync
    glob.sync(process.cwd() + _glob).forEach((file) => {
      watcher.add(file);
    });
    watcher.on("change", (path) => {
      console.log(`🔥 File ${path} has been changed`);
      ws.send("refresh");
    })
    // handling client connection error
    ws.onerror = function () {
      console.log("Some Error occurred")
    }
  });

  wss.on("error", (err) => {
    if (err.message.includes("EADDRINUSE")) {
      console.log(`🔥 Port ${port} is already in use`);
      process.exit(1);
    }
  })

  return port;
}

export function hotreload(options: { port?: number, glob?: string } = {}) { 
  // get the current file
  const __port = options.port || 8080;
  const __glob = options.glob || DEFAULT_GLOB;
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
    process.exit(0);
  })

  // if the main thread exits, kill the child process
  process.on("exit", () => {
    child.kill();
  });
}
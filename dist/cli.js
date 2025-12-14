#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/constants.ts
var import_node_path, import_node_os, HOME_DIR, CONFIG_FILE, PLUGINS_DIR, PID_FILE, REFERENCE_COUNT_FILE, CLAUDE_PROJECTS_DIR;
var init_constants = __esm({
  "src/constants.ts"() {
    "use strict";
    import_node_path = __toESM(require("node:path"));
    import_node_os = __toESM(require("node:os"));
    HOME_DIR = import_node_path.default.join(import_node_os.default.homedir(), ".claude-code-router");
    CONFIG_FILE = import_node_path.default.join(HOME_DIR, "config.json");
    PLUGINS_DIR = import_node_path.default.join(HOME_DIR, "plugins");
    PID_FILE = import_node_path.default.join(HOME_DIR, ".claude-code-router.pid");
    REFERENCE_COUNT_FILE = import_node_path.default.join(import_node_os.default.tmpdir(), "claude-code-reference-count.txt");
    CLAUDE_PROJECTS_DIR = import_node_path.default.join(import_node_os.default.homedir(), ".claude", "projects");
  }
});

// src/utils/logCleanup.ts
async function cleanupLogFiles(maxFiles = 9) {
  try {
    const logsDir = import_node_path2.default.join(HOME_DIR, "logs");
    try {
      await import_promises.default.access(logsDir);
    } catch {
      return;
    }
    const files = await import_promises.default.readdir(logsDir);
    const logFiles = files.filter((file) => file.startsWith("ccr-") && file.endsWith(".log")).sort().reverse();
    if (logFiles.length > maxFiles) {
      for (let i = maxFiles; i < logFiles.length; i++) {
        const filePath = import_node_path2.default.join(logsDir, logFiles[i]);
        try {
          await import_promises.default.unlink(filePath);
        } catch (error) {
          console.warn(`Failed to delete log file ${filePath}:`, error);
        }
      }
    }
  } catch (error) {
    console.warn("Failed to clean up log files:", error);
  }
}
var import_promises, import_node_path2;
var init_logCleanup = __esm({
  "src/utils/logCleanup.ts"() {
    "use strict";
    import_promises = __toESM(require("node:fs/promises"));
    import_node_path2 = __toESM(require("node:path"));
    init_constants();
  }
});

// src/utils/update.ts
async function checkForUpdates(currentVersion) {
  try {
    const { stdout } = await execPromise("npm view @musistudio/claude-code-router version");
    const latestVersion = stdout.trim();
    const hasUpdate = compareVersions(latestVersion, currentVersion) > 0;
    let changelog = "";
    return { hasUpdate, latestVersion, changelog };
  } catch (error) {
    console.error("Error checking for updates:", error);
    return { hasUpdate: false, latestVersion: currentVersion, changelog: "" };
  }
}
async function performUpdate() {
  try {
    const { stdout, stderr } = await execPromise("npm update -g @musistudio/claude-code-router");
    if (stderr) {
      console.error("Update stderr:", stderr);
    }
    console.log("Update stdout:", stdout);
    return {
      success: true,
      message: "Update completed successfully. Please restart the application to apply changes."
    };
  } catch (error) {
    console.error("Error performing update:", error);
    return {
      success: false,
      message: `Failed to perform update: ${error instanceof Error ? error.message : "Unknown error"}`
    };
  }
}
function compareVersions(v1, v2) {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = i < parts1.length ? parts1[i] : 0;
    const num2 = i < parts2.length ? parts2[i] : 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}
var import_child_process, import_util, execPromise;
var init_update = __esm({
  "src/utils/update.ts"() {
    "use strict";
    import_child_process = require("child_process");
    import_util = require("util");
    execPromise = (0, import_util.promisify)(import_child_process.exec);
  }
});

// src/utils/index.ts
var utils_exports = {};
__export(utils_exports, {
  backupConfigFile: () => backupConfigFile,
  checkForUpdates: () => checkForUpdates,
  cleanupLogFiles: () => cleanupLogFiles,
  initConfig: () => initConfig,
  initDir: () => initDir,
  performUpdate: () => performUpdate,
  readConfigFile: () => readConfigFile,
  writeConfigFile: () => writeConfigFile
});
var import_promises2, import_json5, import_node_path3, interpolateEnvVars, ensureDir, initDir, readConfigFile, backupConfigFile, writeConfigFile, initConfig;
var init_utils = __esm({
  "src/utils/index.ts"() {
    "use strict";
    import_promises2 = __toESM(require("node:fs/promises"));
    import_json5 = __toESM(require("json5"));
    import_node_path3 = __toESM(require("node:path"));
    init_constants();
    init_logCleanup();
    init_update();
    interpolateEnvVars = (obj) => {
      if (typeof obj === "string") {
        return obj.replace(/\$\{([^}]+)\}|\$([A-Z_][A-Z0-9_]*)/g, (match, braced, unbraced) => {
          const varName = braced || unbraced;
          return process.env[varName] || match;
        });
      } else if (Array.isArray(obj)) {
        return obj.map(interpolateEnvVars);
      } else if (obj !== null && typeof obj === "object") {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
          result[key] = interpolateEnvVars(value);
        }
        return result;
      }
      return obj;
    };
    ensureDir = async (dir_path) => {
      try {
        await import_promises2.default.access(dir_path);
      } catch {
        await import_promises2.default.mkdir(dir_path, { recursive: true });
      }
    };
    initDir = async () => {
      await ensureDir(HOME_DIR);
      await ensureDir(PLUGINS_DIR);
      await ensureDir(import_node_path3.default.join(HOME_DIR, "logs"));
    };
    readConfigFile = async () => {
      try {
        const config = await import_promises2.default.readFile(CONFIG_FILE, "utf-8");
        try {
          const parsedConfig = import_json5.default.parse(config);
          return interpolateEnvVars(parsedConfig);
        } catch (parseError) {
          console.error(`Failed to parse config file at ${CONFIG_FILE}`);
          console.error("Error details:", parseError.message);
          console.error("Please check your config file syntax.");
          process.exit(1);
        }
      } catch (readError) {
        if (readError.code === "ENOENT") {
          try {
            await initDir();
            const backupPath = await backupConfigFile();
            if (backupPath) {
              console.log(
                `Backed up existing configuration file to ${backupPath}`
              );
            }
            const config = {
              PORT: 3456,
              Providers: [],
              Router: {}
            };
            await writeConfigFile(config);
            console.log(
              "Created minimal default configuration file at ~/.claude-code-router/config.json"
            );
            console.log(
              "Please edit this file with your actual configuration."
            );
            return config;
          } catch (error) {
            console.error(
              "Failed to create default configuration:",
              error.message
            );
            process.exit(1);
          }
        } else {
          console.error(`Failed to read config file at ${CONFIG_FILE}`);
          console.error("Error details:", readError.message);
          process.exit(1);
        }
      }
    };
    backupConfigFile = async () => {
      try {
        if (await import_promises2.default.access(CONFIG_FILE).then(() => true).catch(() => false)) {
          const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
          const backupPath = `${CONFIG_FILE}.${timestamp}.bak`;
          await import_promises2.default.copyFile(CONFIG_FILE, backupPath);
          try {
            const configDir = import_node_path3.default.dirname(CONFIG_FILE);
            const configFileName = import_node_path3.default.basename(CONFIG_FILE);
            const files = await import_promises2.default.readdir(configDir);
            const backupFiles = files.filter((file) => file.startsWith(configFileName) && file.endsWith(".bak")).sort().reverse();
            if (backupFiles.length > 3) {
              for (let i = 3; i < backupFiles.length; i++) {
                const oldBackupPath = import_node_path3.default.join(configDir, backupFiles[i]);
                await import_promises2.default.unlink(oldBackupPath);
              }
            }
          } catch (cleanupError) {
            console.warn("Failed to clean up old backups:", cleanupError);
          }
          return backupPath;
        }
      } catch (error) {
        console.error("Failed to backup config file:", error);
      }
      return null;
    };
    writeConfigFile = async (config) => {
      await ensureDir(HOME_DIR);
      const configWithComment = `${JSON.stringify(config, null, 2)}`;
      await import_promises2.default.writeFile(CONFIG_FILE, configWithComment);
    };
    initConfig = async () => {
      const config = await readConfigFile();
      Object.assign(process.env, config);
      return config;
    };
  }
});

// package.json
var require_package = __commonJS({
  "package.json"(exports2, module2) {
    module2.exports = {
      name: "@rajmahavir/claude-code-router",
      version: "1.0.72",
      description: "Use Claude Code without an Anthropics account and route it to another LLM provider",
      repository: {
        type: "git",
        url: "git+https://github.com/rajmahavir/CCRVI.git"
      },
      bin: {
        ccr: "dist/cli.js"
      },
      scripts: {
        build: "node scripts/build.js",
        release: "npm run build && npm publish"
      },
      keywords: [
        "claude",
        "code",
        "router",
        "llm",
        "anthropic"
      ],
      author: "rajmahavir",
      license: "MIT",
      dependencies: {
        "@fastify/multipart": "^9.3.0",
        "@fastify/static": "^8.2.0",
        "@inquirer/prompts": "^5.0.0",
        "@musistudio/llms": "^1.0.46",
        dotenv: "^16.4.7",
        esbuild: "^0.25.1",
        "find-process": "^2.0.0",
        json5: "^2.2.3",
        "lru-cache": "^11.2.2",
        minimist: "^1.2.8",
        openurl: "^1.1.1",
        "rotating-file-stream": "^3.2.7",
        "shell-quote": "^1.8.3",
        tiktoken: "^1.0.21",
        uuid: "^11.1.0"
      },
      devDependencies: {
        "@types/node": "^24.0.15",
        fastify: "^5.4.0",
        shx: "^0.4.0",
        typescript: "^5.8.2"
      },
      publishConfig: {
        ignore: [
          "!build/",
          "src/",
          "screenshots/"
        ]
      }
    };
  }
});

// src/index.ts
var import_fs3 = require("fs");
var import_promises5 = require("fs/promises");
var import_os2 = require("os");
var import_path3 = require("path");
init_utils();

// src/server.ts
var import_llms = __toESM(require("@musistudio/llms"));
init_utils();
init_utils();
var import_path2 = require("path");
var import_static = __toESM(require("@fastify/static"));
var import_multipart = __toESM(require("@fastify/multipart"));
var import_fs = require("fs");
var import_os = require("os");

// src/utils/router.ts
var import_tiktoken = require("tiktoken");

// src/utils/cache.ts
var LRUCache = class {
  capacity;
  cache;
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = /* @__PURE__ */ new Map();
  }
  get(key) {
    if (!this.cache.has(key)) {
      return void 0;
    }
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const leastRecentlyUsedKey = this.cache.keys().next().value;
      if (leastRecentlyUsedKey !== void 0) {
        this.cache.delete(leastRecentlyUsedKey);
      }
    }
    this.cache.set(key, value);
  }
  values() {
    return Array.from(this.cache.values());
  }
};
var sessionUsageCache = new LRUCache(100);

// src/utils/router.ts
var import_promises3 = require("fs/promises");
var import_promises4 = require("fs/promises");
var import_path = require("path");
init_constants();
var import_lru_cache = require("lru-cache");
var enc = (0, import_tiktoken.get_encoding)("cl100k_base");
var calculateTokenCount = (messages, system, tools) => {
  let tokenCount = 0;
  if (Array.isArray(messages)) {
    messages.forEach((message) => {
      if (typeof message.content === "string") {
        tokenCount += enc.encode(message.content).length;
      } else if (Array.isArray(message.content)) {
        message.content.forEach((contentPart) => {
          if (contentPart.type === "text") {
            tokenCount += enc.encode(contentPart.text).length;
          } else if (contentPart.type === "tool_use") {
            tokenCount += enc.encode(JSON.stringify(contentPart.input)).length;
          } else if (contentPart.type === "tool_result") {
            tokenCount += enc.encode(
              typeof contentPart.content === "string" ? contentPart.content : JSON.stringify(contentPart.content)
            ).length;
          }
        });
      }
    });
  }
  if (typeof system === "string") {
    tokenCount += enc.encode(system).length;
  } else if (Array.isArray(system)) {
    system.forEach((item) => {
      if (item.type !== "text") return;
      if (typeof item.text === "string") {
        tokenCount += enc.encode(item.text).length;
      } else if (Array.isArray(item.text)) {
        item.text.forEach((textPart) => {
          tokenCount += enc.encode(textPart || "").length;
        });
      }
    });
  }
  if (tools) {
    tools.forEach((tool) => {
      if (tool.description) {
        tokenCount += enc.encode(tool.name + tool.description).length;
      }
      if (tool.input_schema) {
        tokenCount += enc.encode(JSON.stringify(tool.input_schema)).length;
      }
    });
  }
  return tokenCount;
};
var readConfigFile2 = async (filePath) => {
  try {
    await (0, import_promises3.access)(filePath);
    const content = await (0, import_promises3.readFile)(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
};
var getProjectSpecificRouter = async (req) => {
  if (req.sessionId) {
    const project = await searchProjectBySession(req.sessionId);
    if (project) {
      const projectConfigPath = (0, import_path.join)(HOME_DIR, project, "config.json");
      const sessionConfigPath = (0, import_path.join)(
        HOME_DIR,
        project,
        `${req.sessionId}.json`
      );
      const sessionConfig = await readConfigFile2(sessionConfigPath);
      if (sessionConfig && sessionConfig.Router) {
        return sessionConfig.Router;
      }
      const projectConfig = await readConfigFile2(projectConfigPath);
      if (projectConfig && projectConfig.Router) {
        return projectConfig.Router;
      }
    }
  }
  return void 0;
};
var getUseModel = async (req, tokenCount, config, lastUsage) => {
  const projectSpecificRouter = await getProjectSpecificRouter(req);
  const Router = projectSpecificRouter || config.Router;
  if (req.body.model.includes(",")) {
    const [provider, model] = req.body.model.split(",");
    const finalProvider = config.Providers.find(
      (p) => p.name.toLowerCase() === provider
    );
    const finalModel = finalProvider?.models?.find(
      (m) => m.toLowerCase() === model
    );
    if (finalProvider && finalModel) {
      return `${finalProvider.name},${finalModel}`;
    }
    return req.body.model;
  }
  const longContextThreshold = Router.longContextThreshold || 6e4;
  const lastUsageThreshold = lastUsage && lastUsage.input_tokens > longContextThreshold && tokenCount > 2e4;
  const tokenCountThreshold = tokenCount > longContextThreshold;
  if ((lastUsageThreshold || tokenCountThreshold) && Router.longContext) {
    req.log.info(
      `Using long context model due to token count: ${tokenCount}, threshold: ${longContextThreshold}`
    );
    return Router.longContext;
  }
  if (req.body?.system?.length > 1 && req.body?.system[1]?.text?.startsWith("<CCR-SUBAGENT-MODEL>")) {
    const model = req.body?.system[1].text.match(
      /<CCR-SUBAGENT-MODEL>(.*?)<\/CCR-SUBAGENT-MODEL>/s
    );
    if (model) {
      req.body.system[1].text = req.body.system[1].text.replace(
        `<CCR-SUBAGENT-MODEL>${model[1]}</CCR-SUBAGENT-MODEL>`,
        ""
      );
      return model[1];
    }
  }
  if (req.body.model?.includes("claude") && req.body.model?.includes("haiku") && config.Router.background) {
    req.log.info(`Using background model for ${req.body.model}`);
    return config.Router.background;
  }
  if (Array.isArray(req.body.tools) && req.body.tools.some((tool) => tool.type?.startsWith("web_search")) && Router.webSearch) {
    return Router.webSearch;
  }
  if (req.body.thinking && Router.think) {
    req.log.info(`Using think model for ${req.body.thinking}`);
    return Router.think;
  }
  return Router.default;
};
var router = async (req, _res, context) => {
  const { config, event: event2 } = context;
  if (req.body.metadata?.user_id) {
    const parts = req.body.metadata.user_id.split("_session_");
    if (parts.length > 1) {
      req.sessionId = parts[1];
    }
  }
  const lastMessageUsage = sessionUsageCache.get(req.sessionId);
  const { messages, system = [], tools } = req.body;
  if (config.REWRITE_SYSTEM_PROMPT && system.length > 1 && system[1]?.text?.includes("<env>")) {
    const prompt = await (0, import_promises3.readFile)(config.REWRITE_SYSTEM_PROMPT, "utf-8");
    system[1].text = `${prompt}<env>${system[1].text.split("<env>").pop()}`;
  }
  try {
    const tokenCount = calculateTokenCount(
      messages,
      system,
      tools
    );
    let model;
    if (config.CUSTOM_ROUTER_PATH) {
      try {
        const customRouter = require(config.CUSTOM_ROUTER_PATH);
        req.tokenCount = tokenCount;
        model = await customRouter(req, config, {
          event: event2
        });
      } catch (e) {
        req.log.error(`failed to load custom router: ${e.message}`);
      }
    }
    if (!model) {
      model = await getUseModel(req, tokenCount, config, lastMessageUsage);
    }
    req.body.model = model;
  } catch (error) {
    req.log.error(`Error in router middleware: ${error.message}`);
    req.body.model = config.Router.default;
  }
  return;
};
var sessionProjectCache = new import_lru_cache.LRUCache({
  max: 1e3
});
var searchProjectBySession = async (sessionId) => {
  if (sessionProjectCache.has(sessionId)) {
    return sessionProjectCache.get(sessionId);
  }
  try {
    const dir = await (0, import_promises4.opendir)(CLAUDE_PROJECTS_DIR);
    const folderNames = [];
    for await (const dirent of dir) {
      if (dirent.isDirectory()) {
        folderNames.push(dirent.name);
      }
    }
    const checkPromises = folderNames.map(async (folderName) => {
      const sessionFilePath = (0, import_path.join)(
        CLAUDE_PROJECTS_DIR,
        folderName,
        `${sessionId}.jsonl`
      );
      try {
        const fileStat = await (0, import_promises4.stat)(sessionFilePath);
        return fileStat.isFile() ? folderName : null;
      } catch {
        return null;
      }
    });
    const results = await Promise.all(checkPromises);
    for (const result of results) {
      if (result) {
        sessionProjectCache.set(sessionId, result);
        return result;
      }
    }
    sessionProjectCache.set(sessionId, null);
    return null;
  } catch (error) {
    console.error("Error searching for project by session:", error);
    sessionProjectCache.set(sessionId, null);
    return null;
  }
};

// src/server.ts
var createServer = (config) => {
  const server = new import_llms.default(config);
  server.app.register(import_multipart.default);
  server.app.post("/v1/messages/count_tokens", async (req, reply) => {
    const { messages, tools, system } = req.body;
    const tokenCount = calculateTokenCount(messages, system, tools);
    return { "input_tokens": tokenCount };
  });
  server.app.get("/api/config", async (req, reply) => {
    return await readConfigFile();
  });
  server.app.get("/api/transformers", async () => {
    const transformers = server.app._server.transformerService.getAllTransformers();
    const transformerList = Array.from(transformers.entries()).map(
      ([name, transformer]) => ({
        name,
        endpoint: transformer.endPoint || null
      })
    );
    return { transformers: transformerList };
  });
  server.app.post("/api/upload/service-account", async (req, reply) => {
    try {
      const data = await req.file();
      if (!data) {
        return reply.status(400).send({ error: "No file uploaded" });
      }
      const buffer = await data.toBuffer();
      const content = buffer.toString("utf-8");
      let keyJson;
      try {
        keyJson = JSON.parse(content);
      } catch (e) {
        return reply.status(400).send({ error: "Invalid JSON file" });
      }
      if (keyJson.type !== "service_account" || !keyJson.project_id) {
        return reply.status(400).send({ error: "Invalid Service Account Key: Missing type or project_id" });
      }
      const projectId = keyJson.project_id;
      const keysDir = (0, import_path2.join)((0, import_os.homedir)(), ".claude-code-router", "keys");
      if (!(0, import_fs.existsSync)(keysDir)) {
        (0, import_fs.mkdirSync)(keysDir, { recursive: true });
      }
      const filePath = (0, import_path2.join)(keysDir, `${projectId}.json`);
      (0, import_fs.writeFileSync)(filePath, content);
      return {
        success: true,
        projectId,
        filePath,
        message: "Service account key uploaded successfully"
      };
    } catch (error) {
      console.error("Failed to upload service account key:", error);
      return reply.status(500).send({ error: "Failed to upload service account key" });
    }
  });
  server.app.post("/api/config", async (req, reply) => {
    const newConfig = req.body;
    const backupPath = await backupConfigFile();
    if (backupPath) {
      console.log(`Backed up existing configuration file to ${backupPath}`);
    }
    await writeConfigFile(newConfig);
    return { success: true, message: "Config saved successfully" };
  });
  server.app.post("/api/restart", async (req, reply) => {
    reply.send({ success: true, message: "Service restart initiated" });
    setTimeout(() => {
      const { spawn: spawn3 } = require("child_process");
      spawn3(process.execPath, [process.argv[1], "restart"], {
        detached: true,
        stdio: "ignore"
      });
    }, 1e3);
  });
  server.app.register(import_static.default, {
    root: (0, import_path2.join)(__dirname, "..", "dist"),
    prefix: "/ui/",
    maxAge: "1h"
  });
  server.app.get("/ui", async (_, reply) => {
    return reply.redirect("/ui/");
  });
  server.app.get("/api/update/check", async (req, reply) => {
    try {
      const currentVersion = require_package().version;
      const { hasUpdate, latestVersion, changelog } = await checkForUpdates(currentVersion);
      return {
        hasUpdate,
        latestVersion: hasUpdate ? latestVersion : void 0,
        changelog: hasUpdate ? changelog : void 0
      };
    } catch (error) {
      console.error("Failed to check for updates:", error);
      reply.status(500).send({ error: "Failed to check for updates" });
    }
  });
  server.app.post("/api/update/perform", async (req, reply) => {
    try {
      const accessLevel = req.accessLevel || "restricted";
      if (accessLevel !== "full") {
        reply.status(403).send("Full access required to perform updates");
        return;
      }
      const result = await performUpdate();
      return result;
    } catch (error) {
      console.error("Failed to perform update:", error);
      reply.status(500).send({ error: "Failed to perform update" });
    }
  });
  server.app.get("/api/logs/files", async (req, reply) => {
    try {
      const logDir = (0, import_path2.join)((0, import_os.homedir)(), ".claude-code-router", "logs");
      const logFiles = [];
      if ((0, import_fs.existsSync)(logDir)) {
        const files = (0, import_fs.readdirSync)(logDir);
        for (const file of files) {
          if (file.endsWith(".log")) {
            const filePath = (0, import_path2.join)(logDir, file);
            const stats = (0, import_fs.statSync)(filePath);
            logFiles.push({
              name: file,
              path: filePath,
              size: stats.size,
              lastModified: stats.mtime.toISOString()
            });
          }
        }
        logFiles.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
      }
      return logFiles;
    } catch (error) {
      console.error("Failed to get log files:", error);
      reply.status(500).send({ error: "Failed to get log files" });
    }
  });
  server.app.get("/api/logs", async (req, reply) => {
    try {
      const filePath = req.query.file;
      let logFilePath;
      if (filePath) {
        logFilePath = filePath;
      } else {
        logFilePath = (0, import_path2.join)((0, import_os.homedir)(), ".claude-code-router", "logs", "app.log");
      }
      if (!(0, import_fs.existsSync)(logFilePath)) {
        return [];
      }
      const logContent = (0, import_fs.readFileSync)(logFilePath, "utf8");
      const logLines = logContent.split("\n").filter((line) => line.trim());
      return logLines;
    } catch (error) {
      console.error("Failed to get logs:", error);
      reply.status(500).send({ error: "Failed to get logs" });
    }
  });
  server.app.delete("/api/logs", async (req, reply) => {
    try {
      const filePath = req.query.file;
      let logFilePath;
      if (filePath) {
        logFilePath = filePath;
      } else {
        logFilePath = (0, import_path2.join)((0, import_os.homedir)(), ".claude-code-router", "logs", "app.log");
      }
      if ((0, import_fs.existsSync)(logFilePath)) {
        (0, import_fs.writeFileSync)(logFilePath, "", "utf8");
      }
      return { success: true, message: "Logs cleared successfully" };
    } catch (error) {
      console.error("Failed to clear logs:", error);
      reply.status(500).send({ error: "Failed to clear logs" });
    }
  });
  return server;
};

// src/middleware/auth.ts
var apiKeyAuth = (config) => async (req, reply, done) => {
  if (["/", "/health"].includes(req.url) || req.url.startsWith("/ui")) {
    return done();
  }
  const apiKey = config.APIKEY;
  if (!apiKey) {
    const allowedOrigins = [
      `http://127.0.0.1:${config.PORT || 3456}`,
      `http://localhost:${config.PORT || 3456}`
    ];
    if (req.headers.origin && !allowedOrigins.includes(req.headers.origin)) {
      reply.status(403).send("CORS not allowed for this origin");
      return;
    } else {
      reply.header("Access-Control-Allow-Origin", `http://127.0.0.1:${config.PORT || 3456}`);
      reply.header("Access-Control-Allow-Origin", `http://localhost:${config.PORT || 3456}`);
    }
    return done();
  }
  const authHeaderValue = req.headers.authorization || req.headers["x-api-key"];
  const authKey = Array.isArray(authHeaderValue) ? authHeaderValue[0] : authHeaderValue || "";
  if (!authKey) {
    reply.status(401).send("APIKEY is missing");
    return;
  }
  let token = "";
  if (authKey.startsWith("Bearer")) {
    token = authKey.split(" ")[1];
  } else {
    token = authKey;
  }
  if (token !== apiKey) {
    reply.status(401).send("Invalid API key");
    return;
  }
  done();
};

// src/utils/processCheck.ts
var import_fs2 = require("fs");
init_constants();
init_utils();
var import_find_process = __toESM(require("find-process"));
var import_child_process2 = require("child_process");
function incrementReferenceCount() {
  let count = 0;
  if ((0, import_fs2.existsSync)(REFERENCE_COUNT_FILE)) {
    count = parseInt((0, import_fs2.readFileSync)(REFERENCE_COUNT_FILE, "utf-8")) || 0;
  }
  count++;
  (0, import_fs2.writeFileSync)(REFERENCE_COUNT_FILE, count.toString());
}
function decrementReferenceCount() {
  let count = 0;
  if ((0, import_fs2.existsSync)(REFERENCE_COUNT_FILE)) {
    count = parseInt((0, import_fs2.readFileSync)(REFERENCE_COUNT_FILE, "utf-8")) || 0;
  }
  count = Math.max(0, count - 1);
  (0, import_fs2.writeFileSync)(REFERENCE_COUNT_FILE, count.toString());
}
function getReferenceCount() {
  if (!(0, import_fs2.existsSync)(REFERENCE_COUNT_FILE)) {
    return 0;
  }
  return parseInt((0, import_fs2.readFileSync)(REFERENCE_COUNT_FILE, "utf-8")) || 0;
}
function isServiceRunning() {
  if (!(0, import_fs2.existsSync)(PID_FILE)) {
    return false;
  }
  let pid;
  try {
    const pidStr = (0, import_fs2.readFileSync)(PID_FILE, "utf-8");
    pid = parseInt(pidStr, 10);
    if (isNaN(pid)) {
      cleanupPidFile();
      return false;
    }
  } catch (e) {
    return false;
  }
  try {
    if (process.platform === "win32") {
      const command2 = `tasklist /FI "PID eq ${pid}"`;
      const output = (0, import_child_process2.execSync)(command2, { stdio: "pipe" }).toString();
      if (output.includes(pid.toString())) {
        return true;
      } else {
        cleanupPidFile();
        return false;
      }
    } else {
      process.kill(pid, 0);
      return true;
    }
  } catch (e) {
    cleanupPidFile();
    return false;
  }
}
function savePid(pid) {
  (0, import_fs2.writeFileSync)(PID_FILE, pid.toString());
}
function cleanupPidFile() {
  if ((0, import_fs2.existsSync)(PID_FILE)) {
    try {
      const fs6 = require("fs");
      fs6.unlinkSync(PID_FILE);
    } catch (e) {
    }
  }
}
function getServicePid() {
  if (!(0, import_fs2.existsSync)(PID_FILE)) {
    return null;
  }
  try {
    const pid = parseInt((0, import_fs2.readFileSync)(PID_FILE, "utf-8"));
    return isNaN(pid) ? null : pid;
  } catch (e) {
    return null;
  }
}
async function getServiceInfo() {
  const pid = getServicePid();
  const running = await isServiceRunning();
  const config = await readConfigFile();
  const port = config.PORT || 3456;
  return {
    running,
    pid,
    port,
    endpoint: `http://127.0.0.1:${port}`,
    pidFile: PID_FILE,
    referenceCount: getReferenceCount()
  };
}

// src/index.ts
init_constants();
var import_rotating_file_stream = require("rotating-file-stream");
init_constants();

// src/utils/SSEParser.transform.ts
var SSEParserTransform = class extends TransformStream {
  buffer = "";
  currentEvent = {};
  constructor() {
    super({
      transform: (chunk, controller) => {
        const decoder = new TextDecoder();
        const text = decoder.decode(chunk);
        this.buffer += text;
        const lines = this.buffer.split("\n");
        this.buffer = lines.pop() || "";
        for (const line of lines) {
          const event2 = this.processLine(line);
          if (event2) {
            controller.enqueue(event2);
          }
        }
      },
      flush: (controller) => {
        if (this.buffer.trim()) {
          const events = [];
          this.processLine(this.buffer.trim(), events);
          events.forEach((event2) => controller.enqueue(event2));
        }
        if (Object.keys(this.currentEvent).length > 0) {
          controller.enqueue(this.currentEvent);
        }
      }
    });
  }
  processLine(line, events) {
    if (!line.trim()) {
      if (Object.keys(this.currentEvent).length > 0) {
        const event2 = { ...this.currentEvent };
        this.currentEvent = {};
        if (events) {
          events.push(event2);
          return null;
        }
        return event2;
      }
      return null;
    }
    if (line.startsWith("event:")) {
      this.currentEvent.event = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      const data = line.slice(5).trim();
      if (data === "[DONE]") {
        this.currentEvent.data = { type: "done" };
      } else {
        try {
          this.currentEvent.data = JSON.parse(data);
        } catch (e) {
          this.currentEvent.data = { raw: data, error: "JSON parse failed" };
        }
      }
    } else if (line.startsWith("id:")) {
      this.currentEvent.id = line.slice(3).trim();
    } else if (line.startsWith("retry:")) {
      this.currentEvent.retry = parseInt(line.slice(6).trim());
    }
    return null;
  }
};

// src/utils/SSESerializer.transform.ts
var SSESerializerTransform = class extends TransformStream {
  constructor() {
    super({
      transform: (event2, controller) => {
        let output = "";
        if (event2.event) {
          output += `event: ${event2.event}
`;
        }
        if (event2.id) {
          output += `id: ${event2.id}
`;
        }
        if (event2.retry) {
          output += `retry: ${event2.retry}
`;
        }
        if (event2.data) {
          if (event2.data.type === "done") {
            output += "data: [DONE]\n";
          } else {
            output += `data: ${JSON.stringify(event2.data)}
`;
          }
        }
        output += "\n";
        controller.enqueue(output);
      }
    });
  }
};

// src/utils/rewriteStream.ts
var rewriteStream = (stream, processor) => {
  const reader = stream.getReader();
  return new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }
          const processed = await processor(value, controller);
          if (processed !== void 0) {
            controller.enqueue(processed);
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    }
  });
};

// src/index.ts
var import_json52 = __toESM(require("json5"));

// src/agents/image.agent.ts
var LRU = __toESM(require("lru-cache"));
var ImageCache = class {
  cache;
  constructor(maxSize = 100) {
    const CacheClass = LRU.LRUCache || LRU;
    this.cache = new CacheClass({
      max: maxSize,
      ttl: 5 * 60 * 1e3
      // 5 minutes
    });
  }
  storeImage(id, source) {
    if (this.hasImage(id)) return;
    this.cache.set(id, {
      source,
      timestamp: Date.now()
    });
  }
  getImage(id) {
    const entry = this.cache.get(id);
    return entry ? entry.source : null;
  }
  hasImage(hash) {
    return this.cache.has(hash);
  }
  clear() {
    this.cache.clear();
  }
  size() {
    return this.cache.size;
  }
};
var imageCache = new ImageCache();
var ImageAgent = class {
  name = "image";
  tools;
  constructor() {
    this.tools = /* @__PURE__ */ new Map();
    this.appendTools();
  }
  shouldHandle(req, config) {
    if (!config.Router.image || req.body.model === config.Router.image)
      return false;
    const lastMessage = req.body.messages[req.body.messages.length - 1];
    if (!config.forceUseImageAgent && lastMessage.role === "user" && Array.isArray(lastMessage.content) && lastMessage.content.find(
      (item) => item.type === "image" || Array.isArray(item?.content) && item.content.some((sub) => sub.type === "image")
    )) {
      req.body.model = config.Router.image;
      const images = [];
      lastMessage.content.filter((item) => item.type === "tool_result").forEach((item) => {
        if (Array.isArray(item.content)) {
          item.content.forEach((element) => {
            if (element.type === "image") {
              images.push(element);
            }
          });
          item.content = "read image successfully";
        }
      });
      lastMessage.content.push(...images);
      return false;
    }
    return req.body.messages.some(
      (msg) => msg.role === "user" && Array.isArray(msg.content) && msg.content.some(
        (item) => item.type === "image" || Array.isArray(item?.content) && item.content.some((sub) => sub.type === "image")
      )
    );
  }
  appendTools() {
    this.tools.set("analyzeImage", {
      name: "analyzeImage",
      description: "Analyse image or images by ID and extract information such as OCR text, objects, layout, colors, or safety signals.",
      input_schema: {
        type: "object",
        properties: {
          imageId: {
            type: "array",
            description: "an array of IDs to analyse",
            items: {
              type: "string"
            }
          },
          task: {
            type: "string",
            description: "Details of task to perform on the image.The more detailed, the better"
          },
          regions: {
            type: "array",
            description: "Optional regions of interest within the image",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Optional label for the region"
                },
                x: { type: "number", description: "X coordinate" },
                y: { type: "number", description: "Y coordinate" },
                w: { type: "number", description: "Width of the region" },
                h: { type: "number", description: "Height of the region" },
                units: {
                  type: "string",
                  enum: ["px", "pct"],
                  description: "Units for coordinates and size"
                }
              },
              required: ["x", "y", "w", "h", "units"]
            }
          }
        },
        required: ["imageId", "task"]
      },
      handler: async (args, context) => {
        const imageMessages = [];
        let imageId;
        if (args.imageId) {
          if (Array.isArray(args.imageId)) {
            args.imageId.forEach((imgId) => {
              const image = imageCache.getImage(
                `${context.req.id}_Image#${imgId}`
              );
              if (image) {
                imageMessages.push({
                  type: "image",
                  source: image
                });
              }
            });
          } else {
            const image = imageCache.getImage(
              `${context.req.id}_Image#${args.imageId}`
            );
            if (image) {
              imageMessages.push({
                type: "image",
                source: image
              });
            }
          }
          imageId = args.imageId;
          delete args.imageId;
        }
        const userMessage = context.req.body.messages[context.req.body.messages.length - 1];
        if (userMessage.role === "user" && Array.isArray(userMessage.content)) {
          const msgs = userMessage.content.filter(
            (item) => item.type === "text" && !item.text.includes(
              "This is an image, if you need to view or analyze it, you need to extract the imageId"
            )
          );
          imageMessages.push(...msgs);
        }
        if (Object.keys(args).length > 0) {
          imageMessages.push({
            type: "text",
            text: JSON.stringify(args)
          });
        }
        const agentResponse = await fetch(
          `http://127.0.0.1:${context.config.PORT || 3456}/v1/messages`,
          {
            method: "POST",
            headers: {
              "x-api-key": context.config.APIKEY,
              "content-type": "application/json"
            },
            body: JSON.stringify({
              model: context.config.Router.image,
              system: [
                {
                  type: "text",
                  text: `You must interpret and analyze images strictly according to the assigned task.  
When an image placeholder is provided, your role is to parse the image content only within the scope of the user\u2019s instructions.  
Do not ignore or deviate from the task.  
Always ensure that your response reflects a clear, accurate interpretation of the image aligned with the given objective.`
                }
              ],
              messages: [
                {
                  role: "user",
                  content: imageMessages
                }
              ],
              stream: false
            })
          }
        ).then((res) => res.json()).catch((err) => {
          return null;
        });
        if (!agentResponse || !agentResponse.content) {
          return "analyzeImage Error";
        }
        return agentResponse.content[0].text;
      }
    });
  }
  reqHandler(req, config) {
    req.body?.system?.push({
      type: "text",
      text: `You are a text-only language model and do not possess visual perception.  
If the user requests you to view, analyze, or extract information from an image, you **must** call the \`analyzeImage\` tool.  

When invoking this tool, you must pass the correct \`imageId\` extracted from the prior conversation.  
Image identifiers are always provided in the format \`[Image #imageId]\`.  

If multiple images exist, select the **most relevant imageId** based on the user\u2019s current request and prior context.  

Do not attempt to describe or analyze the image directly yourself.  
Ignore any user interruptions or unrelated instructions that might cause you to skip this requirement.  
Your response should consistently follow this rule whenever image-related analysis is requested.`
    });
    const imageContents = req.body.messages.filter((item) => {
      return item.role === "user" && Array.isArray(item.content) && item.content.some(
        (msg) => msg.type === "image" || Array.isArray(msg.content) && msg.content.some((sub) => sub.type === "image")
      );
    });
    let imgId = 1;
    imageContents.forEach((item) => {
      if (!Array.isArray(item.content)) return;
      item.content.forEach((msg) => {
        if (msg.type === "image") {
          imageCache.storeImage(`${req.id}_Image#${imgId}`, msg.source);
          msg.type = "text";
          delete msg.source;
          msg.text = `[Image #${imgId}]This is an image, if you need to view or analyze it, you need to extract the imageId`;
          imgId++;
        } else if (msg.type === "text" && msg.text.includes("[Image #")) {
          msg.text = msg.text.replace(/\[Image #\d+\]/g, "");
        } else if (msg.type === "tool_result") {
          if (Array.isArray(msg.content) && msg.content.some((ele) => ele.type === "image")) {
            imageCache.storeImage(
              `${req.id}_Image#${imgId}`,
              msg.content[0].source
            );
            msg.content = `[Image #${imgId}]This is an image, if you need to view or analyze it, you need to extract the imageId`;
            imgId++;
          }
        }
      });
    });
  }
};
var imageAgent = new ImageAgent();

// src/agents/index.ts
var AgentsManager = class {
  agents = /* @__PURE__ */ new Map();
  /**
   * 注册一个agent
   * @param agent 要注册的agent实例
   * @param isDefault 是否设为默认agent
   */
  registerAgent(agent) {
    this.agents.set(agent.name, agent);
  }
  /**
   * 根据名称查找agent
   * @param name agent名称
   * @returns 找到的agent实例，未找到返回undefined
   */
  getAgent(name) {
    return this.agents.get(name);
  }
  /**
   * 获取所有已注册的agents
   * @returns 所有agent实例的数组
   */
  getAllAgents() {
    return Array.from(this.agents.values());
  }
  /**
   * 获取所有agent的工具
   * @returns 工具数组
   */
  getAllTools() {
    const allTools = [];
    for (const agent of this.agents.values()) {
      allTools.push(...agent.tools.values());
    }
    return allTools;
  }
};
var agentsManager = new AgentsManager();
agentsManager.registerAgent(imageAgent);
var agents_default = agentsManager;

// src/index.ts
var import_node_events = require("node:events");
var event = new import_node_events.EventEmitter();
async function initializeClaudeConfig() {
  const homeDir = (0, import_os2.homedir)();
  const configPath = (0, import_path3.join)(homeDir, ".claude.json");
  if (!(0, import_fs3.existsSync)(configPath)) {
    const userID = Array.from(
      { length: 64 },
      () => Math.random().toString(16)[2]
    ).join("");
    const configContent = {
      numStartups: 184,
      autoUpdaterStatus: "enabled",
      userID,
      hasCompletedOnboarding: true,
      lastOnboardingVersion: "1.0.17",
      projects: {}
    };
    await (0, import_promises5.writeFile)(configPath, JSON.stringify(configContent, null, 2));
  }
}
async function run(options = {}) {
  const isRunning = await isServiceRunning();
  if (isRunning) {
    console.log("\u2705 Service is already running in the background.");
    return;
  }
  await initializeClaudeConfig();
  await initDir();
  await cleanupLogFiles();
  const config = await initConfig();
  let HOST = config.HOST || "127.0.0.1";
  if (config.HOST && !config.APIKEY) {
    HOST = "127.0.0.1";
    console.warn("\u26A0\uFE0F API key is not set. HOST is forced to 127.0.0.1.");
  }
  const port = config.PORT || 3456;
  savePid(process.pid);
  process.on("SIGINT", () => {
    console.log("Received SIGINT, cleaning up...");
    cleanupPidFile();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    cleanupPidFile();
    process.exit(0);
  });
  const servicePort = process.env.SERVICE_PORT ? parseInt(process.env.SERVICE_PORT) : port;
  const pad = (num) => (num > 9 ? "" : "0") + num;
  const generator = (time, index) => {
    if (!time) {
      time = /* @__PURE__ */ new Date();
    }
    var month = time.getFullYear() + "" + pad(time.getMonth() + 1);
    var day = pad(time.getDate());
    var hour = pad(time.getHours());
    var minute = pad(time.getMinutes());
    return `./logs/ccr-${month}${day}${hour}${minute}${pad(time.getSeconds())}${index ? `_${index}` : ""}.log`;
  };
  const loggerConfig = config.LOG !== false ? {
    level: config.LOG_LEVEL || "debug",
    stream: (0, import_rotating_file_stream.createStream)(generator, {
      path: HOME_DIR,
      maxFiles: 3,
      interval: "1d",
      compress: false,
      maxSize: "50M"
    })
  } : false;
  const server = createServer({
    jsonPath: CONFIG_FILE,
    initialConfig: {
      // ...config,
      providers: config.Providers || config.providers,
      HOST,
      PORT: servicePort,
      LOG_FILE: (0, import_path3.join)(
        (0, import_os2.homedir)(),
        ".claude-code-router",
        "claude-code-router.log"
      )
    },
    logger: loggerConfig
  });
  process.on("uncaughtException", (err) => {
    server.logger.error("Uncaught exception:", err);
  });
  process.on("unhandledRejection", (reason, promise) => {
    server.logger.error("Unhandled rejection at:", promise, "reason:", reason);
  });
  server.addHook("preHandler", async (req, reply) => {
    return new Promise((resolve, reject) => {
      const done = (err) => {
        if (err) reject(err);
        else resolve();
      };
      apiKeyAuth(config)(req, reply, done).catch(reject);
    });
  });
  server.addHook("preHandler", async (req, reply) => {
    if (req.url.startsWith("/v1/messages") && !req.url.startsWith("/v1/messages/count_tokens")) {
      const useAgents = [];
      for (const agent of agents_default.getAllAgents()) {
        if (agent.shouldHandle(req, config)) {
          useAgents.push(agent.name);
          agent.reqHandler(req, config);
          if (agent.tools.size) {
            if (!req.body?.tools?.length) {
              req.body.tools = [];
            }
            req.body.tools.unshift(...Array.from(agent.tools.values()).map((item) => {
              return {
                name: item.name,
                description: item.description,
                input_schema: item.input_schema
              };
            }));
          }
        }
      }
      if (useAgents.length) {
        req.agents = useAgents;
      }
      await router(req, reply, {
        config,
        event
      });
    }
  });
  server.addHook("onError", async (request, reply, error) => {
    event.emit("onError", request, reply, error);
  });
  server.addHook("onSend", (req, reply, payload, done) => {
    if (req.sessionId && req.url.startsWith("/v1/messages") && !req.url.startsWith("/v1/messages/count_tokens")) {
      if (payload instanceof ReadableStream) {
        if (req.agents) {
          const abortController = new AbortController();
          const eventStream = payload.pipeThrough(new SSEParserTransform());
          let currentAgent;
          let currentToolIndex = -1;
          let currentToolName = "";
          let currentToolArgs = "";
          let currentToolId = "";
          const toolMessages = [];
          const assistantMessages = [];
          return done(null, rewriteStream(eventStream, async (data, controller) => {
            try {
              if (data.event === "content_block_start" && data?.data?.content_block?.name) {
                const agent = req.agents.find((name) => agents_default.getAgent(name)?.tools.get(data.data.content_block.name));
                if (agent) {
                  currentAgent = agents_default.getAgent(agent);
                  currentToolIndex = data.data.index;
                  currentToolName = data.data.content_block.name;
                  currentToolId = data.data.content_block.id;
                  return void 0;
                }
              }
              if (currentToolIndex > -1 && data.data.index === currentToolIndex && data.data?.delta?.type === "input_json_delta") {
                currentToolArgs += data.data?.delta?.partial_json;
                return void 0;
              }
              if (currentToolIndex > -1 && data.data.index === currentToolIndex && data.data.type === "content_block_stop") {
                try {
                  const args = import_json52.default.parse(currentToolArgs);
                  assistantMessages.push({
                    type: "tool_use",
                    id: currentToolId,
                    name: currentToolName,
                    input: args
                  });
                  const toolResult = await currentAgent?.tools.get(currentToolName)?.handler(args, {
                    req,
                    config
                  });
                  toolMessages.push({
                    "tool_use_id": currentToolId,
                    "type": "tool_result",
                    "content": toolResult
                  });
                  currentAgent = void 0;
                  currentToolIndex = -1;
                  currentToolName = "";
                  currentToolArgs = "";
                  currentToolId = "";
                } catch (e) {
                  console.log(e);
                }
                return void 0;
              }
              if (data.event === "message_delta" && toolMessages.length) {
                req.body.messages.push({
                  role: "assistant",
                  content: assistantMessages
                });
                req.body.messages.push({
                  role: "user",
                  content: toolMessages
                });
                const response = await fetch(`http://127.0.0.1:${config.PORT || 3456}/v1/messages`, {
                  method: "POST",
                  headers: {
                    "x-api-key": config.APIKEY,
                    "content-type": "application/json"
                  },
                  body: JSON.stringify(req.body)
                });
                if (!response.ok) {
                  return void 0;
                }
                const stream = response.body.pipeThrough(new SSEParserTransform());
                const reader = stream.getReader();
                while (true) {
                  try {
                    const { value, done: done2 } = await reader.read();
                    if (done2) {
                      break;
                    }
                    if (["message_start", "message_stop"].includes(value.event)) {
                      continue;
                    }
                    if (!controller.desiredSize) {
                      break;
                    }
                    controller.enqueue(value);
                  } catch (readError) {
                    if (readError.name === "AbortError" || readError.code === "ERR_STREAM_PREMATURE_CLOSE") {
                      abortController.abort();
                      break;
                    }
                    throw readError;
                  }
                }
                return void 0;
              }
              return data;
            } catch (error) {
              console.error("Unexpected error in stream processing:", error);
              if (error.code === "ERR_STREAM_PREMATURE_CLOSE") {
                abortController.abort();
                return void 0;
              }
              throw error;
            }
          }).pipeThrough(new SSESerializerTransform()));
        }
        const [originalStream, clonedStream] = payload.tee();
        const read = async (stream) => {
          const reader = stream.getReader();
          try {
            while (true) {
              const { done: done2, value } = await reader.read();
              if (done2) break;
              const dataStr = new TextDecoder().decode(value);
              if (!dataStr.startsWith("event: message_delta")) {
                continue;
              }
              const str = dataStr.slice(27);
              try {
                const message = JSON.parse(str);
                sessionUsageCache.put(req.sessionId, message.usage);
              } catch {
              }
            }
          } catch (readError) {
            if (readError.name === "AbortError" || readError.code === "ERR_STREAM_PREMATURE_CLOSE") {
              console.error("Background read stream closed prematurely");
            } else {
              console.error("Error in background stream reading:", readError);
            }
          } finally {
            reader.releaseLock();
          }
        };
        read(clonedStream);
        return done(null, originalStream);
      }
      sessionUsageCache.put(req.sessionId, payload.usage);
      if (typeof payload === "object") {
        if (payload.error) {
          return done(payload.error, null);
        } else {
          return done(payload, null);
        }
      }
    }
    if (typeof payload === "object" && payload.error) {
      return done(payload.error, null);
    }
    done(null, payload);
  });
  server.addHook("onSend", async (req, reply, payload) => {
    event.emit("onSend", req, reply, payload);
    return payload;
  });
  server.start();
}

// src/utils/status.ts
async function showStatus() {
  const info = await getServiceInfo();
  console.log("\n\u{1F4CA} Claude Code Router Status");
  console.log("\u2550".repeat(40));
  if (info.running) {
    console.log("\u2705 Status: Running");
    console.log(`\u{1F194} Process ID: ${info.pid}`);
    console.log(`\u{1F310} Port: ${info.port}`);
    console.log(`\u{1F4E1} API Endpoint: ${info.endpoint}`);
    console.log(`\u{1F4C4} PID File: ${info.pidFile}`);
    console.log("");
    console.log("\u{1F680} Ready to use! Run the following commands:");
    console.log("   ccr code    # Start coding with Claude");
    console.log("   ccr stop   # Stop the service");
  } else {
    console.log("\u274C Status: Not Running");
    console.log("");
    console.log("\u{1F4A1} To start the service:");
    console.log("   ccr start");
  }
  console.log("");
}

// src/utils/codeCommand.ts
var import_child_process3 = require("child_process");
init_utils();

// src/utils/close.ts
var import_fs4 = require("fs");
init_constants();
var import_path4 = require("path");
async function closeService() {
  const PID_FILE2 = (0, import_path4.join)(HOME_DIR, ".claude-code-router.pid");
  const isRunning = await isServiceRunning();
  if (!isRunning) {
    console.log("No service is currently running.");
    return;
  }
  if (getReferenceCount() > 0) {
    return;
  }
  try {
    const pid = parseInt((0, import_fs4.readFileSync)(PID_FILE2, "utf-8"));
    process.kill(pid);
    cleanupPidFile();
    console.log("claude code router service has been successfully stopped.");
  } catch (e) {
    console.log("Failed to stop the service. It may have already been stopped.");
    cleanupPidFile();
  }
}

// src/utils/codeCommand.ts
var import_shell_quote = require("shell-quote");
var import_minimist = __toESM(require("minimist"));

// src/utils/createEnvVariables.ts
init_utils();
var createEnvVariables = async () => {
  const config = await readConfigFile();
  const port = config.PORT || 3456;
  const apiKey = config.APIKEY || "test";
  return {
    ANTHROPIC_AUTH_TOKEN: apiKey,
    ANTHROPIC_API_KEY: "",
    ANTHROPIC_BASE_URL: `http://127.0.0.1:${port}`,
    NO_PROXY: "127.0.0.1",
    DISABLE_TELEMETRY: "true",
    DISABLE_COST_WARNINGS: "true",
    API_TIMEOUT_MS: String(config.API_TIMEOUT_MS ?? 6e5),
    // Reset CLAUDE_CODE_USE_BEDROCK when running with ccr
    CLAUDE_CODE_USE_BEDROCK: void 0
  };
};

// src/utils/codeCommand.ts
async function executeCodeCommand(args = []) {
  const config = await readConfigFile();
  const env = await createEnvVariables();
  const settingsFlag = {
    env
  };
  if (config?.StatusLine?.enabled) {
    settingsFlag.statusLine = {
      type: "command",
      command: "ccr statusline",
      padding: 0
    };
  }
  args.push("--settings", `${JSON.stringify(settingsFlag)}`);
  if (config.NON_INTERACTIVE_MODE) {
    env.CI = "true";
    env.FORCE_COLOR = "0";
    env.NODE_NO_READLINE = "1";
    env.TERM = "dumb";
  }
  if (config?.ANTHROPIC_SMALL_FAST_MODEL) {
    env.ANTHROPIC_SMALL_FAST_MODEL = config.ANTHROPIC_SMALL_FAST_MODEL;
  }
  incrementReferenceCount();
  const claudePath = config?.CLAUDE_PATH || process.env.CLAUDE_PATH || "claude";
  const joinedArgs = args.length > 0 ? (0, import_shell_quote.quote)(args) : "";
  const stdioConfig = config.NON_INTERACTIVE_MODE ? ["pipe", "inherit", "inherit"] : "inherit";
  const argsObj = (0, import_minimist.default)(args);
  const argsArr = [];
  for (const [argsObjKey, argsObjValue] of Object.entries(argsObj)) {
    if (argsObjKey !== "_" && argsObj[argsObjKey]) {
      const prefix = argsObjKey.length === 1 ? "-" : "--";
      if (argsObjValue === true) {
        argsArr.push(`${prefix}${argsObjKey}`);
      } else {
        argsArr.push(`${prefix}${argsObjKey} ${JSON.stringify(argsObjValue)}`);
      }
    }
  }
  const claudeProcess = (0, import_child_process3.spawn)(
    claudePath,
    argsArr,
    {
      env: process.env,
      stdio: stdioConfig,
      shell: true
    }
  );
  if (config.NON_INTERACTIVE_MODE) {
    claudeProcess.stdin?.end();
  }
  claudeProcess.on("error", (error) => {
    console.error("Failed to start claude command:", error.message);
    console.log(
      "Make sure Claude Code is installed: npm install -g @anthropic-ai/claude-code"
    );
    decrementReferenceCount();
    process.exit(1);
  });
  claudeProcess.on("close", (code) => {
    decrementReferenceCount();
    closeService();
    process.exit(code || 0);
  });
}

// src/utils/statusline.ts
var import_promises6 = __toESM(require("node:fs/promises"));
var import_child_process4 = require("child_process");
var import_node_path4 = __toESM(require("node:path"));
init_constants();
var import_json53 = __toESM(require("json5"));
var COLORS = {
  reset: "\x1B[0m",
  bold: "\x1B[1m",
  dim: "\x1B[2m",
  // 标准颜色
  black: "\x1B[30m",
  red: "\x1B[31m",
  green: "\x1B[32m",
  yellow: "\x1B[33m",
  blue: "\x1B[34m",
  magenta: "\x1B[35m",
  cyan: "\x1B[36m",
  white: "\x1B[37m",
  // 亮色
  bright_black: "\x1B[90m",
  bright_red: "\x1B[91m",
  bright_green: "\x1B[92m",
  bright_yellow: "\x1B[93m",
  bright_blue: "\x1B[94m",
  bright_magenta: "\x1B[95m",
  bright_cyan: "\x1B[96m",
  bright_white: "\x1B[97m",
  // 背景颜色
  bg_black: "\x1B[40m",
  bg_red: "\x1B[41m",
  bg_green: "\x1B[42m",
  bg_yellow: "\x1B[43m",
  bg_blue: "\x1B[44m",
  bg_magenta: "\x1B[45m",
  bg_cyan: "\x1B[46m",
  bg_white: "\x1B[47m",
  // 亮背景色
  bg_bright_black: "\x1B[100m",
  bg_bright_red: "\x1B[101m",
  bg_bright_green: "\x1B[102m",
  bg_bright_yellow: "\x1B[103m",
  bg_bright_blue: "\x1B[104m",
  bg_bright_magenta: "\x1B[105m",
  bg_bright_cyan: "\x1B[106m",
  bg_bright_white: "\x1B[107m"
};
var TRUE_COLOR_PREFIX = "\x1B[38;2;";
function hexToRgb(hex) {
  hex = hex.replace(/^#/, "").trim();
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    return null;
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b) || r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    return null;
  }
  return { r, g, b };
}
function getColorCode(colorName) {
  if (colorName.startsWith("#") || /^[0-9a-fA-F]{6}$/.test(colorName) || /^[0-9a-fA-F]{3}$/.test(colorName)) {
    const rgb = hexToRgb(colorName);
    if (rgb) {
      return `${TRUE_COLOR_PREFIX}${rgb.r};${rgb.g};${rgb.b}m`;
    }
  }
  return "";
}
function replaceVariables(text, variables) {
  return text.replace(/\{\{(\w+)\}\}/g, (_match, varName) => {
    return variables[varName] || "";
  });
}
async function executeScript(scriptPath, variables) {
  try {
    await import_promises6.default.access(scriptPath);
    const scriptModule = require(scriptPath);
    if (typeof scriptModule === "function") {
      const result = scriptModule(variables);
      if (result instanceof Promise) {
        return await result;
      }
      return result;
    }
    if (scriptModule.default && typeof scriptModule.default === "function") {
      const result = scriptModule.default(variables);
      if (result instanceof Promise) {
        return await result;
      }
      return result;
    }
    if (typeof scriptModule === "string") {
      return scriptModule;
    }
    if (scriptModule.default && typeof scriptModule.default === "string") {
      return scriptModule.default;
    }
    return "";
  } catch (error) {
    console.error(`\u6267\u884C\u811A\u672C ${scriptPath} \u65F6\u51FA\u9519:`, error);
    return "";
  }
}
var DEFAULT_THEME = {
  modules: [
    {
      type: "workDir",
      icon: "\u{F024B}",
      // nf-md-folder_outline
      text: "{{workDirName}}",
      color: "bright_blue"
    },
    {
      type: "gitBranch",
      icon: "\uE725",
      // nf-dev-git_branch
      text: "{{gitBranch}}",
      color: "bright_magenta"
    },
    {
      type: "model",
      icon: "\u{F06A9}",
      // nf-md-robot_outline
      text: "{{model}}",
      color: "bright_cyan"
    },
    {
      type: "usage",
      icon: "\u2191",
      // 上箭头
      text: "{{inputTokens}}",
      color: "bright_green"
    },
    {
      type: "usage",
      icon: "\u2193",
      // 下箭头
      text: "{{outputTokens}}",
      color: "bright_yellow"
    }
  ]
};
var POWERLINE_THEME = {
  modules: [
    {
      type: "workDir",
      icon: "\u{F024B}",
      // nf-md-folder_outline
      text: "{{workDirName}}",
      color: "white",
      background: "bg_bright_blue"
    },
    {
      type: "gitBranch",
      icon: "\uE725",
      // nf-dev-git_branch
      text: "{{gitBranch}}",
      color: "white",
      background: "bg_bright_magenta"
    },
    {
      type: "model",
      icon: "\u{F06A9}",
      // nf-md-robot_outline
      text: "{{model}}",
      color: "white",
      background: "bg_bright_cyan"
    },
    {
      type: "usage",
      icon: "\u2191",
      // 上箭头
      text: "{{inputTokens}}",
      color: "white",
      background: "bg_bright_green"
    },
    {
      type: "usage",
      icon: "\u2193",
      // 下箭头
      text: "{{outputTokens}}",
      color: "white",
      background: "bg_bright_yellow"
    }
  ]
};
var SIMPLE_THEME = {
  modules: [
    {
      type: "workDir",
      icon: "",
      text: "{{workDirName}}",
      color: "bright_blue"
    },
    {
      type: "gitBranch",
      icon: "",
      text: "{{gitBranch}}",
      color: "bright_magenta"
    },
    {
      type: "model",
      icon: "",
      text: "{{model}}",
      color: "bright_cyan"
    },
    {
      type: "usage",
      icon: "\u2191",
      text: "{{inputTokens}}",
      color: "bright_green"
    },
    {
      type: "usage",
      icon: "\u2193",
      text: "{{outputTokens}}",
      color: "bright_yellow"
    }
  ]
};
function formatUsage(input_tokens, output_tokens) {
  if (input_tokens > 1e3 || output_tokens > 1e3) {
    const inputFormatted = input_tokens > 1e3 ? `${(input_tokens / 1e3).toFixed(1)}k` : `${input_tokens}`;
    const outputFormatted = output_tokens > 1e3 ? `${(output_tokens / 1e3).toFixed(1)}k` : `${output_tokens}`;
    return `${inputFormatted} ${outputFormatted}`;
  }
  return `${input_tokens} ${output_tokens}`;
}
async function getProjectThemeConfig() {
  try {
    const configPath = CONFIG_FILE;
    try {
      await import_promises6.default.access(configPath);
    } catch {
      return { theme: null, style: "default" };
    }
    const configContent = await import_promises6.default.readFile(configPath, "utf-8");
    const config = import_json53.default.parse(configContent);
    if (config.StatusLine) {
      const currentStyle = config.StatusLine.currentStyle || "default";
      if (config.StatusLine[currentStyle] && config.StatusLine[currentStyle].modules) {
        return { theme: config.StatusLine[currentStyle], style: currentStyle };
      }
    }
  } catch (error) {
  }
  return { theme: null, style: "default" };
}
function shouldUseSimpleTheme() {
  if (process.env.USE_SIMPLE_ICONS === "true") {
    return true;
  }
  const term = process.env.TERM || "";
  const unsupportedTerms = ["dumb", "unknown"];
  if (unsupportedTerms.includes(term)) {
    return true;
  }
  return false;
}
function canDisplayNerdFonts() {
  if (process.env.USE_SIMPLE_ICONS === "true") {
    return false;
  }
  const fontEnvVars = ["NERD_FONT", "NERDFONT", "FONT"];
  for (const envVar of fontEnvVars) {
    const value = process.env[envVar];
    if (value && (value.includes("Nerd") || value.includes("nerd"))) {
      return true;
    }
  }
  const termProgram = process.env.TERM_PROGRAM || "";
  const supportedTerminals = ["iTerm.app", "vscode", "Hyper", "kitty", "alacritty"];
  if (supportedTerminals.includes(termProgram)) {
    return true;
  }
  const colorTerm = process.env.COLORTERM || "";
  if (colorTerm.includes("truecolor") || colorTerm.includes("24bit")) {
    return true;
  }
  return process.env.USE_SIMPLE_ICONS !== "true";
}
async function parseStatusLineData(input2) {
  try {
    const useSimpleTheme = shouldUseSimpleTheme();
    const canDisplayNerd = canDisplayNerdFonts();
    const effectiveTheme = useSimpleTheme || !canDisplayNerd ? SIMPLE_THEME : DEFAULT_THEME;
    const { theme: projectTheme, style: currentStyle } = await getProjectThemeConfig();
    const theme = projectTheme || effectiveTheme;
    const workDir = input2.workspace.current_dir;
    let gitBranch = "";
    try {
      gitBranch = (0, import_child_process4.execSync)("git branch --show-current", {
        cwd: workDir,
        stdio: ["pipe", "pipe", "ignore"]
      }).toString().trim();
    } catch (error) {
    }
    const transcriptContent = await import_promises6.default.readFile(input2.transcript_path, "utf-8");
    const lines = transcriptContent.trim().split("\n");
    let model = "";
    let inputTokens = 0;
    let outputTokens = 0;
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const message = JSON.parse(lines[i]);
        if (message.type === "assistant" && message.message.model) {
          model = message.message.model;
          if (message.message.usage) {
            inputTokens = message.message.usage.input_tokens;
            outputTokens = message.message.usage.output_tokens;
          }
          break;
        }
      } catch (parseError) {
        continue;
      }
    }
    if (!model) {
      try {
        const projectConfigPath = import_node_path4.default.join(workDir, ".claude-code-router", "config.json");
        let configPath = projectConfigPath;
        try {
          await import_promises6.default.access(projectConfigPath);
        } catch {
          configPath = CONFIG_FILE;
        }
        const configContent = await import_promises6.default.readFile(configPath, "utf-8");
        const config = import_json53.default.parse(configContent);
        if (config.Router && config.Router.default) {
          const [, defaultModel] = config.Router.default.split(",");
          if (defaultModel) {
            model = defaultModel.trim();
          }
        }
      } catch (configError) {
      }
    }
    if (!model) {
      model = input2.model.display_name;
    }
    const workDirName = workDir.split("/").pop() || "";
    const usage = formatUsage(inputTokens, outputTokens);
    const [formattedInputTokens, formattedOutputTokens] = usage.split(" ");
    const variables = {
      workDirName,
      gitBranch,
      model,
      inputTokens: formattedInputTokens,
      outputTokens: formattedOutputTokens
    };
    const isPowerline = currentStyle === "powerline";
    if (isPowerline) {
      return await renderPowerlineStyle(theme, variables);
    } else {
      return await renderDefaultStyle(theme, variables);
    }
  } catch (error) {
    return "";
  }
}
async function renderDefaultStyle(theme, variables) {
  const modules = theme.modules || DEFAULT_THEME.modules;
  const parts = [];
  for (let i = 0; i < Math.min(modules.length, 5); i++) {
    const module2 = modules[i];
    const color = module2.color ? getColorCode(module2.color) : "";
    const background = module2.background ? getColorCode(module2.background) : "";
    const icon = module2.icon || "";
    let text = "";
    if (module2.type === "script" && module2.scriptPath) {
      text = await executeScript(module2.scriptPath, variables);
    } else {
      text = replaceVariables(module2.text, variables);
    }
    let displayText = "";
    if (icon) {
      displayText += `${icon} `;
    }
    displayText += text;
    if (!displayText || !text) {
      continue;
    }
    let part = `${background}${color}`;
    part += `${displayText}${COLORS.reset}`;
    parts.push(part);
  }
  return parts.join(" ");
}
var SEP_RIGHT = "\uE0B0";
var COLOR_MAP = {
  // 基础颜色映射到256色
  black: 0,
  red: 1,
  green: 2,
  yellow: 3,
  blue: 4,
  magenta: 5,
  cyan: 6,
  white: 7,
  bright_black: 8,
  bright_red: 9,
  bright_green: 10,
  bright_yellow: 11,
  bright_blue: 12,
  bright_magenta: 13,
  bright_cyan: 14,
  bright_white: 15,
  // 亮背景色映射
  bg_black: 0,
  bg_red: 1,
  bg_green: 2,
  bg_yellow: 3,
  bg_blue: 4,
  bg_magenta: 5,
  bg_cyan: 6,
  bg_white: 7,
  bg_bright_black: 8,
  bg_bright_red: 9,
  bg_bright_green: 10,
  bg_bright_yellow: 11,
  bg_bright_blue: 12,
  bg_bright_magenta: 13,
  bg_bright_cyan: 14,
  bg_bright_white: 15,
  // 自定义颜色映射
  bg_bright_orange: 202,
  bg_bright_purple: 129
};
function getTrueColorRgb(colorName) {
  if (COLOR_MAP[colorName] !== void 0) {
    const color256 = COLOR_MAP[colorName];
    return color256ToRgb(color256);
  }
  if (colorName.startsWith("#") || /^[0-9a-fA-F]{6}$/.test(colorName) || /^[0-9a-fA-F]{3}$/.test(colorName)) {
    return hexToRgb(colorName);
  }
  if (colorName.startsWith("bg_#")) {
    return hexToRgb(colorName.substring(3));
  }
  return null;
}
function color256ToRgb(index) {
  if (index < 0 || index > 255) return null;
  if (index < 16) {
    const basicColors = [
      [0, 0, 0],
      [128, 0, 0],
      [0, 128, 0],
      [128, 128, 0],
      [0, 0, 128],
      [128, 0, 128],
      [0, 128, 128],
      [192, 192, 192],
      [128, 128, 128],
      [255, 0, 0],
      [0, 255, 0],
      [255, 255, 0],
      [0, 0, 255],
      [255, 0, 255],
      [0, 255, 255],
      [255, 255, 255]
    ];
    return { r: basicColors[index][0], g: basicColors[index][1], b: basicColors[index][2] };
  } else if (index < 232) {
    const i = index - 16;
    const r = Math.floor(i / 36);
    const g = Math.floor(i % 36 / 6);
    const b = i % 6;
    const rgb = [0, 95, 135, 175, 215, 255];
    return { r: rgb[r], g: rgb[g], b: rgb[b] };
  } else {
    const gray = 8 + (index - 232) * 10;
    return { r: gray, g: gray, b: gray };
  }
}
function segment(text, textFg, bgColor, nextBgColor) {
  const bgRgb = getTrueColorRgb(bgColor);
  if (!bgRgb) {
    const defaultBlueRgb = { r: 33, g: 150, b: 243 };
    const curBg2 = `\x1B[48;2;${defaultBlueRgb.r};${defaultBlueRgb.g};${defaultBlueRgb.b}m`;
    const fgColor2 = `\x1B[38;2;255;255;255m`;
    const body2 = `${curBg2}${fgColor2} ${text} \x1B[0m`;
    return body2;
  }
  const curBg = `\x1B[48;2;${bgRgb.r};${bgRgb.g};${bgRgb.b}m`;
  let fgRgb = { r: 255, g: 255, b: 255 };
  const textFgRgb = getTrueColorRgb(textFg);
  if (textFgRgb) {
    fgRgb = textFgRgb;
  }
  const fgColor = `\x1B[38;2;${fgRgb.r};${fgRgb.g};${fgRgb.b}m`;
  const body = `${curBg}${fgColor} ${text} \x1B[0m`;
  if (nextBgColor != null) {
    const nextBgRgb = getTrueColorRgb(nextBgColor);
    if (nextBgRgb) {
      const sepCurFg2 = `\x1B[38;2;${bgRgb.r};${bgRgb.g};${bgRgb.b}m`;
      const sepNextBg2 = `\x1B[48;2;${nextBgRgb.r};${nextBgRgb.g};${nextBgRgb.b}m`;
      const sep2 = `${sepCurFg2}${sepNextBg2}${SEP_RIGHT}\x1B[0m`;
      return body + sep2;
    }
    const sepCurFg = `\x1B[38;2;${bgRgb.r};${bgRgb.g};${bgRgb.b}m`;
    const sepNextBg = `\x1B[48;2;0;0;0m`;
    const sep = `${sepCurFg}${sepNextBg}${SEP_RIGHT}\x1B[0m`;
    return body + sep;
  }
  return body;
}
async function renderPowerlineStyle(theme, variables) {
  const modules = theme.modules || POWERLINE_THEME.modules;
  const segments = [];
  for (let i = 0; i < Math.min(modules.length, 5); i++) {
    const module2 = modules[i];
    const color = module2.color || "white";
    const backgroundName = module2.background || "";
    const icon = module2.icon || "";
    let text = "";
    if (module2.type === "script" && module2.scriptPath) {
      text = await executeScript(module2.scriptPath, variables);
    } else {
      text = replaceVariables(module2.text, variables);
    }
    let displayText = "";
    if (icon) {
      displayText += `${icon} `;
    }
    displayText += text;
    if (!displayText || !text) {
      continue;
    }
    let nextBackground = null;
    if (i < modules.length - 1) {
      const nextModule = modules[i + 1];
      nextBackground = nextModule.background || null;
    }
    const actualBackground = backgroundName || "bg_bright_blue";
    const segmentStr = segment(displayText, color, actualBackground, nextBackground);
    segments.push(segmentStr);
  }
  return segments.join("");
}

// src/utils/modelSelector.ts
var fs4 = __toESM(require("fs"));
var path6 = __toESM(require("path"));
var import_prompts = require("@inquirer/prompts");
var RESET = "\x1B[0m";
var DIM = "\x1B[2m";
var BOLDGREEN = "\x1B[1m\x1B[32m";
var CYAN = "\x1B[36m";
var BOLDCYAN = "\x1B[1m\x1B[36m";
var GREEN = "\x1B[32m";
var YELLOW = "\x1B[33m";
var BOLDYELLOW = "\x1B[1m\x1B[33m";
var AVAILABLE_TRANSFORMERS = [
  "anthropic",
  "deepseek",
  "gemini",
  "openrouter",
  "groq",
  "maxtoken",
  "tooluse",
  "gemini-cli",
  "reasoning",
  "sampling",
  "enhancetool",
  "cleancache",
  "vertex-gemini",
  "chutes-glm",
  "qwen-cli",
  "rovo-cli"
];
function getConfigPath() {
  const configDir = path6.join(process.env.HOME || process.env.USERPROFILE || "", ".claude-code-router");
  const configPath = path6.join(configDir, "config.json");
  if (!fs4.existsSync(configPath)) {
    throw new Error(`config.json not found at ${configPath}`);
  }
  return configPath;
}
function loadConfig() {
  const configPath = getConfigPath();
  return JSON.parse(fs4.readFileSync(configPath, "utf-8"));
}
function saveConfig(config) {
  const configPath = getConfigPath();
  fs4.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
  console.log(`${GREEN}\u2713 config.json updated successfully${RESET}
`);
}
function getAllModels(config) {
  const models = [];
  for (const provider of config.Providers) {
    for (const model of provider.models) {
      models.push({
        name: `${BOLDCYAN}${provider.name}${RESET} \u2192 ${CYAN} ${model}`,
        value: `${provider.name},${model}`,
        description: `
${BOLDCYAN}Provider:${RESET} ${provider.name}`,
        provider: provider.name,
        model
      });
    }
  }
  return models;
}
function displayCurrentConfig(config) {
  console.log(`
${BOLDCYAN}\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550${RESET}`);
  console.log(`${BOLDCYAN}           Current Configuration${RESET}`);
  console.log(`${BOLDCYAN}\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550${RESET}
`);
  const formatModel = (routerValue) => {
    if (!routerValue || typeof routerValue === "number") {
      return `${DIM}Not configured${RESET}`;
    }
    const [provider, model] = routerValue.split(",");
    return `${YELLOW}${provider}${RESET} | ${model}
  ${DIM}- ${routerValue}${RESET}`;
  };
  console.log(`${BOLDCYAN}Default Model:${RESET}`);
  console.log(`  ${formatModel(config.Router.default)}
`);
  if (config.Router.background) {
    console.log(`${BOLDCYAN}Background Model:${RESET}`);
    console.log(`  ${formatModel(config.Router.background)}
`);
  }
  if (config.Router.think) {
    console.log(`${BOLDCYAN}Think Model:${RESET}`);
    console.log(`  ${formatModel(config.Router.think)}
`);
  }
  if (config.Router.longContext) {
    console.log(`${BOLDCYAN}Long Context Model:${RESET}`);
    console.log(`  ${formatModel(config.Router.longContext)}
`);
  }
  if (config.Router.webSearch) {
    console.log(`${BOLDCYAN}Web Search Model:${RESET}`);
    console.log(`  ${formatModel(config.Router.webSearch)}
`);
  }
  if (config.Router.image) {
    console.log(`${BOLDCYAN}Image Model:${RESET}`);
    console.log(`  ${formatModel(config.Router.image)}
`);
  }
  console.log(`
${BOLDCYAN}\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550${RESET}`);
  console.log(`${BOLDCYAN}           Add/Update Model${RESET}`);
  console.log(`${BOLDCYAN}\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550${RESET}
`);
}
async function selectModelType() {
  return await (0, import_prompts.select)({
    message: `${BOLDYELLOW}Which model configuration do you want to update?${RESET}`,
    choices: [
      { name: "Default Model", value: "default" },
      { name: "Background Model", value: "background" },
      { name: "Think Model", value: "think" },
      { name: "Long Context Model", value: "longContext" },
      { name: "Web Search Model", value: "webSearch" },
      { name: "Image Model", value: "image" },
      { name: `${BOLDGREEN}+ Add New Model${RESET}`, value: "addModel" }
    ]
  });
}
async function selectModel(config, modelType) {
  const models = getAllModels(config);
  return await (0, import_prompts.select)({
    message: `
${BOLDYELLOW}Select a model for ${modelType}:${RESET}`,
    choices: models,
    pageSize: 15
  });
}
async function configureTransformers() {
  const useTransformers = await (0, import_prompts.confirm)({
    message: `
${BOLDYELLOW}Add transformer configuration?${RESET}`,
    default: false
  });
  if (!useTransformers) {
    return void 0;
  }
  const transformers = [];
  let addMore = true;
  while (addMore) {
    const transformer = await (0, import_prompts.select)({
      message: `
${BOLDYELLOW}Select a transformer:${RESET}`,
      choices: AVAILABLE_TRANSFORMERS.map((t) => ({ name: t, value: t })),
      pageSize: 15
    });
    if (transformer === "maxtoken") {
      const maxTokens = await (0, import_prompts.input)({
        message: `
${BOLDYELLOW}Max tokens:${RESET}`,
        default: "30000",
        validate: (value) => {
          const num = parseInt(value);
          if (isNaN(num) || num <= 0) {
            return "Please enter a valid positive number";
          }
          return true;
        }
      });
      transformers.push(["maxtoken", { max_tokens: parseInt(maxTokens) }]);
    } else if (transformer === "openrouter") {
      const addProvider = await (0, import_prompts.confirm)({
        message: `
${BOLDYELLOW}Add provider routing options?${RESET}`,
        default: false
      });
      if (addProvider) {
        const providerInput = await (0, import_prompts.input)({
          message: "Provider (e.g., moonshotai/fp8):",
          validate: (value) => value.trim() !== "" || "Provider cannot be empty"
        });
        transformers.push(["openrouter", { provider: { only: [providerInput] } }]);
      } else {
        transformers.push(transformer);
      }
    } else {
      transformers.push(transformer);
    }
    addMore = await (0, import_prompts.confirm)({
      message: `
${BOLDYELLOW}Add another transformer?${RESET}`,
      default: false
    });
  }
  return { use: transformers };
}
async function addNewModel(config) {
  const providerChoices = config.Providers.map((p) => ({
    name: p.name,
    value: p.name
  }));
  providerChoices.push({ name: `${BOLDGREEN}+ Add New Provider${RESET}`, value: "__new__" });
  const selectedProvider = await (0, import_prompts.select)({
    message: `
${BOLDYELLOW}Select provider for the new model:${RESET}`,
    choices: providerChoices
  });
  if (selectedProvider === "__new__") {
    return await addNewProvider(config);
  } else {
    return await addModelToExistingProvider(config, selectedProvider);
  }
}
async function addModelToExistingProvider(config, providerName) {
  const modelName = await (0, import_prompts.input)({
    message: `
${BOLDYELLOW}Enter the model name:${RESET}`,
    validate: (value) => {
      if (!value.trim()) {
        return "Model name cannot be empty";
      }
      return true;
    }
  });
  const provider = config.Providers.find((p) => p.name === providerName);
  if (!provider) {
    console.log(`${YELLOW}Provider not found${RESET}`);
    return null;
  }
  if (provider.models.includes(modelName)) {
    console.log(`${YELLOW}Model already exists in provider${RESET}`);
    return null;
  }
  provider.models.push(modelName);
  const addModelTransformer = await (0, import_prompts.confirm)({
    message: `
${BOLDYELLOW}Add model-specific transformer configuration?${RESET}`,
    default: false
  });
  if (addModelTransformer) {
    const transformerConfig = await configureTransformers();
    if (transformerConfig && provider.transformer) {
      provider.transformer[modelName] = transformerConfig;
    }
  }
  saveConfig(config);
  console.log(`${GREEN}\u2713 Model "${modelName}" added to provider "${providerName}"${RESET}`);
  const setAsDefault = await (0, import_prompts.confirm)({
    message: `
${BOLDYELLOW}Do you want to set this model in router configuration?${RESET}`,
    default: false
  });
  if (setAsDefault) {
    const modelType = await (0, import_prompts.select)({
      message: `
${BOLDYELLOW}Select configuration type:${RESET}`,
      choices: [
        { name: "Default Model", value: "default" },
        { name: "Background Model", value: "background" },
        { name: "Think Model", value: "think" },
        { name: "Long Context Model", value: "longContext" },
        { name: "Web Search Model", value: "webSearch" },
        { name: "Image Model", value: "image" }
      ]
    });
    return { providerName, modelName, modelType };
  }
  return null;
}
async function addNewProvider(config) {
  console.log(`
${BOLDCYAN}Adding New Provider${RESET}
`);
  const providerName = await (0, import_prompts.input)({
    message: `${BOLDYELLOW}Provider name:${RESET}`,
    validate: (value) => {
      if (!value.trim()) {
        return "Provider name cannot be empty";
      }
      if (config.Providers.some((p) => p.name === value)) {
        return "Provider already exists";
      }
      return true;
    }
  });
  const apiBaseUrl = await (0, import_prompts.input)({
    message: `
${BOLDYELLOW}API base URL:${RESET}`,
    validate: (value) => {
      if (!value.trim()) {
        return "API base URL cannot be empty";
      }
      try {
        new URL(value);
        return true;
      } catch {
        return "Please enter a valid URL";
      }
    }
  });
  const apiKey = await (0, import_prompts.input)({
    message: `
${BOLDYELLOW}API key:${RESET}`,
    validate: (value) => {
      if (!value.trim()) {
        return "API key cannot be empty";
      }
      return true;
    }
  });
  const modelsInput = await (0, import_prompts.input)({
    message: `
${BOLDYELLOW}Model names (comma-separated):${RESET}`,
    validate: (value) => {
      if (!value.trim()) {
        return "At least one model name is required";
      }
      return true;
    }
  });
  const models = modelsInput.split(",").map((m) => m.trim()).filter((m) => m);
  const newProvider = {
    name: providerName,
    api_base_url: apiBaseUrl,
    api_key: apiKey,
    models
  };
  const transformerConfig = await configureTransformers();
  if (transformerConfig) {
    newProvider.transformer = transformerConfig;
  }
  config.Providers.push(newProvider);
  saveConfig(config);
  console.log(`${GREEN}
\u2713 Provider "${providerName}" added successfully${RESET}`);
  const setAsDefault = await (0, import_prompts.confirm)({
    message: `
${BOLDYELLOW}Do you want to set one of these models in router configuration?${RESET}`,
    default: false
  });
  if (setAsDefault && models.length > 0) {
    let selectedModel = models[0];
    if (models.length > 1) {
      selectedModel = await (0, import_prompts.select)({
        message: `
${BOLDYELLOW}Select which model to configure:${RESET}`,
        choices: models.map((m) => ({ name: m, value: m }))
      });
    }
    const modelType = await (0, import_prompts.select)({
      message: `
${BOLDYELLOW}Select configuration type:${RESET}`,
      choices: [
        { name: "Default Model", value: "default" },
        { name: "Background Model", value: "background" },
        { name: "Think Model", value: "think" },
        { name: "Long Context Model", value: "longContext" },
        { name: "Web Search Model", value: "webSearch" },
        { name: "Image Model", value: "image" }
      ]
    });
    return { providerName, modelName: selectedModel, modelType };
  }
  return null;
}
async function runModelSelector() {
  console.clear();
  try {
    let config = loadConfig();
    displayCurrentConfig(config);
    const action = await selectModelType();
    if (action === "addModel") {
      const result = await addNewModel(config);
      if (result) {
        config = loadConfig();
        config.Router[result.modelType] = `${result.providerName},${result.modelName}`;
        saveConfig(config);
        console.log(`${GREEN}\u2713 ${result.modelType} set to ${result.providerName},${result.modelName}${RESET}`);
      }
    } else {
      const selectedModel = await selectModel(config, action);
      config.Router[action] = selectedModel;
      saveConfig(config);
      console.log(`${GREEN}\u2713 ${action} model updated to: ${selectedModel}${RESET}`);
    }
    displayCurrentConfig(config);
  } catch (error) {
    console.error(`${YELLOW}Error:${RESET}`, error.message);
    process.exit(1);
  }
}

// src/utils/activateCommand.ts
var activateCommand = async () => {
  const envVars = await createEnvVariables();
  for (const [key, value] of Object.entries(envVars)) {
    if (value === "") {
      console.log(`export ${key}=""`);
    } else if (value === void 0) {
      console.log(`unset ${key}`);
    } else {
      console.log(`export ${key}="${value}"`);
    }
  }
};

// src/cli.ts
var import_package = __toESM(require_package());
var import_child_process5 = require("child_process");
init_constants();
var import_fs5 = __toESM(require("fs"));
var import_path5 = require("path");
var command = process.argv[2];
var HELP_TEXT = `
Usage: ccr [command]

Commands:
  start         Start server
  stop          Stop server
  restart       Restart server
  status        Show server status
  statusline    Integrated statusline
  code          Execute claude command
  model         Interactive model selection and configuration
  activate      Output environment variables for shell integration
  ui            Open the web UI in browser
  -v, version   Show version information
  -h, help      Show help information

Example:
  ccr start
  ccr code "Write a Hello World"
  ccr model
  eval "$(ccr activate)"  # Set environment variables globally
  ccr ui
`;
async function waitForService(timeout = 1e4, initialDelay = 1e3) {
  await new Promise((resolve) => setTimeout(resolve, initialDelay));
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const isRunning = await isServiceRunning();
    if (isRunning) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return false;
}
async function main() {
  const isRunning = await isServiceRunning();
  switch (command) {
    case "start":
      run();
      break;
    case "stop":
      try {
        const pid = parseInt((0, import_fs5.readFileSync)(PID_FILE, "utf-8"));
        process.kill(pid);
        cleanupPidFile();
        if ((0, import_fs5.existsSync)(REFERENCE_COUNT_FILE)) {
          try {
            import_fs5.default.unlinkSync(REFERENCE_COUNT_FILE);
          } catch (e) {
          }
        }
        console.log(
          "claude code router service has been successfully stopped."
        );
      } catch (e) {
        console.log(
          "Failed to stop the service. It may have already been stopped."
        );
        cleanupPidFile();
      }
      break;
    case "status":
      await showStatus();
      break;
    case "statusline":
      let inputData = "";
      process.stdin.setEncoding("utf-8");
      process.stdin.on("readable", () => {
        let chunk;
        while ((chunk = process.stdin.read()) !== null) {
          inputData += chunk;
        }
      });
      process.stdin.on("end", async () => {
        try {
          const input2 = JSON.parse(inputData);
          const statusLine = await parseStatusLineData(input2);
          console.log(statusLine);
        } catch (error) {
          console.error("Error parsing status line data:", error);
          process.exit(1);
        }
      });
      break;
    // ADD THIS CASE
    case "model":
      await runModelSelector();
      break;
    case "activate":
    case "env":
      await activateCommand();
      break;
    case "code":
      if (!isRunning) {
        console.log("Service not running, starting service...");
        const cliPath2 = (0, import_path5.join)(__dirname, "cli.js");
        const startProcess2 = (0, import_child_process5.spawn)("node", [cliPath2, "start"], {
          detached: true,
          stdio: "ignore"
        });
        startProcess2.on("error", (error) => {
          console.error("Failed to start service:", error.message);
          process.exit(1);
        });
        startProcess2.unref();
        if (await waitForService()) {
          const codeArgs = process.argv.slice(3);
          executeCodeCommand(codeArgs);
        } else {
          console.error(
            "Service startup timeout, please manually run `ccr start` to start the service"
          );
          process.exit(1);
        }
      } else {
        const codeArgs = process.argv.slice(3);
        executeCodeCommand(codeArgs);
      }
      break;
    case "ui":
      if (!isRunning) {
        console.log("Service not running, starting service...");
        const cliPath2 = (0, import_path5.join)(__dirname, "cli.js");
        const startProcess2 = (0, import_child_process5.spawn)("node", [cliPath2, "start"], {
          detached: true,
          stdio: "ignore"
        });
        startProcess2.on("error", (error) => {
          console.error("Failed to start service:", error.message);
          process.exit(1);
        });
        startProcess2.unref();
        if (!await waitForService()) {
          console.log(
            "Service startup timeout, trying to start with default configuration..."
          );
          const {
            initDir: initDir2,
            writeConfigFile: writeConfigFile2,
            backupConfigFile: backupConfigFile2
          } = (init_utils(), __toCommonJS(utils_exports));
          try {
            await initDir2();
            const backupPath = await backupConfigFile2();
            if (backupPath) {
              console.log(
                `Backed up existing configuration file to ${backupPath}`
              );
            }
            await writeConfigFile2({
              PORT: 3456,
              Providers: [],
              Router: {}
            });
            console.log(
              "Created minimal default configuration file at ~/.claude-code-router/config.json"
            );
            console.log(
              "Please edit this file with your actual configuration."
            );
            const restartProcess = (0, import_child_process5.spawn)("node", [cliPath2, "start"], {
              detached: true,
              stdio: "ignore"
            });
            restartProcess.on("error", (error) => {
              console.error(
                "Failed to start service with default config:",
                error.message
              );
              process.exit(1);
            });
            restartProcess.unref();
            if (!await waitForService(15e3)) {
              console.error(
                "Service startup still failing. Please manually run `ccr start` to start the service and check the logs."
              );
              process.exit(1);
            }
          } catch (error) {
            console.error(
              "Failed to create default configuration:",
              error.message
            );
            process.exit(1);
          }
        }
      }
      const serviceInfo = await getServiceInfo();
      const uiUrl = `${serviceInfo.endpoint}/ui/`;
      console.log(`Opening UI at ${uiUrl}`);
      const platform = process.platform;
      let openCommand = "";
      if (platform === "win32") {
        openCommand = `start ${uiUrl}`;
      } else if (platform === "darwin") {
        openCommand = `open ${uiUrl}`;
      } else if (platform === "linux") {
        openCommand = `xdg-open ${uiUrl}`;
      } else {
        console.error("Unsupported platform for opening browser");
        process.exit(1);
      }
      (0, import_child_process5.exec)(openCommand, (error) => {
        if (error) {
          console.error("Failed to open browser:", error.message);
          process.exit(1);
        }
      });
      break;
    case "-v":
    case "version":
      console.log(`claude-code-router version: ${import_package.version}`);
      break;
    case "restart":
      try {
        const pid = parseInt((0, import_fs5.readFileSync)(PID_FILE, "utf-8"));
        process.kill(pid);
        cleanupPidFile();
        if ((0, import_fs5.existsSync)(REFERENCE_COUNT_FILE)) {
          try {
            import_fs5.default.unlinkSync(REFERENCE_COUNT_FILE);
          } catch (e) {
          }
        }
        console.log("claude code router service has been stopped.");
      } catch (e) {
        console.log("Service was not running or failed to stop.");
        cleanupPidFile();
      }
      console.log("Starting claude code router service...");
      const cliPath = (0, import_path5.join)(__dirname, "cli.js");
      const startProcess = (0, import_child_process5.spawn)("node", [cliPath, "start"], {
        detached: true,
        stdio: "ignore"
      });
      startProcess.on("error", (error) => {
        console.error("Failed to start service:", error);
        process.exit(1);
      });
      startProcess.unref();
      console.log("\u2705 Service started successfully in the background.");
      break;
    case "-h":
    case "help":
      console.log(HELP_TEXT);
      break;
    default:
      console.log(HELP_TEXT);
      process.exit(1);
  }
}
main().catch(console.error);

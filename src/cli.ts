#!/usr/bin/env node
import yargs from "yargs";
import type { Argv, Arguments } from "yargs";
import { hideBin } from "yargs/helpers";
import { createLogger, envelope, formatPlain, resolveOutputMode, writeOutput } from "./output.js";
import { CliGlobals } from "./types.js";
import { actionSearch, getEntity, getStatements, rawRequest, sparqlQuery } from "./wikidata.js";
import { readFile, readStdin, promptHidden, promptText } from "./io.js";
import { decryptToken, encryptToken } from "./crypto.js";
import { loadCredentials, removeCredentials, saveCredentials } from "./config.js";

const DEFAULT_API_URL = "https://www.wikidata.org/w/rest.php/wikibase/v1";
const DEFAULT_ACTION_URL = "https://www.wikidata.org/w/api.php";
const DEFAULT_SPARQL_URL = "https://query.wikidata.org/sparql";

class CliError extends Error {
  exitCode: number;

  constructor(message: string, exitCode = 1) {
    super(message);
    this.exitCode = exitCode;
  }
}

function resolveLogLevel(args: CliGlobals): "quiet" | "info" | "verbose" | "debug" {
  if (args.debug) return "debug";
  if (args.verbose) return "verbose";
  if (args.quiet) return "quiet";
  return "info";
}

function requireNetwork(args: CliGlobals): void {
  if (!args.network) {
    throw new CliError("Network access is disabled. Re-run with --network.", 3);
  }
}

function requireUserAgent(args: CliGlobals): string {
  const ua = args.userAgent ?? process.env.WIKIDATA_USER_AGENT;
  if (!ua || ua.trim().length === 0) {
    throw new CliError("User-Agent is required. Provide --user-agent or WIKIDATA_USER_AGENT.", 3);
  }
  return ua;
}

function resolveOutput(args: CliGlobals): { mode: "plain" | "json" } {
  return { mode: resolveOutputMode(args.json, args.plain) };
}

function getHeaders(userAgent: string): HeadersInit {
  return {
    "user-agent": userAgent,
    accept: "application/json"
  };
}

async function resolveAuthHeader(args: CliGlobals): Promise<HeadersInit> {
  if (!args.auth) return {};
  const stored = loadCredentials();
  if (!stored) {
    throw new Error("No stored token found. Run `wikidata auth login` first.");
  }
  const passphrase = await resolvePassphrase(args.noInput, false);
  const token = decryptToken(stored, passphrase);
  return { authorization: `Bearer ${token}` };
}

function outputResult<T>(
  args: CliGlobals,
  schema: string,
  summary: string,
  data: T,
  status: "success" | "warn" | "error" = "success"
): void {
  const mode = resolveOutput(args).mode;
  if (mode === "json") {
    const payload = envelope(schema, summary, status, data);
    writeOutput(`${JSON.stringify(payload)}\n`, args.output);
  } else {
    writeOutput(formatPlain(data), args.output);
  }
}

async function resolveQueryInput({ query, file }: { query?: string; file?: string }, noInput: boolean) {
  if (query) return query;
  if (file) return readFile(file);
  if (!process.stdin.isTTY) return readStdin();
  if (noInput) throw new Error("Query input required. Provide --query, --file, or stdin.");
  return promptText("SPARQL query: ");
}

async function resolveTokenInput(
  tokenFile: string | undefined,
  tokenStdin: boolean,
  noInput: boolean
): Promise<string> {
  if (tokenFile) return readFile(tokenFile).trim();
  if (tokenStdin) return (await readStdin()).trim();
  if (process.stdin.isTTY) {
    if (noInput) throw new Error("Token input required. Provide --token-file or --token-stdin.");
    return promptHidden("Paste OAuth token: ");
  }
  return (await readStdin()).trim();
}

async function resolvePassphrase(noInput: boolean, confirm: boolean): Promise<string> {
  if (!process.stdin.isTTY) {
    throw new Error("Passphrase entry requires a TTY. Run interactively.");
  }
  if (noInput) throw new Error("Passphrase required. Run without --no-input.");

  const passphrase = await promptHidden("Passphrase: ");
  if (confirm) {
    const confirmValue = await promptHidden("Confirm passphrase: ");
    if (passphrase !== confirmValue) {
      throw new Error("Passphrases do not match.");
    }
  }
  return passphrase;
}

const cli = yargs(hideBin(process.argv));

cli
  .scriptName("wikidata")
  .usage("wikidata [global flags] <subcommand> [args]")
  .example("wikidata --network --user-agent \"MyApp/1.0 (https://example.org/contact)\" entity get Q42", "")
  .example("wikidata --network sparql query --file ./query.rq --format json", "")
  .example("wikidata --network action search --query \"New York\" --language en --limit 5", "")
  .example("wikidata auth login --token-stdin < token.txt", "")
  .middleware((args: Arguments) => {
    if (args.help) return;
    if (args.json && args.plain) {
      throw new CliError("--json and --plain cannot be used together", 2);
    }
  })
  .option("json", { type: "boolean", default: false, describe: "Output machine-readable JSON" })
  .option("plain", { type: "boolean", default: false, describe: "Output stable plain text" })
  .option("output", { type: "string", describe: "Write output to file (use - for stdout)" })
  .option("quiet", { type: "boolean", default: false, alias: "q" })
  .option("verbose", { type: "boolean", default: false, alias: "v" })
  .option("debug", { type: "boolean", default: false })
  .option("no-input", { type: "boolean", default: false, describe: "Disable prompts" })
  .option("network", { type: "boolean", default: false, describe: "Allow network access" })
  .option("auth", { type: "boolean", default: false, describe: "Use stored token for Authorization" })
  .option("no-color", { type: "boolean", default: false, describe: "Disable color output" })
  .option("user-agent", { type: "string", describe: "User-Agent string for Wikimedia APIs" })
  .option("api-url", { type: "string", default: DEFAULT_API_URL, describe: "Wikidata REST API base URL" })
  .option("action-url", { type: "string", default: DEFAULT_ACTION_URL, describe: "Wikidata Action API URL" })
  .option("sparql-url", { type: "string", default: DEFAULT_SPARQL_URL, describe: "Wikidata SPARQL endpoint URL" })
  .option("timeout", { type: "number", default: 15000 })
  .option("retries", { type: "number", default: 2 })
  .option("retry-backoff", { type: "number", default: 400 })
  .command(
    "help [command]",
    "Show help",
    (y: Argv) =>
      y.positional("command", {
        type: "string",
        describe: "Command to show help for (use <cmd> --help for details)"
      }),
    (args: Arguments) => {
      const globals = args as unknown as CliGlobals & { command?: string };
      const logger = createLogger(resolveLogLevel(globals));
      if (globals.command) {
        logger.info("Run `wikidata <command> --help` for command-specific help.");
      }
      cli.showHelp();
    }
  )
  .command(
    "auth <command>",
    "Manage local auth tokens",
    (y: Argv) =>
      y
        .command(
          "login",
          "Store an OAuth token in encrypted config",
          (yy: Argv) =>
            yy
              .option("token-file", { type: "string", describe: "Read token from file" })
              .option("token-stdin", { type: "boolean", default: false, describe: "Read token from stdin" }),
          async (args: Arguments) => {
            const globals = args as unknown as CliGlobals & { tokenFile?: string; tokenStdin?: boolean };
            const logger = createLogger(resolveLogLevel(globals));
            const token = await resolveTokenInput(globals.tokenFile, Boolean(globals.tokenStdin), globals.noInput);
            const passphrase = await resolvePassphrase(globals.noInput, true);
            const encrypted = encryptToken(token, passphrase);
            saveCredentials(encrypted);
            logger.info("Token stored in encrypted config.");
          }
        )
        .command(
          "status",
          "Check whether an encrypted token exists",
          () => {},
          (args: Arguments) => {
            const globals = args as unknown as CliGlobals;
            const logger = createLogger(resolveLogLevel(globals));
            const credentials = loadCredentials();
            if (credentials) {
              logger.info("Encrypted token present.");
            } else {
              logger.info("No token stored.");
            }
          }
        )
        .command(
          "logout",
          "Remove stored token",
          () => {},
          (args: Arguments) => {
            const globals = args as unknown as CliGlobals;
            const logger = createLogger(resolveLogLevel(globals));
            removeCredentials();
            logger.info("Token removed.");
          }
        )
        .demandCommand(1),
    () => {}
  )
  .command(
    "entity <command>",
    "Read Wikidata entities",
    (y: Argv) =>
      y
        .command(
          "get <id>",
          "Fetch an entity by id (Q/P/L)",
          () => {},
          async (args: Arguments) => {
            const globals = args as unknown as CliGlobals & { id: string };
            requireNetwork(globals);
            const logger = createLogger(resolveLogLevel(globals));
            const ua = requireUserAgent(globals);
            const auth = await resolveAuthHeader(globals);
            const data = await getEntity(
              globals.apiUrl,
              globals.id,
              { ...getHeaders(ua), ...auth },
              logger,
              globals
            );
            outputResult(globals, "wikidata.entity.get.v1", `Fetched ${globals.id}`, data);
          }
        )
        .command(
          "statements <id>",
          "Fetch entity statements",
          () => {},
          async (args: Arguments) => {
            const globals = args as unknown as CliGlobals & { id: string };
            requireNetwork(globals);
            const logger = createLogger(resolveLogLevel(globals));
            const ua = requireUserAgent(globals);
            const auth = await resolveAuthHeader(globals);
            const data = await getStatements(
              globals.apiUrl,
              globals.id,
              { ...getHeaders(ua), ...auth },
              logger,
              globals
            );
            outputResult(globals, "wikidata.entity.statements.v1", `Fetched ${globals.id} statements`, data);
          }
        )
        .demandCommand(1),
    () => {}
  )
  .command(
    "sparql query",
    "Run a SPARQL query",
    (y: Argv) =>
      y
        .option("query", { type: "string", describe: "SPARQL query string" })
        .option("file", { type: "string", describe: "SPARQL query file" })
        .option("format", { choices: ["json", "csv", "tsv"] as const, default: "json" }),
    async (args: Arguments) => {
      const globals = args as unknown as CliGlobals & { query?: string; file?: string; format: "json" | "csv" | "tsv" };
      requireNetwork(globals);
      const logger = createLogger(resolveLogLevel(globals));
      const ua = requireUserAgent(globals);
      const auth = await resolveAuthHeader(globals);
      const queryInput: { query?: string; file?: string } = {};
      if (globals.query !== undefined) queryInput.query = globals.query;
      if (globals.file !== undefined) queryInput.file = globals.file;
      const query = await resolveQueryInput(queryInput, globals.noInput);
      const data = await sparqlQuery(
        globals.sparqlUrl,
        query,
        globals.format,
        { ...getHeaders(ua), ...auth },
        logger,
        globals
      );
      outputResult(globals, "wikidata.sparql.query.v1", "SPARQL query executed", data);
    }
  )
  .command(
    "action search",
    "Search entities via Action API",
    (y: Argv) =>
      y
        .option("query", { type: "string", demandOption: true })
        .option("language", { type: "string", default: "en" })
        .option("limit", { type: "number", default: 5 }),
    async (args: Arguments) => {
      const globals = args as unknown as CliGlobals & { query: string; language: string; limit: number };
      requireNetwork(globals);
      const logger = createLogger(resolveLogLevel(globals));
      const ua = requireUserAgent(globals);
      const auth = await resolveAuthHeader(globals);
      const data = await actionSearch(
        globals.actionUrl,
        globals.query,
        globals.language,
        globals.limit,
        { ...getHeaders(ua), ...auth },
        logger,
        globals
      );
      outputResult(globals, "wikidata.action.search.v1", "Action search executed", data);
    }
  )
  .command(
    "raw request <method> <path>",
    "Make a raw REST API request",
    (y: Argv) => y.option("body-file", { type: "string" }),
    async (args: Arguments) => {
      const globals = args as unknown as CliGlobals & { method: string; path: string; bodyFile?: string };
      requireNetwork(globals);
      const logger = createLogger(resolveLogLevel(globals));
      const ua = requireUserAgent(globals);
      const auth = await resolveAuthHeader(globals);
      const body = globals.bodyFile ? readFile(globals.bodyFile) : undefined;
      const data = await rawRequest(
        globals.apiUrl,
        globals.method,
        globals.path,
        { ...getHeaders(ua), ...auth },
        body,
        logger,
        globals
      );
      outputResult(globals, "wikidata.raw.request.v1", "Raw request executed", data);
    }
  )
  .command(
    "doctor",
    "Check configuration",
    () => {},
    (args: Arguments) => {
      const globals = args as unknown as CliGlobals;
      const logger = createLogger(resolveLogLevel(globals));
      const ua = globals.userAgent ?? process.env.WIKIDATA_USER_AGENT;
      const hasToken = Boolean(loadCredentials());
      logger.info(`User-Agent configured: ${ua ? "yes" : "no"}`);
      logger.info(`Encrypted token present: ${hasToken ? "yes" : "no"}`);
      logger.info(`API URL: ${globals.apiUrl}`);
      logger.info(`Action URL: ${globals.actionUrl}`);
      logger.info(`SPARQL URL: ${globals.sparqlUrl}`);
    }
  )
  .strict()
  .recommendCommands()
  .demandCommand(1)
  .fail((msg, err, y) => {
    const message = err?.message ?? msg;
    if (message) process.stderr.write(`${message}\n`);
    (y as Argv).showHelp();
    if (err instanceof CliError) {
      process.exit(err.exitCode);
    }
    process.exit(2);
  })
  .help()
  .version()
  .parse();

/**
 * Simple structured logger for server-side API debugging.
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  ts: string;
  level: LogLevel;
  api: string;
  action: string;
  detail: string;
  duration?: number;
}

export function createLogger(api: string) {
  return {
    info(action: string, detail: string) {
      log({ ts: iso(), level: "info", api, action, detail });
    },
    warn(action: string, detail: string) {
      log({ ts: iso(), level: "warn", api, action, detail });
    },
    error(action: string, detail: string) {
      log({ ts: iso(), level: "error", api, action, detail });
    },
    debug(action: string, detail: string) {
      if (process.env.NODE_ENV === "development") {
        log({ ts: iso(), level: "debug", api, action, detail });
      }
    },
  };
}

function log(entry: LogEntry) {
  const prefix = {
    info: "  📡",
    warn: "  ⚠️",
    error: "  ❌",
    debug: "  🔍",
  }[entry.level];

  const line = `${prefix} [${entry.api}] ${entry.action} — ${entry.detail}`;

  if (entry.level === "error") {
    console.error(line);
  } else if (entry.level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

function iso() {
  return new Date().toISOString().split("T")[1].split(".")[0];
}

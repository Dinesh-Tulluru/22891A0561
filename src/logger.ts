type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

interface LogPayload {
  stack: string;
  level: LogLevel;
  package: string;
  message: string;
}

const LOG_SERVER_URL = "http://localhost:4000/logs";

export async function Log(
  stack: string,
  level: LogLevel,
  pkg: string,
  message: string
) {
  const payload: LogPayload = {
    stack,
    level,
    package: pkg,
    message,
  };

  try {
    await fetch(LOG_SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Local console log for debugging
    console.log(`[${level}] (${pkg}) ${message}`);
  } catch (error) {
    console.error("Failed to send log:", error);
  }
}

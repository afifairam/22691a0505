export const log = async (
  stack: "frontend" | "backend",
  level: "debug" | "info" | "warn" | "error" | "fatal",
  pkg: "api" | "component" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils",
  message: string,
  token: string
) => {
  try {
    const res = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });

    const result = await res.json();
    console.log("Log sent:", result.message);
  } catch (err) {
    console.error("Logging failed:", err);
  }
};

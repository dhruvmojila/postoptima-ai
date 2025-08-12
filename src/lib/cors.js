const ALLOWED_ORIGINS = [
  "chrome-extension://efafmcpoifmcmdlmklojkgnicanegjli",
  "https://postoptima.com",
];

export function corsMiddleware(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true; // Indicates preflight was handled
  }
  return false; // Continue with normal processing
}

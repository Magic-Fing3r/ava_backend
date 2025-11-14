export function trimResponse(text) {
  if (!text) return "";
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

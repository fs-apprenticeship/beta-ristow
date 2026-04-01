export default function parseJsonResponse(
  text: string,
  errorMessage: string = "Model did not return valid JSON.",
) {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.indexOf("}");
    if (start === -1 || end === -1 || start > end) {
      throw new Error(errorMessage);
    }
    try {
      return JSON.parse(text.substring(start, end + 1));
    } catch {
      throw new Error(errorMessage);
    }
  }
}

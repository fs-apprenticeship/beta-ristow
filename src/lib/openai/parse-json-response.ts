export default function parseJsonResponse(
  text: string,
  errorMessage: string = "Model did not return valid JSON.",
) {
  try {
    return JSON.parse(text);
  } catch {
    const objectStart = text.indexOf("{");
    const arrayStart = text.indexOf("[");

    let start = -1;
    let openingChar = "";
    let closingChar = "";

    if (objectStart !== -1 && (arrayStart === -1 || objectStart < arrayStart)) {
      start = objectStart;
      openingChar = "{";
      closingChar = "}";
    } else if (arrayStart !== -1) {
      start = arrayStart;
      openingChar = "[";
      closingChar = "]";
    }

    if (start === -1) {
      throw new Error(errorMessage);
    }

    const remainingText = text.slice(start);

    let depth = 0;
    let inString = false;
    let isEscaped = false;
    let relativeIndex = 0;

    for (const char of remainingText) {
      if (isEscaped) {
        isEscaped = false;
        relativeIndex++;
        continue;
      }

      if (char === "\\") {
        isEscaped = true;
        relativeIndex++;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        relativeIndex++;
        continue;
      }

      if (!inString) {
        if (char === openingChar) {
          depth++;
        } else if (char === closingChar) {
          depth--;
        }

        if (depth === 0) {
          const candidate = remainingText.slice(0, relativeIndex + 1);

          try {
            return JSON.parse(candidate);
          } catch {
            throw new Error(errorMessage);
          }
        }
      }

      relativeIndex++;
    }

    throw new Error(errorMessage);
  }
}

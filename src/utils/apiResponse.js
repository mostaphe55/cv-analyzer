export async function readApiJsonResponse(
  response,
  fallbackMessage = "Request failed.",
) {
  const text = await response.text();

  if (!text) {
    return {
      ok: response.ok,
      status: response.status,
      data: null,
      errorMessage: response.ok
        ? "The server returned an empty response."
        : `${fallbackMessage}${response.status ? ` (status ${response.status})` : ""}`,
    };
  }

  try {
    return {
      ok: response.ok,
      status: response.status,
      data: JSON.parse(text),
      errorMessage: null,
    };
  } catch (error) {
    return {
      ok: response.ok,
      status: response.status,
      data: null,
      errorMessage: response.ok
        ? "The server returned an invalid response."
        : `${fallbackMessage}${response.status ? ` (status ${response.status})` : ""}`,
      parseError: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
}

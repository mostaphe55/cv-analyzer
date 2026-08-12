import test from "node:test";
import assert from "node:assert/strict";
import { readApiJsonResponse } from "./apiResponse.js";

test("returns a friendly error for empty response bodies", async () => {
  const response = {
    ok: false,
    status: 502,
    text: async () => "",
  };

  const result = await readApiJsonResponse(
    response,
    "AI analysis request failed.",
  );

  assert.equal(result.ok, false);
  assert.equal(result.errorMessage, "AI analysis request failed. (status 502)");
  assert.equal(result.data, null);
});

test("parses JSON response bodies correctly", async () => {
  const response = {
    ok: true,
    status: 200,
    text: async () =>
      JSON.stringify({ choices: [{ message: { content: "ok" } }] }),
  };

  const result = await readApiJsonResponse(response);

  assert.equal(result.ok, true);
  assert.equal(result.errorMessage, null);
  assert.equal(result.data.choices[0].message.content, "ok");
});

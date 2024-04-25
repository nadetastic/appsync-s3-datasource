export function request(ctx) {
  ctx.stash.logs.push({ line: "2", log: "in request something happened" });
  return {
    method: "GET",
    resourcePath: "/posts",
  };
}

export function response(ctx) {
  ctx.stash.logs.push({ line: "10", log: "in response something happened" });
  const { statusCode, body } = ctx.result;
  // if response is 200, return the response
  if (statusCode === 200) {
    return JSON.parse(body);
  }
  // if response is not 200, append the response to error block.
  util.appendError(body, statusCode);
}

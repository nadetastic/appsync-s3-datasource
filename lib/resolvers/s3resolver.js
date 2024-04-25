import { util } from "@aws-appsync/utils";

export function request(ctx) {
  return {
    method: "PUT",
    resourcePath: `/logs/${util.time.nowISO8601()}.txt`,
    params: {
      headers: {
        "Content-Type": "text/plain",
      },
      body: ctx.stash.logs,
    },
  };
}

export function response(ctx) {
  return ctx.prev.result;
}

import { util } from "@aws-appsync/utils";

/**
 * Called before the request function of the first AppSync function in the pipeline.
 *  @param ctx the context object holds contextual information about the function invocation.
 */
export function request(ctx) {
  //   ctx.stash.allowedGroups = ["admin"];
  //   ctx.stash.startedAt = util.time.nowISO8601();
  ctx.stash.logs = [];
  return {};
}
/**
 * Called after the response function of the last AppSync function in the pipeline.
 * @param ctx the context object holds contextual information about the function invocation.
 */
export function response(ctx) {
  //   const result = [];
  //   for (const item of ctx.prev.result) {
  //     if (ctx.stash.allowedGroups.indexOf(item.group) > -1) result.push(item);
  //   }
  //   return result;
  return ctx.result;
}

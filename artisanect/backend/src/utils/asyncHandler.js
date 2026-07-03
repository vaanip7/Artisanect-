/**
 * Wraps an async Express route handler so a rejected promise (a failed
 * Prisma query, for example) is forwarded to next(err) instead of
 * crashing the process or hanging the request.
 *
 * Express 4 does not catch async/await errors on its own — without this,
 * a thrown error inside an `async function (req, res)` route handler
 * never reaches `errorHandler.js` and the request just times out.
 *
 * @param {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => Promise<any>} fn
 * @returns {(req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void}
 */
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

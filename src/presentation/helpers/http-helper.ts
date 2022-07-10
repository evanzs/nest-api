import { ServerError } from "../controller/errors";
import { HttpResponse } from "../protocols/http";

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const InternalError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(),
});

import { badRequest } from "../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamError } from "./errors/missing-param-error";

export class AuthController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError("email"));
    }
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError("name"));
    }
  }
}

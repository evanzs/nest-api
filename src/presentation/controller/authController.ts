import { badRequest } from "../helpers/http-helper";
import { Controller } from "../protocols/controller";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { MissingParamError } from "./errors/missing-param-error";

export class AuthController implements Controller {
  handle(httpRequest: HttpRequest): HttpResponse {
    const fieldsRequired: Array<string> = [
      "name",
      "email",
      "password",
      "password confirmation",
    ];

    for (const field of fieldsRequired) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}

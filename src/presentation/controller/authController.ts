import { badRequest } from "../helpers/http-helper";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { InvalidParamsError } from "./errors/invalid-params-errors";
import { MissingParamError } from "./errors/missing-param-error";

export class AuthController implements Controller {
  private readonly _emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this._emailValidator = emailValidator;
  }
  handle(httpRequest: HttpRequest): HttpResponse {
    const fieldsRequired: Array<string> = [
      "name",
      "email",
      "password",
      "passwordConfirmation",
    ];

    for (const field of fieldsRequired) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    const isValidEmail = this._emailValidator.isValid(httpRequest.body.email);

    if (!isValidEmail) return badRequest(new InvalidParamsError("email"));
  }
}

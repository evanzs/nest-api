import { badRequest, InternalError } from "../helpers/http-helper";
import { Controller, EmailValidator } from "../protocols";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { InvalidParamsError, MissingParamError } from "./errors";

export class AuthController implements Controller {
  private readonly _emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this._emailValidator = emailValidator;
  }
  handle(httpRequest: HttpRequest): HttpResponse {
    try {
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
    } catch (error) {
      return InternalError();
    }
  }
}

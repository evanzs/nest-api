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

      const { email, password, passwordConfirmation } = httpRequest.body;
      for (const field of fieldsRequired) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValidEmail = this._emailValidator.isValid(email);

      if (!isValidEmail) return badRequest(new InvalidParamsError("email"));

      if (password !== passwordConfirmation) {
        return badRequest(
          new InvalidParamsError(
            "password confirmation must be equal password."
          )
        );
      }
    } catch (error) {
      return InternalError();
    }
  }
}

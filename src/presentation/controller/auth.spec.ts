import { EmailValidator } from "../protocols/email-validator";
import { AuthController } from "./authController";
import { InvalidParamsError } from "./errors/invalid-params-error";
import { MissingParamError } from "./errors/missing-param-error";
import { ServerError } from "./errors/server-error";

interface SutTypes {
  sut: AuthController;
  emailValidadorStub: EmailValidator;
}
const makeSut = (): SutTypes => {
  class EmailValidaorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidadorStub = new EmailValidaorStub();
  const sut = new AuthController(emailValidadorStub);
  return {
    sut,
    emailValidadorStub,
  };
};

describe("AuthController ", () => {
  test("Should return 400 if no name", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "evandro@gmail.com",
        password: "test123",
        passowrdConfirmation: "test123",
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  test("Should return 400 if no email", () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "evandro",
        password: "test123",
        passowrdConfirmation: "test123",
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Should return 400 if no password", () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "evandro",
        email: "evandro@gmail.com",
        passowrdConfirmation: "test123",
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Should return 400 if no password confirmation", () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: "evandro",
        email: "evandro@gmail.com",
        password: "evandro123",
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });

  test("Should return 400 if invalid email", () => {
    const { sut, emailValidadorStub } = makeSut();
    jest.spyOn(emailValidadorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: "evandro",
        email: "evandro@gmail.com",
        password: "evandro123",
        passwordConfirmation: "evandro123",
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamsError("email"));
  });

  test("Should call EmailValidador with correct email", () => {
    const { sut, emailValidadorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidadorStub, "isValid");
    const httpRequest = {
      body: {
        name: "evandro",
        email: "evandro@gmail.com",
        password: "evandro123",
        passwordConfirmation: "evandro123",
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith("evandro@gmail.com");
  });

  test("Should return 500 if EmailValidator throws", () => {
    class EmailValidaorStub implements EmailValidator {
      isValid(email: string): boolean {
        throw new Error();
      }
    }
    const emailValidadorStub = new EmailValidaorStub();
    const sut = new AuthController(emailValidadorStub);
    const httpRequest = {
      body: {
        name: "evandro",
        email: "evandro@gmail.com",
        password: "evandro123",
        passwordConfirmation: "evandro123",
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});

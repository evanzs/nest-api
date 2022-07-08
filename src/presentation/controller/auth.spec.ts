import { AuthController } from "./authController";
import { MissingParamError } from "./errors/missing-param-error";

describe("AuthController ", () => {
  test("Should return 400 if no name", () => {
    const sut = new AuthController();
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
    const sut = new AuthController();
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
});

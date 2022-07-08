import { AuthController } from "./authController";

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
  });
});

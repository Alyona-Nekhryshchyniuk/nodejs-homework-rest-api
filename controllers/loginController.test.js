const { loginController } = require("../controllers/userControllers");

const { userJOISchema } = require("../helpers/schema");

const bcrypt = require("bcrypt");
require("dotenv").config();

const jwt = require("jsonwebtoken");

const mReq = {
  body: {
    email: "mockUser@gmail.com",
    password: "445544mock",
  },
};
class Response {
  constructor() {
    // this.status = 200;
  }
  json(resBody) {
    return JSON.stringify(resBody);
  }
}

const res = new Response();
const mNext = jest.fn();
let mockToken;

describe("Desc name", () => {
  const loginUser = jest.fn(async (email) => {
    return await new Promise((resolve) =>
      resolve({ email, _id: "j555551", password: "445544mock" })
    );
  });

  const { email } = mReq.body;
  const user = loginUser(email);
  const { SECRET } = process.env;
  mockToken = jwt.sign({ _id: user._id }, SECRET);
  mReq.user = { ...user, mockToken };
  jest.spyOn(userJOISchema, "validate");
  jest.spyOn(bcrypt, "compare");

  test("Login controller returns obj with user and token properties", () => {
    const obj = {
      token: mockToken,
      user: {
        email: user.email,
        subscription: "starter",
      },
    };
    const stringf = JSON.stringify(obj);
    expect(loginController(mReq, res, mNext)).toEqual(stringf);
  });

  test("loginUser fn from services was called", () => {
    loginController(mReq, res, mNext);
    expect(loginUser).toHaveBeenCalledWith(mReq.body.email);
  });
});

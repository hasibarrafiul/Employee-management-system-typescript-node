import request from "supertest";
import express, { Express } from "express";
import { getUsers } from "../controllers/UserController";
import { UserRepositoryMySQL } from "../repositories/userRepositoryMySQL";
import { User } from "../entities/User";
import { UserDetails } from "../entities/UserDetails";

jest.mock("../repositories/userRepositoryMySQL"); // Mock UserRepository

const app: Express = express();
app.use(express.json());

const userRepository = new UserRepositoryMySQL() as jest.Mocked<UserRepositoryMySQL>;

app.get("/users", getUsers);

describe("GET /users", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock data before each test
  });

  it("should return 500 if there is an error", async () => {
    userRepository.getAllUsers.mockRejectedValue(new Error("DB error"));

    const response = await request(app).get("/users");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Error fetching users" });
  });
});

import { User } from "../entities/User";

export interface UserRepositoryPort {
  getAllUsers(): Promise<User[]>;
  findUserById(id: string): Promise<User | null>;
  findUserByCredentials(id: string, password: string): Promise<User | null>;
  deleteUser(user: User): Promise<void>;
  createUser(user: User): Promise<void>;
}

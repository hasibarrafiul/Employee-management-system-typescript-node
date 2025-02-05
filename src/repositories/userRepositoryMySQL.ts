import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { UserDetails } from "../entities/UserDetails";
import { UserRepositoryPort } from "./userRepositoryPort";

export class UserRepositoryMySQL implements UserRepositoryPort {
  private userRepository = AppDataSource.getRepository(User);
  private userDetailsRepository = AppDataSource.getRepository(UserDetails);

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({ relations: ["userDetails"] });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id }, relations: ["userDetails"] });
  }

  async findUserByCredentials(id: string, password: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id, password } });
  }

  async deleteUser(user: User): Promise<void> {
    await this.userRepository.remove(user);
  }

  async createUser(user: Partial<User>): Promise<void> {
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);
  }

  async updateUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }

  async updateUserDetails(userDetails: UserDetails): Promise<void> {
    const existingDetails = await this.userDetailsRepository.findOne({ where: { id: userDetails.id } });

    if (existingDetails) {
      existingDetails.birth = userDetails.birth;
      existingDetails.club = userDetails.club;
      await this.userDetailsRepository.save(existingDetails);
    } else {
      await this.userDetailsRepository.save(userDetails);
    }
  }
}

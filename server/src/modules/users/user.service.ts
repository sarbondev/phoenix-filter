import bcrypt from "bcryptjs";
import { UserRepository } from "./user.repository";
import { UserResponse, toUserResponse } from "./user.entity";
import { AdminCreateUserDto, UpdateUserDto } from "./user.schema";
import {
  NotFoundError,
  ConflictError,
} from "../../shared/middleware/error-handler.middleware";
import { emitToStaff } from "../../shared/services/socket.service";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(dto: AdminCreateUserDto): Promise<UserResponse> {
    const exists = await this.userRepository.findByPhoneNumber(dto.phoneNumber);
    if (exists)
      throw new ConflictError("User with this phone number already exists");
    const password = await bcrypt.hash(dto.password, 12);
    const user = await this.userRepository.create({ ...dto, password });
    const response = toUserResponse(user);
    emitToStaff('user:created', response);
    return response;
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll();
    return users.map(toUserResponse);
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError("User");
    return toUserResponse(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponse> {
    const updated = await this.userRepository.update(id, dto);
    if (!updated) throw new NotFoundError("User");
    const response = toUserResponse(updated);
    emitToStaff('user:updated', response);
    return response;
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError("User");
    await this.userRepository.delete(id);
    emitToStaff('user:deleted', { id });
  }
}

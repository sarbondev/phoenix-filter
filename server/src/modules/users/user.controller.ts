import { Request, Response } from "express";
import { UserService } from "./user.service";
import { AdminCreateUserDto, UpdateUserDto } from "./user.schema";
import { ResponseHelper } from "../../shared/utils/api-response";

export class UserController {
  constructor(private readonly userService: UserService) {}

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.userService.findAll();
    ResponseHelper.success(res, users, "Users retrieved");
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.findOne(req.params["id"]! as string);
    ResponseHelper.success(res, user);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.create(req.body as AdminCreateUserDto);
    ResponseHelper.created(res, user, "User created");
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.update(
      req.params["id"]! as string,
      req.body as UpdateUserDto,
    );
    ResponseHelper.success(res, user, "User updated");
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.userService.remove(req.params["id"]! as string);
    ResponseHelper.noContent(res);
  };
}

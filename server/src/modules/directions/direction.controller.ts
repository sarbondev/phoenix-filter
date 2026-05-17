import { Request, Response } from "express";
import { DirectionService } from "./direction.service";
import { CreateDirectionDto, UpdateDirectionDto } from "./direction.schema";
import { ResponseHelper } from "../../shared/utils/api-response";

export class DirectionController {
  constructor(private readonly directionService: DirectionService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    const activeOnly = req.query["active"] === "true";
    const items = await this.directionService.findAll(activeOnly);
    ResponseHelper.success(res, items, "Directions retrieved");
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const direction = await this.directionService.findOne(req.params["id"]! as string);
    ResponseHelper.success(res, direction);
  };

  getBySlug = async (req: Request, res: Response): Promise<void> => {
    const direction = await this.directionService.findBySlug(req.params["slug"]! as string);
    ResponseHelper.success(res, direction);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const direction = await this.directionService.create(req.body as CreateDirectionDto);
    ResponseHelper.created(res, direction, "Direction created");
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const direction = await this.directionService.update(
      req.params["id"]! as string,
      req.body as UpdateDirectionDto,
    );
    ResponseHelper.success(res, direction, "Direction updated");
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.directionService.remove(req.params["id"]! as string);
    ResponseHelper.noContent(res);
  };
}

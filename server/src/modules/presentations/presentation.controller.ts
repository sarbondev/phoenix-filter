import { Request, Response } from "express";
import { PresentationService } from "./presentation.service";
import { CreatePresentationDto, UpdatePresentationDto } from "./presentation.schema";
import { ResponseHelper } from "../../shared/utils/api-response";

export class PresentationController {
  constructor(private readonly service: PresentationService) {}

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.service.findAll();
    ResponseHelper.success(res, items, "Presentations retrieved");
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const item = await this.service.findOne(req.params["id"]! as string);
    ResponseHelper.success(res, item);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const item = await this.service.create(req.body as CreatePresentationDto);
    ResponseHelper.created(res, item, "Presentation created");
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const item = await this.service.update(
      req.params["id"]! as string,
      req.body as UpdatePresentationDto,
    );
    ResponseHelper.success(res, item, "Presentation updated");
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.service.remove(req.params["id"]! as string);
    ResponseHelper.noContent(res);
  };
}

import { Request, Response } from "express";
import { HomeContentService } from "./home-content.service";
import { UpdateHomeContentDto } from "./home-content.schema";
import { ResponseHelper } from "../../shared/utils/api-response";

export class HomeContentController {
  constructor(private readonly svc: HomeContentService) {}

  get = async (_req: Request, res: Response): Promise<void> => {
    const data = await this.svc.get();
    ResponseHelper.success(res, data, "Home content retrieved");
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const data = await this.svc.update(req.body as UpdateHomeContentDto);
    ResponseHelper.success(res, data, "Home content updated");
  };
}

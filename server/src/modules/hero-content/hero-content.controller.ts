import { Request, Response } from "express";
import { HeroContentService } from "./hero-content.service";
import { UpdateHeroContentDto } from "./hero-content.schema";
import { ResponseHelper } from "../../shared/utils/api-response";

export class HeroContentController {
  constructor(private readonly svc: HeroContentService) {}

  get = async (_req: Request, res: Response): Promise<void> => {
    const data = await this.svc.get();
    ResponseHelper.success(res, data, "Hero content retrieved");
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const data = await this.svc.update(req.body as UpdateHeroContentDto);
    ResponseHelper.success(res, data, "Hero content updated");
  };
}

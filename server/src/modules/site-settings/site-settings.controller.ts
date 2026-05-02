import { Request, Response } from "express";
import { SiteSettingsService } from "./site-settings.service";
import { UpdateSiteSettingsDto } from "./site-settings.schema";
import { ResponseHelper } from "../../shared/utils/api-response";

export class SiteSettingsController {
  constructor(private readonly svc: SiteSettingsService) {}

  get = async (_req: Request, res: Response): Promise<void> => {
    const data = await this.svc.get();
    ResponseHelper.success(res, data, "Site settings retrieved");
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const data = await this.svc.update(req.body as UpdateSiteSettingsDto);
    ResponseHelper.success(res, data, "Site settings updated");
  };
}

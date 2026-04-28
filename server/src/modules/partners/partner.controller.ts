import { Request, Response } from "express";
import { PartnerService } from "./partner.service";
import { CreatePartnerDto, UpdatePartnerDto } from "./partner.schema";
import { ResponseHelper } from "../../shared/utils/api-response";

export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  getActive = async (_req: Request, res: Response): Promise<void> => {
    const partners = await this.partnerService.findActive();
    ResponseHelper.success(res, partners, "Active partners retrieved");
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const partners = await this.partnerService.findAll();
    ResponseHelper.success(res, partners, "Partners retrieved");
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const partner = await this.partnerService.findOne(
      req.params["id"]! as string,
    );
    ResponseHelper.success(res, partner);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const partner = await this.partnerService.create(
      req.body as CreatePartnerDto,
    );
    ResponseHelper.created(res, partner, "Partner created");
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const partner = await this.partnerService.update(
      req.params["id"]! as string,
      req.body as UpdatePartnerDto,
    );
    ResponseHelper.success(res, partner, "Partner updated");
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.partnerService.remove(req.params["id"]! as string);
    ResponseHelper.noContent(res);
  };
}

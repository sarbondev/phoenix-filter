import { Request, Response } from "express";
import { FaqService } from "./faq.service";
import { CreateFaqDto, UpdateFaqDto } from "./faq.schema";
import { ResponseHelper } from "../../shared/utils/api-response";

export class FaqController {
  constructor(private readonly svc: FaqService) {}

  getActive = async (_req: Request, res: Response): Promise<void> => {
    const data = await this.svc.findActive();
    ResponseHelper.success(res, data, "Active FAQs retrieved");
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const data = await this.svc.findAll();
    ResponseHelper.success(res, data, "FAQs retrieved");
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const data = await this.svc.findOne(req.params["id"]! as string);
    ResponseHelper.success(res, data);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const data = await this.svc.create(req.body as CreateFaqDto);
    ResponseHelper.created(res, data, "FAQ created");
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const data = await this.svc.update(
      req.params["id"]! as string,
      req.body as UpdateFaqDto,
    );
    ResponseHelper.success(res, data, "FAQ updated");
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.svc.remove(req.params["id"]! as string);
    ResponseHelper.noContent(res);
  };
}

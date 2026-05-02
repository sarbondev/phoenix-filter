import { Request, Response } from "express";
import { CertificateService } from "./certificate.service";
import {
  CreateCertificateDto,
  UpdateCertificateDto,
} from "./certificate.schema";
import { ResponseHelper } from "../../shared/utils/api-response";

export class CertificateController {
  constructor(private readonly svc: CertificateService) {}

  getActive = async (_req: Request, res: Response): Promise<void> => {
    const data = await this.svc.findActive();
    ResponseHelper.success(res, data, "Active certificates");
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const data = await this.svc.findAll();
    ResponseHelper.success(res, data, "Certificates");
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const data = await this.svc.findOne(req.params["id"]! as string);
    ResponseHelper.success(res, data);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const data = await this.svc.create(req.body as CreateCertificateDto);
    ResponseHelper.created(res, data, "Certificate created");
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const data = await this.svc.update(
      req.params["id"]! as string,
      req.body as UpdateCertificateDto,
    );
    ResponseHelper.success(res, data, "Certificate updated");
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.svc.remove(req.params["id"]! as string);
    ResponseHelper.noContent(res);
  };
}

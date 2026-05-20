import { Request, Response } from "express";
import { EquipmentTypeService } from "./equipment-type.service";
import {
  CreateEquipmentTypeDto,
  UpdateEquipmentTypeDto,
} from "./equipment-type.schema";
import { ResponseHelper } from "../../shared/utils/api-response";

export class EquipmentTypeController {
  constructor(private readonly service: EquipmentTypeService) {}

  getActive = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.service.findActive();
    ResponseHelper.success(res, items, "Active equipment types retrieved");
  };

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.service.findAll();
    ResponseHelper.success(res, items, "Equipment types retrieved");
  };

  getBySlug = async (req: Request, res: Response): Promise<void> => {
    const item = await this.service.findBySlug(req.params["slug"]! as string);
    ResponseHelper.success(res, item);
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const item = await this.service.findOne(req.params["id"]! as string);
    ResponseHelper.success(res, item);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const item = await this.service.create(req.body as CreateEquipmentTypeDto);
    ResponseHelper.created(res, item, "Equipment type created");
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const item = await this.service.update(
      req.params["id"]! as string,
      req.body as UpdateEquipmentTypeDto,
    );
    ResponseHelper.success(res, item, "Equipment type updated");
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.service.remove(req.params["id"]! as string);
    ResponseHelper.noContent(res);
  };
}

import { Request, Response } from 'express';
import { ProductRequestService } from './product-request.service';
import {
  CreateProductRequestDto,
  UpdateProductRequestStatusDto,
} from './product-request.schema';
import { ProductRequestStatus } from './product-request.entity';
import { ResponseHelper } from '../../shared/utils/api-response';

export class ProductRequestController {
  constructor(private readonly service: ProductRequestService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateProductRequestDto;
    const result = await this.service.create(dto);
    ResponseHelper.created(res, result, 'Product request submitted');
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    const status = req.query['status'] as ProductRequestStatus | undefined;
    const result = await this.service.findAll(status);
    ResponseHelper.success(res, result, 'Product requests retrieved');
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.findOne(req.params['id']! as string);
    ResponseHelper.success(res, result, 'Product request retrieved');
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    const { status } = req.body as UpdateProductRequestStatusDto;
    const result = await this.service.updateStatus(
      req.params['id']! as string,
      status,
    );
    ResponseHelper.success(res, result, 'Status updated');
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.service.remove(req.params['id']! as string);
    ResponseHelper.noContent(res);
  };
}

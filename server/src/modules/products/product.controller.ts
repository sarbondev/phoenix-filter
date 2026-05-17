import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './product.schema';
import { ResponseHelper } from '../../shared/utils/api-response';
import { parsePagination } from '../../shared/utils/pagination';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = parsePagination(req);
    const query = req.query as unknown as ProductQueryDto;
    const result = await this.productService.findAll(query, page, limit);
    ResponseHelper.paginated(res, result, 'Products retrieved');
  };

  getAllAdmin = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = parsePagination(req);
    const query = req.query as unknown as ProductQueryDto;
    const result = await this.productService.findAllAdmin(query, page, limit);
    ResponseHelper.paginated(res, result, 'Products retrieved');
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const product = await this.productService.findOne(req.params['id']! as string);
    ResponseHelper.success(res, product);
  };

  getBySlug = async (req: Request, res: Response): Promise<void> => {
    const product = await this.productService.findBySlug(req.params['slug']! as string);
    ResponseHelper.success(res, product);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const product = await this.productService.create(req.body as CreateProductDto);
    ResponseHelper.created(res, product, 'Product created');
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const product = await this.productService.update(req.params['id']! as string, req.body as UpdateProductDto);
    ResponseHelper.success(res, product, 'Product updated');
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.productService.remove(req.params['id']! as string);
    ResponseHelper.noContent(res);
  };

  listManufacturers = async (_req: Request, res: Response): Promise<void> => {
    const data = await this.productService.listManufacturers();
    ResponseHelper.success(res, data);
  };
}

import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.schema';
import { ResponseHelper } from '../../shared/utils/api-response';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    const activeOnly = req.query['active'] === 'true';
    const direction = typeof req.query['direction'] === 'string' ? req.query['direction'] : undefined;
    const categories = await this.categoryService.findAll(activeOnly, direction);
    ResponseHelper.success(res, categories, 'Categories retrieved');
  };

  getOne = async (req: Request, res: Response): Promise<void> => {
    const category = await this.categoryService.findOne(req.params['id']! as string);
    ResponseHelper.success(res, category);
  };

  getBySlug = async (req: Request, res: Response): Promise<void> => {
    const category = await this.categoryService.findBySlug(req.params['slug']! as string);
    ResponseHelper.success(res, category);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const category = await this.categoryService.create(req.body as CreateCategoryDto);
    ResponseHelper.created(res, category, 'Category created');
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const category = await this.categoryService.update(req.params['id']! as string, req.body as UpdateCategoryDto);
    ResponseHelper.success(res, category, 'Category updated');
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.categoryService.remove(req.params['id']! as string);
    ResponseHelper.noContent(res);
  };
}

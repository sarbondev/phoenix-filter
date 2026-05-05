import { Request, Response } from "express";
import { OrderService } from "./order.service";
import { CreateOrderDto, UpdateOrderStatusDto } from "./order.schema";
import { ResponseHelper } from "../../shared/utils/api-response";
import { AuthRequest } from "../../shared/types/common.types";
import { parsePagination } from "../../shared/utils/pagination";

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    const order = await this.orderService.create(
      req.user!.sub,
      req.body as CreateOrderDto,
    );
    ResponseHelper.created(res, order, "Order placed successfully");
  };

  getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    const { page, limit } = parsePagination(req as Request);
    const result = await this.orderService.findMyOrders(
      req.user!.sub,
      page,
      limit,
    );
    ResponseHelper.paginated(res, result, "Orders retrieved");
  };

  getOne = async (req: AuthRequest, res: Response): Promise<void> => {
    const order = await this.orderService.findOne(
      req.params["id"]! as string,
      req.user!.sub,
    );
    ResponseHelper.success(res, order);
  };

  getByNumber = async (req: AuthRequest, res: Response): Promise<void> => {
    const order = await this.orderService.findByOrderNumber(
      req.params["orderNumber"]! as string,
      req.user!.sub,
    );
    ResponseHelper.success(res, order);
  };

  // Admin
  getAll = async (req: Request, res: Response): Promise<void> => {
    const { page, limit } = parsePagination(req);
    const status = req.query["status"] as string | undefined;
    const search = req.query["search"] as string | undefined;
    const result = await this.orderService.findAll(page, limit, status, search);
    ResponseHelper.paginated(res, result, "Orders retrieved");
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    const order = await this.orderService.updateStatus(
      req.params["id"]! as string,
      req.body as UpdateOrderStatusDto,
    );
    ResponseHelper.success(res, order, "Order status updated");
  };

  getStats = async (_req: Request, res: Response): Promise<void> => {
    const stats = await this.orderService.getStats();
    ResponseHelper.success(res, stats, "Order statistics");
  };
}

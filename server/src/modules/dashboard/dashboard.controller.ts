import { Request, Response } from "express";
import { ResponseHelper } from "../../shared/utils/api-response";
import { OrderModel } from "../orders/order.schema";
import { ProductModel } from "../products/product.schema";
import { UserModel } from "../users/user.schema";
import { CategoryModel } from "../categories/category.schema";
import { ReviewModel } from "../reviews/review.schema";

export class DashboardController {
  getStats = async (_req: Request, res: Response): Promise<void> => {
    const [
      totalOrders,
      pendingOrders,
      totalProducts,
      activeProducts,
      totalUsers,
      totalCategories,
      totalReviews,
      revenueResult,
    ] = await Promise.all([
      OrderModel.countDocuments(),
      OrderModel.countDocuments({ status: "PENDING" }),
      ProductModel.countDocuments(),
      ProductModel.countDocuments({ isActive: true }),
      UserModel.countDocuments(),
      CategoryModel.countDocuments(),
      ReviewModel.countDocuments(),
      OrderModel.aggregate([
        { $match: { status: "DELIVERED" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);

    const revenue = revenueResult[0]?.total ?? 0;

    ResponseHelper.success(
      res,
      {
        orders: { total: totalOrders, pending: pendingOrders },
        products: { total: totalProducts, active: activeProducts },
        users: { total: totalUsers },
        categories: { total: totalCategories },
        reviews: { total: totalReviews },
        revenue,
      },
      "Dashboard stats",
    );
  };
}

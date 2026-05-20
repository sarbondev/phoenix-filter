import { Request, Response } from "express";
import { FilterSearchService } from "./filter-search.service";
import {
  OemSearchDto,
  AnalogSearchDto,
  SizeSearchDto,
  MachineSearchDto,
  PhotoSearchDto,
} from "./filter-search.schema";
import { ResponseHelper } from "../../shared/utils/api-response";

export class FilterSearchController {
  constructor(private readonly service: FilterSearchService) {}

  byOem = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.byOem(req.body as OemSearchDto);
    ResponseHelper.paginated(res, result, "OEM search results");
  };

  byAnalog = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.byAnalog(req.body as AnalogSearchDto);
    ResponseHelper.paginated(res, result, "Analog search results");
  };

  bySize = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.bySize(req.body as SizeSearchDto);
    ResponseHelper.paginated(res, result, "Size search results");
  };

  byMachine = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.byMachine(req.body as MachineSearchDto);
    ResponseHelper.paginated(res, result, "Machine search results");
  };

  byPhoto = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.byPhoto(req.body as PhotoSearchDto);
    ResponseHelper.created(res, result, "Photo search request created");
  };
}

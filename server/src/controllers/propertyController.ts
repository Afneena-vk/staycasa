import { injectable, inject } from "tsyringe";
import { IPropertyController } from "./interfaces/IPropertyController";
import { Request, Response, NextFunction } from "express";
import { IPropertyService } from "../services/interfaces/IPropertyService";
import { TOKENS } from "../config/tokens";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import logger from "../utils/logger";

@injectable()
export class PropertyController implements IPropertyController {
  constructor(
    @inject(TOKENS.IPropertyService) private _propertyService: IPropertyService
  ) {}

  async createProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = (req as any).userId;
      const propertyData = {
        ...req.body,
        features: req.body.amenities || req.body.features || [],
        images: req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : []
      };

      const result = await this._propertyService.createProperty(ownerId, propertyData);
      
      res.status(result.status).json(result);
    } catch (error: any) {
      console.error("Property creation error:", error);
      logger.error('Property creation error: ' + error.message);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }

  async getOwnerProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = (req as any).userId;
      const properties = await this._propertyService.getOwnerProperties(ownerId);
      
      res.status(STATUS_CODES.OK).json({
        message: "Properties retrieved successfully",
        properties
      });
    } catch (error: any) {
      console.error("Get properties error:", error);
      logger.error('Get properties error: ' + error.message);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }
}
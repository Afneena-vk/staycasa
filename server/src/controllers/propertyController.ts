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
      const { page, limit, search, sortBy, sortOrder } = req.query;
      //const properties = await this._propertyService.getOwnerProperties(ownerId);
       const result = await this._propertyService.getOwnerProperties({
      ownerId,
      page: Number(page),
      limit: Number(limit),
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as string
    });
      // res.status(STATUS_CODES.OK).json({
      //   message: "Properties retrieved successfully",
      //   properties
      // });
       res.status(result.status).json(result);
    } catch (error: any) {
      console.error("Get properties error:", error);
      logger.error('Get properties error: ' + error.message);
      res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
    }
  }

  async getOwnerPropertyById(req: Request, res:Response, next:NextFunction): Promise<void> {
    try {
       const ownerId = (req as any).userId;
       const { propertyId } = req.params;

       const property = await this._propertyService.getOwnerPropertyById(ownerId, propertyId);
       console.log("Property Response:", property);

        res.status(STATUS_CODES.OK).json({
        message: "Property retrieved successfully",
        property,
    });
    } catch (error: any) {
      console.error("Get property error:", error);
    logger.error("Get property error: " + error.message);
    res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error.message || MESSAGES.ERROR.SERVER_ERROR,
    });
    }

  }    

async updateOwnerProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const ownerId = (req as any).userId;
    const { propertyId } = req.params;

    const propertyData = {
      ...req.body,
      features: req.body.amenities || req.body.features || [],
      //images: req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : []
      images: [
    // ...(req.body.existingImages ? 
    //     (Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages]) 
    //     : []),
    ...(req.body.existingImages ? 
      JSON.parse(req.body.existingImages) : []),
    ...(req.files ? (req.files as Express.Multer.File[]).map(file => file.path) : [])
      ]
    };

    const result = await this._propertyService.updateOwnerProperty(ownerId, propertyId, propertyData);
    res.status(result.status).json(result);

  } catch (error: any) {
    console.error("Update property error:", error);
    res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error.message || MESSAGES.ERROR.SERVER_ERROR,
    });
  }
}

async deleteOwnerProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const ownerId = (req as any).userId;
    const { propertyId } = req.params;

    const result = await this._propertyService.deleteOwnerProperty(ownerId, propertyId);

    res.status(result.status).json({ message: result.message });
  } catch (error: any) {
    console.error("Delete property error:", error);
    res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error.message || MESSAGES.ERROR.SERVER_ERROR,
    });
  }
}

// async getAllProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
//   try {
//     const result = await this._propertyService.getAllProperties();
//     console.log("properties fetched successfully:", result)
//     res.status(result.status).json(result);
//   } catch (error:any) {
//       res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
//       error: error.message || MESSAGES.ERROR.SERVER_ERROR,
//     });
//   }
// }

async getAllProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {

    const { page, limit, search, sortBy, sortOrder } = req.query;

    const result = await this._propertyService.getAllProperties({
      page: Number(page),
      limit: Number(limit),
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as string
    });

    console.log("properties fetched successfully:", result)

    res.status(result.status).json(result);

  } catch (error: any) {
    res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error.message || MESSAGES.ERROR.SERVER_ERROR,
    });
  }
}


async getAdminPropertyById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {

    const {propertyId} = req.params;
    const property = await this._propertyService.getAdminPropertyById(propertyId);
     console.log("property in the admin side fetched successfully:", property)
      res.status(STATUS_CODES.OK).json({
      message: "Property fetched successfully",
      property,
    });
  } catch (error:any) {
     res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error.message || MESSAGES.ERROR.SERVER_ERROR,
    });
  }
}

async approveProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {propertyId} = req.params;

  const result = await this._propertyService.approveProperty(propertyId);
  console.log("property activated successfully", result);
    res.status(result.status).json(result);

  } catch (error:any) {
    console.error("Approve property error:", error);
    res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error.message || MESSAGES.ERROR.SERVER_ERROR,
    });
  }
}

async rejectProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { propertyId } = req.params;

    const result = await this._propertyService.rejectProperty(propertyId);
    console.log("Property rejected successfully:", result);

    res.status(result.status).json(result);
  } catch (error: any) {
     console.error("Reject property error:", error);
    res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error.message || MESSAGES.ERROR.SERVER_ERROR,
    });
  }
}
 
async blockPropertyByAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {propertyId} = req.params;
    const result = await this._propertyService.blockPropertyByAdmin(propertyId);
    res.status(result.status).json(result);

  } catch (error: any) {
    console.error("Block property error:", error);
    res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error.message || MESSAGES.ERROR.SERVER_ERROR,
    });
  }
}

async unblockPropertyByAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
     const {propertyId} = req.params;
    const result = await this._propertyService.unblockPropertyByAdmin(propertyId);
    res.status(result.status).json(result);
  } catch (error: any) {
     console.error("unBlock property error:", error);
    res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error.message || MESSAGES.ERROR.SERVER_ERROR,
    });
  }
}

async getActiveProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { 
      const params = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as string,
      category: req.query.category as string,
      facilities: req.query.facilities ? (req.query.facilities as string).split(",") : undefined,
    };

      const response = await this._propertyService.getActiveProperties(params);
      res.status(response.status).json(response);

  } catch (error:any) {
    res.status(error.status || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error.message || MESSAGES.ERROR.SERVER_ERROR,
      });
  }
}

}
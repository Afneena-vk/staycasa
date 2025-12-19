import { injectable } from "tsyringe";
import Property, { IProperty } from "../models/propertyModel";
import { BaseRepository } from "./baseRepository";
import {
  IPropertyRepository,
  IPropertyListResult,
} from "./interfaces/IPropertyRepository";

@injectable()
export class PropertyRepository
  extends BaseRepository<IProperty>
  implements IPropertyRepository
{
  constructor() {
    super(Property);
  }

  async findByOwnerId(ownerId: string): Promise<IProperty[]> {
    return Property.find({ ownerId }).sort({ createdAt: -1 }).exec();
  }

  async findByStatus(status: string): Promise<IProperty[]> {
    return Property.find({ status }).exec();
  }

  async updateStatus(
    propertyId: string,
    status: string
  ): Promise<IProperty | null> {
    return await this.model
      .findByIdAndUpdate(propertyId, { status }, { new: true })
      .populate("ownerId", "name email phone businessName businessAddress")
      .exec();
  }

  async findByPropertyId(propertyId: string): Promise<IProperty | null> {
    return Property.findById(propertyId).exec();
  }
  async findByPropertyIdForAdmin(
    propertyId: string
  ): Promise<IProperty | null> {
    return Property.findById(propertyId)
      .populate("ownerId", "name email phone businessName businessAddress")
      .exec();
  }

  async updateProperty(
    propertyId: string,
    data: Partial<IProperty>
  ): Promise<IProperty | null> {
    return await this.model
      .findByIdAndUpdate(propertyId, data, { new: true })
      .exec();
  }

  async deleteByOwner(
    ownerId: string,
    propertyId: string
  ): Promise<IProperty | null> {
    return await this.model
      .findOneAndDelete({
        _id: propertyId,
        ownerId: ownerId,
      })
      .exec();
  }

  // async getAllProperties(): Promise<IProperty[]>{
  //     console.log(" Fetching properties from database...");
  //   return await this.model.find().sort({createdAt:-1}).exec();
  // }
  async getAllProperties(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    sortOrder: string
  ): Promise<IPropertyListResult> {
    // ): Promise<{
    //   properties: IProperty[];
    //   totalCount: number;
    //   totalPages: number;
    // }> {

    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
      ];
    }

    const sortQuery: any = {};
    sortQuery[sortBy] = sortOrder === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const [properties, totalCount] = await Promise.all([
      Property.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .populate("ownerId", "name email phone businessName businessAddress")
        .exec(),

      this.model.countDocuments(query),
    ]);

    return {
      properties,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async getOwnerProperties(
    ownerId: string,
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    sortOrder: string
  ): Promise<IPropertyListResult> {
    const query: any = { ownerId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }

    const sortQuery: any = {};
    sortQuery[sortBy] = sortOrder === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const [properties, totalCount] = await Promise.all([
      Property.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .populate("ownerId", "name email phone businessName businessAddress")
        .exec(),
      Property.countDocuments(query),
    ]);

    return {
      properties,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async getActiveProperties(
    page: number,
    limit: number,
    search?: string,
    sortBy?: string,
    sortOrder?: string,
    category?: string,
    facilities?: string[]
  ): Promise<IPropertyListResult> {
    const matchStage: any = {
      status: "active",
      isRejected: false,
    };

    if (search) {
      matchStage.$or = [
        { title: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }

    if (category) matchStage.type = category;
    if (facilities?.length) matchStage.features = { $all: facilities };

    const sortStage: any = {};
    if (sortBy) {
      sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;
    } else {
      sortStage.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: matchStage },

      {
        $lookup: {
          from: "owners",
          localField: "ownerId",
          foreignField: "_id",
          as: "owner",
        },
      },

      { $unwind: "$owner" },

      { $match: { "owner.isBlocked": false } },

      { $sort: sortStage },

      {
        $facet: {
          properties: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await Property.aggregate(pipeline);

    const properties = result[0]?.properties || [];
    const totalCount = result[0]?.totalCount[0]?.count || 0;

    return {
      properties,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  }



}

import { InjectModel } from "@nestjs/mongoose";
import { SUBANME_DOMAIN, SubnameDocument } from "./resolved-ens.schema";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ResolvedEnsRepository {
    @InjectModel(SUBANME_DOMAIN)
    dao: Model<SubnameDocument>

    public async findOne(query: Record<string,any>): Promise<SubnameDocument | null> {
        return this.dao.findOne(query);
    }
}
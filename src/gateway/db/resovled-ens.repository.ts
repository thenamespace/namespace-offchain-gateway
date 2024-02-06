import { InjectModel } from "@nestjs/mongoose";
import { SUBANME_DOMAIN, SubnameDocument } from "./resolved-ens.schema";
import { Model } from "mongoose";

export class ResolvedEnsRepository {
    @InjectModel(SUBANME_DOMAIN)
    dao: Model<SubnameDocument>

    public async findOne(query: Record<string,any>): Promise<SubnameDocument | null> {
        return this.dao.findOne(query);
    }
}
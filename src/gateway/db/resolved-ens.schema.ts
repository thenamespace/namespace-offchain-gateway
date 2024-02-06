import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true, collection: "subnames" })
class Subname {
  @Prop({ unique: true, required: true, type: String })
  fullName: string;

  @Prop({ required: true, type: String })
  label: string;

  @Prop({ required: true, type: String })
  domain: string;

  @Prop({ required: false, type: String })
  ttl: number;

  @Prop({
    required: true,
    type: Map,
    default: [],
    _id: false,
  })
  addresses: Map<string, string>;

  @Prop({
    required: false,
    type: Map,
    default: [],
    _id: false,
  })
  textRecords: Map<string, string>;

  @Prop({ required: false, type: String })
  contentHash: string;
}

export const SUBANME_DOMAIN = 'Subname';
export const SubnameSchema = SchemaFactory.createForClass(Subname);
export type SubnameDocument = mongoose.HydratedDocument<Subname>;
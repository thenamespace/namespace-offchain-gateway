import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true, collection: "subnames", autoCreate: false,  })
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
    type: Object,
    default: {},
    _id: false,
  })
  addresses: Record<string, string>;

  @Prop({
    required: false,
    type: Object,
    default: {},
    _id: false,
  })
  textRecords: Record<string, string>;

  @Prop({ required: false, type: String })
  contentHash: string;
}

export const SUBANME_DOMAIN = 'Subname';
export const SubnameSchema = SchemaFactory.createForClass(Subname);
export type SubnameDocument = mongoose.HydratedDocument<Subname>;
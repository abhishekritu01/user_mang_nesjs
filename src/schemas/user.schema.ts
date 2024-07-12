import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  birthdate: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  blockedUsers: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);

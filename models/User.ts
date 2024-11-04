import mongoose, { Schema, Document, Model } from 'mongoose';
interface IEntry {
     amount: number;
     income?: boolean;
     expense?: boolean;
     book: string;
     tag?: string;
     note?: string;
}
const entriesSchema: Schema = new Schema(
     {
          amount: { type: Number, required: true },
          income: { type: Boolean, required: false },
          expense: { type: Boolean, required: false },
          book: { type: String, required: true },
          tag: { type: String, required: false },
          note: { type: String, required: false },
     },
     { timestamps: true }
);
interface IBook {
     name: string;
     description?: string;
     entries: IEntry[];
}
const booksSchema: Schema = new Schema(
     {
          name: { type: String, required: true },
          description: { type: String, required: false },
          entries: { type: [entriesSchema], default: [] },
     },
     { timestamps: true }
);
interface IUser extends Document {
     email: string;
     password: string;
     oauthId?: string;
     authProvider: 'local' | 'google';
     profile: string;
     verificationHash?: string;
     books: IBook[];
}

const userSchema: Schema<IUser> = new mongoose.Schema(
     {
          profile: { type: String, required: false },
          email: { type: String, required: true, unique: true },
          password: {
               type: String,
               required: function () {
                    return this.authProvider === 'local';
               },
          },
          oauthId: { type: String, unique: true, sparse: true },
          authProvider: {
               type: String,
               enum: ['local', 'google'],
               default: 'local',
          },
          verificationHash: {
               type: String,
               required: function () {
                    return this.authProvider === 'local';
               },
          },
          books: { type: [booksSchema], default: [] },
     },
     { timestamps: true }
);

const User: Model<IUser> =
     mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;
export type { IUser };

import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
	name: string;
	description: string;
	price: number;
	stock: number;
	createdAt: Date;
}

const ProductSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String },
	price: { type: Number, required: true },
	stock: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IProduct>("Product", ProductSchema)
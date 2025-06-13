import Product, { IProduct } from "../models/product.model";

export const createProduct = async (data: Partial<IProduct>) => {
	const product = new Product(data);
	return await product.save();
};

export const getProducts = async () => {
	const products = await Product.find({});
	return products;
};

export const updateProduct = async (
	id: string,
	data: Partial<IProduct>
) => {
	return await Product.findByIdAndUpdate(id, data);
}

export const deleteProduct = async (id: string) => {
	return await Product.findByIdAndDelete(id);
}
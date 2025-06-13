import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import {
	createProduct,
	deleteProduct,
	getProducts,
	updateProduct,
} from './controllers/product.controller';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

app.use(express.json());
mongoose.connect('mongodb://localhost:27017/realtime-crud');

mongoose.connection.on('connected', () => {
	console.log('Kết nối thành công');
});

// Socket.IO events
io.on('connection', (socket) => {
	console.log('Client kết nối:', socket.id);

	// Tạo sản phẩm mới
	socket.on('create_product', async (data) => {
		try {
			const product = await createProduct(data);
			io.emit('product_created', product); // Phát sự kiện cho tất cả client
		} catch (err) {
			console.error('Lỗi khi tạo sản phẩm:', err);
		}
	});

	// Lấy danh sách sản phẩm
	socket.on('get_products', async () => {
		try {
			const products = await getProducts();
			socket.emit('products_list', products);
		} catch (err) {
			console.error('Lỗi khi lấy danh sách sản phẩm:', err);
		}
	});

	// Cập nhật sản phẩm
	socket.on('update_product', async ({ id, data }) => {
		try {
			const product = await updateProduct(id, data);
			io.emit('product_updated', product); // Phát sự kiện cập nhật
		} catch (err) {
			console.error('Lỗi khi cập nhật sản phẩm:', err);
		}
	});

	// Xóa sản phẩm
	socket.on('delete_product', async (id) => {
		try {
			await deleteProduct(id);
			io.emit('product_deleted', id); // Phát sự kiện xóa
		} catch (err) {
			console.error('Lỗi khi xóa sản phẩm:', err);
		}
	});

	socket.on('disconnect', () => {
		console.log('Client ngắt kết nối:', socket.id);
	});
});

const PORT = 3001;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

// DOM Elements
const productForm = document.getElementById('product-form');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const stockInput = document.getElementById('stock');
const productList = document.getElementById('product-list');

// Lấy danh sách sản phẩm từ server
socket.emit('get_products');

socket.on('products_list', (products) => {
	renderProducts(products);
});

// Lắng nghe sự kiện tạo sản phẩm
socket.on('product_created', (product) => {
	addProductToList(product);
});

// Lắng nghe sự kiện cập nhật sản phẩm
socket.on('product_updated', (product) => {
	updateProductInList(product);
});

// Lắng nghe sự kiện xóa sản phẩm
socket.on('product_deleted', (id) => {
	removeProductFromList(id);
});

// Xử lý sự kiện submit form tạo sản phẩm
productForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const productData = {
		name: nameInput.value,
		description: descriptionInput.value,
		price: parseFloat(priceInput.value),
		stock: parseInt(stockInput.value, 10),
	};

	socket.emit('create_product', productData);

	// Reset form
	nameInput.value = '';
	descriptionInput.value = '';
	priceInput.value = '';
	stockInput.value = '';
});

// Hàm hiển thị danh sách sản phẩm
function renderProducts(products) {
	productList.innerHTML = '';
	products.forEach((product) => {
		addProductToList(product);
	});
}

// Hàm thêm sản phẩm vào danh sách
function addProductToList(product) {
	const li = document.createElement('li');
	li.setAttribute('data-id', product._id);
	li.innerHTML = `
    <strong>${product.name}</strong><br>
    ${product.description}<br>
    Price: $${product.price} | Stock: ${product.stock}
    <div class="actions">
      <button onclick="editProduct('${product._id}')">Edit</button>
      <button onclick="deleteProduct('${product._id}')">Delete</button>
    </div>
  `;
	productList.appendChild(li);
}

// Hàm cập nhật sản phẩm trong danh sách
function updateProductInList(product) {
	const li = productList.querySelector(`[data-id="${product._id}"]`);
	if (li) {
		li.innerHTML = `
      <strong>${product.name}</strong><br>
      ${product.description}<br>
      Price: $${product.price} | Stock: ${product.stock}
      <div class="actions">
        <button onclick="editProduct('${product._id}')">Edit</button>
        <button onclick="deleteProduct('${product._id}')">Delete</button>
      </div>
    `;
	}
}
// Hàm xóa sản phẩm khỏi danh sách
function removeProductFromList(id) {
	const li = productList.querySelector(`[data-id="${id}"]`);
	if (li) {
		productList.removeChild(li);
	}
}

// Hàm xóa sản phẩm
function deleteProduct(id) {
	if (confirm(`Are you sure you want to delete this product?`)) {
		socket.emit('delete_product', id);
	}
}

// Hàm chỉnh sửa sản phẩm
function editProduct(id) {
	const li = productList.querySelector(`[data-id="${id}"]`);
	if (li) {
		const name = prompt(
			'Enter new name:',
			li.querySelector('strong').textContent
		);
		const description = prompt(
			'Enter new description:',
			li.childNodes[2].nodeValue.trim()
		);
		const price = parseFloat(
			prompt(
				'Enter new price:',
				li.childNodes[4].nodeValue.split(' | ')[0].replace('Price: $', '')
			)
		);
		const stock = parseInt(
			prompt(
				'Enter new stock:',
				li.childNodes[4].nodeValue.split(' | ')[1].replace('Stock: ', '')
			)
		);

		if (name && !isNaN(price) && !isNaN(stock)) {
			socket.emit('update_product', {
				id,
				data: { name, description, price, stock },
			});
		}
	}
}

window.deleteProduct = deleteProduct;
window.editProduct = editProduct;

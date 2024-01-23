import express from 'express';
import Product from '../schemas/products.schema.js';
// Express.js의 라우터를 생성합니다.
const router = express.Router();

/** 상품 등록 **/
// localhost:3000/api/product POST
router.post('/product', async (req, res) => {
	const { title, content, writer, password } = req.body;

	const product = await Product.find({ title }).exec();
	if (!product) {
		return res.status(400).json({
			success: false,
			errorMessage: '데이터 형식이 올바르지 않습니다.',
		});
	}

	const createproduct = await Product.create({
		title,
		content,
		writer,
		password,
	});

	return res.status(201).json({ message: '판매 상품을 등록하였습니다.' });
});

// 상품 목록 조회 API
router.get('/products', async (req, res, next) => {
	const products = await Product.find()
		.select('title writer status regDate')
		.sort('regDate')
		.exec();

	return res.status(200).json({ products });
});

// 상품 상세 조회 API
router.get('/products/:productId', async (req, res, next) => {
	const { productId } = req.params;

	const product = await Product.findById(productId).exec();

	if (!product) {
		return res.status(404).json({
			success: false,
			message: '상품 조회에 실패하였습니다.',
		});
	}

	return res.status(200).json({ product });
});

// 상품 정보 수정 API
router.put('/products/:productId', async (req, res, next) => {
	const { productId } = req.params;
	const { title, content, password, status } = req.body;

	const product = await Product.findById({ productId }).exec();

	if (!product) {
		return res
			.status(404)
			.json({ success: false, message: '상품 조회에 실패하였습니다.' });
	}

	if (password !== product.password) {
		return res
			.status(401)
			.json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
	}

	const updateProduct = await Product.findByIdAndUpdate(productId, {
		title,
		content,
		status,
		password,
	}).exec();

	return res.status(200).json({
		success: true,
		message: '상품정보를 수정하였습니다.',
		updateProduct,
	});
});

// 상품 삭제 API
router.delete('/products/:productId', async (req, res, next) => {
	const { productId } = req.params;
	const { password } = req.body;

	try {
		const product = await Product.findById(productId).exec();

		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: '상품 조회에 실패하였습니다.' });
		}

		if (password !== product.password) {
			return res
				.status(401)
				.json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
		}

		await Product.deleteOne({ _id: productId }).exec();

		return res
			.status(200)
			.json({ success: true, message: '상품을 삭제하였습니다.' });
	} catch (error) {
		return res.status(500).json({ success: false, message: '서버오류' });
	}
});

export default router;

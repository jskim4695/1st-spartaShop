import express from 'express';
import Product from '../schemas/products.schema.js';
// Express.js의 라우터를 생성합니다.
const router = express.Router();

/** 상품 등록 **/
// localhost:3000/api/product POST
router.post('/product', async (req, res) => {
	try {
		if (!req.body) {
			return res.status(400).json({
				errorMessage: '데이터 형식이 올바르지 않습니다.',
			});
		}

		const { title, content, writer, password } = req.body; // 구조분해할당
		const newProduct = new Product({
			title,
			content,
			writer,
			password,
		});
		await newProduct.save();
		res.status(201).json({ message: '판매 상품을 등록하였습니다.' });
	} catch (error) {
		res.status(500).json({ message: '예기치 못한 에러가 발생하였습니다.' });
	}
});

// 상품 목록 조회 API
router.get('/products', async (req, res) => {
	try {
		const products = await Product.find()
			.select('_id title writer status regDate')
			.sort('regDate: -1');

		return res.status(200).json({ products });
	} catch (error) {
		res.status(500).json({ message: '예기치 못한 에러가 발생하였습니다.' });
	}
});

// 상품 상세 조회 API
router.get('/products/:productId', async (req, res) => {
	try {
		const product = await Product.findById(req.params.productId).select(
			'_id title content writer status regDate'
		);

		if (!product) {
			return res.status(404).json({
				errorMessage: '상품 조회에 실패하였습니다.',
			});
		}
		return res.status(200).json({ product });
	} catch (error) {
		res.status(500).json({ message: '예기치 못한 에러가 발생하였습니다.' });
	}
});

// 상품 정보 수정 API
router.put('/products/:productId', async (req, res) => {
	try {
		if (!req.body || !req.params) {
			return res.status(400).json({
				errorMessage: '데이터 형식이 올바르지 않습니다.',
			});
		}

		const { title, content, password, status } = req.body;
		const product = await Product.findById(req.params.productId);

		if (!product) {
			return res.status(404).json({
				errorMessage: '상품 조회에 실패하였습니다.',
			});
		}

		if (password !== product.password) {
			return res
				.status(401)
				.json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
		}

		product.title = title;
		product.content = content;
		product.status = status;

		await product.save();
		res.json({ message: '상품정보를 수정하였습니다.' });
	} catch (error) {
		res.status(500).json({ message: '예기치 못한 에러가 발생하였습니다.' });
	}
});

// 상품 삭제 API
router.delete('/products/:productId', async (req, res) => {
	try {
		if (!req.body || !req.params) {
			return res.status(400).json({
				errorMessage: '데이터 형식이 올바르지 않습니다.',
			});
		}

		const productId = req.params.productId;
		const { password } = req.body;
		const product = await Product.findById(req.params.productId);

		if (!product) {
			return res.status(404).json({
				errorMessage: '상품 조회에 실패하였습니다.',
			});
		}

		if (password !== product.password) {
			return res
				.status(401)
				.json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
		}

		await product.deleteOne({ id: productId });
		res.json({ message: '상품을 삭제하였습니다.' });
	} catch (error) {
		res.status(500).json({ message: '예기치 못한 에러가 발생하였습니다.' });
	}
});

export default router;

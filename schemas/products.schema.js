import mongoose from 'mongoose';
// 상품명, 작성 내용, 작성자명, 상품 상태, 작성 날짜
const productSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		unique: true,
	},
	content: {
		// 작성내용
		type: String,
		required: true,
		unique: true,
	},
	writer: {
		type: String,
		required: true,
	},
	status: {
		// 상품 상태
		type: String,
		enum: ['FOR_SALE', 'SOLD_OUT'],
		default: 'FOR_SALE',
	},
	regDate: {
		type: Date,
		default: Date.now,
	},
	password: {
		type: Number,
	},
});

export default mongoose.model('Product', productSchema);

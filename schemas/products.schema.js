import mongoose from 'mongoose';
// 상품명, 작성 내용, 작성자명, 상품 상태, 작성 날짜
const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		content: {
			// 작성내용
			type: String,
			required: true,
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
		password: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Product', productSchema);

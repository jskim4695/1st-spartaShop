import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const { DB_HOST, DB_NAME } = process.env;

const connect = () => {
	mongoose
		.connect(DB_HOST, {
			dbName: DB_NAME,
		})
		.then(() => console.log('MongoDB 연결에 성공하였습니다.'))
		.catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

mongoose.connection.on('error', (err) => {
	console.error('MongoDB 연결 에러', err);
});

export default connect;

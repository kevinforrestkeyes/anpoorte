import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
	id: String,
	storeName: String,
	clientToken: String,
	storeToken: String
});

export default mongoose.model('Token', TokenSchema);
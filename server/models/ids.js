'use strict';

import mongoose from 'mongoose'

const idsSchema = new mongoose.Schema({
	user_id: Number,
	admin_id: Number,
	hotel_id: Number,
	img_id: Number,
});

const Ids = mongoose.model('Ids', idsSchema);

Ids.findOne((err, data) => {
	if (!data) {
		const newIds = new Ids({
			user_id: 0,
			admin_id: 0,
			hotel_id: 0,
			img_id: 0
		});
		newIds.save();
	}
})
export default Ids
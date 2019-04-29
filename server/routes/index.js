'use strict';

import admin from './admin.js'
import user from './user.js'
import hotel from './hotel.js'

export default app => {
	app.use('/api/admin', admin);
	app.use('/api/user', user);
	app.use('/api/hotel', hotel);
};
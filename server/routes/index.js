'use strict';

import admin from './admin.js'
import user from './user.js'

export default app => {
	app.use('/api/admin', admin);
	app.use('/api/user', user);
};
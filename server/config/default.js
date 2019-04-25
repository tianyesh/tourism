'use strict';

module.exports = {
	port: 8001,
	url: 'mongodb://localhost:27017/tourism',
	session: {
		name: 'SID',
		secret: 'SID',
		cookie: {
			httpOnly: true,
		    secure:   false,
		    maxAge:   30 * 24 * 60 * 60 * 1000,
		}
	}
}
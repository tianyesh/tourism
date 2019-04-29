'use strict';

import express from 'express'
import Hotel from '../controller/hotel/hotel'
import Check from '../middleware/check'
const router = express.Router()

// router.get('/getUserInfo', User.getUserInfo);
router.get('/getHotelList', Hotel.getHotelList);
// router.post('/addUser', Check.checkAdmin, User.addUser);
// router.post('/editUser/:id', Check.checkAdmin, User.editUser);
// router.delete('/delUser/:id', Check.checkSuperAdmin, User.delUser);

export default router
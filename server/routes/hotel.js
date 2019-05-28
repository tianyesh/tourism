'use strict';

import express from 'express'
import Hotel from '../controller/hotel/hotel'
import Check from '../middleware/check'
const router = express.Router()

router.get('/getHotelList', Hotel.getHotelList);
router.get('/getHotelDel/:id', Hotel.getHotelDel);
router.get('/isCanComment/:id', Hotel.isCanComment);
router.post('/addHotelComment/:id', Hotel.addHotelComment);
router.post('/addHotel', Check.checkAdmin, Hotel.addHotel);
router.post('/editHotel/:id', Check.checkAdmin, Hotel.editHotel);
router.delete('/delHotel/:id', Check.checkSuperAdmin, Hotel.delHotel);

export default router
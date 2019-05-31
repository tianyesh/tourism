'use strict';

import express from 'express'
import Travel from '../controller/travel/travel'
import Check from '../middleware/check'
const router = express.Router()

router.get('/getTravelList', Travel.getTravelList);
router.get('/getTravelDel/:id', Travel.getTravelDel);
router.get('/isCanTravelComment/:id', Travel.isCanComment);
router.post('/bookTravel/:id', Check.checkAdmin, Travel.bookTravel);
router.post('/addTravelComment/:id', Check.checkAdmin, Travel.addTravelComment);
router.post('/addTravel', Check.checkAdmin, Travel.addTravel);
router.post('/editTravel/:id', Check.checkAdmin, Travel.editTravel);
router.delete('/delTravel/:id', Check.checkSuperAdmin, Travel.delTravel);

export default router
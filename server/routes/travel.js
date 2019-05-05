'use strict';

import express from 'express'
import Travel from '../controller/travel/travel'
import Check from '../middleware/check'
const router = express.Router()

router.get('/getTravelList', Travel.getTravelList);
router.post('/addTravel', Check.checkAdmin, Travel.addTravel);
router.post('/editTravel/:id', Check.checkAdmin, Travel.editTravel);
router.delete('/delTravel/:id', Check.checkSuperAdmin, Travel.delTravel);

export default router
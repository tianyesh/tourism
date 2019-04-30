'use strict';

import express from 'express'
import City from '../controller/city'
const router = express.Router()

router.get('/getProvinceList', City.getProvinceList);
router.get('/getCityList/:province', City.getCityList);

export default router
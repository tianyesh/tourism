'use strict';

import express from 'express'
import BaseComponent from '../prototype/baseComponent'
const router = express.Router()
const baseHandle = new BaseComponent();

router.post('/addimg/:type', baseHandle.uploadImg);

export default router
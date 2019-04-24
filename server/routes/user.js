'use strict';

import express from 'express'
import User from '../controller/user/user'
import Check from '../middleware/check'
const router = express.Router()

router.get('/getUserList', User.getUserList);
router.delete('/delUser/:id', Check.checkSuperAdmin, User.delUser);

export default router

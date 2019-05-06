'use strict';

import express from 'express'
import User from '../controller/user/user'
import Check from '../middleware/check'
const router = express.Router()

router.get('/getUserInfo', User.getUserInfo);
router.get('/getUserList', User.getUserList);
router.post('/addUser', Check.checkAdmin, User.addUser);
router.post('/editUser/:id', Check.checkAdmin, User.editUser);
router.delete('/delUser/:id', Check.checkSuperAdmin, User.delUser);
router.post('/update/avatar/:id', User.updateAvatar);

export default router

import express from 'express';
import userModel from '../db/schemas/user.schema.js';
import userRegister from '../controlers/user.register.js';
import userLogin from '../controlers/user.login.js';
import leadCreate from '../controlers/modules/leadmodule/lead.create.js';
import leadsFilter from '../controlers/modules/leadmodule/leads.filters.js';
import { isAuthenticated} from '../middleware/isAuth.js';
import leadFind from '../controlers/modules/leadmodule/leads.find.js';
import leadsUpdate from '../controlers/modules/leadmodule/leads.update.js';
import leadsDelete from '../controlers/modules/leadmodule/leads.delete.js';
import {createEmployee as employeeRegister} from '../controlers/modules/employeeModule/employe.register.js';
import {requirePermission} from '../middleware/requirePermission.js';
import { body } from 'express-validator';



let router = express.Router();
/* GET users listing. */
router.get('/res', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', userRegister);
router.post('/login', userLogin);
router.post("/lead/create", leadCreate);
router.get("/lead/filter", isAuthenticated, leadsFilter);
router.get("/lead/find/:id", isAuthenticated, leadFind);
router.put("/lead/update/:id", isAuthenticated, leadsUpdate);
router.delete("/lead/delete/:id", isAuthenticated, leadsDelete );

router.post(
  "/employee",
  isAuthenticated,
  requirePermission("canManageUsers"), 

  // Validation rules
  body("name").notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("Valid email is required."),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),

  employeeRegister   
);


export default router;

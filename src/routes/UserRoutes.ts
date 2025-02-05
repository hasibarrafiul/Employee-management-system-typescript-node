import { Router } from "express";
import { getUsers, checkUserExistence, deleteUser, checkUsernameAvailability, upsertUser } from "../controllers/UserController";
import  userValidator  from "../validators/userValidator";
import validate  from "../validators";

const router = Router();

router.get("/users", getUsers);
router.put("/users", validate(userValidator.userSchema), upsertUser);
router.post("/users/check", validate(userValidator.checkUserSchema), checkUserExistence);
router.delete("/users/:id", validate(userValidator.deleteUserSchema, "params"), deleteUser);
router.get("/users/check-availability", validate(userValidator.checkAvailabilitySchema, "query"), checkUsernameAvailability);


export default router;

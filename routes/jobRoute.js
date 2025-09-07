import express from "express"
import { allJob, getAdminJob, getJobById, postJob } from "../controllers/jobControllers.js"
import isAuth from "../middleware/isAuth.js"

const router = express.Router()

router.route("/post").post(isAuth, postJob)
router.route("/get").get(allJob)
router.route("/jobs/:id").get(getJobById)
router.route("/admin/jobs").get(isAuth, getAdminJob)


export default router
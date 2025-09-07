import express from "express"
import isAuth from "../middleware/isAuth.js"
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/applicationControllers.js"

const router = express.Router()



router.route("/apply/:id").get(isAuth, applyJob)
router.route("/get").get(isAuth, getAppliedJobs)
router.route("/:id/applications").get(isAuth, getApplicants)
router.route("/status/:id/update").put(isAuth, updateStatus)



export default router
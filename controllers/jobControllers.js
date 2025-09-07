import { Job } from "../models/jobModel.js"

export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, exprience, position, companyId } = req.body
        const userId = req._id
        if (!title || !description || !requirements || !salary || !location || !jobType || !exprience || !position || !companyId) {
            return res.status(400).json({
                message: 'Something missing',
                success: false
            })
        }
        const jobpost = await Job.create({
            title, description,
            requirements,
            salary,
            location,
            jobType,
            exprience,
            position,
            company: companyId,
            create_by: userId

        })
        return res.status(201).json({
            message: 'Successfully created new job',
            job: jobpost,
            success: true
        });



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }


}



export const allJob = async (req, res) => {
    try {
        const keyword = req.query.keyword || ""

        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }
        const findJob = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 })

        if (!findJob.length) {
            return res.status(404).json({
                message: 'No jobs found',
                success: false
            });
        }

        return res.status(200).json({
            jobs: findJob,
            success: true
        })


    } catch (error) {
        console.log(error);


    }
}

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id
        const job = await Job.findById(jobId)
            .populate('company')
            .populate({ path: "applications" })


        if (!job) {
            return res.status(404).json({
                message: 'Job not found',
                success: false
            })
        }
        return res.status(200).json({
            job,
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}


export const getAdminJob = async (req, res) => {
    try {
        const adminId = req._id
        const jobs = await Job.find({ create_by: adminId }).populate({
            path: 'company',
            createdAt: -1
        })

        if (!jobs) {
            return res.status(404).json({
                message: 'Job not found',
                success: false
            })

        }
        return res.status(200).json({
            jobs,
            success: true
        })

    } catch (error) {
        console.log(error);


    }
}
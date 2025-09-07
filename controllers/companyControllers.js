import { Company } from "../models/companyModel.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

// Register a new company
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: 'Company name is required',
                success: false
            });
        }

        let existingCompany = await Company.findOne({ name: companyName });
        if (existingCompany) {
            return res.status(400).json({
                message: "You can't register the same company twice",
                success: false
            });
        }

        const company = await Company.create({
            name: companyName,
            userid: req._id
        });

        return res.status(201).json({
            message: 'Company successfully registered',
            company,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message,
            success: false
        });
    }
};

// Get companies for the current user
export const getCompany = async (req, res) => {
    try {
        const userId = req._id;
        const companies = await Company.find({ userid: userId });

        return res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message,
            success: false
        });
    }
};

// Get a company by ID
export const getCompanyId = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: 'Company not found',
                success: false
            });
        }

        return res.status(200).json({
            company,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message,
            success: false
        });
    }
};

// Update a company by ID
export const updateCompany = async (req, res) => {
    try {
        const { name, description, location, webSite } = req.body;
let logo;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }



        const updateData = { name, description, location, webSite, logo };
        const company = await Company.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!company) {
            return res.status(404).json({
                message: 'Company not found',
                success: false
            });
        }

        return res.status(200).json({
            message: 'Company updated successfully',
            company,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message,
            success: false
        });
    }
};

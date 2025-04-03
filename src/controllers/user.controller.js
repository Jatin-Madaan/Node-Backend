import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullName, password } = req.body;

    console.log("request received: ", req.files);
    // Validate request body
    if ([username, email, fullName, password].some(field => field?.trim() === '')) {
        throw new ApiError(400, 'All fields are required');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
        throw new ApiError(409, 'User already exists');
    }

    const avatarPath = req.files?.avatar?.[0]?.path;
    const coverImagePath = req.files?.coverImage?.[0]?.path;
    if(!avatarPath) {
        throw new ApiError(400, 'Avatar image is required');
    }

    const avatar = await uploadOnCloudinary(avatarPath);
    const coverImage = coverImagePath ? await uploadOnCloudinary(coverImagePath) : null;

    if (!avatar) {
        throw new ApiError(500, 'Failed to upload avatar image');
    }

    const user = await User.create({
        username,
        email,
        fullName,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    });

    const createdUser = await User.findById(user._id)
        .select('-password -refreshToken');

    if (!createdUser) {
        throw new ApiError(500, 'Failed to create user in database');
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, 'User registered successfully')
    );
});

export { registerUser };
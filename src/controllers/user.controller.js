import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';


const generateAccessAndRefreshToken = async (userId) =>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, `Something went wrong while generating refresh and access token: ${error?.message}`);
    }
}

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

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    const { username, email, password } = req.body;
    // username or email -> validation
    if(!username && !email){
        throw new ApiError(400, "Username or Email is required")
    }
    // find user
    const user = await User.findOne({$or: [{email}, {username}]});
    if(!user){
        throw new ApiError(404, "User does not exists");
    }
    // password check
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials");
    }
    // access & refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    // send cookie
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser, accessToken, refreshToken
            }, "User logged in sucessfully")
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    }, { new: true });

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        );
});

export { registerUser, loginUser, logoutUser };
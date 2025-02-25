import { sendVerificationEmail } from '@/Helpers/Send.Verification.Email';
import Dbconnect from '@/lib/Db.Connect';
import { UserModel } from '@/Models/User.Model';
import bcryptjs from 'bcryptjs';

// CHAPTER 1: Main Handler Function
// Main POST handler for user registration
export async function POST(request: Request) {
  console.log("Received POST request to register a new user");

  // 1.1 Database Connection
  await Dbconnect();
  console.log("Database connection established");

  try {
    // CHAPTER 2: Request Processing
    const { username, email, password } = await request.json();
    console.log("Request data:", { username, email, password: "[hidden]" });

    // CHAPTER 3: Username Validation
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      console.log("Username already taken:", username);
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }

    // CHAPTER 4: Email Validation and Verification Setup
    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        console.log("Email already verified:", email);
        return Response.json(
          {
            success: false,
            message: "user already exists with this email",
          },
          { status: 400 }
        );
      }
      console.log("Email already registered (unverified):", email);
      return Response.json(
        {
          success: false,
          message: "email is already registered",
        },
        { status: 400 }
      );
    }

    // CHAPTER 5: New User Creation
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    const newUser = await new UserModel({
      username,
      email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry: expiryDate,
      isVerified: false,
      isAcceptingMessage: true,
      messages: [],
    }).save();
    console.log("New user created:", { username, email });

    // CHAPTER 6: Email Verification
    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    if (!emailResponse.success) {
      console.log("Failed to send verification email:", email);
      return Response.json(
        {
          success: false,
          message: "Failed to send verification email",
        },
        { status: 500 }
      );
    }

    // CHAPTER 7: Success Response
    console.log("User registered successfully:", username);
    return Response.json(
      {
        success: true,
        message: "User registered successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    // CHAPTER 8: Error Handling
    console.error("Registration error:", (error as Error).message);
    return Response.json(
      {
        success: false,
        message: "error registering user",
      },
      { status: 500 }
    );
  }
}
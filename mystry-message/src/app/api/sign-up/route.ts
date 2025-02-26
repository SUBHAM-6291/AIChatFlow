import { sendVerificationEmail } from '@/Helpers/Send.Verification.Email';
import Dbconnect from '@/lib/Db.Connect';
import { UserModel } from '@/Models/User.Model';
import bcryptjs from 'bcryptjs';

export async function POST(request: Request) {
  console.log("Received POST request to register a new user");

  await Dbconnect();
  console.log("Database connection established");

  try {
    const { username, email, password } = await request.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "user already exists with this email",
          },
          { status: 400 }
        );
      }
      return Response.json(
        {
          success: false,
          message: "email is already registered",
        },
        { status: 400 }
      );
    }

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
    console.log("New user created successfully");

    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: "Failed to send verification email",
        },
        { status: 500 }
      );
    }

    console.log("User registered and verification email sent successfully");
    return Response.json(
      {
        success: true,
        message: "User registered successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during user registration");
    return Response.json(
      {
        success: false,
        message: "error registering user",
      },
      { status: 500 }
    );
  }
}
import { sendVerificationEmail } from '@/Helpers/Send.Verification.Email'
import Dbconnect from '@/lib/Db.Connect'
import { UserModel } from '@/Models/User.Model'
import bcryptjs from 'bcryptjs'


// Main POST handler for user registration
export async function POST(request: Request) {
    // Database Connection
    await Dbconnect()
    
    try {
        // Parse Request Data
        const { username, email, password } = await request.json()

        // Check Existing Username
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "username is already taken"
            }, { status: 400 })
        }

        // Check Existing Email and Generate Verification Code
        const existingUserByEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        // Email Validation Logic
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "user already exists with this email"
                }, { status: 400 })
            }
            return Response.json({
                success: false,
                message: "email is already registered"
            }, { status: 400 })
        } else {
            
            const hashedPassword = await bcryptjs.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = await new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            }).save()
        }

        // Send Verification Email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        // Email Response Handling
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: "Failed to send verification email"
            }, { status: 500 })
        }

        // Success Response
        return Response.json({
            success: true,
            message: "User registered successfully"
        }, { status: 200 })

    } catch (error) {
        // Error Handling
        console.error('error registering user ', error)
        return Response.json({
            success: false,
            messages: "error registering user"
        })
    }
}
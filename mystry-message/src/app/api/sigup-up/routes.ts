import { sendVerificationEmail } from '@/Helpers/Send.Verification.Email'
import Dbconnect from '@/lib/Db.Connect'
import { UserModel } from '@/Models/User.Model'
import bcryptjs from 'bcryptjs'

// CHAPTER 1: Main Handler Function
// Main POST handler for user registration
export async function POST(request: Request) {
    // 1.1 Database Connection
    // Establishes connection to the database
    await Dbconnect()
    
    try {
        // CHAPTER 2: Request Processing
        // 2.1 Parse Request Data
        // Extracts user data from request body
        const { username, email, password } = await request.json()

        // CHAPTER 3: Username Validation
        // 3.1 Check Existing Username
        // Looks for verified users with the same username
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        // 3.2 Username Conflict Response
        // Returns error if username is already taken by verified user
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "username is already taken"
            }, { status: 400 })
        }

        // CHAPTER 4: Email Validation and Verification Setup
        // 4.1 Check Existing Email
        // Searches for any user with the provided email
        const existingUserByEmail = await UserModel.findOne({ email })
        
        // 4.2 Generate Verification Code
        // Creates a 6-digit verification code
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        // 4.3 Email Validation Logic
        if (existingUserByEmail) {
            // 4.3.1 Verified Email Check
            // If email exists and is verified
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "user already exists with this email"
                }, { status: 400 })
            }
            // 4.3.2 Unverified Email Check
            // If email exists but not verified
            return Response.json({
                success: false,
                message: "email is already registered"
            }, { status: 400 })
        } else {
            // CHAPTER 5: New User Creation
            // 5.1 Password Hashing
            // Hashes password with bcryptjs using 10 salt rounds
            const hashedPassword = await bcryptjs.hash(password, 10)
            
            // 5.2 Verification Expiry Setup
            // Sets verification code expiry to 1 hour from now
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            // 5.3 Create New User
            // Saves new user document to database
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

        // CHAPTER 6: Email Verification
        // 6.1 Send Verification Email
        // Attempts to send verification email to user
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        // 6.2 Email Response Handling
        // Checks if email was sent successfully
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: "Failed to send verification email"
            }, { status: 500 })
        }

        // CHAPTER 7: Success Response
        // 7.1 Return Success Message
        // Returns success response on successful registration
        return Response.json({
            success: true,
            message: "User registered successfully"
        }, { status: 200 })

    } catch (error) {
        // CHAPTER 8: Error Handling
        // 8.1 Error Logging
        // Logs any errors that occur during registration
        console.error('error registering user ', error)
        
        // 8.2 Error Response
        // Returns generic error response
        return Response.json({
            success: false,
            messages: "error registering user"  // Note: 'messages' should probably be 'message'
        })
    }
}
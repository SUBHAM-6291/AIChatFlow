import dbconnect from '@/lib/Db.Connect'
import { UserModel } from '@/Models/User.Model'
import { z } from 'zod'
import { usernameValidation } from '@/Schema/Signup.Schema'
import { Faster_One } from 'next/font/google'

// Chapter 1: Schema Definition
const usernameQuerySchema = z.object({
    username: usernameValidation
})

// Chapter 2: Main API Handler
export async function GET(request: Request) {
    // Chapter 3: Database Connection
    await dbconnect()
    
    try {
        // Chapter 4: Query Parameter Extraction
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        
        // Chapter 5: Input Validation
        const result = usernameQuerySchema.safeParse(queryParam)
        console.log(result)
        
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameErrors.length > 0 
                        ? usernameErrors.join(', ') 
                        : 'Invalid query parameter'
                },
                { status: 400 }
            )
        }

        // Chapter 6: Database Query
        const { username } = result.data
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        })

        // Chapter 7: Response Handling
        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'Username already taken'
                },
                { status: 400 }
            )
        }

        return Response.json(
            {
                success: true,
                message: 'Username is available'
            },
            { status: 200 }
        )
    // Chapter 8: Error Handling
    } catch (error) {
        console.error("Error checking username:", error)
        return Response.json(
            { 
                success: false,
                message: 'Internal server error'
            },
            { status: 500 }
        )
    }
}
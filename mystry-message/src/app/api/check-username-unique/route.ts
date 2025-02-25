import dbconnect from '@/lib/Db.Connect'
import { UserModel } from '@/Models/User.Model'
import { z } from 'zod'
import { usernameValidation } from '@/Schema/Signup.Schema'
import { Faster_One } from 'next/font/google'

const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbconnect()
    
    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        
        const result = usernameQuerySchema.safeParse(queryParam)
        console.log(result)
        
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameErrors.length > 0 
                        ? usernameErrors.join(',') 
                        : 'Invalid query parameter'
                },
                { status: 400 }
            )
        }

        const { username } = result.data
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true  // Fixed typo 'ture' → 'true'
        })

        if (existingVerifiedUser) {
            return Response.json(  // Fixed typo 'reso[psnse' → 'Response.json'
                {
                    success: false,  // Fixed typo 'sucess' → 'success'
                    message: 'Username already taken'
                },
                { status: 400 }  // Fixed syntax for status object
            )
        }

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
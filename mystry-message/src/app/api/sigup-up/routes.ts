import { sendVerificationEmail } from '@/Helpers/Send.Verification.Email'
import Dbconnect from '@/lib/Db.Connect'
import { UserModel } from '@/Models/User.Model'
import bcryptjs from 'bcryptjs'

export async function POST(request: Request) {
    await Dbconnect()
    
    try {
        const { username, email, password } = await request.json()
    } catch (error) {
        console.error('error registering user ', error)
        return Response.json({
            success: false,
            messages: "error registering user"
        })
    }
}
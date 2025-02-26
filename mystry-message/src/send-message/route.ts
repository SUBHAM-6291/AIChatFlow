import dbConnect from '@/lib/Db.Connect'
import { UserModel } from '@/Models/User.Model'
import { Message } from '@/Models/User.Model'
import { date } from 'zod'

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, content } = await request.json()
        
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "user not found"
                },
                { status: 404 }
            )
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()  // Added parentheses to actually call the save method

        return Response.json(
            {
                success: true,
                message: "message sent successfully"  // Fixed typo and capitalization
            },
            { status: 201 }  // Changed to 201 (Created) which is more appropriate for POST success
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error processing message",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        )
    }
}
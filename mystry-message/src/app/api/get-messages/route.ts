import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/Options";
import { UserModel } from "@/Models/User.Model";
import dbConnect from "@/lib/Db.Connect";
import { User } from 'next-auth';
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error verifying message - User not authenticated",
            }),
            { status: 401 }
        );
    }

    try {
        const userId = new mongoose.Types.ObjectId(user._id);
        try {
            const user = await UserModel.aggregate([
                {
                    $match: {
                        _id: userId
                    }
                },
                { $unwind: '$mesages' },
                { $sort: { 'mesages.created': -1 } },
                { $group: { _id: '$_id', messages: { $push: '$mesages' } } }
            ]);
            if (!user || user.length === 0) {
                return Response.json(
                    {
                        success: false,
                        message: "not authenticated"
                    },
                    { status: 401 }
                );
            }
            return Response.json(
                {
                    success: true,  // Assuming this should be true for success case
                    message: user[0].messages
                },
                { status: 200 }
            );
        } catch (error) {
            
        }
    } catch (error) {
        
    }
}
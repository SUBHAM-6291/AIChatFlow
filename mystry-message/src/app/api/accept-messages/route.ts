import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/Options";
import { UserModel } from "@/Models/User.Model";
import dbConnect from "@/lib/Db.Connect";
import { User } from 'next-auth';

// POST handler to update message acceptance status
export async function POST(request: Request): Promise<Response> {
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
    const userId = user._id;
    const { isAcceptingMessage } = await request.json();

    // Input validation
    if (typeof isAcceptingMessage !== 'boolean') {
      return new Response(
        JSON.stringify({
          success: false,
          message: "isAcceptingMessage must be a boolean",
        }),
        { status: 400 }
      );
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message acceptance status updated successfully",
        user: updatedUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user status:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to update user status",
      }),
      { status: 500 }
    );
  }
}

// GET handler to retrieve user status
export async function GET(request: Request): Promise<Response> {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Error verifying message - User not authenticated",
      },
      { status: 401 }
    );
  }

  try {
    const userId = user._id;
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User retrieved successfully",
        user: {
          _id: foundUser._id,
          isAcceptingMessage: foundUser.isAcceptingMessage,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to retrieve user",
      },
      { status: 500 }
    );
  }
}
import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

 const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify code is required']
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify code expiry is required']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [messageSchema]
});

export const MessageModel = mongoose.model<Message>('Message', messageSchema);
export const UserModel = mongoose.model<User>('User', UserSchema);
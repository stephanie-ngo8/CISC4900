import { PrismaClient } from '@prisma/client';
import {tokenParse} from "@/app/api/tokenParse";

export const dynamic = 'force-dynamic' // defaults to auto
const prisma = new PrismaClient();
export async function GET(request: Request) {
    const token = tokenParse(request);

    if (!token) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: token.id
        }
    });

    if (!user) {
        return Response.json({
            msg: 'User not found'
        }, { status: 404 });
    }

    return Response.json(user)
}
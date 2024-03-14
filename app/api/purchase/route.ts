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

    const user = await prisma.user.findMany();

    return Response.json(user)
}

export async function PATCH(request: Request) {
    const body = await request.json();
    const token = tokenParse(request);

    if (!token || !body.id) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    return Response.json({})
}

export async function PUT(request: Request) {
    const body = await request.json();
    const token = tokenParse(request);

    if (!token || !body.id) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    return Response.json({})
}

export async function POST(request: Request) {
    const body = await request.json();
    const token = tokenParse(request);

    if (!token || !body.email) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    return Response.json({})
}
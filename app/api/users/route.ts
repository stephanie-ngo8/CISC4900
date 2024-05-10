import { PrismaClient } from '@prisma/client';
import {tokenParse} from "@/app/api/tokenParse";

export const dynamic = 'force-dynamic' // defaults to auto
const prisma = new PrismaClient();

export async function PATCH(request: Request) {
    const body = await request.json();
    const token = tokenParse(request);

    if (!token || !body.id) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    const user = await prisma.user.update({
        where: {
            id: body.id
        },
        data: {
            deletedAt: new Date(),
            deleted: true
        }
    });

    return Response.json(user)
}

export async function PUT(request: Request) {
    const body = await request.json();
    const token = tokenParse(request);

    if (!token || !body.id) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    const user = await prisma.user.update({
        where: {
            id: body.id
        },
        data: {
            email: body.email,
            password: body.password,
            firstName: body.firstName,
            lastName: body.lastName,
            role: body.role
        }
    });

    return Response.json(user)
}

export async function POST(request: Request) {
    const body = await request.json();
    console.log(body);
    const token = tokenParse(request);

    if (!token || !body.email) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    const user = await prisma.user.create({
        data: {
            email: body.email,
            password: body.password,
            firstName: body.firstName,
            lastName: body.lastName,
            role: body.role
        }
    });

    return Response.json(user)
}
export async function GET(request: Request) {
    const token = tokenParse(request);

    if (!token) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    const users = await prisma.user.findMany({
        where: {
            deleted: false
        }
    });

    return Response.json(users)
}
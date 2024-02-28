import { PrismaClient } from '@prisma/client';
import {tokenParse} from "../tokenParse";

export const dynamic = 'force-dynamic' // defaults to auto
const prisma = new PrismaClient();
export async function GET(request: Request) {
    const token = tokenParse(request);

    if (!token) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    const department = await prisma.department.findMany({
        where: {
            deleted: false
        }
    })

    return Response.json(department)
}

export async function POST(request: Request) {
    const body = await request.json();
    const token = tokenParse(request);

    if (!token) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    const glCode = await prisma.department.create({
        data: {
            code: body.code,
            name: body.name,
        }
    })

    return Response.json(glCode)
}

export async function PUT(request: Request) {
    const body = await request.json();
    const token = tokenParse(request);

    if (!token) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    const glCode = await prisma.department.update({
        where: {
            id: body.id
        },
        data: {
            code: body.code,
            name: body.name,
        }
    })

    return Response.json(glCode)
}

export async function PATCH(request: Request) {
    const body = await request.json();
    const token = tokenParse(request);

    if (!token) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    const glCode = await prisma.department.update({
        where: {
            id: body.id
        },
        data: {
            deleted: true
        }
    })

    return Response.json(glCode)
}
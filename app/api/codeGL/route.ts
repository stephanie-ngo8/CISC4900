import { PrismaClient } from '@prisma/client';
import {tokenParse} from "../tokenParse";

export const dynamic = 'force-dynamic' // defaults to auto
const prisma = new PrismaClient();
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const autocomplete = searchParams.get('autocomplete');
    const token = tokenParse(request);

    if (!token) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    const glCodes = await prisma.gLCode.findMany({
        where: {
            deleted: false
        }
    })

    if (autocomplete) {
        return Response.json(glCodes.map(glCode => {
            return {
                id: glCode.id,
                name: glCode.code + "-" + glCode.name
            }
        }))
    }

    return Response.json(glCodes)
}

export async function POST(request: Request) {
    const body = await request.json();
    const token = tokenParse(request);

    if (!token) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    const glCode = await prisma.gLCode.create({
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

    const glCode = await prisma.gLCode.update({
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

    const glCode = await prisma.gLCode.update({
        where: {
            id: body.id
        },
        data: {
            deleted: true
        }
    })

    return Response.json(glCode)
}
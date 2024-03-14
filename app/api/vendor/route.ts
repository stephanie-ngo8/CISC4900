import { PrismaClient } from '@prisma/client';
import {tokenParse} from "@/app/api/tokenParse";

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

    const vendors = await prisma.vendor.findMany({
        where: {
            deleted: false
        }
    });

    if (autocomplete) {
        return Response.json(vendors.map(vendor => {
            return {
                id: vendor.id,
                name: vendor.name
            }
        }))
    }

    return Response.json(vendors)
}

export async function PATCH(request: Request) {
    const body = await request.json();
    const token = tokenParse(request);

    if (!token || !body.id) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    const vendor = await prisma.vendor.update({
        where: {
            id: body.id
        },
        data: {
            deletedAt: new Date(),
            deleted: true
        }
    });

    return Response.json(vendor)
}

export async function PUT(request: Request) {
    const body = await request.json();
    const token = tokenParse(request);

    if (!token || !body.id) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    const vendor = await prisma.vendor.update({
        where: {
            id: body.id
        },
        data: {
            name: body.name,
            email: body.email,
            phone: body.phone,
            contact: body.contact,
            website: body.website,
        }
    });

    return Response.json(vendor)
}

export async function POST(request: Request) {
    const body = await request.json();
    const token = tokenParse(request);

    if (!token || !body.name) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    const vendor = await prisma.vendor.create({
        data: {
            name: body.name,
            email: body.email,
            phone: body.phone,
            contact: body.contact,
            website: body.website,
        }
    });

    return Response.json(vendor)
}
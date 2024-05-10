import {tokenParse} from "@/app/api/tokenParse";
import {PrismaClient} from "@prisma/client";

export const dynamic = 'force-dynamic' // defaults to auto
const prisma = new PrismaClient();

export async function PUT(request: Request) {
    const body = await request.json();
    const token = tokenParse(request);

    if (!token || !body.id) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    if (body.status === "Approved") {
        await prisma.purchase.update({
            where: {
                id: body.id
            },
            data: {
                status: body.status,
                approvedAt: new Date(),
                approvedBy: {
                    connect: {
                        id: token.id
                    }
                }
            }
        })
    } else if (body.status === "Rejected") {
        await prisma.purchase.update({
            where: {
                id: body.id
            },
            data: {
                status: body.status,
                rejectedAt: new Date(),
                rejectedBy: {
                    connect: {
                        id: token.id
                    }
                }
            }
        })
    } else if (body.status === "Purchase") {
        await prisma.purchase.update({
            where: {
                id: body.id
            },
            data: {
                status: body.status,
                purchasedAt: new Date(),
                purchasedBy: {
                    connect: {
                        id: token.id
                    }
                }
            }
        })
    } else if (body.status === "Received") {
        await prisma.purchase.update({
            where: {
                id: body.id
            },
            data: {
                status: body.status,
                receivedAt: new Date(),
                receivedBy: {
                    connect: {
                        id: token.id
                    }
                }
            }
        })
    }

    return Response.json({})
}
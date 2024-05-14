import { PrismaClient } from '@prisma/client';
import {tokenParse} from "@/app/api/tokenParse";
import { TURBO_TRACE_DEFAULT_MEMORY_LIMIT } from '@/node_modules/next/dist/shared/lib/constants';

export const dynamic = 'force-dynamic' // defaults to auto
const prisma = new PrismaClient();

export async function GET(request: Request) {
    const token = tokenParse(request);

    if (!token) {
        return Response.json({
            msg: 'Unauthorized'
        }, {status: 401});
    }

    if (request.url.includes('id')) {
        const {searchParams} = new URL(request.url)
        const id = searchParams.get('id');
        const purchase = await prisma.purchase.findUnique({
            where: {
                id: id as string
            },
            include: {
                deliveryContacts: true,
                vendor: true,
                user: true,
                items: {
                    include: {
                        gLCode: true
                    }
                },
                allocation: {
                    include: {
                        department: true
                    }
                },
                approvedBy: true,
                rejectedBy: true,
                purchacePlaceBy: true,
                receivedBy: true
            }
        })

        return Response.json(purchase)
    }

    const user: any = await prisma.user.findUnique({
        where: {
            id: token.id
        }
    });

    let purchases: any[] = []

    if (user.role === 'APPROVERS') {
        purchases = await prisma.purchase.findMany({
            where: {
                deleted: false,
                submittedAt: {
                    not: null
                },
                approvedAt: null
            },
            include: {
                deliveryContacts: true,
                vendor: true,
                user: true,
                items: {
                    include: {
                        gLCode: true
                    }
                },
                allocation: {
                    include: {
                        department: true
                    }
                }
            }
        });
    } else if (user.role === 'PURCHASERS') {
        purchases = await prisma.purchase.findMany({
            where: {
                deleted: false,
                submittedAt: {
                    not: null
                },
                approvedAt: {
                    not: null
                },
                purchacePlaceAt: null
            },
            include: {
                deliveryContacts: true,
                vendor: true,
                user: true,
                items: {
                    include: {
                        gLCode: true
                    }
                },
                allocation: {
                    include: {
                        department: true
                    }
                }
            }
        });
    } else
        purchases = await prisma.purchase.findMany({
            where: {
                deleted: false,
            },
            include: {
                deliveryContacts: true,
                vendor: true,
                user: true,
                items: {
                    include: {
                        gLCode: true
                    }
                },
                allocation: {
                    include: {
                        department: true
                    }
                }
            }
        });

    return Response.json(purchases)
}

export async function PATCH(request: Request) {
    const body = await request.json();
    const token = tokenParse(request);

    if (!token || !body.id) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    await prisma.purchase.update({
        where: {
            id: body.id
        },
        data: {
            deleted: true
        }
    })

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

    await prisma.itemPricing.deleteMany({
        where: {
            purchaseId: body.id
        }
    })

    await prisma.allocation.deleteMany({
        where: {
            purchaseId: body.id
        }
    })

    await prisma.purchase.update({
        where: {
            id: body.id
        },
        data: {
            taxes: Number(body.taxes),
            shippingCost: Number(body.shippingCost),
            deliveryContacts: {
                create: {
                    name: body.deliveryContactName,
                    phone: body.deliveryContactPhone,
                    address: body.deliveryContactAddress,
                    comment: body.deliveryContactComment
                }
            },
            vendor: {
                connect: {
                    id: Number(body.vendor)
                }
            },
            items: {
                createMany: {
                    data: body.tablePrice.map((item: any) => {
                        return {
                            itemNumber: item.itemNumber,
                            description: item.description,
                            quantity: Number(item.quantity),
                            unitPrice: Number(item.unitPrice),
                            gLCodeId: Number(item.glCode)
                        }
                    })
                }
            },
            allocation: {
                createMany: {
                    data: body.tableDepartment.map((item: any) => {
                        return {
                            pourcentage: Number(item.allocation),
                            amount: Number(item.amount),
                            departmentId: Number(item.department)
                        }
                    })
                }
            },
            submittedAt: body.status === 'Draft' ? null : new Date(),
            status: body.status
        }
    })

    return Response.json({})
}

export async function POST(request: Request) {
    const body = await request.json();
    const token = tokenParse(request);

    if (!token) {
        return Response.json({
            msg: 'Unauthorized'
        }, { status: 401 });
    }

    await prisma.purchase.create({
        data: {
            deleted: false,
            user: {
                connect: {
                    id: token.id
                }
            },
            taxes: Number(body.taxes),
            shippingCost: Number(body.shippingCost),
            deliveryContacts: {
                create: {
                    name: body.deliveryContactName,
                    phone: body.deliveryContactPhone,
                    address: body.deliveryContactAddress,
                    comment: body.deliveryContactComment
                }
            },
            vendor: {
                connect: {
                    id: Number(body.vendor)
                }
            },
            items: {
                createMany: {
                    data: body.tablePrice.map((item: any) => {
                        return {
                            itemNumber: item.itemNumber,
                            description: item.description,
                            quantity: Number(item.quantity),
                            unitPrice: Number(item.unitPrice),
                            gLCodeId: Number(item.glCode)
                        }
                    })
                }
            },
            allocation: {
                createMany: {
                    data: body.tableDepartment.map((item: any) => {
                        return {
                            pourcentage: Number(item.allocation),
                            amount: Number(item.amount),
                            departmentId: Number(item.department)
                        }
                    })
                }
            },
            submittedAt: body.status === 'Draft' ? null : new Date(),
            status: body.status
        }
    })

    return Response.json({})
}
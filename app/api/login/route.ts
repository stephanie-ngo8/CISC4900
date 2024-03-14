import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic' // defaults to auto
const prisma = new PrismaClient();
export async function POST(request: Request) {
    const body = await request.json();
    console.log(body);

    const user = await prisma.user.findMany({
        where: {
            email: body.email,
            deleted: false
        }
    });

    if (!user || user.length === 0) {
        return Response.json({
            msg: 'Invalid credentials'
        }, { status: 401 });
    }

    if (user[0].password !== body.password) {
        return Response.json({
            msg: 'Invalid credentials'
        }, { status: 401 });
    }

    const token = jwt.sign({ id: user[0].id }, 'JSvma1X5Gt');

    console.log(user[0], token);

    return Response.json({
        token: token
    })
}
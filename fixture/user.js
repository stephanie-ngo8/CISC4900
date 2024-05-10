const PrismaClient = require('@prisma/client').PrismaClient;

const prisma = new PrismaClient()

async function user() {
    try {
        await prisma.user.create({
            data: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@gmail.com',
                password: 'password',
                role: 'ADMIN',
            }
        })


    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    user,
}
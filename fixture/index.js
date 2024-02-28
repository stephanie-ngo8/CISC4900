const PrismaClient = require('@prisma/client').PrismaClient;

const prisma = new PrismaClient()

async function main() {
    try {
        await require("./user.js").user();
        console.log("User created");
    } catch (error) {
        console.error(error)
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        await prisma.$disconnect()
        process.exit(1)
    })
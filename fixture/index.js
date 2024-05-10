const PrismaClient = require('@prisma/client').PrismaClient;
const data = require('./localization.json');

const prisma = new PrismaClient()

async function main() {
    try {
        await require("./user.js").user();
        console.log("User created");
        await loadData();
        console.log("Data loaded");
    } catch (error) {
        console.error(error)
    }
}

async function loadData() {
    for (const item of data.Department) {
        await prisma.department.create({
            data: {
                name: item['Account Title'],
                code: item['Account Code']

            }
        })
    }

    for (const item of data.Vendor) {
        await prisma.vendor.create({
            data: {
                name: item['Vendor Name'],
                phone: item['Telephone #'],
                email: item['Email'],
                website: item['Website Ref'],
                contact: item['Contact'],
            }
        })
    }

    for (const item of data.glCode) {
        await prisma.gLCode.create({
            data: {
                name: item['description'],
                code: item['code'],
            }
        })
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
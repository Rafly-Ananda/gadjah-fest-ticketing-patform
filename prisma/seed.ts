import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const ticket1 = await prisma.ticket.upsert({
    where: { id: "" },
    update: {},
    create: {
      name: "Day One Pass",
      type: "Event Pass",
      quantity: 200,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis ex dicta quos id facere illum cum ab debitis libero ad? Nostrum quisquam ab iure magni incidunt ad commodi. Alias, libero!",
      price: 120000,
      published: true,
    },
  });
  const ticket2 = await prisma.ticket.upsert({
    where: { id: "" },
    update: {},
    create: {
      name: "Day Two Pass",
      type: "Event Pass",
      quantity: 200,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis ex dicta quos id facere illum cum ab debitis libero ad? Nostrum quisquam ab iure magni incidunt ad commodi. Alias, libero!",
      price: 120000,
      published: true,
    },
  });
  const ticket3 = await prisma.ticket.upsert({
    where: { id: "" },
    update: {},
    create: {
      name: "Day One and Two Bundle Pass",
      type: "Marathon Pass",
      quantity: 200,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis ex dicta quos id facere illum cum ab debitis libero ad? Nostrum quisquam ab iure magni incidunt ad commodi. Alias, libero!",
      price: 120000,
      published: true,
    },
  });
  const ticket4 = await prisma.ticket.upsert({
    where: { id: "" },
    update: {},
    create: {
      name: "1 Km Marathon Pass",
      type: "Marathon Pass",
      quantity: 200,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis ex dicta quos id facere illum cum ab debitis libero ad? Nostrum quisquam ab iure magni incidunt ad commodi. Alias, libero!",
      price: 120000,
      published: true,
    },
  });
  const ticket5 = await prisma.ticket.upsert({
    where: { id: "" },
    update: {},
    create: {
      name: "10 Km Marathon Pass",
      type: "Marathon Pass",
      quantity: 200,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis ex dicta quos id facere illum cum ab debitis libero ad? Nostrum quisquam ab iure magni incidunt ad commodi. Alias, libero!",
      price: 120000,
      published: true,
    },
  });
  const ticket6 = await prisma.ticket.upsert({
    where: { id: "" },
    update: {},
    create: {
      name: "21 Km Marathon Pass",
      type: "Marathon Pass",
      quantity: 200,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis ex dicta quos id facere illum cum ab debitis libero ad? Nostrum quisquam ab iure magni incidunt ad commodi. Alias, libero!",
      price: 120000,
      published: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

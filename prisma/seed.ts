import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const ticket1 = await prisma.ticket.upsert({
    where: { id: "" },
    update: {},
    create: {
      name: "Day One Pass",
      type: "festival",
      quantity: 200,
      description: "Open Gate, 05:30 | Close Gate, 14:00",
      price: 20000,
      published: true,
    },
  });
  const ticket2 = await prisma.ticket.upsert({
    where: { id: "" },
    update: {},
    create: {
      name: "Day Two Pass",
      type: "festival",
      quantity: 200,
      description: "Open Gate, 05:30 | Close Gate, 14:00",
      price: 20000,
      published: true,
    },
  });
  const ticket3 = await prisma.ticket.upsert({
    where: { id: "" },
    update: {},
    create: {
      name: "Day One and Two Bundle Pass",
      type: "festival",
      quantity: 200,
      description: "Open Gate, 05:30 | Close Gate, 14:00",
      price: 36000,
      published: true,
    },
  });
  const ticket4 = await prisma.ticket.upsert({
    where: { id: "" },
    update: {},
    create: {
      name: "7 Km Marathon Pass",
      type: "marathon",
      quantity: 200,
      description:
        "Jersey, Medali, & Tiket Gadjah Fest (Day Pass, Hari ke-1 dan ke-2)",
      price: 65000,
      published: true,
    },
  });
  const ticket5 = await prisma.ticket.upsert({
    where: { id: "" },
    update: {},
    create: {
      name: "21 Km Marathon Pass",
      type: "marathon",
      quantity: 200,
      description:
        "Jersey, Medali, & Tiket Gadjah Fest (Day Pass, Hari ke-1 dan ke-2)",
      price: 90000,
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

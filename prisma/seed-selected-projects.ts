import { PrismaClient } from "@prisma/client";
import { addSelectedProjects } from "./selected-projects";

const prisma = new PrismaClient();

addSelectedProjects(prisma)
  .then(({ count }) => console.log(`Added ${count} selected projects.`))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

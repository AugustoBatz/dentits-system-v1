import dotenv from "dotenv";
import { app } from "./app";
import { prisma } from "./lib/prisma";

dotenv.config();

const port = Number(process.env.PORT ?? 4000);

async function bootstrap() {
  await prisma.$connect();

  app.listen(port, () => {
    console.log(`Dentis Soft API escuchando en http://localhost:${port}`);
  });
}

void bootstrap();

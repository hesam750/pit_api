import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url : "mysql://root:اثسشئ1375@@localhost:3306/pitstop_db"
    }
  }
});

export default prisma; 
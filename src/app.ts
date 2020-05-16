import { schema, use } from 'nexus';
// import cors from 'cors';
import { PrismaClient } from '@prisma/client'
import { PubSub } from 'graphql-subscriptions';
import { prisma as nexusPrisma } from 'nexus-plugin-prisma';

use(nexusPrisma());

const prisma = new PrismaClient();
const pubsub = new PubSub();
const { JWT_SECRET } = process.env;

schema.addToContext((request) => {
  return {
    request,
    prisma,
    pubsub,
    appSecret: JWT_SECRET,
  };
});

// server.express.use(cors());

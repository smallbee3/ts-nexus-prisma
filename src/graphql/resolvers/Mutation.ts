import { APP_SECRET, getUserId } from '../../utils';
import { compare, hash } from 'bcryptjs';
import { schema } from 'nexus';

import { sign } from 'jsonwebtoken';

schema.inputObjectType({
  name: 'UserInput',
  definition(t) {
    t.string('email', {
      required: true,
    });
    t.string('password', {
      required: true,
    });
    t.string('name');
    t.string('nickname');
    t.string('birthday');
    t.string('gender');
    t.string('phone');
    t.string('statusMessage');
  },
});

schema.mutationType({
  definition(t) {
    t.field('signUp', {
      type: 'AuthPayload',
      args: {
        user: 'UserInput',
      },
      resolve: async (_parent, { user }, ctx) => {
        const { name, email, password } = user;
        const hashedPassword = await hash(password, 10);
        const created = await ctx.prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });
        return {
          token: sign({ userId: created.id }, APP_SECRET),
          user: created,
        };
      },
    });

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: schema.stringArg({ nullable: false }),
        password: schema.stringArg({ nullable: false }),
      },
      resolve: async (_parent, { email, password }, ctx) => {
        const user = await ctx.prisma.user.findOne({
          where: {
            email,
          },
        });
        if (!user) {
          throw new Error(`No user found for email: ${email}`);
        }
        const passwordValid = await compare(password, user.password);
        if (!passwordValid) {
          throw new Error('Invalid password');
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        };
      },
    });

    t.field('createDraft', {
      type: 'Post',
      args: {
        title: schema.stringArg({ nullable: false }),
        content: schema.stringArg(),
      },
      resolve: (parent, { title, content }, ctx) => {
        const userId = getUserId(ctx);
        if (!userId) throw new Error('Could not authenticate user.');
        return ctx.prisma.post.create({
          data: {
            title,
            content,
            published: false,
            user: { connect: { id: userId } },
          },
        });
      },
    });

    t.field('deletePost', {
      type: 'Post',
      nullable: true,
      args: { id: schema.intArg({ nullable: false }) },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.post.delete({
          where: {
            id,
          },
        });
      },
    });

    t.field('publish', {
      type: 'Post',
      nullable: true,
      args: { id: schema.intArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.post.update({
          where: { id },
          data: { published: true },
        });
      },
    });
  },
});

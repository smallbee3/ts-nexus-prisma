import { schema } from 'nexus';

schema.objectType({
  name: 'Post',
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.content();
    t.model.published();
    t.model.user();
    t.model.createdAt();
    t.model.updatedAt();
    t.model.deletedAt();
  },
});

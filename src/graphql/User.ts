import { schema } from 'nexus';

schema.objectType({
  name: 'Profile',
  definition(t) {
    t.model.id();
    t.model.socialId();
    t.model.authType();
    t.model.verified();
  },
});

schema.objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.email();
    t.model.name();
    t.model.nickname();
    t.model.thumbURL();
    t.model.photoURL();
    t.model.birthDay();
    t.model.gender();
    t.model.phone();
    t.model.createdAt();
    t.model.updatedAt();
    t.model.deletedAt();
    t.model.posts({ pagination: false });
    t.model.profile({
      type: 'Profile',
    });
  },
});

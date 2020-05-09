import { asNexusMethod, enumType } from '@nexus/schema';
import { GraphQLDate } from 'graphql-iso-date';
import { GraphQLUpload } from 'graphql-upload';
import { schema } from 'nexus';

schema.enumType({
  name: 'AuthType',
  members: ['Email', 'Facebook', 'Google', 'Apple'],
});

schema.enumType({
  name: 'Gender',
  members: ['Male', 'Female'],
});

export const Upload = GraphQLUpload;
export const DateTime = GraphQLDate;
export const GQLDate = asNexusMethod(GraphQLDate, 'date');
// export const GenderEnum = asNexusMethod(Gender, 'gender');

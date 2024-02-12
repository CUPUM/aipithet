import { createInsertSchema } from 'drizzle-zod';
import { users } from './schema/auth';

export const usersSchema = createInsertSchema(users);

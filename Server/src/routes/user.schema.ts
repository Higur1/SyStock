import { FastifySchema } from "fastify";
import {TypeOf, z} from 'zod'
import {buildJsonSchemas} from 'fastify-zod'

const userInput = {
  name: z.string(),
  user_login: z.string(),
  user_password: z.string(),
  email: z.string(),
  user_type_id: z.number()
} 
const userGenerated = {
    id: z.number()
}

const createUserSchema = z.object({
  ...userInput
});
const userResponseSchema = z.object({
  ...userInput, 
  ...userGenerated
});

const usersResponseSchema = z.array(userResponseSchema);

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const { schemas: userSchemas, $ref} = buildJsonSchemas ({
  createUserSchema,
  userResponseSchema,
  usersResponseSchema
})
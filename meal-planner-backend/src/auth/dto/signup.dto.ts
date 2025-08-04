import { z } from 'zod';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export const signupSchema: z.ZodType<CreateUserDto> = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  picture: z.string().optional(),
  googleId: z.string().optional(),
  isVerified: z.boolean().optional(),
  verificationToken: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  subscription: z.enum(['free', 'premium']).optional(),
});

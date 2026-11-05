import { z } from 'zod';

export const importAssessmentInputSchema = z.object({
  productDescription: z.string().min(3, 'Detailed product description is required'),
  productCategory: z.enum([
    'automotive_spare_parts',
    'electronics_electrical',
    'textiles_clothing',
  ]),
  declaredValue: z.number().positive('Declared value must be greater than 0'),
  valueCurrency: z.string().default('USD'),
  quantity: z.number().int().positive().optional(),
  freightEstimate: z.number().nonnegative().optional().default(0),
  insuranceEstimate: z.number().nonnegative().optional().default(0),
});

export type ImportAssessmentInput = z.infer<typeof importAssessmentInputSchema>;


import { z } from 'zod';

export const releaseConditionSchema = z.object({
  id: z.string().uuid().optional(),
  description: z.string().min(3, 'Condition description is required'),
  type: z.enum(['shipment_proof', 'inspection_passed', 'custom_milestone']),
  satisfied: z.boolean().default(false),
});

export const disputeConditionSchema = z.object({
  id: z.string().uuid().optional(),
  clause: z.string().min(5, 'Dispute clause description is required'),
  allowed_remedies: z.array(z.string()).min(1, 'At least one remedy must be specified'),
});

export const createTradeAgreementSchema = z.object({
  role: z.enum(['buyer', 'supplier']),
  counterpartyEmail: z.string().email('Valid counterparty email required'),
  counterpartyName: z.string().optional(),
  productDescription: z.string().min(5, 'Product description is required'),
  productQuantity: z.number().int().positive('Quantity must be a positive integer'),
  quantityUnit: z.string().min(1).default('units'),
  agreedPrice: z.number().positive('Agreed price must be greater than 0'),
  priceCurrency: z.string().default('USD'),
  paymentAsset: z.string().default('USDC'),
  deliveryTerms: z.string().min(2, 'Delivery terms required (e.g., CIF Lagos, FOB Ningbo)'),
  shippingMethod: z.string().optional(),
  shippingOrigin: z.string().optional(),
  shippingDestination: z.string().optional(),
  inspectionPeriodDays: z.number().int().min(1).max(30).default(7),
  releaseConditions: z.array(releaseConditionSchema).default([
    {
      description: 'Carrier bill of lading and tracking uploaded',
      type: 'shipment_proof',
      satisfied: false,
    },
    {
      description: 'Physical inspection completed without dispute',
      type: 'inspection_passed',
      satisfied: false,
    },
  ]),
  disputeConditions: z.array(disputeConditionSchema).default([
    {
      clause: 'Non-delivery within 14 days of estimated date allows full refund',
      allowed_remedies: ['full_refund', 'shipping_extension'],
    },
    {
      clause: 'Severe quality discrepancy allows partial refund or replacement',
      allowed_remedies: ['partial_refund', 'goods_return'],
    },
  ]),
  additionalTerms: z.string().optional(),
});

export type CreateTradeAgreementInput = z.infer<typeof createTradeAgreementSchema>;


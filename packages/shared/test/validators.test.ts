import test from 'node:test';
import assert from 'node:assert';
import { createTradeAgreementSchema } from '../src/validators/trade.ts';
import { calculateLandedCost } from '../../../services/import-intelligence/rules-engine/engine.ts';

test('createTradeAgreementSchema validates required fields', () => {
  const result = createTradeAgreementSchema.safeParse({
    role: 'buyer',
    counterpartyEmail: 'supplier@china-trade.cn',
    productDescription: 'Toyota Hilux Brake Discs',
    productQuantity: 200,
    agreedPrice: 5000,
    deliveryTerms: 'CIF Lagos',
  });
  assert.strictEqual(result.success, true);
});

test('calculateLandedCost deterministically computes NCS customs duty and VAT', () => {
  const calculation = calculateLandedCost({
    productCategory: 'automotive_spare_parts',
    productValue: 10000,
    freight: 1500,
    insurance: 200,
  });

  assert.strictEqual(calculation.breakdown.fobValue, 10000);
  assert.strictEqual(calculation.breakdown.cifValue, 11700);
  // 10% duty on CIF 11700 = 1170
  assert.strictEqual(calculation.breakdown.customsDuty, 1170);
  // 7% surcharge on 1170 = 81.9
  assert.strictEqual(calculation.breakdown.surcharge, 81.9);
  // 1% CISS on FOB 10000 = 100
  assert.strictEqual(calculation.breakdown.ciss, 100);
  // 0.5% ETLS on CIF 11700 = 58.5
  assert.strictEqual(calculation.breakdown.etls, 58.5);
  assert.ok(calculation.breakdown.totalEstimatedLandedCost > 11700);
});

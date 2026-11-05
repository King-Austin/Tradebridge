# TradeGuard — Product Requirements Document (PRD)

**Product:** TradeGuard  
**Product category:** Trade security, escrow and import intelligence  
**Target market:** Nigerian importers and international suppliers  
**Version:** MVP v1.0  
**Status:** Ready for implementation planning

---

## 1. Product Overview

TradeGuard is a trade-protection platform designed to reduce payment fraud, delivery disputes and cost uncertainty in cross-border transactions.

It provides two primary capabilities:

1. **TradeLock:** A smart-contract-powered escrow system that protects payments between buyers and suppliers.
2. **Import Intelligence:** An AI-assisted import assessment tool that helps Nigerian importers understand product classifications, applicable duties, regulatory requirements and estimated landed costs.

TradeGuard allows buyers to fund transactions using either an existing EVM wallet or a fiat bank-transfer payment flow.

The platform is designed to abstract away blockchain complexity so that users without Web3 experience can participate.

## 2. Problem Statement

Nigerian importers face several challenges:

- Paying suppliers without reliable transaction protection.
- Suppliers receiving payment before fulfilling their obligations.
- Difficulty resolving disagreements over delivery and product quality.
- Uncertainty around customs duties, taxes and regulatory requirements.
- Limited visibility into the actual landed cost of imported goods.
- Technical barriers associated with cryptocurrency wallets and blockchain payments.

TradeGuard addresses these problems through programmable escrow, transparent trade agreements and AI-assisted import intelligence.

## 3. Product Objectives

The MVP must demonstrate that:

1. Buyers and suppliers can create and agree on structured trade agreements.
2. Buyers can fund escrow through either an EVM wallet or fiat payment flow.
3. Funds remain locked until the agreed release conditions are satisfied.
4. Suppliers can submit shipment and delivery evidence.
5. Buyers can accept deliveries or raise disputes.
6. The platform can generate evidence-backed import assessments.
7. Blockchain transactions and trade activities are auditable.

## 4. Target Users and Roles

### Buyer / Importer

- Creates or reviews trade agreements.
- Requests import assessments.
- Funds escrow.
- Tracks supplier fulfilment.
- Inspects delivered goods.
- Accepts delivery or raises disputes.

### Supplier / Exporter

- Receives trade invitations.
- Reviews and accepts trade terms.
- Provides fulfilment information.
- Submits shipment and delivery evidence.
- Receives payment after successful settlement.

A supplier must not be forced to complete full platform registration before reviewing or accepting an invitation.

### Platform Administrator

- Monitors trade activity.
- Reviews flagged transactions.
- Assists with unresolved disputes.
- Maintains platform configuration.
- Reviews suspicious activity and supporting evidence.

Administrators must not have unrestricted authority to withdraw escrow funds.

## 5. Core Product Modules

### Module A: Authentication and User Management

Requirements:

- User registration and login.
- Supabase authentication.
- Buyer and supplier profiles.
- Wallet connection.
- Basic business information.
- Trade activity dashboard.
- Role-based authorization.

Suppliers can access a trade through a secure invitation link without creating a full account.

### Module B: Trade Agreement Management

Either the buyer or supplier can initiate a trade agreement.

However, the buyer must review, approve and fund the agreement before escrow becomes active.

Agreement information includes:

- Buyer and supplier details.
- Product description.
- Product quantity.
- Agreed price and currency.
- Payment asset.
- Delivery terms.
- Shipping information.
- Inspection period.
- Release conditions.
- Supporting documents.
- Dispute conditions.

Requirements:

- Both parties must accept the same agreement version.
- Changes after approval require a new agreement version and renewed acceptance.
- Approved agreement versions must remain auditable.
- Each agreement receives a unique transaction reference.
- A trade cannot become funded until the buyer approves the terms.

### Module C: TradeLock — Smart Contract Escrow

TradeLock is the escrow component of TradeGuard.

**Core workflow:**

1. Trade agreement is approved.
2. Buyer funds the escrow contract.
3. Smart contract locks the deposited tokens.
4. Supplier receives funding confirmation.
5. Supplier fulfils the order.
6. Supplier submits shipment evidence.
7. Buyer inspects the delivery.
8. Buyer accepts or disputes the delivery.
9. Funds are released following the agreed settlement conditions.

Requirements:

- Escrow must be linked to a specific trade agreement.
- Only supported tokens can be deposited.
- The buyer authorizes the escrow deposit.
- The supplier is the designated settlement recipient.
- Deposited funds cannot be withdrawn through ordinary platform administration.
- Disputes block normal settlement.
- Every escrow action must be recorded on-chain.

**Escrow states:**

- Awaiting Buyer Approval
- Awaiting Funding
- Funded
- Awaiting Shipment
- Shipped
- Awaiting Inspection
- Accepted
- Disputed
- Released
- Cancelled, where permitted by the agreement

**Inspection rule:**

When the inspection period expires without buyer action, the trade enters a review state. Expiry must not automatically release funds.

### Module D: Fiat and EVM Wallet Funding

TradeGuard must support two funding methods.

#### Option 1: EVM Wallet Funding

The buyer:

1. Connects an EVM-compatible wallet.
2. Selects USDC or another supported stablecoin.
3. Enters or confirms the escrow amount.
4. Approves the token transaction.
5. Signs the escrow deposit transaction.
6. Receives on-chain funding confirmation.

Supported wallet integrations should include common EVM-compatible wallets.

#### Option 2: Bank Transfer / Fiat Funding

The buyer:

1. Selects bank transfer.
2. Sees the amount payable in NGN.
3. Completes payment through the payment gateway.
4. Backend verifies the payment.
5. An on-ramp provider converts NGN into USDC or USDT.
6. Stablecoins are credited to the buyer's wallet.
7. Buyer authorizes the escrow deposit.

**MVP demonstration flow:**

- Paystack Test API handles simulated NGN payment collection.
- A verified Paystack webhook triggers the demo funding process.
- A controlled backend function mints mock USDC on Base Sepolia to the buyer's test wallet.
- Buyer signs the actual testnet escrow deposit.

This is a simulated conversion, not a real NGN-to-crypto settlement.

**Production requirement:**

The production on-ramp must support NGN collection, stablecoin conversion, Base network settlement, transaction verification and wallet delivery.

Paystack must not be represented as performing crypto conversion unless that capability is independently established.

#### Common Funding Rules

Both funding methods must converge on the same escrow contract.

The buyer must see:

- NGN payment amount, where applicable.
- Stablecoin amount.
- Exchange rate.
- Conversion and network fees.
- Final escrow deposit amount.
- Funding status.

The platform must prevent duplicate payment processing and duplicate escrow deposits.

### Module E: Roqqu Integration

Roqqu is intended to provide an external crypto infrastructure integration.

The integration must be isolated behind a dedicated service adapter.

Potential responsibilities include:

- Wallet infrastructure.
- Supported cryptocurrency transactions.
- Deposit notifications.
- Withdrawal or transfer operations.
- Transaction status verification.

Roqqu's exact supported networks, stablecoin settlement and NGN on-ramp capabilities must be verified before production integration.

For the MVP, the system must remain functional using the test wallet and mock payment adapter even when live Roqqu settlement is unavailable.

### Module F: Shipment and Delivery Management

Suppliers must be able to:

- Update fulfilment status.
- Submit shipment references.
- Upload invoices and shipping documents.
- Provide tracking information.
- Upload delivery evidence.

Buyers must be able to:

- Monitor shipment progress.
- Review submitted evidence.
- Confirm receipt.
- Submit inspection feedback.

Documents must be stored securely.

### Module G: Dispute Management

A buyer can raise a dispute when:

- Goods are not delivered.
- Delivered goods differ materially from the agreement.
- Goods are damaged.
- Quantity is incorrect.
- Supplier breaches agreed conditions.

Dispute workflow:

1. Buyer submits a dispute.
2. Escrow enters a disputed state.
3. Normal release is blocked.
4. Both parties submit evidence.
5. Parties attempt mutual resolution.
6. Administrator may facilitate mediation.
7. A mutually authorized settlement can be executed.

**MVP limitation:** The direct dispute model does not implement a full independent arbitration mechanism. If the parties cannot agree, funds may remain locked pending a valid resolution.

No unrestricted administrator withdrawal function should exist.

### Module H: AI Import Intelligence

This module helps Nigerian importers assess products before committing to an international purchase.

**Initial supported categories:**

- Automotive spare parts.
- Electronics and electrical components.
- Textiles and clothing.

#### Input methods

Users can:

- Enter product descriptions manually.
- Upload supplier invoices.
- Upload product catalogues.
- Enter product quantity and declared value.
- Provide shipping and insurance estimates.

#### AI assessment requirements

The system should:

1. Extract product information from uploaded documents.
2. Normalize product descriptions.
3. Identify candidate HS codes.
4. Ask clarification questions when classification is ambiguous.
5. Identify relevant customs duties and taxes where supported by authoritative sources.
6. Identify applicable regulatory requirements.
7. Calculate estimated landed costs.
8. Present source references.
9. Show confidence and uncertainty.
10. Identify missing information.

#### Landed-cost calculation

The system should account for applicable inputs such as:

- Product value.
- Freight.
- Insurance.
- Customs duty.
- Relevant levies.
- Applicable taxes.
- Other verified import charges.

The calculation must use a deterministic rules engine rather than relying on an LLM to perform financial calculations.

#### Data integrity rules

The AI must not invent:

- HS codes.
- Duty rates.
- Tax rates.
- Regulatory approvals.
- Customs requirements.
- Exchange rates.

Where information cannot be verified, the system must explicitly identify the uncertainty.

Potential authoritative sources include:

- Nigeria National Trade Information Portal.
- Nigeria Customs Service.
- Standards Organisation of Nigeria.
- NAFDAC, where applicable.

The report is an estimate and must not be presented as a binding customs assessment.

## 6. Core User Journey

The main TradeGuard journey is:

1. User registers or logs in.
2. Buyer or supplier initiates a trade.
3. Parties review and approve the agreement.
4. Buyer chooses wallet funding or bank-transfer funding.
5. Buyer funds the escrow.
6. Supplier receives confirmation.
7. Supplier ships the goods.
8. Supplier submits delivery evidence.
9. Buyer inspects the goods.
10. Buyer accepts or raises a dispute.
11. Funds are released following valid settlement conditions.

The import assessment journey can happen before agreement creation or independently.

## 7. Technical Architecture

### Frontend

- Next.js.
- TypeScript.
- Responsive interface.
- Wallet connection integration.
- Trade dashboards.
- Agreement management.
- Import assessment interface.
- Shipment and dispute interfaces.

### Backend and Database

Supabase will provide:

- Authentication.
- PostgreSQL database.
- Row Level Security.
- Edge Functions.
- Realtime updates.
- File storage.

The backend should use a modular architecture with clearly separated business domains.

### Blockchain

- Network: Base Sepolia.
- Smart contract language: Solidity.
- Token standard: ERC-20.
- Escrow contract: TradeLock.
- Test token: Mock USDC.

The contract should support a token abstraction so that additional supported stablecoins can be introduced later.

### Payment

- Paystack Test API for the demo fiat payment flow.
- Mock conversion and token minting for testnet demonstration.
- Production on-ramp provider to be selected after capability verification.

### Crypto Infrastructure

- Roqqu integration adapter.
- Wallet and transaction services.
- Blockchain event monitoring.
- Webhook processing.

### AI

- Document extraction.
- LLM-assisted product classification.
- Source retrieval.
- Deterministic landed-cost calculation.
- Assessment report generation.

Heavy document-processing tasks may run through a separate worker if Supabase Edge Functions are unsuitable.

## 8. Core Database Entities

The database should include:

| Entity | Purpose |
|---|---|
| profiles | User and business profiles |
| wallets | Connected wallet addresses |
| trade_agreements | Trade records |
| agreement_versions | Immutable agreement history |
| trade_participants | Buyer and supplier relationships |
| escrow_records | Escrow contract references and states |
| funding_transactions | Fiat and wallet funding records |
| payment_events | Verified payment webhooks |
| shipment_records | Shipment and fulfilment details |
| delivery_evidence | Supporting delivery documents |
| inspections | Buyer inspection records |
| disputes | Dispute records |
| dispute_evidence | Supporting dispute documents |
| import_assessments | AI assessment records |
| assessment_sources | References used in assessments |
| audit_logs | Important platform activity |

## 9. Security and Trust Requirements

- No buyer private keys stored on the backend.
- Roqqu and Paystack secrets remain server-side.
- Verify payment webhooks and transaction status.
- Enforce Supabase Row Level Security.
- Validate all privileged operations on the backend.
- Never trust frontend payment or escrow status.
- Prevent replayed webhooks and duplicate deposits.
- Secure invitation links with expiring, single-purpose tokens.
- Maintain auditable trade and agreement histories.
- Validate smart contract authorization and settlement conditions.
- Store uploaded documents securely.

## 10. MVP Scope

### Must Have

- Authentication and user profiles.
- Trade agreement creation and acceptance.
- Supplier invitation links.
- Agreement version history.
- Base Sepolia escrow contract.
- EVM wallet funding.
- Paystack test bank-transfer flow.
- Demo-only mock USDC minting.
- Escrow funding and release.
- Shipment evidence submission.
- Inspection and dispute workflows.
- AI import assessment for the three initial product categories.
- Admin monitoring interface.
- Transaction and activity history.

### Not Required for MVP

- Real customer funds.
- Production NGN-to-stablecoin conversion.
- Full international fiat settlement.
- Full independent dispute arbitration.
- Automated customs clearance.
- Direct integration with customs systems.
- Multi-chain deployment.
- Automated freight booking.
- Full supplier marketplace.
- Native mobile applications.

## 11. MVP Acceptance Criteria

The MVP is considered successful when the following demonstration can be completed:

1. A buyer creates a trade agreement.
2. A supplier receives an invitation and accepts it.
3. The buyer funds the trade using an EVM wallet.
4. The buyer can also complete the simulated NGN funding route through Paystack Test.
5. The buyer receives mock USDC in the test wallet after verified test payment.
6. The buyer signs and deposits tokens into escrow.
7. The supplier sees that the trade is funded.
8. The supplier submits shipment evidence.
9. The buyer accepts the delivery.
10. The smart contract releases the escrow funds.
11. A separate test demonstrates that raising a dispute blocks normal release.
12. A buyer submits an invoice or product description and receives an evidence-backed import assessment.

## 12. Key Risks and Dependencies

| Risk | Mitigation |
|---|---|
| Roqqu network compatibility | Verify supported assets and Base settlement before production |
| Fiat-to-crypto conversion | Use a dedicated compliant on-ramp provider |
| Smart contract vulnerabilities | Test thoroughly and obtain an independent security review before production |
| Disputes without arbitration | Clearly document the MVP limitation |
| Incorrect AI classifications | Show alternatives, confidence and source references |
| Fake payment confirmations | Verify server-side webhooks and payment status |
| Supplier non-participation | Use secure invitation links and simple acceptance flows |

## 13. Product Success Metrics

MVP evaluation should track:

- Successful agreement completion rate.
- Successful escrow funding rate.
- Funding verification accuracy.
- Successful escrow settlement rate.
- Dispute creation and resolution rates.
- Import assessment completion rate.
- Percentage of AI assessments with verifiable sources.
- Time required to complete a trade.
- User completion rate for both funding methods.

## 14. Final Product Positioning

**TradeGuard is a trade-protection and import intelligence platform that combines programmable escrow with AI-assisted import cost assessment.**

TradeLock protects the transaction.

Import Intelligence helps the buyer understand the transaction before committing.

The product should prioritize trust, verifiability, simplicity and financial accountability over unnecessary blockchain complexity.
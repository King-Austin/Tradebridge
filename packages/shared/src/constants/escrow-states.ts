import { EscrowStateEnum, EscrowStateString } from '../types/escrow';

export const ESCROW_STATE_INDEX_MAP: Record<EscrowStateEnum, EscrowStateString> = {
  [EscrowStateEnum.AwaitingFunding]: 'AwaitingFunding',
  [EscrowStateEnum.Funded]: 'Funded',
  [EscrowStateEnum.AwaitingShipment]: 'AwaitingShipment',
  [EscrowStateEnum.Shipped]: 'Shipped',
  [EscrowStateEnum.AwaitingInspection]: 'AwaitingInspection',
  [EscrowStateEnum.Accepted]: 'Accepted',
  [EscrowStateEnum.Disputed]: 'Disputed',
  [EscrowStateEnum.Released]: 'Released',
  [EscrowStateEnum.PendingReview]: 'PendingReview',
  [EscrowStateEnum.Cancelled]: 'Cancelled',
};

export const ESCROW_STATE_LABELS: Record<EscrowStateString, string> = {
  AwaitingFunding: 'Awaiting Funding',
  Funded: 'Escrow Funded',
  AwaitingShipment: 'Awaiting Shipment',
  Shipped: 'Shipped',
  AwaitingInspection: 'Awaiting Inspection',
  Accepted: 'Delivery Accepted',
  Disputed: 'In Dispute',
  Released: 'Funds Released',
  PendingReview: 'Under Review',
  Cancelled: 'Cancelled',
};

export const ESCROW_STATE_DESCRIPTIONS: Record<EscrowStateString, string> = {
  AwaitingFunding: 'Buyer must deposit funds into the smart contract escrow.',
  Funded: 'Funds are securely locked in the smart contract. Supplier notified.',
  AwaitingShipment: 'Supplier is preparing goods for dispatch.',
  Shipped: 'Goods have been shipped. Inspection period starts upon delivery.',
  AwaitingInspection: 'Goods delivered. Buyer is inspecting according to agreement.',
  Accepted: 'Buyer accepted delivery. Settlement release authorized.',
  Disputed: 'Dispute raised. Normal fund release is blocked.',
  Released: 'Funds have been transferred to supplier on-chain.',
  PendingReview: 'Inspection window elapsed without action. Escrow frozen for review.',
  Cancelled: 'Trade agreement cancelled prior to funding.',
};


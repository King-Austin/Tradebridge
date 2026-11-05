export type ShipmentStatus = 'preparing' | 'shipped' | 'in_transit' | 'delivered';

export interface ShipmentRecord {
  id: string;
  agreement_id: string;
  supplier_id: string;
  status: ShipmentStatus;
  carrier_name?: string;
  tracking_number?: string;
  shipping_reference?: string;
  estimated_delivery?: string;
  shipped_at?: string;
  delivered_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DeliveryEvidence {
  id: string;
  shipment_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  description?: string;
  uploaded_by: string;
  uploaded_at: string;
}

export type InspectionStatus = 'pending' | 'in_progress' | 'accepted' | 'rejected';

export interface InspectionRecord {
  id: string;
  agreement_id: string;
  buyer_id: string;
  status: InspectionStatus;
  inspection_notes?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}


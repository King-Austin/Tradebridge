import { Badge } from '@/components/ui/badge';
import { TradeStatus } from '@tradeguard/shared';
import { TRADE_STATUS_LABELS } from '@tradeguard/shared';

interface TradeStatusBadgeProps {
  status: TradeStatus;
  className?: string;
}

export function TradeStatusBadge({ status, className }: TradeStatusBadgeProps) {
  const label = TRADE_STATUS_LABELS[status] || status;

  switch (status) {
    case 'approved':
      return <Badge variant="secondary" className={className}>{label}</Badge>;
    case 'funded':
      return <Badge variant="navy" className={className}>{label}</Badge>;
    case 'in_progress':
      return <Badge variant="cargo" className={className}>{label}</Badge>;
    case 'completed':
      return <Badge variant="success" className={className}>{label}</Badge>;
    case 'disputed':
      return <Badge variant="destructive" className={className}>{label}</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className={className}>{label}</Badge>;
    case 'pending_buyer':
    case 'pending_supplier':
      return <Badge variant="warning" className={className}>{label}</Badge>;
    case 'draft':
    default:
      return <Badge variant="outline" className={className}>{label}</Badge>;
  }
}


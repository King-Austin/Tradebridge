import { redirect } from 'next/navigation';

export default function FundPage({ params }: { params: { id: string } }) {
  redirect(`/trades/${params.id}`);
}

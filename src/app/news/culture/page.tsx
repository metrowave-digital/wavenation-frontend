import { redirect } from 'next/navigation';

export default function CultureIndexPage() {
  redirect('/news/culture/trending');
}
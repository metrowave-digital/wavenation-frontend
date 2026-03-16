import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Terisa Griffin Women’s History Month Celebration | WaveNation',
  description:
    'Join WaveNation for a private virtual celebration honoring Terisa Griffin during Women’s History Month.',
}

export default function TerisaPage() {
  redirect('https://www.wavenation.online/events/terisa')
}
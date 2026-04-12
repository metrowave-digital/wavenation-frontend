import { redirect } from 'next/navigation'

export default function MusicHubRoot() {
  // Automatically route base /music traffic to the trending feed
  redirect('/news/music/trending')
}
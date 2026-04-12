import { redirect } from 'next/navigation';

/**
 * Main Film-TV index route.
 * Redirects the user to the 'trending' feed by default.
 */
export default function FilmTVIndexPage() {
  redirect('/news/film-tv/trending');
}
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://wavenation.media';

/**
 * Fetch a single talent profile by their slug.
 * Used for Talent Detail pages (/talent/[slug]).
 */
export async function getTalentBySlug(slug: string) {
  if (!slug) return null;

  try {
    const res = await fetch(
      `${CMS_URL}/api/talent?where[slug][equals]=${slug}&depth=2`,
      {
        next: { revalidate: 300 }, // Cache for 5 mins
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    
    if (!data.docs || data.docs.length === 0) return null;
    
    return data.docs[0];
  } catch (err) {
    console.error("Talent API Service Error (Slug):", err);
    return null;
  }
}

/**
 * Fetch the entire talent roster.
 * Used for the main Talent Roster page (/talent).
 */
export async function getTalentRoster() {
  try {
    // We set limit=100 to ensure we don't accidentally paginate the team list
    const res = await fetch(
      `${CMS_URL}/api/talent?limit=100&depth=2&sort=displayName`,
      {
        next: { revalidate: 300 }, 
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();

    // We return the full 'docs' array for the grid
    return data.docs || [];
  } catch (err) {
    console.error("Talent API Service Error (Roster):", err);
    return [];
  }
}
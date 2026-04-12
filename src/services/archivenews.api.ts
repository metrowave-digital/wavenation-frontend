import type { Category, Author, Tag } from '@/app/news/news.types';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'https://wavenation.media';

export async function getArchiveData() {
  try {
    const [categoriesRes, tagsRes, authorsRes] = await Promise.all([
      fetch(`${CMS_URL}/api/categories?limit=50&sort=name`, { next: { revalidate: 600 } }),
      fetch(`${CMS_URL}/api/tags?limit=100&sort=label`, { next: { revalidate: 600 } }),
      fetch(`${CMS_URL}/api/authors?limit=50&sort=fullName`, { next: { revalidate: 600 } })
    ]);

    const categories = await categoriesRes.json();
    const tags = await tagsRes.json();
    const authors = await authorsRes.json();

    return {
      categories: categories.docs || [],
      tags: tags.docs || [],
      authors: authors.docs || []
    };
  } catch (err) {
    console.error("Archive Data Fetch Error:", err);
    return { categories: [], tags: [], authors: [] };
  }
}
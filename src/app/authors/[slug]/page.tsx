import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAuthorBySlug, getArticlesByAuthor } from '@/services/authors.api'
import type { Author, NewsArticle } from '@/app/news/news.types' // Import your types
import styles from '../AuthorsPage.module.css'

// Define types for the CMS Rich Text structure to clear bio errors
interface RichTextNode {
  type?: string;
  text?: string;
  children?: RichTextNode[];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) return { title: 'Author Not Found' }
  return { title: `${author.fullName} | WaveNation` }
}

export default async function AuthorProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) notFound()

  const articles: NewsArticle[] = await getArticlesByAuthor(author.id)

  // Clear ESLint errors by using the RichTextNode interface
  const bioText = author.bio?.root?.children
    ?.filter((p: RichTextNode) => p.type === 'paragraph')
    ?.map((p: RichTextNode) => p.children?.map((n: RichTextNode) => n.text).join(''))
    ?.join(' ')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className={styles.page}>
      <div className={styles.textureOverlay} />
      <main className={styles.main}>
        
        {/* AUTHOR HERO */}
        <section className={styles.authorHero}>
          <div className={styles.heroAvatarWrapper}>
            {author.avatar?.url ? (
              <Image src={author.avatar.url} alt={author.fullName} fill className={styles.heroAvatarImg} />
            ) : (
              <div className={styles.heroAvatarPlaceholder}>{author.fullName.charAt(0)}</div>
            )}
            <div className={styles.scanlines} />
          </div>
          <div className={styles.heroInfo}>
            <span className={styles.heroRole}>{author.role || 'WAVENATION DESK'}</span>
            <h1 className={styles.heroName}>{author.fullName}</h1>
            {bioText && <p className={styles.heroBio}>{bioText}</p>}
            
            {author.socialLinks && author.socialLinks.length > 0 && (
              <div className={styles.socialRow}>
                {author.socialLinks.map(social => (
                  <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                    {social.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* EQ Separator */}
        <div className={styles.eqSeparator}>
          <div className={styles.eqBar} style={{ animationDelay: '0.1s' }}/>
          <div className={styles.eqBar} style={{ animationDelay: '0.3s' }}/>
          <span className={styles.eqText}>LATEST FROM THIS AUTHOR</span>
          <div className={styles.eqBar} style={{ animationDelay: '0.2s' }}/>
          <div className={styles.eqBar} style={{ animationDelay: '0.4s' }}/>
        </div>

        {/* ARTICLES GRID */}
        <div className={styles.articleGrid}>
          {/* Changed 'any' to 'NewsArticle' to clear ESLint error */}
          {articles.map((item: NewsArticle, idx: number) => (
            <Link key={item.id} href={`/news/${item.slug}`} className={styles.contentCard} style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className={styles.cardImageWrapper}>
                {item.hero?.image?.url ? (
                  <Image 
                    src={item.hero.image.sizes?.card?.url || item.hero.image.url} 
                    alt={item.title} 
                    fill 
                    className={styles.cardImg} 
                  />
                ) : <div className={styles.cardPlaceholder} />}
                <div className={styles.cardOverlay}>READ ARTICLE</div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardCategory}>{item.categories?.[0]?.name || 'NEWS'}</span>
                  <span className={styles.cardDate}>{formatDate(item.publishDate)}</span>
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
              </div>
            </Link>
          ))}
          {articles.length === 0 && <p className={styles.emptyState}>No articles published yet.</p>}
        </div>

      </main>
    </div>
  )
}
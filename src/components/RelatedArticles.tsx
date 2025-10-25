import Link from 'next/link'
import { Card } from '@/components/Card'

interface Article {
  title: string
  slug: string
  description: string
  date: string
}

interface RelatedArticlesProps {
  currentArticle: string
  articles: Article[]
}

export function RelatedArticles({ currentArticle, articles }: RelatedArticlesProps) {
  // Filter out current article and get related ones
  const relatedArticles = articles
    .filter(article => article.slug !== currentArticle)
    .slice(0, 3)

  if (relatedArticles.length === 0) return null

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
        Related Articles
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedArticles.map((article) => (
          <Card key={article.slug} className="group relative flex flex-col items-start">
            <Card.Eyebrow decorate>
              <time dateTime={article.date}>
                {new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </Card.Eyebrow>
            <Card.Title as="h3">
              <Link href={`/articles/${article.slug}`}>
                <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:-inset-y-6" />
                <span className="relative z-10">{article.title}</span>
              </Link>
            </Card.Title>
            <Card.Description className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {article.description}
            </Card.Description>
            <Card.Cta>Read article</Card.Cta>
          </Card>
        ))}
      </div>
    </div>
  )
}

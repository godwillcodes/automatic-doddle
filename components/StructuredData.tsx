import { serialize } from '@/lib/seo/graph'

/**
 * One graph, one script tag. The graph is built by lib/seo/graph.ts; this
 * component only renders it.
 */
export default function StructuredData({ graph }: { graph: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(graph) }}
    />
  )
}

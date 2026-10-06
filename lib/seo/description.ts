/**
 * The meta description for an article.
 *
 * The Oct 2026 audit found every post's description between 168 and 239
 * characters: the excerpt was doing double duty as the card summary and the
 * search snippet, and the Studio's length rule was a warning nobody saw.
 * Google cuts at roughly 160, so each result ended mid-sentence.
 *
 * An editor-written metaDescription wins. Otherwise the excerpt is cut at the
 * last sentence end that fits, and only if no sentence fits at all does it
 * fall back to a word boundary with an ellipsis. A description that stops at
 * a full stop reads as finished; one that stops at a comma reads as cut.
 */
export const META_DESCRIPTION_MAX = 160

export function metaDescription(post: { metaDescription?: string; excerpt: string }): string {
  if (post.metaDescription?.trim()) return post.metaDescription.trim()
  const text = post.excerpt.replace(/\s+/g, ' ').trim()
  if (text.length <= META_DESCRIPTION_MAX) return text

  const window = text.slice(0, META_DESCRIPTION_MAX)
  // A sentence end only counts if it leaves a description worth showing. Two
  // excerpts open with a short sentence, and cutting there gave 63 characters
  // against a 160 budget; a 150-character cut with an ellipsis says more.
  const sentenceEnd = Math.max(window.lastIndexOf('. '), window.lastIndexOf('? '), window.lastIndexOf('! '))
  if (sentenceEnd >= 110) return window.slice(0, sentenceEnd + 1)

  const wordEnd = window.lastIndexOf(' ')
  return `${window.slice(0, wordEnd)}…`
}

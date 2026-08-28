import Image from 'next/image'

/**
 * The photographs, as a plate strip under the identity block.
 *
 * Graded to match the rest of the palette rather than dropped in warm: a
 * filter, so the source files are untouched and a better set can replace them
 * without re-editing anything. Colour returns on hover, which is the only
 * decorative move on the page and is what makes it read as a strip of prints
 * rather than a row of avatars.
 *
 * Only the first is eager: it is the one in the viewport, and the rest would
 * otherwise compete with the LCP text for bandwidth on a slow connection.
 */
const PHOTOS = [
  { src: '/header-images/1.jpg', alt: 'Godwill Barasa' },
  { src: '/header-images/2.jpg', alt: 'Godwill Barasa at a technology conference in Nairobi' },
  { src: '/header-images/3.jpg', alt: 'Godwill Barasa' },
  { src: '/header-images/4.jpg', alt: 'Godwill Barasa' },
  { src: '/header-images/5.jpg', alt: 'Godwill Barasa' },
]

export default function HeroGallery() {
  return (
    <div className="rule-t py-6">
      <p className="meta mb-4">Nairobi</p>
      <ul
        className="scrollbar-hide -mx-6 flex gap-3 overflow-x-auto px-6 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0"
        aria-label="Photographs"
      >
        {PHOTOS.map((photo, index) => (
          <li
            key={photo.src}
            className="group relative aspect-square w-40 shrink-0 overflow-hidden bg-paper-2 lg:w-auto"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 18vw, 160px"
              priority={index === 0}
              loading={index === 0 ? undefined : 'lazy'}
              className="object-cover grayscale-[1] contrast-[1.06] brightness-[0.98] transition-[filter,transform] duration-500 ease-[var(--ease-editorial)] group-hover:grayscale-0"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

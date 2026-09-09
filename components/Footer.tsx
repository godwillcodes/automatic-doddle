import { lockAndMercer, site } from '@/lib/site'

/**
 * The footer is an index, not a repeat of the nav: contact first, then four
 * labelled columns with the handle visible on every row. Handles are shown
 * because the audit found six of them scattered across the web — printing
 * the real ones here is part of consolidating the identity.
 *
 * Every profile link carries rel="me". That attribute is the plumbing that
 * lets a crawler tie this page to the profiles and the profiles back to the
 * schema's sameAs — the whole entity case in one hop.
 */

const gh = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="co-footer co-page no-print" id="contact">
      <p className="co-foot-lead">One address. It reaches me, not a studio inbox.</p>
      <a className="co-foot-mail" href={`mailto:${site.author.email}`}>
        {site.author.email} <span className="arw">→</span>
      </a>

      <div className="co-foot-cols">
        <div className="co-foot-col">
          <h4 className="meta mb-3.5">Code</h4>
          <ul>
            <li>
              <a href="https://github.com/godwillcodes" rel="me noopener" target="_blank">
                {gh}
                GitHub <span className="co-handle">@godwillcodes</span>
              </a>
            </li>
            <li>
              <a href="https://dev.to/godwillb" rel="me noopener" target="_blank">
                DEV <span className="co-handle">@godwillb</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="co-foot-col">
          <h4 className="meta mb-3.5">Writing</h4>
          <ul>
            <li>
              <a href="/blog">
                This site <span className="co-handle">field notes</span>
              </a>
            </li>
            <li>
              <a href="https://www.lockandmercer.com/notes" rel="noopener" target="_blank">
                Lock &amp; Mercer notes <span className="co-handle">studio</span>
              </a>
            </li>
            <li>
              <a href="https://iamgodwillb.medium.com/" rel="me noopener" target="_blank">
                Medium <span className="co-handle">archive</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="co-foot-col">
          <h4 className="meta mb-3.5">In person</h4>
          <ul>
            <li>
              <a
                href="https://www.instagram.com/realgodwillbarasa/"
                rel="me noopener"
                target="_blank"
              >
                Instagram <span className="co-handle">@realgodwillbarasa</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/@realgodwillbarasa"
                rel="me noopener"
                target="_blank"
              >
                YouTube <span className="co-handle">@realgodwillbarasa</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/godwillcodes/"
                rel="me noopener"
                target="_blank"
              >
                LinkedIn <span className="co-handle">@godwillcodes</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="co-foot-col">
          <h4 className="meta mb-3.5">Ventures</h4>
          <ul>
            <li>
              <a href={lockAndMercer.teamProfile} rel="me noopener" target="_blank">
                Lock &amp; Mercer <span className="co-handle">studio</span>
              </a>
            </li>
            <li>
              <a href="https://www.spaceyako.com" rel="noopener" target="_blank">
                SpaceYako <span className="co-handle">property</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="co-colophon meta">
        <span>
          © {new Date().getFullYear()} {site.author.name} · Nairobi, Kenya
        </span>
        <span>Built and operated by the person whose name is on it</span>
      </div>
    </footer>
  )
}

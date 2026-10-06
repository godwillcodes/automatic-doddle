import { lockAndMercer, site } from '@/lib/site'
import { DevIcon, GitHubIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from '@/components/icons'

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

export default function Footer() {
  return (
    <footer className="co-footer co-page no-print" id="contact">
      <div className="co-inner">
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
                {GitHubIcon}
                GitHub <span className="co-handle">@godwillcodes</span>
              </a>
            </li>
            <li>
              <a href="https://dev.to/godwillb" rel="me noopener" target="_blank">
                {DevIcon}
                DEV <span className="co-handle">@godwillb</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="co-foot-col">
          <h4 className="meta mb-3.5">Writing</h4>
          <ul>
            <li>
              <a href="/about">
                About <span className="co-handle">the record</span>
              </a>
            </li>
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
                {InstagramIcon}
                Instagram <span className="co-handle">@realgodwillbarasa</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/@realgodwillbarasa"
                rel="me noopener"
                target="_blank"
              >
                {YouTubeIcon}
                YouTube <span className="co-handle">@realgodwillbarasa</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/godwillcodes/"
                rel="me noopener"
                target="_blank"
              >
                {LinkedInIcon}
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
      </div>
    </footer>
  )
}

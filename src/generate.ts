import { notNullish } from '@antfu/utils'
import { parseGitCommit } from 'changelogen'
import { resolveConfig } from './config'
import { getPullRequests, resolveAuthors } from './github'
import { generateMarkdown } from './markdown'
import type { ChangelogOptions, Commit, ResolvedChangelogOptions } from './types'

export async function generate(options: ChangelogOptions) {
  const resolved = await resolveConfig(options)

  const pullRequests = await getPullRequests(resolved)

  const commits = pullRequests.map<Commit | null>(pr => parseGitCommit({
    message: `${pr.title}(#${pr.number})`,
    body: pr.body || '',
    shortHash: pr.merge_commit_sha?.slice(0, 7) || '',
    author: { name: pr.user?.login || '', email: '' },
  }, resolved)).filter(notNullish)

  extractTicketNumber(commits, resolved)

  if (resolved.contributors)
    await resolveAuthors(commits, resolved)
  const md = generateMarkdown(commits, resolved)

  return { config: resolved, md, commits }
}

function extractTicketNumber(commits: Commit[], options: ResolvedChangelogOptions) {
  if (!options.ticketPrefix.length) return

  const ticketRE = new RegExp(`((?:${options.ticketPrefix.join('|')})-\\d+)`, 'gm')
  commits.forEach((c) => {
    c.references = c.references || []
    const ticketSection = c.body.split('#').find(a => a.includes(` ${options.ticketSectionTitle}`))
    let matchs = Array.from(ticketSection
      ?.matchAll(ticketRE) || [])
      .map(m => m[0])
    matchs = [...new Set(matchs)]
    for (const m of matchs) {
      c.references?.push({ type: 'youtrack', value: m })
      c.description = c.description.replace(`(${m})`, '').trim()
    }
  })
}

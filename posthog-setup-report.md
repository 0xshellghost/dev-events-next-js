# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the DevEvent platform. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route events through `/ingest`. A server-side PostHog client was added in `lib/posthog-server.ts` for API route tracking. Five events are now captured across three client components and one API route, covering the full event discovery funnel from homepage CTA through event detail fetch.

| Event Name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the "Explore Events" CTA button on the homepage. | `app/components/Explorebtn.tsx` |
| `event_card_clicked` | User clicks on an event card to view its detail page. | `app/components/EventCard.tsx` |
| `event_detail_viewed` | Server successfully fetches and returns an event by its slug. | `app/api/events/[slug]/route.ts` |
| `event_not_found` | Server returns a 404 because no event matches the requested slug. | `app/api/events/[slug]/route.ts` |
| `create_event_nav_clicked` | User clicks the "Create Event" link in the navigation bar. | `app/components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/486082/dashboard/1761151)
- [Event Discovery Funnel](https://us.posthog.com/project/486082/insights/YkZcpw70)
- [Explore Events Clicks Over Time](https://us.posthog.com/project/486082/insights/U6jJQNvv)
- [Event Cards Clicked Over Time](https://us.posthog.com/project/486082/insights/eLmRHztj)
- [Create Event Intent Over Time](https://us.posthog.com/project/486082/insights/eICbHZWo)
- [Event Not Found (404) Errors Over Time](https://us.posthog.com/project/486082/insights/MqRyLWwM)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any CI/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

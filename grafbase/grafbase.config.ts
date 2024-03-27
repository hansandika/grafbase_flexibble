import { graph, config, connector, auth } from '@grafbase/sdk'

const g = graph.Standalone()

const pg = connector.Postgres('pg', { url: g.env('DATABASE_URL') })
g.datasource(pg)

const jwt = auth.JWT({
  issuer: 'grafbase',
  secret: g.env('NEXTAUTH_SECRET')
});

export default config({
  graph: g,
  auth: {
    providers: [jwt],
    rules: (rules) => rules.private()
  },
  cache: {
    rules: [
      {
        types: ['Query'],
        maxAge: 60,
        staleWhileRevalidate: 60,
      },
    ],
  },
})

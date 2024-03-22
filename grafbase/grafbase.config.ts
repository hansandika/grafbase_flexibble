import { graph, config, connector } from '@grafbase/sdk'

const g = graph.Standalone()

const pg = connector.Postgres('pg', { url: g.env('DATABASE_URL') })
g.datasource(pg)

export default config({
  graph: g,
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

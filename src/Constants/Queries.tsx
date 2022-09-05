// const TABLES = ['workspaces', 'grants', 'grantApplicants']
export type QueryPresetOption = {
  label: string,
  query: string,
}

export const QUERY_PRESET_OPTIONS: QueryPresetOption[] = [
  {
    label: 'all workspaces preset',
    query: `
      query workspaces($first: Int!, $skip: Int!) {
        workspaces(
          subgraphError: allow,
          first: $first,
          skip: $skip,
        ) {
          id
          title
        }
      }
    `,
  },
  {
    label: 'all grants preset',
    query: `
      query grants($first: Int!, $skip: Int!) {
        grants(
          subgraphError: allow,
          first: $first,
          skip: $skip,
        ) {
          id
          title
          workspace {
            id
          }
        }
      }
    `,
  },
  {
    label: 'all grantApplications preset',
    query: `
      query grantApplications($first: Int!, $skip: Int!) {
        grantApplications(
          subgraphError: allow,
          first: $first,
          skip: $skip,
        ) {
          id
          applicantId
          createdAtS
          updatedAtS
          state
          grant {
            id
            workspace {
              id
            }
          }
        }
      }
    `,
  },
  {
    label: 'all fundings preset',
    query: `
      query fundsTransfers($first: Int!, $skip: Int!) {
        fundsTransfers(
          subgraphError: allow,
          first: $first,
          skip: $skip,
          where: {
            application_not: null
          }
        ) {
          id
          application {
            id
          }
          amount
          grant {
            workspace {
              id
            }
            reward {
              asset
            }
          }
          createdAtS
        }
      }
    `,
  }
]
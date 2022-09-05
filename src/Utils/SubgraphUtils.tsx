export const getResultNameFromQuery = (query: string) => {
  return query.trimStart().substring(6).split('(')[0]
}
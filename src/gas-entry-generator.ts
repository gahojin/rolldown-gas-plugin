type Options = {
  comment?: boolean
  autoGlobalExports?: boolean
  exportsIdentifierName?: string
  globalIdentifierName?: string
}

declare module 'gas-entry-generator' {
  function generate(
    outfile: string,
    options?: Options,
  ): {
    entryPointFunctions: string
    globalAssignments: string | undefined
  }
}

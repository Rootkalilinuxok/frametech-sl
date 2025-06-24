/** @type {import('pnpm').Hooks} */
module.exports = {
  hooks: {
    readPackage(pkg) {
      // Sostituisci formidable@1.x con 2.1.1 se possibile
      if (pkg.name === 'formidable') {
        pkg.version = '2.1.1'
      }

      // Esempio: forzare una subdipendenza aggiornata
      if (pkg.dependencies) {
        if (pkg.dependencies['@types/long']) {
          pkg.dependencies['@types/long'] = '^5.2.1'
        }
      }

      return pkg
    },
  },
}

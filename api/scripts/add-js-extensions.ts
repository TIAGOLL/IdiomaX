import { readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { glob } from 'glob'

// Encontrar todos os arquivos TypeScript no projeto
const tsFiles = glob.sync('**/*.ts', {
  ignore: ['node_modules/**', 'dist/**', 'build/**', 'scripts/**'],
  cwd: resolve(__dirname, '..'),
  absolute: true
})

const processFile = (filePath: string) => {
  console.log(`Processando ${filePath}...`)
  const content = readFileSync(filePath, 'utf-8')
  
  // Regex para encontrar importações relativas sem extensão
  const importRegex = /from ['"]([\.\/][^'"]*)['"]/g
  
  // Substituir importações adicionando .js no final
  const newContent = content.replace(importRegex, (match, importPath) => {
    // Não modificar importações que já têm extensão ou são de pacotes
    if (importPath.endsWith('.js') || importPath.endsWith('.ts') || !importPath.startsWith('.')) {
      return match
    }
    return `from '${importPath}.js'`
  })
  
  if (content !== newContent) {
    writeFileSync(filePath, newContent, 'utf-8')
    console.log(`✓ Atualizado ${filePath}`)
  }
}

// Processar cada arquivo
tsFiles.forEach(processFile)
console.log('Concluído!')
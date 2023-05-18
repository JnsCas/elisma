import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'
import { Scaffolding } from '@quorum/elisma/src/domain/bundle/entities/Scaffolding'

export function receiveLanguagePrompt(): string {
  return `te voy a decir en que lenguaje quiero generar mi proyecto, las unicas opciones aceptables son ${Object.values(
    ProjectLanguage
  ).join(' o ')}. Vas a interpretar mi respuesta y me vas a responder usando el siguiente formato JSON:
    {
      "answer": {aca tiene que ir el lenguaje de programacion que elegi}
    }
  `
}

export function receiveNamePrompt(prompt: string): string {
  return `me preguntaron que nombre quiero ponerle a mi proyecto y conteste esto "${prompt}".
  Quiero que contestes en el siguiente formato JSON, cual fue el nombre que elegi para mi proyecto:{"answer": {aca tiene que ir el nombre de mi proyecto que elegi}}`
}

export function nameQuestionPrompt(scaffolding: Scaffolding): string {
  return `
  ahora que ya sabes que quiero utilizar el lenguaje de programacion ${scaffolding.getLanguage},
  me vas a preguntar que nombre le quiero poner a mi proyecto.
  me lo vas a preguntar usando el siguiente formato JSON:
  {
    "question": {aca tiene que ir tu pregunta},
  }`
}

export function requirementsQuestionPrompt(scaffolding: Scaffolding): string {
  return `
  ahora que ya sabes que mi proyecto se va a llamar ${scaffolding.getName},
  me vas a preguntar los requerimientos que quiero para mi proyecto.
  me lo vas a preguntar usando el siguiente formato JSON:
  {
    "question": {aca tiene que ir tu pregunta},
  }`
}

//TODO (jns)
export function generateProjectPrompt(): string {
  return `ahora contestame gracias y despedite`
}

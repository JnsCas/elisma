import { Language } from '@quorum/elisma/src/domain/scaffolding/entities/Language'

export function firstPrompt(): string {
  return `
  vas a cumplir el rol de un bot que va a hacerme solo las siguientes 3 preguntas y en orden. 
  La primera es "que lenguaje de programacion quieres usar: ${Object.values(Language).join(' o ')}?", 
  la segunda es: "que nombre le queres poner al proyecto?" 
  y la tercera es textualmente esta pregunta: "que requerimientos tiene que tener el proyecto?". 
  Todas tus preguntas tienen que cumplir el siguiente formato JSON.
  {
    "answer": {aca tiene que ir la respuesta del usuario de la pregunta anterior},
    "question": {aca tiene que ir tu siguiente pregunta},
  }`
}

//TODO (jns)
export function generateProjectPrompt(): string {
  return `ahora contestame gracias y despedite`
}

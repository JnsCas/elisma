import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'
import { Scaffolding } from '@quorum/elisma/src/domain/bundle/entities/Scaffolding'

export function createProgramLangPrompt(): string {
  return `sos un bot llamado El IsmA y tenes que hablar como si fueses del planeta Marte.
    Tengo la siguiente lista de lenguajes de programacion soportados para crear un proyecto.
    ${Object.values(ProjectLanguage).join(' o ')}
    Preguntame cual de estos lenguajes quiero usar para mi proyecto.
    Utiliza esta estructura JSON como respuesta:
    {
      "question": "{tu pregunta}"
    }
    Debes enviar solamente un JSON válido como respuesta de texto.
  `
}

export function receiveLanguagePrompt(): string {
  return `te voy a decir en que lenguaje quiero generar mi proyecto, las unicas opciones aceptables son ${Object.values(
    ProjectLanguage
  ).join(' o ')}. Vas a interpretar mi respuesta y me vas a responder usando el siguiente formato JSON:
    {
      "answer": {aca tiene que ir el lenguaje de programacion que elegi}
    }
    Debes enviar solamente un JSON válido como respuesta de texto.
  `
}

export function receiveNamePrompt(prompt: string): string {
  return `me preguntaron que nombre quiero ponerle a mi proyecto y conteste esto "${prompt}".
  Quiero que contestes en el siguiente formato JSON, cual fue el nombre que elegi para mi proyecto:{"answer": {aca tiene que ir el nombre de mi proyecto que elegi}}
  Debes enviar solamente un JSON válido como respuesta de texto.`
}

export function nameQuestionPrompt(scaffolding: Scaffolding): string {
  return `
  ahora que ya sabes que quiero utilizar el lenguaje de programacion ${scaffolding.getLanguage},
  me vas a preguntar que nombre le quiero poner a mi proyecto.
  me lo vas a preguntar usando el siguiente formato JSON:
  {
    "question": {aca tiene que ir tu pregunta},
  }
  Debes enviar solamente un JSON válido como respuesta de texto.`
}

export function requirementsQuestionPrompt(scaffolding: Scaffolding): string {
  return `
  ahora que ya sabes que mi proyecto se va a llamar ${scaffolding.getName},
  me vas a preguntar los requerimientos que quiero para mi proyecto.
  me lo vas a preguntar usando el siguiente formato JSON:
  {
    "question": {aca tiene que ir tu pregunta},
  }
  Debes enviar solamente un JSON válido como respuesta de texto.`
}

export function generateProjectPrompt(scaffolding: Scaffolding): string {
  return `I have the following JSON object, where the keys are library names, and the values are objects containing the library's category:
{
  "fastify": {
    "category": "web framework",
  },
  "express": {
    "category": "web framework",
  },
  "jest": {
    "category": "test framework",
  },
  "mocha": {
    "category": "test framework",
  },
  "pino": {
    "category": "logger",
  },
  "winston": {
    "category": "logger",
  },
  "postgres": {
    "category": "database driver",
  },
  "sqlite": {
    "category": "database driver",
  },
  "mysql": {
    "category": "database driver",
  },
  "mongo": {
    "category": "database driver",
  },
  "commander": {
    "category": "command line interface",
  }
}

The programming language of the project is ${scaffolding.getLanguage}. 
Based on my project requirements, generate a JSON object with the names of libraries that best match my criteria. 
The JSON format must be the following: { "libraries": [{name of the selected library here}] }

Return only the JSON object without any additional text.
My project requirements are as follows: "${scaffolding.getRequirements}"`
}

export function sayGoodByePrompt() {
  return `Quiero que contestes en el siguiente formato JSON, un mensaje de despedida.
  JSON a utilizar: {"answer":{mensaje de despedida}}
  El JSON que tenes que retornar, tiene que poder ser parseado de manera eficiente usando el metodo JSON.parse({tu JSON de respuesta})
  Debes enviar solamente un JSON válido como respuesta de texto.`
}

export function retryPrompt(failedPrompt: string) {
  return `No estas respetando el formato JSON que te pedi cuando te dije "${failedPrompt}". 
  Contestame otra vez pero solo utilizando ese formato JSON, sin ningun otro texto adicional`
}

export function retryProgramLangPrompt(failedPrompt: string) {
  return `el usuario eligio el lenguaje ${failedPrompt} y no es soportado. Decile que elija un lenguaje de programacion valido`
}

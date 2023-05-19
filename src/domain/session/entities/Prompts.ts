import { ProjectLanguage } from '@quorum/elisma/src/domain/bundle/entities/ProjectLanguage'
import { Scaffolding } from '@quorum/elisma/src/domain/bundle/entities/Scaffolding'
import { SUPPORTED_LIBRARIES_JSON } from '@quorum/elisma/src/SupportedLibraries'

export function createProgramLangPrompt(): string {
  return `You are going to write a JSON asking me which programming language I want to use for my new project. The only available languages are: ${Object.values(
    ProjectLanguage
  ).join(' and ')}.
  Now consider the following TypeScript Interface for the JSON schema:

interface Response {
    question: string;
}

Write the basics section according to the Response schema. 
On the response, include only the JSON.`
}

export function receiveLanguagePrompt(): string {
  return `I'm going to tell you which programming language I will choose for my new project. The available languages are:${Object.values(
    ProjectLanguage
  ).join(
    ' o '
  )}. I can use acronyms to choose the programming language. If I didn't chose a available language you don't have to pick one of those for me. You will say me which programming language I chose. Write a JSON as response.
Now consider the following TypeScript Interface for the JSON schema:

interface Response {
    answer: string;
}

Write the basics section according to the Response schema. 
On the response, include only the JSON.`
}

export function retryProgramLangPrompt(failedPrompt: string) {
  return `I chose the language ${failedPrompt} and is not valid. You will tell me that choose one of the valid languages. You will write
your response as JSON.
Now consider the following TypeScript Interface for the JSON schema:

interface Response {
    answer: string;
}

Write the basics section according to the Response schema. 
On the response, include only the JSON.`
}

export function nameQuestionPrompt(scaffolding: Scaffolding): string {
  return `
  Now you already know that I want to use the next programming language "${scaffolding.getLanguage}",
You will ask me the name for my new project.
Now consider the following TypeScript Interface for the JSON schema:

interface Response {
    question: string;
}

Write the basics section according to the Response schema. 
On the response, include only the JSON.`
}

export function receiveNamePrompt(prompt: string): string {
  return `You asked me what I want to call my new project and I answer you "${prompt}".
You will tell me only the project name that I chose. You will write your response as JSON.
Now consider the following TypeScript Interface for the JSON schema:

interface Response {
    answer: string;
}

Write the basics section according to the Response schema. 
On the response, include only the JSON.`
}

export function requirementsQuestionPrompt(scaffolding: Scaffolding): string {
  return `
Now you already know that the name of my new project is "${scaffolding.getName}",
You will ask me the requirements that I need for my new project.
Now consider the following TypeScript Interface for the JSON schema:

interface Response {
    question: string;
}

Write the basics section according to the Response schema. 
On the response, include only the JSON.`
}

export function generateProjectPrompt(scaffolding: Scaffolding): string {
  return `I have the following JSON object, where the keys are library names, and the values are objects containing the library's category:

${JSON.stringify(SUPPORTED_LIBRARIES_JSON)}

The programming language of the project is ${scaffolding.getLanguage}. 
Based on my project requirements, generate a JSON object with the names of libraries that best match my criteria. 
The JSON format must be the following: { "libraries": [{name of the selected library here}] }

Return only the JSON object without any additional text.
My project requirements are as follows: "${scaffolding.getRequirements}"`
}

export function sayGoodByePrompt() {
  return `
You will answer with a goodbye message.
You will write your response as JSON.
Now consider the following TypeScript Interface for the JSON schema:

interface Response {
    answer: string;
}

Write the basics section according to the Response schema. 
On the response, include only the JSON.`
}

export function retryPrompt(failedPrompt: string) {
  return `You are not respecting the JSON format that I asked for when I said you ${failedPrompt}.
Answer me again but only using that JSON format, without any other additional text`
}

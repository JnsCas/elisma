import dotenv from 'dotenv'

export default function () {
  if (!process.env.IS_DOCKER) {
    dotenv.config({ path: `${__dirname}/../.env`, debug: true })
    dotenv.config({ path: `${__dirname}/../.env.host`, debug: true, override: true })
  }
}

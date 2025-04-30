import { echo, main3 } from './echo'

const plus = (x: number, y: number): number => x + y
const minus = (x: number, y: number): number => x - y

const main1 = (): void => {
  console.log(echo(`1 + 2 = ${plus(1, 2)}`))
}

const main2 = (): void => {
  console.log(echo(`3 - 1 = ${minus(3, 1)}`))
}

export { main1, main2, main3 }

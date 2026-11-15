import { randomInt } from 'crypto'

export function gerarCodigo6Digitos(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0')
}

export function expiracaoEmHoras(horas: number): string {
  const d = new Date()
  d.setHours(d.getHours() + horas)
  return d.toISOString()
}
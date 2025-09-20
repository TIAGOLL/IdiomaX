import { z } from 'zod';

// Interface para objetos Decimal-like (compatível com Prisma Decimal)
interface DecimalLike {
    toNumber(): number;
    toString(): string;
}

/**
 * Schema customizado para campos Decimal do Prisma
 * Aceita tanto number quanto Decimal e converte automaticamente para number na saída
 */
export const decimalSchema = z
    .union([
        z.number(),
        z.custom<DecimalLike>((val) => {
            // Verifica se é um objeto Decimal do Prisma
            return val && typeof val === 'object' && 'toNumber' in val && typeof val.toNumber === 'function';
        }, { message: 'Deve ser um número ou Decimal válido' })
    ])
    .transform((val) => {
        // Se é Decimal, converte para number
        if (typeof val === 'object' && val && 'toNumber' in val) {
            return (val as DecimalLike).toNumber();
        }
        // Se já é number, retorna como está
        return val as number;
    });

/**
 * Schema para valores monetários (Decimal com 2 casas decimais)
 */
export const monetaryDecimalSchema = (minValue = 0, maxValue = 999999.99) =>
    decimalSchema
        .refine(val => val >= minValue, {
            message: `Valor deve ser maior ou igual a ${minValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
        })
        .refine(val => val <= maxValue, {
            message: `Valor deve ser no máximo ${maxValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
        });

/**
 * Schema para valores inteiros (como carga horária)
 */
export const integerDecimalSchema = (minValue = 1, maxValue = 99999) =>
    decimalSchema
        .refine(val => Number.isInteger(val), {
            message: 'Deve ser um número inteiro'
        })
        .refine(val => val >= minValue, {
            message: `Valor deve ser pelo menos ${minValue}`
        })
        .refine(val => val <= maxValue, {
            message: `Valor deve ter no máximo ${maxValue}`
        });

/**
 * Schema para percentuais (0-100)
 */
export const percentageDecimalSchema = () =>
    decimalSchema
        .refine(val => val >= 0, {
            message: 'Percentual deve ser maior ou igual a 0%'
        })
        .refine(val => val <= 100, {
            message: 'Percentual deve ser no máximo 100%'
        });
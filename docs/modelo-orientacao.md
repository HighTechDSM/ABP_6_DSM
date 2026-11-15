# Modelo de Orientação

## Objetivo

O modelo de orientação representa as orientações fornecidas pelo chatbot ao consumidor após a análise de um fluxo decisório.

A estrutura permite armazenar o conteúdo da orientação, seus próximos passos, observações complementares e a referência ao fluxo decisório responsável pela orientação.

## Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `string` | Sim | Identificador único da orientação. |
| `titulo` | `string` | Sim | Título da orientação apresentada ao consumidor. |
| `conteudo` | `string` | Sim | Conteúdo principal da orientação. |
| `proximosPassos` | `string` | Sim | Próximos passos recomendados ao consumidor. |
| `observacoes` | `string` | Não | Observações ou informações complementares relacionadas à orientação. |
| `fluxoDecisorioId` | `string` | Sim | Identificador do fluxo decisório relacionado à orientação. |

## Relacionamento com o fluxo decisório

Cada orientação deve estar associada a um fluxo decisório por meio do campo `fluxoDecisorioId`.

Essa referência permite identificar qual fluxo foi responsável pela orientação apresentada ao consumidor.

A implementação atual representa esse relacionamento no modelo TypeScript. A criação da relação de banco de dados e sua persistência dependem da definição da infraestrutura de banco prevista na ABP-012.

## Implementação atual

O modelo foi implementado no backend como uma interface TypeScript:

`backend/src/models/orientacao.ts`

A interface atualmente possui os seguintes campos:

- `id`
- `titulo`
- `conteudo`
- `proximosPassos`
- `observacoes`
- `fluxoDecisorioId`

O campo `observacoes` é opcional, enquanto os demais campos são obrigatórios.

## Persistência

A estrutura do modelo já está definida no backend, porém a persistência em banco de dados ainda não foi implementada.

A implementação da persistência deverá ser realizada após a definição da tecnologia e da estrutura de banco de dados da ABP-012.

## Validação

A estrutura foi validada por meio da compilação do backend utilizando o comando:

`npm --prefix backend run build`

A compilação foi concluída sem erros.

## Status da ABP-048

- Modelo de orientação criado: **concluído**
- Campos obrigatórios definidos: **concluído**
- Referência ao fluxo decisório definida no modelo: **concluído**
- Relacionamento real no banco de dados: **pendente da ABP-012**
- Persistência no banco de dados: **pendente da ABP-012**
- Validação da estrutura pela equipe: **pendente de validação da equipe**

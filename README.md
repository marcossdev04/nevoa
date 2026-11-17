# Névoa — Tabacaria Fina

Front-end do e-commerce da Névoa, uma loja de artigos de tabacaria. Nesta fase **tudo é mockado**: não há backend, autenticação nem gateway de pagamento.

## Rodando

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 (tokens da marca em `src/app/globals.css`)
- Motion para as animações

## Identidade

| Cor | Hex | Uso |
| --- | --- | --- |
| Marrom | `#39282C` | fundo |
| Bege | `#F9DF8E` | texto, botões, peças |
| Azul bebê | `#9CB7D3` | destaques e detalhes |

Tipografia: Bodoni Moda (títulos), Yesteryear (assinatura manuscrita) e Jost (interface).

## Páginas

| Rota | O que é |
| --- | --- |
| `/` | Início com a **arara**: peças penduradas num varão, arraste e clique para abrir |
| `/rituais` | **Monte o Ritual**: fila de kits, um em foco, com as peças no painel lateral |
| `/orbita` | **Órbita**: peças flutuando em anel; a da frente dá nome ao título |
| `/loja` | Catálogo com categorias, busca e ordenação |
| `/produto/[slug]` | Página do produto com variações, quantidade e cálculo de frete |
| `/checkout` | Dados, entrega, envio, pagamento (Pix, cartão, boleto) e cupom |
| `/conta` | Tela de login/cadastro (apenas visual) |
| `/sobre` | Institucional |

Globais: verificação de idade (18+), carrinho lateral e visualização rápida do produto.

## Onde ligar o backend

Todo acesso a dados passa por **`src/lib/api.ts`**. Para integrar, troque o corpo das funções por chamadas à sua API:

| Função | Hoje | Depois |
| --- | --- | --- |
| `getProducts`, `getProduct`, `getCategories`, `getRituals` | leem `src/data/products.ts` | catálogo do backend |
| `quoteShipping(cep, subtotal)` | valores fixos simulados | Correios / transportadora |
| `validateCoupon(code)` | cupons fixos (`NEVOA10`, `BEMVINDO`) | regra de cupons do backend |
| `createOrder(input, total)` | gera um número de pedido falso | **gateway de pagamento** + criação do pedido |

Outros pontos:

- **Carrinho**: `src/components/store/StoreProvider.tsx`, salvo em `localStorage`.
- **Login**: `src/components/AccountForm.tsx`, sem autenticação.
- **Verificação de idade**: `src/components/AgeGate.tsx`, salva em `localStorage`. Em produção vale validar a maioridade também no servidor.
- **Preços** são sempre em centavos (`14990` = R$ 149,90).

## Imagens dos produtos

As peças são **ilustrações SVG provisórias** (`src/components/art/ProductArt.tsx`), desenhadas no estilo de rótulo da marca. Para usar fotos reais, preencha o campo `image` do produto e renderize `<Image />` no lugar de `<ProductArt />`. Fotos recortadas (PNG com fundo transparente) preservam o efeito da arara e da órbita.

## Aviso

Venda proibida para menores de 18 anos. Antes de publicar, confira as regras da Anvisa e da legislação brasileira para venda e publicidade de produtos fumígenos pela internet.

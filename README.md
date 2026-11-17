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
| Verde | `#018D3E` | fundo |
| Creme | `#FDF7E6` | texto, botões e cards de produto |
| Vermelho | `#E71506` | etiquetas de preço, selos e destaques |

Os tokens ficam em `src/app/globals.css`. O vermelho não é usado como cor de texto sobre o verde, porque o contraste é baixo.

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

As fotos ficam em `public/produtos/` e são **ilustrativas**: vieram do catálogo público da loja Nova Panda e tiveram o fundo removido (WebP com transparência), o que permite o efeito de peça recortada na arara, nos rituais e na órbita. Nomes e preços dos produtos seguem as fotos, mas descrições, variações e estoque são inventados.

Antes de publicar a loja, troque por fotos próprias ou com autorização de uso do fornecedor. Para cada produto em `src/data/products.ts`:

- `image`: caminho do arquivo em `public/`
- `w` e `h`: dimensões do arquivo em pixels
- `height`: altura relativa da peça na arara e na órbita (um narguilé é mais alto que um cortador)

## Aviso

Venda proibida para menores de 18 anos. Antes de publicar, confira as regras da Anvisa e da legislação brasileira para venda e publicidade de produtos fumígenos pela internet.

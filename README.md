# Névoa — Tabacaria

Front-end da loja Névoa, em Next.js. É uma página única, no modelo "parede de prateleiras": as peças ficam numa parede, e ao tocar em uma a câmera chega perto e a ficha entra por cima.

Nesta fase **tudo é mockado**: não há backend, checkout nem gateway de pagamento.

## Rodando

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Blocos da página

Na ordem em que aparecem (`src/app/page.tsx`):

1. **Faixa de avisos** que troca sozinha (frete, cupom, Pix).
2. **Cabeçalho** fixo com as linhas da loja, submenu, busca, favoritos e sacola.
3. **Herói**: "Feita pra quem" + palavra gigante que troca (enrola, acende, relaxa), com três peças que acendem em sequência.
4. **Letreiro de marcas**, que anda sozinho e acompanha a rolagem.
5. **Compre por ritual**: a seção fica presa na tela e a rolagem move os cartões na horizontal.
6. **Ofertas**: trilho que arrasta com o mouse.
7. **A loja inteira numa parede**: filtros, ordenação, e a câmera que aproxima da peça.
8. **Você viu há pouco** (aparece depois de abrir duas peças).
9. **Loja física**: texto que acende palavra por palavra.
10. **Condições**, **newsletter** e **rodapé**.

Camadas por cima: sacola, favoritos, menu (telas pequenas), busca (tecla `/`) e a verificação de idade.

## Estrutura

| Arquivo | O que é |
| --- | --- |
| `src/data/products.ts` | Catálogo mockado: produtos, linhas, subdivisões e marcas |
| `src/lib/catalog.ts` | Regras da loja (frete grátis, Pix, parcelas, cupom, contatos) e leitura do catálogo |
| `src/lib/home.ts` | Conteúdo editorial: palavras do herói, cartões de categoria, avisos, texto da loja física |
| `src/components/*.tsx` | Marcação dos blocos, renderizada no servidor |
| `src/lib/runtime.ts` | Motor de interações: câmera, filtros, sacola, favoritos, busca, efeitos de rolagem |
| `src/app/globals.css` | Todo o visual. As cores ficam nas variáveis de `:root` |

O `runtime.ts` manipula o DOM diretamente, de propósito: as animações dependem de medir e mover elementos quadro a quadro. Ele é ligado uma vez por `StoreRuntime.tsx`.

## Cores

| Variável | Cor | Uso |
| --- | --- | --- |
| `--deep` / `--wall` | `#17110d` / `#2a2019` | tabaco escuro, o fundo da parede |
| `--ink` / `--paper` | `#f6eee1` / `#f1e7d6` | creme: textos e botões |
| `--liv` / `--led` | `#e3a12c` / `#f6c768` | âmbar: LED das prateleiras, faixa de avisos, destaques |
| `--mute` | `#b8a892` | textos secundários |

## Onde ligar o backend

- **Catálogo**: troque `products` em `src/lib/catalog.ts` por dados da API.
- **Sacola, cupom, frete e totais**: funções `add` e `renderBag` em `src/lib/runtime.ts`. Hoje a sacola vive no `localStorage` e o cupom `BEMVINDO` é fixo.
- **Checkout e pagamento**: o botão "Finalizar compra" só mostra um aviso. O ponto está marcado com `PONTO DE INTEGRAÇÃO` no `runtime.ts`.
- **Newsletter**: também marcada com `PONTO DE INTEGRAÇÃO`.
- **Verificação de idade**: salva no `localStorage`. Em produção, valide a maioridade também no servidor.

## O que é provisório

- **Contatos e endereço** em `STORE` (`src/lib/catalog.ts`) são fictícios: WhatsApp `(00) 00000-0000` e "Rua do Comércio, 000".
- **Fotos** em `public/produtos/` são ilustrativas: vieram do catálogo público de outra loja, tiveram o fundo removido e foram montadas num fundo de estúdio 4:5. Troque por fotos próprias ou autorizadas antes de publicar. Cada produto usa `<id>.webp` (800×1000) e `<id>-p.webp` (240×300).
- **Preços, descontos, opções e estoque** são inventados.
- As páginas de "Ajuda" do rodapé ainda não existem.

## Aviso

Venda proibida para menores de 18 anos. Antes de publicar, confira as regras da Anvisa e da legislação brasileira para venda e publicidade de produtos fumígenos pela internet.

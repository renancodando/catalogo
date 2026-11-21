# Reconstrução e verificação da RNC Web

## Composição

A referência mede 1280 × 720 px. O centro aparente do globo fica próximo de (751, 202), e a linha da água passa por y ≈ 315. A fotografia reconstruída conserva essas relações, as rochas e a iluminação. A margem esquerda ocupa o espaço da antiga ampulheta.

| Elemento | Referência, estimativa de y | Captura final, y |
| --- | ---: | ---: |
| Início do título principal | 99 px | 99 px |
| Faixa de indicadores | 333 px | 333 px |
| Início do catálogo, rótulo | 405 px | 405 px |
| Fileira de placas | 473 px | 475 px |

As medidas da captura usam as caixas de layout no Chromium. A rotação do vidro desloca visualmente suas bordas externas. As imagens documentam a página com os controles e o texto renderizados pelo navegador.

[Captura em 1280 × 720](1280x720.png) · [Captura da página inteira em celular de 390 px](celular.png)

## Comportamento da cena

- O material da corrente usa uma malha orbital de seção variável. As normais da malha orientam a refração, a resposta de Fresnel e os realces das luzes.
- As gotas têm velocidade, gravidade e tempo de vida. Impactos suficientemente fortes geram ondas no piso. O arraste atua no globo e na corrente; as setas e Enter permitem a interação pelo teclado.
- A imagem fornece os detalhes finos do litoral, da esfera e da espuma. As perturbações são procedurais e o ambiente refletido é amostrado em espaço de tela. O sistema não resolve a dinâmica completa de um volume de fluido nem reconstrói superfícies atrás da câmera.
- O reflexo de cada placa é composto a partir da fotografia, da borda e do título, com compressão de perspectiva, ondulação e influência da interação local.
- No celular, a costa vertical e o enquadramento do globo compartilham uma linha de água calculada pela posição da esfera. A fonte e todas as imagens são locais.
- A qualidade gráfica varia com o tempo dos quadros. A malha, a quantidade de gotas e a resolução adaptam-se. A cena pausa em segundo plano e respeita movimento reduzido. Ao abrir o arquivo diretamente ou em navegadores sem WebGL, a água usa Canvas 2D.

## Verificação

Os testes executaram o projeto no Chromium 156 em Linux, com renderização WebGL por software. Foram usados os tamanhos de viewport 320 × 568, 390 × 844, 768 × 1024, 820 × 1180, 1024 × 768, 1280 × 720, 1440 × 900 e 1920 × 1080. A largura do documento correspondeu à do viewport em todos eles.

A verificação percorreu os quatro modelos, as três soluções, os serviços, o painel Sobre, os formulários e o menu de toque. Onze percursos de orçamento verificaram a seleção, a obrigatoriedade do nome e a mensagem preparada para o WhatsApp comercial. O destino foi interceptado durante os testes, sem envio de mensagens. A navegação por teclado incluiu o atalho para o conteúdo, fechamento com Escape e retorno de foco aos cartões.

Quadros sucessivos confirmaram variação na área da esfera com animação e estabilidade com movimento reduzido. A validação cobre o navegador executado e a emulação de tela e toque. Desempenho, vibração e aparência em aparelhos físicos específicos dependem dos respectivos navegadores e GPUs.

## Indicadores e conteúdo

A faixa comunica as quatro categorias, as três soluções, as três frentes de serviço e o atendimento pelo WhatsApp. São informações conferíveis na página. A oferta comercial existente, suas condições e os contatos foram preservados.

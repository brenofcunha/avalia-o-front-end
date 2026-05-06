# Calculadora de IMC

Este diretório contém dois arquivos principais:

- `CalculadoraIMC.jsx`: componente React da calculadora.
- `imc.html`: página pronta para abrir no navegador e testar localmente.

## Como rodar manualmente

### Opção 1: abrir direto no navegador

Esta é a forma mais simples.

1. Abra a pasta `Calculadora de IMC`.
2. Dê dois cliques no arquivo `imc.html`.
3. O navegador abrirá a calculadora de IMC.

## Opção 2: rodar com servidor local

Essa opção é útil quando você prefere acessar pelo navegador com `localhost`.

### Usando Python

1. Abra o terminal na pasta do projeto:

```powershell
cd "c:\Users\Breno\OneDrive\Documentos\GitHub\avalia-o-front-end\Calculadora de IMC"
```

2. Inicie um servidor local:

```powershell
python -m http.server 5500
```

Se necessário, no Windows você também pode usar:

```powershell
py -m http.server 5500
```

3. Abra no navegador:

```text
http://localhost:5500/imc.html
```

4. Para encerrar o servidor, pressione:

```text
Ctrl + C
```

## Observação

O arquivo `imc.html` já carrega React por CDN, então não é necessário instalar dependências para testar a calculadora manualmente.

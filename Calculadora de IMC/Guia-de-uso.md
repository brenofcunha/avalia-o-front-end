# Calculadora de IMC

Este diretorio agora usa o componente React diretamente no navegador:

- `CalculadoraIMC.jsx`: componente React e ponto de montagem da interface.
- `imc.html`: pagina base que carrega React por CDN e importa o `CalculadoraIMC.jsx`.

## Como abrir em localhost

1. Abra o terminal na pasta:

```powershell
cd "c:\Users\Breno\OneDrive\Documentos\GitHub\avalia-o-front-end\Calculadora de IMC"
```

2. Inicie um servidor local:

```powershell
python -m http.server 5500
```

Se preferir, no Windows tambem funciona:

```powershell
py -m http.server 5500
```

3. Abra no navegador:

```text
http://localhost:5500/imc.html
```

4. Para encerrar o servidor:

```text
Ctrl + C
```

## Observacao

O navegador passa a renderizar a aplicacao a partir do arquivo `CalculadoraIMC.jsx`, entao o `localhost` nao depende mais da versao duplicada dentro do HTML.

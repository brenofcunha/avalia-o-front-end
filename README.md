# avalia-o-front-end

Tutorial rápido para iniciar a aplicação localmente.

## 1. Pré-requisitos

- Windows, macOS ou Linux
- Um destes ambientes instalado:
- Python 3 (recomendado para este projeto estático)
- ou Node.js (opcional)

## 2. Abrir a pasta do projeto

No terminal, navegue até a pasta do projeto:

```powershell
cd "c:\Users\Breno\OneDrive\Documentos\GitHub\avalia-o-front-end"
```

## 3. Iniciar servidor local

### Opção A (Python)

```powershell
python -m http.server 5500
```

Se o comando acima não funcionar no Windows, tente:

```powershell
py -m http.server 5500
```

### Opção B (Node.js)

```powershell
npx http-server -p 5500
```

## 4. Abrir no navegador

Acesse:

http://localhost:5500

## 5. Encerrar o servidor

No terminal onde o servidor estiver rodando, pressione:

`Ctrl + C`

## Estrutura principal

- `index.html`
- `destinos.html`
- `style.css`
- `app.js`
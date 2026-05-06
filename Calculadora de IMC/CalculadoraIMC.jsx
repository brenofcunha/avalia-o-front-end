const { useState } = React;

function classificarImc(imc) {
  if (imc < 18.5) {
    return "Abaixo do peso";
  }

  if (imc < 25) {
    return "Peso normal";
  }

  if (imc < 30) {
    return "Sobrepeso";
  }

  if (imc < 35) {
    return "Obesidade grau I";
  }

  if (imc < 40) {
    return "Obesidade grau II";
  }

  return "Obesidade grau III";
}

function CalculadoraIMC() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const pesoNumero = Number(peso);
    const alturaNumero = Number(altura);

    if (!pesoNumero || !alturaNumero || pesoNumero <= 0 || alturaNumero <= 0) {
      setResultado(null);
      setErro("Informe valores válidos para peso e altura.");
      return;
    }

    const imc = pesoNumero / (alturaNumero * alturaNumero);

    setResultado({
      imc: imc.toFixed(2),
      classificacao: classificarImc(imc)
    });
    setErro("");
  };

  const handleLimpar = () => {
    setPeso("");
    setAltura("");
    setResultado(null);
    setErro("");
  };

  return (
    <section style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Calculadora de IMC</h1>
        <p style={styles.subtitle}>
          Digite o peso em quilogramas e a altura em metros.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Peso (kg)
            <input
              type="number"
              step="0.1"
              min="0"
              value={peso}
              onChange={(event) => setPeso(event.target.value)}
              placeholder="Ex.: 72.5"
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Altura (m)
            <input
              type="number"
              step="0.01"
              min="0"
              value={altura}
              onChange={(event) => setAltura(event.target.value)}
              placeholder="Ex.: 1.75"
              style={styles.input}
            />
          </label>

          <div style={styles.actions}>
            <button type="submit" style={styles.primaryButton}>
              Calcular IMC
            </button>
            <button type="button" onClick={handleLimpar} style={styles.secondaryButton}>
              Limpar
            </button>
          </div>
        </form>

        {erro ? <p style={styles.error}>{erro}</p> : null}

        {resultado ? (
          <div style={styles.result}>
            <p style={styles.resultText}>
              Seu IMC é <strong>{resultado.imc}</strong>
            </p>
            <p style={styles.resultText}>
              Classificação: <strong>{resultado.classificacao}</strong>
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "linear-gradient(135deg, #eef6ff 0%, #dcecff 100%)"
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "32px",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0 18px 45px rgba(31, 61, 115, 0.15)",
    fontFamily: '"Segoe UI", sans-serif'
  },
  title: {
    margin: "0 0 8px",
    color: "#16325c",
    fontSize: "1.9rem"
  },
  subtitle: {
    margin: "0 0 24px",
    color: "#4b5d7a",
    lineHeight: 1.5
  },
  form: {
    display: "grid",
    gap: "16px"
  },
  label: {
    display: "grid",
    gap: "8px",
    color: "#16325c",
    fontWeight: 600
  },
  input: {
    border: "1px solid #bfd1ee",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "1rem"
  },
  actions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  },
  primaryButton: {
    border: "none",
    borderRadius: "12px",
    padding: "12px 18px",
    backgroundColor: "#1f5eff",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer"
  },
  secondaryButton: {
    border: "1px solid #b7c8e6",
    borderRadius: "12px",
    padding: "12px 18px",
    backgroundColor: "#ffffff",
    color: "#16325c",
    fontWeight: 700,
    cursor: "pointer"
  },
  error: {
    marginTop: "18px",
    color: "#c62828",
    fontWeight: 600
  },
  result: {
    marginTop: "24px",
    padding: "18px",
    borderRadius: "16px",
    backgroundColor: "#f3f8ff",
    border: "1px solid #d7e4fb"
  },
  resultText: {
    margin: "0 0 8px",
    color: "#16325c"
  }
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<CalculadoraIMC />);

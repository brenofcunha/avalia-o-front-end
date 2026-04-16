document.addEventListener("DOMContentLoaded", () => {
  initDestinationFilters();
  initBudgetCrud();
});

function initDestinationFilters() {
  const checkboxes = Array.from(document.querySelectorAll('input[name="tipo"]'));
  const cards = Array.from(document.querySelectorAll(".card[data-tipo]"));
  const status = document.getElementById("filtro-status");
  const clearButton = document.getElementById("limpar-filtros");

  if (!checkboxes.length || !cards.length || !status) {
    return;
  }

  const applyFilter = () => {
    const selectedTypes = checkboxes.filter((cb) => cb.checked).map((cb) => cb.value);

    cards.forEach((card) => {
      const cardType = card.dataset.tipo;
      const shouldShow = selectedTypes.length === 0 || selectedTypes.includes(cardType);
      card.classList.toggle("is-hidden", !shouldShow);
    });

    const visibleCount = cards.filter((card) => !card.classList.contains("is-hidden")).length;

    if (selectedTypes.length === 0) {
      status.textContent = `Exibindo todos os destinos (${visibleCount}).`;
    } else {
      status.textContent = `Filtro ativo: ${selectedTypes.join(", ")} (${visibleCount} destino(s)).`;
    }
  };

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilter);
  });

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      applyFilter();
    });
  }

  applyFilter();
}

function initBudgetCrud() {
  const form = document.getElementById("budget-form");
  const budgetList = document.getElementById("budget-list");
  const emptyState = document.getElementById("budget-empty");
  const estimate = document.getElementById("estimativa");
  const exportMarkdownButton = document.getElementById("exportar-markdown");
  const markdownStatus = document.getElementById("markdown-status");
  const cancelButton = document.getElementById("cancelar-edicao");
  const idField = document.getElementById("orcamento-id");
  const saveButton = document.getElementById("salvar-orcamento");

  const nome = document.getElementById("nome");
  const email = document.getElementById("email");
  const origem = document.getElementById("origem");
  const destino = document.getElementById("destino");
  const passagens = document.getElementById("passagens");
  const data = document.getElementById("data");
  const mensagem = document.getElementById("mensagem");

  if (
    !form ||
    !budgetList ||
    !emptyState ||
    !estimate ||
    !idField ||
    !saveButton ||
    !nome ||
    !email ||
    !origem ||
    !destino ||
    !passagens ||
    !data ||
    !mensagem
  ) {
    return;
  }

  const storageKey = "horizonteBlueOrcamentos";
  const markdownFileName = "orcamentos-horizonte-blue.md";
  const markdownHandleDbName = "horizonteBlueFileHandles";
  const markdownHandleStoreName = "handles";
  const markdownHandleKey = "orcamentosMarkdownFile";
  const supportsFileSystemAccess = typeof window.showSaveFilePicker === "function";
  let markdownFileHandle = null;

  const fareTable = {
    "São Paulo": {
      Maldivas: 8900,
      Patagônia: 3200,
      "Alpes Suíços": 7600,
      "Fernando de Noronha": 2100,
      "Nepal – Himalaia": 6800,
      "Lapônia Finlandesa": 8200
    },
    "Rio de Janeiro": {
      Maldivas: 9100,
      Patagônia: 3400,
      "Alpes Suíços": 7800,
      "Fernando de Noronha": 2300,
      "Nepal – Himalaia": 7000,
      "Lapônia Finlandesa": 8400
    },
    Brasília: {
      Maldivas: 8600,
      Patagônia: 3600,
      "Alpes Suíços": 7400,
      "Fernando de Noronha": 2500,
      "Nepal – Himalaia": 6600,
      "Lapônia Finlandesa": 8000
    },
    Recife: {
      Maldivas: 7900,
      Patagônia: 3900,
      "Alpes Suíços": 7300,
      "Fernando de Noronha": 1600,
      "Nepal – Himalaia": 6400,
      "Lapônia Finlandesa": 7900
    },
    "Porto Alegre": {
      Maldivas: 9200,
      Patagônia: 3000,
      "Alpes Suíços": 7700,
      "Fernando de Noronha": 2800,
      "Nepal – Himalaia": 7100,
      "Lapônia Finlandesa": 8500
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);

  const getCurrentTotal = () => {
    const originValue = origem.value;
    const destinationValue = destino.value;
    const tickets = Number(passagens.value) || 0;

    if (!originValue || !destinationValue || tickets < 1) {
      return null;
    }

    const unitFare = fareTable[originValue]?.[destinationValue];

    if (!unitFare) {
      return null;
    }

    return {
      unitFare,
      total: unitFare * tickets
    };
  };

  const updateEstimate = () => {
    const result = getCurrentTotal();

    if (!result) {
      estimate.textContent = "Selecione origem, destino e quantidade para calcular o custo.";
      return;
    }

    estimate.textContent = `Valor por passagem: ${formatCurrency(result.unitFare)} | Total: ${formatCurrency(result.total)}`;
  };

  const readBudgets = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  };

  const saveBudgets = (budgets) => {
    localStorage.setItem(storageKey, JSON.stringify(budgets));
  };

  const escapeMarkdownCell = (value) =>
    String(value ?? "")
      .replace(/\|/g, "\\|")
      .replace(/\n/g, "<br>");

  const buildBudgetsMarkdown = (budgets) => {
    const createdAt = new Date().toLocaleString("pt-BR");

    const lines = [
      "# Orçamentos - Horizonte Blue",
      "",
      `Gerado em: ${createdAt}`,
      "",
      "| Cliente | E-mail | Origem | Destino | Passagens | Data | Valor Unitário | Custo Total | Mensagem |",
      "| --- | --- | --- | --- | ---: | --- | ---: | ---: | --- |"
    ];

    budgets.forEach((item) => {
      lines.push(
        `| ${escapeMarkdownCell(item.nome)} | ${escapeMarkdownCell(item.email)} | ${escapeMarkdownCell(item.origem)} | ${escapeMarkdownCell(item.destino)} | ${escapeMarkdownCell(item.passagens)} | ${escapeMarkdownCell(item.data)} | ${escapeMarkdownCell(formatCurrency(item.unitFare))} | ${escapeMarkdownCell(formatCurrency(item.total))} | ${escapeMarkdownCell(item.mensagem)} |`
      );
    });

    lines.push("");
    return lines.join("\n");
  };

  const downloadMarkdown = (content) => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = markdownFileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const openHandleDb = () =>
    new Promise((resolve, reject) => {
      const request = indexedDB.open(markdownHandleDbName, 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(markdownHandleStoreName)) {
          db.createObjectStore(markdownHandleStoreName);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

  const readSavedHandle = async () => {
    if (!supportsFileSystemAccess) {
      return null;
    }

    if (markdownFileHandle) {
      return markdownFileHandle;
    }

    try {
      const db = await openHandleDb();

      const result = await new Promise((resolve, reject) => {
        const tx = db.transaction(markdownHandleStoreName, "readonly");
        const store = tx.objectStore(markdownHandleStoreName);
        const request = store.get(markdownHandleKey);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });

      db.close();
      markdownFileHandle = result;
      return result;
    } catch (error) {
      return null;
    }
  };

  const saveHandleReference = async (handle) => {
    if (!supportsFileSystemAccess || !handle) {
      return;
    }

    try {
      const db = await openHandleDb();

      await new Promise((resolve, reject) => {
        const tx = db.transaction(markdownHandleStoreName, "readwrite");
        const store = tx.objectStore(markdownHandleStoreName);
        const request = store.put(handle, markdownHandleKey);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      db.close();
    } catch (error) {
      // Falha ao persistir a referência não impede o restante do fluxo.
    }
  };

  const ensureWritePermission = async (handle) => {
    try {
      if ((await handle.queryPermission({ mode: "readwrite" })) === "granted") {
        return true;
      }

      if ((await handle.requestPermission({ mode: "readwrite" })) === "granted") {
        return true;
      }
    } catch (error) {
      return false;
    }

    return false;
  };

  const requestMarkdownHandle = async () => {
    if (!supportsFileSystemAccess) {
      return null;
    }

    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: markdownFileName,
        types: [
          {
            description: "Arquivo Markdown",
            accept: {
              "text/markdown": [".md"]
            }
          }
        ]
      });

      markdownFileHandle = handle;
      await saveHandleReference(handle);
      return handle;
    } catch (error) {
      return null;
    }
  };

  const writeMarkdownToLocalFile = async (content, { allowPicker }) => {
    if (!supportsFileSystemAccess) {
      return false;
    }

    let handle = await readSavedHandle();

    if (!handle && allowPicker) {
      handle = await requestMarkdownHandle();
    }

    if (!handle) {
      return false;
    }

    const canWrite = await ensureWritePermission(handle);
    if (!canWrite) {
      return false;
    }

    try {
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      markdownFileHandle = handle;
      return true;
    } catch (error) {
      return false;
    }
  };

  const exportBudgetsToMarkdown = async ({ allowPicker = false, fallbackToDownload = true } = {}) => {
    const budgets = readBudgets();

    if (!budgets.length) {
      if (markdownStatus) {
        markdownStatus.textContent = "Nenhum orçamento cadastrado para exportar.";
      }
      return;
    }

    const markdown = buildBudgetsMarkdown(budgets);
    const writtenToLocalFile = await writeMarkdownToLocalFile(markdown, { allowPicker });

    if (writtenToLocalFile) {
      if (markdownStatus) {
        markdownStatus.textContent = `Arquivo local ${markdownFileName} salvo automaticamente com ${budgets.length} orçamento(s).`;
      }
      return;
    }

    if (fallbackToDownload) {
      downloadMarkdown(markdown);
      if (markdownStatus) {
        markdownStatus.textContent = `Arquivo ${markdownFileName} baixado com ${budgets.length} orçamento(s).`;
      }
      return;
    }

    if (markdownStatus) {
      markdownStatus.textContent = "Não foi possível salvar automaticamente. Clique em exportar para escolher o arquivo .md.";
    }
  };

  const setEditingMode = (isEditing) => {
    saveButton.textContent = isEditing ? "Atualizar Orçamento" : "Finalizar Pedido";
    if (cancelButton) {
      cancelButton.style.display = isEditing ? "inline-flex" : "none";
    }
  };

  const clearForm = () => {
    form.reset();
    idField.value = "";
    passagens.value = "1";
    setEditingMode(false);
    updateEstimate();
  };

  const renderBudgets = () => {
    const budgets = readBudgets();
    budgetList.innerHTML = "";

    if (!budgets.length) {
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";

    budgets.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.nome}</td>
        <td>${item.origem}</td>
        <td>${item.destino}</td>
        <td>${item.passagens}</td>
        <td>${item.data}</td>
        <td>${formatCurrency(item.total)}</td>
        <td class="actions-cell">
          <button type="button" class="btn-table" data-action="edit" data-id="${item.id}">Editar</button>
          <button type="button" class="btn-table danger" data-action="delete" data-id="${item.id}">Excluir</button>
        </td>
      `;
      budgetList.appendChild(row);
    });
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const calc = getCurrentTotal();
    if (!calc) {
      estimate.textContent = "Não foi possível calcular o custo com os dados informados.";
      return;
    }

    const budgets = readBudgets();
    const editingId = idField.value;

    const payload = {
      id: editingId || String(Date.now()),
      nome: nome.value.trim(),
      email: email.value.trim(),
      origem: origem.value,
      destino: destino.value,
      passagens: Number(passagens.value),
      data: data.value,
      mensagem: mensagem.value.trim(),
      unitFare: calc.unitFare,
      total: calc.total
    };

    if (editingId) {
      const index = budgets.findIndex((item) => item.id === editingId);
      if (index >= 0) {
        budgets[index] = payload;
      }
    } else {
      budgets.push(payload);
    }

    saveBudgets(budgets);
    renderBudgets();
    await exportBudgetsToMarkdown({ allowPicker: true, fallbackToDownload: true });
    clearForm();
  });

  budgetList.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    const action = target.dataset.action;
    const id = target.dataset.id;

    if (!action || !id) {
      return;
    }

    const budgets = readBudgets();
    const selected = budgets.find((item) => item.id === id);

    if (!selected) {
      return;
    }

    if (action === "delete") {
      const updated = budgets.filter((item) => item.id !== id);
      saveBudgets(updated);
      renderBudgets();
      await exportBudgetsToMarkdown({ allowPicker: false, fallbackToDownload: true });
      return;
    }

    if (action === "edit") {
      idField.value = selected.id;
      nome.value = selected.nome;
      email.value = selected.email;
      origem.value = selected.origem;
      destino.value = selected.destino;
      passagens.value = String(selected.passagens);
      data.value = selected.data;
      mensagem.value = selected.mensagem;
      setEditingMode(true);
      updateEstimate();
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      clearForm();
    });
  }

  if (exportMarkdownButton) {
    exportMarkdownButton.addEventListener("click", async () => {
      await exportBudgetsToMarkdown({ allowPicker: true, fallbackToDownload: true });
    });
  }

  if (markdownStatus && !supportsFileSystemAccess) {
    markdownStatus.textContent = "Seu navegador não suporta gravação automática em arquivo local. O arquivo .md será baixado automaticamente.";
  }

  [origem, destino, passagens].forEach((field) => {
    field.addEventListener("input", updateEstimate);
    field.addEventListener("change", updateEstimate);
  });

  setEditingMode(false);
  renderBudgets();
  updateEstimate();
}

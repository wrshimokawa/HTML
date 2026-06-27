var showModalForm = {
  show: function (title, type, fields, callback) {
    if (title === undefined) title = "Formulário";
    if (type === undefined) type = "question";
    if (fields === undefined) fields = [];

    // 1. Criar Elementos Base
    var overlay = document.createElement("div");
    var modal = document.createElement("div");
    var modalTitle = document.createElement("h2");
    var modalContent = document.createElement("div");

    // Encapsula em um elemento <form> para aproveitar validações nativas do navegador
    var formElement = document.createElement("form");

    var btnContainer = document.createElement("div");
    var btnCancel = document.createElement("button");
    var btnOk = document.createElement("button");

    // Bloqueia a rolagem da página de fundo
    document.body.style.overflow = "hidden";

    // 2. Configuração do Tema Visual (Ícones e Cores)
    var types = {
      info: { icon: "i", color: "#007bff", bg: "#e6f2ff", focus: "#b3d7ff" },
      question: {
        icon: "?",
        color: "#007bff",
        bg: "#e6f2ff",
        focus: "#b3d7ff"
      },
      warning: { icon: "!", color: "#ffc107", bg: "#fff9e6", focus: "#ffeeba" },
      danger: { icon: "×", color: "#dc2626", bg: "#fde8e8", focus: "#f8b4b4" }
    };
    var config = types[type] || types.question;

    // 3. Estilos CSS Embutidos Blindados
    var style = document.createElement("style");
    style.textContent =
      ".custom-form-overlay {" +
      "  position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;" +
      "  width: 100vw !important; height: 100vh !important; background: rgba(0, 0, 0, 0.6) !important;" +
      "  backdrop-filter: blur(2px) !important; z-index: 999999 !important;" +
      "  opacity: 0 !important; transition: opacity 0.2s ease !important; display: block !important;" +
      "}" +
      ".custom-form-overlay.show { opacity: 1 !important; }" +
      ".custom-form-box {" +
      "  position: absolute !important; top: 50% !important; left: 50% !important;" +
      "  transform: translate(-50%, -50%) scale(0.9) !important; background: white !important;" +
      "  padding: 28px !important; border-radius: 12px !important; box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;" +
      "  width: 90% !important; max-width: 500px !important; box-sizing: border-box !important;" +
      "  transition: transform 0.2s ease !important;" +
      "}" +
      ".custom-form-overlay.show .custom-form-box { transform: translate(-50%, -50%) scale(1) !important; }" +
      ".custom-form-box h2 {" +
      "  margin-top: 0 !important; margin-bottom: 20px !important; color: #222 !important;" +
      "  font-family: sans-serif !important; display: flex !important; align-items: center !important; gap: 14px !important;" +
      "}" +
      ".custom-form-icon {" +
      "  display: flex !important; align-items: center !important; justify-content: center !important;" +
      "  width: 36px !important; height: 36px !important; border: 2px solid " +
      config.color +
      " !important;" +
      "  background-color: " +
      config.bg +
      " !important; color: " +
      config.color +
      " !important;" +
      "  border-radius: 50% !important; font-size: 22px !important; font-weight: bold !important; flex-shrink: 0 !important;" +
      "}" +
      ".custom-form-content { margin-bottom: 24px !important; max-height: 60vh !important; overflow-y: auto !important; padding-right: 4px !important; }" +
      ".form-group { margin-bottom: 16px !important; text-align: left !important; font-family: sans-serif !important; }" +
      ".form-group label.main-label { display: block !important; font-size: 14px !important; font-weight: 600 !important; color: #4a5568 !important; margin-bottom: 6px !important; }" +
      ".form-control { width: 100% !important; padding: 10px 14px !important; font-size: 15px !important; border: 1px solid #cbd5e1 !important; border-radius: 6px !important; box-sizing: border-box !important; outline: none !important; transition: border-color 0.15s, box-shadow 0.15s !important; }" +
      ".form-control:focus { border-color: " +
      config.color +
      " !important; box-shadow: 0 0 0 3px " +
      config.focus +
      " !important; }" +
      ".form-control:read-only { background-color: #f8fafc !important; color: #64748b !important; cursor: not-allowed !important; }" +
      ".choice-container { display: flex !important; flex-direction: column !important; gap: 8px !important; padding-top: 4px !important; }" +
      ".choice-item { display: flex !important; align-items: center !important; gap: 8px !important; font-size: 14px !important; color: #334155 !important; cursor: pointer !important; }" +
      ".choice-item input { cursor: pointer !important; width: 16px !important; height: 16px !important; margin: 0 !important; }" +
      ".custom-message { padding: 16px !important; border: 1px solid transparent !important; border-radius: 10px !important; margin-bottom: 16px !important; font-family: sans-serif !important; font-size: 14px !important; line-height: 1.55 !important; }" +
      ".custom-message.info { background: #e6f2ff !important; border-color: #7fb8ff !important; color: #0f4a82 !important; }" +
      ".custom-message.alert { background: #fff7e6 !important; border-color: #ffdc8a !important; color: #7a5a00 !important; }" +
      ".custom-message.error { background: #fde8e8 !important; border-color: #f5a6a6 !important; color: #9b1e1e !important; }" +
      ".custom-message-title { font-weight: 700 !important; margin-bottom: 8px !important; }" +
      ".custom-form-buttons { display: flex !important; justify-content: flex-start !important; gap: 16px !important; }" +
      ".custom-form-btn { padding: 12px 24px !important; border-radius: 6px !important; border: none !important; cursor: pointer !important; font-weight: 600 !important; font-size: 14px !important; font-family: sans-serif !important; transition: background 0.15s ease !important; }" +
      ".btn-ok { background: " +
      config.color +
      " !important; color: white !important; }" +
      ".btn-ok:hover { filter: brightness(0.85) !important; }" +
      ".btn-cancel { background: #eaedf0 !important; color: #4a5568 !important; }" +
      ".btn-cancel:hover { background: #e2e6ea !important; }" +
      ".btn-cancel:focus { outline: 3px solid #cbd5e1 !important; }";

    document.head.appendChild(style);

    // 4. Configurar Atributos de Identificação e Classes
    overlay.className = "custom-form-overlay";
    modal.className = "custom-form-box";
    modalTitle.innerHTML =
      '<span class="custom-form-icon">' +
      config.icon +
      "</span> <span>" +
      title +
      "</span>";
    modalContent.className = "custom-form-content";

    // Impedir submissão real de recarregamento
    formElement.addEventListener("submit", function (e) {
      e.preventDefault();
    });

    var firstInput = null; // Guardará a referência do primeiro campo para auto-foco

    // 5. Loop ES5 de Geração Dinâmica de Campos
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];

      var divGroup = document.createElement("div");
      divGroup.className = "form-group";

      var isMessageTipo = f.tipo === "info" || f.tipo === "alert" || f.tipo === "error";
      if (!isMessageTipo) {
        var label = document.createElement("label");
        label.className = "main-label";
        label.textContent = f.label + (f.required ? " *" : "");
        divGroup.appendChild(label);
      }

      // Tratamento por Tipo de Campo
      if (f.tipo === "select") {
        var select = document.createElement("select");
        select.className = "form-control";
        select.name = f.name;
        if (f.required) select.required = true;
        if (f.readOnly) select.disabled = true; // Selects usam disabled no lugar de readOnly nativo

        if (f.options) {
          for (var j = 0; j < f.options.length; j++) {
            var optData = f.options[j];
            var opt = document.createElement("option");
            opt.value = optData.value;
            opt.textContent = optData.text;
            select.appendChild(opt);
          }
        }
        divGroup.appendChild(select);
        if (!firstInput) firstInput = select;
      } else if (f.tipo === "checkbox" || f.tipo === "radio") {
        var choiceWrapper = document.createElement("div");
        choiceWrapper.className = "choice-container";

        if (f.options) {
          for (var k = 0; k < f.options.length; k++) {
            var choiceData = f.options[k];
            var choiceLabel = document.createElement("label");
            choiceLabel.className = "choice-item";

            var choiceInput = document.createElement("input");
            choiceInput.type = f.tipo;
            choiceInput.name = f.name;
            choiceInput.value = choiceData.value;
            if (f.readOnly) choiceInput.disabled = true;

            // Vincula obrigatoriedade estrutural nativa de validação HTML5
            if (f.required) choiceInput.required = true;

            var labelText = document.createTextNode(" " + choiceData.text);
            choiceLabel.appendChild(choiceInput);
            choiceLabel.appendChild(labelText);
            choiceWrapper.appendChild(choiceLabel);

            if (!firstInput) firstInput = choiceInput;
          }
        }
        divGroup.appendChild(choiceWrapper);
      } else if (f.tipo === "info" || f.tipo === "alert" || f.tipo === "error") {
        var messageContainer = document.createElement("div");
        messageContainer.className = "custom-message " + f.tipo;

        if (f.label) {
          var messageTitle = document.createElement("div");
          messageTitle.className = "custom-message-title";
          messageTitle.textContent = f.label;
          messageContainer.appendChild(messageTitle);
        }

        var messageBody = document.createElement("div");
        messageBody.innerHTML = f.mensagem || f.message || "";
        messageContainer.appendChild(messageBody);
        divGroup.appendChild(messageContainer);
      } else {
        // Tipos Input Padrão: text, number, email, date, etc.
        var input = document.createElement("input");
        input.type = f.tipo || "text";
        input.className = "form-control";
        input.name = f.name;

        if (f.placeholder) input.placeholder = f.placeholder;
        if (f.required) input.required = true;
        if (f.readOnly) input.readOnly = true;

        // Parâmetros numéricos/faixas de valores opcionais

        if (f.min !== undefined) input.min = f.min;
        if (f.max !== undefined) input.max = f.max;
        if (f.step !== undefined) input.step = f.step;
        divGroup.appendChild(input);
        if (!firstInput) firstInput = input;
      }
      formElement.appendChild(divGroup);
    }
    modalContent.appendChild(formElement);
    // 6. Botões de Ação
    btnContainer.className = "custom-form-buttons";
    btnOk.className = "custom-form-btn btn-ok";
    btnOk.textContent = "Confirmar";
    btnCancel.className = "custom-form-btn btn-cancel";
    btnCancel.textContent = "Cancelar";
    // 7. Montagem e Exibição do DOM
    btnContainer.appendChild(btnOk);
    btnContainer.appendChild(btnCancel);
    modal.appendChild(modalTitle);
    modal.appendChild(modalContent);
    modal.appendChild(btnContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    // Foca automaticamente no primeiro elemento capturado
    if (firstInput && typeof firstInput.focus === "function") {
      firstInput.focus();
    }
    setTimeout(function () {
      overlay.classList.add("show");
    }, 25);
    // 8. Extração e Higienização de Dados
    var obterValoresFormulario = function () {
      var dados = {};
      for (var m = 0; m < fields.length; m++) {
        var fieldDef = fields[m];        if (fieldDef.tipo === "info" || fieldDef.tipo === "alert" || fieldDef.tipo === "error") {
          continue;
        }        var nome = fieldDef.name;
        if (fieldDef.tipo === "checkbox") {
          var checkboxes = formElement.querySelectorAll(
            'input[name="' + nome + '"]:checked'
          );
          var valoresMarcados = [];
          for (var c = 0; c < checkboxes.length; c++) {
            valoresMarcados.push(checkboxes[c].value);
          }
          dados[nome] = valoresMarcados;
        } else if (fieldDef.tipo === "radio") {
          var radioMarcado = formElement.querySelector(
            'input[name="' + nome + '"]:checked'
          );
          dados[nome] = radioMarcado ? radioMarcado.value : null;
        } else {
          var elementoComum = formElement.querySelector(
            '[name="' + nome + '"]'
          );
          dados[nome] = elementoComum ? elementoComum.value : "";
        }
      }
      return dados;
    };
    var cleanup = function (success) {
      // Se clicou em confirmar, força o navegador a checar e alertar erros de validação exigidos
      if (success && typeof formElement.reportValidity === "function") {
        if (!formElement.reportValidity()) {
          return; // Aborta encerramento do modal caso falte preenchimentos ou limites numéricos inválidos
        }
      }
      window.removeEventListener("keydown", handleKeyDown);
      overlay.classList.remove("show");
      var outputData = success ? obterValoresFormulario() : null;
      setTimeout(function () {
        overlay.remove();
        style.remove();
        document.body.style.overflow = "";
        if (callback) callback(outputData);
      }, 200);
    };
    var handleKeyDown = function (e) {
      if (e.key === "Escape") {
        e.preventDefault();
        cleanup(false);
      }
    };
    btnOk.addEventListener("click", function () {
      cleanup(true);
    });
    btnCancel.addEventListener("click", function () {
      cleanup(false);
    });
    window.addEventListener("keydown", handleKeyDown);
  }
};
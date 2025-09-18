

function adicionarProfessor() {
    const tbody = document.getElementById('tabelaProfessores');
    const novaLinha = document.createElement('tr');
    novaLinha.className = 'border-b hover:bg-gray-50 transition-colors';
    novaLinha.innerHTML = `
        <td class="px-3 py-3">
            <input type="text" placeholder="Nome do Professor" class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
        </td>
        <td class="px-3 py-3">
            <input type="text" placeholder="Disciplina" class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
        </td>
        <td class="px-3 py-3">
            <select class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                <option value="">Selecionar Turma</option>
                <option value="6º Ano A">6º Ano A</option>
                <option value="6º Ano B">6º Ano B</option>
                <option value="7º Ano A">7º Ano A</option>
                <option value="7º Ano B">7º Ano B</option>
                <option value="8º Ano A">8º Ano A</option>
                <option value="8º Ano B">8º Ano B</option>
                <option value="9º Ano A">9º Ano A</option>
                <option value="9º Ano B">9º Ano B</option>
            </select>
        </td>
        <td class="px-3 py-3 text-center">
            <input type="number" value="22" min="1" max="31" class="w-14 px-1 py-1 border rounded text-center focus:ring-2 focus:ring-blue-500 text-sm" onchange="calcularPresenca(this)">
        </td>
        <td class="px-3 py-3 text-center">
            <div class="flex items-center justify-center gap-1">
                <button onclick="alterarFaltas(this, -1)" class="bg-red-500 hover:bg-red-600 text-white w-5 h-5 rounded text-xs">-</button>
                <input type="number" value="0" min="0" class="w-10 px-1 py-1 border rounded text-center faltas-input text-sm" onchange="calcularPresenca(this)">
                <button onclick="alterarFaltas(this, 1)" class="bg-green-500 hover:bg-green-600 text-white w-5 h-5 rounded text-xs">+</button>
            </div>
        </td>
        <td class="px-3 py-3 text-center">
            <select class="tipo-falta px-1 py-1 border rounded text-xs focus:ring-2 focus:ring-blue-500" onchange="calcularPrazo(this)">
                <option value="">Selecionar</option>
                <option value="simples">Falta Simples</option>
                <option value="atestado">Falta c/ Atestado</option>
            </select>
        </td>
        <td class="px-3 py-3 text-center">
            <span class="prazo-reposicao text-xs font-medium text-gray-600">-</span>
        </td>
        <td class="px-3 py-3 text-center">
            <div class="flex items-center justify-center gap-1">
                <button onclick="alterarReposicoes(this, -1)" class="bg-red-500 hover:bg-red-600 text-white w-5 h-5 rounded text-xs">-</button>
                <input type="number" value="0" min="0" class="w-10 px-1 py-1 border rounded text-center reposicoes-input text-sm" onchange="calcularPresencaComReposicao(this)">
                <button onclick="alterarReposicoes(this, 1)" class="bg-green-500 hover:bg-green-600 text-white w-5 h-5 rounded text-xs">+</button>
            </div>
        </td>
        <td class="px-3 py-3">
            <textarea placeholder="Justificativa..." class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs resize-none" rows="2"></textarea>
        </td>
        <td class="px-3 py-3 text-center">
            <span class="presenca-percent font-semibold text-green-600 text-sm">100%</span>
        </td>
        <td class="px-3 py-3 text-center">
            <span class="status-badge bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Excelente</span>
        </td>
        <td class="px-3 py-3 text-center">
            <button onclick="removerLinha(this)" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">🗑️</button>
        </td>
    `;
    tbody.appendChild(novaLinha);
    calcularEstatisticas();
}

function removerLinha(botao) {
    if (confirm('Tem certeza que deseja remover este professor?')) {
        botao.closest('tr').remove();
        calcularEstatisticas();
    }
}

function alterarFaltas(botao, incremento) {
    const input = botao.parentElement.querySelector('.faltas-input');
    const valorAtual = parseInt(input.value) || 0;
    const novoValor = Math.max(0, valorAtual + incremento);
    input.value = novoValor;
    calcularPresenca(input);
}

function alterarReposicoes(botao, incremento) {
    const input = botao.parentElement.querySelector('.reposicoes-input');
    const valorAtual = parseInt(input.value) || 0;
    const novoValor = Math.max(0, valorAtual + incremento);
    input.value = novoValor;
    calcularPresencaComReposicao(input);
}

function calcularPresenca(elemento) {
    const linha = elemento.closest('tr');
    const reposicoesInput = linha.querySelector('.reposicoes-input');
    if (reposicoesInput) {
        calcularPresencaComReposicao(reposicoesInput);
    } else {
        // Fallback para a lógica antiga se não houver campo de reposição
        const diasLetivos = parseInt(linha.querySelector('input[type="number"]:not(.faltas-input)').value) || 22;
        const faltas = parseInt(linha.querySelector('.faltas-input').value) || 0;
        atualizarLinha(linha, diasLetivos, faltas, 0);
    }
}

function calcularPresencaComReposicao(inputReposicoes) {
    const linha = inputReposicoes.closest('tr');
    const diasLetivosInput = linha.querySelector('input[type="number"]:not(.faltas-input):not(.reposicoes-input)');
    const diasLetivos = parseInt(diasLetivosInput.value) || 22;
    const faltas = parseInt(linha.querySelector('.faltas-input').value) || 0;
    const reposicoes = parseInt(inputReposicoes.value) || 0;
    atualizarLinha(linha, diasLetivos, faltas, reposicoes);
}

function atualizarLinha(linha, diasLetivos, faltas, reposicoes) {
    const faltasEfetivas = Math.max(0, faltas - reposicoes);
    const presenca = diasLetivos > 0 ? Math.max(0, ((diasLetivos - faltasEfetivas) / diasLetivos) * 100) : 0;

    const presencaSpan = linha.querySelector('.presenca-percent');
    const statusSpan = linha.querySelector('.status-badge');

    presencaSpan.textContent = presenca.toFixed(1) + '%';

    if (presenca >= 95) {
        presencaSpan.className = 'presenca-percent font-semibold text-green-600 text-sm';
        statusSpan.className = 'status-badge bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium';
        statusSpan.textContent = 'Excelente';
    } else if (presenca >= 90) {
        presencaSpan.className = 'presenca-percent font-semibold text-blue-600 text-sm';
        statusSpan.className = 'status-badge bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium';
        statusSpan.textContent = 'Bom';
    } else if (presenca >= 80) {
        presencaSpan.className = 'presenca-percent font-semibold text-yellow-600 text-sm';
        statusSpan.className = 'status-badge bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium';
        statusSpan.textContent = 'Regular';
    } else {
        presencaSpan.className = 'presenca-percent font-semibold text-red-600 text-sm';
        statusSpan.className = 'status-badge bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium';
        statusSpan.textContent = 'Atenção';
    }

    linha.style.backgroundColor = reposicoes > 0 ? '#f0f9ff' : '';

    calcularEstatisticas();
}

function calcularPrazo(selectTipo) {
    const linha = selectTipo.closest('tr');
    const prazoSpan = linha.querySelector('.prazo-reposicao');
    const tipoFalta = selectTipo.value;

    if (tipoFalta === 'simples') {
        prazoSpan.textContent = '30 dias';
        prazoSpan.className = 'prazo-reposicao text-xs font-medium text-orange-600';
    } else if (tipoFalta === 'atestado') {
        prazoSpan.textContent = '45 dias';
        prazoSpan.className = 'prazo-reposicao text-xs font-medium text-blue-600';
    } else {
        prazoSpan.textContent = '-';
        prazoSpan.className = 'prazo-reposicao text-xs font-medium text-gray-600';
    }
    calcularEstatisticas();
}

function calcularEstatisticas() {
    const linhas = document.querySelectorAll('#tabelaProfessores tr');
    let totalProfessores = linhas.length;
    let somaPresenca = 0;
    let totalFaltas = 0;
    let faltasSimples = 0;
    let faltasAtestado = 0;
    let aulasRepostas = 0;

    linhas.forEach(linha => {
        const faltas = parseInt(linha.querySelector('.faltas-input')?.value) || 0;
        const presenca = parseFloat(linha.querySelector('.presenca-percent')?.textContent) || 0;
        const reposicoes = parseInt(linha.querySelector('.reposicoes-input')?.value) || 0;
        const tipoFalta = linha.querySelector('.tipo-falta')?.value;

        totalFaltas += faltas;
        somaPresenca += presenca;
        aulasRepostas += reposicoes;

        if (tipoFalta === 'simples') {
            faltasSimples++;
        } else if (tipoFalta === 'atestado') {
            faltasAtestado++;
        }
    });

    const mediaPresenca = totalProfessores > 0 ? (somaPresenca / totalProfessores).toFixed(1) : 0;

    document.getElementById('totalProfessores').textContent = totalProfessores;
    document.getElementById('mediaPresenca').textContent = mediaPresenca + '%';
    document.getElementById('totalFaltas').textContent = totalFaltas;
    document.getElementById('faltasSimples').textContent = faltasSimples;
    document.getElementById('faltasAtestado').textContent = faltasAtestado;
    document.getElementById('aulasRepostas').textContent = aulasRepostas;
}

function limparTabela() {
    if (confirm('Tem certeza que deseja limpar toda a tabela? Esta ação não pode ser desfeita.')) {
        document.getElementById('tabelaProfessores').innerHTML = '';
        adicionarProfessor();
    }
}

function salvarDados() {
    const linhas = document.querySelectorAll('#tabelaProfessores tr');
    const dados = [];
    linhas.forEach(linha => {
        const professor = linha.querySelector('input[placeholder="Nome do Professor"]').value || '';
        const disciplina = linha.querySelector('input[placeholder="Disciplina"]').value || '';
        const turma = linha.querySelector('td:nth-child(3) select').value || '';
        const diasLetivos = linha.querySelector('input[type="number"]:not(.faltas-input):not(.reposicoes-input)').value || '22';
        const faltas = linha.querySelector('.faltas-input').value || '0';
        const tipoFalta = linha.querySelector('.tipo-falta').value || '';
        const aulasRepostas = linha.querySelector('.reposicoes-input').value || '0';
        const justificativa = linha.querySelector('textarea').value || '';
        dados.push({ professor, disciplina, turma, diasLetivos, faltas, tipoFalta, aulasRepostas, justificativa });
    });

    const configuracoes = {
        mesAno: document.getElementById('mesAno').value,
        periodo: document.getElementById('periodo').value
    };

    const dadosCompletos = {
        configuracoes,
        professores: dados,
        dataExportacao: new Date().toLocaleString('pt-BR')
    };

    localStorage.setItem('frequencia_professores_backup', JSON.stringify(dadosCompletos));

    try {
        const jsonString = JSON.stringify(dadosCompletos, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `frequencia_professores_${configuracoes.mesAno.replace('-', '_')}.json`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('✅ Dados salvos com sucesso!\n\n- Arquivo baixado para seu computador\n- Backup salvo no navegador');
    } catch (error) {
        const textarea = document.createElement('textarea');
        textarea.value = JSON.stringify(dadosCompletos, null, 2);
        textarea.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); width:80%; height:60%; z-index:9999; background:white; border:2px solid #333; padding:10px;';
        document.body.appendChild(textarea);
        textarea.select();
        alert('⚠️ Download automático falhou!\n\n- Os dados estão selecionados na tela. Copie (Ctrl+C) e cole em um arquivo .json\n- Backup salvo no navegador');
        setTimeout(() => document.body.removeChild(textarea), 10000);
    }
}

function carregarDados() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = event => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const dadosCompletos = JSON.parse(e.target.result);
                restaurarDados(dadosCompletos);
                const dataImportacao = dadosCompletos.dataExportacao ? `\nDados exportados em: ${dadosCompletos.dataExportacao}` : '';
                alert(`✅ Dados carregados com sucesso!\n${dadosCompletos.professores.length} professor(es) importado(s).${dataImportacao}`);
            } catch (error) {
                alert('❌ Erro ao carregar o arquivo. Verifique se é um arquivo válido.');
                console.error('Erro ao carregar dados:', error);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function restaurarBackup() {
    const backup = localStorage.getItem('frequencia_professores_backup');
    if (!backup) {
        alert('❌ Nenhum backup encontrado no navegador.\n\nDica: Salve os dados primeiro para criar um backup automático.');
        return;
    }
    if (!confirm('🔄 Deseja restaurar o backup salvo no navegador?\n\nIsso substituirá todos os dados atuais.')) {
        return;
    }
    try {
        const dadosCompletos = JSON.parse(backup);
        restaurarDados(dadosCompletos);
        const dataBackup = dadosCompletos.dataExportacao ? `\nBackup de: ${dadosCompletos.dataExportacao}` : '';
        alert(`✅ Backup restaurado com sucesso!\n${dadosCompletos.professores.length} professor(es) carregado(s).${dataBackup}`);
    } catch (error) {
        alert('❌ Erro ao restaurar backup. Os dados podem estar corrompidos.');
        console.error('Erro ao restaurar backup:', error);
    }
}

function restaurarDados(dadosCompletos) {
    if (dadosCompletos.configuracoes) {
        document.getElementById('mesAno').value = dadosCompletos.configuracoes.mesAno || '2024-07';
        document.getElementById('periodo').value = dadosCompletos.configuracoes.periodo || 'Matutino';
    }

    const tbody = document.getElementById('tabelaProfessores');
    tbody.innerHTML = '';

    const professores = dadosCompletos.professores || [];
    if (professores.length === 0) {
        adicionarProfessor();
        return;
    }

    professores.forEach(prof => {
        const novaLinha = document.createElement('tr');
        novaLinha.className = 'border-b hover:bg-gray-50 transition-colors';
        novaLinha.innerHTML = `
            <td class="px-3 py-3"><input type="text" placeholder="Nome do Professor" class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 text-sm" value="${prof.professor || ''}"></td>
            <td class="px-3 py-3"><input type="text" placeholder="Disciplina" class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 text-sm" value="${prof.disciplina || ''}"></td>
            <td class="px-3 py-3">
                <select class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="">Selecionar Turma</option>
                    <option value="6º Ano A" ${prof.turma === '6º Ano A' ? 'selected' : ''}>6º Ano A</option>
                    <option value="6º Ano B" ${prof.turma === '6º Ano B' ? 'selected' : ''}>6º Ano B</option>
                    <option value="7º Ano A" ${prof.turma === '7º Ano A' ? 'selected' : ''}>7º Ano A</option>
                    <option value="7º Ano B" ${prof.turma === '7º Ano B' ? 'selected' : ''}>7º Ano B</option>
                    <option value="8º Ano A" ${prof.turma === '8º Ano A' ? 'selected' : ''}>8º Ano A</option>
                    <option value="8º Ano B" ${prof.turma === '8º Ano B' ? 'selected' : ''}>8º Ano B</option>
                    <option value="9º Ano A" ${prof.turma === '9º Ano A' ? 'selected' : ''}>9º Ano A</option>
                    <option value="9º Ano B" ${prof.turma === '9º Ano B' ? 'selected' : ''}>9º Ano B</option>
                </select>
            </td>
            <td class="px-3 py-3 text-center"><input type="number" value="${prof.diasLetivos || 22}" min="1" max="31" class="w-14 px-1 py-1 border rounded text-center focus:ring-2 focus:ring-blue-500 text-sm" onchange="calcularPresenca(this)"></td>
            <td class="px-3 py-3 text-center">
                <div class="flex items-center justify-center gap-1">
                    <button onclick="alterarFaltas(this, -1)" class="bg-red-500 hover:bg-red-600 text-white w-5 h-5 rounded text-xs">-</button>
                    <input type="number" value="${prof.faltas || 0}" min="0" class="w-10 px-1 py-1 border rounded text-center faltas-input text-sm" onchange="calcularPresenca(this)">
                    <button onclick="alterarFaltas(this, 1)" class="bg-green-500 hover:bg-green-600 text-white w-5 h-5 rounded text-xs">+</button>
                </div>
            </td>
            <td class="px-3 py-3 text-center">
                <select class="tipo-falta px-1 py-1 border rounded text-xs focus:ring-2 focus:ring-blue-500" onchange="calcularPrazo(this)">
                    <option value="">Selecionar</option>
                    <option value="simples" ${prof.tipoFalta === 'simples' ? 'selected' : ''}>Falta Simples</option>
                    <option value="atestado" ${prof.tipoFalta === 'atestado' ? 'selected' : ''}>Falta c/ Atestado</option>
                </select>
            </td>
            <td class="px-3 py-3 text-center"><span class="prazo-reposicao text-xs font-medium text-gray-600">-</span></td>
            <td class="px-3 py-3 text-center">
                <div class="flex items-center justify-center gap-1">
                    <button onclick="alterarReposicoes(this, -1)" class="bg-red-500 hover:bg-red-600 text-white w-5 h-5 rounded text-xs">-</button>
                    <input type="number" value="${prof.aulasRepostas || 0}" min="0" class="w-10 px-1 py-1 border rounded text-center reposicoes-input text-sm" onchange="calcularPresencaComReposicao(this)">
                    <button onclick="alterarReposicoes(this, 1)" class="bg-green-500 hover:bg-green-600 text-white w-5 h-5 rounded text-xs">+</button>
                </div>
            </td>
            <td class="px-3 py-3"><textarea placeholder="Justificativa..." class="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 text-xs resize-none" rows="2">${prof.justificativa || ''}</textarea></td>
            <td class="px-3 py-3 text-center"><span class="presenca-percent font-semibold text-green-600 text-sm">100%</span></td>
            <td class="px-3 py-3 text-center"><span class="status-badge bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Excelente</span></td>
            <td class="px-3 py-3 text-center"><button onclick="removerLinha(this)" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">🗑️</button></td>
        `;
        tbody.appendChild(novaLinha);

        const diasLetivosInput = novaLinha.querySelector('input[type="number"]:not(.faltas-input):not(.reposicoes-input)');
        const faltasInput = novaLinha.querySelector('.faltas-input');
        const reposicoesInput = novaLinha.querySelector('.reposicoes-input');
        const tipoFaltaSelect = novaLinha.querySelector('.tipo-falta');

        atualizarLinha(novaLinha, parseInt(diasLetivosInput.value), parseInt(faltasInput.value), parseInt(reposicoesInput.value));
        calcularPrazo(tipoFaltaSelect);
    });

    calcularEstatisticas();
}
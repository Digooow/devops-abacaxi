const { exec, spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');

const RAIZ = __dirname;
const BACKEND_DIR = path.join(RAIZ, 'abacaxi-backend');
const FRONTEND_DIR = path.join(RAIZ, 'abacaxi-frontend');

const CORES = {
  reset: '\x1b[0m',
  verde: '\x1b[32m',
  amarelo: '\x1b[33m',
  ciano: '\x1b[36m',
  magenta: '\x1b[35m',
  vermelho: '\x1b[31m',
};

const processosAtivos = new Set();
let encerrando = false;
let timerBanco = null;

function log(prefixo, cor, mensagem) {
  const linhas = String(mensagem).replace(/\r\n/g, '\n').split('\n');
  for (const linha of linhas) {
    if (linha.length > 0) {
      console.log(`${cor}[${prefixo}]${CORES.reset} ${linha}`);
    }
  }
}

function executarSincrono(comando, cwd) {
  return spawnSync(comando, {
    cwd,
    shell: true,
    stdio: 'inherit',
  });
}

function garantirEnv(nome, pasta) {
  const envPath = path.join(pasta, '.env');
  const envExamplePath = path.join(pasta, '.env.example');
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    log(nome, CORES.verde, 'Arquivo .env criado a partir de .env.example.');
  }
}

function garantirDependencias(nome, pasta, forcarInstalacao = false) {
  const nodeModulesPath = path.join(pasta, 'node_modules');
  if (forcarInstalacao || !fs.existsSync(nodeModulesPath)) {
    log(nome, CORES.verde, 'Instalando dependências (npm install)...');
    const res = executarSincrono('npm install', pasta);
    if (res.status !== 0) {
      throw new Error(`Falha ao instalar dependências em ${nome}.`);
    }
  }
}

function lerVariaveisEnv(arquivoEnv) {
  const vars = {};
  if (!fs.existsSync(arquivoEnv)) return vars;
  const conteudo = fs.readFileSync(arquivoEnv, 'utf8');
  for (const linhaBruta of conteudo.split(/\r?\n/)) {
    const linha = linhaBruta.trim();
    if (!linha || linha.startsWith('#')) continue;
    const idx = linha.indexOf('=');
    if (idx === -1) continue;
    const chave = linha.slice(0, idx).trim();
    const valor = linha.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    vars[chave] = valor;
  }
  return vars;
}

function portaAberta(host, port, timeoutMs = 800) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    let resolvido = false;
    const concluir = (aberto) => {
      if (resolvido) return;
      resolvido = true;
      socket.destroy();
      resolve(aberto);
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => concluir(true));
    socket.once('timeout', () => concluir(false));
    socket.once('error', () => concluir(false));
  });
}

function dockerDisponivel() {
  return new Promise((resolve) => {
    exec('docker info', { cwd: BACKEND_DIR, timeout: 3000 }, (err) => {
      resolve(!err);
    });
  });
}

function subirDockerCompose() {
  return new Promise((resolve) => {
    const proc = spawn('docker compose up -d', {
      cwd: BACKEND_DIR,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    anexarLogs(proc.stdout, 'mysql', CORES.verde);
    anexarLogs(proc.stderr, 'mysql', CORES.verde);
    proc.on('exit', (code) => resolve(code === 0));
    proc.on('error', () => resolve(false));
  });
}

async function esperarPorta(host, port, tentativas = 25) {
  for (let i = 0; i < tentativas; i++) {
    if (encerrando) return false;
    if (await portaAberta(host, port)) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

function anexarLogs(stream, prefixo, cor) {
  let resto = '';
  stream.setEncoding('utf8');
  stream.on('data', (chunk) => {
    const texto = resto + chunk;
    const partes = texto.split(/\r?\n/);
    resto = partes.pop() ?? '';
    for (const linha of partes) {
      if (linha.trim().length > 0) {
        console.log(`${cor}[${prefixo}]${CORES.reset} ${linha}`);
      }
    }
  });
  stream.on('end', () => {
    if (resto.trim().length > 0) {
      console.log(`${cor}[${prefixo}]${CORES.reset} ${resto}`);
    }
  });
}

function matarProcesso(proc) {
  if (!proc || proc.exitCode !== null) return;
  if (process.platform === 'win32') {
    spawnSync(`taskkill /pid ${proc.pid} /T /F`, {
      shell: true,
      stdio: 'ignore',
    });
  } else {
    try {
      process.kill(-proc.pid, 'SIGTERM');
    } catch {
      proc.kill('SIGTERM');
    }
  }
}

function encerrarTudo(codigo = 0) {
  if (encerrando) return;
  encerrando = true;
  if (timerBanco) {
    clearInterval(timerBanco);
    timerBanco = null;
  }
  for (const proc of processosAtivos) {
    matarProcesso(proc);
  }
  process.exit(codigo);
}

function iniciarServidor(nome, cor, comando, cwd) {
  if (encerrando) return null;

  const proc = spawn(comando, {
    cwd,
    shell: true,
    detached: process.platform !== 'win32',
    env: { ...process.env, FORCE_COLOR: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  processosAtivos.add(proc);
  anexarLogs(proc.stdout, nome, cor);
  anexarLogs(proc.stderr, nome, cor);

  proc.on('exit', (code) => {
    processosAtivos.delete(proc);
    if (encerrando) return;
    log(nome, cor, `Processo finalizado (código ${code ?? 0}).`);
    if (processosAtivos.size === 0 && !timerBanco) {
      encerrarTudo(code ?? 0);
    }
  });

  return proc;
}

async function prepararEIniciarBackend() {
  const envBackend = {
    ...lerVariaveisEnv(path.join(BACKEND_DIR, '.env')),
    ...process.env,
  };

  if (envBackend.DATABASE_URL) {
    log('backend', CORES.ciano, 'Iniciando API com PostgreSQL (DATABASE_URL)...');
    iniciarServidor('backend', CORES.ciano, 'npm run dev', BACKEND_DIR);
    return;
  }

  const dbHost = envBackend.DB_HOST || 'localhost';
  const dbPort = Number(envBackend.DB_PORT) || 3306;

  if (await portaAberta(dbHost, dbPort)) {
    log('backend', CORES.ciano, `MySQL detectado em ${dbHost}:${dbPort}. Iniciando API...`);
    iniciarServidor('backend', CORES.ciano, 'npm run dev', BACKEND_DIR);
    return;
  }

  if (await dockerDisponivel()) {
    log('backend', CORES.ciano, 'Subindo container MySQL (docker compose up -d)...');
    if (await subirDockerCompose()) {
      log('backend', CORES.ciano, `Aguardando MySQL responder em ${dbHost}:${dbPort}...`);
      if (await esperarPorta(dbHost, dbPort)) {
        iniciarServidor('backend', CORES.ciano, 'npm run dev', BACKEND_DIR);
        return;
      }
    }
  }

  log(
    'backend',
    CORES.amarelo,
    `⚠ MySQL (${dbHost}:${dbPort}) não está acessível e o Docker Desktop está fechado.`
  );
  log(
    'backend',
    CORES.amarelo,
    '👉 Abra o Docker Desktop (ou inicie seu MySQL local na porta 3306). A API iniciará automaticamente assim que o banco responder!'
  );

  let verificando = false;
  timerBanco = setInterval(async () => {
    if (encerrando || verificando) return;
    verificando = true;
    try {
      if (await portaAberta(dbHost, dbPort)) {
        clearInterval(timerBanco);
        timerBanco = null;
        log('backend', CORES.verde, `MySQL detectado em ${dbHost}:${dbPort}! Iniciando API...`);
        iniciarServidor('backend', CORES.ciano, 'npm run dev', BACKEND_DIR);
        return;
      }

      if (await dockerDisponivel()) {
        clearInterval(timerBanco);
        timerBanco = null;
        log('backend', CORES.verde, 'Docker detectado! Subindo MySQL (docker compose up -d)...');
        if ((await subirDockerCompose()) && (await esperarPorta(dbHost, dbPort))) {
          iniciarServidor('backend', CORES.ciano, 'npm run dev', BACKEND_DIR);
        } else {
          log('backend', CORES.vermelho, 'Não foi possível iniciar o MySQL pelo Docker.');
        }
      }
    } finally {
      verificando = false;
    }
  }, 3000);
}

async function principal() {
  const apenasSetup = process.argv.includes('--setup');

  garantirEnv('backend', BACKEND_DIR);
  garantirEnv('frontend', FRONTEND_DIR);
  garantirDependencias('backend', BACKEND_DIR, apenasSetup);
  garantirDependencias('frontend', FRONTEND_DIR, apenasSetup);

  if (apenasSetup) {
    log('abacaxi', CORES.verde, 'Ambiente pronto! Execute "npm run dev" na raiz para rodar os dois servidores.');
    return;
  }

  log('abacaxi', CORES.verde, 'Iniciando Fazenda de Abacaxis (Frontend + Backend)...');
  log('abacaxi', CORES.verde, 'Pressione Ctrl+C para parar os dois servidores.');

  iniciarServidor('frontend', CORES.magenta, 'npm run dev', FRONTEND_DIR);
  await prepararEIniciarBackend();
}

process.on('SIGINT', () => {
  console.log('');
  log('abacaxi', CORES.amarelo, 'Encerrando servidores...');
  encerrarTudo(0);
});
process.on('SIGTERM', () => encerrarTudo(0));

principal().catch((err) => {
  log('abacaxi', CORES.vermelho, err.message);
  encerrarTudo(1);
});

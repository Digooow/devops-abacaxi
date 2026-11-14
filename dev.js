const { execFile, spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');

const RAIZ = __dirname;
const BACKEND_DIR = path.join(RAIZ, 'abacaxi-backend');
const FRONTEND_DIR = path.join(RAIZ, 'abacaxi-frontend');

const SERVICO_BACKEND = 'backend';
const SERVICO_FRONTEND = 'frontend';
const APP_NOME = 'abacaxi';
const SINAL_TERM = 'SIGTERM';
const STDIO_IGNORE = 'ignore';
const ARGS_NPM_DEV = ['run', 'dev'];
const IS_WINDOWS = process.platform === 'win32';
const WIN_SYS32 = path.join(process.env.SystemRoot || String.raw`C:\Windows`, 'System32');
const TASKKILL_BIN = path.join(WIN_SYS32, 'taskkill.exe');
const CMD_BIN = path.join(WIN_SYS32, 'cmd.exe');
const DOCKER_CANDIDATES = IS_WINDOWS
  ? [path.join(process.env.ProgramFiles || String.raw`C:\Program Files`, 'Docker', 'Docker', 'resources', 'bin', 'docker.exe')]
  : ['/usr/local/bin/docker', '/usr/bin/docker', '/opt/homebrew/bin/docker', '/Applications/Docker.app/Contents/Resources/bin/docker'];

function resolverDocker() {
  return DOCKER_CANDIDATES.find((c) => fs.existsSync(c)) || null;
}

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
let verificandoBanco = false;

function log(prefixo, cor, mensagem) {
  const linhas = String(mensagem).replaceAll('\r\n', '\n').split('\n');
  for (const linha of linhas) {
    if (linha.length > 0) {
      console.log(`${cor}[${prefixo}]${CORES.reset} ${linha}`);
    }
  }
}

function comandoNpm(args) {
  if (IS_WINDOWS) {
    return {
      bin: process.env.ComSpec || CMD_BIN,
      argv: ['/d', '/s', '/c', 'npm', ...args],
    };
  }
  return { bin: 'npm', argv: args };
}

function executarNpmSincrono(args, cwd) {
  const { bin, argv } = comandoNpm(args);
  return spawnSync(bin, argv, { cwd, stdio: 'inherit' });
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
    const res = executarNpmSincrono(['install'], pasta);
    if (res.status !== 0) {
      throw new Error(`Falha ao instalar dependências em ${nome}.`);
    }
  }
}

function removerAspasBordas(valor) {
  if (
    (valor.startsWith('"') && valor.endsWith('"')) ||
    (valor.startsWith("'") && valor.endsWith("'"))
  ) {
    return valor.slice(1, -1);
  }
  return valor;
}

function lerVariaveisEnv(arquivoEnv) {
  const vars = {};
  if (!fs.existsSync(arquivoEnv)) return vars;
  const conteudo = fs.readFileSync(arquivoEnv, 'utf8').replaceAll('\r\n', '\n');
  for (const linhaBruta of conteudo.split('\n')) {
    const linha = linhaBruta.trim();
    if (!linha || linha.startsWith('#')) continue;
    const idx = linha.indexOf('=');
    if (idx === -1) continue;
    const chave = linha.slice(0, idx).trim();
    const valor = removerAspasBordas(linha.slice(idx + 1).trim());
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
  const dockerBin = resolverDocker();
  if (!dockerBin) return Promise.resolve(false);
  return new Promise((resolve) => {
    execFile(dockerBin, ['info'], { cwd: BACKEND_DIR, timeout: 3000 }, (err) => {
      resolve(!err);
    });
  });
}

function anexarLogs(stream, prefixo, cor) {
  let resto = '';
  stream.setEncoding('utf8');
  stream.on('data', (chunk) => {
    const texto = resto + chunk;
    const partes = texto.replaceAll('\r\n', '\n').split('\n');
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

function subirDockerCompose() {
  const dockerBin = resolverDocker();
  if (!dockerBin) return Promise.resolve(false);
  return new Promise((resolve) => {
    const proc = spawn(dockerBin, ['compose', 'up', '-d'], {
      cwd: BACKEND_DIR,
      stdio: [STDIO_IGNORE, 'pipe', 'pipe'],
    });
    anexarLogs(proc.stdout, 'mysql', CORES.verde);
    anexarLogs(proc.stderr, 'mysql', CORES.verde);
    proc.on('exit', (code) => resolve(code === 0));
    proc.on('error', () => resolve(false));
  });
}

async function esperarPorta(host, port, tentativas = 25) {
  if (encerrando || tentativas <= 0) return false;
  if (await portaAberta(host, port)) return true;
  await new Promise((r) => setTimeout(r, 1000));
  return esperarPorta(host, port, tentativas - 1);
}

function matarProcesso(proc) {
  if (proc?.exitCode !== null) return;
  if (IS_WINDOWS) {
    if (fs.existsSync(TASKKILL_BIN)) {
      spawnSync(TASKKILL_BIN, ['/pid', String(proc.pid), '/T', '/F'], {
        stdio: STDIO_IGNORE,
      });
    }
    return;
  }
  try {
    process.kill(-proc.pid, SINAL_TERM);
  } catch {
    proc.kill(SINAL_TERM);
  }
}

function limparTimerBanco() {
  if (timerBanco) {
    clearInterval(timerBanco);
    timerBanco = null;
  }
}

function encerrarTudo(codigo = 0) {
  if (encerrando) return;
  encerrando = true;
  limparTimerBanco();
  for (const proc of processosAtivos) {
    matarProcesso(proc);
  }
  process.exit(codigo);
}

function iniciarServidor(nome, cor, argsNpm, cwd) {
  if (encerrando) return null;

  const { bin, argv } = comandoNpm(argsNpm);
  const proc = spawn(bin, argv, {
    cwd,
    detached: !IS_WINDOWS,
    env: { ...process.env, FORCE_COLOR: '1' },
    stdio: [STDIO_IGNORE, 'pipe', 'pipe'],
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

async function iniciarBackendComDocker(dbHost, dbPort) {
  if (!(await dockerDisponivel())) return false;
  log(SERVICO_BACKEND, CORES.ciano, 'Subindo container MySQL (docker compose up -d)...');
  if (!(await subirDockerCompose())) return false;
  log(SERVICO_BACKEND, CORES.ciano, `Aguardando MySQL responder em ${dbHost}:${dbPort}...`);
  if (!(await esperarPorta(dbHost, dbPort))) return false;
  iniciarServidor(SERVICO_BACKEND, CORES.ciano, ARGS_NPM_DEV, BACKEND_DIR);
  return true;
}

async function tentarSubirBackendNoIntervalo(dbHost, dbPort) {
  if (encerrando || verificandoBanco) return;
  verificandoBanco = true;
  try {
    if (await portaAberta(dbHost, dbPort)) {
      limparTimerBanco();
      log(SERVICO_BACKEND, CORES.verde, `MySQL detectado em ${dbHost}:${dbPort}! Iniciando API...`);
      iniciarServidor(SERVICO_BACKEND, CORES.ciano, ARGS_NPM_DEV, BACKEND_DIR);
      return;
    }

    if (await dockerDisponivel()) {
      limparTimerBanco();
      log(SERVICO_BACKEND, CORES.verde, 'Docker detectado! Subindo MySQL (docker compose up -d)...');
      const iniciou = await iniciarBackendComDocker(dbHost, dbPort);
      if (!iniciou) {
        log(SERVICO_BACKEND, CORES.vermelho, 'Não foi possível iniciar o MySQL pelo Docker.');
      }
    }
  } finally {
    verificandoBanco = false;
  }
}

async function prepararEIniciarBackend() {
  const envBackend = {
    ...lerVariaveisEnv(path.join(BACKEND_DIR, '.env')),
    ...process.env,
  };

  if (envBackend.DATABASE_URL) {
    log(SERVICO_BACKEND, CORES.ciano, 'Iniciando API com PostgreSQL (DATABASE_URL)...');
    iniciarServidor(SERVICO_BACKEND, CORES.ciano, ARGS_NPM_DEV, BACKEND_DIR);
    return;
  }

  const dbHost = envBackend.DB_HOST || 'localhost';
  const dbPort = Number(envBackend.DB_PORT) || 3306;

  if (await portaAberta(dbHost, dbPort)) {
    log(SERVICO_BACKEND, CORES.ciano, `MySQL detectado em ${dbHost}:${dbPort}. Iniciando API...`);
    iniciarServidor(SERVICO_BACKEND, CORES.ciano, ARGS_NPM_DEV, BACKEND_DIR);
    return;
  }

  if (await iniciarBackendComDocker(dbHost, dbPort)) {
    return;
  }

  log(
    SERVICO_BACKEND,
    CORES.amarelo,
    `⚠ MySQL (${dbHost}:${dbPort}) não está acessível e o Docker Desktop está fechado.`
  );
  log(
    SERVICO_BACKEND,
    CORES.amarelo,
    '👉 Abra o Docker Desktop (ou inicie seu MySQL local na porta 3306). A API iniciará automaticamente assim que o banco responder!'
  );

  timerBanco = setInterval(() => {
    void tentarSubirBackendNoIntervalo(dbHost, dbPort);
  }, 3000);
}

async function principal() {
  const apenasSetup = process.argv.includes('--setup');

  garantirEnv(SERVICO_BACKEND, BACKEND_DIR);
  garantirEnv(SERVICO_FRONTEND, FRONTEND_DIR);
  garantirDependencias(SERVICO_BACKEND, BACKEND_DIR, apenasSetup);
  garantirDependencias(SERVICO_FRONTEND, FRONTEND_DIR, apenasSetup);

  if (apenasSetup) {
    log(APP_NOME, CORES.verde, 'Ambiente pronto! Execute "npm run dev" na raiz para rodar os dois servidores.');
    return;
  }

  log(APP_NOME, CORES.verde, 'Iniciando Fazenda de Abacaxis (Frontend + Backend)...');
  log(APP_NOME, CORES.verde, 'Pressione Ctrl+C para parar os dois servidores.');

  iniciarServidor(SERVICO_FRONTEND, CORES.magenta, ARGS_NPM_DEV, FRONTEND_DIR);
  await prepararEIniciarBackend();
}

process.on('SIGINT', () => {
  console.log('');
  log(APP_NOME, CORES.amarelo, 'Encerrando servidores...');
  encerrarTudo(0);
});
process.on(SINAL_TERM, () => encerrarTudo(0));

principal().catch((err) => {
  log(APP_NOME, CORES.vermelho, err.message);
  encerrarTudo(1);
});

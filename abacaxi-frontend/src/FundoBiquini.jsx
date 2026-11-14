import { useEffect, useRef } from 'react';
import {
  desenharAguaViva,
  desenharBarcomovel,
  desenharBobEsponja,
  desenharBolha,
  desenharFlorBiquini,
  desenharGary,
  desenharLulaMolusco,
  desenharOnibusBiquini,
  desenharPatrick,
  desenharPeixeCidadao,
  desenharPlankton,
  desenharSiriguejo,
} from './personagensBiquini.js';

const CORES_FLORES = [
  { preenchimento: 'rgba(122, 245, 255, 0.24)', borda: 'rgba(168, 252, 255, 0.48)' },
  { preenchimento: 'rgba(255, 138, 192, 0.24)', borda: 'rgba(255, 182, 217, 0.48)' },
  { preenchimento: 'rgba(255, 232, 99, 0.24)', borda: 'rgba(255, 243, 158, 0.48)' },
  { preenchimento: 'rgba(196, 148, 255, 0.22)', borda: 'rgba(220, 190, 255, 0.45)' },
  { preenchimento: 'rgba(130, 255, 198, 0.22)', borda: 'rgba(178, 255, 220, 0.45)' },
  { preenchimento: 'rgba(255, 168, 108, 0.22)', borda: 'rgba(255, 205, 162, 0.45)' },
];

const PALETA_PEIXES = [
  ['#ff9f1c', '#ffbf69'],
  [COR_ROSA_AGUA_VIVA, '#ffc2d4'],
  ['#a7e838', '#38b000'],
  ['#ffd166', '#ef476f'],
  ['#9b5de5', '#f15bb5'],
  ['#00f5d4', '#00bbf9'],
];

const TIPO_BARCO = 'barco';
const COR_VERMELHO = '#e63946';
const COR_OURO = '#ffd166';
const COR_AMARELO_SOL = '#ffe135';
const COR_AMARELO_LUZ = '#ffe66d';
const COR_AZUL_LUZ = '#8ae5ff';
const COR_MADEIRA = '#6b3e1b';
const COR_MADEIRA_ESCURA = '#5e3414';
const COR_METAL_ESCURO = '#2b3a4a';
const COR_JANELA_CLARA = '#caf0f8';
const COR_VIDRO_BORDA = '#184e77';
const COR_MOAI = '#183a47';
const COR_TELHADO_LARANJA = '#6e2912';
const COR_TELHADO_VERDE = '#1b4332';
const COR_ROSA_AGUA_VIVA = '#ff6b9d';
const COR_VIDRO_MOLLUSCO = '#9be7ff';
const TRACO_ARREDONDADO = 'round';

const LARGURA_VIEWBOX = 1440;
const ALTURA_VIEWBOX = 280;
const MAX_UINT32_MAIS_UM = 0x100000000;

function aleatorio(min = 0, max = 1) {
  const arr = new Uint32Array(1);
  globalThis.crypto.getRandomValues(arr);
  return min + (arr[0] / MAX_UINT32_MAIS_UM) * (max - min);
}

function criarBolha(largura, altura, aleatorioY = false, camadaFrente = false) {
  const r = camadaFrente ? aleatorio(3.5, 16.5) : aleatorio(3, 13);
  return {
    x: aleatorio(0, largura),
    y: aleatorioY ? aleatorio(0, altura) : altura + r + aleatorio(0, 50),
    r,
    vy: -(0.5 + (18 - r) * 0.045 + aleatorio(0, 0.4)),
    vx: 0,
    fase: aleatorio(0, Math.PI * 2),
    amplitude: aleatorio(0.3, 0.95),
    temporaria: false,
    vida: 1,
    frente: camadaFrente,
  };
}

function criarEstadoCena(largura, altura) {
  const flores = Array.from({ length: 11 }, (_, i) => ({
    x: (largura / 11) * i + aleatorio(0, 80),
    y: 42 + (i % 4) * 78 + aleatorio(0, 32),
    raio: 28 + (i % 4) * 12,
    angulo: aleatorio(0, Math.PI * 2),
    velRot: (i % 2 === 0 ? 1 : -1) * aleatorio(0.0014, 0.003),
    velX: aleatorio(0.12, 0.3),
    paralaxe: 0.014 + (i % 3) * 0.012,
    cor: CORES_FLORES[i % CORES_FLORES.length],
  }));

  const peixes = Array.from({ length: 12 }, (_, i) => {
    const [corPrimaria, corSecundaria] = PALETA_PEIXES[i % PALETA_PEIXES.length];
    const indoDireita = i % 2 === 0;
    return {
      x: aleatorio(0, largura),
      y: 75 + aleatorio(0, Math.max(180, altura - 340)),
      vx: (indoDireita ? 1 : -1) * aleatorio(0.55, 1.2),
      escala: aleatorio(0.72, 1.17),
      fase: aleatorio(0, Math.PI * 2),
      corPrimaria,
      corSecundaria,
    };
  });

  const aguasVivas = Array.from({ length: 6 }, (_, i) => ({
    x: (largura / 6) * i + 40,
    y: 90 + (i % 3) * 95,
    vx: (i % 2 === 0 ? 1 : -1) * aleatorio(0.35, 0.65),
    vy: 0,
    fase: i * 1.3,
    inclinacao: 0,
  }));

  const moradores = {
    bob: { svgX: 455, dir: 1, vel: 26, minX: 175, maxX: 980, puloY: 0, vyPulo: 0 },
    patrick: { svgX: 415, dir: 1, vel: 24, minX: 155, maxX: 940, puloY: 0, vyPulo: 0 },
    gary: { svgX: 470, dir: 1, vel: 7, minX: 395, maxX: 535 },
    lula: { svgX: 330, dir: -1, vel: 14, minX: 255, maxX: 395 },
    siriguejo: { svgX: 985, dir: 1, vel: 19, minX: 895, maxX: 1095 },
    plankton: { svgX: 1215, dir: -1, vel: 16, minX: 1150, maxX: 1295 },
  };

  const veiculos = [
    { tipo: TIPO_BARCO, svgX: 180, vx: 68, faixa: 1, corFaixa: COR_VERMELHO, fase: 0, ultimoEscapamento: 0 },
    { tipo: TIPO_BARCO, svgX: 880, vx: 76, faixa: 1, corFaixa: '#00b4d8', fase: 2.1, ultimoEscapamento: 0 },
    { tipo: 'onibus', svgX: 1180, vx: -58, faixa: 2, corFaixa: '#d62828', fase: 1.1, ultimoEscapamento: 0 },
    { tipo: TIPO_BARCO, svgX: 520, vx: -72, faixa: 2, corFaixa: '#ffbe0b', fase: 3.4, ultimoEscapamento: 0 },
  ];

  const bolhas = [
    ...Array.from({ length: 28 }, () => criarBolha(largura, altura, true, false)),
    ...Array.from({ length: 24 }, () => criarBolha(largura, altura, true, true)),
  ];

  return { flores, peixes, aguasVivas, moradores, veiculos, bolhas, aneis: [] };
}

function obterGeometriaCenario(largura, altura, alturaSvg) {
  const escala = Math.max(largura / LARGURA_VIEWBOX, alturaSvg / ALTURA_VIEWBOX);
  const xParaTela = (svgX) => largura * 0.5 + (svgX - LARGURA_VIEWBOX * 0.5) * escala;
  const yParaTela = (svgY) => altura - (ALTURA_VIEWBOX - svgY) * escala;
  return { escala, xParaTela, yParaTela };
}

function estourarBolha(bolhas, aneis, b) {
  aneis.push({ x: b.x, y: b.y, r: b.r * 0.6, maxR: b.r * 2.4, alfa: 0.78 });
  for (let i = 0; i < 4; i++) {
    const ang = (Math.PI * 2 * i) / 4 + aleatorio(0, 0.6);
    bolhas.push({
      x: b.x + Math.cos(ang) * 4,
      y: b.y + Math.sin(ang) * 4,
      r: aleatorio(2.2, 5.0),
      vx: Math.cos(ang) * aleatorio(1.2, 2.2),
      vy: -1.2 + Math.sin(ang) * 0.8,
      fase: aleatorio(0, Math.PI * 2),
      amplitude: 0.3,
      temporaria: true,
      vida: 0.95,
      frente: true,
    });
  }
}

function desenharRaiosSol(ctxFundo, tempo, largura, altura, desvioMouseX) {
  for (let i = 0; i < 6; i++) {
    const baseX = largura * (0.08 + i * 0.18) + Math.sin(tempo * 0.42 + i) * 32 - desvioMouseX * 0.02;
    const inclinacao = 85 + Math.sin(tempo * 0.3 + i * 1.2) * 28;
    const largTopo = 42 + (i % 2) * 24;
    const largBase = 125 + (i % 3) * 32;
    const alcanceY = altura * 0.8;

    const gradRaio = ctxFundo.createLinearGradient(baseX, 0, baseX + inclinacao, alcanceY);
    gradRaio.addColorStop(0, 'rgba(195, 252, 255, 0.20)');
    gradRaio.addColorStop(0.55, 'rgba(120, 235, 255, 0.07)');
    gradRaio.addColorStop(1, 'rgba(120, 235, 255, 0)');

    ctxFundo.fillStyle = gradRaio;
    ctxFundo.beginPath();
    ctxFundo.moveTo(baseX - largTopo / 2, -10);
    ctxFundo.lineTo(baseX + largTopo / 2, -10);
    ctxFundo.lineTo(baseX + inclinacao + largBase / 2, alcanceY);
    ctxFundo.lineTo(baseX + inclinacao - largBase / 2, alcanceY);
    ctxFundo.closePath();
    ctxFundo.fill();
  }
}

function atualizarFlores(ctxFundo, flores, largura, desvioMouseX, desvioMouseY) {
  for (const flor of flores) {
    flor.x += flor.velX;
    flor.angulo += flor.velRot;
    if (flor.x - flor.raio > largura + 80) flor.x = -flor.raio - 60;
    const fx = flor.x - desvioMouseX * flor.paralaxe;
    const fy = flor.y - desvioMouseY * flor.paralaxe;
    desenharFlorBiquini(ctxFundo, fx, fy, flor.raio, flor.angulo, flor.cor);
  }
}

function restringirPosicaoPeixe(p, largura, altura) {
  if (p.vx > 0 && p.x > largura + 40) p.x = -35;
  if (p.vx < 0 && p.x < -40) p.x = largura + 35;
  if (p.y < 55) p.y = 55;
  if (p.y > altura - 240) p.y = Math.max(70, altura - 240);
}

function atualizarPeixes(ctxFundo, peixes, mouse, tempo, largura, altura) {
  for (const p of peixes) {
    p.x += p.vx;
    p.y += Math.sin(tempo * 2.2 + p.fase) * 0.28;

    if (mouse.ativo) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 110 && dist > 1) {
        p.x += (dx / dist) * 1.8;
        p.y += (dy / dist) * 1.1;
      }
    }

    restringirPosicaoPeixe(p, largura, altura);
    desenharPeixeCidadao(ctxFundo, p, tempo);
  }
}

function manterAguaVivaNaTela(av, largura, altura) {
  if (av.y < 65) av.vy += 0.15;
  if (av.y > altura - 230) av.vy -= 0.22;
  if (av.x > largura + 45) av.x = -40;
  if (av.x < -45) av.x = largura + 40;
}

function atualizarAguasVivas(ctxFundo, aguasVivas, mouse, tempo, largura, altura) {
  for (const av of aguasVivas) {
    const impulsoPulso = Math.cos(tempo * 3.8 + av.fase);
    av.x += av.vx;
    av.y += Math.sin(tempo * 1.6 + av.fase) * 0.45 - Math.max(0, impulsoPulso) * 0.35 + av.vy;
    av.vy *= 0.94;

    if (mouse.ativo) {
      const dx = av.x - mouse.x;
      const dy = av.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 135 && dist > 1) {
        const forca = (135 - dist) / 135;
        av.x += (dx / dist) * forca * 2.4;
        av.vy += (dy / dist) * forca * 0.35;
      }
    }

    manterAguaVivaNaTela(av, largura, altura);
    av.inclinacao = av.vx * 0.22 + Math.sin(tempo * 2 + av.fase) * 0.08;
    desenharAguaViva(ctxFundo, av, tempo);
  }
}

function atualizarCaminhante(c, dt) {
  c.svgX += c.dir * c.vel * dt;
  if (c.svgX > c.maxX) {
    c.svgX = c.maxX;
    c.dir = -1;
  } else if (c.svgX < c.minX) {
    c.svgX = c.minX;
    c.dir = 1;
  }
}

function atualizarHeroi(heroi, mouse, xParaTela, yCalcada) {
  const hx = xParaTela(heroi.svgX);
  if (mouse.ativo && heroi.puloY === 0 && Math.hypot(mouse.x - hx, mouse.y - (yCalcada - 22)) < 58) {
    heroi.vyPulo = -5.2;
  }
  if (heroi.puloY < 0 || heroi.vyPulo !== 0) {
    heroi.puloY += heroi.vyPulo;
    heroi.vyPulo += 0.28;
    if (heroi.puloY >= 0) {
      heroi.puloY = 0;
      heroi.vyPulo = 0;
    }
  }
}

function desenharMoradores(ctxFrente, moradores, geom, mouse, tempo, dt) {
  const { escala, xParaTela, yParaTela } = geom;
  const { bob, patrick, gary, lula, siriguejo, plankton } = moradores;

  atualizarCaminhante(bob, dt);
  atualizarCaminhante(patrick, dt);
  atualizarCaminhante(gary, dt);
  atualizarCaminhante(lula, dt);
  atualizarCaminhante(siriguejo, dt);
  atualizarCaminhante(plankton, dt);

  const yCalcada = yParaTela(217);
  const escalaPers = escala * 0.96;

  atualizarHeroi(bob, mouse, xParaTela, yCalcada);
  atualizarHeroi(patrick, mouse, xParaTela, yCalcada);

  desenharLulaMolusco(ctxFrente, xParaTela(lula.svgX), yCalcada, escalaPers, tempo, lula.dir);
  desenharGary(ctxFrente, xParaTela(gary.svgX), yCalcada + 1, escalaPers, tempo, gary.dir);
  desenharSiriguejo(ctxFrente, xParaTela(siriguejo.svgX), yCalcada, escalaPers, tempo, siriguejo.dir);
  desenharPlankton(ctxFrente, xParaTela(plankton.svgX), yCalcada + 1, escalaPers, tempo, plankton.dir);
  desenharPatrick(ctxFrente, xParaTela(patrick.svgX), yCalcada + 1, escalaPers, tempo, patrick.dir, patrick.puloY);
  desenharBobEsponja(ctxFrente, xParaTela(bob.svgX), yCalcada + 1, escalaPers, tempo, bob.dir, bob.puloY);
}

function atualizarPosicaoVeiculo(v, dt) {
  v.svgX += v.vx * dt;
  if (v.vx > 0 && v.svgX > LARGURA_VIEWBOX + 90) {
    v.svgX = -90;
  } else if (v.vx < 0 && v.svgX < -90) {
    v.svgX = LARGURA_VIEWBOX + 90;
  }
}

function emitirBolhaEscapamento(v, vxTela, vyTela, escala, bolhas, agora) {
  if (agora - v.ultimoEscapamento <= 190 || bolhas.length >= 135) return;
  v.ultimoEscapamento = agora;
  const dir = v.vx >= 0 ? 1 : -1;
  bolhas.push({
    x: vxTela - dir * 36 * escala,
    y: vyTela - 8 * escala,
    r: aleatorio(2.2, 5.4),
    vx: -dir * aleatorio(0.5, 1.1),
    vy: -aleatorio(0.8, 1.5),
    fase: aleatorio(0, Math.PI * 2),
    amplitude: 0.3,
    temporaria: true,
    vida: 0.85,
    frente: true,
  });
}

function atualizarVeiculos(ctxFrente, veiculos, bolhas, geom, tempo, dt, agora) {
  const { escala, xParaTela, yParaTela } = geom;
  const yFaixa1 = yParaTela(244);
  const yFaixa2 = yParaTela(268);

  for (const v of veiculos) {
    atualizarPosicaoVeiculo(v, dt);

    const vxTela = xParaTela(v.svgX);
    const vyTela = v.faixa === 1 ? yFaixa1 : yFaixa2;
    emitirBolhaEscapamento(v, vxTela, vyTela, escala, bolhas, agora);

    const desenharVeiculo = v.tipo === 'onibus' ? desenharOnibusBiquini : desenharBarcomovel;
    desenharVeiculo(ctxFrente, { ...v, x: vxTela }, vyTela, escala * 0.92, tempo);
  }
}

function interagirBolhaComMouse(bolhas, aneis, i, mouse, velCursor, largura, altura) {
  if (!mouse.ativo) return false;
  const b = bolhas[i];
  const dx = b.x - mouse.x;
  const dy = b.y - mouse.y;
  const dist = Math.hypot(dx, dy);

  if (b.r > 8.5 && velCursor > 8 && dist < b.r + 12) {
    estourarBolha(bolhas, aneis, b);
    if (b.temporaria) {
      bolhas.splice(i, 1);
      return true;
    }
    Object.assign(b, criarBolha(largura, altura, false, b.frente));
    return true;
  }

  if (dist < 105 && dist > 1) {
    const empurrao = ((105 - dist) / 105) * 0.85;
    b.vx += (dx / dist) * empurrao;
    b.y += (dy / dist) * empurrao * 0.4;
  }
  return false;
}

function atualizarBolhas(ctxFundo, ctxFrente, estado, mouse, largura, altura, tempo) {
  const { bolhas, aneis } = estado;
  const velCursor = Math.hypot(mouse.vx, mouse.vy);

  for (let i = bolhas.length - 1; i >= 0; i--) {
    const b = bolhas[i];
    b.y += b.vy;
    b.x += Math.sin(tempo * 2.1 + b.fase) * b.amplitude + b.vx;
    b.vx *= 0.95;

    if (interagirBolhaComMouse(bolhas, aneis, i, mouse, velCursor, largura, altura)) {
      continue;
    }

    if (b.temporaria) {
      b.vida -= 0.008;
      if (b.vida <= 0.04 || b.y < -30) {
        bolhas.splice(i, 1);
        continue;
      }
    } else if (b.y < -b.r - 20) {
      Object.assign(b, criarBolha(largura, altura, false, b.frente));
    }

    desenharBolha(b.frente ? ctxFrente : ctxFundo, b);
  }
}

function atualizarAneis(ctxFrente, aneis) {
  for (let i = aneis.length - 1; i >= 0; i--) {
    const anel = aneis[i];
    anel.r += (anel.maxR - anel.r) * 0.14 + 0.8;
    anel.alfa -= 0.028;
    if (anel.alfa <= 0) {
      aneis.splice(i, 1);
      continue;
    }
    ctxFrente.save();
    ctxFrente.strokeStyle = `rgba(220, 252, 255, ${anel.alfa})`;
    ctxFrente.lineWidth = 2;
    ctxFrente.beginPath();
    ctxFrente.arc(anel.x, anel.y, anel.r, 0, Math.PI * 2);
    ctxFrente.stroke();
    ctxFrente.restore();
  }
}

function CenarioFendaBiquini({ svgRef }) {
  return (
    <svg
      ref={svgRef}
      className="cenario-areia"
      viewBox="0 0 1440 280"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <path
        d="M0,185 Q180,125 390,165 T820,148 T1220,162 T1440,150 L1440,280 L0,280 Z"
        fill="#05486b"
        opacity="0.62"
      />

      {/* Skyline de Downtown Bikini Bottom */}
      <g opacity="0.82">
        <rect x="48" y="128" width="32" height="78" rx="6" fill="#27698c" />
        <path d="M60,128 L60,116 L70,116" fill="none" stroke="#27698c" strokeWidth="6" strokeLinecap={TRACO_ARREDONDADO} />
        <circle cx="64" cy="146" r="4" fill={COR_AMARELO_LUZ} />
        <circle cx="64" cy="162" r="4" fill={COR_AZUL_LUZ} />

        <rect x="148" y="114" width="38" height="92" rx="8" fill="#367a94" />
        <circle cx="167" cy="134" r="4.5" fill={COR_AMARELO_LUZ} />
        <circle cx="167" cy="152" r="4.5" fill={COR_AMARELO_LUZ} />

        <rect x="518" y="108" width="40" height="98" rx="7" fill="#2c6e8f" />
        <path d="M538,108 L538,94 L550,94" fill="none" stroke="#2c6e8f" strokeWidth="7" strokeLinecap={TRACO_ARREDONDADO} />
        <circle cx="538" cy="126" r="4.5" fill={COR_AMARELO_LUZ} />
        <circle cx="538" cy="144" r="4.5" fill={COR_AZUL_LUZ} />
        <circle cx="538" cy="162" r="4.5" fill={COR_AMARELO_LUZ} />

        <rect x="566" y="124" width="34" height="82" rx="6" fill="#3c7d85" />
        <circle cx="583" cy="142" r="4" fill={COR_AMARELO_LUZ} />

        <rect x="652" y="96" width="44" height="110" rx="8" fill="#2a5f82" />
        <ellipse cx="674" cy="96" rx="24" ry="6" fill="#3a7ca5" />
        <circle cx="666" cy="116" r="4" fill={COR_AMARELO_LUZ} />
        <circle cx="682" cy="116" r="4" fill={COR_AZUL_LUZ} />
        <circle cx="666" cy="134" r="4" fill={COR_AZUL_LUZ} />
        <circle cx="682" cy="134" r="4" fill={COR_AMARELO_LUZ} />

        <g transform="translate(768, 42)">
          <line x1="20" y1="0" x2="20" y2="22" stroke="#7bdff2" strokeWidth="2.5" />
          <circle cx="20" cy="0" r="3" fill={COR_ROSA_AGUA_VIVA} />
          <polygon points="15,34 25,34 31,162 9,162" fill="#265c7d" />
          <ellipse cx="20" cy="28" rx="24" ry="7" fill="#4895ef" stroke="#1b425c" strokeWidth="1.8" />
          <ellipse cx="20" cy="24" rx="15" ry="5" fill={COR_AMARELO_LUZ} />
        </g>

        <rect x="818" y="112" width="38" height="94" rx="7" fill="#35698a" />
        <path d="M836,112 L836,98 L825,98" fill="none" stroke="#35698a" strokeWidth="6" strokeLinecap={TRACO_ARREDONDADO} />
        <circle cx="837" cy="132" r="4.2" fill={COR_AMARELO_LUZ} />
        <circle cx="837" cy="150" r="4.2" fill={COR_AMARELO_LUZ} />

        <rect x="864" y="126" width="34" height="80" rx="6" fill="#2b7580" />
        <circle cx="881" cy="145" r="4" fill={COR_AZUL_LUZ} />

        <rect x="1102" y="110" width="40" height="96" rx="8" fill="#2d6687" />
        <circle cx="1122" cy="130" r="4.5" fill={COR_AMARELO_LUZ} />
        <circle cx="1122" cy="148" r="4.5" fill={COR_AZUL_LUZ} />

        <rect x="1312" y="118" width="42" height="88" rx="8" fill="#286080" />
        <path d="M1332,118 L1332,104 L1344,104" fill="none" stroke="#286080" strokeWidth="6.5" strokeLinecap={TRACO_ARREDONDADO} />
        <circle cx="1333" cy="138" r="4.5" fill={COR_AMARELO_LUZ} />
        <circle cx="1333" cy="156" r="4.5" fill={COR_AMARELO_LUZ} />
      </g>

      <path
        d="M0,196 Q260,168 540,192 T1080,186 T1440,194 L1440,280 L0,280 Z"
        fill="#0b6e99"
        opacity="0.65"
      />

      {/* Redoma da Sandy */}
      <g transform="translate(22, 112)">
        <path d="M10,94 A62,58 0 0,1 134,94 Z" fill="rgba(205, 248, 255, 0.28)" stroke="#b8f2ff" strokeWidth="2.5" />
        <ellipse cx="72" cy="94" rx="60" ry="9" fill="#38b000" />
        <rect x="66" y="58" width="12" height="34" rx="2" fill="#7f4f24" />
        <rect x="69" y="76" width="6" height="14" rx="3" fill="#d4a373" />
        <circle cx="72" cy="48" r="20" fill="#2b9348" />
        <circle cx="56" cy="54" r="14" fill="#55a630" />
        <circle cx="88" cy="54" r="14" fill="#55a630" />
        <circle cx="72" cy="36" r="14" fill="#80b918" />
        <path d="M26,72 A50,48 0 0,1 62,42" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="3" strokeLinecap={TRACO_ARREDONDADO} />
        <rect x="6" y="92" width="132" height="9" rx="4" fill="#7c98ad" stroke="#2c485c" strokeWidth="2" />
        <path d="M114,98 L114,80 A10,10 0 0,1 134,80 L134,98 Z" fill="#8da9be" stroke="#2c485c" strokeWidth="2" />
      </g>

      {/* Pedra do Patrick */}
      <g transform="translate(188, 162)">
        <line x1="38" y1="-16" x2="38" y2="2" stroke="#d9a441" strokeWidth="2.5" />
        <polygon points="28,-12 50,-12 46,-17 32,-17" fill={COR_OURO} />
        <path d="M4,46 A36,34 0 0,1 76,46 Z" fill="#7c4222" stroke="#4d2611" strokeWidth="2.2" />
      </g>

      {/* Casa Moai do Lula Molusco */}
      <g transform="translate(292, 114)">
        <polygon points="10,94 18,8 58,8 66,94" fill="#2f667a" stroke={COR_MOAI} strokeWidth="2.2" />
        <rect x="13" y="22" width="50" height="9" rx="3" fill="#214d5e" />
        <polygon points="34,30 30,62 46,62 42,30" fill="#3d7d94" stroke={COR_MOAI} strokeWidth="1.6" />
        <circle cx="24" cy="40" r="6" fill="#90e0ef" stroke={COR_MOAI} strokeWidth="2.2" />
        <circle cx="52" cy="40" r="6" fill="#90e0ef" stroke={COR_MOAI} strokeWidth="2.2" />
        <path d="M28,94 L28,72 A10,10 0 0,1 48,72 L48,94 Z" fill="#a46834" stroke="#4d2e14" strokeWidth="2.2" />
        <circle cx="43" cy="84" r="1.8" fill={COR_OURO} />
      </g>

      {/* Casa de Abacaxi do Bob Esponja */}
      <g transform="translate(405, 98)">
        <g className="alga-balanco">
          <path d="M38,34 C16,6 2,4 0,16 C14,18 24,26 32,36 Z" fill="#1e8e45" />
          <path d="M40,32 C26,-4 12,-10 8,4 C22,10 30,22 36,34 Z" fill="#29b358" />
          <path d="M46,32 C44,-12 50,-16 54,2 C52,14 50,24 48,34 Z" fill="#34cc67" />
          <path d="M50,32 C64,-8 78,-8 80,6 C68,12 58,22 52,34 Z" fill="#29b358" />
          <path d="M52,36 C72,8 88,8 90,20 C74,22 62,28 56,38 Z" fill="#1e8e45" />
        </g>
        <path d="M70,54 L86,54 L86,38 L78,38 L78,47 L70,47 Z" fill="#6c96b8" stroke="#2a4d69" strokeWidth="2" />
        <path d="M14,110 C8,66 20,30 46,30 C72,30 84,66 78,110 Z" fill="#ff8c1a" stroke="#9e4700" strokeWidth="2.5" />
        <path
          d="M22,46 L70,92 M16,66 L60,108 M34,34 L76,74 M68,46 L20,92 M74,66 L30,108 M56,34 L16,74"
          stroke="#cc5800"
          strokeWidth="1.7"
          opacity="0.65"
        />
        <circle cx="29" cy="56" r="6.5" fill={COR_VIDRO_MOLLUSCO} stroke="#537d9e" strokeWidth="2.8" />
        <circle cx="63" cy="76" r="6" fill={COR_VIDRO_MOLLUSCO} stroke="#537d9e" strokeWidth="2.6" />
        <path d="M35,110 L35,84 A11,11 0 0,1 57,84 L57,110 Z" fill="#6c96b8" stroke="#2a4d69" strokeWidth="2.4" />
        <circle cx="46" cy="96" r="3.5" fill="none" stroke={COR_OURO} strokeWidth="1.8" />
      </g>

      {/* Barg'N-Mart */}
      <g transform="translate(562, 138)">
        <rect x="0" y="18" width="118" height="52" rx="6" fill="#48cae4" stroke={COR_VIDRO_BORDA} strokeWidth="2.2" />
        <rect x="14" y="4" width="90" height="16" rx="4" fill={COR_AMARELO_SOL} stroke="#9e6d00" strokeWidth="1.8" />
        <rect x="22" y="9" width="74" height="5" rx="2" fill={COR_VERMELHO} />
        <path d="M-4,28 L122,28 L116,18 L2,18 Z" fill={COR_VERMELHO} stroke="#780000" strokeWidth="1.5" />
        <rect x="14" y="36" width="34" height="22" rx="3" fill={COR_JANELA_CLARA} stroke={COR_VIDRO_BORDA} strokeWidth="1.8" />
        <rect x="70" y="36" width="34" height="22" rx="3" fill={COR_JANELA_CLARA} stroke={COR_VIDRO_BORDA} strokeWidth="1.8" />
        <rect x="52" y="42" width="14" height="28" fill="#023e8a" />
      </g>

      {/* Prédios residenciais de escapamento metálico */}
      <g transform="translate(706, 114)">
        <rect x="0" y="14" width="44" height="80" rx="9" fill="#eb6f47" stroke={COR_TELHADO_LARANJA} strokeWidth="2.2" />
        <path d="M14,14 L14,0 L28,0" fill="none" stroke="#eb6f47" strokeWidth="8" strokeLinecap={TRACO_ARREDONDADO} />
        <circle cx="22" cy="36" r="6" fill={COR_AMARELO_LUZ} stroke={COR_TELHADO_LARANJA} strokeWidth="2" />
        <circle cx="22" cy="56" r="6" fill={COR_VIDRO_MOLLUSCO} stroke={COR_TELHADO_LARANJA} strokeWidth="2" />
        <path d="M15,94 L15,76 A7,7 0 0,1 29,76 L29,94 Z" fill="#5c8099" stroke="#233847" strokeWidth="1.8" />

        <rect x="56" y="26" width="42" height="68" rx="8" fill="#52b788" stroke={COR_TELHADO_VERDE} strokeWidth="2.2" />
        <path d="M82,26 L82,12 L94,12" fill="none" stroke="#52b788" strokeWidth="7" strokeLinecap={TRACO_ARREDONDADO} />
        <circle cx="77" cy="46" r="5.5" fill={COR_AMARELO_LUZ} stroke={COR_TELHADO_VERDE} strokeWidth="2" />
        <circle cx="77" cy="64" r="5.5" fill={COR_AMARELO_LUZ} stroke={COR_TELHADO_VERDE} strokeWidth="2" />
      </g>

      {/* Ponto de Ônibus */}
      <g transform="translate(842, 158)">
        <line x1="8" y1="10" x2="8" y2="52" stroke="#ced4da" strokeWidth="3" />
        <circle cx="8" cy="8" r="8" fill={COR_VERMELHO} stroke="#ffffff" strokeWidth="2" />
        <rect x="18" y="38" width="26" height="6" rx="2" fill="#bc6c25" />
        <line x1="22" y1="44" x2="22" y2="52" stroke="#6c3c0c" strokeWidth="2.5" />
        <line x1="40" y1="44" x2="40" y2="52" stroke="#6c3c0c" strokeWidth="2.5" />
      </g>

      {/* O Siri Cascudo */}
      <g transform="translate(896, 118)">
        <rect x="4" y="6" width="5" height="84" fill={COR_MADEIRA} />
        <path d="M-12,14 C-14,-4 26,-4 24,14 Z" fill={COR_VERMELHO} stroke="#fff1d0" strokeWidth="2.2" />
        <circle cx="6" cy="10" r="3" fill={COR_AMARELO_SOL} />

        <path d="M30,90 C30,36 46,24 98,24 C150,24 166,36 166,90 Z" fill="rgba(168, 238, 255, 0.52)" stroke={COR_MADEIRA_ESCURA} strokeWidth="3.5" />
        <path d="M68,90 C68,40 76,24 98,24 C120,24 128,40 128,90" fill="none" stroke={COR_MADEIRA} strokeWidth="4" />
        <rect x="26" y="84" width="144" height="8" rx="2" fill={COR_MADEIRA} />
        <rect x="40" y="22" width="116" height="7" rx="3" fill="#7f4a21" stroke="#47260c" strokeWidth="1.5" />

        <polygon points="44,34 54,34 49,44" fill={COR_VERMELHO} />
        <polygon points="64,36 74,36 69,46" fill={COR_AMARELO_SOL} />
        <polygon points="84,37 94,37 89,47" fill="#00b4d8" />
        <polygon points="104,37 114,37 109,47" fill={COR_VERMELHO} />
        <polygon points="124,36 134,36 129,46" fill={COR_AMARELO_SOL} />
        <polygon points="142,34 152,34 147,44" fill="#2ec4b6" />

        <rect x="84" y="56" width="28" height="34" fill={COR_JANELA_CLARA} stroke={COR_MADEIRA_ESCURA} strokeWidth="2.5" />
        <line x1="98" y1="56" x2="98" y2="90" stroke={COR_MADEIRA_ESCURA} strokeWidth="2" />
      </g>

      {/* O Balde de Lixo */}
      <g transform="translate(1158, 102)">
        <path
          d="M44,36 L40,12 C40,6 47,6 48,14 L50,6 C51,0 58,0 58,10 L60,6 C62,1 68,2 67,12 L69,10 C73,8 76,14 73,22 L68,36 Z"
          fill="#5e60ce"
          stroke="#2b2d42"
          strokeWidth="2.2"
        />
        <rect x="38" y="33" width="36" height="7" rx="3" fill="#4ea8de" stroke="#2b2d42" strokeWidth="2" />
        <polygon points="18,106 26,38 86,38 94,106" fill="#73869c" stroke={COR_METAL_ESCURO} strokeWidth="2.4" />
        <rect x="23" y="36" width="66" height="6" rx="2" fill="#90a4b8" stroke={COR_METAL_ESCURO} strokeWidth="1.8" />
        <path d="M22,52 Q56,82 90,52" fill="none" stroke="#b0c4d8" strokeWidth="3" />
        <rect x="34" y="52" width="44" height="11" rx="3" fill="#80ed99" stroke={COR_METAL_ESCURO} strokeWidth="1.8" />
        <rect x="44" y="78" width="24" height="28" fill="#4a5d70" stroke={COR_METAL_ESCURO} strokeWidth="2" />
      </g>

      {/* Postes Tiki e Corais */}
      {[172, 528, 1118, 1310].map((lx) => (
        <g key={lx} transform={`translate(${lx}, 164)`}>
          <rect x="4" y="10" width="4" height="36" fill="#6b4423" />
          <circle cx="6" cy="8" r="6" fill={COR_AMARELO_LUZ} opacity="0.9" />
          <circle cx="6" cy="8" r="11" fill={COR_AMARELO_LUZ} opacity="0.22" />
        </g>
      ))}

      <g className="alga-balanco">
        <path d="M1355,208 Q1340,174 1358,148 Q1372,126 1352,102" fill="none" stroke="#1ca65c" strokeWidth="8.5" strokeLinecap={TRACO_ARREDONDADO} />
        <path d="M1376,210 Q1390,180 1374,158 Q1362,140 1380,120" fill="none" stroke="#2ad176" strokeWidth="6.5" strokeLinecap={TRACO_ARREDONDADO} />
      </g>

      <g className="alga-balanco-lento">
        <path d="M1402,210 Q1416,178 1400,154 Q1388,134 1406,112" fill="none" stroke={COR_ROSA_AGUA_VIVA} strokeWidth="7.5" strokeLinecap={TRACO_ARREDONDADO} />
      </g>

      {/* Calçada de areia e avenida */}
      <path
        d="M0,206 Q360,198 720,205 T1440,203 L1440,226 L0,226 Z"
        fill="#f6d87e"
      />
      <rect x="0" y="221" width="1440" height="5" fill="#9eb3c2" />
      <rect x="0" y="226" width="1440" height="54" fill="#274257" />
      <line
        x1="0"
        y1="253"
        x2="1440"
        y2="253"
        stroke={COR_OURO}
        strokeWidth="3"
        strokeDasharray="26 20"
      />
    </svg>
  );
}

export default function FundoBiquini() {
  const canvasFundoRef = useRef(null);
  const canvasFrenteRef = useRef(null);
  const svgCenarioRef = useRef(null);

  useEffect(() => {
    const canvasFundo = canvasFundoRef.current;
    const canvasFrente = canvasFrenteRef.current;
    if (!canvasFundo || !canvasFrente) return undefined;

    const ctxFundo = canvasFundo.getContext('2d');
    const ctxFrente = canvasFrente.getContext('2d');

    let largura = window.innerWidth;
    let altura = window.innerHeight;
    let alturaSvg = ALTURA_VIEWBOX;
    let animId;

    const mouse = {
      x: largura * 0.5,
      y: altura * 0.4,
      vx: 0,
      vy: 0,
      ativo: false,
      ultimoRastro: 0,
    };

    const ajustarTamanho = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      largura = window.innerWidth;
      altura = window.innerHeight;
      alturaSvg = svgCenarioRef.current?.clientHeight || ALTURA_VIEWBOX;

      for (const [cv, cx] of [
        [canvasFundo, ctxFundo],
        [canvasFrente, ctxFrente],
      ]) {
        cv.width = largura * dpr;
        cv.height = altura * dpr;
        cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };
    ajustarTamanho();

    const estado = criarEstadoCena(largura, altura);

    const aoMoverMouse = (e) => {
      const agora = performance.now();
      mouse.vx = e.clientX - mouse.x;
      mouse.vy = e.clientY - mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.ativo = true;

      const vel = Math.hypot(mouse.vx, mouse.vy);
      if (vel > 4 && agora - mouse.ultimoRastro > 45 && estado.bolhas.length < 130) {
        mouse.ultimoRastro = agora;
        estado.bolhas.push({
          x: e.clientX + aleatorio(-6, 6),
          y: e.clientY + aleatorio(-6, 6),
          r: aleatorio(2.5, 7.3),
          vx: mouse.vx * 0.08 + aleatorio(-0.4, 0.4),
          vy: -aleatorio(0.9, 2.0),
          fase: aleatorio(0, Math.PI * 2),
          amplitude: 0.4,
          temporaria: true,
          vida: 0.95,
          frente: true,
        });
      }
    };

    const aoClicar = (e) => {
      const alvoInterativo = e.target.closest('button, input, label, a, select, textarea');
      estado.aneis.push({
        x: e.clientX,
        y: e.clientY,
        r: 4,
        maxR: alvoInterativo ? 26 : 50,
        alfa: 0.75,
      });

      const { xParaTela, yParaTela } = obterGeometriaCenario(largura, altura, alturaSvg);
      const yCalcada = yParaTela(217);
      for (const heroi of [estado.moradores.bob, estado.moradores.patrick]) {
        if (Math.hypot(e.clientX - xParaTela(heroi.svgX), e.clientY - (yCalcada - 25)) < 95 && heroi.puloY === 0) {
          heroi.vyPulo = heroi === estado.moradores.bob ? -5.8 : -5.4;
        }
      }

      if (estado.bolhas.length > 145) return;
      const qtd = alvoInterativo ? 4 : 12;
      for (let i = 0; i < qtd; i++) {
        const ang = aleatorio(0, Math.PI * 2);
        const impulso = aleatorio(0.8, 3.3);
        estado.bolhas.push({
          x: e.clientX + Math.cos(ang) * 6,
          y: e.clientY + Math.sin(ang) * 6,
          r: aleatorio(3, 10.2),
          vx: Math.cos(ang) * impulso,
          vy: Math.sin(ang) * impulso - 1.2,
          fase: aleatorio(0, Math.PI * 2),
          amplitude: 0.45,
          temporaria: true,
          vida: 1,
          frente: true,
        });
      }
    };

    window.addEventListener('resize', ajustarTamanho);
    window.addEventListener('mousemove', aoMoverMouse, { passive: true });
    window.addEventListener('pointerdown', aoClicar, { passive: true });

    let ultimoQuadro = performance.now();
    const inicio = ultimoQuadro;

    const animar = (agora) => {
      const dt = Math.min((agora - ultimoQuadro) / 1000, 0.05);
      ultimoQuadro = agora;
      const tempo = (agora - inicio) / 1000;

      ctxFundo.clearRect(0, 0, largura, altura);
      ctxFrente.clearRect(0, 0, largura, altura);

      const desvioMouseX = mouse.x - largura * 0.5;
      const desvioMouseY = mouse.y - altura * 0.5;
      const geom = obterGeometriaCenario(largura, altura, alturaSvg);

      desenharRaiosSol(ctxFundo, tempo, largura, altura, desvioMouseX);
      atualizarFlores(ctxFundo, estado.flores, largura, desvioMouseX, desvioMouseY);
      atualizarPeixes(ctxFundo, estado.peixes, mouse, tempo, largura, altura);
      atualizarAguasVivas(ctxFundo, estado.aguasVivas, mouse, tempo, largura, altura);

      desenharMoradores(ctxFrente, estado.moradores, geom, mouse, tempo, dt);
      atualizarVeiculos(ctxFrente, estado.veiculos, estado.bolhas, geom, tempo, dt, agora);
      atualizarBolhas(ctxFundo, ctxFrente, estado, mouse, largura, altura, tempo);
      atualizarAneis(ctxFrente, estado.aneis);

      mouse.vx *= 0.8;
      mouse.vy *= 0.8;

      animId = requestAnimationFrame(animar);
    };

    animId = requestAnimationFrame(animar);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', ajustarTamanho);
      window.removeEventListener('mousemove', aoMoverMouse);
      window.removeEventListener('pointerdown', aoClicar);
    };
  }, []);

  return (
    <div className="fundo-biquini" aria-hidden="true">
      <canvas ref={canvasFundoRef} className="canvas-biquini" />
      <CenarioFendaBiquini svgRef={svgCenarioRef} />
      <canvas ref={canvasFrenteRef} className="canvas-personagens" />
    </div>
  );
}

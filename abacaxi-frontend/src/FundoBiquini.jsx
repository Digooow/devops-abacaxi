import { useEffect, useRef } from 'react';

const CORES_FLORES = [
  { preenchimento: 'rgba(122, 245, 255, 0.22)', borda: 'rgba(168, 252, 255, 0.45)' },
  { preenchimento: 'rgba(255, 138, 192, 0.22)', borda: 'rgba(255, 182, 217, 0.45)' },
  { preenchimento: 'rgba(255, 232, 99, 0.22)', borda: 'rgba(255, 243, 158, 0.45)' },
  { preenchimento: 'rgba(196, 148, 255, 0.20)', borda: 'rgba(220, 190, 255, 0.42)' },
  { preenchimento: 'rgba(130, 255, 198, 0.20)', borda: 'rgba(178, 255, 220, 0.42)' },
];

const ESCALA_PETALAS = [1.0, 0.92, 1.06, 0.94, 1.02];

function criarBolha(largura, altura, aleatorioY = false) {
  const r = 4 + Math.random() * 16;
  return {
    x: Math.random() * largura,
    y: aleatorioY ? Math.random() * altura : altura + r + Math.random() * 60,
    r,
    vy: -(0.45 + (20 - r) * 0.05 + Math.random() * 0.4),
    vx: 0,
    fase: Math.random() * Math.PI * 2,
    amplitude: 0.3 + Math.random() * 0.7,
    temporaria: false,
    vida: 1,
  };
}

function desenharFlorBiquini(ctx, x, y, raio, angulo, cor) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angulo);
  ctx.fillStyle = cor.preenchimento;
  ctx.strokeStyle = cor.borda;
  ctx.lineWidth = 2.4;

  for (let k = 0; k < 5; k++) {
    ctx.save();
    ctx.rotate((k * Math.PI * 2) / 5);
    const rp = raio * ESCALA_PETALAS[k];
    const ri = raio * 0.27;
    ctx.beginPath();
    ctx.moveTo(ri * 0.7, -ri * 0.55);
    ctx.bezierCurveTo(rp * 0.55, -rp * 0.68, rp * 1.05, -rp * 0.48, rp, 0);
    ctx.bezierCurveTo(rp * 1.05, rp * 0.48, rp * 0.55, rp * 0.68, ri * 0.7, ri * 0.55);
    ctx.quadraticCurveTo(ri * 0.95, 0, ri * 0.7, -ri * 0.55);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(0, 0, raio * 0.24, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function desenharAguaViva(ctx, av, tempo) {
  const pulso = Math.sin(tempo * 3.8 + av.fase);
  const escX = 1 + pulso * 0.11;
  const escY = 1 - pulso * 0.09;

  ctx.save();
  ctx.translate(av.x, av.y);
  ctx.rotate(av.inclinacao);
  ctx.scale(escX, escY);

  // Tentáculos ondulantes
  ctx.strokeStyle = 'rgba(255, 166, 214, 0.82)';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  const posTentaculos = [-10, -3.5, 3.5, 10];
  for (let i = 0; i < posTentaculos.length; i++) {
    const tx = posTentaculos[i];
    ctx.beginPath();
    ctx.moveTo(tx, 6);
    const onda1 = Math.sin(tempo * 5.5 + av.fase + i) * 5;
    const onda2 = Math.cos(tempo * 5.5 + av.fase + i * 1.4) * 6;
    ctx.bezierCurveTo(tx + onda1, 16, tx - onda2, 24, tx + onda1 * 0.7, 32);
    ctx.stroke();
  }

  // Cúpula rosa da água-viva
  ctx.fillStyle = 'rgba(255, 110, 184, 0.86)';
  ctx.strokeStyle = 'rgba(209, 46, 130, 0.85)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 4, 17, Math.PI, 0, false);
  ctx.quadraticCurveTo(12, 10, 6, 7);
  ctx.quadraticCurveTo(0, 10, -6, 7);
  ctx.quadraticCurveTo(-12, 10, -17, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Manchinhas clássicas da água-viva da Fenda do Biquíni
  ctx.fillStyle = 'rgba(214, 41, 132, 0.65)';
  ctx.beginPath();
  ctx.ellipse(-6, -3, 3.2, 2.2, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(6, -2, 2.8, 2.0, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -8, 2.5, 1.8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Brilho na cúpula
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.ellipse(-7, -7, 4, 1.8, -0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function desenharBolha(ctx, b) {
  ctx.save();
  ctx.globalAlpha = b.vida;

  const grad = ctx.createRadialGradient(
    b.x - b.r * 0.3,
    b.y - b.r * 0.3,
    b.r * 0.1,
    b.x,
    b.y,
    b.r
  );
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
  grad.addColorStop(0.7, 'rgba(173, 240, 255, 0.14)');
  grad.addColorStop(1, 'rgba(220, 252, 255, 0.55)');

  ctx.fillStyle = grad;
  ctx.strokeStyle = 'rgba(230, 252, 255, 0.72)';
  ctx.lineWidth = Math.max(1, b.r * 0.09);
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Reflexo principal
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.beginPath();
  ctx.ellipse(
    b.x - b.r * 0.34,
    b.y - b.r * 0.34,
    Math.max(1.2, b.r * 0.24),
    Math.max(0.8, b.r * 0.13),
    -0.6,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.restore();
}

export default function FundoBiquini() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');

    let largura = window.innerWidth;
    let altura = window.innerHeight;
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
      canvas.width = largura * dpr;
      canvas.height = altura * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    ajustarTamanho();

    // Flores clássicas do céu da Fenda do Biquíni
    const flores = Array.from({ length: 6 }, (_, i) => ({
      x: (largura / 6) * i + Math.random() * 120,
      y: 55 + (i % 3) * 85 + Math.random() * 35,
      raio: 36 + (i % 3) * 16,
      angulo: Math.random() * Math.PI * 2,
      velRot: (i % 2 === 0 ? 1 : -1) * (0.0015 + Math.random() * 0.0015),
      velX: 0.12 + Math.random() * 0.15,
      paralaxe: 0.015 + (i % 3) * 0.012,
      cor: CORES_FLORES[i % CORES_FLORES.length],
    }));

    // Águas-vivas nadando pelo fundo
    const aguasVivas = Array.from({ length: 4 }, (_, i) => ({
      x: largura * (0.15 + i * 0.24),
      y: altura * (0.24 + (i % 2) * 0.22),
      vx: (i % 2 === 0 ? 1 : -1) * (0.35 + Math.random() * 0.25),
      vy: 0,
      fase: i * 1.7,
      inclinacao: 0,
    }));

    // Bolhas do oceano
    const bolhas = Array.from({ length: 42 }, () => criarBolha(largura, altura, true));
    const aneis = [];

    const estourarBolha = (b) => {
      aneis.push({ x: b.x, y: b.y, r: b.r * 0.6, maxR: b.r * 2.4, alfa: 0.75 });
      for (let i = 0; i < 4; i++) {
        const ang = (Math.PI * 2 * i) / 4 + Math.random() * 0.6;
        bolhas.push({
          x: b.x + Math.cos(ang) * 4,
          y: b.y + Math.sin(ang) * 4,
          r: 2.2 + Math.random() * 2.8,
          vx: Math.cos(ang) * (1.2 + Math.random()),
          vy: -1.2 + Math.sin(ang) * 0.8,
          fase: Math.random() * Math.PI * 2,
          amplitude: 0.3,
          temporaria: true,
          vida: 0.95,
        });
      }
    };

    const aoMoverMouse = (e) => {
      const agora = performance.now();
      mouse.vx = e.clientX - mouse.x;
      mouse.vy = e.clientY - mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.ativo = true;

      const vel = Math.hypot(mouse.vx, mouse.vy);
      if (vel > 4 && agora - mouse.ultimoRastro > 42 && bolhas.length < 110) {
        mouse.ultimoRastro = agora;
        bolhas.push({
          x: e.clientX + (Math.random() - 0.5) * 12,
          y: e.clientY + (Math.random() - 0.5) * 12,
          r: 2.5 + Math.random() * 5,
          vx: mouse.vx * 0.08 + (Math.random() - 0.5) * 0.8,
          vy: -(0.9 + Math.random() * 1.1),
          fase: Math.random() * Math.PI * 2,
          amplitude: 0.4,
          temporaria: true,
          vida: 0.95,
        });
      }
    };

    const aoClicar = (e) => {
      const alvoInterativo = e.target.closest('button, input, label, a, select, textarea');
      const qtd = alvoInterativo ? 4 : 12;
      aneis.push({
        x: e.clientX,
        y: e.clientY,
        r: 4,
        maxR: alvoInterativo ? 26 : 48,
        alfa: 0.7,
      });

      if (bolhas.length > 130) return;
      for (let i = 0; i < qtd; i++) {
        const ang = Math.random() * Math.PI * 2;
        const impulso = 0.8 + Math.random() * 2.4;
        bolhas.push({
          x: e.clientX + Math.cos(ang) * 6,
          y: e.clientY + Math.sin(ang) * 6,
          r: 3 + Math.random() * 7.5,
          vx: Math.cos(ang) * impulso,
          vy: Math.sin(ang) * impulso - 1.2,
          fase: Math.random() * Math.PI * 2,
          amplitude: 0.45,
          temporaria: true,
          vida: 1,
        });
      }
    };

    window.addEventListener('resize', ajustarTamanho);
    window.addEventListener('mousemove', aoMoverMouse, { passive: true });
    window.addEventListener('pointerdown', aoClicar, { passive: true });

    const inicio = performance.now();

    const animar = (agora) => {
      const tempo = (agora - inicio) / 1000;
      ctx.clearRect(0, 0, largura, altura);

      const desvioMouseX = (mouse.x - largura * 0.5);
      const desvioMouseY = (mouse.y - altura * 0.5);

      // 1. Raios de sol subaquáticos vindos da superfície
      for (let i = 0; i < 5; i++) {
        const baseX = largura * (0.12 + i * 0.2) + Math.sin(tempo * 0.42 + i) * 35 - desvioMouseX * 0.02;
        const inclinacao = 90 + Math.sin(tempo * 0.3 + i * 1.2) * 30;
        const largTopo = 45 + (i % 2) * 25;
        const largBase = 130 + (i % 3) * 35;
        const alcanceY = altura * 0.78;

        const gradRaio = ctx.createLinearGradient(baseX, 0, baseX + inclinacao, alcanceY);
        gradRaio.addColorStop(0, 'rgba(195, 252, 255, 0.20)');
        gradRaio.addColorStop(0.55, 'rgba(120, 235, 255, 0.07)');
        gradRaio.addColorStop(1, 'rgba(120, 235, 255, 0)');

        ctx.fillStyle = gradRaio;
        ctx.beginPath();
        ctx.moveTo(baseX - largTopo / 2, -10);
        ctx.lineTo(baseX + largTopo / 2, -10);
        ctx.lineTo(baseX + inclinacao + largBase / 2, alcanceY);
        ctx.lineTo(baseX + inclinacao - largBase / 2, alcanceY);
        ctx.closePath();
        ctx.fill();
      }

      // 2. Flores tropicais no céu do oceano (com paralaxe suave no mouse)
      for (const flor of flores) {
        flor.x += flor.velX;
        flor.angulo += flor.velRot;
        if (flor.x - flor.raio > largura + 80) {
          flor.x = -flor.raio - 60;
        }
        const fx = flor.x - desvioMouseX * flor.paralaxe;
        const fy = flor.y - desvioMouseY * flor.paralaxe;
        desenharFlorBiquini(ctx, fx, fy, flor.raio, flor.angulo, flor.cor);
      }

      // 3. Águas-vivas rosa nadando e reagindo ao cursor
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

        // Mantém na faixa visível do oceano
        if (av.y < 65) av.vy += 0.15;
        if (av.y > altura - 150) av.vy -= 0.2;
        if (av.x > largura + 45) av.x = -40;
        if (av.x < -45) av.x = largura + 40;

        av.inclinacao = av.vx * 0.22 + Math.sin(tempo * 2 + av.fase) * 0.08;
        desenharAguaViva(ctx, av, tempo);
      }

      // 4. Bolhas flutuantes e interativas
      const velCursor = Math.hypot(mouse.vx, mouse.vy);
      for (let i = bolhas.length - 1; i >= 0; i--) {
        const b = bolhas[i];
        b.y += b.vy;
        b.x += Math.sin(tempo * 2.1 + b.fase) * b.amplitude + b.vx;
        b.vx *= 0.95;

        if (mouse.ativo) {
          const dx = b.x - mouse.x;
          const dy = b.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (b.r > 9 && velCursor > 8 && dist < b.r + 12) {
            estourarBolha(b);
            if (b.temporaria) {
              bolhas.splice(i, 1);
            } else {
              Object.assign(b, criarBolha(largura, altura, false));
            }
            continue;
          } else if (dist < 105 && dist > 1) {
            const empurrao = ((105 - dist) / 105) * 0.85;
            b.vx += (dx / dist) * empurrao;
            b.y += (dy / dist) * empurrao * 0.4;
          }
        }

        if (b.temporaria) {
          b.vida -= 0.008;
          if (b.vida <= 0.04 || b.y < -30) {
            bolhas.splice(i, 1);
            continue;
          }
        } else if (b.y < -b.r - 20) {
          Object.assign(b, criarBolha(largura, altura, false));
        }

        desenharBolha(ctx, b);
      }

      // 5. Anéis de ondulação na água (ao clicar ou estourar bolhas)
      for (let i = aneis.length - 1; i >= 0; i--) {
        const anel = aneis[i];
        anel.r += (anel.maxR - anel.r) * 0.14 + 0.8;
        anel.alfa -= 0.028;
        if (anel.alfa <= 0) {
          aneis.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.strokeStyle = `rgba(220, 252, 255, ${anel.alfa})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(anel.x, anel.y, anel.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

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
      <canvas ref={canvasRef} className="canvas-biquini" />

      <svg
        className="cenario-areia"
        viewBox="0 0 1440 210"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Colinas submarinas ao fundo */}
        <path
          d="M0,155 Q220,105 470,142 T980,132 T1440,148 L1440,210 L0,210 Z"
          fill="#065a82"
          opacity="0.55"
        />

        {/* Pedra do Patrick (esquerda) */}
        <g transform="translate(115, 118)">
          <line x1="38" y1="-16" x2="38" y2="2" stroke="#d9a441" strokeWidth="2.5" />
          <polygon points="28,-12 50,-12 46,-17 32,-17" fill="#ffd166" />
          <path d="M4,38 A34,32 0 0,1 72,38 Z" fill="#7c4222" stroke="#4d2611" strokeWidth="2" />
        </g>

        {/* Casa Moai do Lula Molusco */}
        <g transform="translate(225, 76)">
          <polygon points="10,80 18,8 54,8 62,80" fill="#2f667a" stroke="#1b4252" strokeWidth="2" />
          <rect x="13" y="20" width="46" height="8" rx="3" fill="#234f61" />
          <polygon points="32,26 28,54 44,54 40,26" fill="#3b7a91" stroke="#1b4252" strokeWidth="1.5" />
          <circle cx="23" cy="36" r="5.5" fill="#7ad7f0" stroke="#1b4252" strokeWidth="2" />
          <circle cx="49" cy="36" r="5.5" fill="#7ad7f0" stroke="#1b4252" strokeWidth="2" />
          <path d="M27,80 L27,63 A9,9 0 0,1 45,63 L45,80 Z" fill="#9c6634" stroke="#4d2e14" strokeWidth="2" />
        </g>

        {/* Casa de Abacaxi do Bob Esponja (direita) */}
        <g transform="translate(1195, 58)">
          {/* Coroa de folhas verdes balançando */}
          <g className="alga-balanco">
            <path d="M38,34 C18,6 4,4 2,16 C14,18 24,26 32,36 Z" fill="#1e8e45" />
            <path d="M40,32 C26,-2 14,-8 10,4 C22,10 30,22 36,34 Z" fill="#29b358" />
            <path d="M44,32 C42,-10 48,-14 52,2 C50,14 48,24 46,34 Z" fill="#34cc67" />
            <path d="M48,32 C62,-6 76,-6 78,6 C66,12 56,22 50,34 Z" fill="#29b358" />
            <path d="M50,36 C70,8 84,8 86,20 C72,22 60,28 54,38 Z" fill="#1e8e45" />
          </g>

          {/* Chaminé azul metálica */}
          <path
            d="M66,52 L82,52 L82,36 L74,36 L74,45 L66,45 Z"
            fill="#6c96b8"
            stroke="#2a4d69"
            strokeWidth="2"
          />

          {/* Corpo do Abacaxi */}
          <path
            d="M16,98 C10,60 22,30 44,30 C66,30 78,60 72,98 Z"
            fill="#ff8c1a"
            stroke="#9e4700"
            strokeWidth="2.5"
          />
          {/* Textura cruzada do abacaxi */}
          <path
            d="M24,44 L66,84 M18,62 L56,96 M34,34 L72,70 M64,44 L22,84 M70,62 L32,96 M54,34 L16,70"
            stroke="#cc5800"
            strokeWidth="1.6"
            opacity="0.65"
          />

          {/* Janelinhas de escotilha e porta */}
          <circle cx="29" cy="54" r="6" fill="#9be7ff" stroke="#537d9e" strokeWidth="2.8" />
          <circle cx="60" cy="72" r="5.5" fill="#9be7ff" stroke="#537d9e" strokeWidth="2.6" />
          <path
            d="M34,98 L34,76 A10,10 0 0,1 54,76 L54,98 Z"
            fill="#6c96b8"
            stroke="#2a4d69"
            strokeWidth="2.4"
          />
          <circle cx="49" cy="87" r="2" fill="#ffd166" />
        </g>

        {/* Algas e corais balançando */}
        <g className="alga-balanco">
          <path
            d="M68,175 Q56,145 70,122 Q82,102 66,84"
            fill="none"
            stroke="#1ca65c"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M86,178 Q98,152 84,134 Q74,118 88,104"
            fill="none"
            stroke="#2ad176"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>

        <g className="alga-balanco-lento">
          <path
            d="M1340,176 Q1354,146 1338,124 Q1324,104 1342,82"
            fill="none"
            stroke="#ff6b9d"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M1360,180 Q1374,155 1360,136"
            fill="none"
            stroke="#ff9ebb"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
        </g>

        {/* Dunas de areia dourada da Fenda do Biquíni */}
        <path
          d="M0,158 Q260,130 560,156 T1120,148 T1440,156 L1440,210 L0,210 Z"
          fill="#e7c15a"
        />
        <path
          d="M0,174 Q360,148 740,172 T1440,166 L1440,210 L0,210 Z"
          fill="#f6d87e"
        />

        {/* Pedrinhas na areia */}
        <ellipse cx="195" cy="188" rx="9" ry="3.5" fill="#d9af48" />
        <ellipse cx="520" cy="192" rx="12" ry="4" fill="#d9af48" />
        <ellipse cx="940" cy="186" rx="10" ry="3.5" fill="#d9af48" />
        <ellipse cx="1290" cy="190" rx="11" ry="3.8" fill="#d9af48" />
      </svg>
    </div>
  );
}

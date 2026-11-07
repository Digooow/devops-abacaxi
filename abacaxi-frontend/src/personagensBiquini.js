// Renderizadores vetoriais em Canvas 2D da fauna, veículos e moradores da Fenda do Biquíni

const ESCALA_PETALAS = [1.0, 0.92, 1.06, 0.94, 1.02];

export function desenharFlorBiquini(ctx, x, y, raio, angulo, cor) {
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

export function desenharPeixeCidadao(ctx, p, tempo) {
  const abanar = Math.sin(tempo * 9 + p.fase) * 4;
  ctx.save();
  ctx.translate(p.x, p.y);
  if (p.vx < 0) ctx.scale(-1, 1);
  ctx.scale(p.escala, p.escala);

  // Cauda animada
  ctx.fillStyle = p.corSecundaria;
  ctx.strokeStyle = 'rgba(8, 45, 75, 0.65)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.lineTo(-21, -7 + abanar * 0.5);
  ctx.quadraticCurveTo(-18, abanar * 0.3, -21, 7 + abanar * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Nadadeira dorsal
  ctx.beginPath();
  ctx.moveTo(-4, -7);
  ctx.quadraticCurveTo(2, -14, 6, -6);
  ctx.fill();
  ctx.stroke();

  // Corpo oval estilo peixe da Fenda do Biquíni
  ctx.fillStyle = p.corPrimaria;
  ctx.beginPath();
  ctx.ellipse(0, 0, 14, 8.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Listras ou detalhe na barriga
  ctx.fillStyle = p.corSecundaria;
  ctx.beginPath();
  ctx.ellipse(-1, 3.5, 9, 3, 0, 0, Math.PI);
  ctx.fill();

  // Olho expressivo e boca
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(7.5, -2, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#092c48';
  ctx.beginPath();
  ctx.arc(8.5, -2, 1.4, 0, Math.PI * 2);
  ctx.fill();

  // Lábios simpáticos estilo cartoon
  ctx.strokeStyle = 'rgba(8, 45, 75, 0.75)';
  ctx.beginPath();
  ctx.arc(11.5, 2.2, 2.2, 0.3, Math.PI - 0.2);
  ctx.stroke();

  ctx.restore();
}

export function desenharAguaViva(ctx, av, tempo) {
  const pulso = Math.sin(tempo * 3.8 + av.fase);
  const escX = 1 + pulso * 0.11;
  const escY = 1 - pulso * 0.09;

  ctx.save();
  ctx.translate(av.x, av.y);
  ctx.rotate(av.inclinacao);
  ctx.scale(escX, escY);

  ctx.strokeStyle = 'rgba(255, 166, 214, 0.85)';
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

  ctx.fillStyle = 'rgba(255, 110, 184, 0.88)';
  ctx.strokeStyle = 'rgba(209, 46, 130, 0.88)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 4, 17, Math.PI, 0, false);
  ctx.quadraticCurveTo(12, 10, 6, 7);
  ctx.quadraticCurveTo(0, 10, -6, 7);
  ctx.quadraticCurveTo(-12, 10, -17, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

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

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.ellipse(-7, -7, 4, 1.8, -0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function desenharBolha(ctx, b) {
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
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  grad.addColorStop(0.7, 'rgba(173, 240, 255, 0.15)');
  grad.addColorStop(1, 'rgba(220, 252, 255, 0.58)');

  ctx.fillStyle = grad;
  ctx.strokeStyle = 'rgba(230, 252, 255, 0.76)';
  ctx.lineWidth = Math.max(1, b.r * 0.09);
  ctx.beginPath();
  ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
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

// ---------------- PERSONAGENS ANIMADOS ----------------

export function desenharBobEsponja(ctx, x, yChao, escala, tempo, dir, puloY = 0) {
  const passo = Math.sin(tempo * 8.5);
  const quique = Math.abs(passo) * 2.5;

  ctx.save();
  ctx.translate(x, yChao + puloY - quique);
  ctx.scale(dir * escala, escala);

  // Sombra no chão
  if (puloY > -2) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.beginPath();
    ctx.ellipse(0, quique, 14, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pernas animadas com meias listradas e sapatos pretos
  for (const lado of [-1, 1]) {
    const angPerna = passo * 0.42 * lado;
    ctx.save();
    ctx.translate(lado * 5.5, -13);
    ctx.rotate(angPerna);

    // Canela amarela + meia branca
    ctx.strokeStyle = '#d4a800';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 7);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, 6);
    ctx.lineTo(0, 11);
    ctx.stroke();

    // Listras azul e vermelha da meia
    ctx.strokeStyle = '#2196f3';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-1.8, 7.2);
    ctx.lineTo(1.8, 7.2);
    ctx.stroke();
    ctx.strokeStyle = '#e53935';
    ctx.beginPath();
    ctx.moveTo(-1.8, 8.8);
    ctx.lineTo(1.8, 8.8);
    ctx.stroke();

    // Sapato preto lustroso
    ctx.fillStyle = '#1c1c1c';
    ctx.beginPath();
    ctx.ellipse(2, 12, 4.6, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Braço de trás segurando a rede de caçar água-viva
  ctx.save();
  ctx.translate(11, -30);
  ctx.rotate(Math.sin(tempo * 6) * 0.35 - 0.35 + (puloY < -4 ? -0.6 : 0));
  // Manga branca
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#5c4400';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Braço amarelo
  ctx.strokeStyle = '#ffe933';
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.moveTo(1, 1);
  ctx.lineTo(9, -6);
  ctx.stroke();
  // Cabo e rede de água-viva
  ctx.strokeStyle = '#b57c3c';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(6, -2);
  ctx.lineTo(20, -22);
  ctx.stroke();
  ctx.strokeStyle = '#8c5820';
  ctx.lineWidth = 1.8;
  ctx.fillStyle = 'rgba(255, 190, 228, 0.55)';
  ctx.beginPath();
  ctx.ellipse(22, -25, 6.5, 4.5, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Calça quadrada marrom + camisa branca
  ctx.fillStyle = '#8d5320';
  ctx.strokeStyle = '#3d220a';
  ctx.lineWidth = 1.6;
  ctx.fillRect(-13, -20, 26, 7.5);
  ctx.strokeRect(-13, -20, 26, 7.5);

  // Cinto tracejado preto
  ctx.fillStyle = '#1a1a1a';
  for (let bx = -10; bx <= 8; bx += 6) {
    ctx.fillRect(bx, -19.5, 3.5, 1.8);
  }

  // Camisa branca
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-13, -25, 26, 5.2);
  ctx.strokeRect(-13, -25, 26, 5.2);

  // Gravata vermelha
  ctx.fillStyle = '#e52424';
  ctx.beginPath();
  ctx.moveTo(-2, -25);
  ctx.lineTo(2, -25);
  ctx.lineTo(3, -18);
  ctx.lineTo(0, -15.5);
  ctx.lineTo(-3, -18);
  ctx.closePath();
  ctx.fill();

  // Corpo amarelo de esponja
  ctx.fillStyle = '#fff033';
  ctx.strokeStyle = '#9e7d00';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(-14, -49, 28, 24.5, 3);
  ctx.fill();
  ctx.stroke();

  // Poros verde-oliva da esponja
  ctx.fillStyle = '#b5be19';
  ctx.beginPath();
  ctx.arc(-9.5, -44, 2.1, 0, Math.PI * 2);
  ctx.arc(9.5, -45, 1.7, 0, Math.PI * 2);
  ctx.arc(-10, -30, 1.6, 0, Math.PI * 2);
  ctx.arc(10.5, -31, 2.2, 0, Math.PI * 2);
  ctx.fill();

  // Olhos grandes expressivos com cílios
  for (const ox of [-4.6, 4.6]) {
    ctx.strokeStyle = '#1c1c1c';
    ctx.lineWidth = 1.3;
    for (const ci of [-2, 0, 2]) {
      ctx.beginPath();
      ctx.moveTo(ox + ci * 0.9, -42);
      ctx.lineTo(ox + ci * 1.2, -44.8);
      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#2b2b2b';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(ox, -38.5, 4.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#36b5ff';
    ctx.beginPath();
    ctx.arc(ox + 0.8, -38.5, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(ox + 1.0, -38.5, 1.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Nariz comprido amarelo
  ctx.fillStyle = '#fff033';
  ctx.strokeStyle = '#8a6c00';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(1, -37.5);
  ctx.quadraticCurveTo(9, -39, 8.5, -36);
  ctx.quadraticCurveTo(8, -34, 1, -35);
  ctx.fill();
  ctx.stroke();

  // Sorriso largo + 2 dentinhos brancos
  ctx.strokeStyle = '#5c2600';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0.5, -34, 7.2, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#4a3500';
  ctx.lineWidth = 1;
  ctx.fillRect(-2.8, -29.8, 2.6, 3.2);
  ctx.strokeRect(-2.8, -29.8, 2.6, 3.2);
  ctx.fillRect(0.8, -29.8, 2.6, 3.2);
  ctx.strokeRect(0.8, -29.8, 2.6, 3.2);

  // Bochechas rosadas
  ctx.fillStyle = 'rgba(255, 102, 102, 0.65)';
  ctx.beginPath();
  ctx.arc(-7.2, -33.5, 1.8, 0, Math.PI * 2);
  ctx.arc(7.8, -33.5, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Braço da frente balançando
  ctx.save();
  ctx.translate(-13, -30);
  ctx.rotate(-passo * 0.45 + (puloY < -4 ? 0.8 : 0));
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#5c4400';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = '#ffe933';
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.moveTo(0, 2);
  ctx.lineTo(-4, 11);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

export function desenharPatrick(ctx, x, yChao, escala, tempo, dir, puloY = 0) {
  const passo = Math.sin(tempo * 7.4 + 1.2);
  const quique = Math.abs(passo) * 2.2;

  ctx.save();
  ctx.translate(x, yChao + puloY - quique);
  ctx.scale(dir * escala, escala);

  if (puloY > -2) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.17)';
    ctx.beginPath();
    ctx.ellipse(0, quique, 14, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Perninhas rosa pontudas
  for (const lado of [-1, 1]) {
    ctx.save();
    ctx.translate(lado * 5.5, -12);
    ctx.rotate(passo * 0.38 * lado);
    ctx.fillStyle = '#ff8fa3';
    ctx.strokeStyle = '#b5435b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-3.5, 0);
    ctx.lineTo(3.5, 0);
    ctx.lineTo(1.5, 12);
    ctx.lineTo(-1.5, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Corpo/cabeça cônica de estrela-do-mar rosa
  ctx.fillStyle = '#ff8fa3';
  ctx.strokeStyle = '#b5435b';
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.moveTo(0, -54);
  ctx.quadraticCurveTo(8, -42, 13, -24);
  ctx.quadraticCurveTo(14, -14, -13, -14);
  ctx.quadraticCurveTo(-14, -24, -8, -42);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Braços pontudos de estrela balançando
  for (const lado of [-1, 1]) {
    ctx.save();
    ctx.translate(lado * 10, -29);
    ctx.rotate(
      lado * (0.45 + (puloY < -4 ? -0.9 : 0)) + passo * 0.32
    );
    ctx.fillStyle = '#ff8fa3';
    ctx.strokeStyle = '#b5435b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -3.5);
    ctx.lineTo(lado * 11, 4);
    ctx.lineTo(0, 4.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Bermuda verde-limão com flores roxas
  ctx.fillStyle = '#a7e838';
  ctx.strokeStyle = '#4e7a10';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-13, -22, 26, 10.5, 3);
  ctx.fill();
  ctx.stroke();

  // Faixa roxa na cintura + florzinhas
  ctx.fillStyle = '#7e3ff2';
  ctx.fillRect(-12.5, -22, 25, 2.4);
  ctx.beginPath();
  ctx.arc(-5, -16, 2.2, 0, Math.PI * 2);
  ctx.arc(5, -15.5, 2.0, 0, Math.PI * 2);
  ctx.fill();

  // Olhos + sobrancelhas grossas em Z
  for (const ox of [-3.3, 3.3]) {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#2b2b2b';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(ox, -37.5, 3.2, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(ox + 0.6, -37.5, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Sobrancelha preta característica
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(ox - 2.4, -43.2);
    ctx.lineTo(ox + 2.4, -44);
    ctx.stroke();
  }

  // Sorriso divertido do Patrick
  ctx.strokeStyle = '#6e1b2e';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0.5, -32.5, 5.5, 0.15, Math.PI - 0.15);
  ctx.stroke();

  ctx.restore();
}

export function desenharGary(ctx, x, yChao, escala, tempo, dir) {
  const deslize = Math.sin(tempo * 5) * 0.8;
  ctx.save();
  ctx.translate(x, yChao);
  ctx.scale(dir * escala, escala);

  // Base azul do caracol
  ctx.fillStyle = '#56c7f5';
  ctx.strokeStyle = '#1b6d91';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(-12, -5.5, 25 + deslize, 5.5, 3);
  ctx.fill();
  ctx.stroke();

  // Antenas dos olhos balançando
  for (const [ox, desfase] of [
    [7.5, 0],
    [11, 0.9],
  ]) {
    const inclinacao = Math.sin(tempo * 4.5 + desfase) * 1.5;
    ctx.strokeStyle = '#56c7f5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ox, -5);
    ctx.lineTo(ox + inclinacao, -15);
    ctx.stroke();

    ctx.fillStyle = '#fff59d';
    ctx.strokeStyle = '#1b6d91';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.arc(ox + inclinacao, -16.5, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#d62839';
    ctx.beginPath();
    ctx.arc(ox + inclinacao + 0.5, -16.5, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Concha rosa com espiral vermelha e pintinhas roxas
  ctx.fillStyle = '#ff9ebb';
  ctx.strokeStyle = '#a8385b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(-2, -12, 8.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#d62839';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(-2, -12, 5, 0, Math.PI * 1.6);
  ctx.stroke();

  ctx.fillStyle = '#8e4dff';
  ctx.beginPath();
  ctx.arc(-6, -15, 1.3, 0, Math.PI * 2);
  ctx.arc(-5, -9.5, 1.2, 0, Math.PI * 2);
  ctx.arc(2, -16, 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function desenharLulaMolusco(ctx, x, yChao, escala, tempo, dir) {
  const passo = Math.sin(tempo * 6.2);
  ctx.save();
  ctx.translate(x, yChao);
  ctx.scale(dir * escala, escala);

  // 4 tentáculos turquesa caminhando
  ctx.strokeStyle = '#7ec4b0';
  ctx.lineWidth = 3.2;
  ctx.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    const off = (i - 1.5) * 3.4;
    const osc = Math.sin(tempo * 6.2 + i * 1.4) * 3.5;
    ctx.beginPath();
    ctx.moveTo(off * 0.5, -18);
    ctx.quadraticCurveTo(off, -9, off + osc, -1);
    ctx.stroke();
  }

  // Camisa polo marrom
  ctx.fillStyle = '#a65e26';
  ctx.strokeStyle = '#4f2a0d';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-7.5, -31, 15, 13.5, 2);
  ctx.fill();
  ctx.stroke();

  // Braços
  ctx.strokeStyle = '#7ec4b0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-7, -28);
  ctx.lineTo(-9 + passo * 2, -18);
  ctx.moveTo(7, -28);
  ctx.lineTo(9 - passo * 2, -18);
  ctx.stroke();

  // Cabeça grande oval turquesa
  ctx.fillStyle = '#85ccb8';
  ctx.strokeStyle = '#2d6355';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.ellipse(0, -45, 11, 9.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(-6.5, -38, 13, 7.5, 2);
  ctx.fill();
  ctx.stroke();

  // Olhos amarelos semicerrados mal-humorados
  for (const ox of [-3.2, 3.2]) {
    ctx.fillStyle = '#fff59d';
    ctx.strokeStyle = '#2d6355';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(ox, -42.5, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pálpebra caída
    ctx.fillStyle = '#6db39f';
    ctx.beginPath();
    ctx.ellipse(ox, -44.5, 3.1, 2.1, 0, Math.PI, 0, true);
    ctx.fill();

    ctx.fillStyle = '#7a1c1c';
    ctx.fillRect(ox - 0.8, -42, 1.8, 2.2);
  }

  // Nariz grande caído
  ctx.fillStyle = '#85ccb8';
  ctx.strokeStyle = '#2d6355';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.ellipse(1.5, -37.5, 3.4, 5.5, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

export function desenharSiriguejo(ctx, x, yChao, escala, tempo, dir) {
  const passo = Math.sin(tempo * 9.5);
  const beliscar = Math.abs(Math.sin(tempo * 5.2)) * 0.35;

  ctx.save();
  ctx.translate(x, yChao - Math.abs(passo) * 1.5);
  ctx.scale(dir * escala, escala);

  // Perninhas pontudas de siri
  ctx.strokeStyle = '#d62828';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(-5, -10);
  ctx.lineTo(-7 + passo * 2.5, 0);
  ctx.moveTo(5, -10);
  ctx.lineTo(7 - passo * 2.5, 0);
  ctx.stroke();

  // Calça azul-marinho + camisa celeste
  ctx.fillStyle = '#3f5199';
  ctx.strokeStyle = '#1b2552';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-11, -19, 22, 9.5, 3);
  ctx.fill();
  ctx.stroke();

  // Cinto preto com fivela dourada
  ctx.fillStyle = '#181818';
  ctx.fillRect(-11, -20.5, 22, 2.8);
  ctx.fillStyle = '#ffd60a';
  ctx.fillRect(-2.5, -21, 5, 3.8);

  // Torso redondo vermelho + camisa azul-claro
  ctx.fillStyle = '#7ec8f8';
  ctx.strokeStyle = '#255578';
  ctx.beginPath();
  ctx.roundRect(-11.5, -31, 23, 11, 4);
  ctx.fill();
  ctx.stroke();

  // Olhos compridos no topo da cabeça
  for (const ox of [-4.2, 4.2]) {
    ctx.fillStyle = '#e62e2e';
    ctx.strokeStyle = '#7a0d0d';
    ctx.lineWidth = 1.4;
    ctx.fillRect(ox - 2.1, -47, 4.2, 16);
    ctx.strokeRect(ox - 2.1, -47, 4.2, 16);

    ctx.fillStyle = '#e8f5e9';
    ctx.beginPath();
    ctx.ellipse(ox, -44, 2.4, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(ox + 0.5, -44, 1.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Garras vermelhas grandes abrindo e fechando!
  for (const [lado, gx] of [
    [-1, -16],
    [1, 16],
  ]) {
    ctx.save();
    ctx.translate(gx, -27);
    ctx.rotate(lado * -0.25);
    ctx.fillStyle = '#e62e2e';
    ctx.strokeStyle = '#7a0d0d';
    ctx.lineWidth = 1.5;

    ctx.save();
    ctx.rotate(-beliscar * lado);
    ctx.beginPath();
    ctx.arc(0, 0, 6.8, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.rotate(beliscar * lado);
    ctx.beginPath();
    ctx.arc(0, 1, 5.5, 0, Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  ctx.restore();
}

export function desenharPlankton(ctx, x, yChao, escala, tempo, dir) {
  const pulo = Math.abs(Math.sin(tempo * 8)) * 4;
  ctx.save();
  ctx.translate(x, yChao - pulo);
  ctx.scale(dir * escala, escala);

  // Perninhas e bracinhos
  ctx.strokeStyle = '#135e54';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-2.5, -5);
  ctx.lineTo(-3.5, 0);
  ctx.moveTo(2.5, -5);
  ctx.lineTo(3.5, 0);
  ctx.moveTo(-4.5, -11);
  ctx.lineTo(-8, -15);
  ctx.moveTo(4.5, -11);
  ctx.lineTo(8, -15);
  ctx.stroke();

  // Antenas compridas segmentadas
  ctx.beginPath();
  ctx.moveTo(-2, -18);
  ctx.quadraticCurveTo(-6, -26, -8, -30);
  ctx.moveTo(2, -18);
  ctx.quadraticCurveTo(6, -26, 8, -30);
  ctx.stroke();

  // Corpinho verde-petróleo de pílula
  ctx.fillStyle = '#1f8a7a';
  ctx.strokeStyle = '#0b423a';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(-4.8, -19, 9.6, 14.5, 4.8);
  ctx.fill();
  ctx.stroke();

  // Único olho amarelo grande com pupila vermelha
  ctx.fillStyle = '#fff59d';
  ctx.beginPath();
  ctx.arc(0.5, -13.5, 3.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#e52424';
  ctx.beginPath();
  ctx.arc(1, -13.5, 1.3, 0, Math.PI * 2);
  ctx.fill();

  // Sobrancelha grossa arqueada
  ctx.strokeStyle = '#072b26';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-3.2, -17.2);
  ctx.lineTo(3.6, -16.2);
  ctx.stroke();

  ctx.restore();
}

// ---------------- VEÍCULOS SUBMARINOS ----------------

export function desenharBarcomovel(ctx, v, yPista, escala, tempo) {
  const dir = v.vx >= 0 ? 1 : -1;
  const trepidar = Math.sin(tempo * 18 + v.fase) * 0.7;

  ctx.save();
  ctx.translate(v.x, yPista + trepidar);
  ctx.scale(dir * escala, escala);

  // Sombra na pista
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();
  ctx.ellipse(0, 1, 32, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tubo de escapamento traseiro
  ctx.fillStyle = '#7c90a0';
  ctx.fillRect(-34, -10, 7, 4);

  // Para-brisa bolha de vidro + motorista peixe dentro
  ctx.fillStyle = '#ff9f1c';
  ctx.beginPath();
  ctx.arc(2, -20, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(4, -21, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(180, 245, 255, 0.65)';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(8, -16);
  ctx.quadraticCurveTo(14, -27, 20, -16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Casco de barco com faixa retrô
  ctx.fillStyle = '#fff8e7';
  ctx.strokeStyle = '#1b4965';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-30, -16);
  ctx.lineTo(26, -16);
  ctx.quadraticCurveTo(35, -14, 31, -5);
  ctx.lineTo(-27, -5);
  ctx.quadraticCurveTo(-33, -9, -30, -16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Faixa lateral colorida + barbatana traseira
  ctx.fillStyle = v.corFaixa;
  ctx.fillRect(-28, -12.5, 57, 4);
  ctx.beginPath();
  ctx.moveTo(-30, -16);
  ctx.lineTo(-35, -23);
  ctx.lineTo(-22, -16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Rodas girando com faixa branca
  for (const rx of [-17, 17]) {
    ctx.save();
    ctx.translate(rx, -5);
    ctx.rotate(tempo * 10);
    ctx.fillStyle = '#1f2933';
    ctx.beginPath();
    ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 3.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = v.corFaixa;
    ctx.fillRect(-3.6, -1, 7.2, 2);
    ctx.restore();
  }

  ctx.restore();
}

export function desenharOnibusBiquini(ctx, v, yPista, escala, tempo) {
  const dir = v.vx >= 0 ? 1 : -1;
  const trepidar = Math.sin(tempo * 15) * 0.8;

  ctx.save();
  ctx.translate(v.x, yPista + trepidar);
  ctx.scale(dir * escala, escala);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
  ctx.beginPath();
  ctx.ellipse(0, 1, 46, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Periscópio / chaminé no teto do ônibus submarino
  ctx.strokeStyle = '#607d8b';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-24, -32);
  ctx.lineTo(-24, -40);
  ctx.lineTo(-18, -40);
  ctx.stroke();

  // Carroceria de ônibus submarino vermelho e creme
  ctx.fillStyle = '#d62828';
  ctx.strokeStyle = '#590d14';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-44, -33, 88, 27, 11);
  ctx.fill();
  ctx.stroke();

  // Faixa superior creme onde ficam as escotilhas
  ctx.fillStyle = '#fdf0d5';
  ctx.beginPath();
  ctx.roundRect(-41, -30, 82, 13, 6);
  ctx.fill();

  // Janelas redondas de escotilha com passageiros
  for (const jx of [-30, -16, -2, 12]) {
    ctx.fillStyle = '#8be4ff';
    ctx.strokeStyle = '#4a6b82';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(jx, -23.5, 4.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Para-brisa dianteiro
  ctx.fillStyle = '#aef0ff';
  ctx.beginPath();
  ctx.roundRect(24, -28.5, 14, 10, 4);
  ctx.fill();
  ctx.stroke();

  // Rodas do ônibus
  for (const rx of [-26, 25]) {
    ctx.fillStyle = '#1f2933';
    ctx.beginPath();
    ctx.arc(rx, -5.5, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.arc(rx, -5.5, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

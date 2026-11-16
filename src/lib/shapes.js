// Point-cloud shapes shared by the hero (a 3D brain) and the process section
// (a circle, a brain, a neuron, a network). All of them are generated, not drawn, and use a
// seeded random so they look the same on every visit.

function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A brain as [x, y, z] points: two folded hemispheres, a cerebellum and a stem.
// x is left-right, y is up, z is back-to-front. Fits roughly inside a unit sphere.
export function brainPoints(n, seed = 7) {
  const r = seeded(seed);
  const out = [];
  const nCere = Math.round(n * 0.11), nStem = Math.round(n * 0.03), nMain = n - nCere - nStem;
  while (out.length < nMain) {
    const side = r() < 0.5 ? -1 : 1;
    const u = r() * 2 - 1, th = r() * Math.PI * 2, sq = Math.sqrt(1 - u * u);
    let x = sq * Math.cos(th) * 0.6, y = u * 0.78, z = sq * Math.sin(th) * 1.12;
    if (side * x < -0.25) continue; // the inner faces stay open: that gap is the central fissure
    x *= 1 - 0.14 * (z / 1.12); // a little wider at the back
    if (y < -0.34) y = -0.34 + (y + 0.34) * 0.32; // flat underside
    y += 0.1 * Math.cos((z / 1.12) * 1.4) - 0.05; // arched top
    // Points gather along wandering bands, which read as the folds.
    const f = Math.sin(x * 12 + Math.sin(z * 6.5) * 1.7 + side) * Math.sin(y * 10 + Math.sin(x * 8) * 1.3 + z * 5);
    if (Math.abs(f) > 0.38 && r() < 0.74) continue;
    const k = 1 + 0.03 * f;
    out.push([(x + side * 0.29) * k, y * k, z * k]);
  }
  while (out.length < nMain + nCere) {
    const u = r() * 2 - 1, th = r() * Math.PI * 2, sq = Math.sqrt(1 - u * u);
    const x = sq * Math.cos(th) * 0.5, y = u * 0.25, z = sq * Math.sin(th) * 0.33;
    if (Math.abs(Math.sin(y * 42)) > 0.55 && r() < 0.8) continue; // fine horizontal ridges
    out.push([x, y - 0.52, z - 0.74]);
  }
  while (out.length < n) {
    const t = r(), a = r() * Math.PI * 2;
    out.push([Math.cos(a) * 0.085, -0.5 - t * 0.5, -0.42 + t * 0.14 + Math.sin(a) * 0.085]);
  }
  return out;
}

const along = (pts, x0, y0, x1, y1, count, r, jitter = 0.008) => {
  for (let i = 0; i < count; i++) {
    const t = r();
    pts.push([x0 + (x1 - x0) * t + (r() - 0.5) * jitter, y0 + (y1 - y0) * t + (r() - 0.5) * jitter]);
  }
};
const disc = (pts, cx, cy, rad, count, r) => {
  for (let i = 0; i < count; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * rad;
    pts.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d]);
  }
};
// A wandering branch made of short straight pieces; returns where it ended.
const branch = (pts, x, y, angle, length, count, r, bend = 0.5) => {
  const steps = 7, per = Math.max(1, Math.floor(count / steps));
  for (let s = 0; s < steps; s++) {
    angle += (r() - 0.5) * bend;
    const nx = x + Math.cos(angle) * (length / steps), ny = y + Math.sin(angle) * (length / steps);
    along(pts, x, y, nx, ny, per, r);
    x = nx; y = ny;
  }
  return [x, y, angle];
};
const fit = (pts, n, r) => {
  while (pts.length < n) pts.push(pts[Math.floor(r() * pts.length)].slice());
  return pts.slice(0, n);
};

// The four formations of the process section, as [x, y] points in a -1..1 box (y down).
export function processForms(n) {
  const r = seeded(21);

  const ring = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, rr = 0.62 + (r() - 0.5) * 0.05;
    ring.push([Math.cos(a) * rr, Math.sin(a) * rr]);
  }

  // The brain seen from its side.
  const brain = brainPoints(n, 11).map(([, y, z]) => [-z * 0.78, -y * 0.78 - 0.12]);

  // One neuron: a cell body, dendrites reaching left, an axon running right to its terminals.
  let neuron = [];
  disc(neuron, -0.34, 0, 0.15, Math.round(n * 0.2), r);
  for (let d = 0; d < 7; d++) {
    const a = Math.PI * (0.55 + (d / 6) * 0.9);
    const [ex, ey, ea] = branch(neuron, -0.34 + Math.cos(a) * 0.13, Math.sin(a) * 0.13, a, 0.3, Math.round(n * 0.03), r);
    branch(neuron, ex, ey, ea + 0.55, 0.17, Math.round(n * 0.012), r);
    branch(neuron, ex, ey, ea - 0.55, 0.17, Math.round(n * 0.012), r);
  }
  const [ax, ay] = branch(neuron, -0.2, 0, 0, 0.82, Math.round(n * 0.2), r, 0.28);
  for (let t = 0; t < 5; t++) {
    const [tx, ty] = branch(neuron, ax, ay, (t - 2) * 0.42, 0.2, Math.round(n * 0.02), r, 0.3);
    disc(neuron, tx, ty, 0.022, Math.round(n * 0.012), r);
  }
  neuron = fit(neuron, n, r);

  // Many neurons, linked.
  const nodes = [[-0.82, -0.3], [-0.5, 0.36], [-0.3, -0.5], [-0.05, 0.05], [0.18, 0.5], [0.35, -0.42], [0.62, 0.12], [0.86, -0.34], [0.84, 0.48]];
  const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6], [5, 7], [6, 7], [6, 8], [4, 8], [2, 5]];
  let net = [];
  for (const [x, y] of nodes) disc(net, x, y, 0.06, Math.round(n * 0.035), r);
  const perEdge = Math.floor((n - net.length) / edges.length);
  for (const [a, b] of edges) along(net, nodes[a][0], nodes[a][1], nodes[b][0], nodes[b][1], perEdge, r, 0.01);
  net = fit(net, n, r);

  return [ring, brain, neuron, net];
}

// The shapes the hero cloud passes through, as [x, y, z] points (y up), each with n points:
// a brain, a neuron, a network, a strand of DNA and a blood cell.
export function heroForms(n) {
  const r = seeded(33);
  const flat = processForms(n);
  const neuron = flat[2].map(([x, y]) => [x * 1.15, -y * 1.15, (r() - 0.5) * 0.16]);
  const net = flat[3].map(([x, y]) => [x * 1.05, -y * 1.05, Math.sin(x * 3.1) * 0.28 + (r() - 0.5) * 0.06]);

  let dna = [];
  const turns = 3.2 * Math.PI;
  for (let i = 0; i < Math.round(n * 0.34); i++) {
    const t = r() * 2 - 1, a = t * turns;
    dna.push([Math.cos(a) * 0.42 + (r() - 0.5) * 0.03, t * 1.08, Math.sin(a) * 0.42 + (r() - 0.5) * 0.03]);
    dna.push([-Math.cos(a) * 0.42 + (r() - 0.5) * 0.03, t * 1.08, -Math.sin(a) * 0.42 + (r() - 0.5) * 0.03]);
  }
  const rungs = 22;
  while (dna.length < n) {
    const t = (Math.floor(r() * rungs) + 0.5) / rungs * 2 - 1, a = t * turns, u = r() * 2 - 1;
    dna.push([Math.cos(a) * 0.42 * u, t * 1.08, Math.sin(a) * 0.42 * u]);
  }
  dna = dna.slice(0, n);

  // A red blood cell: a disc that is thin in the middle and thick at the rim, seen at an angle.
  const cell = [];
  const tilt = 0.95, ct = Math.cos(tilt), st = Math.sin(tilt);
  for (let i = 0; i < n; i++) {
    const rim = r() < 0.3;
    const rad = rim ? 0.86 + (r() - 0.5) * 0.05 : Math.sqrt(r()) * 0.86;
    const a = r() * Math.PI * 2;
    const half = 0.07 + 0.2 * Math.pow(rad / 0.86, 2.2);
    const zz = rim ? (r() * 2 - 1) * half : (r() < 0.5 ? -1 : 1) * half;
    const x = Math.cos(a) * rad, y = Math.sin(a) * rad;
    cell.push([x, y * ct - zz * st, y * st + zz * ct]);
  }

  return [brainPoints(n, 7), neuron, net, dna, cell];
}

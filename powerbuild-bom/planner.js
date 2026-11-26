/* Quantities and unit conversions shared by the catalogue, estimate and print views. */
(function (root) {
  'use strict';
  const templates = [
    { id: 'paving', name: 'Paving', group: 'DIY', kind: 'paving', photo: 0, description: 'Pavers and bedding sand for paths, patios and driveways.' },
    { id: 'wall-tiles', name: 'Wall tiling', group: 'DIY', kind: 'tile', photo: 1, wall: true, description: 'Tiles, adhesive and grout for a vertical surface.' },
    { id: 'interior-paint', name: 'Interior wall paint', group: 'DIY', kind: 'paint', photo: 2, wall: true, description: 'Primer and finish coats for interior walls.' },
    { id: 'single-brick', name: '106 mm brick wall', group: 'DIY', kind: 'brick', leaves: 1, photo: 3, wall: true, description: 'Single-leaf unplastered clay stock brickwork and mortar.' },
    { id: 'floor-tiles', name: 'Floor tiling', group: 'DIY', kind: 'tile', photo: 4, description: 'Floor tiles, adhesive and grout for your measured area.' },
    { id: 'exterior-paint', name: 'Exterior wall paint', group: 'DIY', kind: 'paint', photo: 5, wall: true, description: 'Exterior finish and primer, adjusted for openings.' },
    { id: 'double-brick', name: '222 mm brick wall', group: 'DIY', kind: 'brick', leaves: 2, photo: 6, wall: true, description: 'Double-leaf unplastered clay stock brickwork and mortar.' },
    { id: 'roof-paint', name: 'Tiled roof paint', group: 'DIY', kind: 'paint', photo: 7, roof: true, description: 'Roof coating measured over the actual sloping surface.' },
    { id: 'flat-roof-garage', name: 'Flat concrete roof garage', group: 'Structures', kind: 'garage', photo: 8, description: 'Brickwork, mortar, floor and flat roof materials.' }
  ];
  const plans = [[40, 600], [60, 800], [80, 1000], [100, 1200], [110, 1300]].map(([size, high]) => ({
    id: 'house-' + size, name: size + ' m² house plan', group: 'House plans', kind: 'plan', size, low: 250, high,
    description: 'Request plan options and a separate materials quotation.'
  }));
  const all = [...templates, ...plans];
  const number = new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 3 });
  const fmt = n => number.format(n);
  const rand = n => 'R' + new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(n).replace(/[\s\u00a0]/g, ' ');
  const planFee = t => rand(t.low) + '–' + rand(t.high);
  const field = (key, label, unit, initial = '', min = 0.001, max = 100000, step = 'any', optional = false) => ({ key, label, unit, initial, min, max, step, optional });
  const waste = field('waste', 'Extra allowance', '%', 10, 0, 100);
  const openings = field('openings', 'Doors and windows to deduct', 'm²', 0, 0, 10000000);
  function fields(t, mode) {
    let dims;
    if (t.kind === 'garage') {
      dims = [field('length', 'Outside length', 'm'), field('width', 'Outside width', 'm'), field('height', 'Wall height', 'm'), openings];
    } else if (mode === 'area') {
      dims = [field('area', t.roof ? 'Total sloping roof area' : 'Surface area before deductions', 'm²', '', 0.001, 10000000)];
    } else {
      dims = [field('length', t.wall ? 'Total wall length' : 'Length', 'm'), field('width', t.wall ? 'Wall height' : t.roof ? 'Width along the slope' : 'Width', 'm')];
    }
    if (t.wall) dims.push(openings);
    const packs = [waste];
    if (t.kind === 'paving') packs.push(field('units', 'Pavers per square metre', 'per m²', 50), field('bed', 'Bedding sand depth', 'mm', 30, 1, 1000));
    if (t.kind === 'tile') packs.push(field('box', 'Tile coverage per box', 'm²/box', 1.44), field('adhesive', 'Adhesive coverage per bag', 'm²/bag', 4), field('grout', 'Grout coverage per pack', 'm²/pack', 10));
    if (t.kind === 'paint') packs.push(field('coats', 'Finish coats', 'coats', 2, 1, 10, 1), field('spread', 'Finish coverage per coat', 'm²/L', 8), field('tin', 'Finish tin size', 'L', 5), field('primerCoats', 'Primer coats', '0 to skip', 1, 0, 5, 1), field('primerSpread', 'Primer coverage per coat', 'm²/L', 8), field('primerTin', 'Primer tin size', 'L', 5));
    if (t.kind === 'garage') packs.push(field('leaves', 'Wall leaves', '1 or 2', 1, 1, 2, 1), field('roofArea', 'Roof slab plan area, including overhangs', 'm²', '', 0.001, 10000000), field('floorThickness', 'Floor slab thickness from drawing', 'mm, optional', '', 1, 2000, 'any', true), field('roofThickness', 'Roof slab thickness from drawing', 'mm, optional', '', 1, 2000, 'any', true));
    if (t.kind === 'brick' || t.kind === 'garage') packs.push(field('brickRate', 'Stock bricks per m² per leaf', 'bricks', 52), field('mortarRate', 'Wet mortar per 1 000 bricks', 'm³', 0.34));
    return { dims, packs };
  }
  function calculate(t, mode, input) {
    const definitions = fields(t, mode);
    const v = {};
    for (const f of [...definitions.dims, ...definitions.packs]) {
      if ((f.key === 'primerSpread' || f.key === 'primerTin') && v.primerCoats === 0) { v[f.key] = null; continue; }
      const raw = input[f.key];
      if (raw === '' || raw == null || (typeof raw === 'string' && !raw.trim())) {
        if (f.optional) { v[f.key] = null; continue; }
        throw Error('Enter a value for ' + f.label.toLowerCase() + '.');
      }
      const n = Number(raw);
      if (!Number.isFinite(n) || n < f.min || n > f.max || (f.step === 1 && !Number.isInteger(n))) throw Error('Check ' + f.label.toLowerCase() + ' (' + fmt(f.min) + '–' + fmt(f.max) + ').');
      v[f.key] = n;
    }
    const garage = t.kind === 'garage';
    const gross = garage ? 2 * (v.length + v.width) * v.height : mode === 'area' ? v.area : v.length * v.width;
    const net = gross - (v.openings || 0);
    if (!(net > 0)) throw Error('Openings must be smaller than the total wall area.');
    const factor = 1 + v.waste / 100;
    const rows = [];
    function row(label, raw, unit, pack, packUnit) {
      const allowed = raw * factor;
      const count = pack ? Math.ceil(Number((allowed / pack).toPrecision(13))) : null;
      const units = { brick: 'bricks', paver: 'pavers', box: 'boxes', bag: 'bags', pack: 'packs', tin: 'tins' };
      rows.push({ label, raw, allowed, unit, order: pack ? fmt(count) + ' ' + (count === 1 ? packUnit : units[packUnit]) : fmt(Math.ceil(Number((allowed * 1000).toPrecision(13))) / 1000) + ' ' + unit });
    }
    if (t.kind === 'paving') {
      row('Pavers', net * v.units, 'pavers', 1, 'paver');
      row('Bedding sand', net * v.bed / 1000, 'm³');
    }
    if (t.kind === 'tile') {
      row('Tiles · ' + fmt(v.box) + ' m² per box', net, 'm²', v.box, 'box');
      row('Tile adhesive · ' + fmt(v.adhesive) + ' m² per bag', net, 'm²', v.adhesive, 'bag');
      row('Grout · ' + fmt(v.grout) + ' m² per pack', net, 'm²', v.grout, 'pack');
    }
    if (t.kind === 'paint') {
      row(t.name + ' · ' + fmt(v.tin) + ' L tins', net * v.coats / v.spread, 'L', v.tin, 'tin');
      if (v.primerCoats > 0) row('Primer · ' + fmt(v.primerTin) + ' L tins', net * v.primerCoats / v.primerSpread, 'L', v.primerTin, 'tin');
    }
    if (t.kind === 'brick' || garage) {
      const bricks = net * v.brickRate * (garage ? v.leaves : t.leaves);
      row('Clay stock bricks', bricks, 'bricks', 1, 'brick');
      row('Wet laying mortar', bricks * v.mortarRate / 1000, 'm³');
    }
    if (garage) {
      row('Roof waterproofing coverage', v.roofArea, 'm²');
      if (v.floorThickness) row('Floor slab concrete', v.length * v.width * v.floorThickness / 1000, 'm³');
      if (v.roofThickness) row('Roof slab concrete', v.roofArea * v.roofThickness / 1000, 'm³');
    }
    const notes = [];
    if (t.kind === 'paving') notes.push('Confirm the sub-base, compaction and edge restraints for your site.');
    if (t.kind === 'tile') notes.push('Use the coverage on your chosen tile, adhesive and grout packs. Grout usage varies with tile and joint size.');
    if (t.kind === 'paint') notes.push('Check the product label for coverage, substrate preparation and the required coats.');
    if (t.kind === 'brick' || garage) notes.push('Stock-brick rates refer to a 222 × 106 × 73 mm clay brick. Foundations, DPC, ties and lintels are priced from the drawings.');
    if (garage) {
      if (!v.floorThickness || !v.roofThickness) notes.push('Slab concrete is shown only for the thicknesses you supplied.');
      notes.push('Confirm roof falls, membrane laps, reinforcement, formwork, beams, foundations, doors and drainage against the approved design.');
    }
    return { title: t.name, net, areaLabel: garage ? 'Net wall area' : 'Net surface area', waste: v.waste, rows, notes,
      inputs: [...definitions.dims, ...definitions.packs].filter(f => v[f.key] !== null).map(f => f.label + ': ' + fmt(v[f.key]) + (f.key === 'primerCoats' || f.key === 'leaves' ? '' : ' ' + f.unit.replace(', optional',''))) };
  }
  const api = { all, fields, calculate, planFee, fmt };
  root.PowerBuildPlanner = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);

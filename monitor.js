const demo = document.querySelector('.monitor-demo');
const detail = demo.querySelector('#monitor-detail');
const detailClose = demo.querySelector('.monitor-detail-close');
const detailTitle = demo.querySelector('#monitor-detail-title');
const detailValue = demo.querySelector('.monitor-detail-value');
const detailCaption = demo.querySelector('.monitor-detail-caption');
const detailCharts = [...demo.querySelectorAll('.monitor-detail-chart')];
const diskMeter = demo.querySelector('.monitor-detail-disk');
const readings = [...demo.querySelectorAll('[data-reading]')];
const traces = [...demo.querySelectorAll('[data-trace]')];
const metricButtons = [...demo.querySelectorAll('.monitor-metric')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

const metrics = {
  memory: { name: 'Memory', caption: 'App and system RAM over the last 60 seconds.' },
  cpu: { name: 'CPU', caption: 'Activity across all logical CPUs over the last 60 seconds.' },
  network: { name: 'Network', caption: 'Download above upload, on the same scale over 60 seconds.' },
  disk: { name: 'Disk Space', caption: 'Used space on a simulated 1 TB startup disk.' }
};
const history = { memory: [], cpu: [], download: [], upload: [] };
const sampleCount = 61;
const freeGB = 426;
let tick = 0;
let transfer = 0;
let selectedButton = null;

function sample() {
  // Generate a steady memory trace, uneven CPU activity, and intermittent transfers.
  tick += 1;
  if (Math.random() < .13) transfer = 600_000 + Math.random() * 3_800_000;
  else transfer *= .44;
  const samples = {
    memory: 59 + Math.sin(tick / 17) * 1.8 + (Math.random() - .5) * .4,
    cpu: 18 + Math.sin(tick / 6) * 5 + Math.random() * 6 + (Math.random() < .17 ? Math.random() * 30 : 0),
    download: 10_000 + Math.random() * 35_000 + transfer,
    upload: 5_000 + Math.random() * 20_000 + transfer * (.08 + Math.random() * .16)
  };
  for (const [key, value] of Object.entries(samples)) {
    const points = history[key];
    points.push(value);
    if (points.length > sampleCount) points.shift();
  }
}

function rate(bytes) {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB/s`;
  return `${Math.round(bytes / 1_000)} kB/s`;
}

function trace(points, ceiling, height) {
  return points.map((value, index) => {
    const x = index * 72 / (sampleCount - 1);
    const y = height * (1 - value / ceiling);
    return `${index ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');
}

function render() {
  const peak = Math.max(...history.download, ...history.upload, 1000);
  const magnitude = 10 ** Math.floor(Math.log10(peak));
  const networkCeiling = Math.ceil(peak / magnitude) * magnitude;
  const values = {
    memory: Math.round(history.memory.at(-1)),
    cpu: Math.round(history.cpu.at(-1)),
    download: `↓ ${rate(history.download.at(-1))}`,
    upload: `↑ ${rate(history.upload.at(-1))}`,
    disk: `${freeGB} GB free`
  };
  const summaries = {
    memory: `${values.memory}%`,
    cpu: `${values.cpu}%`,
    network: `${values.download}   ${values.upload}`,
    disk: values.disk
  };
  readings.forEach(node => { node.textContent = values[node.dataset.reading]; });
  traces.forEach(path => {
    const key = path.dataset.trace;
    const isNetwork = key === 'download' || key === 'upload';
    path.setAttribute('d', trace(history[key], isNetwork ? networkCeiling : 100, isNetwork ? 11 : 20));
  });
  metricButtons.forEach(button => {
    const key = button.dataset.metric;
    const measurement = key === 'network'
      ? `Download ${values.download.slice(2)}, upload ${values.upload.slice(2)}`
      : summaries[key];
    button.setAttribute('aria-label', `${metrics[key].name}, ${measurement}`);
  });

  if (!selectedButton) return;
  const key = selectedButton.dataset.metric;
  detailValue.textContent = summaries[key];
  if (key === 'disk') return;
  const keys = key === 'network' ? ['download', 'upload'] : [key];
  keys.forEach((series, index) => {
    detailCharts[index].firstElementChild.setAttribute('d', trace(history[series], key === 'network' ? networkCeiling : 100, 20));
  });
}

function closeDetail() {
  if (selectedButton) selectedButton.setAttribute('aria-expanded', 'false');
  selectedButton = null;
  detail.hidden = true;
}

function positionDetail() {
  if (!selectedButton) return;
  const rect = selectedButton.getBoundingClientRect();
  const left = demo.getBoundingClientRect().left;
  detail.style.setProperty('--monitor-card-center', `${rect.left + rect.width / 2 - left}px`);
}

for (const button of metricButtons) {
  button.addEventListener('click', () => {
    const wasOpen = selectedButton === button;
    closeDetail();
    if (wasOpen) return;
    selectedButton = button;
    const key = button.dataset.metric;
    detailTitle.textContent = metrics[key].name;
    detailCaption.textContent = metrics[key].caption;
    detailCharts[0].hidden = key === 'disk';
    detailCharts[1].hidden = key !== 'network';
    diskMeter.hidden = key !== 'disk';
    diskMeter.value = 1000 - freeGB;
    button.setAttribute('aria-expanded', 'true');
    positionDetail();
    render();
    detail.hidden = false;
    detailClose.focus({ preventScroll: true });
  });
}

function dismiss() {
  const trigger = selectedButton;
  closeDetail();
  trigger?.focus({ preventScroll: true });
}
detailClose.addEventListener('click', dismiss);
window.addEventListener('resize', positionDetail);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !detail.hidden) dismiss();
});
document.addEventListener('click', event => {
  if (!demo.contains(event.target)) closeDetail();
});

for (let index = 0; index < sampleCount; index += 1) sample();
render();
setInterval(() => {
  if (reducedMotion.matches || document.hidden) return;
  sample();
  render();
}, 1000);

const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

const TELEGRAM_CONTACT = "https://t.me/rosanerapack";
const SIGNAL_CONTACT = "https://signal.me/#eu/9E9Ym5HK8r_p0-5-JnEi1anDD7KfuzadJnr5Ac8kkhr1sAKeOklN9r5jUW75RdWQ";

const grid = document.querySelector("#catalogGrid");
const emptyState = document.querySelector("#emptyState");
const count = document.querySelector("#productCount");
const viewToggle = document.querySelector("#viewToggle");
const viewIcon = document.querySelector("#viewIcon");
const viewer = document.querySelector("#viewer");
const viewerTrack = document.querySelector("#viewerTrack");
const viewerClose = document.querySelector("#viewerClose");
const soundToggle = document.querySelector("#soundToggle");
let products = [];
let layout = "grid";
let soundOn = false;
let activeIndex = 0;

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

function mediaMarkup(product, preview = false) {
  if (product.video) {
    return `<video ${preview ? 'muted autoplay loop playsinline preload="metadata"' : 'autoplay loop playsinline preload="auto"'} ${product.poster ? `poster="${escapeHtml(product.poster)}"` : ""}>
      <source src="${escapeHtml(product.video)}" type="video/mp4">
    </video>`;
  }
  if (product.image) return `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">`;
  return `<div class="media-placeholder" aria-hidden="true">R</div>`;
}

function renderCatalog() {
  count.textContent = `${products.length} ${products.length === 1 ? "ITEM" : "ITEMS"}`;
  emptyState.hidden = products.length !== 0;
  grid.innerHTML = products.map((product, index) => `
    <article class="product-card" data-index="${index}" tabindex="0" role="button" aria-label="View ${escapeHtml(product.name)}">
      <div class="product-media">
        ${mediaMarkup(product, true)}
        <span class="play-indicator">▶</span>
      </div>
      <div class="card-info">
        <h2 class="card-title">${escapeHtml(product.name)}</h2>
        <p class="card-meta">€${Number(product.price).toFixed(2)}<span class="dot">·</span>${escapeHtml(product.grams)} g</p>
      </div>
    </article>
  `).join("");
  grid.classList.toggle("carousel-mode", layout === "carousel");
}

function setLayout(next) {
  layout = next;
  grid.classList.toggle("carousel-mode", layout === "carousel");
  viewIcon.innerHTML = layout === "grid"
    ? '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
    : '<rect x="2" y="4" width="5" height="16" rx="1"/><rect x="9.5" y="4" width="5" height="16" rx="1"/><rect x="17" y="4" width="5" height="16" rx="1"/>';
  viewToggle.setAttribute("aria-label", layout === "grid" ? "Switch to carousel view" : "Switch to grid view");
}

function viewerItem(product, index) {
  const photos = Array.isArray(product.images) ? product.images : [];
  const photoMarkup = photos.length ? `<div class="photo-strip" aria-label="Product photos">${photos.map((src, i) =>
    `<img src="${escapeHtml(src)}" alt="${escapeHtml(product.name)} photo ${i + 1}" loading="lazy">`
  ).join("")}</div>` : "";
  return `
    <section class="viewer-item" data-index="${index}">
      ${product.video
        ? `<video class="viewer-video" autoplay loop playsinline preload="auto" ${product.poster ? `poster="${escapeHtml(product.poster)}"` : ""}>
             <source src="${escapeHtml(product.video)}" type="video/mp4">
           </video>`
        : product.image ? `<img class="viewer-poster" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">`
        : `<div class="viewer-poster media-placeholder">R</div>`}
      <div class="viewer-shade"></div>
      <div class="viewer-copy">
        <p class="viewer-kicker">ROSA NERA · THE COLLECTION</p>
        <h2 class="viewer-title">${escapeHtml(product.name)}</h2>
        <p class="viewer-description">${escapeHtml(product.description || "")}</p>
        <div class="viewer-price">€${Number(product.price).toFixed(2)} <span>·</span> ${escapeHtml(product.grams)} g</div>
        <div class="contact-actions">
          <a class="contact-link" href="${TELEGRAM_CONTACT}" target="_blank" rel="noopener">TELEGRAM</a>
          <a class="contact-link signal" href="${SIGNAL_CONTACT}" target="_blank" rel="noopener">SIGNAL</a>
        </div>
        ${photoMarkup}
      </div>
    </section>`;
}

function openViewer(index) {
  activeIndex = index;
  viewerTrack.innerHTML = products.map(viewerItem).join("");
  viewer.classList.add("open");
  viewer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  viewerTrack.scrollTop = 0;
  const target = viewerTrack.children[index];
  target?.scrollIntoView({ block: "start" });
  applySound();
  const videos = viewerTrack.querySelectorAll("video");
  videos.forEach((video, i) => {
    if (i !== index) video.pause();
    else video.play().catch(() => {});
  });
  tg?.BackButton?.show();
}

function closeViewer() {
  viewer.classList.remove("open");
  viewer.setAttribute("aria-hidden", "true");
  viewerTrack.querySelectorAll("video").forEach(video => video.pause());
  document.body.style.overflow = "";
  tg?.BackButton?.hide();
}

function applySound() {
  viewerTrack.querySelectorAll("video").forEach(video => {
    video.muted = !soundOn;
    if (video.closest(".viewer-item") === viewerTrack.children[activeIndex]) {
      video.play().catch(() => {});
    }
  });
  soundToggle.textContent = soundOn ? "SOUND ON" : "SOUND OFF";
  soundToggle.setAttribute("aria-label", soundOn ? "Turn sound off" : "Turn sound on");
}

grid.addEventListener("click", event => {
  const card = event.target.closest(".product-card");
  if (card) openViewer(Number(card.dataset.index));
});
grid.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    const card = event.target.closest(".product-card");
    if (card) { event.preventDefault(); openViewer(Number(card.dataset.index)); }
  }
});
viewToggle.addEventListener("click", () => setLayout(layout === "grid" ? "carousel" : "grid"));
viewerClose.addEventListener("click", closeViewer);
soundToggle.addEventListener("click", () => { soundOn = !soundOn; applySound(); });
tg?.BackButton?.onClick(closeViewer);
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && viewer.classList.contains("open")) closeViewer();
  if (event.key === "ArrowUp") viewerTrack.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  if (event.key === "ArrowDown") viewerTrack.scrollBy({ top: -window.innerHeight, behavior: "smooth" });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || !viewer.classList.contains("open")) return;
    const item = entry.target;
    activeIndex = Number(item.dataset.index);
    viewerTrack.querySelectorAll("video").forEach(video => {
      const isActive = video.closest(".viewer-item") === item;
      if (isActive) {
        video.muted = !soundOn;
        video.play().catch(() => {});
      } else video.pause();
    });
  });
}, { root: viewerTrack, threshold: 0.65 });

async function init() {
  try {
    const response = await fetch("./data/products.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load products.json (${response.status})`);
    const data = await response.json();
    products = Array.isArray(data) ? data.slice(0, 20) : [];
    renderCatalog();
    if (products.length) {
      // Observe each full-screen product page for TikTok-style active-video playback.
      const originalOpen = openViewer;
      window.openRosaNeraProduct = originalOpen;
    }
  } catch (error) {
    console.error(error);
    emptyState.hidden = false;
    emptyState.querySelector("p").textContent = "We couldn't load the product list. Please check data/products.json.";
  }
}
const originalViewerItem = viewerItem;
const observerInit = new MutationObserver(() => {
  viewerTrack.querySelectorAll(".viewer-item").forEach(item => observer.observe(item));
});
observerInit.observe(viewerTrack, { childList: true });
init();

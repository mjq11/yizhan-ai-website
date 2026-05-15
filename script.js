const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelectorAll(".main-nav a");
const tabs = document.querySelectorAll("[data-filter]");
const caseCards = document.querySelectorAll("[data-category]");
const copyButtons = document.querySelectorAll("[data-copy]");
const leadForm = document.querySelector("[data-lead-form]");
const formResult = document.querySelector("[data-form-result]");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
  document.body.classList.toggle("show-mobile-cta", window.scrollY > 420);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuToggle?.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  header?.classList.toggle("nav-active", !expanded);
  document.body.classList.toggle("nav-open", !expanded);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    header?.classList.remove("nav-active");
    document.body.classList.remove("nav-open");
  });
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const filter = tab.dataset.filter;
    tabs.forEach((item) => item.classList.toggle("active", item === tab));
    caseCards.forEach((card) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !visible);
    });
  });
});

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.dataset.copy;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      button.querySelector("span").textContent = "已复制微信";
    } catch {
      button.querySelector("span").textContent = "微信号";
    }
  });
});

leadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(leadForm);
  const type = form.get("type");
  const budget = form.get("budget");
  const message = form.get("message") || "暂无补充";
  const summary = `需求类型：${type}\n预算范围：${budget}\n需求描述：${message}\n\n建议复制这段发微信 YIZHAN-AI，我会按这个信息当天出方案。`;
  formResult.textContent = summary;
  try {
    await navigator.clipboard.writeText(summary);
    formResult.textContent = `${summary}\n\n已复制需求摘要。`;
  } catch {
    formResult.textContent = summary;
  }
});

const canvas = document.querySelector("[data-hero-canvas]");
const ctx = canvas?.getContext("2d");
let points = [];
let frame = 0;

const resizeCanvas = () => {
  if (!canvas || !ctx) return;
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.max(18, Math.floor(rect.width / 52));
  points = Array.from({ length: count }, (_, index) => ({
    x: (rect.width / count) * index + Math.random() * 40,
    y: Math.random() * rect.height,
    speed: 0.18 + Math.random() * 0.42,
    length: 50 + Math.random() * 120,
  }));
};

const drawCanvas = () => {
  if (!canvas || !ctx) return;
  const { width, height } = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;

  points.forEach((point, index) => {
    const offset = (frame * point.speed + index * 19) % (height + point.length);
    const y = offset - point.length;
    const gradient = ctx.createLinearGradient(point.x, y, point.x + 140, y + point.length);
    gradient.addColorStop(0, "rgba(36, 213, 255, 0)");
    gradient.addColorStop(0.45, "rgba(36, 213, 255, 0.42)");
    gradient.addColorStop(1, "rgba(255, 181, 69, 0)");
    ctx.strokeStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(point.x, y);
    ctx.lineTo(point.x + 140, y + point.length);
    ctx.stroke();
  });

  frame += 1;
  requestAnimationFrame(drawCanvas);
};

if (canvas && ctx) {
  resizeCanvas();
  drawCanvas();
  window.addEventListener("resize", resizeCanvas);
}

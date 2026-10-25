const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const toast = (message) => {
  const el = $("#toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
};
const examples = {
  MySQL:
    "SELECT project, status\nFROM portfolio_projects\nWHERE status = 'student work';",
  PHP: '<?php\n  echo "Hello, portfolio!";\n?>',
  JavaScript:
    'const skills = ["PHP", "MySQL"];\nskills.forEach(skill => console.log(skill));',
  Python:
    'projects = ["classroom", "scraper"]\nprint("Building with", projects[0])',
  CSS: ".profile {\n  display: grid;\n  gap: 1rem;\n}",
  HTML: '<section class="portfolio">\n  <h1>Welcome</h1>\n</section>',
};
$$("[data-skill]").forEach((btn) =>
  btn.addEventListener("click", () => {
    const key = btn.dataset.skill;
    $$("[data-skill]").forEach((x) => x.classList.toggle("active", x === btn));
    const out = $("#code-demo");
    if (out)
      out.innerHTML =
        '<span class="prompt">$ ' +
        key.toLowerCase() +
        " — example</span>\n" +
        examples[key]
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;");
  }),
);
const themeButton = $("#theme-toggle");
if (localStorage.getItem("portfolio-theme") === "soft")
  document.body.classList.add("dark-off");
if (themeButton)
  themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-off");
    const mode = document.body.classList.contains("dark-off") ? "soft" : "crt";
    localStorage.setItem("portfolio-theme", mode);
    themeButton.textContent = mode === "soft" ? "CRT view" : "Soft view";
    toast(mode === "soft" ? "Soft display enabled" : "CRT display enabled");
  });
if (themeButton)
  themeButton.textContent = document.body.classList.contains("dark-off")
    ? "CRT view"
    : "Soft view";
$$("[data-copy]").forEach((btn) =>
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(
        btn.dataset.copy === "url"
          ? location.origin + location.pathname
          : btn.dataset.copy,
      );
      toast("Copied to clipboard");
    } catch {
      toast("Clipboard access is unavailable in this browser");
    }
  }),
);
const searchForm = $("#global-search");
if (searchForm)
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = $("#search-input").value.trim();
    location.href = "projects.html" + (q ? "?q=" + encodeURIComponent(q) : "");
  });
const projectFilter = $("#project-filter"),
  cards = $$(".project-card"),
  count = $("#filter-count");
function filterProjects() {
  if (!projectFilter) return;
  const q = projectFilter.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach((card) => {
    const match = card.textContent.toLowerCase().includes(q);
    card.hidden = !match;
    if (match) visible++;
  });
  if (count)
    count.textContent = visible + " project" + (visible === 1 ? "" : "s");
  const empty = $("#empty-state");
  if (empty) empty.hidden = visible !== 0;
}
if (projectFilter) {
  const params = new URLSearchParams(location.search);
  projectFilter.value = params.get("q") || "";
  projectFilter.addEventListener("input", filterProjects);
  filterProjects();
}
const modal = $("#project-modal");
$$("[data-project]").forEach((btn) =>
  btn.addEventListener("click", () => {
    const card = btn.closest(".project-card");
    if (!card || !modal) return;
    $("#modal-title").textContent = card.dataset.title;
    $("#modal-content").innerHTML = card.dataset.detail;
    modal.showModal();
  }),
);
if (modal) {
  $(".modal-close", modal).addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });
}
const contactForm = $("#contact-form");
if (contactForm)
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(contactForm),
      name = (data.get("name") || "").toString().trim(),
      email = (data.get("email") || "").toString().trim(),
      message = (data.get("message") || "").toString().trim();
    if (!name || !email || !message) {
      $("#form-status").textContent = "Please complete each field.";
      return;
    }
    const text = `Hello Ervins,\n\n${message}\n\nFrom: ${name} (${email})`;
    if (navigator.share) {
      navigator
        .share({ title: "Portfolio message", text })
        .then(() => ($("#form-status").textContent = "Message shared."))
        .catch(() => copyContact(text));
    } else copyContact(text);
  });
async function copyContact(text) {
  try {
    await navigator.clipboard.writeText(text);
    $("#form-status").textContent =
      "Message copied. Paste it into your email or preferred chat app.";
  } catch {
    $("#form-status").textContent =
      "Message prepared. Select and copy the text: " + text;
  }
}
$$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

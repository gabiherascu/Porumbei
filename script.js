/* =========================================================
   PIGEONLAB BY GABRIEL â JavaScript
   Save as: script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const birdSearch = document.getElementById("birdSearch");
  const filterButtons = [...document.querySelectorAll(".filter-btn")];
  const birdCards = [...document.querySelectorAll(".bird-card")];
  const emptyState = document.getElementById("emptyState");
  const birdDialog = document.getElementById("birdDialog");
  const dialogTitle = document.getElementById("dialogTitle");
  const dialogText = document.getElementById("dialogText");
  const dialogClose = document.getElementById("dialogClose");
  const dialogContact = document.getElementById("dialogContact");
  const contactForm = document.getElementById("contactForm");
  const toastContainer = document.getElementById("toastContainer");

  let activeFilter = "all";
  let selectedBird = "";

  // Anul curent ĂŽn subsol.
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Meniu mobil.
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Ănchide meniul" : "Deschide meniul");
      menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Deschide meniul");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // NotificÄri mici ĂŽn colČul paginii.
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastContainer.appendChild(toast);
    window.setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(8px)";
      window.setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // CÄutare Či filtre pentru catalog.
  function filterBirds() {
    const query = (birdSearch?.value || "").trim().toLocaleLowerCase("ro");
    let visibleCount = 0;

    birdCards.forEach(card => {
      const category = card.dataset.category || "";
      const name = card.dataset.name || "";
      const text = card.textContent || "";
      const matchesFilter = activeFilter === "all" || category === activeFilter;
      const matchesSearch = !query ||
        name.toLocaleLowerCase("ro").includes(query) ||
        text.toLocaleLowerCase("ro").includes(query);
      const visible = matchesFilter && matchesSearch;

      card.hidden = !visible;
      if (visible) visibleCount++;
    });

    if (emptyState) emptyState.hidden = visibleCount !== 0;
  }

  birdSearch?.addEventListener("input", filterBirds);

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      filterButtons.forEach(item => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      filterBirds();
    });
  });

  // Favorite.
  document.querySelectorAll(".favorite-btn").forEach(button => {
    button.addEventListener("click", () => {
      const isFavorite = button.getAttribute("aria-pressed") === "true";
      button.setAttribute("aria-pressed", String(!isFavorite));
      const icon = button.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-solid", !isFavorite);
        icon.classList.toggle("fa-regular", isFavorite);
      }
      showToast(isFavorite ? "Porumbelul a fost eliminat din favorite." : "Porumbelul a fost adÄugat la favorite.");
    });
  });

  // Fereastra cu detalii.
  const birdDescriptions = {
    "Voiajor albastru": "Porumbelul voiajor este apreciat pentru capacitatea de orientare Či pentru participarea la activitÄČi columbofile. Cere informaČii despre vĂ˘rstÄ, origine, documente Či condiČiile de creČtere.",
    "Ornamental alb": "Porumbeii ornamentali sunt admiraČi pentru aspectul Či varietatea penajului. Ănainte de alegere, discutÄ despre rasÄ, cerinČele de ĂŽngrijire Či starea de sÄnÄtate.",
    "Porumbei domestici": "O variantÄ pentru cei care descoperÄ columbofilia. Este important sÄ pregÄteČti un adÄpost potrivit Či sÄ afli ce presupune ĂŽngrijirea zilnicÄ."
  };

  function openBirdDialog(birdName) {
    selectedBird = birdName;
    if (dialogTitle) dialogTitle.textContent = birdName;
    if (dialogText) {
      dialogText.textContent = birdDescriptions[birdName] ||
        "ContacteazÄ-ne pentru informaČii despre acest porumbel, condiČiile de ĂŽngrijire Či disponibilitate.";
    }
    if (birdDialog?.showModal) {
      birdDialog.showModal();
    } else {
      showToast("Detalii: " + birdName);
    }
  }

  document.querySelectorAll(".details-btn").forEach(button => {
    button.addEventListener("click", () => openBirdDialog(button.dataset.bird || "Porumbel"));
  });

  dialogClose?.addEventListener("click", () => birdDialog?.close());

  birdDialog?.addEventListener("click", event => {
    if (event.target === birdDialog) birdDialog.close();
  });

  dialogContact?.addEventListener("click", () => {
    if (birdDialog?.open) birdDialog.close();
    const topic = document.getElementById("contactTopic");
    const message = document.getElementById("contactMessage");
    if (topic) topic.value = "Disponibilitate porumbel";
    if (message && selectedBird) {
      message.value = `BunÄ ziua! AČ dori mai multe informaČii despre: ${selectedBird}.`;
    }
  });

  // Formular: deschide aplicaČia de email. ĂnlocuieČte adresa de mai jos.
  const CONTACT_EMAIL = "adresa-ta@email.com";

  contactForm?.addEventListener("submit", event => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const topic = String(formData.get("topic") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = encodeURIComponent(`PigeonLab â ${topic}`);
    const body = encodeURIComponent(
      `Nume: ${name}\nEmail: ${email}\nSubiect: ${topic}\n\nMesaj:\n${message}`
    );

    if (CONTACT_EMAIL === "adresa-ta@email.com") {
      showToast("ConfigureazÄ CONTACT_EMAIL ĂŽn script.js cu adresa ta realÄ.");
      return;
    }

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  });

  // Navigarea activÄ ĂŽn funcČie de secČiunea vizibilÄ.
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // AnimaČii la apariČia elementelor ĂŽn paginÄ.
  const revealTargets = document.querySelectorAll(
    ".section-heading, .bird-card, .story-image-wrap, .story-copy, .care-card, .contact-panel"
  );

  if ("IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealTargets.forEach(element => element.classList.add("reveal"));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(element => revealObserver.observe(element));
  } else {
    revealTargets.forEach(element => element.classList.add("visible"));
  }

  // Ănchide meniul dacÄ utilizatorul revine la desktop.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 720 && mainNav?.classList.contains("open")) {
      mainNav.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
      if (menuToggle) menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });

  filterBirds();
});


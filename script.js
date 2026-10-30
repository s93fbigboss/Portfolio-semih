
/* =========================================
   SEMIH.DEV — JAVASCRIPT
========================================= */


/* =========================================
   BOUTON JOUR / NUIT
========================================= */

const themeButton = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const themeColor = document.querySelector('meta[name="theme-color"]');

function updateThemeButton() {
    const isLight = document.body.classList.contains("light-theme");

    if (themeIcon) {
        themeIcon.textContent = isLight ? "☾" : "☀";
    }

    if (themeButton) {
        themeButton.setAttribute(
            "aria-label",
            isLight ? "Activer le thème sombre" : "Activer le thème clair"
        );

        themeButton.setAttribute(
            "title",
            isLight ? "Passer en mode nuit" : "Passer en mode jour"
        );
    }

    if (themeColor) {
        themeColor.setAttribute(
            "content",
            isLight ? "#f4f6fc" : "#19182f"
        );
    }
}

// Récupération du thème enregistré
const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "light") {
    document.body.classList.add("light-theme");
}

updateThemeButton();

// Changement de thème
if (themeButton) {
    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");

        const isLight = document.body.classList.contains("light-theme");

        localStorage.setItem(
            "portfolio-theme",
            isLight ? "light" : "dark"
        );

        updateThemeButton();
    });
}


/* =========================================
   ANIMATION D'ÉCRITURE — ACCUEIL
========================================= */

const typingText = document.getElementById("typing-text");

const typingWords = [
    "Étudiant en BTS SIO SISR",
    "Pilote d'activité chez Orange",
    "Passionné d'informatique"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeWriter() {
    if (!typingText) return;

    const currentWord = typingWords[wordIndex];

    if (deleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    typingText.textContent = currentWord.substring(0, charIndex);

    let delay = deleting ? 45 : 85;

    if (!deleting && charIndex === currentWord.length) {
        deleting = true;
        delay = 1800;
    } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % typingWords.length;
        delay = 400;
    }

    setTimeout(typeWriter, delay);
}

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (typingText) {
    if (!reduceMotion) {
        typeWriter();
    } else {
        typingText.textContent = typingWords[0];
    }
}


/* =========================================
   ANIMATIONS AU DÉFILEMENT
========================================= */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reduceMotion) {

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}


/* =========================================
   NAVIGATION ACTIVE
========================================= */

// Pages séparées
const currentPage = window.location.pathname
    .split("/")
    .pop() || "index.html";

const pageLinks = document.querySelectorAll(".nav-links a");

pageLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
        link.classList.add("active");
    } else {
        link.classList.remove("active");
    }
});

// Anciennes sections avec ancres
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window && sections.length > 0) {

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;

                    pageLinks.forEach((link) => {
                        const isActive =
                            link.getAttribute("href") === "#" + sectionId;

                        link.classList.toggle("active", isActive);
                    });
                }
            });
        },
        {
            rootMargin: "-25% 0px -60% 0px"
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
}


/* =========================================
   ANNÉE AUTOMATIQUE
========================================= */

const currentYear = document.getElementById("current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =========================================================
   INTRO HACKING — PAGE VEILLE TECHNOLOGIQUE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const intro = document.getElementById("hacking-intro");

    // Ne rien faire sur les autres pages
    if (!intro) return;

    const consoleLines = intro.querySelectorAll(".terminal-console p");
    const progress = document.getElementById("terminal-progress-fill");
    const loading = document.getElementById("terminal-loading");
    const skipButton = document.getElementById("skip-intro");
    const matrixLayer = document.getElementById("matrix-layer");

    const alreadySeen = sessionStorage.getItem("veilleIntroSeen");
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let finished = false;
    const timers = [];

    function schedule(callback, delay) {
        const timer = setTimeout(callback, delay);
        timers.push(timer);
    }

    function finishIntro() {
        if (finished) return;
        finished = true;

        timers.forEach(clearTimeout);

        sessionStorage.setItem("veilleIntroSeen", "true");

        intro.classList.add("intro-hidden");

        setTimeout(() => {
            intro.remove();
        }, 700);
    }

    // Génération des caractères verts
    function createMatrix() {
        const characters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&";
        const columnCount = window.innerWidth < 600 ? 16 : 35;

        for (let i = 0; i < columnCount; i++) {
            const column = document.createElement("span");

            column.className = "matrix-character";
            column.textContent = Array.from(
                { length: 18 },
                () => characters[Math.floor(Math.random() * characters.length)]
            ).join("\n");

            column.style.left = `${(i / columnCount) * 100}%`;
            column.style.animationDuration = `${4 + Math.random() * 7}s`;
            column.style.animationDelay = `${Math.random() * 5}s`;

            matrixLayer.appendChild(column);
        }
    }

    // Déjà affichée pendant cette session
    if (alreadySeen || reducedMotion) {
        intro.remove();
        return;
    }

    createMatrix();

    // Déroulement de l'animation
    const delays = [450, 950, 1450, 1950, 2450];

    delays.forEach((delay, index) => {
        schedule(() => {
            if (finished) return;

            consoleLines[index].classList.add("visible");
            progress.style.width = `${(index + 1) * 20}%`;

            if (index === consoleLines.length - 1) {
                loading.textContent = "CONNEXION SÉCURISÉE — REDIRECTION...";
                schedule(finishIntro, 850);
            }
        }, delay);
    });

    // Bouton pour passer l'introduction
    skipButton.addEventListener("click", finishIntro);
});


/* =====================================================
   ANIMATIONS — PAGE DÉMONSTRATION DES ÉPREUVES
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const page = document.querySelector(".epreuves-page");
    if (!page) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Barre de progression de lecture
    const progressBar = document.createElement("div");
    progressBar.className = "epreuves-scroll-progress";
    progressBar.setAttribute("aria-hidden", "true");
    document.body.appendChild(progressBar);

    let ticking = false;

    function updateReadingProgress() {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0
            ? Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100))
            : 0;

        progressBar.style.width = `${progress}%`;
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(updateReadingProgress);
            ticking = true;
        }
    }, { passive: true });

    updateReadingProgress();

    // Apparition progressive des trois axes
    const cards = page.querySelectorAll("[data-epreuve-card]");

    if (!reduceMotion && "IntersectionObserver" in window) {
        const cardObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("epreuve-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.16, rootMargin: "0px 0px -35px 0px" });

        cards.forEach((card, index) => {
            card.classList.add("epreuve-animate");
            card.style.transitionDelay = `${index * 120}ms`;
            cardObserver.observe(card);
        });
    } else {
        cards.forEach((card) => card.classList.add("epreuve-visible"));
    }

    // Inclinaison légère au survol, uniquement avec une souris
    if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        cards.forEach((card) => {
            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(1100px) rotateX(${(-y * 2.2).toFixed(2)}deg) rotateY(${(x * 2.2).toFixed(2)}deg) translateY(-3px)`;
            });

            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
            });
        });
    }
});

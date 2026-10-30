/* =====================================================
   SEMIH.DEV — JAVASCRIPT GLOBAL
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const themeButton = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* THÈME JOUR / NUIT */
    function updateThemeButton() {
        const isLight = document.body.classList.contains("light-theme");
        if (themeIcon) themeIcon.textContent = isLight ? "☾" : "☀";
        if (themeButton) {
            themeButton.setAttribute("aria-label", isLight ? "Activer le thème sombre" : "Activer le thème clair");
            themeButton.setAttribute("aria-pressed", String(isLight));
            themeButton.title = isLight ? "Passer en mode nuit" : "Passer en mode jour";
        }
        if (themeColor) themeColor.content = isLight ? "#f4f6fc" : "#19182f";
    }

    try {
        if (localStorage.getItem("portfolio-theme") === "light") {
            document.body.classList.add("light-theme");
        }
    } catch (error) {
        // Le site reste utilisable si le stockage est indisponible.
    }
    updateThemeButton();

    themeButton?.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        const isLight = document.body.classList.contains("light-theme");
        try {
            localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
        } catch (error) {}
        updateThemeButton();
    });

    /* TEXTE ANIMÉ — ACCUEIL */
    const typingText = document.getElementById("typing-text");
    const typingWords = [
        "Étudiant en BTS SIO SISR",
        "Pilote d'activité chez Orange",
        "Passionné d'informatique"
    ];
    if (typingText) {
        if (reduceMotion) {
            typingText.textContent = typingWords[0];
        } else {
            let wordIndex = 0, charIndex = 0, deleting = false;
            const typeWriter = () => {
                const word = typingWords[wordIndex];
                charIndex += deleting ? -1 : 1;
                typingText.textContent = word.substring(0, charIndex);
                let delay = deleting ? 40 : 80;
                if (!deleting && charIndex === word.length) {
                    deleting = true;
                    delay = 1800;
                } else if (deleting && charIndex === 0) {
                    deleting = false;
                    wordIndex = (wordIndex + 1) % typingWords.length;
                    delay = 400;
                }
                window.setTimeout(typeWriter, delay);
            };
            typeWriter();
        }
    }

    /* ANIMATIONS AU DÉFILEMENT */
    const revealElements = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !reduceMotion) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealElements.forEach(element => observer.observe(element));
    } else {
        revealElements.forEach(element => element.classList.add("visible"));
    }

    /* NAVIGATION ACTIVE */
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(link => {
        const active = link.getAttribute("href") === currentPage;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    });

    /* ANNÉE AUTOMATIQUE */
    const year = document.getElementById("current-year");
    if (year) year.textContent = new Date().getFullYear();

    /* INTRO TERMINAL — VEILLE */
    const intro = document.getElementById("hacking-intro");
    if (!intro) return;

    const lines = intro.querySelectorAll(".terminal-console p");
    const progress = document.getElementById("terminal-progress-fill");
    const loading = document.getElementById("terminal-loading");
    const skip = document.getElementById("skip-intro");
    const matrix = document.getElementById("matrix-layer");
    let finished = false;
    const timers = [];

    const schedule = (callback, delay) => timers.push(window.setTimeout(callback, delay));

    function finishIntro() {
        if (finished) return;
        finished = true;
        timers.forEach(window.clearTimeout);
        try { sessionStorage.setItem("veilleIntroSeen", "true"); } catch (error) {}
        intro.classList.add("intro-hidden");
        window.setTimeout(() => intro.remove(), 700);
    }

    let alreadySeen = false;
    try { alreadySeen = sessionStorage.getItem("veilleIntroSeen") === "true"; } catch (error) {}
    if (alreadySeen || reduceMotion) {
        intro.remove();
        return;
    }

    if (matrix) {
        const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&";
        const count = window.innerWidth < 600 ? 16 : 35;
        for (let i = 0; i < count; i++) {
            const column = document.createElement("span");
            column.className = "matrix-character";
            column.textContent = Array.from({ length: 18 }, () => chars[Math.floor(Math.random() * chars.length)]).join("\n");
            column.style.left = `${(i / count) * 100}%`;
            column.style.animationDuration = `${4 + Math.random() * 7}s`;
            column.style.animationDelay = `${Math.random() * 5}s`;
            matrix.appendChild(column);
        }
    }

    [450, 950, 1450, 1950, 2450].forEach((delay, index) => {
        schedule(() => {
            if (finished) return;
            lines[index]?.classList.add("visible");
            if (progress) progress.style.width = `${(index + 1) * 20}%`;
            if (index === lines.length - 1) {
                if (loading) loading.textContent = "CONNEXION SÉCURISÉE — REDIRECTION...";
                schedule(finishIntro, 850);
            }
        }, delay);
    });
    skip?.addEventListener("click", finishIntro);
});

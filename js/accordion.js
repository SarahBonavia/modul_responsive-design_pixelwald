document.addEventListener("DOMContentLoaded", () => {
  const toggleButtons = document.querySelectorAll("[data-accordion-toggle='more-exhibitions']");
  const accordionPanel = document.getElementById("more-exhibitions");
  const installationSection = document.getElementById("installation");
  const siteHeader = document.querySelector("header");
  let closeScrollFallbackId = null;

  if (!accordionPanel || toggleButtons.length === 0) {
    return;
  }

  const scrollToInstallationStart = () => {
    if (!installationSection) {
      return;
    }

    const headerOffset = siteHeader ? siteHeader.offsetHeight : 0;
    const targetTop = installationSection.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  const setExpandedState = (isExpanded, options = {}) => {
    const { scrollToInstallation = false } = options;

    toggleButtons.forEach((button) => {
      button.setAttribute("aria-expanded", String(isExpanded));
      const label = button.querySelector("h4");
      if (label) {
        label.textContent = isExpanded ? "Schliessen" : "Weitere Austellungen";
      }
    });

    if (isExpanded) {
      if (closeScrollFallbackId) {
        window.clearTimeout(closeScrollFallbackId);
        closeScrollFallbackId = null;
      }

      accordionPanel.hidden = false;
      requestAnimationFrame(() => {
        accordionPanel.classList.add("is-open");
      });
      return;
    }

    accordionPanel.classList.remove("is-open");

    if (scrollToInstallation) {
      closeScrollFallbackId = window.setTimeout(() => {
        scrollToInstallationStart();
        closeScrollFallbackId = null;
      }, 520);
    }

    const onTransitionEnd = (event) => {
      if (event.target === accordionPanel && event.propertyName === "max-height") {
        accordionPanel.hidden = true;
        if (scrollToInstallation) {
          if (closeScrollFallbackId) {
            window.clearTimeout(closeScrollFallbackId);
            closeScrollFallbackId = null;
          }
          scrollToInstallationStart();
        }
      }
    };

    accordionPanel.addEventListener("transitionend", onTransitionEnd, { once: true });
  };

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      setExpandedState(!isExpanded, { scrollToInstallation: isExpanded });
    });
  });

  setExpandedState(false);
});

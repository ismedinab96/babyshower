   // ==
    // CONFIGURACIÓN GENERAL
    // ==
    const eventDate = new Date("2026-08-22T15:00:00-04:00").getTime();
    const whatsappNumber = "59172586959";
    let genderChoice = "";

    // ==
    // CUENTA REGRESIVA
    // ==
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById("days").textContent = String(days).padStart(2, "0");
      document.getElementById("hours").textContent = String(hours).padStart(2, "0");
      document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
      document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
    }, 1000);

    // ==
    // CARRUSEL
    // ==
    let currentSlide = 0;
    const slides = document.getElementById("slides");
    const totalSlides = slides.children.length;
    const dotsContainer = document.getElementById("dots");

    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("button");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.type = "button";
      dot.setAttribute("aria-label", "Ir a foto " + (i + 1));
      dot.onclick = () => goToSlide(i);
      dotsContainer.appendChild(dot);
    }

    function updateCarousel() {
      slides.style.transform = `translateX(-${currentSlide * 100}%)`;

      document.querySelectorAll(".dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentSlide);
      });
    }

    function moveSlide(direction) {
      currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
      updateCarousel();
    }

    function goToSlide(index) {
      currentSlide = index;
      updateCarousel();
    }

    setInterval(() => {
      moveSlide(1);
    }, 6000);

    // ==
    // DINÁMICA NIÑO / NIÑA
    // ==
    function selectGender(value, element) {
      genderChoice = value;

      document.querySelectorAll(".gender-card").forEach(card => {
        card.classList.remove("selected");
      });

      element.classList.add("selected");
    }

    // ==
    // CONFIRMACIÓN POR WHATSAPP
    // ==
    function enviarWhatsApp(event) {
      event.preventDefault();

      const name = document.getElementById("guestName").value.trim();
      const attendance = document.getElementById("attendance").value;
      const message = document.getElementById("message").value.trim();

      if (!name) {
        alert("Por favor escribe quién confirma.");
        return;
      }

      let text = "Hola, confirmo mi respuesta para el Baby Shower de Evelin López Luna.%0A%0A";
      text += `*Quién confirma:* ${encodeURIComponent(name)}%0A`;
      text += `*Asistencia:* ${encodeURIComponent(attendance)}%0A`;
      text += `*Mi predicción:* ${encodeURIComponent(genderChoice || "Aún no elegí")}%0A`;

      if (message) {
        text += `*Mensaje para Evelin:* ${encodeURIComponent(message)}%0A`;
      }

      text += "%0ACon mucho cariño.";

      const url = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${text}`;
      window.open(url, "_blank");
    }

    // ==
    // MÚSICA DE FONDO DESDE ARCHIVO MP3 + PANTALLA INICIAL
    // ==
    /*
      Archivo requerido:
      assets/audio/coraline-exploration.mp3

      En el HTML se usa ?v=20260616-6 solo para evitar caché.
      El nombre real del archivo debe seguir siendo coraline-exploration.mp3.

      La pantalla "Abrir invitación" funciona como gesto real del usuario.
      Eso permite que Chrome reproduzca el audio con sonido de forma confiable.
    */

    const bgMusic = document.getElementById("bgMusic");
    const audioBtn = document.getElementById("audioBtn");
    const audioIcon = document.getElementById("audioIcon");
    const audioLabel = document.getElementById("audioLabel");
    const soundToast = document.getElementById("soundToast");
    const introScreen = document.getElementById("introScreen");
    const envelope = document.getElementById("envelope");
    const tapHint = document.getElementById("tapHint");

    let musicUnlocked = false;
    let userPausedMusic = false;
    let invitationOpened = false;
    let envelopeOpening = false;
    const MUSIC_VOLUME = 0.42;

    function setMusicVolume(volume = MUSIC_VOLUME) {
      if (!bgMusic) return;
      bgMusic.volume = volume;
    }

    function hideSoundToast() {
      if (!soundToast) return;
      soundToast.classList.remove("show");
    }

    function showSoundToast() {
      if (!soundToast || userPausedMusic || musicUnlocked) return;
      soundToast.classList.add("show");

      setTimeout(() => {
        soundToast.classList.remove("show");
      }, 5200);
    }

    function updateAudioButton() {
      if (!bgMusic || !audioBtn || !audioIcon || !audioLabel) return;

      if (!bgMusic.paused && !bgMusic.muted) {
        audioBtn.classList.add("playing");
        audioIcon.textContent = "❚❚";
        audioLabel.textContent = "Pausar";
        audioBtn.setAttribute("aria-label", "Pausar música");
        hideSoundToast();
      } else if (!bgMusic.paused && bgMusic.muted) {
        audioBtn.classList.add("playing");
        audioIcon.textContent = "♪";
        audioLabel.textContent = "Activar";
        audioBtn.setAttribute("aria-label", "Activar sonido");
      } else {
        audioBtn.classList.remove("playing");
        audioIcon.textContent = "♪";
        audioLabel.textContent = "Música";
        audioBtn.setAttribute("aria-label", "Activar música");
      }
    }

    function fadeInVolume() {
      if (!bgMusic) return;

      let step = 0;
      const steps = 12;
      const target = MUSIC_VOLUME;

      bgMusic.volume = 0.04;
      const fade = setInterval(() => {
        step++;
        bgMusic.volume = Math.min(target, 0.04 + (target - 0.04) * (step / steps));

        if (step >= steps) {
          clearInterval(fade);
          bgMusic.volume = target;
        }
      }, 90);
    }

    async function playWithSound() {
      if (!bgMusic) return false;

      try {
        bgMusic.muted = false;
        bgMusic.removeAttribute("muted");
        setMusicVolume();
        await bgMusic.play();

        fadeInVolume();
        musicUnlocked = true;
        userPausedMusic = false;
        updateAudioButton();
        return true;
      } catch (error) {
        updateAudioButton();
        return false;
      }
    }

    function pauseMusic() {
      if (!bgMusic) return;

      userPausedMusic = true;
      bgMusic.pause();
      bgMusic.muted = false;
      bgMusic.removeAttribute("muted");
      hideSoundToast();
      updateAudioButton();
    }

    async function toggleMusic(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (!bgMusic) return;

      if (bgMusic.paused || bgMusic.muted) {
        await playWithSound();
      } else {
        pauseMusic();
      }
    }

    async function openInvitation() {
      invitationOpened = true;

      if (introScreen) {
        introScreen.classList.add("hide");

        setTimeout(() => {
          introScreen.style.display = "none";
        }, 780);
      }

      const started = await playWithSound();

      if (!started) {
        showSoundToast();
      }
    }

    function openEnvelope() {
      if (envelopeOpening || !envelope) return;
      envelopeOpening = true;

      envelope.classList.add("open");
      if (tapHint) tapHint.classList.add("hide");

      // Espera a que termine la animación del sobre (solapa + carta)
      // antes de revelar la invitación completa.
      setTimeout(openInvitation, 1050);
    }

    if (bgMusic && audioBtn) {
      setMusicVolume();
      bgMusic.load();

      if (envelope) {
        envelope.addEventListener("click", openEnvelope);
        envelope.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openEnvelope();
          }
        });
      }

      audioBtn.addEventListener("click", toggleMusic);

      if (soundToast) {
        soundToast.addEventListener("click", playWithSound);
        soundToast.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            playWithSound();
          }
        });
      }

      bgMusic.addEventListener("play", updateAudioButton);
      bgMusic.addEventListener("pause", updateAudioButton);
      bgMusic.addEventListener("volumechange", updateAudioButton);
      bgMusic.addEventListener("ended", updateAudioButton);

      bgMusic.addEventListener("error", () => {
        audioIcon.textContent = "!";
        audioLabel.textContent = "Audio";
        audioBtn.classList.remove("playing");
        audioBtn.setAttribute(
          "aria-label",
          "No se encontró el archivo de música assets/audio/coraline-exploration.mp3"
        );
        console.warn("No se encontró o no se pudo cargar: assets/audio/coraline-exploration.mp3?v=20260616-6");
      });

      // Fallback: si por alguna razón el usuario interactúa fuera del botón,
      // también se desbloquea la música después de abrir la invitación.
      const unlockAfterOpen = async () => {
        if (invitationOpened && !userPausedMusic && (bgMusic.paused || bgMusic.muted)) {
          await playWithSound();
        }
      };

      ["pointerdown", "click", "touchstart", "keydown"].forEach((eventName) => {
        window.addEventListener(eventName, unlockAfterOpen, { passive: true });
      });

      updateAudioButton();
    }


document.addEventListener("DOMContentLoaded", () => {
  let currentSlide = 1;
  const totalSlides = 5;
  let intervalId;

  function goToSlide(slideNumber) {
    clearInterval(intervalId);

    document.getElementById(`slide${currentSlide}`).checked = false;
    currentSlide = slideNumber;
    document.getElementById(`slide${currentSlide}`).checked = true;

    handleSlideChange();
  }

  function goToNextSlide() {
    let nextSlide = currentSlide + 1;
    if (nextSlide > totalSlides) nextSlide = 1;
    goToSlide(nextSlide);
  }

  function handleSlideChange() {
    const currentSlideElement = document.querySelector(`.s${currentSlide}`);
    const video = currentSlideElement.querySelector("video");

    // Pausa e reseta todos os vídeos
    document.querySelectorAll("video").forEach(v => {
      v.pause();
      v.currentTime = 0;
      v.onended = null;
    });

    if (video) {
      clearInterval(intervalId);
      video.muted = true;
      video.playsInline = true;
      video.currentTime = 0;

      const tryPlay = () => {
        video.play()
          .then(() => {
            video.onended = () => {
              goToNextSlide();
            };
          })
          .catch((err) => {
            console.log("Erro ao tentar reproduzir vídeo:", err);
            // Se erro, tenta novamente depois de 4s avançando slide
            setTimeout(goToNextSlide, 4000);
          });
      };

      if (video.readyState >= 2) {
        tryPlay();
      } else {
        // Ouve múltiplos eventos para garantir o carregamento
        video.addEventListener("loadeddata", tryPlay, { once: true });
        video.addEventListener("canplay", tryPlay, { once: true });
      }

    } else {
      intervalId = setInterval(goToNextSlide, 4000);
    }
  }

  // Inicializa o primeiro slide com pequeno delay para DOM e vídeos carregarem
  setTimeout(() => {
    handleSlideChange();
  }, 100);

  // Navegação manual
  document.querySelectorAll('input[name="slide"]').forEach((input, index) => {
    input.addEventListener('change', () => {
      goToSlide(index + 1);
    });
  });
});

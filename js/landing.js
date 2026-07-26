document.addEventListener("DOMContentLoaded", () => {

  const track = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".event-slide");

  const previousButton =
    document.querySelector(".carousel-button-left");

  const nextButton =
    document.querySelector(".carousel-button-right");

  const dots =
    document.querySelectorAll(".carousel-dot");


  if (
    !track ||
    slides.length === 0
  ) {
    return;
  }


  let currentSlide = 0;


  function showSlide(index) {

    if (index < 0) {
      index = slides.length - 1;
    }

    if (index >= slides.length) {
      index = 0;
    }


    currentSlide = index;


    track.style.transform =
      `translateX(-${currentSlide * 100}%)`;


    dots.forEach((dot, index) => {

      dot.classList.toggle(
        "active",
        index === currentSlide
      );

    });

  }


  if (nextButton) {

    nextButton.addEventListener(
      "click",
      () => {

        showSlide(
          currentSlide + 1
        );

      }
    );

  }


  if (previousButton) {

    previousButton.addEventListener(
      "click",
      () => {

        showSlide(
          currentSlide - 1
        );

      }
    );

  }


  dots.forEach((dot) => {

    dot.addEventListener(
      "click",
      () => {

        const targetSlide =
          Number(dot.dataset.slide);

        showSlide(targetSlide);

      }
    );

  });


  showSlide(0);

});

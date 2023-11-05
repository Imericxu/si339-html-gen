$(document).ready(() => {
  // Nav dropup interactivity
  const dropup = $("#nav .dropup");
  const dropupBtn = $("#nav .dropup__btn");
  const classNameDropupOpen = "dropup--open";
  dropupBtn.click(() => {
    dropup.toggleClass(classNameDropupOpen);
  });
  // Open if hovering container or child elements
  dropup.on("pointerover", (e) => {
    if (e.pointerType !== "mouse") return;
    dropup.addClass(classNameDropupOpen);
  });
  // Close if mouse leaves container
  dropup.on("pointerout", (e) => {
    if (e.pointerType !== "mouse") return;
    dropup.removeClass(classNameDropupOpen);
  });

  // Hero text show-hide interactivity
  const heroBtn = $("#header .hero__btn");
  const heroTxt = $("#header .hero__txt");
  const classNameIsVisible = "hero__txt--hidden";
  let backBtnHideTimeout;
  heroBtn.click(() => {
    // Stop timeout if it's running
    clearTimeout(backBtnHideTimeout);
    heroTxt.toggleClass(classNameIsVisible);
    $(".back-btn").toggleClass("back-btn--hidden");
    // Make back button visible again after 5 seconds
    backBtnHideTimeout = setTimeout(() => {
      $(".back-btn").removeClass("back-btn--hidden");
    }, 5000);
  });
  heroBtn.on("pointerover", (e) => {
    if (e.pointerType !== "mouse") return;
    heroTxt.addClass(classNameIsVisible);
  });
  heroBtn.on("pointerout", (e) => {
    if (e.pointerType !== "mouse") return;
    heroTxt.removeClass(classNameIsVisible);
  });

  let longTextTimeout = setTimeout(checkLongTextInteractivity);
  $(window).resize(() => {
    clearTimeout(longTextTimeout);
    longTextTimeout = setTimeout(checkLongTextInteractivity, 100);
  });

  // Hover effect for back button
  const classNameBackBtnHover = "back-btn--hovered";
  // Add class to the closest parent with class .back-btn
  $(".back-btn__action").hover(
    (e) => {
      $(e.target).closest(".back-btn").addClass(classNameBackBtnHover);
    },
    (e) => {
      $(e.target).closest(".back-btn").removeClass(classNameBackBtnHover);
    },
  );
});

function checkLongTextInteractivity() {
  // Long text Reddit-style expand-collapse interactivity
  const longTexts = $(".long-text");
  for (const longText of longTexts) {
    if ($(longText).hasClass("long-text--expandable")) {
      // Content scroll height plus parent block padding
      const boundHeight = $(longText).find(".long-text__content")[0]
        .scrollHeight;
      const parentPadding =
        parseInt($(longText).css("padding-top").replace("px", "")) * 2;

      if (boundHeight + parentPadding >= 496) continue;
      // Remove interactivity
      $(longText).removeClass("long-text--expandable");
      $(longText).removeClass("long-text--expanded");
      $(longText).find(".long-text__btn").remove();
      $(longText).height("");
      // Remove div wrapper
      $(longText).find(".long-text__content").contents().unwrap();
    } else {
      if (longText.scrollHeight < 496) continue;
      $(longText).outerHeight(496);
      // Wrap content in div
      $(longText).wrapInner("<div class='long-text__content'></div>");
      // Add class to make text expandable
      $(longText).addClass("long-text--expandable");
      // Add button to expand-collapse text
      $(longText).prepend(
        "<button class='long-text__btn' aria-label='Expand'></button>",
      );
      // Add interactivity to button
      const longTextBtn = $(longText).find(".long-text__btn");
      longTextBtn.click(() => {
        if ($(longText).hasClass("long-text--expanded")) {
          $(longText).toggleClass("long-text--expanded");
          $(longText).outerHeight(496);
          longTextBtn.attr("aria-label", "Expand");
          // Wait for animation to finish
          setTimeout(() => {
            if (
              $(longText).offset().top + $(longText).outerHeight() <
              $(window).scrollTop()
            ) {
              $(longText)[0].scrollIntoView();
            }
          }, 600);
        } else {
          $(longText).toggleClass("long-text--expanded");
          // Exact height of auto
          $(longText).height($(longText).find(".long-text__content").height());
          longTextBtn.attr("aria-label", "Collapse");
        }
      });
    }
  }
}

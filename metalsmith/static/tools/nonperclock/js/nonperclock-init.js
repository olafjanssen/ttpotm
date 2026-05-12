/**
 * NonPerClock initialization script
 * Initializes date, theme, and time displays
 * Dependencies: nonperclock.js, ponacalendar.js
 */
(function () {
  "use strict";

  // Initialize PonaCalendar date and theme
  const ponaDate = PonaCalendar.ponaDateFromTimestamp(new Date().getTime());

  var ponadateEl = document.getElementById("ponadate");
  var ponathemeEl = document.getElementById("ponatheme");
  var ponatimeEl = document.getElementById("ponatime");

  if (ponadateEl) {
    ponadateEl.innerHTML = ponaDate.formatPona();
  }

  if (ponathemeEl) {
    ponathemeEl.innerHTML = ponaDate.dayTheme();
  }

  ponatimeEl.innerHTML = NonPerClock.getFormattedTime({
    formatType: "html",
  });

  // Update time every 200ms
  if (ponatimeEl) {
    setInterval(function () {
      ponatimeEl.innerHTML = NonPerClock.getFormattedTime({
        formatType: "html",
      });
    }, 1200);
  }
})();

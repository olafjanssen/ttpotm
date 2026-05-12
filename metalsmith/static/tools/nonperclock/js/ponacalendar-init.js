/**
 * PonaCalendar widget initialization script
 * Creates the calendar widget for the today page
 * Dependencies: ponacalendar.js
 */
(function() {
    'use strict';

    var ponaCalendarEl = document.getElementById('ponacalendar');

    if (ponaCalendarEl) {
        let widget = new PonaCalendar.PonaCalendarWidget(
            ponaCalendarEl,
            PonaCalendar.ponaDateFromTimestamp(new Date().getTime())
        );
    }
})();

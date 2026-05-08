/*
 (c) 2018, Olaf T.A. Janssen
 A proposal for a personal non-linear clock system

 https://github.com/olafjanssen/nonperclock (TODO)
*/

(function () {
    'use strict';

    var dec = '<span class="dek"></span>',//'↊',
        el = '<span class="el"></span>'; //'↋';

    var now, clock;

    var seasons = {
        0: 'o-taso-lon',
        1: 'o-awen-kiwen',
        2: 'o-awen-lon',
        3: 'o-sin-pona',
        4: 'o-lon-pona',
        5: 'tenpo-suno-namako'
    };

    const dayThemes = [
        'kasi','telo','lupa','lape','supa','anpa','pipi','weka','insa','moku','len','ilo','ala'
    ]
    

    function ponaDateFromTimestamp(t) {
        let seasonDays = 73;
        let standardDayMillis = 24 * 60 * 60 * 1000;
        let standardYearMillis = 365 * standardDayMillis;
        let ponaSeasonMillis = seasonDays * standardDayMillis;
        let equinoxOffset = 172 * standardDayMillis;
        let sign = t < 0 ? -1 : 1;

        let remaining = t - equinoxOffset,
            ponaDate = {timestamp: t, year: 101970, season: 0, seasonDay: 0, week: 0, weekDay: 0, dayTime: 0};

        // roll up the year
        while (remaining !== 0) {
            let isLeap = (ponaDate.year % 4 === 0) && (ponaDate.year % 128 > 0);
            if (sign * remaining > standardYearMillis + (isLeap ? standardDayMillis : 0)) {
                remaining -= sign * (standardYearMillis + (isLeap ? standardDayMillis : 0));
                ponaDate.year += sign;
            } else {
                break;
            }
        }
        // obtain season 0-index
        ponaDate.season = Math.floor(remaining / ponaSeasonMillis);
        remaining -= ponaDate.season * ponaSeasonMillis;
        ponaDate.seasonDay = Math.floor(remaining / standardDayMillis);
        remaining -= ponaDate.seasonDay * standardDayMillis;

        // obtain week 0-index
        ponaDate.week = Math.floor((ponaDate.seasonDay - 1) / 12) + 1;
        // obtain weekday 0-index
        ponaDate.weekDay = ponaDate.seasonDay === 0 ? 0 : (ponaDate.seasonDay - 1) % 12;
        // set day time in millis
        ponaDate.dayTime = remaining;

        let pDate = PonaDate(ponaDate);
        return pDate;
    }


    function formatDozenal(decimal) {
        return new Number(decimal).toString(12).replace(/a/g, dec).replace(/b/g, el);
    }

    let dz = formatDozenal;

    function PonaDate(ponaDate) {

        function formatNumeric() {
            return dz(ponaDate.year) + ' : ' + dz(ponaDate.season + 1) + ' : ' + dz(ponaDate.week) + ' : ' + dz(ponaDate.weekDay + 1);
        }

        function formatPona() {
            return (ponaDate.season<5?dz(ponaDate.seasonDay):'') + ' ' + seasons[ponaDate.season] + ' ' + dz(ponaDate.year);
        }

        return {
            isLeap: function(){
                return (ponaDate.year % 4 === 0) && (ponaDate.year % 128 > 0);
            },
            dayTheme: function(){
                return ponaDate.week == 0 ? dayThemes[dayThemes.length-1] : dayThemes[ponaDate.weekDay];
            },
            numericDate: ponaDate,
            formatNumeric: formatNumeric,
            formatPona: formatPona
        }
    }


    /**
     * Initializes the current day from which the clock time can be computed.
     */
    function initDay(date) {
        now = date ? date.getTime() : new Date().getTime();
        ponaDateFromTimestamp(now);
    }

    /**
     * Gives the current date
     *
     * @returns {string} date as a string
     */
    function getFormattedDate(settings) {
        var formatType = settings.formatType ? settings.formatType : 'simple';
        var date = settings.date ? settings.date : new Date();

        initDay(date);

        return '';
    }

    /**
     * Helper function for creating a DOM element with a full set of attributes and styles.
     *
     * @param tag           the xml tag
     * @param attributes    a key-value object with attributes
     * @param styles        a key-value object with css styles
     * @param namespace     an optional namespace string
     * @returns {Element}   the DOM element
     */
    function createNewElement(tag, attributes, styles, namespace) {
        var element = namespace ? document.createElementNS(namespace, tag) : document.createElement(tag);

        for (var attribute in attributes) {
            if (!attributes.hasOwnProperty(attribute)) {
                continue;
            }
            if (attributes[attribute].ns) {
                element.setAttributeNS(attributes[attribute].ns, attribute, attributes[attribute].value);
            } else {
                element.setAttribute(attribute, attributes[attribute]);
            }
        }
        for (var style in styles) {
            if (styles.hasOwnProperty(style)) {
                element.style[style] = styles[style];
            }
        }
        return element;
    }

    let PonaCalendarWidget = function (container, ponaDate) {

        let allSeasons = true;
        let calendarDiv = createNewElement('div', {class: 'pona-calendar-widget'});

        for (let s = 0; s < 5; s++) {
            let seasonDiv = createNewElement('div', {class: 'pc-season', 'data-season': s});
            let titleDiv = createNewElement('div', {class: 'pc-season-title'});
            titleDiv.innerHTML = seasons[s];
            seasonDiv.appendChild(titleDiv);

            let resetDiv = createNewElement('div', {class: 'pc-day pc-reset-day', 'data-seasonday': 0});
            resetDiv.innerHTML = '0';
            seasonDiv.appendChild(resetDiv);

            let weeksDiv = createNewElement('div', {class: 'pc-weeks'});
            let dayCounter = 0;
            for (let week = 0; week < 6; week++) {
                let weekDiv = createNewElement('div', {class: 'pc-week', 'data-week': week + 1});
                for (let day = 0; day < 12; day++) {
                    dayCounter++;
                    let dayDiv = createNewElement('div', {
                        class: 'pc-day',
                        'data-weekday': day,
                        'data-seasonday': dayCounter
                    });
                    dayDiv.innerHTML = dz(dayCounter);
                    weekDiv.appendChild(dayDiv);
                }
                weeksDiv.appendChild(weekDiv);
            }
            seasonDiv.appendChild(weeksDiv);
            calendarDiv.appendChild(seasonDiv);
        }

        if (ponaDate && ponaDate.isLeap()) {
            let seasonDiv = createNewElement('div', {class: 'pc-season', 'data-season': 5});
            let resetDiv = createNewElement('div', {class: 'pc-day pc-reset-day', 'data-seasonday': 0});
            resetDiv.innerHTML = '0';
            seasonDiv.appendChild(resetDiv);
            calendarDiv.appendChild(seasonDiv);
        }

        container.appendChild(calendarDiv);

        if (ponaDate) {
            calendarAddDate(ponaDate,'today');
        }

        function calendarAddDate(date, cl) {
            let dayElem = calendarDiv.querySelector('[data-season="' + date.numericDate.season + '"] [data-seasonDay="' + date.numericDate.seasonDay + '"]');
            dayElem.classList.add(cl?cl:'event');
        }

        return {
            calendarAddAte: calendarAddDate
        }
    };

    /**
     * Public interface
     */
    var PonaCalendar = {
        getFormattedDate: getFormattedDate,
        ponaDateFromTimestamp: ponaDateFromTimestamp,

        PonaCalendarWidget: PonaCalendarWidget
    };

    // export as Node module / AMD module / browser variable
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = PonaCalendar;
    } else if (typeof define === 'function' && define.amd) {
        define(PonaCalendar);
    } else {
        window.PonaCalendar = PonaCalendar;
    }

})();
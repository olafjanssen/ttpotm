/*
 (c) 2018, Olaf T.A. Janssen
 A proposal for a personal non-linear clock system

 https://github.com/olafjanssen/nonperclock (TODO)
*/

(function () {
    'use strict';

    var dec = '<span class="dek"></span>',//'↊',
        el = '<span class="el"></span>'; //'↋';

    var lat = 51.4228920,
        lon = 5.5571360;

    var day = 24 * 3600 * 1000;
    var quadrantSize = 6 * 144 * 144;

    var now, today, yesterday, tomorrow, quadrants;

    /**
     * Initializes the current day from which the clock time can be computed.
     */
    function initDay(date) {
        now = date ? date.getTime() : new Date().getTime();
        today = SunCalc.getTimes(new Date(now), lat, lon);
        yesterday = SunCalc.getTimes(new Date(now - day), lat, lon);
        tomorrow = SunCalc.getTimes(new Date(now + day), lat, lon);

        quadrants = [
            yesterday.sunset,
            today.nadir, // start of quadrant 0
            today.sunriseEnd,
            today.solarNoon,
            today.sunset, // start of quadrant 4
            tomorrow.nadir
        ];

    }

    /**
     * Returns the time in quadrant coordinates (0 to 4)
     * @param date  the local date/time to convert
     */
    function getQuadrantCoordinate(date) {
        initDay(date);
        var time = date;
        var quadrantCoordinate = 0;

        for (var index = 0; index < quadrants.length; index++) {
            if (time < quadrants[index]) {
                return index + (time - quadrants[index - 1]) / (quadrants[index] - quadrants[index - 1]) - 2;
            }
        }
        return false;
    }

    /**
     * Computes the non-linear normalized time coordinate (-1 to 1)
     */
    function getNonLinearNormalizedCoordinate(quadrantCoordinate) {
        return (quadrantCoordinate < 1 || quadrantCoordinate>3 ? -1 : 1) * Math.pow(Math.sin((quadrantCoordinate-1) * Math.PI/2), 2);
    }

    function formatDozenalDekEl(dozenal) {
        return dozenal.replace(/a/g, dec).replace(/b/g, el);
    }

    let dz = formatDozenalDekEl;
    
    /**
     * Computes non-per-clock object a normalized time coordinate
     */
    function getNonPerClock(timeCoordinate) {
        var sign = timeCoordinate < 0 ? '-1' : 1;
        var time = Math.abs(Math.floor(timeCoordinate * quadrantSize));

        var time12 = new Number(time).toString(12);//.replace(/a/g, dec).replace(/b/g, el);

        var major = time12.length < 5 ? '0' : time12.substr(-5, 1),
            minor = time12.length < 4 ? '0' : time12.substr(-4, 1),
            patch = time12.length < 3 ? '0' : time12.substr(-3, 1),
            remainder = time12.substr(-2, 2);

        return {
            time: time,
            sign: sign,
            major: major,
            minor: minor,
            patch: patch,
            remainder: remainder
        }
    }

    /**
     * Returns clock object as a string.
     *
     * @param clock
     */
    function getDozenalFormattedClock(clock) {
        return clock.sign === -1 ? '-' : '' + clock.major + ':' + clock.minor + ':' + clock.patch + '/' + clock.remainder;
    }

    /**
     * Returns clock object as html.
     *
     * @param clock
     */
    function getDozenalFormattedClockHTML(clock) {
        return '<span class="nonperclock"><span class="npc-sign" data-npc-sign="' + clock.sign + '"></span><span class="npc-major">' + dz(clock.major) + '</span><span class="npc-major-sep"></span><span class="npc-minor">' + dz(clock.minor) + '</span><span class="npc-minor-sep"></span><span class="npc-patch">' + dz(clock.patch) + '</span><span class="npc-patch-sep"></span><span class="npc-remainder">' + dz(clock.remainder) + '</span></span>';
    }


    /**
     * Gives the current time
     *
     * @returns {string} time as a string
     */
    function getFormattedTime(settings) {
        var formatType = settings.formatType ? settings.formatType : 'simple';
        lat = settings.lat ? settings.lat : lat;
        lon = settings.lon ? settings.lat : lon;

        var date = settings.date ? settings.date : new Date();

        initDay(date);
        var quadrantCoordinate = getQuadrantCoordinate(date);
        var timeCoordinate = getNonLinearNormalizedCoordinate(quadrantCoordinate);
        var clock = getNonPerClock(timeCoordinate);

        return formatType === 'html' ? getDozenalFormattedClockHTML(clock) : getDozenalFormattedClock(clock);
    }

    /**
     * Public interface
     */
    var NonPerClock = {
        getFormattedTime: getFormattedTime,
        getQuadrantCoordinate: getQuadrantCoordinate,
        getNonLinearNormalizedCoordinate: getNonLinearNormalizedCoordinate
    }

    // export as Node module / AMD module / browser variable
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = NonPerClock;
    }
    else if (typeof define === 'function' && define.amd) {
        define(NonPerClock);
    }
    else {
        window.NonPerClock = NonPerClock;
    }

})();
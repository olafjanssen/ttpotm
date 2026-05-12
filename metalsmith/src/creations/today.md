---
title: "Today"
titleprefix: "The Toki Ponist on the Mountain Topic:"
longtitle: ""
tag: today
thumb: "img/topic-home.png"
description: "A different time, a different calendar, a different life."
date: 2021-09-10
type: info
layout: project.html
tags: tools
---

<div id="ponacalendar" style="float:right;width:20em;text-align:right;"></div>

## Today

Working back from the diagrams written in egg yoke on ancient e-ink displays, the current date and time is given as:

<blockquote><p><span id="ponadate"></span> | <code id="ponatheme"></code> | <span id="ponatime"></span></p></blockquote>


## Calendar

<div id="drawing" style="float:right;margin-left:1em;"></div>

The current day shines as a dark ring on the *analemma* calendar. There are five seasons, consisting of 6 weeks with a dozen days each. Each seasons starts with a reset day zero. Leap years start with a double reset day or `tenpo suno namako`.

The year starts at the day of the summer solstice and meets the following five seasons or moods in turn:

- `o-taso-lon` - the season of simply being
- `o-awen-kiwen` - the season to brace yourself
- `o-awen-lon` - the season to celebrate just surviving
- `o-sin-pona` - the season of renewed hope
- `o-lon-pona` - the season of joyful living

## Week tasks
While in early references, there is no mention of naming weeks of days of the week, cross-referencing other sources has lead to the following interpretation. Each day of the week is themed to a home-bound focus. These are:

- 0 - `ala` - reset day
- 1 - `kasi` - care of indoor plants and garden
- 2 - `telo` - care of water spaces such as bathrooms and kitchen sinks
- 3 - `lupa` - care of doors, windows and their frames
- 4 - `lape` - care of resting and sleeping spaces
- 5 - `supa` - care of surfaces
- 6 - `anpa` - care of floors
- 7 - `pipi` - care of bugs and pests
- 8 - `weka` - care of throwing away
- 9 - `insa` - care of inner spaces such as fridges, drawers and cupboards
- <span class="dek"></span> - `moku` - care of cooking and pantry
- <span class="el"></span> - `len` - care of clothing and curtains
- 10 - `ilo` - care of appliances and machines (including car and bike)


<link rel="stylesheet" href="/tools/nonperclock/css/nonperclock.css">
<link rel="stylesheet" href="/tools/nonperclock/css/ponacalendar.css">
<link rel="stylesheet" href="/tools/nonperclock/css/dek-el.css">

<script src="/tools/nonperclock/lib/suncalc.js"></script>
<script src="/tools/nonperclock/lib/svg.min.js"></script>
<script src="/tools/nonperclock/js/nonperclock.js"></script>
<script src="/tools/nonperclock/lib/moment.min.js"></script>
<script src="/tools/nonperclock/js/ponacalendar.js"></script>
<script src="/tools/nonperclock/js/nonperclock-init.js"></script>
<script src="/tools/nonperclock/js/ponacalendar-init.js"></script>

<script>

    var w = 150, h = 300, margin = 0.1;
    var draw = SVG('drawing').size(w, h);

    // all days
    var d = 0, dt, sunPos, alts = [], azms = [], points = [];
    for (d = 0; d < 366; d++) {
        dt = new Date(Date.UTC(2018, 0, d, 12, 0));
        sunPos = SunCalc.getPosition(dt, 51.422894, 5.557136);

        var alt = sunPos.altitude * 180 / Math.PI;
        var azm = sunPos.azimuth * 180 / Math.PI;

        console.log(dt, sunPos);

        points.push([azm, alt]);
    }
    var xlim = [Math.min(...points.map(function (d) {
        return d[0]
    })
    ),
    Math.max(...points.map(function (d) {
        return d[0]
    })
    )]
    ;
    var ylim = [Math.min(...points.map(function (d) {
        return d[1]
    })
    ),
    Math.max(...points.map(function (d) {
        return d[1]
    })
    )]
    ;

    function displayConvert(d) {
        return [
            margin / 2 * w + (1 - margin) * ((d[0] - xlim[0]) / (xlim[1] - xlim[0]) * w), h - (margin / 2 * w + (1 - margin) * ((d[1] - ylim[0]) / (ylim[1] - ylim[0]) * h))
        ];
    }

    function drawDate(date, fill, r) {
        if (!r) {
            r = 2;
        }
        sunPos = SunCalc.getPosition(date, 51.422894, 5.557136);

        var alt = sunPos.altitude * 180 / Math.PI;
        var azm = sunPos.azimuth * 180 / Math.PI;
        var p = displayConvert([azm, alt]);

        var circ = draw.circle(r).fill(fill).move(p[0] - r / 2, p[1] - r / 2).opacity(1);
    }

    var pts = points.map(function (d) {
        return displayConvert(d);
    });

    let settings = { stroke: 15, radius: 10, todayRadius: 20}

    var polygon = draw.polygon(pts).fill('none').stroke({width: settings.stroke})

    for (let d = 365; d >= 0; d--) {
        let pDate = PonaCalendar.ponaDateFromTimestamp(new Date(Date.UTC(2019, 0, d, 12, 0)).getTime());

        let s = settings.radius;

        let seasonColors = [
            '#FFC001', '#F3B084', '#BFBFBF', '#B4C6E7', '#C6E0B4'
        ];

        drawDate(new Date(Date.UTC(2019, 0, d, 12, 0)), seasonColors[pDate.numericDate.season], s);
    }

    drawDate(new Date(Date.UTC(2019, new Date().getMonth(), new Date().getDate(), 12, 0)), 'rgba(0,0,0,0.5)', settings.todayRadius);

</script>

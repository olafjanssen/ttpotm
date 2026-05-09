---
title: "Nonperclock"
layout: project.html
description: "A different time, a different calendar, a different life."
date: 2021-09-10
thumb: "img/topic-home.png"
character: "Dr. Olaf T.A. Janssen, PhD"
character_initials: "OJ"
character_text: "The calendar the universe actually uses. We just forgot."
category: tools
---

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

<div id="ponacalendar"></div>

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


<script src="../../tools/nonperclock/lib/suncalc.js"></script>
<script src="../../tools/nonperclock/lib/svg.min.js"></script>
<script src="../../tools/nonperclock/js/nonperclock.js"></script>

<script src="../../tools/nonperclock/lib/moment.min.js"></script>
<script src="../../tools/nonperclock/js/ponacalendar.js"></script>

<script>
    const ponaDate = PonaCalendar.ponaDateFromTimestamp(new Date().getTime());
    document.getElementById('ponadate').innerHTML = ponaDate.formatPona();
    document.getElementById('ponatheme').innerHTML = ponaDate.dayTheme();
    let widget = new PonaCalendar.PonaCalendarWidget(document.getElementById('ponacalendar'), PonaCalendar.ponaDateFromTimestamp(new Date().getTime()));

    setInterval(function () {
        document.getElementById('ponatime').innerHTML = NonPerClock.getFormattedTime({formatType: 'html'});
    }, 200);
</script>

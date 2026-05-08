var grammarRules = [
    {
        title: '[verb] ala [verb]',
        regex: /([a-z]+) ala \1/g,
        explanation: 'turns sentence into question'
    }
];

var CorpusLearning = (function () {
    let corpus = {};

    function playRound() {
        LearningMethod.validateLearningMethod(LearnerData.getData());

        let learningRate = LearnerData.getData().settings.learningRate;
        if (Math.random() > learningRate || Object.keys(LearnerData.getData().verses).length < 2) {
            let currentVerse = LearningMethod.selectNextVerse(LearnerData.getData(), corpus.verses);
            renderProblem(currentVerse, true);
        } else {
            // select old problem
            let oldVerses = Object.keys(LearnerData.getData().verses).map(function (id) {
                return {id: id, count: LearnerData.getData().verses[id]}
            });

            let minCount = 1e6;
            oldVerses = oldVerses.sort(function (a, b) {
                if (a.count < minCount) {
                    minCount = a.count;
                }
                return a.count - b.count;
            });

            oldVerses = oldVerses.filter(function (verse) {
                return verse.count < minCount + 3;
            });

            let currentId = oldVerses[Math.floor(Math.random() * oldVerses.length)].id;
            let currentVerse = corpus.verses.filter(function (verse) {
                return currentId == verse.id;
            })[0];
            renderProblem(currentVerse, false);
        }
    }

    function getCanards(lemma, lemmata, length) {
        let canards = {};
        while (Object.keys(canards).length < length) {
            Helper.Collections.shuffle(Object.keys(lemma)).forEach(function (a) {
                if (Object.keys(canards).length === length) return;

                let distances = Object.keys(lemmata).map(function (b) {
                    return {lemma: b, distance: Helper.Strings.lehvenStein(a, b)}
                }).sort(function (m, n) {
                    return m.distance - n.distance;
                });

                let choice = distances[Math.round(Math.random() * 20)].lemma;
                if (!lemma[choice]) {
                    canards[choice] = 1;
                }
            });
        }
        return canards;
    }

    function renderProblem(verse, isNew) {
        // render header
        let data = LearnerData.getData();
        let headerText = '<b>lines:</b> ' + Object.keys(data.verses).length + '/' + corpus.verses.length + ' (' + (Object.keys(data.verses).length / corpus.verses.length * 100).toFixed(0) + '%), <b>words:</b> ' + Object.keys(data.lemmata).length + '/' + Object.keys(corpus.lemmata).length + ' (' + (Object.keys(data.lemmata).length / Object.keys(corpus.lemmata).length * 100).toFixed(0) + '%)';

        let tokiText = verse.toki;
        verse.tokens.forEach(function (token) {
            tokiText = tokiText.replace(new RegExp(token), '{}');
        });
        tokiText = '<code>' + tokiText.replace(new RegExp('{}', 'g'), '<span class="tp-cl-void"></span>') + '</code>';

        let elements = Helper.DOM.createElements(
            {
                ref: 'problem',
                tag: 'div',
                attributes: {class: 'card tp-cl-problem text-center ml-auto mr-auto mb-2', 'data-verse-id': verse.id},
                children: [
                    {
                        tag: 'div',
                        attributes: {class: 'card-header p-2'},
                        children: [
                            isNew?{
                                tag: 'div',
                                attributes: {
                                    class: 'badge badge-success float-left',
                                },
                                innerHTML: 'new'
                            }:{},
                            {
                                tag: 'button',
                                attributes: {
                                    class: 'btn btn-warning btn-sm float-right report-button',
                                    'data-toggle': 'modal',
                                    'data-target': '#reportModal',
                                    'data-verse': verse.id
                                },
                                innerHTML: 'report'
                            },
                            {tag: 'h5', innerHTML: 'Translate (' + LearnerData.getData().problems + ')'},
                            {tag: 'small', innerHTML: headerText}
                        ]
                    },
                    {
                        tag: 'div',
                        attributes: {class: 'card-body'},
                        children: [
                            {
                                tag: 'div',
                                attributes: {class: 'card-text'},
                                innerHTML: verse.eng
                            },
                            {
                                ref: 'toki-spots',
                                tag: 'div',
                                attributes: {class: 'card-text m-2 bg-dark text-white tp-cl-solution'},
                                innerHTML: '<code>' + tokiText + '</code>'
                            },
                            {
                                ref: 'explanation',
                                tag: 'div',
                                attributes: {class: 'card-text text-muted text-left tp-cl-explanation'}
                            }
                        ]
                    },
                    {
                        ref: 'footer',
                        tag: 'div',
                        attributes: {class: 'card-footer pl-1 pl-2'},
                    }
                ]
            }
        );

        let containerEl = document.getElementById('problem');
        containerEl.insertBefore(elements.root, containerEl.firstElementChild);

        let errors = 0;

        let canards = getCanards(verse.lemmas, corpus.lemmata, 1);
        let tokenContainer = elements.dict['footer'];

        Helper.Collections.shuffle([...verse.tokens, ...Object.keys(canards)]).forEach(function (word) {
            let wordSpan = Helper.DOM.createNewElement('button', {class: 'btn btn-primary m-2'});
            wordSpan.innerHTML = word;
            tokenContainer.appendChild(wordSpan);

            wordSpan.addEventListener('click', function () {
                let answer = false;
                [...elements.dict['toki-spots'].querySelectorAll('.tp-cl-void')].forEach(function (spot, idx) {
                    if (answer) return;
                    if (spot.innerHTML === '') {
                        if (word === verse.tokens[idx]) {
                            spot.innerHTML = word;
                            wordSpan.classList.add('tp-cl-used');
                            wordSpan.setAttribute('disabled', 'true');
                            answer = true;
                        } else {
                            wordSpan.classList.add('btn-danger');
                            wordSpan.setAttribute('disabled', 'true');
                            setTimeout(function () {
                                wordSpan.classList.remove('btn-danger');
                                wordSpan.removeAttribute('disabled');
                            }, 1000);
                            LearnerData.updateWrongLemma(word);
                            errors++;
                            answer = true;
                        }
                    }
                });

                // check if done
                if ([...elements.dict['toki-spots'].querySelectorAll('.tp-cl-void:empty')].length === 0) {
                    if (errors) {
                        LearnerData.updateWrongVerse(verse.id);
                        tokenContainer.classList.add('bg-warning');
                        tokenContainer.innerHTML = "a! o pali sike sin!";

                        let explanationText = "<hr>";
                        // show help lines
                        Object.keys(verse.lemmas).forEach(function (lemma) {
                            explanationText += '<code>' + lemma + '</code> - <span>' + corpus.lemmata[lemma].definition + '</span><br>';
                        });
                        elements.dict['explanation'].innerHTML = explanationText;

                        LearnerData.updateLearningRate(LearnerData.getData().settings.learningRate + 0.1);

                        // try again
                        setTimeout(function () {
                            renderProblem(verse, false);
                        }, 1000);
                    } else {
                        LearnerData.updateCorrectVerse(verse.id);
                        tokenContainer.classList.add('bg-success');
                        tokenContainer.innerHTML = "pona!";

                        verse.tokens.forEach(function (token) {
                            LearnerData.updateCorrectLemma(token);
                        });

                        LearnerData.updateLearningRate(LearnerData.getData().settings.learningRate - 0.025);

                        // try a new problem
                        setTimeout(function () {
                            playRound();
                        }, 1000);
                    }
                    tokenContainer.classList.add('text-white');
                    elements.root.classList.add('done');
                }
            });
        });
    }

    Helper.Data.loadJSON('./data/tp_verses.json').then(function (data) {
        data.verses.forEach(function (verse) {
            let words = verse.toki.split(/[^0-9a-zA-Z]+/);
            verse.tokens = words.slice(0, words.length - 1);
            verse.lemmas = Helper.Collections.Set.fromArray(verse.tokens);
        });
        corpus = data;

        playRound();
    });

    return {
        play: playRound
    }
})();



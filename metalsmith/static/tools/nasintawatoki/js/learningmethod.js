const LearningMethod = (function () {

    const sortMethods = {
        'explore-concepts': function (a, b) {
            if (a.new_lemmas > b.new_lemmas) return 1;
            if (a.new_lemmas < b.new_lemmas) return -1;
            if (a.lemma_avg > b.lemma_avg) return -1;
            if (a.lemma_avg < b.lemma_avg) return 1;
            if (a.tokens.length > b.tokens.length) return 1;
            if (a.tokens.length < b.tokens.length) return -1;
            return 0;
        },
        'short-sentences': function (a, b) {
            if (a.new_lemmas > b.new_lemmas) return 1;
            if (a.new_lemmas < b.new_lemmas) return -1;
            if (a.tokens.length > b.tokens.length) return 1;
            if (a.tokens.length < b.tokens.length) return -1;
            if (a.lemma_avg > b.lemma_avg) return -1;
            if (a.lemma_avg < b.lemma_avg) return 1;
            return 0;
        },
        'fast-vocabulary': function (a, b) {
            // always try to learn at least 1 new lemma
            if ((a.new_lemmas > b.new_lemmas) || (a.new_lemmas === 0 && b.new_lemmas>0)) return 1;
            if ((a.new_lemmas < b.new_lemmas) || (b.new_lemmas === 0 && a.new_lemmas>0)) return -1;
            if (a.tokens.length > b.tokens.length) return 1;
            if (a.tokens.length < b.tokens.length) return -1;
            if (a.lemma_avg > b.lemma_avg) return -1;
            if (a.lemma_avg < b.lemma_avg) return 1;
            return 0;
        },
        'quaint-sentences': function (a, b) {
            if (a.lemma_avg > b.lemma_avg) return 1;
            if (a.lemma_avg < b.lemma_avg) return -1;
            if (a.new_lemmas > b.new_lemmas) return 1;
            if (a.new_lemmas < b.new_lemmas) return -1;
            if (a.tokens.length > b.tokens.length) return 1;
            if (a.tokens.length < b.tokens.length) return -1;
            return 0;
        }
    };

    function validateLearningMethod(learnerData){
        // reinforce radio setting of learning method in the learner data and the DOM
        let checkedButton = document.querySelector('[name="methodRadio"]:checked');
        if (!checkedButton) {
            document.querySelector('[data-method="' + learnerData.settings.method + '"]').checked = true;
        } else if (checkedButton.getAttribute('data-method') !== learnerData.settings.method) {
            LearnerData.updateLearningMethod(checkedButton.getAttribute('data-method') );
        }
    }

    function selectNextVerse(learnerData, _verses) {
        let used_lemma = learnerData.lemmata;
        let usedVerses = learnerData.verses;
        let verses = JSON.parse(JSON.stringify(_verses));

        verses = verses.filter(function (verse) {
            return !usedVerses[verse.id];
        });

        verses.forEach(function (verse) {
            let new_lemmas = Helper.Collections.Set.difference(verse.lemmas, used_lemma);
            verse.new_lemmas = Object.keys(new_lemmas).length;
        });

        verses.sort(sortMethods[learnerData.settings.method]);

        console.log('====== new round');
        for (let i = 0; i < 5; i++) {
            console.log(verses[i].new_lemmas, verses[i].lemma_avg, verses[i].tokens.length, verses[i].toki);
        }

        return verses[0];
    }

    return {
        selectNextVerse: selectNextVerse,
        validateLearningMethod: validateLearningMethod
    }
})();
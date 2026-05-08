/**
 *  Controller of Learner Data
 */
var LearnerData = (function () {

    let learnerData = {
        version: '1.0-2019.01.28',
        verses: {},
        lemmata: {},
        problems: 1,
        settings: {learningRate: 0.5, method: 'explore-concepts'}
    };

    function getData() {
        return learnerData;
    }

    function updateCorrectLemma(lemma) {
        learnerData.lemmata[lemma] = learnerData.lemmata[lemma] ? learnerData.lemmata[lemma] + 1 : 1;
    }

    function updateCorrectVerse(verseId) {
        learnerData.verses[verseId] = learnerData.verses[verseId] ? learnerData.verses[verseId] + 1 : 1;
        learnerData.problems++;
        toLocalStorage();
    }

    function updateWrongLemma(lemma) {
        learnerData.lemmata[lemma] = Math.max(1, learnerData.lemmata[lemma] - 1);
    }

    function updateWrongVerse(verseId) {
        if (learnerData.verses[verseId]) {
            learnerData.verses[verseId] = Math.max(1, learnerData.verses[verseId] - 1);
        }
        learnerData.problems++;
        toLocalStorage();
    }

    function toLocalStorage() {
        localStorage.setItem('cl-learner-data', JSON.stringify(learnerData));
    }

    function fromHash(hash) {
        console.log(hash);
        learnerData = upcast(JSON.parse(decodeURIComponent(atob(decodeURIComponent(hash)))));
        console.log(learnerData);
    }

    /**
     * Upcast old learnerdata versions to the latests version.
     *
     * @param ld
     * @returns {*}
     */
    function upcast(ld) {
        if (!ld.version) {
            if (!ld.settings.method) {
                ld.settings.method = 'explore-concepts';
            }
            ld.version = '1.0-2019.01.28';
        }
        return ld;
    }

    function fromLocalStorage() {
        let data = localStorage.getItem('cl-learner-data');
        if (data) {
            try {
                console.log('parsing local storage data');
                learnerData = upcast(JSON.parse(data));

            } catch (e) {
                console.log('parsing error, falling back to empty data')
            }
        } else {
            console.warn('Key in localStorage does not exist yet.');
        }
    }

    function updateLearningRate(newRate) {
        learnerData.settings.learningRate = Math.max(0.1, Math.min(0.9, newRate));
    }

    function updateLearningMethod(method) {
        learnerData.settings.method = method;
    }

    return {
        updateCorrectLemma: updateCorrectLemma,
        updateCorrectVerse: updateCorrectVerse,
        updateWrongLemma: updateWrongLemma,
        updateWrongVerse: updateWrongVerse,
        updateLearningRate: updateLearningRate,
        updateLearningMethod: updateLearningMethod,
        getData: getData,

        fromHash: fromHash,
        fromLocalStorage: fromLocalStorage,
        toLocalStorage: toLocalStorage
    }
})();
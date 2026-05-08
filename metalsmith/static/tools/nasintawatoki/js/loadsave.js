let LoadSave = (function () {

    let mailButton = document.getElementById('mail-button');

    mailButton.addEventListener('click', function () {

        // build progress link
        let progressLink = window.location.href.split(/[?#]/)[0] + '#' + encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(LearnerData.getData()))));

        let mailText = 'toki!\n\nYou can continue your toki pona learning progress on any device by clicking the following link:\n\n' + progressLink + '\n\nThe link is a direct translation of your progress, if you want to transfer your progress again, you have to create a new link from the app.\n\nawen pona,\nThe Toki Ponist on the Mountain\n';

        // build mailto link
        let linkText = 'mailto:?subject=';
        linkText += encodeURIComponent('TPotM: Learner Progress');
        linkText += '&body=';
        linkText += encodeURIComponent(mailText);

        let anchor = Helper.DOM.createElements(
            {
                tag: 'a',
                attributes: {
                    href: linkText
                }
            }
        );

        anchor.root.click();
    });

    let hash = window.location.hash;
    if (hash) {
        // check for hash
        console.log('try the hash');
        try {
            console.log('parsing the hash');
            LearnerData.fromHash(window.location.hash.substr(1));
            history.replaceState(null, null, document.location.pathname);
        } catch(e) {
            console.log('error parsing hash, try local storage');
            LearnerData.fromLocalStorage();
        }
    } else {
        // else check for localStorage
        console.log('try the localStorage');
        LearnerData.fromLocalStorage();
    }

})();
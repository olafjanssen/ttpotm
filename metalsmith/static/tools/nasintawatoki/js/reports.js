/**
 * Self-container module to create and handle reports.
 */
const Reports = (function(){
    let reportTextArea = document.getElementById('report-text');

    document.getElementById('report-send-button').addEventListener('click', function () {
        const params = "id=" + encodeURIComponent(reportTextArea.getAttribute('data-verse')) + "&msg=" + encodeURIComponent(reportTextArea.value);
        let xhr = new XMLHttpRequest();
        xhr.open("POST", 'api/reports/index.php', true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(params);
        $('#reportModal').modal('hide');

        document.querySelector('[data-verse-id="'+reportTextArea.getAttribute('data-verse')+'"] .report-button').setAttribute('disabled','true');

        sendAlert('pona! Your report has been sent.');
    });

    $('#reportModal').on('show.bs.modal', function (e) {
        reportTextArea.value = '';
        reportTextArea.setAttribute('data-verse',
            e.relatedTarget.getAttribute('data-verse'));
    });

    function sendAlert(msg) {
        let alert = Helper.DOM.createElements({
            ref: 'alert',
            tag: 'div',
            attributes: {'class': 'alert alert-success alert-dismissable fade show fixed-top text-center', 'role': 'alert'},
            innerHTML: '<strong>'+msg+'</strong><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span> </button>'
        });
        document.body.insertBefore(alert.root,document.body.firstChild);

        setTimeout(function(){
            $(".alert").alert('close');
        }, 4000);
    }

})();
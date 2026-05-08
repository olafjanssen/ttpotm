<?php
/**
 * Simple script for returning and reporting reports on sentences.
 *
 * User: olafjanssen
 * Date: 2019-01-27
 * Time: 13:15
 */

define('REPORTS_PATH', '../../data/reports.jsonl');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // add new report
    $report = array( 'id' => $_POST['id'], 'msg' => htmlspecialchars($_POST['msg']), 'timestamp' => date(DATE_ATOM));
    // append report to JSON-lines file
    file_put_contents(REPORTS_PATH, json_encode($report) ."\n", FILE_APPEND | LOCK_EX);
    echo 'DONE';
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // return all reports in json format
    $reportFile = file_get_contents(REPORTS_PATH);
    //  turn the JSON-lines file into a JSON array
    header('Content-Type: application/json');
    echo '[' . preg_replace('/\n{/', ',{', $reportFile) . ']';
} else {
    // unallowed access
    echo "ERROR: operation not supported";
}

### Description

Check if there is an exam event currently on intra.

### Arguments

NONE

### How it works

It fetch `/v2/campus/:campus_id/cursus/:cursus_id/exams` route from 42 api and compare current date with end time of last exam in the response.

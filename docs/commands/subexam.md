### Description

Add you to a list of students who will get notified when there is a new exam.

### Arguments

NONE

### How it works

It saves your discord id in database, and it fetch `/v2/campus/:campus_id/cursus/:cursus_id/exams` and checks if there is a new exam each 5 hours.

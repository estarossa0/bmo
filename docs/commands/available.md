### Description

Give you couple information about a student.

- Status - available on intra or not
- Campus
- Level
- Full name

### Arguments

- username:
  - description: the student username
  - required: ❌
  - type: _string_

### How it works

It fetch `/v2/users/:id` route from 42 api and get the needed informations about the user.

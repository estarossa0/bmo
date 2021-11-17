### Description

Gives you the link to the student's 42 intra with additional informations.

- Full name
- Campus
- Level

### Arguments

- username:
  - description: the student username
  - required: ✅
  - type: _string_

### How it works

It fetch `/v2/users/:id` route from 42 api and get the needed information about the user along with the 42 intra link.

### Description

Tell you the total log time for the current or a specific month.

### Arguments

- select:
  - description: wether to select a mont or use current
  - required: ❌
  - type: _string_
  - choices:
    1. Select month
    2. Current month

### How it works

It fetch `/v2/users/:user_id/locations` and filter with date between beginning of the month to it's end, and keep fetching till get all location and return the total time counted.

### NOTES

The result of total log time is quite different from the one you'll get on the intra as there no exposed logging time route, and this command only use a workaround. But it does job anyway 😅.

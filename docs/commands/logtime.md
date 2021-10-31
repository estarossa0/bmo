### Description

Tells you the total log time for the current or a specific month.

### Arguments

- select:
  - description: whether to select a month or use current
  - required: ❌
  - type: _string_
  - choices:
    1. Select month
    2. Current month

### How it works

It fetches `/v2/users/:user_id/locations` and filters with date between beginning of the month to its end, and keeps fetching untill it gets all locations and returns the total time calculated.

### NOTES

The result of total log time is quite different from the one you'll get on the intra as there is no exposed logging time route, and this command only uses a workaround. But it does the job anyway 😅.

### Description

This command is made to give the bot authorization for using 42 api with the user access, since some interactions with 42 api can't be done without the user authorization.

### Arguments

NONE

### How it works

It creates a new table in database with a random generated string `cuid` which is deleted after 5 minutes, then it creates an auth link with the `cuid` as query param, after you authorize, you get redirected to the bot api, then the bot saves the authorization token. It's made in a secure way so the bot doesn't ask you for your discord authorization as well, to know where you came from.

### NOTE

I know that giving the bot access may worry you, and make you wonder what the bot is gonna do with it, well it's all in front of you, the bot is open-sourced, and it's maintained by a STAFF member, so no need to worry.

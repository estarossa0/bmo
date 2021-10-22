### Description

This command is made to give the bot authorization for using 42 api with the user access, since some interactions with 42 api can't be done without the user authorization.

### Arguments

NONE

### How it works

It create a new table in database with a random generated string `uid` which is deleted after 5 minutes, then it create an auth link with the `uid` as query param, after you authorize, you get redirected to the bot api, then the bot save the authorization token. It's made in a secure way and so the bot doesn't ask you for you discord authorization as well to know where you came from.

### NOTE

I know that giving the bot access may worry you and make you wonder what the bot is gonna do with it, well it's all in front of you, the bot is open-sourced, and its maintained by a STAFF member, so no need to worry.

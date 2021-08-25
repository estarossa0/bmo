# Changelog

All notable changes to this project will be documented in this file.

## [Upcoming]

- Commands:
  - `examsub` get notified when new is exam is on
  - `examunsub` stop getting notified about new exams
  - `exam` check if there is any exams currently
  - **`init`** after using this command bot will use the user credentials for all upcoming intra related commands
- Docs
  - `README.md`
  - `CONTIRBUTING.md`

## [[2.0.0]](https://github.com/estarossa0/1337DiscordBot/tags) (2021-08-19)

### Changed

- 1337DiscordBot is now in `typescript` 🎉✨
- dropped `node-fetch` and start using [`got`](https://github.com/sindresorhus/got)
- project structure is better now

### Added

- `rest` command for restaurant schedule

### Fixed

- `ping` command is more accurate
- missing `ephemeral` in both `echo` and `ping`

## [[1.0.1]](https://github.com/estarossa0/1337DiscordBot/tags) (2021-08-08)

### Fixed

- update 42 intra access token on server start (temporary)

### Changed

- updated discord.js from `13.0.0-dev` to `13.0.1`
- changed `.env` to `env.example`

### Added

- new error logs

## [[1.0.0]](https://github.com/estarossa0/1337DiscordBot/tags) (2021-08-08)

- Major: initial public release

### Added

- `available` command
- `is` command
- `tools` command
- `full` command

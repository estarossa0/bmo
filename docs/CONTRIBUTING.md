## Content

- [1. Introduction](#1-introduction)
  - [1.1 Why do these guidelines exist?](#11-why-do-these-guidelines-exist)
  - [1.2 What kind of contributions are we looking for?](#12-what-kind-of-contributions-are-we-looking-for)
  - [1.3 "I have a good idea but I don't know how to code it"](#13-i-have-a-good-idea-but-i-dont-know-how-to-code-it)
- [2. Reason why](#2-reason-why)
- [3. Getting started](#3-getting-started)
  - [3.1 Create an issue](#31-create-an-issue)
  - [3.2 Approving](#32-approving)
  - [3.4 First github contribution ?](#34-first-github-contribution)
  - [3.5 Special commands structure](#35-special-commands-structure)
- [4. Ground rules](#4-ground-rules)

# 1. Introduction

**Welcome!** First off, since you made this far into docs, I'd like to thank you for thinking of contributing. BMO is always looking forward for new ways to improve and appreciate any help you can give.

BMO is made for the 1337 students, and since they are all developers and coders, I thought it'll be a great idea to make it open source, so it can be **_made by the community to the community_**.

### 1.1 Why do these guidelines exist?

This guideline is made to explain for whoever wanna contribute (student or not) the steps they need to follow to contribute. It takes a lot of time to coordinate and organize issues, new features and review pull requests. By following these guidelines you will learn the contribution process and how to get a development environment running on your machine so you can work on the changes you wanna add.

### 1.2 What kind of contributions are we looking for?

Any assistance you can provide regarding to bug fixes, feature enhancements, **and ideas** is more than welcome.

### 1.3 "I have a good idea but I don't know how to code it"

Contribution is not necessarily regarding code. If you have an idea of a feature, enhancement, or a bug and you can't work on it yourself, you can just report it and surely someone else will adopt it and work on adding it.

# 2. Reason why

After you read the contribution process, you could wonder why we made it that way, so first let me explain why they are the way they are. BMO is not like a normal package it's not supposed to run on a machine simply like that, it needs multiple dependencies to be provided before it can run, within the discord bot id, 42 api app id, prisma database ext...

Because of the reasons above I tried to come up with an idea to make development easy, and my friend/roommate [Biri](https://github.com/KernelOverseer) came up with the way we sticked to and the one I will be explaining below.

# 3. Getting started

BMO is not a casual discord bot, it's a school bot, and for it to stay in our school server any change within it must be communicated with the STAFF. So I kindly ask you to stick to this workflow when contributing to BMO.

### 3.1 Create an issue

first thing you need to do is create an issue, with a title this way:
[type/scope]: _brief explanation_.

`type` can be anything within bug🐛/feat🍃/refactor♻️/idea⭐️

`scope` can be something like command/client/api... ext you'll know what's the scope.

- Example:
  - [feat/command]: create new evaluation slots.

and of course why not more details in the issue body.

### 3.2 Approving

After you suggest what you wanna change, it'll be communicated with STAFF and see if they approve it or not.

1.  Approved? then you'll continue with the next steps and start working on your changes.
2.  Denied? then I'm sorry your journey in this doc ends here, good luck next time. Maybe dm the STAFF and try to convince her, who knows 🤷‍♂️.

### 3.3 Join the devs

You suggested, you got approved by the _holy_ STAFF, now what? Now.. you're gonna join the dev 🎊🎉, no for real, you will.
To make the development easy you will join a devs discord server, and will be provided with a _ready_ bot and all the tokens you'll need so you run the bot in your machine, and you can change it as you need and work on whatever your changes are, you'll have your own channel with your dev bot. There you can ask for help if you needed from other devs and maybe you can help someone too.

### 3.4 First github contribution?

if this your first time ever contributing to a open source project on github, you can learn how from this _free_ series [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github)

### 3.5 Special commands structure

When contributing with a new command please follow this structure.

1. Each command is a file in `src/discord/commands`
2. Each command file export a default object which is the command
3. the command object type is defined in `src/types`. Example:

```typescript
type command = {
	name: string,
	description: string,
	option:{
		type: string;
		name: string;
		required: boolean;
		description:  string;
	},
	execute(interaction) => Promise<void>;

```

# 4. Ground rules

1. Wait till your request is approved then start working, you don't wanna waste time on a 50/50 case.
2. Typescript only.
3. Keep using the same prettier and eslint configuration and don't change it.
4. Keep the good project structure.
5. If you need help, just ask don't be shy.

# expo-app-from-phone

A small habit tracker built with [Expo](https://expo.dev) (React Native), developed **entirely from the Claude mobile
app**: every change was made by Claude Code running in a cloud environment, prompted from a phone. No laptop was used
to write the code.

This is the companion code for the **"AI System Design Deep Dive"** tutorial on building a mobile app from your phone
(video and join.dev page links will be added when it's published).

## Following along

Each tutorial step is a tagged commit, so you can check out the code at any point:

| Tag | Step | What changed |
|-----|------|--------------|
| `step-01` | Scaffold | Expo SDK 57 + TypeScript + Expo Router, "Habits" home screen with an empty state |
| `step-02` | Add habits | "Add habit" modal (name + colour), habit list on the home screen (in memory) |
| `step-03` | Tick off and save | Tap to tick off today / undo, saved on the device with AsyncStorage |
| `step-04` | Streaks | Streak count per habit and a last-7-days strip |
| `step-05` | Polish | Light/dark palette, app icon and splash, haptics, long-press to delete, bug fixes |

```
git clone https://github.com/dev-repos/expo-app-from-phone.git
cd expo-app-from-phone
git checkout step-01   # or any step tag
```

## Prompts

The exact prompts sent to Claude, in order. Each step ran as its own Claude Code cloud session; steps 2–5 used a cloud
environment with **Full** network access (on Trusted, Expo's own servers were blocked).

1. > Create a new Expo app in this repo: latest Expo SDK, TypeScript, Expo Router. It's going to be a habit tracker
   > called "Habits". For now just a home screen with the title and a friendly empty state ("No habits yet"). Make
   > sure the web build works (npx expo export --platform web). Then commit, push a branch and open a PR.
2. > Next step for the Habits app: let me add habits. Put an "Add habit" button on the home screen that opens a screen
   > where I type a name and pick a colour. Show my habits as a list on the home screen (keep the empty state when
   > there are none). Just keep them in memory for now. Check the web build still works, then push a new branch and
   > open a PR.
3. > Next step for the Habits app: let me tick off a habit for today by tapping it (tap again to undo), with a clear
   > checked look. Save habits and their done days on the device so they're still there after I close the app.
   > Check the web build still works, then push a new branch and open a PR.
4. > Next step for the Habits app: show a streak on each habit, the number of days in a row I've done it, ending
   > today (or yesterday if I haven't ticked it yet today). Add a small row of the last 7 days under each habit so I
   > can see the pattern. Check the web build still works, then push a new branch and open a PR.

   Claude asked before pushing; the reply was "yes, push and open the PR".
5. > Last step for the Habits app: polish it so it feels like a real app. Give it a consistent look in light and dark
   > mode, a proper app icon and splash screen in the habit-tracker style, a little haptic tap when I tick a habit
   > off, and a way to delete a habit (long-press with a confirm). Then review the whole app for bugs and rough edges
   > and fix what you find. Check the web build still works, then push a new branch and open a PR.

## Run it

```
npm install
npx expo start      # scan the QR code with Expo Go
npm run build:web   # static web build in dist/
```

Haptics and the native icon/splash need a development or release build, not Expo Go.

## License

MIT

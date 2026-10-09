# Paul Space Combat --- Build Plan

**Project name:** Paul Space Combat\
**Brand:** Paul\
**Primary colour:** Blue\
**Application framework:** Next.js\
**Document version:** 1.0\
**Status:** Build specification for V1

------------------------------------------------------------------------

## 1. Project Overview

Paul Space Combat is a browser-based, arcade-style space combat shooter
built with Next.js. The player controls a spaceship, moves in four
directions, and shoots enemy spacecraft using the keyboard. The game
should feel responsive, look polished, and use a blue-led sci-fi visual
identity.

### Core controls

  Key               Action
  ----------------- ----------------------------------------
  `ArrowUp`         Move up
  `ArrowDown`       Move down
  `ArrowLeft`       Move left
  `ArrowRight`      Move right
  `Space`           Fire weapon
  `P` or `Escape`   Pause/resume (optional V1 enhancement)

The game must also provide visible on-screen instructions. Keyboard
input should not scroll the page while the game is active.

## 2. Product Requirements Document (PRD)

### 2.1 Problem and opportunity

Many small browser games are either too complicated to start or lack
clear controls and feedback. Paul Space Combat aims to deliver a
simple-to-launch, easy-to-understand arcade game with responsive
controls, escalating combat, and a distinctive blue space aesthetic.

### 2.2 Goals

-   Deliver a playable space shooter in a modern browser.
-   Make movement with the four arrow keys and shooting with Space work
    reliably.
-   Provide clear feedback for score, health/lives, enemy hits, and
    game-over state.
-   Make the interface readable on desktop and adaptable to smaller
    screens.
-   Keep the first version small enough to build, test, and deploy
    reliably.

### 2.3 Target users

-   Casual players who enjoy arcade shooters.
-   Students and beginner developers learning how a Next.js game is
    structured.
-   Friends or visitors who want to play a short browser game without
    installing software.

### 2.4 V1 features

1.  **Start screen:** Show the Paul Space Combat title, short
    instructions, and a Start Game button.
2.  **Player ship:** Display a player-controlled spaceship with a clear
    visual distinction from enemies.
3.  **Four-direction movement:** Arrow keys move the ship up, down,
    left, and right.
4.  **Shooting:** Space fires projectiles in the direction the player
    faces or, for the simplest V1, straight upward.
5.  **Enemies:** Spawn enemy ships that move toward or across the play
    area.
6.  **Collision detection:** Player shots can hit enemies; enemy contact
    or projectiles can damage the player.
7.  **Score:** Increase score when an enemy is destroyed.
8.  **Lives or health:** Show remaining lives or a health bar and
    provide clear damage feedback.
9.  **Difficulty progression:** Gradually increase enemy frequency or
    movement speed as score rises.
10. **Game-over and restart:** Stop active gameplay on defeat, show the
    final score, and allow a clean restart.
11. **Responsive layout:** Keep the play area and essential UI usable on
    common desktop and mobile screen sizes. Keyboard play is the primary
    V1 input method.
12. **Accessibility basics:** Use readable contrast, clear button
    labels, and text instructions in addition to colour cues.

### 2.5 V1 acceptance criteria

-   Starting a new game begins gameplay and resets score, health/lives,
    enemies, and projectiles.
-   Arrow keys move the ship in the expected direction.
-   The ship cannot move outside the playable area.
-   Holding Space fires at a controlled rate rather than creating
    unlimited projectiles every frame.
-   A projectile that intersects an enemy removes or damages that enemy
    and updates the score correctly.
-   Taking damage updates health/lives and eventually triggers Game
    Over.
-   Restarting after Game Over creates a fresh game state without
    duplicate keyboard listeners or leftover entities.
-   Pause/resume, if implemented, freezes gameplay and prevents movement
    or shooting until resumed.
-   The game runs without fatal console errors in a current desktop
    browser.

### 2.6 Out of scope for V1

-   Online multiplayer or matchmaking.
-   Accounts, cloud saves, or leaderboards.
-   In-app purchases or advertisements.
-   Complex story campaigns, voice acting, or cinematic cutscenes.
-   Backend services unless a later feature requires them.

### 2.7 Success measures

-   A new player can start playing within a few seconds.
-   Core keyboard controls work consistently.
-   A complete play session can end and restart without refreshing the
    page.
-   The deployed version loads and plays on the public URL.

------------------------------------------------------------------------

## 3. Design Requirements Document (DRD)

### 3.1 Visual direction

Use a polished, high-contrast sci-fi arcade style. Blue is the main
brand colour, supported by deep navy backgrounds, white text, and
restrained cyan highlights. Avoid excessive glow effects that make
gameplay difficult to read.

### 3.2 Suggested colour palette

  Purpose              Colour            Hex
  -------------------- ----------------- -----------
  Primary brand blue   Electric blue     `#2563EB`
  Bright accent        Cyan              `#22D3EE`
  Background           Deep space navy   `#050B1A`
  Panels               Dark blue         `#0B1730`
  Main text            Near white        `#F8FAFC`
  Secondary text       Cool grey         `#A9B8D0`
  Damage / warning     Orange-red        `#F97316`
  Success / pickup     Green-cyan        `#34D399`

### 3.3 Screen layout

**Start screen** - Paul Space Combat logo/title at the top. - A central
spaceship illustration or animated preview. - Prominent Start Game
button. - Short controls panel: arrow keys to move, Space to shoot. -
Blue and cyan accents against a dark space background.

**Gameplay screen** - Playfield takes most of the available viewport. -
Score in the top-left. - Health/lives in the top-right. - Optional level
indicator near the score. - Player ship near the lower part of the
playfield at game start. - Enemies and projectiles remain visually
distinct from the background.

**Pause and Game Over overlays** - Dim or freeze the playfield behind
the overlay. - Show a clear Pause or Game Over heading. - Display final
score on Game Over. - Provide Resume and/or Restart buttons as
appropriate.

### 3.4 Interaction design

-   Controls should respond immediately and consistently.
-   Movement should be smooth rather than jumping large distances per
    key press.
-   Shooting should use a cooldown/fire interval.
-   UI buttons should have hover, focus, and pressed states.
-   Show damage using a brief flash or other subtle effect, not colour
    alone.
-   Do not allow gameplay keyboard shortcuts to trigger while a user is
    typing in an input field.

### 3.5 Responsive behaviour

-   Desktop and laptop: full keyboard-controlled game experience.
-   Tablet and mobile: scale the playfield and UI to fit. If touch
    controls are added later, treat them as a separate enhancement; do
    not claim touch support until it is implemented and tested.
-   Avoid clipped HUD elements and buttons on narrow screens.

------------------------------------------------------------------------

## 4. Technical Requirements Document (TRD)

### 4.1 Recommended stack

-   **Framework:** Next.js with the App Router.
-   **Language:** TypeScript.
-   **UI styling:** CSS Modules or a well-organized global stylesheet.
-   **Rendering:** HTML Canvas for the real-time game scene; regular
    React components for menus and HUD.
-   **State:** A game loop managed with `requestAnimationFrame`; React
    state for screen-level UI such as start, pause, and game over. Keep
    rapidly changing entity positions in the game engine rather than
    forcing a React render every frame.
-   **Deployment:** Netlify or another platform that supports the chosen
    Next.js configuration.

### 4.2 Suggested project structure

``` text
paul-space-combat/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── GameCanvas.tsx
│   ├── GameHUD.tsx
│   ├── StartScreen.tsx
│   └── GameOverlay.tsx
├── game/
│   ├── engine.ts
│   ├── input.ts
│   ├── entities.ts
│   ├── collisions.ts
│   ├── constants.ts
│   └── types.ts
├── public/
│   └── assets/
├── docs/
│   └── BUILD_PLAN.md
├── package.json
└── README.md
```

This is a suggested structure; it can be simplified for a small first
implementation.

### 4.3 Game loop

1.  Read current keyboard input.
2.  Update player movement using elapsed time (`deltaTime`) so movement
    speed is not tied to frame rate.
3.  Spawn and update enemies.
4.  Update player projectiles and any enemy projectiles.
5.  Check projectile/enemy and player/enemy collisions.
6.  Update score, health/lives, and difficulty.
7.  Render the background, entities, effects, and HUD.
8.  Stop or suspend updates when paused or when the game ends.

### 4.4 Input handling

-   Register keyboard listeners when the game component mounts and
    remove them when it unmounts.
-   Track pressed keys in a set or equivalent structure so holding a
    movement key produces continuous movement.
-   Use `event.preventDefault()` for arrow keys and Space only while the
    game is active and keyboard gameplay should capture them.
-   Clear held-key state on blur or visibility changes to avoid a stuck
    movement key.
-   Prevent repeated `keydown` events from firing uncontrolled numbers
    of shots; use a fire cooldown.
-   Support the `Space` key through `event.code === "Space"`.

### 4.5 Physics and collisions

-   Use simple rectangular or circular hitboxes for V1.
-   Keep player and enemy positions inside the playfield.
-   Remove destroyed entities and off-screen projectiles to prevent
    unbounded memory growth.
-   Use consistent collision rules and test edge cases such as
    simultaneous hits.

### 4.6 Performance and reliability

-   Use `requestAnimationFrame` for rendering.
-   Scale the canvas for device pixel ratio while keeping logical game
    coordinates manageable.
-   Avoid creating large numbers of temporary objects on every frame.
-   Clean up animation frames and event listeners on component unmount.
-   Handle browser resizing without distorting the game unexpectedly.
-   Keep assets lightweight and provide fallbacks if an image fails to
    load.

### 4.7 Testing plan

**Functional tests** - Start, pause/resume (if implemented), game over,
and restart. - Each arrow key moves in the correct direction. - Space
fires projectiles at the intended rate. - Boundaries prevent the player
from leaving the playfield. - Collisions update enemy count, score, and
health correctly.

**Regression tests** - Restarting does not duplicate enemies, loops, or
event listeners. - Repeated key presses do not cause stuck movement or
excessive firing. - Resizing the window does not break controls or HUD
layout.

**Browser and deployment tests** - Test in current Chrome, Edge, and
Firefox where available. - Verify the production build succeeds. -
Verify the deployed page loads directly and can be refreshed without a
routing error.

### 4.8 Deployment requirements

-   Store the project in a Git repository.
-   Keep source code and build instructions in GitHub.
-   Configure Netlify to use the repository and the appropriate Next.js
    build settings.
-   Run a production build before deployment.
-   Test the public deployment after every significant change.
-   Do not commit secrets, API keys, or private credentials. V1 should
    not require secret keys.

------------------------------------------------------------------------

## 5. Architecture Decision Record (ADR)

### ADR-001: Use Next.js App Router with TypeScript

**Status:** Proposed / accepted for V1

**Context:** The game needs a modern React-based project structure,
reusable UI components, and a straightforward deployment workflow.

**Decision:** Use Next.js App Router with TypeScript. Keep the start
screen, HUD, and overlays as React UI, while the game scene is rendered
in a dedicated Canvas component.

**Alternatives considered:** - Plain HTML/CSS/JavaScript: simpler setup,
but less aligned with the requested Next.js project. - React DOM
elements for every game entity: easy to understand initially, but can
create unnecessary rendering work for many moving objects. - A dedicated
game engine such as Phaser: powerful, but adds a dependency and learning
surface that may not be necessary for this small V1.

**Consequences:** - The project remains aligned with the requested
Next.js stack. - Canvas gives direct control over real-time drawing and
movement. - The team must implement and test collision detection, input
handling, and the game loop. - Keep Canvas-specific logic isolated so a
dedicated engine can be introduced later if the game grows.

### ADR-002: Use keyboard-first controls

**Status:** Accepted for V1

**Context:** The required gameplay uses arrow keys for movement and
Space for shooting.

**Decision:** Implement continuous movement using held-key tracking and
shooting using a cooldown timer. Display controls clearly on the start
screen.

**Consequences:** Desktop keyboard play is the primary supported
experience. Touch controls are a future enhancement, not a V1 promise.

### ADR-003: Use a blue-led visual system

**Status:** Accepted for V1

**Context:** The game is branded as Paul Space Combat and blue is the
preferred colour.

**Decision:** Use electric blue and cyan accents on a deep navy space
background, with high-contrast text and distinct colours/shapes for
enemies, projectiles, and warnings.

**Consequences:** Branding is consistent across menus, HUD, and
game-over states. Gameplay clarity takes priority over decorative
effects.

### ADR-004: Keep V1 local and backend-free

**Status:** Accepted for V1

**Context:** The core gameplay does not require accounts, multiplayer,
or remote data.

**Decision:** Store the active session state in memory. Do not add a
backend, authentication, or database until a specific feature requires
it.

**Consequences:** The first version is easier to build and deploy.
Scores reset on refresh unless local score persistence is added later.

------------------------------------------------------------------------

## 6. Build Phases

### Phase 1 --- Project foundation

-   Create the Next.js TypeScript application.
-   Add the blue/navy design tokens and responsive page shell.
-   Confirm the app runs locally and the production build succeeds.

### Phase 2 --- Playfield and controls

-   Build the Canvas component and game loop.
-   Draw the player ship and background.
-   Implement arrow-key movement and boundary limits.
-   Implement Space shooting with a fire cooldown.

### Phase 3 --- Combat systems

-   Add enemy spawning and movement.
-   Add projectile and player collision detection.
-   Add score, health/lives, damage feedback, and difficulty
    progression.

### Phase 4 --- Game states and polish

-   Add start, pause/resume if included, and game-over screens.
-   Add restart and ensure all state resets correctly.
-   Improve effects, visual hierarchy, and responsive behaviour.

### Phase 5 --- Quality assurance and deployment

-   Run functional and regression tests.
-   Fix console errors and production build issues.
-   Push the project to GitHub.
-   Deploy with Netlify and test the live URL.

## 7. Definition of Done

V1 is complete when: - The Next.js production build succeeds. - The
player can move up, down, left, and right with the arrow keys. - Space
shoots reliably without uncontrolled rapid firing. - Enemies can be
destroyed and score updates correctly. - Damage and Game Over work, and
the player can restart. - The design consistently uses Paul branding and
the blue-led palette. - The deployed public version has been tested in a
desktop browser. - The README explains how to install, run, build, and
deploy the game.

## 8. Important Implementation Note

This document is the build specification, not the game source code
itself. To edit an existing game implementation, the current project
files are needed. If starting from scratch, use this plan as the
implementation checklist and build each phase in order.

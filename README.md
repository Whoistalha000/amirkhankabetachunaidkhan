# Cozy Cottage Romance

Build a mobile-first 2D interactive romantic story game in portrait mode using React, TypeScript, and Tailwind/Lucide/canvas/CSS.

Include:
1. Intro screen: Minimal dark dreamy purple background, soft floating particles, "Before we begin...", text input "Enter your name", and "Enter" button. Smooth fade transition to game world.
2. 2D Outdoor World: Large scrolling 2D environment with bounds, storybook aesthetic, soft green grass, dreamy sky/clouds, scattered white flowers and pink/white tulips, trees, and cozy wooden cottage on the right side.
3. Player & Camera: Cute stylized 2D character with walking animations/direction facing, visitor's name tag above head, and smooth 2D camera following the player within world boundaries.
4. Mobile Virtual Joystick: Fixed translucent touch joystick in bottom-left corner for 360-degree smooth movement, thumb-optimized (also support arrow/WASD keys for testing on desktop).
5. Pillow the Cat: Cute white companion cat with "Pillow" name tag that smoothly follows player at a natural distance. Idle timer: if player stays still for 10 seconds, Pillow walks over, lies down, and snoozes with animated floating "Z Z Z Z" text; immediately wakes up when player moves.
6. House Exterior & Interior: Walk up to cottage door to trigger smooth interior transition. Cozy wooden interior with warm lighting, furniture, table with a bouquet of white flowers, and a pulsing, glowing interactive sealed envelope.
7. Envelope & Letter: Prompt "Something is waiting for you..." / "Tap the letter" when near. Tapping envelope plays opening animation into an elegant paper letter modal reading "May I be your boyfriend?" with YES and NO buttons (strictly no emojis).
8. NO Button Evasion: Playfully slips away to safe positions within the letter bounds when tapped or hovered, making it practically unclickable.
9. YES Button & Quest Cleared: Tapping YES opens a game-style "QUEST CLEARED" screen with "Reward : +1 bf" and glowing particles/scale bounce animation (no emojis).
10. Ensure modular component structure, high mobile performance, and responsive layout without horizontal screen scroll or heavy 3D libraries.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://amirkhankabetachunaidkhan.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/61d037e0-111c-456c-a5f2-c5d625f52d06).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

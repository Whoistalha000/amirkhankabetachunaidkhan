# Cozy Cottage and Story Polish

## Goal
Improve the existing romantic story game without replacing its working movement, camera, joystick, scene transitions, name tag, door, envelope interaction, or evasive NO behavior.

## Changes
- Expand the cottage interior artwork with a bed, bedside table, glowing lamp, bookshelf and books, storage chest, wall decor, plants, a small rug, and more detailed chairs while keeping the flower-and-envelope table visually dominant.
- Rework Pillow’s inactivity tracking around real coordinate changes: reset instantly on meaningful player movement, approach the player only after ten uninterrupted seconds, face the travel direction, settle beside the player, sleep, and render four staggered looping floating Zs.
- Replace the letter with the supplied wording and paragraph spacing exactly, followed by a visually distinct “May I be your bf?” and YES/NO controls.
- Redesign the letter as a warm textured paper sheet with visible room around it and a phone-friendly scrolling reading area; constrain the evasive NO control to safe reachable positions within the sheet.
- Simplify the opening screen to understated text, a clean line input labeled “Your name,” a subtle Enter action, negative space, and restrained particles.
- Replace the completion popup with an unframed, elegant achievement composition on a dreamy dark background with restrained particles and graceful entrance motion.
- Consolidate the new visual roles into semantic design tokens while preserving the existing canvas art palette where drawing APIs require explicit colors.

## Verification
- Check the current build after edits and resolve any errors.
- Exercise the full game at a phone-sized viewport: name entry, joystick/keyboard movement, camera and world bounds, cottage door, interior, envelope proximity and opening, long-letter scrolling, evasive NO, YES, and completion screen.
- Verify Pillow stays awake before ten seconds, resets its timer after movement, sleeps only after ten continuous idle seconds, faces its approach direction, and wakes immediately when movement resumes.
- Capture representative phone screenshots to confirm readable spacing and no overlap or horizontal scrolling.

## Technical details
- Keep the canvas render loop and scene/state architecture intact; only adjust Pillow’s state machine and interior drawing helpers.
- Use elapsed time plus a stored previous player position and movement threshold, rather than relying only on input magnitude.
- Keep the modal and completion views as DOM overlays for accessible scrolling and reliable touch controls.
- Respect reduced-motion preferences for the redesigned overlay animations.

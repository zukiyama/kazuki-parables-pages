
# Update Professor Barnabas Book Cover in Slideshow

## Overview
Replace the current Professor Barnabas book cover image in the Young Adult slideshow with the newly uploaded `professor-barnabas-cover-new2.webp` file.

## What Will Change

**File:** `src/components/YoungAdultSlideshow.tsx`

1. **Update the import statement** (line 6):
   - Current: `import professorBarnabasCover from "@/assets/professor-barnabas-cover-new.webp";`
   - New: `import professorBarnabasCover from "@/assets/professor-barnabas-cover-new2.webp";`

That's it - just a single line change. The variable name `professorBarnabasCover` stays the same, so the rest of the code (the books array and rendering) will automatically use the new image.

## What Will NOT Change
- The banner thumbnail will continue using its separate thumbnail image (`professor-barnabas-cover-newthumbnail.webp`)
- The other two Young Adult books (Land is a Dream of the Sky and To Fly) remain unchanged
- All slideshow functionality (swiping, navigation, transitions) remains the same

## Technical Details
- The new image file: `src/assets/professor-barnabas-cover-new2.webp`
- Location in UI: Writing page, Young Adult section slideshow, first book (The Congress of Worlds)

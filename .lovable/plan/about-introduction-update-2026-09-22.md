# About introduction update

## Changes
- Define the revised introduction once and reuse it across every responsive About layout.
- Preserve all surrounding copy while replacing only the three requested phrases.
- Keep mobile and small-tablet portrait sizing unchanged.
- Match the introductory paragraph to the line above on larger tablet, iPad, laptop, desktop, and widescreen layouts, including 13-inch iPad portrait.
- Use restrained semibold emphasis for the name, descriptor, and introductory paragraph on larger layouts only.

## Verification
- Check phone portrait/landscape, small tablet portrait/landscape, iPad portrait/landscape, 13-inch iPad portrait/landscape, laptop, desktop, and widescreen widths.
- Confirm identical wording, attractive wrapping, alignment, and no clipping or overlap.
- Confirm the project builds without errors.

## Technical details
- Preserve the existing responsive layout branches and visual styling.
- Consolidate the repeated prose into shared constants/markup so future wording cannot drift between breakpoints.
- Apply responsive classes and the existing layout-tier conditions rather than one global font-size change.

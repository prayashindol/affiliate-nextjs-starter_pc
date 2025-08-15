# Development Notes

## Viator Integration
- Unified product shape now returned from `fetchViatorTours` (real + mock).
- Product fields: `productCode, title, shortDescription, price, thumbnail, link`.
- No UI branching required for real vs mock beyond apiStatus messaging.

## Tools Directory & /tools/[object Object] Prevention
- Added `toolSlug()` helper to ensure only proper strings used when constructing internal links.
- Added optional `DevAnchorInspector` (dev only) to log malformed anchors containing `[object`.
- External tool links favor `AffiliateLink` -> `Website` -> `Domain`. Internal slug path only used if no external link provided.

## Adding a New Tool
Provide at least `Name` + one of `AffiliateLink | Website | Domain`. Optional `Category`, `Rating`, `Features`, `Pros`, `Cons`.

## Safe Slug Generation
If internal pages added later, `toolSlug` already normalizes common fields:
`slug.current | slug | CleanedName | Name`.

Remove `DevAnchorInspector` before production if not desired (harmless if left; only logs when broken anchors exist).
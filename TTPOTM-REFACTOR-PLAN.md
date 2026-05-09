# TTPotM Refactor Plan

**Last Updated:** 2025-05-09  
**Status:** Phase 1 (Refactor) Complete, Phase 2 (Content Review) Pending  
**Goal:** Transform ttpotm.com from a single-project site to a collective brand showcasing multiple works by fictional voices, with Dr. Olaf T.A. Janssen, PhD as nominal curator.

---

## Agreed Concept

- **TTPotM** = The Collective Name (no longer just "The Toki Ponist on the Mountain")
- **Tagline:** "A group of fictional voices creating works at the intersection of language, philosophy, and play"
- **Curator:** Dr. Olaf T.A. Janssen, PhD (nominal, fictional character)
- **Voices/Personas:** The Toki Ponist, The Trepid Pataphysicist, Joanna Fatless, etc.
- **Presentation:** One flat list of creations on landing page, personas appear as voices within content

---

## Phase 1: Refactor (COMPLETE ✓)

### Structure Created
```
metalsmith/src/
├── index.md                          # Collective landing
├── about/
│   ├── disclaimer.md
│   └── privacy.md
├── creations/
│   ├── the-toki-ponist.md           # Novel
│   ├── coming-home.md                # Game
│   ├── tenpo-la.md                   # Game  
│   ├── tokinasinnasa.md              # Koans summary
│   ├── tokinasinnasa/                # 31 individual koans
│   ├── nasintawatoki.md              # Translation tool
│   └── nonperclock.md                # Calendar tool
└── error404.md
```

### Changes Made
- Moved and renamed files to new structure
- Split `games.md` into `coming-home.md` + `tenpo-la.md`
- Created new collective landing page
- Updated metalsmith config to match new structure
- Updated path references in content
- Preserved all 31 koan files
- Preserved all static assets (tools, CSS, images)

### Files Deleted
- `games.md` (split into two)
- `learn.md` (empty)
- `novel.md` (moved)
- `topics/` directory (moved to creations/)
- `tokinasinnasa/` directory (moved to creations/)

---

## Phase 2: Content Review (PENDING)

### Your Tasks
1. **Review landing page** (`metalsmith/src/index.md`)
   - Update wording to match your voice
   - Adjust descriptions of each creation
   - Add/remove items from the list

2. **Review creation pages**
   - `creations/the-toki-ponist.md` - Update to collective voice
   - `creations/coming-home.md` - Review split from games.md
   - `creations/tenpo-la.md` - Review split from games.md
   - `creations/nasintawatoki.md` - Review moved from topics/
   - `creations/nonperclock.md` - Review moved from topics/
   - `creations/tokinasinnasa.md` - Add summary text

3. **Review koans** (`creations/tokinasinnasa/*.md`)
   - 31 files preserved unchanged
   - Decide if frontmatter needs updating
   - Consider adding introduction text

4. **Review static pages**
   - `about/disclaimer.md` - Update if needed
   - `about/privacy.md` - Update if needed
   - `error404.md` - Review updated text

### Style Guidelines
- Keep your existing voice and tone
- Personas can speak in first person within content
- Landing page should be neutral collective voice
- Footer on all pages: "Nominally curated by Dr. Olaf T.A. Janssen, PhD"

---

## Phase 3: Build & Test (PENDING)

### To Build
```bash
npm install
make build
```

### To Test
1. Open `dist/index.html` in browser
2. Verify all links work
3. Check that tools are accessible at `/tools/nasintawatoki/` and `/tools/nonperclock/`
4. Verify koans display correctly

---

## Phase 4: Future Enhancements (OPTIONAL)

### Potential Additions
- Add new persona: The Trepid Pataphysicist on Mycelial Transformation
- Add new persona: Joanna Fatless
- Add new works as they're created
- Create "About the Collective" page explaining the concept
- Add newsletter signup
- Add cross-links between related works

### Technical Improvements
- Complete Hugo migration (currently using Metalsmith)
- Add proper redirects for old URLs
- Optimize asset pipeline
- Add search functionality

---

## Known Issues

1. **Tools directory:** The tools (nasintawatoki, nonperclock) are in `metalsmith/static/tools/` and will be copied to `dist/tools/` during build. The creation pages link to `/tools/nasintawatoki/` and `/tools/nonperclock/` which should work.

2. **Koan aliases:** Some koan files have aliases (e.g., `t/k1`, `t/k2`). These may need updating to match new structure.

3. **Image paths:** Some files reference images with `../img/` or `/img/` paths. These should be reviewed for correctness in the new structure.

4. **Layouts:** Existing layouts (novel.html, game.html, koan.html, project.html) are unchanged and may need updating for the new branding.

---

## File Inventory (After Refactor)

- **Markdown files:** 41 total
  - 1 landing page
  - 2 about pages
  - 6 creation summary pages
  - 31 koan files
  - 1 error page
- **Static assets:** All preserved in `metalsmith/static/`

---

## Quick Start for Next Session

```bash
cd /Users/olafjanssen/Jottacloud/Websites/ttpotm
# Review the refactored structure
find metalsmith/src -type f -name "*.md" | sort

# Build the site
npm install
make build

# Open in browser
open dist/index.html
```

---

## Notes

- All original content has been preserved
- No content has been deleted (only restructured)
- The collective concept allows for expansion with new personas and works
- Your voice and style should replace the placeholder text in the new landing page

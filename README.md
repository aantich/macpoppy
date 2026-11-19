# Poppy website

Landing page for **Poppy Deep**, **Poppy MagicBox**, and **Poppy Velvet**, published at **https://macpoppy.com/** from [aantich/macpoppy](https://github.com/aantich/macpoppy). The site uses HTML, CSS, and JavaScript, the selected Poppy flower, and a locally bundled Manrope variable font.

## Preview

From this directory:

```sh
node server.mjs
```

Open http://127.0.0.1:4173. Set `PORT` to use another port. The server listens on loopback only. Stop it with Ctrl-C.

```sh
node --check app.js
node --check server.mjs
```

The homepage also opens directly from `index.html`. Use the preview server or a static build to see `/magicbox/` with the shared navigation and monitor bar.

The equivalent npm scripts are `npm run dev` and `npm run check` when npm is configured to use a working Node installation.

## Publication

Pushes to `main` run the GitHub Pages workflow in `.github/workflows/pages.yml`. It checks JavaScript, builds `dist/`, and deploys the resulting static artifact. The workflow can also be run manually. No dependency installation is required.

```sh
node scripts/build.mjs
```

The build includes only the live page, styles, JavaScript, current logo, app icons, font files and license, and domain/search metadata. Archived artwork, research notes, development scripts, and repository documentation stay out of the deployed site. `dist/` is ignored by Git.

`CNAME` contains `macpoppy.com`; the matching custom domain must also be configured in GitHub Pages settings. The intended Namecheap BasicDNS setup is an `ALIAS` record for `@` pointing to `aantich.github.io` and a `CNAME` record for `www` pointing to the same hostname. GitHub Pages provides the redirect from `www.macpoppy.com` to the apex domain. Keep unrelated mail records unchanged.

## Design and copy

The headline is **“Make more of your Mac.”** The family promise is protection, everyday tools, and a better place to build, all with one familiar design language.

The design uses generous space, large Manrope typography, concise benefit-led sections, flat Mac-style app icons, and restrained transitions. Poppy's coral flower, warmer surfaces, and original icon geometry give it its own identity alongside the requested Apple-inspired presentation.

Supporting typography is 18px for desktop product copy and 16px on phones. The hero pairs the Velvet introduction with a diagram of local agents, Linux workspaces, and containers. The website loads its own Manrope font file and uses Arial/sans-serif as fallbacks.

- **Deep** pairs backup and security with Lamplighter, a pale anglerfish carrying a golden light on a teal tile.
- **MagicBox** brings five everyday utilities together. Its One line icon draws a cube with a single cream stroke on coral.
- **Velvet:** Linux virtualization, container workflows, and developer experience; a violet app tile with layered terminal windows.

The app icons are editable SVG artwork inspired by the user's Mac Dock reference: mostly flat shapes, subtle gradients, consistent corner radii, and no glossy 3D materials. The canvas outside the app tiles, including their outer corners, is transparent. Every website flower-logo placement and the favicon use the transparent PNG export, without blend-mode workarounds. The original five flower-logo color variants have clean transparent exports in the brand library.

The products are presented as **in development**. The artwork and utility interfaces are illustrative concepts, and sample disk, CPU, and memory values are not measurements. Product promises describe the requested direction, not implemented runtime capabilities. Prices, download links, compatibility promises, security guarantees, and launch dates have not been invented.

The landing page links to Velvet’s TestFlight beta and User Guide. Deep opens a product overview dialog, and MagicBox has five working preview tabs.

## MagicBox category selection

The initial scope combines the requested disk-space analyzer, archiver, and system monitor with **clipboard history** and **window layouts**. The latter two have established paid Mac products and complement the first three without duplicating backup or virtualization.

This is a selection of established paid categories, not a measured ranking of the five most popular utilities. Public copy uses “five essentials” and “everyday Mac essentials” rather than an unsupported popularity claim. Archive copy avoids promising every format; supported creation and extraction formats must be established before launch.

Research checked 16 November 2026:

| Category | Paid product evidence | Source |
| --- | --- | --- |
| Disk space | DaisyDisk advertises a $9.99 purchase. | [Official website](https://daisydiskapp.com/) |
| Archives | BetterZip advertises a $35 purchase. | [Official website](https://macitbetter.com/) |
| System monitor | iStat Menus offers paid licenses and Setapp access. | [Official website](https://bjango.com/mac/istatmenus/) |
| Clipboard history | Paste advertises $29.99 annually, alongside other purchase options. | [Official pricing](https://pasteapp.io/pricing) |
| Window layouts | Magnet is distributed through the Mac App Store as a paid window manager. | [Official website](https://magnet.crowdcafe.com/), [Mac App Store](https://apps.apple.com/us/app/magnet/id441258766) |

Prices are source observations, not Poppy pricing; regional taxes and storefront pricing can vary. Offering a product for sale establishes a paid category but does not by itself establish sales volume.

## Files and artwork

- `index.html`: semantic landing page, utility previews, and product dialog.
- `styles.css`: responsive layout, visual design, and reduced-motion support.
- `app.js`: navigation, keyboard-accessible utility tabs, and dialog interactions.
- `server.mjs`: dependency-free local preview server.
- `assets/icons/`: current flat SVG product icons, shared by the hero, product sections, and dialogs.
- `assets/poppy-mark-transparent.png`: current transparent flower used by all page logos and the favicon.
- `assets/source/`: preserved earlier product renders, original Poppy mark, and the full-size transparent flower export.
- `assets/deep-*.png`, `magicbox-*.png`, `velvet-*.png`: earlier glossy illustration exports, retained for reference and no longer used by the page.
- `assets/image-prompts.md`: provenance for the earlier generated product renders.
- `assets/fonts/`: Manrope variable font, its license, and source information.
- `scripts/build.mjs`: prepares and checks the static deployment artifact.
- `.github/workflows/pages.yml`: publishes the artifact to GitHub Pages.
- `docs/BRAND.md`: portable website identity reference.

The website identity is recorded in [Poppy website identity](docs/BRAND.md). In the umbrella workspace, the complete shared guide and deterministic flower export script remain at `../docs/brand/BRAND-IDENTITY.md` and `../docs/brand/scripts/export-transparent-logos.swift`. Product implementation and shared brand masters are maintained outside this website repository.

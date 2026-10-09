# fergmux.com

This repo contains the source code to my personal website.

This project uses Vue 3 with the composition api, Vite, pnpm, and Tailwind CSS.

The Dragonwilds save converter is available at `/#/projects/dragonwilds-save-converter`. It reads PC Game Pass/Xbox WGS saves entirely in the browser, removes the supported 12-byte wrapper, decompresses the zlib payload and downloads the unchanged world as `<internal world name>.sav`. Select a copied WGS/account folder including `containers.index`, `container.*` descriptors and extensionless data blobs to distinguish current worlds from backups. Individual files are also accepted, but missing metadata leaves current/backup status unconfirmed. Character JSON is skipped. ZIP archives are not supported. Limits: 128 MiB per save and decompressed world, 256 MiB per import. File checks do not replace a server load/restart test. Run `pnpm test:dragonwilds` for conversion, corruption, metadata and backup tests; real player saves must never be committed as fixtures.

The AoE II hotkey reader/editor is available at `/#/projects/aoe-hotkeys`. Run `pnpm netlify` to serve the page and its Netlify functions locally, and `pnpm test:hkp` to test reading and writing against the supplied files. See [parser documentation](netlify/lib/hkp/README.md) for supported formats and data sources.

# Deployment commands

To run the code locally please install pnpm globally (`npm install -g pnpm`) and run `pnpm run dev` in the root directory to serve the project locally.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

# fergmux.com

This repo contains the source code to my personal website.

This project uses Vue 3 with the composition api, Vite, pnpm, and Tailwind CSS.

The AoE II hotkey reader/editor is available at `/#/projects/aoe-hotkeys`. Run `pnpm netlify` to serve the page and its Netlify functions locally, and `pnpm test:hkp` to test reading and writing against the supplied files. See [parser documentation](netlify/lib/hkp/README.md) for supported formats and data sources.

# Deployment commands

To run the code locally please install pnpm globally (`npm install -g pnpm`) and run `pnpm run dev` in the root directory to serve the project locally.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

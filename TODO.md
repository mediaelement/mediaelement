### TODO

#### Features to be implemented related to renderers and player

*All items listed in https://github.com/mediaelement/mediaelement/labels/Feature*

**NOTE** Please make sure any features are labeled with `Feature` to make them available with the link above.

#### Known issues related to renderers and player

*Known issues to be resolved listed in https://github.com/mediaelement/mediaelement/labels/Bug*

**NOTE** Please make sure any bugs are labeled with `Bug` to make them available with the link above.

#### Modernization Tasks

**Remove IE11 Support and Legacy Polyfills**

- [ ] Remove `promise-polyfill` dependency from `package.json`
- [ ] Remove Promise polyfill logic from `src/js/utils/polyfill.js`
- [ ] Update browser targets in `vite.config.js` to remove IE11 references
- [ ] Update documentation to reflect modern browser support (Chrome 61+, Firefox 60+, Safari 11+, Edge 16+)
- [ ] Remove IE11-specific CSS hacks and workarounds
- [ ] Update README.md browser support section
- [ ] Consider using `@vitejs/plugin-legacy` for automatic polyfill management if needed

**Rationale:** Modern browsers have native Promise support, and maintaining IE11 compatibility increases bundle size and development complexity. This change will modernize the codebase and reduce maintenance overhead.

### Any features/issues related to elements in controlbar or additional

*All items listed in https://github.com/mediaelement/mediaelement-plugins/issues*

# GoogleAppsScripts
One or more Google Apps Scripts Experiments

The initial experiment is a simple toolbar that allows the application of specific, predefined (aka hard-coded) font formatting at the push of a button–keyboard shortcuts would be great, [but that's been 6 years in the making :(](https://code.google.com/p/google-apps-script-issues/issues/detail?id=306). Because more than one formatting step may be applied to the current selection, I applied a tangible performance improvement by caching the Text objects and providing a fluent interface for each of the formatting steps. Example:

```javascript
withSelection()
    .applyFormatting('setBold', true)
    .applyFormatting('setFontFamily', 'Consolas')
```

![Toolbar](/docs/screenshot.png)

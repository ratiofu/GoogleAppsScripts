// Copyright 2016 Thomas Jung
//
// Licensed under the MIT License
// https://opensource.org/licenses/MIT
//
// Find local talent @ helpwith.co/a/ratiofu

function onOpen(e) {
  DocumentApp.getUi().createMenu('Format Code')
      .addItem('Show Toolbar', 'showSidebar')
      .addItem('Inline Code', 'applyCodeFormatting')
      .addItem('URL', 'applyUrlFormatting')
      .addToUi()
}

function onInstall(e) {
  onOpen(e)
}

function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('toolbar.html')
      .setTitle('Format');
  DocumentApp.getUi().showSidebar(ui);
}

function withSelection() {

  // List holding a snapshot of all Text objects to be formatted and their
  // selection ranges, if any:
  // [ { text, isParial, start, end } ]
  const texts = [],
  // The fluent interface returned by any of the function calls
    fluent = {}
  
  // applies a speficic formatting function to all current text selections
  function applyFormatting(formatFunction, value) {
    if (typeof formatFunction !== 'string') {
      throw new Error('FORMAT FUNCTION NAME NOT A STRING')
    }
    texts.forEach(function(info) {
      const text = info.text,
      formatFn = text[formatFunction]
      if (!formatFn) {
        throw new Error(formatFunction + ' IS NOT A VALID FORMAT FUNCTION NAME')
      }
      if (info.isPartial) {
        formatFn.call(text, info.start, info.end, value)
      } else {
        formatFn.call(text, value)
      }
    })
    return fluent
  }
  
  // the only actual return of our fluent interface is the formatting function
  fluent.applyFormatting = applyFormatting
  
  // code below selects all active editable-as-text elements and selection ranges
  const selection = DocumentApp.getActiveDocument().getSelection()
  if (!selection) {
    return fluent
  }
  const ranges = selection.getRangeElements()
  ranges.forEach(function (range) {
    const element = range.getElement()
    if (!element.editAsText) {
      return
    }
    const text = element.editAsText(),
      info = {
        text: text,
        isPartial: range.isPartial()
      }
    if (info.isPartial) {
      info.start = range.getStartOffset()
      info.end = range.getEndOffsetInclusive()
    }
    texts.push(info)
  })
  
  return fluent
}

// the two formatting functions I cared about

function applyCodeFormatting() {
  withSelection()
    .applyFormatting('setBold', true)
    .applyFormatting('setFontFamily', 'Consolas')
}

function applyUrlFormatting() {
  withSelection()
    .applyFormatting('setFontFamily', 'Consolas')
    .applyFormatting('setForegroundColor', '#0b5394')
}

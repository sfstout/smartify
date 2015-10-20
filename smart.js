// Globals
var globalChance = .1;
var semiColonChance = globalChance;

// Takes a word and the 'smartified' word and returns the smartified word in the correct casing.
// This only cares about the first letter of the word
// Input: word : string, smartified: string
// Output: string
function properCase(word, smartified) {
    if (word[0].toUpperCase() === word[0]) { // If first letter is capital
        return (smartified[0].toUpperCase() + smartified.substring(1, smartified.length)); // Return with first letter capital
    }
    return smartified; // Otherwise return as normal
}

// Takes a word and returns a supposed synonym from a thesaurus
// Input: word : string
// Output: string
function thesaurus(word) {
    return word;
}

// Takes a single word and 'smartifies' it
// Input: word: string
// Output: string
function translateWord(word) {
    // Special Cases
    if (/\bjoey\b/i.test(word)) { // We're dealing with Joey
        return properCase(word, 'baby kangaroo');
    } else if (/\bheart\b/i.test(word)) {
        return properCase(word, 'full-sized aortic pump');
    } else if (/\bhearts\b/i.test(word)) {
        return properCase(word, 'full-sized aortic pumps');
    }
    return thesaurus(word);
}

// Takes a single token and 'smartifies' it
// Input: token: string
// Output: string
function translateSingle(token) {
    var i;
    if (/\w/.test(token)) { // Dealing with a word
        return translateWord(token);
    } else if (i = /,/.exec(token)) { // sometimes replace ',' with ';'
        if (Math.random() < semiColonChance) {
            token = token.substring(0, i.index) + ';' +  token.substring(i.index + 1, token.length);
        }
    }
    return token; // Otherwise leave unpermuted
}

// Takes a paragraph/grouping of words and 'smartifies' it
// Input: text: string
// Output: string
function translateParagraph(text) {
    text = text.split(/\b/);
    for (var i = 0; i < text.length; i++) {
        text[i] = translateSingle(text[i]);
    }
    return text.join('');
}

// Returns a random attributed author and date
function getRandomAuthor() {
    var titles = ['Duke ', 'The Duchess ', 'Queen ', 'King ', 'President ', 'Dr '];
    var names = ['Wellington ', 'of Canterbury ', 'Obama ', 'Bush ', 'Elizabeth II ', 'Louis XVI ', 'Henry VIII '];
    var years = ['1776 A.D.', '1984 A.D.', 'The Third Age', '996 A.D.', '2004 B.C.'];
    var ret = '';
    ret += titles[Math.floor(Math.random()*titles.length)];
    ret += names[Math.floor(Math.random()*names.length)];
    ret += years[Math.floor(Math.random()*years.length)];
    return ret;
}

// top level, simple replaces the info
// Input: info
//        tab
function smartify(info, tab) {

    var returnText = translateParagraph(info.selectionText);

    console.log(info);
    console.log(tab);

    if (info.menuItemId === 'quote') {
        returnText = '" ' + returnText + ' "\n   - ' + getRandomAuthor();
    }

    console.log(returnText);

        chrome.tabs.executeScript({
            code: "console.log('clicked')"
      });

}

// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() { 

    var smartifyParent = chrome.contextMenus.create(
        {"title": "Smartify", 'contexts': ['selection'], "id": "1"}
    );
    chrome.contextMenus.create(
        {"title": "Smartify", 'contexts': ['selection'], "parentId": "1", "id": "smartify"}
    );
    chrome.contextMenus.create( 
        {"title": "Smartify with quote", 'contexts': ['selection'], "parentId": "1", "id": "quote"}
    );

    chrome.contextMenus.onClicked.addListener(smartify);
});


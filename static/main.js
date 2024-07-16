const whiteKeys = document.querySelectorAll(".svg-white-keys");
const blackKeys = document.querySelectorAll(".svg-black-keys");

const controlPanel = document.getElementById("controls");
const graphics = document.querySelector(".graphic");

const chordSymbolDisplay = document.getElementById("chord-symbol");
const chordTypeDisplay = document.getElementById("chord-type");
const formula = document.getElementById("formula");
const invertButton = document.getElementById("invert-btn");

let chord = "";
let currentOctave = "";

document.addEventListener("DOMContentLoaded", () =>{
    mapTones();
    resetChordGraphic();
    // mapTones();
})

let root = "";
let chordType = "";
let invertedNote = "";

// # define an octave
const octave = 12;

// define list of notes
let root_notes = {
    "C": 0,
    "Csharp": 1,
    "D": 2,
    "Dsharp": 3,
    "E": 4,
    "F": 5,
    "Fsharp": 6,
    "G": 7,
    "Gsharp": 8,
    "A": 9,
    "Asharp": 10,
    "B": 11,
};

// inverse list of notes 
let reversed_root_notes = {};

for (let key in root_notes) {
    let value = root_notes[key];
    reversed_root_notes[value] = key;
};

// numbers to letters
function letterize_digit(digit) {
   return reversed_root_notes[digit];
};

// letters to numbers
function digitize_note(root) {
    return root_notes[root];
};

// handle rootnote selection
graphics.addEventListener("click", handleKeys);

function handleKeys(e) {
    let classes = e.target.classList;
    console.log("Handling: " + classes)
    for (let i=0; i < classes.length; i++) {
        // check if id matches a note or enharmonic
        if (/^[a-zA-Z]$/.test(classes[i]) || /^[a-zA-Z]sharp$/.test(classes[i])) {
            root = classes[i];
            console.log("root:" + root)
        }
        else {
            currentOctave = classes[i];
            console.log("Current Octave:" + currentOctave)
        }
    }
    if (currentOctave == "octave_2") {
        root = digitize_note(root) + 12;
    }
    mapTones();
}

controlPanel.addEventListener("click", controlApp);

function controlApp(e) {
    if (e.target.classList.contains("dropdown-toggle")) {
        return;
    }
    if (chordFunctions.hasOwnProperty(e.target.id)) {
        chordType = e.target.id;
        console.log("chordType:" + chordType)
    };

    mapTones();
}

function resetChordGraphic() {

    whiteKeys.forEach(function(key) {
        const wholeNotes = key.querySelectorAll("*");
        wholeNotes.forEach(function(rect) {
            rect.style.transform = "translateY(0)";
            rect.style.filter = "brightness(100%)";
            rect.style.fill = "#F9F9F9";
        });
    });

    blackKeys.forEach(function(key) {
        const inharmonicNotes = key.querySelectorAll("*");
        inharmonicNotes.forEach(function(rect) {
            rect.style.transform = "translateY(0)";
            rect.style.filter = "brightness(100%)";
            rect.style.fill = "#2D2D2A";
        });
    });
    // draw root, chord type, and formula
    chordSymbolDisplay.innerText = "-";
    chordTypeDisplay.innerText = "-";
    formula.innerText = "(-)";
    // TODO add chord spelling too!
};

// map chord
function mapTones() {
    if (!root) {
        root = 0;
    }
    if (isNaN(root)) {
        root = digitize_note(root);
        console.log("digitized root:" + root)
    }
    if (!chordFunctions[chordType]) {
        chordType = "major";
    }
    chord = chordFunctions[chordType](root)
    console.log("mapped: " + chord)
    drawChord(chord);
};

invertButton.addEventListener("click", invertChord)

// handle inversions
function invertChord() {
    invertedNote = "";
    console.log("inverting: " + chord[0])
    invertedNote = chord.shift() + 12;
    console.log("inverted: " + invertedNote)
    chord.push(invertedNote);
    drawChord(chord);
}

// draw chord
function drawChord(chord) {
    resetChordGraphic();
    console.log(chordType);
    for (let note of chord) {
        console.log(note);
        
        if (note > 23) {
            note = note % 24;
        }
        if (note > 11) {
            note = note % 12;
            currentOctave = "octave_2";
        } else {
            note = note % 12;
            currentOctave = "octave_1";
        };
        
        note = letterize_digit(note);
        let styled = document.querySelector(`.${currentOctave}.${note}`);

        // if there a rectangle with those classes exists, color it in
        if (styled) {
            let noteGroup = styled.parentNode.className.baseVal;
            if (noteGroup == "svg-black-keys") {
                styled.style.fill = "dodgerblue";
            }
            else if (noteGroup == "svg-white-keys") {
                styled.style.fill = "dodgerblue";
            };
                // Apply transform for smaller screens
            if (window.innerWidth < 500) {
                styled.style.transform = "translateY(-4px)";
                // Apply transform for larger screens
            } else {
                styled.style.transform = "translateY(-12px)";
            };


        } else {
            error.log('No SVG element with ID', note);
        };

        // draw chord name and formula / UPDATE INFO PANE
        chordSymbolDisplay.innerText = `${letterize_digit(root % 12)}`;
        chordTypeDisplay.innerText = `${chordType}`;
        formula.innerText = `Formula: (${chord})`;
        
    };
    return chord;
};


// rewrite chord functions as object methods
const chordFunctions = {
    major: function(root) {
        let third = root + 4;
        let fifth = root + 7;
        return [root, third, fifth];
    },
    minor: function(root) {
        let third = root + 3;
        let fifth = root + 7;
        return [root, third, fifth];
    },
    dom7: function(root) {
        let third = root + 4;
        let fifth = root + 7;
        let seventh = root + 10;
        return [root, third, fifth, seventh];
    },
    min7: function(root) {
    	let third = root + 3;
    	let fifth = root + 7;
    	let seventh = root + 10;
        return [root, third, fifth, seventh];
    },
    maj7: function(root) {
        let third = root + 4;
        let fifth = root + 7;
        let seventh = root + 11;
        return [root, third, fifth, seventh];
    },
    minMaj7: function(root) {
        let third = root + 3;
        let fifth = root + 7;
        let seventh = root + 11;
        return [root, third, fifth, seventh];
    },
    maj6: function(root) {
        let third = root + 4;
        let fifth = root + 7;
        let seventh = root + 9;
        return [root, third, fifth, seventh];
    },
    min6: function(root) {
        let third = root + 3
        let fifth = root + 7
        let seventh = root + 9
        return [root, third, fifth, seventh];
    },
    sixthNinth: function(root) {
        let third = root + 4;
        let fifth = root + 7;
        let seventh = root + octave + 2;
        return [root, third, fifth, seventh];
    },
    fifth: function(root) {
        let fifth = root + 7;
        return [root, fifth];
    },
    ninth: function(root) {
        let third = root + 4;
        let fifth = root + 7;
        let seventh = root + 10;
        let ninth = root + octave + 2;
        return [root, third, fifth, seventh, ninth];
    },
    min9: function(root) {
        let third = root + 3;
        let fifth = root + 7;
        let seventh = root + 10;
        let ninth = root + octave + 2;
        return [root, third, fifth, seventh, ninth];
    },
    maj9: function(root) {
        let third = root + 4;
        let fifth = root + 7;
        let seventh = root + 11;
        let ninth = root + octave + 2;
        return [root, third, fifth, seventh, ninth];
    },
    eleventh: function(root) {
        let third = root + 4;
        let fifth = root + 7;
        let seventh = root + 10;
        let ninth = root + octave + 2;
        let eleventh = root + octave + 5;
        return [root, third, fifth, seventh, ninth, eleventh];
    },
    min11: function(root) {
        let third = root + 3;
        let fifth = root + 7;
        let seventh = root + 10;
        let ninth = root + octave + 2;
        let eleventh = root + octave + 5;
        return [root, third, fifth, seventh, ninth, eleventh];
    },
    maj11: function(root) {
        let third = root + 4;
        let fifth = root + 7;
        let seventh = root + 11;
        let ninth = root + octave + 2;
        let eleventh = root + octave + 5;
        return [root, third, fifth, seventh, ninth, eleventh];
    },
    thirteenth: function(root) {
        let third = root + 4;
        let fifth = root + 7;
        let seventh = root + 10;
        let ninth = root + octave + 2;
        let eleventh = root + octave + 5;
        let thirteenth = root + octave + 9;
        return [root, third, fifth, seventh, ninth, eleventh, thirteenth];
    },
    min13: function(root) {
        let third = root + 3;
        let fifth = root + 7;
        let seventh = root + 10;
        let ninth = root + octave + 2;
        let eleventh = root + octave + 5;
        let thirteenth = root + octave + 9;
        return [root, third, fifth, seventh, ninth, eleventh, thirteenth];
    },
    maj13: function(root) {
        let third = root + 4;
        let fifth = root + 7;
        let seventh = root + 11;
        let eleventh = root + octave + 2;
        let thirteenth = root + octave + 9;
        return [root, third, fifth, seventh, eleventh, thirteenth];
    },
    add9: function(root) {
        let third = root + 4;
        let fifth = root + 7;
        let seventh = root + octave + 2;
        return [root, third, fifth, seventh];
    },
    add2: function(root) {
        let third = root + 2;
        let fifth = root + 4;
        let seventh = root + 7;
        return [root, third, fifth, seventh];
    },
    sevenMinusFive: function(root) {
        let third = root + 4;
        let fifth = root + 6;
        let seventh = root + 10;
        return [root, third, fifth, seventh];
    },
    sevenPlusFive: function(root) {
        let third = root + 4;
        let fifth = root + 8;
        let seventh = root + 10;
        return [root, third, fifth, seventh];
    },
    sus4: function(root) {
        let third = root + 5;
        let fifth = root + 7;
        return [root, third, fifth];
    },
    sus2: function(root) {
        let third = root + 2;
        let fifth = root + 7;
        return [root, third, fifth];
    },
    diminished: function(root) {
        let third = root + 3;
        let fifth = root + 6;
        return [root, third, fifth];
    },
    dim7: function(root) {
        let third = root + 3;
        let fifth = root + 6;
        let seventh = root + 9;
        return [root, third, fifth, seventh];
    },
    min7b5: function(root) {
        let third = root + 3;
        let fifth = root + 6;
        let seventh = root + 10;
        return [root, third, fifth, seventh];
    },
    aug: function(root) {
        let third = root + 4;
        let fifth = root + 8;
        return [root, third, fifth];
    },
    aug7: function(root) {
        let third = root + 4;
        let fifth = root + 8;
        let seventh = root + 10;
        return [root, third, fifth, seventh];
    },
};




// request.form.get('rootnote', "C")

// function makeChord(root) {
//     if (chordType == "major") {
//         const createMaj = (root) => {
//             let third = root + 4;
//             let fifth = root + 7;
//             return [root, third, fifth];
//         };
//         return createMaj(root);
//     };
// };
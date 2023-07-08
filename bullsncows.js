function addYAfterLastLetter(inputElement) {
    inputElement.addEventListener('input', function() {
        var value = inputElement.value;
        if (value.length > 0) {
            var lastChar = value.charAt(value.length - 1);
            if (!isNaN(parseInt(lastChar))) {
                if (value.length == 1) {
                    inputElement.value = value + 'S';
                } else if (value.length == 3){
                    inputElement.value = value + 'B';
                }
            }else{
                inputElement.value = value.slice(0, value.length - 1);
            }
        }
    });
}

function createSetRow() {
    var setRowHtml = "<div class='set-row'>";
    for (var i = 0; i < 3; i++) {
        setRowHtml += "<input type='text' class='set-input text-center rounded' pattern='\d' maxlength='1'>";
    }
    setRowHtml += "<input type='text' class='set-input-res text-center rounded' pattern='\dS\dB' maxlength='4'>";
//    setRowHtml += "<div class='delete-box'><button class='delete-button'>X</button></div>";
    setRowHtml += "<div class='delete-box'><button class='delete-button btn btn-sm btn-danger'><i class='mdi mdi-close'>X</i></button></div>";

    setRowHtml += "</div>";
    return setRowHtml;
}

function getCombs(){
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const combinations = [];

    for (let i = 0; i < digits.length; i++) {
        for (let j = 0; j < digits.length; j++) {
        for (let k = 0; k < digits.length; k++) {
            if (i !== j && i !== k && j !== k) {
            const combination = [digits[i], digits[j], digits[k]];
            combinations.push(combination);
            }
        }
        }
    }
    return combinations
}

function getScore(comb, res) {
    const balls = comb.filter(element => res.includes(element));
    var strikes = 0;
    for (i=0; i<comb.length; i++){
        if (comb[i]===res[i]){
            strikes++;
        }
    }
    return `${strikes}S${balls.length-strikes}B`
}

function findAlts(sets) {
    var combs = getCombs();
    for (var set_ix = 0; set_ix < sets.length; set_ix++){
        var values = sets[set_ix].slice(0,3);
        var result = sets[set_ix][3]
        var new_combs = []
        for (var comb_ix = 0; comb_ix < combs.length; comb_ix++){
            
            var score = getScore(combs[comb_ix], values);
            
            if (score === result){
                new_combs.push(combs[comb_ix])
            }
        }
        combs = new_combs;
    }
    return combs;
}

function getRecomm(alts, sets){

    let counts = {};
    for (let i = 0; i < 10; i++) {
    counts[i] = 0;
    }

    for (var s = 0; s < sets.length; s++){
        for (var v = 0; v < sets[s].length; v++) {
            var value = sets[s][v];
            counts[value]++;
        }
    }

    var combs_dict = {};
    for (var ix = 0; ix < alts.length; ix++) {
        let comb = alts[ix];
        combs_dict[ix] = comb.reduce((acc, d) => acc + counts[d], 0);
    }
    combs_dict = Object.entries(combs_dict).sort((a, b) => a[1] - b[1]);
    return Array.from(alts[combs_dict[0][0]]);
}


$(document).ready(function() {
    var setsContainer = $("#setsContainer");
    var calculateButton = $("#calculateButton");
    var resultContainer = $("#resultContainer");

    calculateButton.on("click", function() {
        var sets = getSets();
        let tries = sets.map(game_set => game_set.slice(0, 3));

        var alts = $(findAlts(sets));

        var recomm = getRecomm(alts, tries);

        if (alts.length > 0) {
            var resultHtml = "";
            resultHtml += "<div class='result-recomm'>";
            resultHtml += "<div> Recommended: </div>";
            resultHtml += "<div class='result-item'>" + recomm.join(", ") + "</div>";
            resultHtml += "</div>";

            resultHtml += "<div class='result'>";
            for (var i = 0; i < alts.length; i++) {
                var alt = alts[i];
                resultHtml += "<div class='result-item'>" + alt.join(", ") + "</div>";
                
            }
            resultHtml += "</div>";
            resultContainer.html(resultHtml);
        } else {
            resultContainer.html("");
        }
    });

    function getSets() {
        var sets = [];

        $(".set-row").each(function() {
            var set = [];
            $(this).find(".set-input").each(function() {
                var number = parseInt($(this).val());
                if (!isNaN(number)) {
                    set.push(number);
                }
            });
            $(this).find(".set-input-res").each(function() {
                var res = $(this).val()
                if (res.length > 0) {
                    set.push($(this).val());
                }
            });
            if (set.length > 0) {
                sets.push(set);
            }
        });

        return sets;
    }

    for (var i = 0; i < 5; i++) {
        var setRow = $(createSetRow());
        var setResInput = setRow.find(".set-input-res");
        addYAfterLastLetter(setResInput[0]);
        setsContainer.append(setRow);
    }

    $(document).on("click", ".delete-button", function() {
        var row = $(this).closest(".set-row");
        row.find(".set-input-res").val("");
        row.find(".set-input").val("");
    });

});

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

function findAlts(sets) {
    console.log(sets);

    return [1,2,3];
}

$(document).ready(function() {
    var setsContainer = $("#setsContainer");
    var calculateButton = $("#calculateButton");
    var resultContainer = $("#resultContainer");

    calculateButton.on("click", function() {
        var sets = getSets();
        console.log(sets);

        var alts = $(findAlts(sets))

        if (alts.length > 0) {
            console.log(alts);
            var resultHtml = "";
            for (var i = 0; i < sets.length; i++) {
                var set = sets[i];
                resultHtml += "<div class='result'>";
                resultHtml += "<h3>Set " + (i + 1) + "</h3>";
                resultHtml += "<p>Numbers: " + set.join(", ") + "</p>";
                resultHtml += "</div>";
            }
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

var match = 
{
    "awayTeam": {
        "name": "West Wight",
        "squad": [
            {
                "name": "Someone"
            }
        ],
        "goals": ko.observableArray()
    },
    "homeTeam": {
        "name": "Gurnard",
        "squad": [
            {
                "name": "Aaron"
            },
            {
                "name": "Ben"
            },
            {
                "name": "Charley"
            },
            {
                "name": "Hercules"
            },
            {
                "name": "Jay"
            },
            {
                "name": "Jeremy"
            },
            {
                "name": "Luca"
            },
            {
                "name": "Sebastian"
            },
            {
                "name": "Sef"
            },
            {
                "name": "Toby"
            },
        ],
        "goals": ko.observableArray()
    },
    "highlights": ko.observableArray(),
    "currentMatchTime": ko.observable(0),
    
    addHighlight: function(type, message) {
        this.highlights.unshift({"type": type, "message": message});
    }
};

match.formattedMatchTime = ko.pureComputed(function() {
    if (matchState == "PlayingFirstHalf" && this.currentMatchTime() > 20)
        return "20' +" + (this.currentMatchTime() - 20);
    else if (matchState == "PlayingSecondHalf" && this.currentMatchTime() > 40)
        return "40' +" + (this.currentMatchTime() - 40);
    else
        return this.currentMatchTime() + "'";
}, match);

var matchState = "Fixture"; //TODO: replace with a state machine?

function init() {
    ko.applyBindings(match); //TODO: rename to viewModel?
    
    $("#homeGoal a").on("click", function(event) {
        scoreHomeGoal(this.text);
        event.preventDefault();
    });
    
    $("#kickOff").on("click", kickOff);
    
    $("#awayGoal a").on("click", function(event) {
        scoreAwayGoal(this.text);
        event.preventDefault();
    });
    
    match.addHighlight("fa-hourglass-start", "Waiting for match to start");
}

function scoreHomeGoal(name) {
    switch(matchState) {
        case "PlayingFirstHalf":
        case "PlayingSecondHalf":
            match.homeTeam.goals.push({"name": name, "minute": match.currentMatchTime(), "half": ((matchState == "PlayingFirstHalf") ? 1 : 2)});
            match.addHighlight("fa-futbol-o", match.formattedMatchTime() + " " + name + " scores a goal for " + match.homeTeam.name + "!");
            break;
    }
}

function scoreAwayGoal(name) {
    switch(matchState) {
        case "PlayingFirstHalf":
        case "PlayingSecondHalf":
            match.awayTeam.goals.push({"name": name, "minute": match.currentMatchTime(), "half": ((matchState == "PlayingFirstHalf") ? 1 : 2)});
            match.addHighlight("fa-futbol-o", match.formattedMatchTime() + " " + name + " scores a goal for " + match.awayTeam.name + "!");
            break;
    }
}

function kickOff() {
    switch(matchState) {
        case "Fixture":
            startTimer();
            matchState = "PlayingFirstHalf";
            $("#kickOff").html("<i class=\"fa fa-stop\"></i>");
            $("#kickOff").removeClass("btn-success-outline").addClass("btn-danger-outline");
            match.addHighlight("fa-flag-o", "First Half begins");
            break;
        case "PlayingFirstHalf":
            stopTimer();
            matchState = "HalfTime";
            $("#timer").prepend("HT ");
            $("#kickOff").html("<i class=\"fa fa-play\"></i>");
            $("#kickOff").removeClass("btn-danger-outline").addClass("btn-success-outline");
            match.addHighlight("fa-flag-checkered", "Half Time");
            break;
        case "HalfTime":
            startTimer();
            matchState = "PlayingSecondHalf";
            $("#kickOff").html("<i class=\"fa fa-stop\"></i>");
            $("#kickOff").removeClass("btn-success-outline").addClass("btn-danger-outline");
            match.addHighlight("fa-flag-o", "Second Half begins");
            break;
        case "PlayingSecondHalf":
            stopTimer();
            matchState = "FullTime";
            
            var homeFirstHalfGoals = 0;
            $.each(match.homeTeam.goals(), function(index, value) {
                if (value.half == 1)
                    homeFirstHalfGoals++;
            })
            
            var awayFirstHalfGoals = 0;
            $.each(match.awayTeam.goals(), function(index, value) {
                if (value.half == 1)
                    awayFirstHalfGoals++;
            })
            
            $("#timer").prepend("FT ").append("<br />HT " + homeFirstHalfGoals + "-" + awayFirstHalfGoals);
            match.addHighlight("fa-flag-checkered", "Full Time");
            break;
    }
    
    this.blur();
}

var timer;

function startTimer() {
    var halfStartTime = new Date();
    
    timer = setInterval(function() {
        var interval = new Date() - halfStartTime;
        
        if (matchState == "PlayingSecondHalf")
            match.currentMatchTime(20 + Math.floor(interval / 60000));
        else
            match.currentMatchTime(Math.floor(interval / 60000));
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

$(document).ready(function() {
    init();
});
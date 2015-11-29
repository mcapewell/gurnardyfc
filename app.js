var match = 
{
    "awayTeam": {
        "name": "Rew Valley",
        "squad": [
            {
                "num": 0,
                "name": "Someone"
            }
        ],
        "goals": []
    },
    "homeTeam": {
        "name": "Gurnard",
        "squad": [
            {
                "num": 1,
                "name": "Charley"
            },
            {
                "num": 4,
                "name": "Jeremy"
            },
            {
                "num": 8,
                "name": "Luca"
            },
            {
                "num": 10,
                "name": "Sef"
            },
            {
                "num": 0,
                "name": "Toby"
            },
            {
                "num": 0,
                "name": "Hercules"
            },
            {
                "num": 0,
                "name": "Ben"
            },
            {
                "num": 0,
                "name": "Jay"
            },
            {
                "num": 0,
                "name": "Aaron"
            }
        ],
        "goals": []
    }
};

var matchState = "Fixture";

function init() {
    $("#homeTeam").html(match.homeTeam.name);
    $("#awayTeam").html(match.awayTeam.name);
    countGoals();
    
    $.each(match.homeTeam.squad, function(index, value) {
        $("#homeGoal").append("<a class=\"dropdown-item\" href=\"#\">" + value.name + "</a>");
    })
    
    $.each(match.awayTeam.squad, function(index, value) {
        $("#awayGoal").append("<a class=\"dropdown-item\" href=\"#\">" + value.name + "</a>");
    })
    
    $("#homeGoal a").on("click", function(event){scoreHomeGoal(this.text);event.preventDefault();});
    $("#kickOff").on("click", kickOff);
    $("#awayGoal a").on("click", function(event){scoreAwayGoal(this.text);event.preventDefault();});
}

function countGoals() {
    $("#homeTeamScore").html(match.homeTeam.goals.length);
    $("#awayTeamScore").html(match.awayTeam.goals.length);
}

function scoreHomeGoal(name) {
    switch(matchState) {
        case "PlayingFirstHalf":
            var minute = getCurrentMatchTime();
            if (minute > 20) minute = 19;
            match.homeTeam.goals.push({"name": name, "minute": minute})
            highlightGoal(match.homeTeam.name, name, minute);
            countGoals();
            break;
        case "PlayingSecondHalf":
            var minute = getCurrentMatchTime();
            if (minute > 40) minute = 40;
            match.homeTeam.goals.push({"name": name, "minute": minute})
            highlightGoal(match.homeTeam.name, name, minute);
            countGoals();
            break;
    }
}

function scoreAwayGoal(name) {
    switch(matchState) {
        case "PlayingFirstHalf":
            var minute = getCurrentMatchTime();
            if (minute > 20) minute = 19;
            match.awayTeam.goals.push({"name": name, "minute": minute})
            highlightGoal(match.awayTeam.name, name, minute);
            countGoals();
            break;
        case "PlayingSecondHalf":
            var minute = getCurrentMatchTime();
            if (minute > 40) minute = 40;
            match.awayTeam.goals.push({"name": name, "minute": minute})
            highlightGoal(match.awayTeam.name, name, minute);
            countGoals();
            break;
    }
}

function highlightGoal(team, player, minute) {
    $("#highlights").prepend("<li class=\"media\"><div class=\"media-left\"><i class=\"fa fa-futbol-o\"></i></div><div class=\"media-body\">" + minute + "' " + player + " scores a goal for " + team + "!</div></li>");
}

function kickOff() {
    switch(matchState) {
        case "Fixture":
            startTimer();
            matchState = "PlayingFirstHalf";
            $("#kickOff").html("<i class=\"fa fa-stop\"></i>");
            $("#kickOff").removeClass("btn-success-outline").addClass("btn-danger-outline");
            $("#highlights").prepend("<li class=\"media\"><div class=\"media-left\"><i class=\"fa fa-flag-o\"></i></div><div class=\"media-body\">First Half begins</div></li>");
            break;
        case "PlayingFirstHalf":
            stopTimer();
            matchState = "HalfTime";
            $("#timer").html("HT 20'");
            $("#kickOff").html("<i class=\"fa fa-play\"></i>");
            $("#kickOff").removeClass("btn-danger-outline").addClass("btn-success-outline");
            $("#highlights").prepend("<li class=\"media\"><div class=\"media-left\"><i class=\"fa fa-flag-checkered\"></i></div><div class=\"media-body\">Half Time</div></li>");
            break;
        case "HalfTime":
            startTimer();
            matchState = "PlayingSecondHalf";
            $("#kickOff").html("<i class=\"fa fa-stop\"></i>");
            $("#kickOff").removeClass("btn-success-outline").addClass("btn-danger-outline");
            $("#highlights").prepend("<li class=\"media\"><div class=\"media-left\"><i class=\"fa fa-flag-o\"></i></div><div class=\"media-body\">Second Half begins</div></li>");
            break;
        case "PlayingSecondHalf":
            stopTimer();
            matchState = "FullTime";
            
            var homeFirstHalfGoals = 0;
            $.each(match.homeTeam.goals, function(index, value) {
                if (value.minute < 20)
                    homeFirstHalfGoals++;
            })
            
            var awayFirstHalfGoals = 0;
            $.each(match.awayTeam.goals, function(index, value) {
                if (value.minute < 20)
                    awayFirstHalfGoals++;
            })
            
            $("#timer").html("FT 40'<br />HT " + homeFirstHalfGoals + "-" + awayFirstHalfGoals);
            $("#highlights").prepend("<li class=\"media\"><div class=\"media-left\"><i class=\"fa fa-flag-checkered\"></i></div><div class=\"media-body\">Full Time</div></li>");
            break;
    }
    
    this.blur();
}

var timer;
var halfStartTime;

function startTimer() {
    halfStartTime = new Date();
    
    timer = setInterval(function() {
        $("#timer").html(getCurrentMatchTime() + "'");
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function getCurrentMatchTime() {
    var interval = new Date() - halfStartTime;
    
    if (matchState == "PlayingSecondHalf")
        return 20 + Math.floor(interval / 60000);
    else
        return Math.floor(interval / 60000);
}

$( document ).ready(function() {
    init();
});
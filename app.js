var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const fetch = require("node-fetch");
const Users = require('./Models/users');

var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
const mongoose = require('mongoose');
const { compile } = require("morgan");
var calculate_score = require("./calculate_score");

mongoose.connect('mongodb+srv://bansal045:8Modeltown@fantasyleaguedb.rossf.mongodb.net/test',
                 {useNewUrlParser: true,
                     useUnifiedTopology: true});


var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");


app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Origin');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

var matchL = [];

fetch("https://dev132-cricket-live-scores-v1.p.rapidapi.com/matchseries.php?seriesid=2780?status=COMPLETED", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "57a1d9976cmshcb0d8b305869d0ep146ab6jsnd84d41c9d18e",
		"x-rapidapi-host": "dev132-cricket-live-scores-v1.p.rapidapi.com"
	}
  })
  .then((response) => response.json())
  .then(responseJson => {
    var x = responseJson.matchList.matches;
    for(var i in x)
    {
      matchL.push({id : x[i].id,Date : x[i].startDateTime});
    }
    matchL.sort(function(a, b){
      if(a.Date < b.Date) { return -1; }
      if(a.Date > b.Date) { return 1; }
      return 0;
  })
  })
  .catch(err => {
    console.error(err);
});

var curr_match_id = 50827;
var curr_series_id = 2780;
var time = 15*60*1000;

function updateDbWithResult()
{
  var motm = '';
  var score_a = 0;
  var score_b = 0;
  var mostRuns = '';
  var mostWickets = '';
  var team_a;
  var team_b;
  let all_users = [];
  var tied = 0;
  var matchComplete = 0;
  var winner;
  
  fetch(`https://dev132-cricket-live-scores-v1.p.rapidapi.com/match.php?seriesid=${curr_series_id}&matchid=${curr_match_id}`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "57a1d9976cmshcb0d8b305869d0ep146ab6jsnd84d41c9d18e",
		"x-rapidapi-host": "dev132-cricket-live-scores-v1.p.rapidapi.com"
  }
  })
  .then((response) => response.json())
  .then(responseJ => {
    if(responseJ.match.status ==  'COMPLETED')
    {
      matchComplete = 1;
      winner = responseJ.match.winningTeamId;
      console.log(winner);
      fetch(`https://dev132-cricket-live-scores-v1.p.rapidapi.com/scorecards.php?seriesid=${curr_series_id}&matchid=${curr_match_id}`, {
        "method": "GET",
        "headers": {
          "x-rapidapi-key": "57a1d9976cmshcb0d8b305869d0ep146ab6jsnd84d41c9d18e",
          "x-rapidapi-host": "dev132-cricket-live-scores-v1.p.rapidapi.com"
        }
        })
        .then((response) => response.json())
        .then(responseJson => {
          console.log(responseJson);
          if(responseJson.fullScorecardAwards.manOfTheMatchId != -1)
          {
            motm = responseJson.fullScorecardAwards.manOfTheMatchName;
            mostRuns = responseJson.fullScorecardAwards.mostRunsAward.name;
            mostWickets = responseJson.fullScorecardAwards.mostWicketsAward.name;
            if(responseJson.fullScorecard.innings.length == 4)
            {
              score_a = responseJson.fullScorecard.innings[3].run;
              team_a = responseJson.fullScorecard.innings[3].team.id;
              score_b = responseJson.fullScorecard.innings[2].run;
              team_b = responseJson.fullScorecard.innings[2].team.id;
              tied = 1;
            }
            else if(responseJson.fullScorecard.innings.length == 2)
            {
              score_a = responseJson.fullScorecard.innings[0].run;
              score_b = responseJson.fullScorecard.innings[1].run;
            }
          }
          else
          {
            matchComplete = 0;
          }
        })
        .then(response => {
          if(matchComplete == 1)
          {
            Users.find({})
              .then((user) => {
                for(var i in user)
                {
                  let x = user[i]
                  all_users.push(x);
                }
                calculate_score.calculate_score(curr_match_id,motm,mostRuns,mostWickets,score_a,score_b,team_a,team_b,all_users,tied,winner);
              })
              .catch(err => {
                console.error(err);
              });
              curr_match_id++;
          }
          else
          {
            console.log("Match not Complete Yet");
          }
          })
        .catch(err => {
          console.error(err);
      });
    }
  })
  .catch(err => {
  console.error(err);
  });
}

var interval = setInterval(updateDbWithResult,time);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

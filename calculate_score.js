const Users = require('./Models/users');

function calculate_score(matchID,motm,mostRuns,mostWicekts,score_a,score_b,team_a,team_b,all_users,tied,winner)
{
    for(var i in all_users)
      {
        Users.findById(all_users[i]._id)
        .then((user) => {
          if(user != null)
          {
            for(var j in user.predictions)
            {
              if(user.predictions[j].matchID == matchID)
              {
                console.log(matchID);
                if(user.predictions[j].p_id_a != team_a)
                {
                  var temp = score_a;
                  score_a = score_b;
                  score_b = temp;
                  temp = team_a;
                  team_a = team_b;
                  team_b = temp;
                }
                var score = 0;
                if((tied == 0 && user.predictions[j].p_tied == 0) && (user.predictions[j].p_winner == winner))
                {
                  score += 5;
                }
                else if((tied == 1 && user.predictions[j].p_tied == 0) && (user.predictions[j].p_winner == winner))
                {
                  score += 2;
                }
                else if((tied == 1 && user.predictions[j].p_tied == 1) && (user.predictions[j].p_winner == winner))
                {
                  score += 8;
                }

                if(tied == 1 && user.predictions[j].p_tied == 1)
                {
                  score += 2;
                }
                else if(tied == 0 && user.predictions[j].p_tied == 1)
                {
                  score -= 3;
                }

                if(user.predictions[j].p_motm.toLowerCase() == motm.toLowerCase())
                {
                  score += 5;
                }
                if(user.predictions[j].p_runs.toLowerCase() == mostRuns.toLowerCase())
                {
                  score += 4;
                }
                if(user.predictions[j].p_wickets.toLowerCase() == mostWicekts.toLowerCase())
                {
                  score += 4;
                }

                if(user.predictions[j].p_score_a == "A" && score_a <= 100 && score_a > 0)
                {
                  score += 3;
                }
                else if(user.predictions[j].p_score_a == "B" && score_a <= 120 && score_a > 100)
                {
                  score += 3;
                }
                else if(user.predictions[j].p_score_a == "C" && score_a <= 140 && score_a > 120)
                {
                  score += 3;
                }
                else if(user.predictions[j].p_score_a == "D" && score_a <= 160 && score_a > 140)
                {
                  score += 3;
                }
                else if(user.predictions[j].p_score_a == "E" && score_a <= 180 && score_a > 160)
                {
                  score += 3;
                }
                else if(user.predictions[j].p_score_a == "F" && score_a <= 200 && score_a > 180)
                {
                  score += 3;
                }
                else if(user.predictions[j].p_score_a == "G" && score_a <= 220 && score_a > 200)
                {
                  score += 3;
                }
                else if(user.predictions[j].p_score_a == "H" && score_a <= 240 && score_a > 220)
                {
                  score += 3;
                }
                else if(user.predictions[j].p_score_a == "I" && score_a <= 260 && score_a > 240)
                {
                  score += 3;
                }
                else if(user.predictions[j].p_score_a == "J" && score_a > 260)
                {
                  score += 3;
                }

                if(user.predictions[j].p_score_b == "A" && score_b <= 100 && score_b > 0)
                {
                  score += 3;
                }
                else if(user.predictions[j].p_score_b == "B" && score_b <= 120 && score_b > 100)
                {
                  score += 3;
                }
                else if(user.predictions[j].p_score_b == "C" && score_b <= 140 && score_b > 120)
                {
                  score += 3;
                }
                else if(user.predictions[j].p_score_b == "D" && score_b <= 160 && score_b > 140)
                {
                  score += 3;
                }
                else if(user.predictions[j].p_score_b == "E" && score_b <= 180 && score_b > 160)
                {
                  score += 3;
                }
                else if(user.predictions.p_score_b == "F" && score_b <= 200 && score_b > 180)
                {
                  score += 3;
                }
                else if(user.predictions[j].p_score_b == "G" && score_b <= 220 && score_b > 200)
                {
                  score += 3;
                }
                else if(user.predictions[j].p_score_b == "H" && score_b <= 240 && score_b > 220)
                {
                  score += 3;
                }
                else if(user.predictions[j].p_score_b == "I" && score_b <= 260 && score_b > 240)
                {
                  score += 3;
                }
                else if(user.predictions[j].p_score_b == "J" && score_b > 260)
                {
                  score += 3;
                }
                if(score < 0)
                {
                  score = 0;
                }

                user.totalScore += score;
                user.predictions[j].a_winner = winner;
                user.predictions[j].a_tied = tied;
                user.predictions[j].a_runs = mostRuns;
                user.predictions[j].a_wickets = mostWicekts;
                user.predictions[j].a_motm = motm;
                user.predictions[j].a_score_a = score_a;
                user.predictions[j].a_score_b = score_b;
                user.predictions[j].score = score;
                console.log(user);
                user.save()
                .then((user) => {
                  console.log(user.predictions[j]);
                  console.log("Successfully updated db");
                })
                .catch(err => {
                  console.error(err);
                });
              }
            }
        }
      })
      .catch(err => {
        console.error(err);
      });
   }
}

module.exports = {calculate_score};
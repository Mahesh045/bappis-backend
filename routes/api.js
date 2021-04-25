var express = require("express");
var router = express.Router();
var fs = require("fs");
const { response } = require("../app");
const Users = require('../Models/users');

/* List of API */
router.get("/", function (req, res, next) {
  res.render("list", {
    title: "ABOUTREACT",
    apilist: [
      {
        name: `${req.headers.host}/api/user`,
        description: "All User Listing",
        method: "get",
      },
      {
        name: `${req.headers.host}/api/user/register`,
        description: "New User Register",
        method: "post",
      },
      {
        name: `${req.headers.host}/api/user/login`,
        description: "User Authentication",
        method: "post",
      },
      {
        name: `${req.headers.host}/api/user/search`,
        description: "User Search",
        method: "get",
      },
      {
        name: `${req.headers.host}/api/prediction`,
        description: "User prediction for current match",
        method: "post",
      },
    ],
  });
});


/* All User Listing */
router.get("/user", function (req, res, next) {
  /*const users = require("../users");
  res.send({ status: "success", data: users, msg: "" });*/
  Users.find({})
  .then((user) => {
    res.setHeader('Content-Type','application/json');
    res.statusCode = 200;
    res.json(user);
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.get("/user/:id", function (req, res, next) {
  Users.findById(req.params.id)
  .then((user) => {
    res.setHeader('Content-Type','application/json');
    res.statusCode = 200;
    res.json(user);
  }, (err) => next(err))
  .catch((err) => next(err));
});

/* New User Register */
router.post("/user/register", function (req, res, next) {
  Users.create(req.body)
  .then((user) => {
    console.log('User Created',user)
    res.send({statusCode : 200, data : user});
  }, (err) => next(err))
  .catch((err) => next(err));
});

/* User Authentication */
router.post("/user/login", function (req, res, next) {
  console.log(req.body.email);
  console.log(req.body.password);
  Users.find({email: req.body.email, password: req.body.password})
  .then((user) => {
    console.log(user);
    res.send({statusCode : 200, data : user});
  })
  .catch((error) => {
    //Hide Loader
    console.error(error);
  });
});

router.post("/user/prediction/:id", function (req, res, next) {
  console.log(req.params.id);
  console.log(req.body);
  Users.findById(req.params.id)
  .then((user) => {
    if(user != null)
    {
      console.log(user);
      user.predictions.push(req.body);
      user.save()
      .then((user) => {
        res.setHeader('Content-Type','application/json');
        res.statusCode = 200;
        res.json(user);
        /*res.send({statusCode : 200, data : user});*/
      })
      .catch((error) => {
        console.error(error);
      })
    }
    else
    {
      console.log("Mila nahi user");
    }
  })
  .catch((error) => {
    console.error(error);
  });
});

/* User predction */
router.get("/user/search", function (req, res, next) {
  console.log("req.body -> ", req.query);
  const users = require("../users");
  console.log(users);
  let newUsers = users.filter(function (e) {
    return e.name && e.name.toLowerCase().includes(req.query.q.toLowerCase());
  });
  res.send({ status: "success", data: newUsers, msg: "" });
});

module.exports = router;

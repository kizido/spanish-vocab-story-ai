const express = require("express");

const router = express.Router();

router.get("/users", (req, res) => {
  const userData = [
    {
      name: "Kieran",
      age: 22,
      single: false,
    },
    {
      name: "Junnelle",
      age: 23,
      single: false,
    },
  ];

  res.send(userData);
});

module.exports = router;
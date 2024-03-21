const express = require("express");

const answer = (res, status, message) => {
  res.status(status).json({ message });
};

module.exports = answer;

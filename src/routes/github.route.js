const express=require('express');
const { getGithubProfileData, getGithubRepoData, createGithubIssue } = require('../controllers/github.controller');
const router=express.Router();

router.route("/").get(getGithubProfileData)
router.route("/:repoName").get(getGithubRepoData)
router.route("/:repoName/issues").post(createGithubIssue)

module.exports=router
const ApiError = require("../utils/apiError.util");
const ApiResponse = require("../utils/apiResponse.util");
const asyncHandler = require("../utils/asyncHandler.util");

const getGithubProfileData=asyncHandler(async(req,res)=>{
    try {
        const userDataResponse = await fetch("https://api.github.com/users/GanpatHada");
        const userData = await userDataResponse.json();

        const filteredUserData = {
            name: userData.name,
            username: userData.login,
            avatar: userData.avatar_url,
            bio: userData.bio,
            location: userData.location,
            followers: userData.followers,
            following: userData.following,
            profile_url: userData.html_url
          };
        
        const userReposResponse = await fetch("https://api.github.com/users/GanpatHada/repos");
        userRepos = await userReposResponse.json();

        const filteredRepos = userRepos.map(repo => ({
            name: repo.name,
            url: repo.html_url
          }));
        
        const response = { ...filteredUserData, repos: filteredRepos };
        return res.status(200).json(new ApiResponse(200,response,'user details fetched successfully'))
    } catch (error) {
        console.log(error);
        throw new ApiError(400,'unable to fetch user')
    }
})


const getGithubRepoData=asyncHandler(async(req,res)=>{
    const {repoName}=req.params;
    if(!repoName)
        throw new ApiError(400,'repo name is missing');
    try {
        const repoDataResponse=await fetch(`https://api.github.com/repos/GanpatHada/${repoName}`);
        if (repoDataResponse.status === 404) {
            throw new ApiError(404, 'Repository not found');
        }
        if (!repoDataResponse.ok) {
            throw new ApiError(repoDataResponse.status, 'GitHub API error');
        }
        const repoData=await repoDataResponse.json();
        return res.status(200).json(new ApiResponse(200,repoData,'repo details fetched successfully'))
    } catch (error) {
        console.log(error);
        throw new ApiError(400,'unable to fetch repo')
    }
})


const createGithubIssue = asyncHandler(async (req, res) => {
    const { title, body} = req.body;
    const {repoName}=req.params;


    if (!repoName) throw new ApiError(400, "repoName is required");
    if (!title) throw new ApiError(400, "Issue title is required");


    const authToken = process.env.GITHUB_TOKEN;
    try {
        const response = await fetch(`https://api.github.com/repos/GanpatHada/${repoName}/issues`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, body })
        });
        console.log(response);
        if(!response.ok)
            throw new ApiError(response.status || 400,response.statusText || "Not found ")
        const data = await response.json();
        return res.status(201).json(new ApiResponse(201, { 
            issue_url: data.html_url, 
            created_by: data.user?.login || "Anonymous"
        }, "Issue created successfully"));
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Error creating issue");
    }
});

module.exports={getGithubProfileData,getGithubRepoData,createGithubIssue}
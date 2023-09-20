# Choice of frameworks/database/third party apps
I have chosen to use the packages and database that I'm already familiar and comfortable with.
I have used dotenv to store the confidential details like passwords or secret keys.
I have also installed mongoose and chose mongodb as the database since the db design based on the requirements would be simple using no-sql.
Opted to use jsonwebtoken for token generation and verification and jest for testing since I also had experience on these.
Chose to install express-rate-limit for rate limiting and throttling since it's pretty simple and does the necessary job efficiently.

# Instructions on how to run the code and test scripts
- ensure .env is added to local folder
- Run "node server.js" to execute the codes 
    ( * means an optional parameter, %% means req header must have the token in the Authorization header, prefixed with "Bearer " )
    - POST /api/auth/signup       ::: req.body : { userName, password, * firstName, * lastName }  
    - POST /api/auth/login        ::: req.body : { userName, password }   
                --- Take note of token and userId (to be used in share feature) in response
    - GET /api/notes              ::: %%
    - GET /api/notes/:id          ::: %%
    - POST /api/notes             ::: %% ; req.body : { contents }   --- contents corresponds to note's text details
    - PUT /api/notes/:id          ::: %% ; req.body : { contents }
    - DELETE /api/notes/:id       ::: %%
    - POST /api/notes/:id/share   ::: %% ; req.body : { userName }  OR { userId }    --- if both are non-empty, userName will be used
    - GET /api/search?q=:query    ::: %%
- Run "jest" to execute the test script (In a separate terminal, while server.js is also active.)


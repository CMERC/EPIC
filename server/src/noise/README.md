# Noise detailed explanation 
**This explanation is created based on all refactoring done here: https://gitlab.epicready.com/epic/epic-vue/merge_requests/835**
## Step By Step for server side noise.
### Start
```
1. Noise Generation is Kicked off in noiseScheduler.js in ../server/src/jobs/       
   uses bull scheduler on a 5 minute interval.
```
### Initialization
```
2. On every 5 minute interval the startNoise() method is called inside generateNoise.js (../server/src/noise/generateNoise.js) and passes in the current workspace. The scheduler is run on every workspace.
    startNoise creates a new NoiseGenerator object with all default values.
```
### Get data
```
3. getNoiseProfiles() method is called.
    - Gets all isUserGenerated = false profiles
    - Gets all mapInts(any feed type, key value pairs. E.g. name: "feed_live", value: 10)
    - Gets all markovSource texts(source values to seed markov chains)
    - Gets mediaNoiseLevels(All options for noise)
    - Gets all media services
    - calls checkDB()
```
### Check Database for Requirements
```
4. checkDB() method is called.
    - This is to check the database for required data for noise to run. 
    - it will create the following if they do not exist:
        - Default mediaNoiseLevel values.
        - Default bounding location
        - Default services (Currently Twitter and Facebook)
        - Default feeds (Currently Live and Markov/Bot)
        - If all default values pass checks calls calcPercent()
```
### Assign Weights based on values
```
5. calcPercent() method is called.
    - iterates through the current mediaNoiseLevels.feeds values to sort by service values and feed types and stores values of each respective type in their own array.
    - uses libary 'random-weighted-choice'(https://www.npmjs.com/package/random-weighted-choice) to assign weights based on values for each feed. This is used to decide on a ranomdly weighted service and weighted feed that a new or existing post will be posted to.
    - calls generatePostCounts()
```
### Get Number of posts
```
6. generatePostCounts() method is called.
    - Takes the postRate stored in DB and divides by 12. Post rate is per hour. There are 12 5 minute intervals in an hour. PostRate/12 = post per 5 minutes
    - this post rate is then randomly increased or decreased by a random value between +/- 50% to get a post rate that varies over time randomly.
    - uses random-weighted-choice library to assign posts to live feed or markov feed.
    - calls getLiveFeedData() and/or postMarkovFeeds() if sources exist.
```
### Get data from live feed(Twitter)
```
7. getLiveFeedData() method is called.
    - Uses npm 'twitter' library (https://www.npmjs.com/package/twitter) 
    - setsTwitterStream()
        - Sets the values for the twitter stream that is about to be opened
        - Currently using locations and track parameters
        - futher information on filtering realtime tweets(https://developer.twitter.com/en/docs/tweets/filter-realtime/api-reference/post-statuses-filter.html)
        - further information on the parameters(https://developer.twitter.com/en/docs/tweets/filter-realtime/guides/basic-stream-parameters)
    - Open the twitter stream
    - Before saving a tweet the tweets is checked for: Being a retweet or if it is truncated.
    - If passes checks the tweet is parsed using the local URL helper in `server/src/utils/url.js` and has all mentions changed to a randomly generated username using library 'username-generator' (https://www.npmjs.com/package/username-generator)
    - checks for a media entity and saves the url if it exists(twitter returns values stored in event.entities.media)
    - Once enough tweets have been stored for the 5 minute interval the stream is ended with stream.destroy()
    -postLiveFeeds() is called
```
### Iterate through Posts and post all to DB
```
8. postLiveFeeds() and/or postMarkovFeeds() is called. 
    - uses values generated in getLiveFeedData and iterates through to create posts.
    - Generates a new profile 20% of the time, adds post to existing profile 80% of the time. (These values can be changed to whatever seems to work. 80/20 is just simple numbers that allow a roughly 5 posts per profile. Post per profile should average out to be equal to the following: (100 / % chance of a new profile). Given a 5% chance of a new profile 100/5 = 20 so roughly 20 posts per profile.
    - if a new profile calls createNewProfile() and passes post data
    - if an existing profile calls createPost() and passes post data

    -if postMarkovFeeds() is called it uses a similar method generating as many posts as the count calls for as in postLiveFeeds but instead of getting data from a twitter stream it uses the 'rita' libarary (https://www.npmjs.com/package/rita) to generate posts. Uses a given source text to generate posts.  This link explains markov chains in an excellent way.(http://setosa.io/ev/markov-chains/)
```
### Database logic and variable creation
```
9. createNewProfile()/createPost()
    - both of these methods result in the creation of post. 
    - createNewProfile calls createPost() at the end after creating a profile. 
    - createNewProfile uses libary 'faker' (https://www.npmjs.com/package/faker) to generate fake profile information. Profile is created and createPost() is called.
    - createPost() will always connect to an existing profile. If a targetProfile is passed as a parameter it will post to that target profile. A targetProfile is currently only passed in by the createNewProfile method. If null is passed for targetProfile. It will select a random profile given the service that the post will go to.
    - If the language of the destination profile is !== null this means the profile was given a specified language to be in. This will call translateText() to translate the post text.
    - variable is built depending on the given post data.
        - if a mediaUrl exists uses 'mime-types' library (https://www.npmjs.com/package/mime-types) to look up the mime type of the url
    - if mediaUrl or postLocation exists adds create for both values into the variables passed into the mutation.
```
## Other Libraries/functions
Translation
    - Noise translation uses `server/src/services/translate.js`.
    - By default translation is a no-op so generated noise continues without an external API.
    - Set `LIBRETRANSLATE_ENDPOINT` and optional `LIBRETRANSLATE_API_KEY` to enable translation through a compatible service.

helpers.js inside ../server/src/noise/helpers.js 
    - simply contains all queries used in generatenoise.js
    - contains value of .00000951. Needed for Faker.js library. This value is equal to 5 minutes. E.g. 5 Minutes === .00000951 of 1 year. 
        Used for generating random times for posts 5 minutes in the future.


## Tips
- its likely that if you are on cloud you will get timeout errors fairly often.
- If it is the first time running on a fresh database it will take a 2nd run before posts start getting scheduled. This means it would be possible to wait nearly 15 minutes maximum before seeing posts come in when including publishing. 
- Twitter params are fairly specific but in a simple format. The API docs they have cover it fairly well. 
- I believe there is currently an issue with noise on non-global workspaces. I confirmed with Sharon awhile back that it wasnt specific to noise. 



# Noise.Vue (frontend)
**This explanation is created based on all refactoring done here: https://gitlab.epicready.com/epic/epic-vue/merge_requests/867**

**Nearly all elements and values that populate this page are generated based off data in the database.**

## How the SVG works
**I followed this loosely to create my implementation https://medium.com/@heyoka/scratch-made-svg-donut-pie-charts-in-html5-2c587e935d72**
```
- Each section of the pie/donut graph is its own element. 
- I used a v-for on an array that was generated based on values stored in mediaNoiseLevels.
    stroke-dasharray value is in a format such as '65 35'. This would fill up 65% of the bar and leave 35% blank.
- Further, stroke-dashoffset must be set so that the initial starting point of each iterated            element is not the same. 
- The dashoffset starts at 25 and is increased by the % value of the previous element. 
    This is to make sure the next svg element will start at the end of the previous % and there is no overlapping.
- To do this lists with all services and their values are created and likewise for feeds. These individual lists are used to generate the sliders, their values, and all the graphs associated with them.
```

## Other Methods Described
### updateSliderArray()
```
- All sliders should total 100%
- This dynamically changes the other sliders values in a group to change relative to the new selected value.
- For 2 sliders it works simply as it will change the other value to be 100-the value you just selected.
- For more than 2 it will iterate through each slider and reduce or increase the remaining sliders values a proportional amount to what their old values were
    For Example: if 3 sliders were at values: 50, 30, 20 And the first slider was changed from 50 > 70. There would only be 30 remaining value left for the other 2 sliders. Given that, The 30 remaining will be proportionately assigned to the other 2 depending on what their values were. 
    The 2nd slider had a value of 30 which was originally 3/5ths of the remaining amount. Now that there are only 30 remining points it will now get 3/5s of that value. which is 18. 
    Given that the 2nd slider is given 18 and last slider will go through the same math and get 2/5ths of the remaining value which is 12. The new slider values will be 70, 18, 12
```

### addTag, deleteTag, updateTagString()
```
- addTag and deleteTag are self explanatory. They remove a specific value or push a new value to an array.
- updateTagString() will take the updated tag array and create a string that can be used by the twitter api.
```

### Saving Data
```
- All sliders are saved as soon as they are changed.
- Tag data and geojson bounding data are saved when the save button is pressed in either box.
```

## recentposts.vue
```
component located in ../src/shared/components/
- gets the 5 most recent posts and displays data.
- works with subscriptions. This should act as a live preview of incoming noise. 
```

## optionsNoise.vue
**The accepted File Types of markov sources are .csv and .txt**

**Markov sources should be only raw post text data and nothing else.** 
```
- You can navigate to this page by go to the developer section>beta features>noise
- We had not decided on a exact method of how we would want to upload Markov sources or edit values of bot profiles.
- You can change simple data about users where isUserGenerated === false. 
- You can set the default language of a profile here. 
- Allows deletion of a bot profile.
- This page is a little older and will need pagination when a large amount of profiles exist in the system. 
```






    

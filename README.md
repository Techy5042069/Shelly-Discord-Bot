# KOordinate
### A simple, bot that deals with Inventory , Crate , Crate keys , reedem, Invites to Keys and Rewards (probability based). Can by used for automating rewards for the server that does give things like Accounts , gift cards , subscription codes etc..


# note:
Run each instance for each server (each bot for each server), currently it's single server for one instance. Might be changed to multiserver per instance in the future.

# Usage
1. Download and extract the file, or You could run: `git clone https://github.com/Techy5042069/Shelly-Discord-Bot.git` and run `npm install`
2. create a `.env`file if you are not going to use `repl.it` or `heroku`
   - add the following line: `TOKEN="bot_token"`
   - change `bot_token` with your bot token
3. check `config.json` to values, though i recommend not to change any location values
	here are some current config.json file contents
 		
 	`"prefix" : "%"`

   	`"cooldownTime": "10"`  //In seconds

   	`"exceptionRole": "KOexception"` //name of the role that will be exception for the cooldown

   	`"botActivityChannel" :"865083859523993610` //(change necessary) channel where bot sends message in every 20 min to prevent from sleeping in heroku ( if the bot isn't gonna stop after inactivity , you can let it unchanged)

    `"botActivity" : "true"` //set to false if the bot isn't gonna stop after inactivity

    `"reedemFileLocation": "./data/reedemkey.json" `//used to store reedem keys added by admins

    `"invdir": "./data/invs/"` //inventory of user..

    `"enableUserMetaData" : "true"` //here meta data refers to the total num of keys the user have had check inv.js's end

   	`"rewardsDir" : "./data/rewards/"`  //reward directory where you store gift card codes etc.. (in txt file)

	`"probfile": "./data/prob.json"` //probability file location , but use.js has the main object 
    	
    `"channelDeleteTime" : "10"` //special condition when the user has a blocked dm , creates a new channel and deletes after 10 min

4. adding rewards :
 - head over to ./data/rewards/
 - create a new file , say gitcards.txt and add you cards (one reward / code at a line)
 	giftcards.txt : somegiftcardcode1
 					somegiftcardcode2
 					somegiftcardcode3
 - head over to use.js on ./commands/ , change the probability object as you like: 
	probability = {
		normal: {
			prob: [50],
			rewards: ['giftcard;1'],
		}
	}
		here, `normal` is the box/crate/key name (this should correspond what user are gonna use to open the box/crate) (default : %use normal)
		then `prob` and `rewards` must have same structure . (prob refers to probability ) . prob[] is probability array , rewards []  refers to reward for the corresponding probability. here in this case , it is read as, 

			> the probability of getting 1 giftcard (from giftcard.txt) while opening a normal box is 50%

	As mentioned , keep the structure as : `name_of_file;number_of_reward` and there must be a txt file with same `name_of_file` on `./data/rewards/name_of_file.txt` else the program will break

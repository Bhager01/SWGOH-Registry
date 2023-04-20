# SWGOH Registry
The SWGOH Registry is a database that stores a registration between a SWGOH allycode and Discord ID.  The code for the registry contains three main components:
 - [Fetch](#fetch)
 - [Register](#register)
 - Verify
 
## Fetch <a name="fetch"></a>
Fetch is designed to take in a parameter that identifies a user and returns the following object if the user is found:
 - allyCode (string)
 - discordId (string)
 - verified (boolean)
 - primary (boolean)

allyCode, discordId, & verified will always be returned while primary will only be returned if available.  Below is how to perform a fetch:

    const  data = {'user': ['561963325'],'endpoint':  'find'}
    const  Response = await 
    fetch("http://ec2-44-194-200-153.compute-1.amazonaws.com/api/database",
    {
        method:  "post",
        headers: {
            'api-key': 'XXXXXX', //Replace with your API key
            'Content-Type':  'application/json',
        },
        body:  JSON.stringify(data)
    })
The user field in the data object must be an array of strings.  Each string can be either an allycode or a Discord ID and the length of the array is limited to 50.  The api-key field in the header is a key assigned by me.  For more information about fetch, [click here](https://github.com/Bhager01/SWGOH-Registry/blob/main/FetchCode.js).
## Register <a name="register"></a>
Register utilizes a payload in the following format:

    const comlinkPayload = {"discordId": String(discordId), "method":"registration", "payload": {"allyCode": String(allyCode)}, "enums": false}    
    const comlinkHeaders = {    
	    "Content-Type": "application/json",    
	    "api-key": "XXXXXXXX" //replace with your API key
	}
DiscordId and allyCode are strings that represent the user registered.  The api-key field in the header is a key assigned by me.  Upon successful submission of this request to the registry, an object with the following properties is returned:

 - verified (boolean)
 - unlockedPlayerPortrait (object)
 - unlockedPlayerTitle (object)

The verified property is used to report if the user is already verified in the database.  The unlockedPlayerPortrait and unlockedPlayerTitle objects are used to create a Discord embed that the a player can use to verify (or reverify) their account.  The embed will look like what is shown below:
![Verification screen shot](https://i.postimg.cc/L8F5SgzN/Verification2.jpg)

For a complete implementation of the register function, check out the code [here](https://github.com/Bhager01/SWGOH-Registry/blob/main/RegistrationCode.js).

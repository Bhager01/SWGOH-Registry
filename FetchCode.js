/*This code is used to lookup a user by allycode or Discord ID.  The 'user' field is an array of either Discord IDs or allycodes as strings (up to 50).  If no results
are found, an empty array is returned.  Each item returned will include 3 fields:  allyCode, discordId, and verified./*

const data = {'user': ['561963325'],'endpoint': 'find'}

const Response =  await fetch("http://ec2-44-194-200-153.compute-1.amazonaws.com/api/database", {
    method: "post",
    headers: {
        'api-key': 'XXXXXXXXXX', //Replace with your API key
        "Authorization": "XXXXXXXXX",  //Replace with your API key
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
})

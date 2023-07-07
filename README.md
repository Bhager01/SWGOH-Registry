# SWGOH Registry
The SWGOH Registry is a database that stores a registration between a SWGOH allycode and Discord ID.  The code for the registry contains three main components:
 - [Fetch](#fetch)
 - [Register](#register)
 - [Verify](#verify)
 
## Fetch <a name="fetch"></a>
Fetch is designed to take in a parameter that identifies a user and returns the following object if the user is found:
 - allyCode (string)
 - discordId (string)
 - verified (boolean)
 - primary (boolean)

allyCode, discordId, & verified will always be returned while primary will only be returned if available.  Below is how to perform a fetch:

Javascript:
```javascript
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
```

Java (with Spring WebFlux):
```java
public class SwgohRegistryFetchRequest {
    public final String endpoint = "find";
    public final List<String> user;
}

public class SwgohRegistryFetchResponse {
    public String allyCode;
    public String discordId;
    public boolean verified;
    public boolean primary;
}

public Flux<SwgohRegistryFetchResponse> fetchRegistration() {
    return WebClient
      .create()
      .post()
      .uri( "http://ec2-44-194-200-153.compute-1.amazonaws.com/api/database" )
      .contentType( MediaType.APPLICATION_JSON )
      .header( "api-key", "XXXXXX" )  //Replace with your API key
      .bodyValue( new SwgohRegistryFetchRequest( List.of( "561963325" ) ) )
      .retrieve()
      .bodyToFlux( SwgohRegistryFetchResponse.class );
}
```

The user field in the data object must be an array of strings.  Each string can be either an allycode or a Discord ID and the length of the array is limited to 50.  The api-key field in the header is a key assigned by me.  For more information about fetch, [click here](https://github.com/Bhager01/SWGOH-Registry/blob/main/FetchCode.js).
## Register <a name="register"></a>
Register utilizes a payload in the following format:

Javascript:
```javascript
const comlinkPayload = {"discordId": String(discordId), "method":"registration", "payload": {"allyCode": String(allyCode)}, "enums": false}    
const  Response = await fetch("http://ec2-44-194-200-153.compute-1.amazonaws.com/api/comlink",
{
    method:  "post",
    headers: {
        'api-key': 'XXXXXX', //Replace with your API key
        'Content-Type':  'application/json',
    },
    body:  JSON.stringify(comlinkPayload)
})
```

Java:
```java
public class SwgohRegistryRegisterRequest {
    public final Payload payload;
    public final String discordId;
    public final String method = "registration";
    public final boolean enums = false;

    public SwgohRegistryRegisterRequest( String allyCode, String discordId ) {
        this.payload = new Payload( allyCode );
        this.discordId = discordId;
    }

    public static class Payload {
        public final String allyCode;

        public Payload( String allyCode ) {
            this.allyCode = allyCode;
        }
    }
}
```

DiscordId and allyCode are strings that represent the user being registered.  The api-key field in the header is a key assigned by me.  Upon successful submission of this request to the registry, an object with the following properties is returned:

 - verified (boolean)
 - unlockedPlayerPortrait (object)
 - unlockedPlayerTitle (object)

Java:
```java
public class SwgohRegistryRegisterResponse {
    public PlayerPortrait unlockedPlayerPortrait;
    public PlayerPortrait selectedPlayerPortrait;
    public PlayerTitle unlockedPlayerTitle;
    public PlayerTitle selectedPlayerTitle;
    public boolean verified;

    public static class PlayerPortrait {
        public String icon;
        public String name;
        public String id;
    }

    public static class PlayerTitle {
        public String name;
        public String id;
    }
}
```

The verified property is used to report if the user is already verified in the database.  The unlockedPlayerPortrait and unlockedPlayerTitle objects are used to create a Discord embed that the a player can use to verify (or reverify) their account.  The embed will look like what is shown below:
![Verification screen shot](https://i.postimg.cc/L8F5SgzN/Verification2.jpg)

For a complete implementation of the register function, check out the code [here](https://github.com/Bhager01/SWGOH-Registry/blob/main/RegistrationCode.js).

## Verify <a name="verify"></a>
Verify utilizes a payload in the following format:

Javascript:
```javascript
const comlinkPayload = {'discordId':interaction.user.id, "method":"verification", "primary":selectedValue, "payload": {"allyCode": String(allyCode)}, "enums": false}
const comlinkHeaders =
{    
    "Content-Type": "application/json",
    "api-key": "XXXXXXXXX" //replace with your API key    
}
```

Java:
```java
public class SwgohRegistryVerificationRequest {
    public final Payload payload;
    public final String discordId;
    public final boolean primary;
    public final String method = "verification";
    public final boolean enums = false;

    public SwgohRegistryVerificationRequest( String allyCode, String discordId, boolean primary ) {
        this.payload = new Payload( allyCode );
        this.discordId = discordId;
        this.primary = primary;
    }

    public static class Payload {
        public final String allyCode;
        
        public Payload( String allyCode ) {
            this.allyCode = allyCode;
        }
    }
}
```

DiscordId and allyCode are strings that represent the user being registered.  The api-key field in the header is a key assigned by me.  Primary is a field set by a select menu and is mainly used for users with multiple accounts.  Primary is processed as follows in the database:

 - If a user sets primary to yes, the registered account will have primary set to yes and  all the other registered accounts linked to this Discord ID will have primary set to no.
 - If a user sets primary to no, then the registered account will have primary set to no.
 - If a user registers without specifying yes or no, a check is made to see if the user already has any accounts registered. If they do not, the account being registered will have primary set to yes, otherwise primary will be set to no.

Upon successful submission of this request to the registry, an object with the following properties is returned:
 - verified (boolean)
 
Java:
```java
public class SwgohRegistryRegisterResponse {
    public boolean verified;
}
```

If the user correctly changed their portrait and title to what was specified in the embed displayed at registration, they will receive a confirmation that they have successfully verified their account, otherwise they will be asked to double check the title & portrait & try again.  For a complete implementation of verification check out the code for the [select menu](https://github.com/Bhager01/SWGOH-Registry/blob/main/SelectMenuCode.js) and the [button](https://github.com/Bhager01/SWGOH-Registry/blob/main/ButtonCode.js).

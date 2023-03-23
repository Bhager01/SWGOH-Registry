/*All of the code below should be placed at the end of your current registration function.  The payloads require the allyCode and discordId of the user that has
just registered.  It is also recommended that you utilize a retry mechanism with error handling for all API calls (await fetch("...."))  This code utilizes Discord
embeds and interactions./*

/*This block creates a payload and submits it to registry database.  If the user is sucessfully registered, one of 2 values will be returned to verifiedStatus
(notVerified or verified)*/
const databasePayload = {'allyCode': String(allyCode), 'discordId': String(discordId), 'verified': 'no', 'endpoint': 'upsert'}
const databaseResponse =  await fetch("http://ec2-44-194-200-153.compute-1.amazonaws.com/api/database", {
		method: "post",
		headers: {
        'api-key': 'XXXXXXXXXXXXX', //You will replace this with your API key
        "Authorization": "XXXXXXXXX",  //You will replace this with your API key
        'Content-Type': 'application/json',
		},
		body: JSON.stringify(databasePayload)
})
const verifiedStatus = await databaseResponse.json()


/*This block creates a payload and submits it to Comlink.  If the request is successfull, a random portrait and player title will be retunred in the
comlinkResponse*/
const comlinkPayload = {"payload": {"allyCode": String(allyCode)}, "enums": false}
const comlinkResponse = await fetch("http://ec2-44-194-200-153.compute-1.amazonaws.com/api/comlink", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "XXXXXXXXXXXX" //You will replace this with your API key
		},
		body: JSON.stringify(comlinkPayload),
})
const comlinkJSON = await comlinkResponse.json()

/*This next block displays the verification message as an embed to the user using the random portrait and title received above.  In the embedDescription, please
change the name to the name of your bot.*/
const row = new Discord.ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('Global_Verify_Button').setLabel('Verify').setStyle('Primary'));
let embedDescription
if(verifiedStatus == 'notVerified')
		embedDescription = "Mhanndalorian Bot is a participant in the SWGOH registry of allycodes & Discord IDs. To verify ownership of the allycode registered, "
		+ "set your in game title and portrait to what is shown below & then click verify.  Verification is optional, but ensures no one can register your allycode to "
		+ "a different ID in the registry."
else
		embedDescription = "Mhanndalorian Bot is a participant in the SWGOH registry of allycodes & Discord IDs.  This allycode is **already verified.** To reverify ownership of the allycode registered, "
		+ "set your in game title and portrait to what is shown below & then click verify.  Verification is optional, but ensures no one can register your allycode to "
		+ "a different ID in the registry."
const portraitURL = 'https://game-assets.swgoh.gg/' + comlinkJSON.unlockedPlayerPortrait.icon + '.png'
const verificationEmbed = new Discord.EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle("Registry Verification for " + String(allyCode))
		.setDescription(embedDescription)
		.addFields(
				{name: 'Title',    value: comlinkJSON.unlockedPlayerTitle.name,    inline: false},
				{name: 'Portrait', value: comlinkJSON.unlockedPlayerPortrait.name, inline: false},
		)
		.setImage(portraitURL)
		.setTimestamp()
await interaction.followUp({embeds: [verificationEmbed], components: [row], ephemeral: true});

/*All of the code below should be placed at the end of your current registration function.  It is recommended that you utilize a retry mechanism with error handling
for all API calls.  This code utilizes Discord embeds and interactions.  This code should only be presented to a user when they register themself (not when an officer
does registration for them)/*

/*This block creates a payload and submits it to comlink endpoint.  If sucessfull, an object will be retunred containing verification status, portrait,
and title data*/
const comlinkPayload = {"discordId": String(discordId), "method":"registration", "payload": {"allyCode": String(allyCode)}, "enums": false}
const comlinkHeaders = {
    "Content-Type": "application/json",
    "api-key": "XXXXXXXXXXXXXXXXXXXXXX"  //replace with your API key
}
//ComlinkFetch is my own function for doing API calls.  It has built in retry and error handling.  Use whatever method your currently have for API calls here.
const comlinkResponse = await ComlinkFetch("http://ec2-44-194-200-153.compute-1.amazonaws.com/api/comlink", comlinkHeaders, comlinkPayload)
if(comlinkResponse == 'Error')
{
    console.error("Error using Comlink to get portrait and title info in registration function.")
    return 0;
}

/*This next block displays the verification message as an embed to the user using the random portrait and title received above.  In the embedDescription, please
change Mhanndalorian Bot to the name of your bot.*/
const comlinkJSON = await comlinkResponse.json()
const row = new Discord.ActionRowBuilder()
.addComponents(
    new StringSelectMenuBuilder()
        .setCustomId('verify_options')
        .setPlaceholder('Set as primary account (Used if you have multiple accounts)')
        .setOptions([
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
        ])
)
const row2 = new Discord.ActionRowBuilder()
.addComponents(
    new ButtonBuilder()
      .setCustomId('Global_Verify_Button')
      .setLabel('Verify')
      .setStyle('Primary'),
  );

let embedDescription

if(comlinkJSON.verified == false)
    embedDescription = "Mhanndalorian Bot is a participant in the SWGOH registry of allycodes & Discord IDs. To verify ownership of the allycode registered, "
                    + "set your in game title and portrait to what is shown below & then click verify.  Verification is optional, but ensures no one can register your "
                    + " allycode to a different ID in the registry."
else
    embedDescription = "Mhanndalorian Bot is a participant in the SWGOH registry of allycodes & Discord IDs.  This allycode is **already verified.** To reverify ownership "
                    + " of the allycode registered, set your in game title and portrait to what is shown below & then click verify.  Verification is optional, but "
                    + "ensures no one can register your allycode to a different ID in the registry."

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

await interaction.followUp({embeds: [verificationEmbed], components: [row, row2], ephemeral: true});

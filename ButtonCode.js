/*The below code needs to be placed where you handle button interactions.  If you do not have any buttons, you can place if(interaction.isButton()) in the code where
you handle interactions.  The code below utilizes Discord interactions.  For any API calls, I recommend utilizing a retry with error catching mechanism.*/
if (interaction.isButton()) {
    if (interaction.customId === 'Global_Verify_Button') //ensure the below code only runs for SWGOH registery verify button
    {
        await interaction.deferUpdate({ephemeral: true })
        const embed = interaction.message.embeds[0]
        const allyCode = embed.title.replace(/\D/g, "")
        const verificationTitleName = embed.fields.find(field => field.name === "Title").value;
        const verificationPortraitName = embed.fields.find(field => field.name === "Portrait").value;

        const comlinkPayload = {"payload": {"allyCode": String(allyCode)}, "enums": false}
        const comlinkHeaders = {
            "Content-Type": "application/json",
            "Authorization": "XXXXXXXXXXXX"
        }
        
        //This fetch is used to get the current player title and portrait
        const comlinkResponse = await fetch("http://ec2-44-194-200-153.compute-1.amazonaws.com/api/comlink", {
            method: "post",
            headers: comlinkHeaders,
            body: JSON.stringify(comlinkPayload),
        })
        
        if(comlinkResponse == 'Error') //This line depends on your implementation.  I have a retry method that returns 'Error' if a non 2XX status code is returned.
        {
            await interaction.followUp({ content: 'Error when attempting to verify. Please click verify again.', ephemeral: true });
            console.error("Error contacting Comlink after verify was clicked.")
            return 0;
        }

        const comlinkJSON = await comlinkResponse.json()
        const verificationSuccess = (comlinkJSON.selectedPlayerTitle.name == verificationTitleName && comlinkJSON.selectedPlayerPortrait.name == verificationPortraitName)

        if(verificationSuccess == true) //player has set their portrait and allycode to the required values for verification
        {
            const databasePayload = {'allyCode':String(allyCode), 'discordId':interaction.user.id, 'verified':'yes', 'endpoint':'upsert'}
            const databaseHeaders = {
                'api-key': 'XXXXXXXXX',
                "Authorization": "XXXXXXXXX",
                'Content-Type': 'application/json',
            }            
            
            //This code updates the verified entry for user to yes
            const databaseResponse =  await fetch("http://ec2-44-194-200-153.compute-1.amazonaws.com/api/database", {
                method: "post",
                headers: databaseHeaders,
                body: JSON.stringify(databasePayload)
            })
            
            if(databaseResponse == 'Error') //This line depends on your implementation.  I have a retry method that returns 'Error' if a non 2XX status code is returned.
            {
                await interaction.followUp({ content: 'Error when attempting to verify. Please click verify again.', ephemeral: true });
                console.error("Error setting verified to yes after user clicked verify button")
                return 0;
            }

            const row = new Discord.ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('Global_Verify_Button').setLabel('Verify').setStyle('Primary').setDisabled(true));
            await interaction.editReply({ components: [row] })
            await interaction.followUp({ content: 'You have been sucessfully verified!', ephemeral: true });
        }

        else
            await interaction.followUp({ content: 'Unable to verify. Please double check you have set the correct title & portrait & then click verify again.', ephemeral: true });
    }
}

/*The below code needs to be placed where you handle button interactions.  If you do not have any buttons, you can place if(interaction.isButton()) in the code where
you handle interactions.  The code below utilizes Discord interactions.  For any API calls, I recommend utilizing a retry with error catching mechanism.*/
if (interaction.isButton()) {
    if (interaction.customId === 'Global_Verify_Button')
    {
        await interaction.deferUpdate({ephemeral: true })
        const row = new Discord.ActionRowBuilder()
                .addComponents(new ButtonBuilder().setCustomId('Global_Verify_Button').setLabel('Verify').setStyle('Secondary').setDisabled(true));
        await interaction.editReply({ components: [row] });
        
        const embed = interaction.message.embeds[0]
        const allyCode = embed.title.replace(/\D/g, "")
        const comlinkPayload = {'discordId':interaction.user.id, "method":"verification", "payload": {"allyCode": String(allyCode)}, "enums": false}
        const comlinkHeaders = {
            "Content-Type": "application/json",
            "Authorization": "XXXXXXXXXXXX" //replace with your API key
        }
        //ComlinkFetch is my own function for doing API calls.  It has built in retry and error handling.  Use whatever method your currently have for API calls here.
        const comlinkResponse = await ComlinkFetch("http://ec2-44-194-200-153.compute-1.amazonaws.com/api/comlink", comlinkHeaders, comlinkPayload)

        if(comlinkResponse == 'Error')
        {
            await interaction.followUp({ content: 'Error when attempting to verify. Please click verify again.', ephemeral: true });
            console.error("Error contacting Comlink after verify was clicked.")
            return 0;
        }

        const comlinkJSON = await comlinkResponse.json()
        if(comlinkJSON == 'verified')
        {
            await interaction.followUp({ content: 'You have been sucessfully verified!', ephemeral: true });
        }
        else
        {
            const row = new Discord.ActionRowBuilder()
                .addComponents(new ButtonBuilder().setCustomId('Global_Verify_Button').setLabel('Verify').setStyle('Primary').setDisabled(false));
            await interaction.editReply({ components: [row] });
            await interaction.followUp({ content: 'Unable to verify. Please double check you have set the correct title & portrait & then "
            + "click verify again.', ephemeral: true });
        }
    }
}

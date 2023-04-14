/*The below code needs to be placed where you handle button interactions.  If you do not have any buttons, you can place if(interaction.isButton()) in the code where
you handle interactions.  The code below utilizes Discord interactions.  For any API calls, I recommend utilizing a retry with error catching mechanism.*/
if (interaction.isButton()) {
    if (interaction.customId === 'Global_Verify_Button')
    {
        await interaction.deferUpdate({ephemeral: true })
        const updatedSelectMenu = interaction.message.components[0].components[0];
        let selectedValue

        if(updatedSelectMenu.options.find(option => option.default) == undefined)
            selectedValue = "nil"
        else
            selectedValue = updatedSelectMenu.options.find(option => option.default).value

        const embed = interaction.message.embeds[0]
        const allyCode = embed.title.replace(/\D/g, "")
        const comlinkPayload = {'discordId':interaction.user.id, "method":"verification", "primary":selectedValue, "payload": {"allyCode": String(allyCode)}, "enums": false}
        const comlinkHeaders = {
            "Content-Type": "application/json",
            "api-key": "XXXXXXXXX" //replace with your API key
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
        if(comlinkJSON.verified == true)
        {  
            const row2 = new Discord.ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('Global_Verify_Button')
                    .setLabel('Verify')
                    .setStyle('Primary')
                    .setDisabled(true));
            
            const row = new Discord.ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('verify_options')
                .setPlaceholder('Set as primary account (Used if you have multiple accounts)')
                .setOptions([
                    { label: 'Yes', value: 'true'},
                    { label: 'No', value: 'false'},
                ])
                .setDisabled(true)
            )

            await interaction.editReply({ components: [row,row2] })
            await interaction.followUp({ content: 'You have been sucessfully verified!', ephemeral: true });
        }

        else
            await interaction.followUp({ content: 'Unable to verify. Please double check you have set the correct title & portrait & then click verify again.', ephemeral: true });
    }
}

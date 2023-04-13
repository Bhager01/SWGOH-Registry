if(interaction.isStringSelectMenu())
{
    if(interaction.customId === 'verify_options')
    {
        const selectedValue = interaction.values[0];
        const row = new Discord.ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('verify_options')
                .setPlaceholder('Set as primary account (Used if you have multiple accounts)')
                .setOptions([
                    { label: 'Yes', value: 'yes', default: selectedValue === 'yes'},
                    { label: 'No', value: 'no', default: selectedValue === 'no'},
                ])
            )

        const row2 = new Discord.ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('Global_Verify_Button')
                .setLabel('Verify')
                .setStyle('Primary'),
            );    

        await interaction.update({ components: [row, row2], ephemeral: true });
    }
}

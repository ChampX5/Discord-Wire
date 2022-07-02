const inviteButtons = document.getElementsByClassName('invite');
const voteButtons = document.getElementsByClassName('vote');

for (const button of inviteButtons) {
	button.addEventListener('click', () => {
		open(
			'https://discord.com/api/oauth2/authorize?client_id=913291646823727135&scope=applications.commands+bot&permissions=272454'
		);
	});
}

for (const button of voteButtons) {
    button.addEventListener('click', () => {
        open('vote link here');
    });
}

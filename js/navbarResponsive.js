const navbar = document.querySelector('.navbar');
const navBtns = document.querySelectorAll('.navBtns');
const burger = document.querySelector('.burger');

burger.addEventListener('click', () => {
	if (navbar.style.height === '260px') {
		navbar.style.height = '100px';

		navBtns.forEach((btn) => {
			btn.style.display = 'none';
		});
	} else {
        navbar.style.height = '260px';

		navBtns.forEach((btn) => {
			btn.style.display = 'block';
		});
	}
});

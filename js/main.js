/* global document, window, requestAnimationFrame*/

const swipeCards = {
	init(selector) {
		console.log('\nthis:', 'init', '\n');
		let cards = document.querySelectorAll(selector);
		Array.from(cards).forEach(card => {
			swipeCards.attachListener(card);
			console.log('\nthis:', 'attach', '\n');
		});
	},
	attachListener(card) {
		function onPointerDown({screenX: mouseX}) {
			const onPointerMove = swipeCards.followPointer(card, mouseX);
			swipeCards.listenForPointerRelease(card, onPointerMove);
		}

		card.addEventListener('mousedown', onPointerDown);
	},
	followPointer(card, mouseXStart) {
		function onPointerMove({screenX: mouseX}) {
			let updatedX = mouseX - mouseXStart;
			swipeCards.updateCardX(card, updatedX);
		}

		card.addEventListener('mousemove', onPointerMove);
		return onPointerMove;
	},
	listenForPointerRelease(card, onPointerMove) {
		function onPointerUp() {
			swipeCards.cardEnd(card);
			card.removeEventListener('mousemove', onPointerMove);
			card.removeEventListener('mouseup', onPointerUp);
		}
		card.addEventListener('mouseup', onPointerUp);
	},
	shouldReset(card, amount) {
		const cardWidth = parseInt(window.getComputedStyle(card).width);
		return Math.abs(amount) < cardWidth / 2;
	},
	animateToZero(card, x) {
		x += (0 - x) / 10;
		console.log('\nthis:', x, '\n');
		swipeCards.updateCardX(card, x);

		if (Math.round(x) !== 0) {
			requestAnimationFrame(() => swipeCards.animateToZero(card, x));
		}
	},
	dismiss(card, x, opacity = 1.0) {
		const target = x > 0 ? screen.width : -screen.width;
		x += (target - x) / 20;

		opacity += (0.1 - opacity) / 5;
		swipeCards.updateCardX(card, x);

		card.style.opacity = opacity;

		if (Math.round(x) !== target) {
			requestAnimationFrame(() => swipeCards.dismiss(card, x, opacity));
		}
	},
	cardEnd(card) {
		const transform = window.getComputedStyle(card).transform;
		const x = parseInt(transform.split(',')[4], 10);
		if (Number.isInteger(x)) {
			if (swipeCards.shouldReset(card, x)) {
				console.log('', 'resetting', '\n');
				swipeCards.animateToZero(card, x);
			} else {
				swipeCards.dismiss(card, x);
			}
		}
	},
	updateCardX(card, x) {
		card.style.transform = `translateX(${x}px)`;
	}
};

function start() {
	swipeCards.init('.demo-card-wide');
}

window.onload = start;
const getStats = () => {
	const likesEl = document.querySelector('[aria-label^="like this video along with"]') || document.querySelector('[aria-label$="likes"]') ;
	const viewsEl = document.querySelector('#above-the-fold #description-inner tp-yt-paper-tooltip #tooltip');

	if (!viewsEl || !likesEl) return null;

	const views = viewsEl.innerText.split("views")[0];
	const likes = likesEl.getAttribute("aria-label");

    if (views.includes("watching now")) return null;
	return {
		likes: likes.replace(/\D/g, '') * 1,
		views: views.replace(/\D/g, '') * 1,
		viewsEl,
		likesEl,
	};
};

function showStats({ likes, views }) {
	const percentage = (100 * likes / views).toFixed(2);
	const likeDiv = document.querySelector('#top-row #actions #segmented-like-button yt-button-shape button div:nth-child(2)');
	let span = likeDiv.querySelector('span.yt-like-to-view-ratio')
	if (!span) {
		span = document.createElement('span');
        span.classList.add('yt-like-to-view-ratio');
		span.style['padding'] = '0 0.6em';
		span.style['font-weight'] = 'bold';
		likeDiv.append(span);

        likeDiv.parentElement.addEventListener('click', () => showStats({likes, views}));
	}
	span.innerText = `(${percentage}%)`
}

let holdBackTimer = null;
function hodlBack() {
	if (window.location.href.indexOf("watch?") >= 0) {
		clearInterval(holdBackTimer);
		holdBackTimer = setInterval(() => {
			const stats = getStats();

			if (stats) {
				clearInterval(holdBackTimer);
				holdBackTimer = null;
				showStats(stats);
			}
		}, 150);
	}
}

hodlBack();
document.addEventListener("yt-navigate-finish", hodlBack);

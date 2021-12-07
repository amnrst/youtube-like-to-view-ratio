console.log("***********************");

const getStats = () => {
	const infoEl = document.querySelector("ytd-video-primary-info-renderer");
	if (!infoEl) return null;

	const viewsEl = infoEl.querySelector("ytd-video-view-count-renderer .view-count");
	const likesEl = infoEl.querySelector('yt-formatted-string[aria-label~="likes"]');

	if (!viewsEl || !likesEl) return null;

	const views = viewsEl.innerText;
	const likes = likesEl.getAttribute("aria-label");

	return {
		likes: likes.replace(/\D/g, '') | 0,
		views: views.replace(/\D/g, '') | 0,
		viewsEl,
		likesEl,
	};
};

function showStats({ likes, views, likesEl }) {
	const percentage = (100 * likes/views).toFixed(2);
	let span = likesEl.querySelector('span');
	if(!span) {
		span = document.createElement('span');
		span.style['padding'] = '0 0.6em';
		likesEl.prepend(span);
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

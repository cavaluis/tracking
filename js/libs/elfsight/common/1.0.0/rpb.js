const removeElfsightLogo = () => {
    document.querySelectorAll('a[href*="elfsight.com"]').forEach(el => el.remove());
};
const elfsightObserver = new MutationObserver(() => removeElfsightLogo());
elfsightObserver.observe(document.body, { childList: true, subtree: true });

setInterval(removeElfsightLogo, 3000);
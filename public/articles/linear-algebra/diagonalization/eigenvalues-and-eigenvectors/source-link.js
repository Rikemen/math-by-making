(() => {
    const getSafeGithubUrl = (value) => {
        if (!value) return null;

        try {
            const url = new URL(value);
            if (url.protocol !== 'https:' || url.hostname !== 'github.com') return null;
            return url.href;
        } catch {
            return null;
        }
    };

    const renderSourceLink = (link, githubUrl) => {
        const safeUrl = getSafeGithubUrl(githubUrl);

        if (!safeUrl) {
            link.hidden = true;
            link.removeAttribute('href');
            link.removeAttribute('target');
            link.removeAttribute('rel');
            return;
        }

        link.href = safeUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.hidden = false;
    };

    globalThis.MathByMakingSourceLink = Object.freeze({ renderSourceLink });

    const link = document.getElementById('source-link');
    const metadata = document.querySelector('meta[name="article:github-url"]');
    if (link) renderSourceLink(link, metadata ? metadata.content : undefined);
})();

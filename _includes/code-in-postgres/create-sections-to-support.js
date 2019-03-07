function headingToCssDefaultCssClass(s) {
    return s.toLowerCase().replace(/[^a-z0-9]/g,'-');
}

process(
    document.querySelector('div.post-content'),
    2,
    function(s) { return ['section', headingToCssDefaultCssClass(s)]; }
);

Array.from(document.querySelectorAll('div.post-content section')).forEach(
    function(section) {
        process(
            section,
            3,
            function(s) {
                let r = [headingToCssDefaultCssClass(s)];
                if (
                    (s.toLowerCase().match(/^pro/)) ||
                    (s.toLowerCase().match(/^con/))
                ) {
                    return r.concat(s.toLowerCase().substring(0, 3));
                }
                return r;
            }
        );
    }
);


Array.from(document.querySelectorAll('div.post-content section section.libraries')).forEach(
    function(section) {

        function grabFnWithoutExt(s) {
            return s.replace(/.*\//, '')
                .replace(/\.[a-z]+$/, '')
                .toLowerCase()
                .replace(/\-/g, '');
        }

        process(
            section,
            4,
            function(s) {
                let r = [
                    headingToCssDefaultCssClass(s),
                    'sql-splitting-image'
                ];
                if (grabFnWithoutExt(s) == grabFnWithoutExt(window.top.location.pathname)) {
                    r.push('open');
                }
                return r;
            }
        );
    }
);


function bindOpenToggle(h4) {
    h4.addEventListener(
        'click',
        (evt) => {
            evt.preventDefault()
            const par = evt.target.parentElement;
            if (par.classList.contains('open')) {
                par.classList.remove('open');
            } else {
                par.classList.add('open');
            }
        }
    );
}

Array.from(document.querySelectorAll('div.post-content section section.libraries h4')).map(bindOpenToggle);

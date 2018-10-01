function headingToCssDefaultCssClass(s) {
    return s.toLowerCase().replace(/[^a-z0-9]/,'-');
}

process(
    document.querySelector('div.post-content'),
    2,
    function(s) {
        console.log(s);
        if (['js', 'sql'].indexOf(s.toLowerCase()) > -1) {
            return [
                'tabbable',
                'code-compare',
                'code-compare-' + headingToCssDefaultCssClass(s),
                headingToCssDefaultCssClass(s),
                'pro-con-holder'
            ];
        }
        return ['tabbable', headingToCssDefaultCssClass(s)];
    }
);

Array.from(document.querySelectorAll('div.post-content section.pro-con-holder')).forEach(
    function(proConHolder) {
        process(
            proConHolder,
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


/**
 * Remove all elements within `<mainElement>` and put them into `<section>` with
 * class names based on the <hX> header elements textContent.
 *
 * @param mainElement The element to process and put sections in, you should use
 *        `document.querySelector()` or similar to acquire.
 * @param headerLevel The number of the header, for example `2` would cause it to
 *        use `<h2>` elements to create `<section>`.
 * @param sectionClassModifier Function that takes the `textContent of the `<hX>`
 *        element and returns a list of class names that will be added to the
 *        newly created `<section>`.
 */
function process(mainElement, headerLevel, sectionClassModifier) {


  function headingToCssDefaultCssClass(s) {
    return s.toLowerCase().replace(/[^a-z0-9]/g,'-');
  }

  /**
   * Trims whitespace from start and end of a string
   *
   * @param s The string to process
   */
  function trim(s) {
      return s.replace(/^\s+/, '').replace(/^\s+/, '');
  }

  /**
   * Given a list of class names, creates a `<section>` element with those
   * classes and a data element telling you the original header.
   */
  function createSection(classes, fullHeader) {
    var e = document.createElement('section');
    classes.forEach(function(c) { console.log(c); e.classList.add(headingToCssDefaultCssClass(c)); });
    e.dataset.heading = fullHeader;
    return e;
  }


  /**
   * Reducer that goes over your chosen element and puts elements into <sections>
   *
   * * Until the first `<hX>` tag items are added to `acc.children`.
   * * When a `<hX>` element is found a `<section>` element is created in
   *  `acc.current`.
   * * Subsequent `item` are added into the `<section>` at `acc.current`
   * * Until the next `<hX>` is found in `item` when we move the `acc.current`
   *   into `acc.children` and go back to second step
   *
   * This, once the reducer has finished probably leaves a `<section>` in
   * `acc.current` which will need to be tidied up.
   *
   * NOTE: Is EVIL in that it screws with the DOM, removing all elements and
   * not putting them back!
   *
   * @param acc {current: null|<section>, children: <any-tag>[]}
   * @param item <any-tag>
   */
  function reducer(acc, nItem) {
    var item = nItem[1];

    item.parentElement.removeChild(item);

    if (item && item.tagName && (item.tagName == 'H' + headerLevel)) {
      acc = {
        current: createSection(
          sectionClassModifier(trim(item.textContent)),
          item.textContent
        ),
        children: acc.children.concat(acc.current ? acc.current : [])
      };
    }

    if (acc.current == null) {
      return { current: null, children: acc.children.concat([item]) };
    }

    acc.current.appendChild(item);
    return acc;
  }


  // Run the reducer.
  var acc = Array.from(mainElement.childNodes.entries()).reduce(
      reducer,
      {current: null, children: []}
  );


  // Process `acc` putting the elements back into the DOM.
  return acc.children // Everything is in `acc.children` except...
      .concat(acc.current ? acc.current : []) // Probably is a left over `<section>` in `acc.current`.
      .forEach(function(e) { // Add all the pre `<`hX> and `<`section> back into the DOM.
          mainElement.appendChild(e);
      });

}

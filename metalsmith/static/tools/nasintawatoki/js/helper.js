var Helper = {};

Helper.DOM = {
    /**
     * Helper function for creating a DOM element with a full set of attributes and styles.
     *
     * @param tag           the xml tag
     * @param attributes    a key-value object with attributes
     * @param styles        a key-value object with css styles
     * @param namespace     an optional namespace string
     * @returns {Element}   the DOM element
     */
    createNewElement: function (tag, attributes, styles, namespace) {
        const element = namespace ? document.createElementNS(namespace, tag) : document.createElement(tag);

        if (attributes) {
            for (let attribute in attributes) {
                if (!attributes.hasOwnProperty(attribute)) {
                    continue;
                }
                if (attributes[attribute].ns) {
                    element.setAttributeNS(attributes[attribute].ns, attribute, attributes[attribute].value);
                } else {
                    element.setAttribute(attribute, attributes[attribute]);
                }
            }
        }
        if (styles) {
            for (let style in styles) {
                if (styles.hasOwnProperty(style)) {
                    element.style[style] = styles[style];
                }
            }
        }
        return element;
    },

    /**
     * Helper function for creating a DOM element with a full set of attributes and styles.
     *
     * @returns {Element}   the DOM element
     */
    createElements: function (element) {

        let result = {
            dict: {},
            root: this.createNewElement(element.tag, element.attributes, element.styles, element.namespace)
        };

        if (element.innerHTML) {
            result.root.innerHTML = element.innerHTML;
        }
        if (element.ref) {
            result.dict[element.ref] = result.root;
        }
        if (element.children) {
            element.children.forEach(function (child) {
                let childResult = Helper.DOM.createElements(child);
                result.root.appendChild(childResult.root);
                result.dict = Helper.Collections.Set.update(result.dict, childResult.dict);
            });
        }

        return result;
    }

};

Helper.Collections = {
    /**
     * Shuffles array in place. ES6 version
     * @param {Array} a items An array containing the items.
     */
    shuffle: function (a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },

    Set: {
        fromArray: function (arr) {
            let s = {};
            arr.forEach(function (a) {
                s[a] = s[a] ? s[a] + 1 : 1;
            });
            return s;
        },

        difference: function (a, b) {
            let s = {};
            for (var key in a) {
                if (a.hasOwnProperty(key)) {
                    if (!b[key]) {
                        s[key] = a[key];
                    }
                }
            }
            return s;
        },

        update: function (a, b) {
            let s = {};
            let key;
            for (key in a) {
                if (a.hasOwnProperty(key)) {
                    s[key] = a[key];
                }
            }
            for (key in b) {
                if (b.hasOwnProperty(key)) {
                    s[key] = b[key];
                }
            }
            return s;
        }
    }
};

Helper.Data = {

    loadJSON: function (url) {
        return new Promise(function (resolve, reject) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
            xobj.onreadystatechange = function () {
                if (xobj.readyState == 4 && xobj.status == "200") {
                    // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                    resolve(JSON.parse(xobj.responseText));
                }
            };
            xobj.send(null);
        });
    }
};

Helper.Strings = {

    lehvenStein: (function () {

        function _min(d0, d1, d2, bx, ay) {
            return d0 < d1 || d2 < d1
                ? d0 > d2
                    ? d2 + 1
                    : d0 + 1
                : bx === ay
                    ? d1
                    : d1 + 1;
        }

        return function (a, b) {
            if (a === b) {
                return 0;
            }

            if (a.length > b.length) {
                var tmp = a;
                a = b;
                b = tmp;
            }

            var la = a.length;
            var lb = b.length;

            while (la > 0 && (a.charCodeAt(la - 1) === b.charCodeAt(lb - 1))) {
                la--;
                lb--;
            }

            var offset = 0;

            while (offset < la && (a.charCodeAt(offset) === b.charCodeAt(offset))) {
                offset++;
            }

            la -= offset;
            lb -= offset;

            if (la === 0 || lb < 3) {
                return lb;
            }

            var x = 0;
            var y;
            var d0;
            var d1;
            var d2;
            var d3;
            var dd;
            var dy;
            var ay;
            var bx0;
            var bx1;
            var bx2;
            var bx3;

            var vector = [];

            for (y = 0; y < la; y++) {
                vector.push(y + 1);
                vector.push(a.charCodeAt(offset + y));
            }

            var len = vector.length - 1;

            for (; x < lb - 3;) {
                bx0 = b.charCodeAt(offset + (d0 = x));
                bx1 = b.charCodeAt(offset + (d1 = x + 1));
                bx2 = b.charCodeAt(offset + (d2 = x + 2));
                bx3 = b.charCodeAt(offset + (d3 = x + 3));
                dd = (x += 4);
                for (y = 0; y < len; y += 2) {
                    dy = vector[y];
                    ay = vector[y + 1];
                    d0 = _min(dy, d0, d1, bx0, ay);
                    d1 = _min(d0, d1, d2, bx1, ay);
                    d2 = _min(d1, d2, d3, bx2, ay);
                    dd = _min(d2, d3, dd, bx3, ay);
                    vector[y] = dd;
                    d3 = d2;
                    d2 = d1;
                    d1 = d0;
                    d0 = dy;
                }
            }

            for (; x < lb;) {
                bx0 = b.charCodeAt(offset + (d0 = x));
                dd = ++x;
                for (y = 0; y < len; y += 2) {
                    dy = vector[y];
                    vector[y] = dd = _min(dy, d0, dd, bx0, vector[y + 1]);
                    d0 = dy;
                }
            }

            return dd;
        };
    })(),

    lzw_encode: function (s) {
        if (!s) return s;
        var dict = new Map(); // Use a Map!
        var data = (s + "").split("");
        var out = [];
        var currChar;
        var phrase = data[0];
        var code = 256;
        for (var i = 1; i < data.length; i++) {
            currChar = data[i];
            if (dict.has(phrase + currChar)) {
                phrase += currChar;
            } else {
                out.push(phrase.length > 1 ? dict.get(phrase) : phrase.charCodeAt(0));
                dict.set(phrase + currChar, code);
                code++;
                phrase = currChar;
            }
        }
        out.push(phrase.length > 1 ? dict.get(phrase) : phrase.charCodeAt(0));
        console.log(out);
        for (var i = 0; i < out.length; i++) {
            out[i] = String.fromCharCode(out[i]);
        }
        console.log(out);
        return out.join("");
    },

    lzw_decode: function (s) {
        var dict = new Map(); // Use a Map!
        var data = (s + "").split("");
        var currChar = data[0];
        var oldPhrase = currChar;
        var out = [currChar];
        var code = 256;
        var phrase;
        for (var i = 1; i < data.length; i++) {
            var currCode = data[i].charCodeAt(0);
            if (currCode < 256) {
                phrase = data[i];
            } else {
                phrase = dict.has(currCode) ? dict.get(currCode) : (oldPhrase + currChar);
            }
            out.push(phrase);
            currChar = phrase.charAt(0);
            dict.set(code, oldPhrase + currChar);
            code++;
            oldPhrase = phrase;
        }
        return out.join("");
    }

};
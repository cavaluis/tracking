var t = localStorage.getItem("ThriveCart");
if (t) {
    t = JSON.parse(t);
if (t && t.User && t.User.value && t.User.value.passthrough && t.User.value.passthrough[window._thrive.product.idx] ) {
    t = t.User.value.passthrough[window._thrive.product.idx];
    } else {
    t = {};
    }
} else {
    t = {};
}
const urlParams = new URLSearchParams(window.location.search);
var u = false;
if (["checkout"].indexOf(window._context.page_mode) !== -1) {
    if (urlParams.size > 0) {
        var p = new URLSearchParams()
for (const [name, value] of (new URLSearchParams(window.location.search)).entries()) {
        if (t[name.replace(/^passthrough\[|\]$/g, '')] !== value) {
    u = true; // Si no coincide, establece la bandera en true
        }
p.set(name.replace(/^passthrough\[|\]$/g, ''), value);
p.set('passthrough[' + name.replace(/^passthrough\[|\]$/g, '') + ']', value);
        }
try {
    history.replaceState({}, document.title, window.location.origin + window.location.pathname + '?' + p.toString())
} catch (e) { }
    }
}

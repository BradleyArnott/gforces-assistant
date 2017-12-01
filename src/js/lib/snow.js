Date.now || (Date.now = function () {
        return (new Date).getTime()
    }),
    function () {
        "use strict";
        for (var t = ["webkit", "moz"], i = 0; i < t.length && !window.requestAnimationFrame; ++i) {
            var e = t[i];
            window.requestAnimationFrame = window[e + "RequestAnimationFrame"], window.cancelAnimationFrame = window[e + "CancelAnimationFrame"] || window[e + "CancelRequestAnimationFrame"]
        }
        if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
            var n = 0;
            window.requestAnimationFrame = function (t) {
                var i = Date.now(),
                    e = Math.max(n + 16, i);
                return setTimeout(function () {
                    t(n = e)
                }, e - i)
            }, window.cancelAnimationFrame = clearTimeout
        }
    }(),
    function (t, i, e, n) {
        function s(i, e) {
            o = this, this.element = i, this._name = h, this._defaults = t.fn[h].defaults, this.options = t.extend({}, this._defaults, e), this.init()
        }
        var o, h = "letItSnow",
            a = function (t, i) {
                return Math.round(t + Math.random() * (i - t))
            },
            r = function (t, i) {
                for (var e in i) t.style[e] = i[e] + ("width" == e || "height" == e ? "px" : "")
            };
        t.extend(s.prototype, {
            init: function () {
                this.buildCache(), this.bindEvents(), this.drawCanvas();
                var t = function () {
                    o.repeater = requestAnimationFrame(t), o.drawParticles()
                };
                if (this.options.content.match(/\.(jpg|gif|png)/g)) {
                    var i = new Image;
                    i.onload = function () {
                        o.image = i, t()
                    }, i.src = this.options.content
                } else t()
            },
            drawParticles: function () {
                this.context.clearRect(0, 0, this.elWidth, this.elHeight), "function" == typeof this.options.content && "random" == this.options.particleColor || (this.context.fillStyle = this.options.particleColor, this.context.beginPath());
                for (var t = 0; t < this.mp; t++) {
                    var i = this.particles[t];
                    "random" === this.options.particleColor && (this.context.fillStyle = i.c, this.context.beginPath()), this.context.moveTo(i.x, i.y), "function" == typeof this.options.content ? this.options.content(i, this) : "" != this.options.content ? this.options.content.match(/\.(jpg|gif|png)/g) ? this.context.drawImage(this.image, i.x, i.y, i.r, i.r) : (this.context.font = i.r + "pt Arial", this.context.fillText(this.options.content, i.x, i.y)) : this.context.arc(i.x, i.y, i.r, 0, 2 * Math.PI, !0), "random" === this.options.particleColor && this.context.fill()
                }
                "function" == typeof this.options.content && "random" == this.options.particleColor || this.context.fill(), this.updateParticles()
            },
            updateParticles: function () {
                this.angle += .01;
                for (var t = 0; t < this.mp; t++) {
                    var i = this.particles[t],
                        e = this.options.movementX ? Math.cos(this.angle + i.d) + 1 + i.s / 2 : i.s,
                        n = i.x > this.elWidth + 5 || i.x < -5 || i.y > this.elHeight;
                    if (i.x += this.options.movementX ? Math.sin(this.angle) * this.options.movementX : 0, "up" == this.options.direction ? i.y -= e : i.y += e, "up" == this.options.direction && (n = i.x > this.elWidth + 5 || i.x < -5 || i.y < 0), n)
                        if (t % 3 > 0) {
                            var s = -10;
                            "up" == this.options.direction && (s = this.elHeight + 10), this.particles[t] = {
                                x: Math.random() * this.elWidth,
                                y: s,
                                r: i.r,
                                d: i.d,
                                s: i.s,
                                c: this.colors[a(0, this.colors.length - 1)]
                            }
                        } else this.options.movementX && (Math.sin(this.angle) > 0 ? this.particles[t] = {
                            x: -5,
                            y: Math.random() * this.elHeight,
                            r: i.r,
                            d: i.d,
                            s: i.s,
                            c: this.colors[a(0, this.colors.length - 1)]
                        } : this.particles[t] = {
                            x: this.elWidth + 5,
                            y: Math.random() * this.elHeight,
                            r: i.r,
                            d: i.d,
                            s: i.s,
                            c: this.colors[a(0, this.colors.length - 1)]
                        })
                }
            },
            drawCanvas: function () {
                var i = e.createElement("canvas"),
                    n = t.extend({}, {
                        "pointer-events": "none"
                    }, this.options.styles);
                this.canvas = this.element.appendChild(i), r(this.canvas, n), this.context = this.canvas.getContext("2d"), this.canvas.width = this.elWidth, this.canvas.height = this.elHeight
            },
            destroy: function () {
                this.angle = 0, this.particles = [], this.canvas.remove(), this.unbindEvents(), this.$element.removeData()
            },
            buildCache: function () {
                this.colors = this.options.colors, this.angle = 0, this.mp = this.options.maxParticles, this.particles = [], this.elHeight = o.element.clientHeight, this.elWidth = o.element.offsetWidth, this.$element = t(this.element);
                for (var i = 0; i < this.mp; i++) this.particles.push({
                    x: Math.random() * this.elWidth,
                    y: Math.random() * this.elHeight,
                    r: a(100 * this.options.minSize, 100 * this.options.maxSize) / 100,
                    d: Math.random() * this.mp,
                    c: this.colors[a(0, this.colors.length - 1)],
                    s: a(this.options.minSpeed, this.options.maxSpeed)
                })
            },
            bindEvents: function () {
                var t = this;
                i.addEventListener("resize", function () {
                    t.elHeight = t.element.clientHeight, t.elWidth = t.element.offsetWidth, t.canvas.width = t.elWidth, t.canvas.height = t.elHeight
                }, !0)
            },
            unbindEvents: function () {
                i.removeEventListener("resize")
            }
        }), t.fn[h] = function (i) {
            return this.each(function () {
                t.data(this, "plugin_" + h) || t.data(this, "plugin_" + h, new s(this, i))
            }), this
        }, t.fn[h].defaults = {
            maxParticles: 35,
            styles: {
                position: "fixed",
                "z-index": "99999",
                top: 0,
                left: 0
            },
            particleColor: "#ffffff",
            movementX: !1,
            minSize: 1,
            maxSize: 5,
            minSpeed: 1,
            maxSpeed: 5,
            content: "",
            direction: "down",
            colors: ["#00ffff", "#f0ffff", "#f5f5dc", "#0000ff", "#a52a2a", "#00ffff", "#00008b"]
        }
    }(jQuery, window, document);
//# sourceMappingURL=letItSnowCanvas.js.map

$('body').letItSnow({
    particleColor : '#b5e3f1',
    minSize: 5,
    maxSize : 20,
    content: '❄'
});

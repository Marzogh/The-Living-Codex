(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // vendor/jszip.min.js
  var require_jszip_min = __commonJS({
    "vendor/jszip.min.js"(exports, module) {
      !(function(e) {
        if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
        else if ("function" == typeof define && define.amd) define([], e);
        else {
          ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).JSZip = e();
        }
      })(function() {
        return (function s(a, o, h) {
          function u(r, e2) {
            if (!o[r]) {
              if (!a[r]) {
                var t = "function" == typeof __require && __require;
                if (!e2 && t) return t(r, true);
                if (l) return l(r, true);
                var n = new Error("Cannot find module '" + r + "'");
                throw n.code = "MODULE_NOT_FOUND", n;
              }
              var i = o[r] = { exports: {} };
              a[r][0].call(i.exports, function(e3) {
                var t2 = a[r][1][e3];
                return u(t2 || e3);
              }, i, i.exports, s, a, o, h);
            }
            return o[r].exports;
          }
          for (var l = "function" == typeof __require && __require, e = 0; e < h.length; e++) u(h[e]);
          return u;
        })({ 1: [function(e, t, r) {
          "use strict";
          var d = e("./utils"), c = e("./support"), p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
          r.encode = function(e2) {
            for (var t2, r2, n, i, s, a, o, h = [], u = 0, l = e2.length, f = l, c2 = "string" !== d.getTypeOf(e2); u < e2.length; ) f = l - u, n = c2 ? (t2 = e2[u++], r2 = u < l ? e2[u++] : 0, u < l ? e2[u++] : 0) : (t2 = e2.charCodeAt(u++), r2 = u < l ? e2.charCodeAt(u++) : 0, u < l ? e2.charCodeAt(u++) : 0), i = t2 >> 2, s = (3 & t2) << 4 | r2 >> 4, a = 1 < f ? (15 & r2) << 2 | n >> 6 : 64, o = 2 < f ? 63 & n : 64, h.push(p.charAt(i) + p.charAt(s) + p.charAt(a) + p.charAt(o));
            return h.join("");
          }, r.decode = function(e2) {
            var t2, r2, n, i, s, a, o = 0, h = 0, u = "data:";
            if (e2.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url.");
            var l, f = 3 * (e2 = e2.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
            if (e2.charAt(e2.length - 1) === p.charAt(64) && f--, e2.charAt(e2.length - 2) === p.charAt(64) && f--, f % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
            for (l = c.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < e2.length; ) t2 = p.indexOf(e2.charAt(o++)) << 2 | (i = p.indexOf(e2.charAt(o++))) >> 4, r2 = (15 & i) << 4 | (s = p.indexOf(e2.charAt(o++))) >> 2, n = (3 & s) << 6 | (a = p.indexOf(e2.charAt(o++))), l[h++] = t2, 64 !== s && (l[h++] = r2), 64 !== a && (l[h++] = n);
            return l;
          };
        }, { "./support": 30, "./utils": 32 }], 2: [function(e, t, r) {
          "use strict";
          var n = e("./external"), i = e("./stream/DataWorker"), s = e("./stream/Crc32Probe"), a = e("./stream/DataLengthProbe");
          function o(e2, t2, r2, n2, i2) {
            this.compressedSize = e2, this.uncompressedSize = t2, this.crc32 = r2, this.compression = n2, this.compressedContent = i2;
          }
          o.prototype = { getContentWorker: function() {
            var e2 = new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")), t2 = this;
            return e2.on("end", function() {
              if (this.streamInfo.data_length !== t2.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
            }), e2;
          }, getCompressedWorker: function() {
            return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
          } }, o.createWorkerFrom = function(e2, t2, r2) {
            return e2.pipe(new s()).pipe(new a("uncompressedSize")).pipe(t2.compressWorker(r2)).pipe(new a("compressedSize")).withStreamInfo("compression", t2);
          }, t.exports = o;
        }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, t, r) {
          "use strict";
          var n = e("./stream/GenericWorker");
          r.STORE = { magic: "\0\0", compressWorker: function() {
            return new n("STORE compression");
          }, uncompressWorker: function() {
            return new n("STORE decompression");
          } }, r.DEFLATE = e("./flate");
        }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, t, r) {
          "use strict";
          var n = e("./utils");
          var o = (function() {
            for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
              e2 = r2;
              for (var n2 = 0; n2 < 8; n2++) e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
              t2[r2] = e2;
            }
            return t2;
          })();
          t.exports = function(e2, t2) {
            return void 0 !== e2 && e2.length ? "string" !== n.getTypeOf(e2) ? (function(e3, t3, r2, n2) {
              var i = o, s = n2 + r2;
              e3 ^= -1;
              for (var a = n2; a < s; a++) e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3[a])];
              return -1 ^ e3;
            })(0 | t2, e2, e2.length, 0) : (function(e3, t3, r2, n2) {
              var i = o, s = n2 + r2;
              e3 ^= -1;
              for (var a = n2; a < s; a++) e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3.charCodeAt(a))];
              return -1 ^ e3;
            })(0 | t2, e2, e2.length, 0) : 0;
          };
        }, { "./utils": 32 }], 5: [function(e, t, r) {
          "use strict";
          r.base64 = false, r.binary = false, r.dir = false, r.createFolders = true, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
        }, {}], 6: [function(e, t, r) {
          "use strict";
          var n = null;
          n = "undefined" != typeof Promise ? Promise : e("lie"), t.exports = { Promise: n };
        }, { lie: 37 }], 7: [function(e, t, r) {
          "use strict";
          var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array, i = e("pako"), s = e("./utils"), a = e("./stream/GenericWorker"), o = n ? "uint8array" : "array";
          function h(e2, t2) {
            a.call(this, "FlateWorker/" + e2), this._pako = null, this._pakoAction = e2, this._pakoOptions = t2, this.meta = {};
          }
          r.magic = "\b\0", s.inherits(h, a), h.prototype.processChunk = function(e2) {
            this.meta = e2.meta, null === this._pako && this._createPako(), this._pako.push(s.transformTo(o, e2.data), false);
          }, h.prototype.flush = function() {
            a.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], true);
          }, h.prototype.cleanUp = function() {
            a.prototype.cleanUp.call(this), this._pako = null;
          }, h.prototype._createPako = function() {
            this._pako = new i[this._pakoAction]({ raw: true, level: this._pakoOptions.level || -1 });
            var t2 = this;
            this._pako.onData = function(e2) {
              t2.push({ data: e2, meta: t2.meta });
            };
          }, r.compressWorker = function(e2) {
            return new h("Deflate", e2);
          }, r.uncompressWorker = function() {
            return new h("Inflate", {});
          };
        }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, t, r) {
          "use strict";
          function A(e2, t2) {
            var r2, n2 = "";
            for (r2 = 0; r2 < t2; r2++) n2 += String.fromCharCode(255 & e2), e2 >>>= 8;
            return n2;
          }
          function n(e2, t2, r2, n2, i2, s2) {
            var a, o, h = e2.file, u = e2.compression, l = s2 !== O.utf8encode, f = I.transformTo("string", s2(h.name)), c = I.transformTo("string", O.utf8encode(h.name)), d = h.comment, p = I.transformTo("string", s2(d)), m = I.transformTo("string", O.utf8encode(d)), _ = c.length !== h.name.length, g = m.length !== d.length, b = "", v = "", y = "", w = h.dir, k = h.date, x = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
            t2 && !r2 || (x.crc32 = e2.crc32, x.compressedSize = e2.compressedSize, x.uncompressedSize = e2.uncompressedSize);
            var S = 0;
            t2 && (S |= 8), l || !_ && !g || (S |= 2048);
            var z = 0, C = 0;
            w && (z |= 16), "UNIX" === i2 ? (C = 798, z |= (function(e3, t3) {
              var r3 = e3;
              return e3 || (r3 = t3 ? 16893 : 33204), (65535 & r3) << 16;
            })(h.unixPermissions, w)) : (C = 20, z |= (function(e3) {
              return 63 & (e3 || 0);
            })(h.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B(f), 4) + c, b += "up" + A(v.length, 2) + v), g && (y = A(1, 1) + A(B(p), 4) + m, b += "uc" + A(y.length, 2) + y);
            var E = "";
            return E += "\n\0", E += A(S, 2), E += u.magic, E += A(a, 2), E += A(o, 2), E += A(x.crc32, 4), E += A(x.compressedSize, 4), E += A(x.uncompressedSize, 4), E += A(f.length, 2), E += A(b.length, 2), { fileRecord: R.LOCAL_FILE_HEADER + E + f + b, dirRecord: R.CENTRAL_FILE_HEADER + A(C, 2) + E + A(p.length, 2) + "\0\0\0\0" + A(z, 4) + A(n2, 4) + f + b + p };
          }
          var I = e("../utils"), i = e("../stream/GenericWorker"), O = e("../utf8"), B = e("../crc32"), R = e("../signature");
          function s(e2, t2, r2, n2) {
            i.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t2, this.zipPlatform = r2, this.encodeFileName = n2, this.streamFiles = e2, this.accumulate = false, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
          }
          I.inherits(s, i), s.prototype.push = function(e2) {
            var t2 = e2.meta.percent || 0, r2 = this.entriesCount, n2 = this._sources.length;
            this.accumulate ? this.contentBuffer.push(e2) : (this.bytesWritten += e2.data.length, i.prototype.push.call(this, { data: e2.data, meta: { currentFile: this.currentFile, percent: r2 ? (t2 + 100 * (r2 - n2 - 1)) / r2 : 100 } }));
          }, s.prototype.openedSource = function(e2) {
            this.currentSourceOffset = this.bytesWritten, this.currentFile = e2.file.name;
            var t2 = this.streamFiles && !e2.file.dir;
            if (t2) {
              var r2 = n(e2, t2, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
              this.push({ data: r2.fileRecord, meta: { percent: 0 } });
            } else this.accumulate = true;
          }, s.prototype.closedSource = function(e2) {
            this.accumulate = false;
            var t2 = this.streamFiles && !e2.file.dir, r2 = n(e2, t2, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            if (this.dirRecords.push(r2.dirRecord), t2) this.push({ data: (function(e3) {
              return R.DATA_DESCRIPTOR + A(e3.crc32, 4) + A(e3.compressedSize, 4) + A(e3.uncompressedSize, 4);
            })(e2), meta: { percent: 100 } });
            else for (this.push({ data: r2.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
            this.currentFile = null;
          }, s.prototype.flush = function() {
            for (var e2 = this.bytesWritten, t2 = 0; t2 < this.dirRecords.length; t2++) this.push({ data: this.dirRecords[t2], meta: { percent: 100 } });
            var r2 = this.bytesWritten - e2, n2 = (function(e3, t3, r3, n3, i2) {
              var s2 = I.transformTo("string", i2(n3));
              return R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(e3, 2) + A(e3, 2) + A(t3, 4) + A(r3, 4) + A(s2.length, 2) + s2;
            })(this.dirRecords.length, r2, e2, this.zipComment, this.encodeFileName);
            this.push({ data: n2, meta: { percent: 100 } });
          }, s.prototype.prepareNextSource = function() {
            this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
          }, s.prototype.registerPrevious = function(e2) {
            this._sources.push(e2);
            var t2 = this;
            return e2.on("data", function(e3) {
              t2.processChunk(e3);
            }), e2.on("end", function() {
              t2.closedSource(t2.previous.streamInfo), t2._sources.length ? t2.prepareNextSource() : t2.end();
            }), e2.on("error", function(e3) {
              t2.error(e3);
            }), this;
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), true) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), true));
          }, s.prototype.error = function(e2) {
            var t2 = this._sources;
            if (!i.prototype.error.call(this, e2)) return false;
            for (var r2 = 0; r2 < t2.length; r2++) try {
              t2[r2].error(e2);
            } catch (e3) {
            }
            return true;
          }, s.prototype.lock = function() {
            i.prototype.lock.call(this);
            for (var e2 = this._sources, t2 = 0; t2 < e2.length; t2++) e2[t2].lock();
          }, t.exports = s;
        }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, t, r) {
          "use strict";
          var u = e("../compressions"), n = e("./ZipFileWorker");
          r.generateWorker = function(e2, a, t2) {
            var o = new n(a.streamFiles, t2, a.platform, a.encodeFileName), h = 0;
            try {
              e2.forEach(function(e3, t3) {
                h++;
                var r2 = (function(e4, t4) {
                  var r3 = e4 || t4, n3 = u[r3];
                  if (!n3) throw new Error(r3 + " is not a valid compression method !");
                  return n3;
                })(t3.options.compression, a.compression), n2 = t3.options.compressionOptions || a.compressionOptions || {}, i = t3.dir, s = t3.date;
                t3._compressWorker(r2, n2).withStreamInfo("file", { name: e3, dir: i, date: s, comment: t3.comment || "", unixPermissions: t3.unixPermissions, dosPermissions: t3.dosPermissions }).pipe(o);
              }), o.entriesCount = h;
            } catch (e3) {
              o.error(e3);
            }
            return o;
          };
        }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, t, r) {
          "use strict";
          function n() {
            if (!(this instanceof n)) return new n();
            if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
            this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
              var e2 = new n();
              for (var t2 in this) "function" != typeof this[t2] && (e2[t2] = this[t2]);
              return e2;
            };
          }
          (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.1", n.loadAsync = function(e2, t2) {
            return new n().loadAsync(e2, t2);
          }, n.external = e("./external"), t.exports = n;
        }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, t, r) {
          "use strict";
          var u = e("./utils"), i = e("./external"), n = e("./utf8"), s = e("./zipEntries"), a = e("./stream/Crc32Probe"), l = e("./nodejsUtils");
          function f(n2) {
            return new i.Promise(function(e2, t2) {
              var r2 = n2.decompressed.getContentWorker().pipe(new a());
              r2.on("error", function(e3) {
                t2(e3);
              }).on("end", function() {
                r2.streamInfo.crc32 !== n2.decompressed.crc32 ? t2(new Error("Corrupted zip : CRC32 mismatch")) : e2();
              }).resume();
            });
          }
          t.exports = function(e2, o) {
            var h = this;
            return o = u.extend(o || {}, { base64: false, checkCRC32: false, optimizedBinaryString: false, createFolders: false, decodeFileName: n.utf8decode }), l.isNode && l.isStream(e2) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : u.prepareContent("the loaded zip file", e2, true, o.optimizedBinaryString, o.base64).then(function(e3) {
              var t2 = new s(o);
              return t2.load(e3), t2;
            }).then(function(e3) {
              var t2 = [i.Promise.resolve(e3)], r2 = e3.files;
              if (o.checkCRC32) for (var n2 = 0; n2 < r2.length; n2++) t2.push(f(r2[n2]));
              return i.Promise.all(t2);
            }).then(function(e3) {
              for (var t2 = e3.shift(), r2 = t2.files, n2 = 0; n2 < r2.length; n2++) {
                var i2 = r2[n2], s2 = i2.fileNameStr, a2 = u.resolve(i2.fileNameStr);
                h.file(a2, i2.decompressed, { binary: true, optimizedBinaryString: true, date: i2.date, dir: i2.dir, comment: i2.fileCommentStr.length ? i2.fileCommentStr : null, unixPermissions: i2.unixPermissions, dosPermissions: i2.dosPermissions, createFolders: o.createFolders }), i2.dir || (h.file(a2).unsafeOriginalName = s2);
              }
              return t2.zipComment.length && (h.comment = t2.zipComment), h;
            });
          };
        }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("../stream/GenericWorker");
          function s(e2, t2) {
            i.call(this, "Nodejs stream input adapter for " + e2), this._upstreamEnded = false, this._bindStream(t2);
          }
          n.inherits(s, i), s.prototype._bindStream = function(e2) {
            var t2 = this;
            (this._stream = e2).pause(), e2.on("data", function(e3) {
              t2.push({ data: e3, meta: { percent: 0 } });
            }).on("error", function(e3) {
              t2.isPaused ? this.generatedError = e3 : t2.error(e3);
            }).on("end", function() {
              t2.isPaused ? t2._upstreamEnded = true : t2.end();
            });
          }, s.prototype.pause = function() {
            return !!i.prototype.pause.call(this) && (this._stream.pause(), true);
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), true);
          }, t.exports = s;
        }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, t, r) {
          "use strict";
          var i = e("readable-stream").Readable;
          function n(e2, t2, r2) {
            i.call(this, t2), this._helper = e2;
            var n2 = this;
            e2.on("data", function(e3, t3) {
              n2.push(e3) || n2._helper.pause(), r2 && r2(t3);
            }).on("error", function(e3) {
              n2.emit("error", e3);
            }).on("end", function() {
              n2.push(null);
            });
          }
          e("../utils").inherits(n, i), n.prototype._read = function() {
            this._helper.resume();
          }, t.exports = n;
        }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, t, r) {
          "use strict";
          t.exports = { isNode: "undefined" != typeof Buffer, newBufferFrom: function(e2, t2) {
            if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(e2, t2);
            if ("number" == typeof e2) throw new Error('The "data" argument must not be a number');
            return new Buffer(e2, t2);
          }, allocBuffer: function(e2) {
            if (Buffer.alloc) return Buffer.alloc(e2);
            var t2 = new Buffer(e2);
            return t2.fill(0), t2;
          }, isBuffer: function(e2) {
            return Buffer.isBuffer(e2);
          }, isStream: function(e2) {
            return e2 && "function" == typeof e2.on && "function" == typeof e2.pause && "function" == typeof e2.resume;
          } };
        }, {}], 15: [function(e, t, r) {
          "use strict";
          function s(e2, t2, r2) {
            var n2, i2 = u.getTypeOf(t2), s2 = u.extend(r2 || {}, f);
            s2.date = s2.date || /* @__PURE__ */ new Date(), null !== s2.compression && (s2.compression = s2.compression.toUpperCase()), "string" == typeof s2.unixPermissions && (s2.unixPermissions = parseInt(s2.unixPermissions, 8)), s2.unixPermissions && 16384 & s2.unixPermissions && (s2.dir = true), s2.dosPermissions && 16 & s2.dosPermissions && (s2.dir = true), s2.dir && (e2 = g(e2)), s2.createFolders && (n2 = _(e2)) && b.call(this, n2, true);
            var a2 = "string" === i2 && false === s2.binary && false === s2.base64;
            r2 && void 0 !== r2.binary || (s2.binary = !a2), (t2 instanceof c && 0 === t2.uncompressedSize || s2.dir || !t2 || 0 === t2.length) && (s2.base64 = false, s2.binary = true, t2 = "", s2.compression = "STORE", i2 = "string");
            var o2 = null;
            o2 = t2 instanceof c || t2 instanceof l ? t2 : p.isNode && p.isStream(t2) ? new m(e2, t2) : u.prepareContent(e2, t2, s2.binary, s2.optimizedBinaryString, s2.base64);
            var h2 = new d(e2, o2, s2);
            this.files[e2] = h2;
          }
          var i = e("./utf8"), u = e("./utils"), l = e("./stream/GenericWorker"), a = e("./stream/StreamHelper"), f = e("./defaults"), c = e("./compressedObject"), d = e("./zipObject"), o = e("./generate"), p = e("./nodejsUtils"), m = e("./nodejs/NodejsStreamInputAdapter"), _ = function(e2) {
            "/" === e2.slice(-1) && (e2 = e2.substring(0, e2.length - 1));
            var t2 = e2.lastIndexOf("/");
            return 0 < t2 ? e2.substring(0, t2) : "";
          }, g = function(e2) {
            return "/" !== e2.slice(-1) && (e2 += "/"), e2;
          }, b = function(e2, t2) {
            return t2 = void 0 !== t2 ? t2 : f.createFolders, e2 = g(e2), this.files[e2] || s.call(this, e2, null, { dir: true, createFolders: t2 }), this.files[e2];
          };
          function h(e2) {
            return "[object RegExp]" === Object.prototype.toString.call(e2);
          }
          var n = { load: function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, forEach: function(e2) {
            var t2, r2, n2;
            for (t2 in this.files) n2 = this.files[t2], (r2 = t2.slice(this.root.length, t2.length)) && t2.slice(0, this.root.length) === this.root && e2(r2, n2);
          }, filter: function(r2) {
            var n2 = [];
            return this.forEach(function(e2, t2) {
              r2(e2, t2) && n2.push(t2);
            }), n2;
          }, file: function(e2, t2, r2) {
            if (1 !== arguments.length) return e2 = this.root + e2, s.call(this, e2, t2, r2), this;
            if (h(e2)) {
              var n2 = e2;
              return this.filter(function(e3, t3) {
                return !t3.dir && n2.test(e3);
              });
            }
            var i2 = this.files[this.root + e2];
            return i2 && !i2.dir ? i2 : null;
          }, folder: function(r2) {
            if (!r2) return this;
            if (h(r2)) return this.filter(function(e3, t3) {
              return t3.dir && r2.test(e3);
            });
            var e2 = this.root + r2, t2 = b.call(this, e2), n2 = this.clone();
            return n2.root = t2.name, n2;
          }, remove: function(r2) {
            r2 = this.root + r2;
            var e2 = this.files[r2];
            if (e2 || ("/" !== r2.slice(-1) && (r2 += "/"), e2 = this.files[r2]), e2 && !e2.dir) delete this.files[r2];
            else for (var t2 = this.filter(function(e3, t3) {
              return t3.name.slice(0, r2.length) === r2;
            }), n2 = 0; n2 < t2.length; n2++) delete this.files[t2[n2].name];
            return this;
          }, generate: function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, generateInternalStream: function(e2) {
            var t2, r2 = {};
            try {
              if ((r2 = u.extend(e2 || {}, { streamFiles: false, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = r2.type.toLowerCase(), r2.compression = r2.compression.toUpperCase(), "binarystring" === r2.type && (r2.type = "string"), !r2.type) throw new Error("No output type specified.");
              u.checkSupport(r2.type), "darwin" !== r2.platform && "freebsd" !== r2.platform && "linux" !== r2.platform && "sunos" !== r2.platform || (r2.platform = "UNIX"), "win32" === r2.platform && (r2.platform = "DOS");
              var n2 = r2.comment || this.comment || "";
              t2 = o.generateWorker(this, r2, n2);
            } catch (e3) {
              (t2 = new l("error")).error(e3);
            }
            return new a(t2, r2.type || "string", r2.mimeType);
          }, generateAsync: function(e2, t2) {
            return this.generateInternalStream(e2).accumulate(t2);
          }, generateNodeStream: function(e2, t2) {
            return (e2 = e2 || {}).type || (e2.type = "nodebuffer"), this.generateInternalStream(e2).toNodejsStream(t2);
          } };
          t.exports = n;
        }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, t, r) {
          "use strict";
          t.exports = e("stream");
        }, { stream: void 0 }], 17: [function(e, t, r) {
          "use strict";
          var n = e("./DataReader");
          function i(e2) {
            n.call(this, e2);
            for (var t2 = 0; t2 < this.data.length; t2++) e2[t2] = 255 & e2[t2];
          }
          e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
            return this.data[this.zero + e2];
          }, i.prototype.lastIndexOfSignature = function(e2) {
            for (var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.length - 4; 0 <= s; --s) if (this.data[s] === t2 && this.data[s + 1] === r2 && this.data[s + 2] === n2 && this.data[s + 3] === i2) return s - this.zero;
            return -1;
          }, i.prototype.readAndCheckSignature = function(e2) {
            var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.readData(4);
            return t2 === s[0] && r2 === s[1] && n2 === s[2] && i2 === s[3];
          }, i.prototype.readData = function(e2) {
            if (this.checkOffset(e2), 0 === e2) return [];
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, t, r) {
          "use strict";
          var n = e("../utils");
          function i(e2) {
            this.data = e2, this.length = e2.length, this.index = 0, this.zero = 0;
          }
          i.prototype = { checkOffset: function(e2) {
            this.checkIndex(this.index + e2);
          }, checkIndex: function(e2) {
            if (this.length < this.zero + e2 || e2 < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e2 + "). Corrupted zip ?");
          }, setIndex: function(e2) {
            this.checkIndex(e2), this.index = e2;
          }, skip: function(e2) {
            this.setIndex(this.index + e2);
          }, byteAt: function() {
          }, readInt: function(e2) {
            var t2, r2 = 0;
            for (this.checkOffset(e2), t2 = this.index + e2 - 1; t2 >= this.index; t2--) r2 = (r2 << 8) + this.byteAt(t2);
            return this.index += e2, r2;
          }, readString: function(e2) {
            return n.transformTo("string", this.readData(e2));
          }, readData: function() {
          }, lastIndexOfSignature: function() {
          }, readAndCheckSignature: function() {
          }, readDate: function() {
            var e2 = this.readInt(4);
            return new Date(Date.UTC(1980 + (e2 >> 25 & 127), (e2 >> 21 & 15) - 1, e2 >> 16 & 31, e2 >> 11 & 31, e2 >> 5 & 63, (31 & e2) << 1));
          } }, t.exports = i;
        }, { "../utils": 32 }], 19: [function(e, t, r) {
          "use strict";
          var n = e("./Uint8ArrayReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
            this.checkOffset(e2);
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, t, r) {
          "use strict";
          var n = e("./DataReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
            return this.data.charCodeAt(this.zero + e2);
          }, i.prototype.lastIndexOfSignature = function(e2) {
            return this.data.lastIndexOf(e2) - this.zero;
          }, i.prototype.readAndCheckSignature = function(e2) {
            return e2 === this.readData(4);
          }, i.prototype.readData = function(e2) {
            this.checkOffset(e2);
            var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, t, r) {
          "use strict";
          var n = e("./ArrayReader");
          function i(e2) {
            n.call(this, e2);
          }
          e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
            if (this.checkOffset(e2), 0 === e2) return new Uint8Array(0);
            var t2 = this.data.subarray(this.zero + this.index, this.zero + this.index + e2);
            return this.index += e2, t2;
          }, t.exports = i;
        }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("../support"), s = e("./ArrayReader"), a = e("./StringReader"), o = e("./NodeBufferReader"), h = e("./Uint8ArrayReader");
          t.exports = function(e2) {
            var t2 = n.getTypeOf(e2);
            return n.checkSupport(t2), "string" !== t2 || i.uint8array ? "nodebuffer" === t2 ? new o(e2) : i.uint8array ? new h(n.transformTo("uint8array", e2)) : new s(n.transformTo("array", e2)) : new a(e2);
          };
        }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, t, r) {
          "use strict";
          r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\x07\b";
        }, {}], 24: [function(e, t, r) {
          "use strict";
          var n = e("./GenericWorker"), i = e("../utils");
          function s(e2) {
            n.call(this, "ConvertWorker to " + e2), this.destType = e2;
          }
          i.inherits(s, n), s.prototype.processChunk = function(e2) {
            this.push({ data: i.transformTo(this.destType, e2.data), meta: e2.meta });
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, t, r) {
          "use strict";
          var n = e("./GenericWorker"), i = e("../crc32");
          function s() {
            n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
          }
          e("../utils").inherits(s, n), s.prototype.processChunk = function(e2) {
            this.streamInfo.crc32 = i(e2.data, this.streamInfo.crc32 || 0), this.push(e2);
          }, t.exports = s;
        }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("./GenericWorker");
          function s(e2) {
            i.call(this, "DataLengthProbe for " + e2), this.propName = e2, this.withStreamInfo(e2, 0);
          }
          n.inherits(s, i), s.prototype.processChunk = function(e2) {
            if (e2) {
              var t2 = this.streamInfo[this.propName] || 0;
              this.streamInfo[this.propName] = t2 + e2.data.length;
            }
            i.prototype.processChunk.call(this, e2);
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, t, r) {
          "use strict";
          var n = e("../utils"), i = e("./GenericWorker");
          function s(e2) {
            i.call(this, "DataWorker");
            var t2 = this;
            this.dataIsReady = false, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = false, e2.then(function(e3) {
              t2.dataIsReady = true, t2.data = e3, t2.max = e3 && e3.length || 0, t2.type = n.getTypeOf(e3), t2.isPaused || t2._tickAndRepeat();
            }, function(e3) {
              t2.error(e3);
            });
          }
          n.inherits(s, i), s.prototype.cleanUp = function() {
            i.prototype.cleanUp.call(this), this.data = null;
          }, s.prototype.resume = function() {
            return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = true, n.delay(this._tickAndRepeat, [], this)), true);
          }, s.prototype._tickAndRepeat = function() {
            this._tickScheduled = false, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = true));
          }, s.prototype._tick = function() {
            if (this.isPaused || this.isFinished) return false;
            var e2 = null, t2 = Math.min(this.max, this.index + 16384);
            if (this.index >= this.max) return this.end();
            switch (this.type) {
              case "string":
                e2 = this.data.substring(this.index, t2);
                break;
              case "uint8array":
                e2 = this.data.subarray(this.index, t2);
                break;
              case "array":
              case "nodebuffer":
                e2 = this.data.slice(this.index, t2);
            }
            return this.index = t2, this.push({ data: e2, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
          }, t.exports = s;
        }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, t, r) {
          "use strict";
          function n(e2) {
            this.name = e2 || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = true, this.isFinished = false, this.isLocked = false, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
          }
          n.prototype = { push: function(e2) {
            this.emit("data", e2);
          }, end: function() {
            if (this.isFinished) return false;
            this.flush();
            try {
              this.emit("end"), this.cleanUp(), this.isFinished = true;
            } catch (e2) {
              this.emit("error", e2);
            }
            return true;
          }, error: function(e2) {
            return !this.isFinished && (this.isPaused ? this.generatedError = e2 : (this.isFinished = true, this.emit("error", e2), this.previous && this.previous.error(e2), this.cleanUp()), true);
          }, on: function(e2, t2) {
            return this._listeners[e2].push(t2), this;
          }, cleanUp: function() {
            this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
          }, emit: function(e2, t2) {
            if (this._listeners[e2]) for (var r2 = 0; r2 < this._listeners[e2].length; r2++) this._listeners[e2][r2].call(this, t2);
          }, pipe: function(e2) {
            return e2.registerPrevious(this);
          }, registerPrevious: function(e2) {
            if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
            this.streamInfo = e2.streamInfo, this.mergeStreamInfo(), this.previous = e2;
            var t2 = this;
            return e2.on("data", function(e3) {
              t2.processChunk(e3);
            }), e2.on("end", function() {
              t2.end();
            }), e2.on("error", function(e3) {
              t2.error(e3);
            }), this;
          }, pause: function() {
            return !this.isPaused && !this.isFinished && (this.isPaused = true, this.previous && this.previous.pause(), true);
          }, resume: function() {
            if (!this.isPaused || this.isFinished) return false;
            var e2 = this.isPaused = false;
            return this.generatedError && (this.error(this.generatedError), e2 = true), this.previous && this.previous.resume(), !e2;
          }, flush: function() {
          }, processChunk: function(e2) {
            this.push(e2);
          }, withStreamInfo: function(e2, t2) {
            return this.extraStreamInfo[e2] = t2, this.mergeStreamInfo(), this;
          }, mergeStreamInfo: function() {
            for (var e2 in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, e2) && (this.streamInfo[e2] = this.extraStreamInfo[e2]);
          }, lock: function() {
            if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
            this.isLocked = true, this.previous && this.previous.lock();
          }, toString: function() {
            var e2 = "Worker " + this.name;
            return this.previous ? this.previous + " -> " + e2 : e2;
          } }, t.exports = n;
        }, {}], 29: [function(e, t, r) {
          "use strict";
          var h = e("../utils"), i = e("./ConvertWorker"), s = e("./GenericWorker"), u = e("../base64"), n = e("../support"), a = e("../external"), o = null;
          if (n.nodestream) try {
            o = e("../nodejs/NodejsStreamOutputAdapter");
          } catch (e2) {
          }
          function l(e2, o2) {
            return new a.Promise(function(t2, r2) {
              var n2 = [], i2 = e2._internalType, s2 = e2._outputType, a2 = e2._mimeType;
              e2.on("data", function(e3, t3) {
                n2.push(e3), o2 && o2(t3);
              }).on("error", function(e3) {
                n2 = [], r2(e3);
              }).on("end", function() {
                try {
                  var e3 = (function(e4, t3, r3) {
                    switch (e4) {
                      case "blob":
                        return h.newBlob(h.transformTo("arraybuffer", t3), r3);
                      case "base64":
                        return u.encode(t3);
                      default:
                        return h.transformTo(e4, t3);
                    }
                  })(s2, (function(e4, t3) {
                    var r3, n3 = 0, i3 = null, s3 = 0;
                    for (r3 = 0; r3 < t3.length; r3++) s3 += t3[r3].length;
                    switch (e4) {
                      case "string":
                        return t3.join("");
                      case "array":
                        return Array.prototype.concat.apply([], t3);
                      case "uint8array":
                        for (i3 = new Uint8Array(s3), r3 = 0; r3 < t3.length; r3++) i3.set(t3[r3], n3), n3 += t3[r3].length;
                        return i3;
                      case "nodebuffer":
                        return Buffer.concat(t3);
                      default:
                        throw new Error("concat : unsupported type '" + e4 + "'");
                    }
                  })(i2, n2), a2);
                  t2(e3);
                } catch (e4) {
                  r2(e4);
                }
                n2 = [];
              }).resume();
            });
          }
          function f(e2, t2, r2) {
            var n2 = t2;
            switch (t2) {
              case "blob":
              case "arraybuffer":
                n2 = "uint8array";
                break;
              case "base64":
                n2 = "string";
            }
            try {
              this._internalType = n2, this._outputType = t2, this._mimeType = r2, h.checkSupport(n2), this._worker = e2.pipe(new i(n2)), e2.lock();
            } catch (e3) {
              this._worker = new s("error"), this._worker.error(e3);
            }
          }
          f.prototype = { accumulate: function(e2) {
            return l(this, e2);
          }, on: function(e2, t2) {
            var r2 = this;
            return "data" === e2 ? this._worker.on(e2, function(e3) {
              t2.call(r2, e3.data, e3.meta);
            }) : this._worker.on(e2, function() {
              h.delay(t2, arguments, r2);
            }), this;
          }, resume: function() {
            return h.delay(this._worker.resume, [], this._worker), this;
          }, pause: function() {
            return this._worker.pause(), this;
          }, toNodejsStream: function(e2) {
            if (h.checkSupport("nodestream"), "nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method");
            return new o(this, { objectMode: "nodebuffer" !== this._outputType }, e2);
          } }, t.exports = f;
        }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, t, r) {
          "use strict";
          if (r.base64 = true, r.array = true, r.string = true, r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r.nodebuffer = "undefined" != typeof Buffer, r.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) r.blob = false;
          else {
            var n = new ArrayBuffer(0);
            try {
              r.blob = 0 === new Blob([n], { type: "application/zip" }).size;
            } catch (e2) {
              try {
                var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                i.append(n), r.blob = 0 === i.getBlob("application/zip").size;
              } catch (e3) {
                r.blob = false;
              }
            }
          }
          try {
            r.nodestream = !!e("readable-stream").Readable;
          } catch (e2) {
            r.nodestream = false;
          }
        }, { "readable-stream": 16 }], 31: [function(e, t, s) {
          "use strict";
          for (var o = e("./utils"), h = e("./support"), r = e("./nodejsUtils"), n = e("./stream/GenericWorker"), u = new Array(256), i = 0; i < 256; i++) u[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
          u[254] = u[254] = 1;
          function a() {
            n.call(this, "utf-8 decode"), this.leftOver = null;
          }
          function l() {
            n.call(this, "utf-8 encode");
          }
          s.utf8encode = function(e2) {
            return h.nodebuffer ? r.newBufferFrom(e2, "utf-8") : (function(e3) {
              var t2, r2, n2, i2, s2, a2 = e3.length, o2 = 0;
              for (i2 = 0; i2 < a2; i2++) 55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o2 += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
              for (t2 = h.uint8array ? new Uint8Array(o2) : new Array(o2), i2 = s2 = 0; s2 < o2; i2++) 55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
              return t2;
            })(e2);
          }, s.utf8decode = function(e2) {
            return h.nodebuffer ? o.transformTo("nodebuffer", e2).toString("utf-8") : (function(e3) {
              var t2, r2, n2, i2, s2 = e3.length, a2 = new Array(2 * s2);
              for (t2 = r2 = 0; t2 < s2; ) if ((n2 = e3[t2++]) < 128) a2[r2++] = n2;
              else if (4 < (i2 = u[n2])) a2[r2++] = 65533, t2 += i2 - 1;
              else {
                for (n2 &= 2 === i2 ? 31 : 3 === i2 ? 15 : 7; 1 < i2 && t2 < s2; ) n2 = n2 << 6 | 63 & e3[t2++], i2--;
                1 < i2 ? a2[r2++] = 65533 : n2 < 65536 ? a2[r2++] = n2 : (n2 -= 65536, a2[r2++] = 55296 | n2 >> 10 & 1023, a2[r2++] = 56320 | 1023 & n2);
              }
              return a2.length !== r2 && (a2.subarray ? a2 = a2.subarray(0, r2) : a2.length = r2), o.applyFromCharCode(a2);
            })(e2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2));
          }, o.inherits(a, n), a.prototype.processChunk = function(e2) {
            var t2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2.data);
            if (this.leftOver && this.leftOver.length) {
              if (h.uint8array) {
                var r2 = t2;
                (t2 = new Uint8Array(r2.length + this.leftOver.length)).set(this.leftOver, 0), t2.set(r2, this.leftOver.length);
              } else t2 = this.leftOver.concat(t2);
              this.leftOver = null;
            }
            var n2 = (function(e3, t3) {
              var r3;
              for ((t3 = t3 || e3.length) > e3.length && (t3 = e3.length), r3 = t3 - 1; 0 <= r3 && 128 == (192 & e3[r3]); ) r3--;
              return r3 < 0 ? t3 : 0 === r3 ? t3 : r3 + u[e3[r3]] > t3 ? r3 : t3;
            })(t2), i2 = t2;
            n2 !== t2.length && (h.uint8array ? (i2 = t2.subarray(0, n2), this.leftOver = t2.subarray(n2, t2.length)) : (i2 = t2.slice(0, n2), this.leftOver = t2.slice(n2, t2.length))), this.push({ data: s.utf8decode(i2), meta: e2.meta });
          }, a.prototype.flush = function() {
            this.leftOver && this.leftOver.length && (this.push({ data: s.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
          }, s.Utf8DecodeWorker = a, o.inherits(l, n), l.prototype.processChunk = function(e2) {
            this.push({ data: s.utf8encode(e2.data), meta: e2.meta });
          }, s.Utf8EncodeWorker = l;
        }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, t, a) {
          "use strict";
          var o = e("./support"), h = e("./base64"), r = e("./nodejsUtils"), u = e("./external");
          function n(e2) {
            return e2;
          }
          function l(e2, t2) {
            for (var r2 = 0; r2 < e2.length; ++r2) t2[r2] = 255 & e2.charCodeAt(r2);
            return t2;
          }
          e("setimmediate"), a.newBlob = function(t2, r2) {
            a.checkSupport("blob");
            try {
              return new Blob([t2], { type: r2 });
            } catch (e2) {
              try {
                var n2 = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
                return n2.append(t2), n2.getBlob(r2);
              } catch (e3) {
                throw new Error("Bug : can't construct the Blob.");
              }
            }
          };
          var i = { stringifyByChunk: function(e2, t2, r2) {
            var n2 = [], i2 = 0, s2 = e2.length;
            if (s2 <= r2) return String.fromCharCode.apply(null, e2);
            for (; i2 < s2; ) "array" === t2 || "nodebuffer" === t2 ? n2.push(String.fromCharCode.apply(null, e2.slice(i2, Math.min(i2 + r2, s2)))) : n2.push(String.fromCharCode.apply(null, e2.subarray(i2, Math.min(i2 + r2, s2)))), i2 += r2;
            return n2.join("");
          }, stringifyByChar: function(e2) {
            for (var t2 = "", r2 = 0; r2 < e2.length; r2++) t2 += String.fromCharCode(e2[r2]);
            return t2;
          }, applyCanBeUsed: { uint8array: (function() {
            try {
              return o.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
            } catch (e2) {
              return false;
            }
          })(), nodebuffer: (function() {
            try {
              return o.nodebuffer && 1 === String.fromCharCode.apply(null, r.allocBuffer(1)).length;
            } catch (e2) {
              return false;
            }
          })() } };
          function s(e2) {
            var t2 = 65536, r2 = a.getTypeOf(e2), n2 = true;
            if ("uint8array" === r2 ? n2 = i.applyCanBeUsed.uint8array : "nodebuffer" === r2 && (n2 = i.applyCanBeUsed.nodebuffer), n2) for (; 1 < t2; ) try {
              return i.stringifyByChunk(e2, r2, t2);
            } catch (e3) {
              t2 = Math.floor(t2 / 2);
            }
            return i.stringifyByChar(e2);
          }
          function f(e2, t2) {
            for (var r2 = 0; r2 < e2.length; r2++) t2[r2] = e2[r2];
            return t2;
          }
          a.applyFromCharCode = s;
          var c = {};
          c.string = { string: n, array: function(e2) {
            return l(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return c.string.uint8array(e2).buffer;
          }, uint8array: function(e2) {
            return l(e2, new Uint8Array(e2.length));
          }, nodebuffer: function(e2) {
            return l(e2, r.allocBuffer(e2.length));
          } }, c.array = { string: s, array: n, arraybuffer: function(e2) {
            return new Uint8Array(e2).buffer;
          }, uint8array: function(e2) {
            return new Uint8Array(e2);
          }, nodebuffer: function(e2) {
            return r.newBufferFrom(e2);
          } }, c.arraybuffer = { string: function(e2) {
            return s(new Uint8Array(e2));
          }, array: function(e2) {
            return f(new Uint8Array(e2), new Array(e2.byteLength));
          }, arraybuffer: n, uint8array: function(e2) {
            return new Uint8Array(e2);
          }, nodebuffer: function(e2) {
            return r.newBufferFrom(new Uint8Array(e2));
          } }, c.uint8array = { string: s, array: function(e2) {
            return f(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return e2.buffer;
          }, uint8array: n, nodebuffer: function(e2) {
            return r.newBufferFrom(e2);
          } }, c.nodebuffer = { string: s, array: function(e2) {
            return f(e2, new Array(e2.length));
          }, arraybuffer: function(e2) {
            return c.nodebuffer.uint8array(e2).buffer;
          }, uint8array: function(e2) {
            return f(e2, new Uint8Array(e2.length));
          }, nodebuffer: n }, a.transformTo = function(e2, t2) {
            if (t2 = t2 || "", !e2) return t2;
            a.checkSupport(e2);
            var r2 = a.getTypeOf(t2);
            return c[r2][e2](t2);
          }, a.resolve = function(e2) {
            for (var t2 = e2.split("/"), r2 = [], n2 = 0; n2 < t2.length; n2++) {
              var i2 = t2[n2];
              "." === i2 || "" === i2 && 0 !== n2 && n2 !== t2.length - 1 || (".." === i2 ? r2.pop() : r2.push(i2));
            }
            return r2.join("/");
          }, a.getTypeOf = function(e2) {
            return "string" == typeof e2 ? "string" : "[object Array]" === Object.prototype.toString.call(e2) ? "array" : o.nodebuffer && r.isBuffer(e2) ? "nodebuffer" : o.uint8array && e2 instanceof Uint8Array ? "uint8array" : o.arraybuffer && e2 instanceof ArrayBuffer ? "arraybuffer" : void 0;
          }, a.checkSupport = function(e2) {
            if (!o[e2.toLowerCase()]) throw new Error(e2 + " is not supported by this platform");
          }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function(e2) {
            var t2, r2, n2 = "";
            for (r2 = 0; r2 < (e2 || "").length; r2++) n2 += "\\x" + ((t2 = e2.charCodeAt(r2)) < 16 ? "0" : "") + t2.toString(16).toUpperCase();
            return n2;
          }, a.delay = function(e2, t2, r2) {
            setImmediate(function() {
              e2.apply(r2 || null, t2 || []);
            });
          }, a.inherits = function(e2, t2) {
            function r2() {
            }
            r2.prototype = t2.prototype, e2.prototype = new r2();
          }, a.extend = function() {
            var e2, t2, r2 = {};
            for (e2 = 0; e2 < arguments.length; e2++) for (t2 in arguments[e2]) Object.prototype.hasOwnProperty.call(arguments[e2], t2) && void 0 === r2[t2] && (r2[t2] = arguments[e2][t2]);
            return r2;
          }, a.prepareContent = function(r2, e2, n2, i2, s2) {
            return u.Promise.resolve(e2).then(function(n3) {
              return o.blob && (n3 instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(n3))) && "undefined" != typeof FileReader ? new u.Promise(function(t2, r3) {
                var e3 = new FileReader();
                e3.onload = function(e4) {
                  t2(e4.target.result);
                }, e3.onerror = function(e4) {
                  r3(e4.target.error);
                }, e3.readAsArrayBuffer(n3);
              }) : n3;
            }).then(function(e3) {
              var t2 = a.getTypeOf(e3);
              return t2 ? ("arraybuffer" === t2 ? e3 = a.transformTo("uint8array", e3) : "string" === t2 && (s2 ? e3 = h.decode(e3) : n2 && true !== i2 && (e3 = (function(e4) {
                return l(e4, o.uint8array ? new Uint8Array(e4.length) : new Array(e4.length));
              })(e3))), e3) : u.Promise.reject(new Error("Can't read the data of '" + r2 + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
            });
          };
        }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, t, r) {
          "use strict";
          var n = e("./reader/readerFor"), i = e("./utils"), s = e("./signature"), a = e("./zipEntry"), o = e("./support");
          function h(e2) {
            this.files = [], this.loadOptions = e2;
          }
          h.prototype = { checkSignature: function(e2) {
            if (!this.reader.readAndCheckSignature(e2)) {
              this.reader.index -= 4;
              var t2 = this.reader.readString(4);
              throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(t2) + ", expected " + i.pretty(e2) + ")");
            }
          }, isSignature: function(e2, t2) {
            var r2 = this.reader.index;
            this.reader.setIndex(e2);
            var n2 = this.reader.readString(4) === t2;
            return this.reader.setIndex(r2), n2;
          }, readBlockEndOfCentral: function() {
            this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
            var e2 = this.reader.readData(this.zipCommentLength), t2 = o.uint8array ? "uint8array" : "array", r2 = i.transformTo(t2, e2);
            this.zipComment = this.loadOptions.decodeFileName(r2);
          }, readBlockZip64EndOfCentral: function() {
            this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
            for (var e2, t2, r2, n2 = this.zip64EndOfCentralSize - 44; 0 < n2; ) e2 = this.reader.readInt(2), t2 = this.reader.readInt(4), r2 = this.reader.readData(t2), this.zip64ExtensibleData[e2] = { id: e2, length: t2, value: r2 };
          }, readBlockZip64EndOfCentralLocator: function() {
            if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
          }, readLocalFiles: function() {
            var e2, t2;
            for (e2 = 0; e2 < this.files.length; e2++) t2 = this.files[e2], this.reader.setIndex(t2.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), t2.readLocalPart(this.reader), t2.handleUTF8(), t2.processAttributes();
          }, readCentralDir: function() {
            var e2;
            for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); ) (e2 = new a({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(e2);
            if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
          }, readEndOfCentral: function() {
            var e2 = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
            if (e2 < 0) throw !this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory");
            this.reader.setIndex(e2);
            var t2 = e2;
            if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
              if (this.zip64 = true, (e2 = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
              if (this.reader.setIndex(e2), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
              this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
            }
            var r2 = this.centralDirOffset + this.centralDirSize;
            this.zip64 && (r2 += 20, r2 += 12 + this.zip64EndOfCentralSize);
            var n2 = t2 - r2;
            if (0 < n2) this.isSignature(t2, s.CENTRAL_FILE_HEADER) || (this.reader.zero = n2);
            else if (n2 < 0) throw new Error("Corrupted zip: missing " + Math.abs(n2) + " bytes.");
          }, prepareReader: function(e2) {
            this.reader = n(e2);
          }, load: function(e2) {
            this.prepareReader(e2), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
          } }, t.exports = h;
        }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, t, r) {
          "use strict";
          var n = e("./reader/readerFor"), s = e("./utils"), i = e("./compressedObject"), a = e("./crc32"), o = e("./utf8"), h = e("./compressions"), u = e("./support");
          function l(e2, t2) {
            this.options = e2, this.loadOptions = t2;
          }
          l.prototype = { isEncrypted: function() {
            return 1 == (1 & this.bitFlag);
          }, useUTF8: function() {
            return 2048 == (2048 & this.bitFlag);
          }, readLocalPart: function(e2) {
            var t2, r2;
            if (e2.skip(22), this.fileNameLength = e2.readInt(2), r2 = e2.readInt(2), this.fileName = e2.readData(this.fileNameLength), e2.skip(r2), -1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
            if (null === (t2 = (function(e3) {
              for (var t3 in h) if (Object.prototype.hasOwnProperty.call(h, t3) && h[t3].magic === e3) return h[t3];
              return null;
            })(this.compressionMethod))) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
            this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, t2, e2.readData(this.compressedSize));
          }, readCentralPart: function(e2) {
            this.versionMadeBy = e2.readInt(2), e2.skip(2), this.bitFlag = e2.readInt(2), this.compressionMethod = e2.readString(2), this.date = e2.readDate(), this.crc32 = e2.readInt(4), this.compressedSize = e2.readInt(4), this.uncompressedSize = e2.readInt(4);
            var t2 = e2.readInt(2);
            if (this.extraFieldsLength = e2.readInt(2), this.fileCommentLength = e2.readInt(2), this.diskNumberStart = e2.readInt(2), this.internalFileAttributes = e2.readInt(2), this.externalFileAttributes = e2.readInt(4), this.localHeaderOffset = e2.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
            e2.skip(t2), this.readExtraFields(e2), this.parseZIP64ExtraField(e2), this.fileComment = e2.readData(this.fileCommentLength);
          }, processAttributes: function() {
            this.unixPermissions = null, this.dosPermissions = null;
            var e2 = this.versionMadeBy >> 8;
            this.dir = !!(16 & this.externalFileAttributes), 0 == e2 && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == e2 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = true);
          }, parseZIP64ExtraField: function() {
            if (this.extraFields[1]) {
              var e2 = n(this.extraFields[1].value);
              this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = e2.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = e2.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = e2.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = e2.readInt(4));
            }
          }, readExtraFields: function(e2) {
            var t2, r2, n2, i2 = e2.index + this.extraFieldsLength;
            for (this.extraFields || (this.extraFields = {}); e2.index + 4 < i2; ) t2 = e2.readInt(2), r2 = e2.readInt(2), n2 = e2.readData(r2), this.extraFields[t2] = { id: t2, length: r2, value: n2 };
            e2.setIndex(i2);
          }, handleUTF8: function() {
            var e2 = u.uint8array ? "uint8array" : "array";
            if (this.useUTF8()) this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);
            else {
              var t2 = this.findExtraFieldUnicodePath();
              if (null !== t2) this.fileNameStr = t2;
              else {
                var r2 = s.transformTo(e2, this.fileName);
                this.fileNameStr = this.loadOptions.decodeFileName(r2);
              }
              var n2 = this.findExtraFieldUnicodeComment();
              if (null !== n2) this.fileCommentStr = n2;
              else {
                var i2 = s.transformTo(e2, this.fileComment);
                this.fileCommentStr = this.loadOptions.decodeFileName(i2);
              }
            }
          }, findExtraFieldUnicodePath: function() {
            var e2 = this.extraFields[28789];
            if (e2) {
              var t2 = n(e2.value);
              return 1 !== t2.readInt(1) ? null : a(this.fileName) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
            }
            return null;
          }, findExtraFieldUnicodeComment: function() {
            var e2 = this.extraFields[25461];
            if (e2) {
              var t2 = n(e2.value);
              return 1 !== t2.readInt(1) ? null : a(this.fileComment) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
            }
            return null;
          } }, t.exports = l;
        }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, t, r) {
          "use strict";
          function n(e2, t2, r2) {
            this.name = e2, this.dir = r2.dir, this.date = r2.date, this.comment = r2.comment, this.unixPermissions = r2.unixPermissions, this.dosPermissions = r2.dosPermissions, this._data = t2, this._dataBinary = r2.binary, this.options = { compression: r2.compression, compressionOptions: r2.compressionOptions };
          }
          var s = e("./stream/StreamHelper"), i = e("./stream/DataWorker"), a = e("./utf8"), o = e("./compressedObject"), h = e("./stream/GenericWorker");
          n.prototype = { internalStream: function(e2) {
            var t2 = null, r2 = "string";
            try {
              if (!e2) throw new Error("No output type specified.");
              var n2 = "string" === (r2 = e2.toLowerCase()) || "text" === r2;
              "binarystring" !== r2 && "text" !== r2 || (r2 = "string"), t2 = this._decompressWorker();
              var i2 = !this._dataBinary;
              i2 && !n2 && (t2 = t2.pipe(new a.Utf8EncodeWorker())), !i2 && n2 && (t2 = t2.pipe(new a.Utf8DecodeWorker()));
            } catch (e3) {
              (t2 = new h("error")).error(e3);
            }
            return new s(t2, r2, "");
          }, async: function(e2, t2) {
            return this.internalStream(e2).accumulate(t2);
          }, nodeStream: function(e2, t2) {
            return this.internalStream(e2 || "nodebuffer").toNodejsStream(t2);
          }, _compressWorker: function(e2, t2) {
            if (this._data instanceof o && this._data.compression.magic === e2.magic) return this._data.getCompressedWorker();
            var r2 = this._decompressWorker();
            return this._dataBinary || (r2 = r2.pipe(new a.Utf8EncodeWorker())), o.createWorkerFrom(r2, e2, t2);
          }, _decompressWorker: function() {
            return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof h ? this._data : new i(this._data);
          } };
          for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], l = function() {
            throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
          }, f = 0; f < u.length; f++) n.prototype[u[f]] = l;
          t.exports = n;
        }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, l, t) {
          (function(t2) {
            "use strict";
            var r, n, e2 = t2.MutationObserver || t2.WebKitMutationObserver;
            if (e2) {
              var i = 0, s = new e2(u), a = t2.document.createTextNode("");
              s.observe(a, { characterData: true }), r = function() {
                a.data = i = ++i % 2;
              };
            } else if (t2.setImmediate || void 0 === t2.MessageChannel) r = "document" in t2 && "onreadystatechange" in t2.document.createElement("script") ? function() {
              var e3 = t2.document.createElement("script");
              e3.onreadystatechange = function() {
                u(), e3.onreadystatechange = null, e3.parentNode.removeChild(e3), e3 = null;
              }, t2.document.documentElement.appendChild(e3);
            } : function() {
              setTimeout(u, 0);
            };
            else {
              var o = new t2.MessageChannel();
              o.port1.onmessage = u, r = function() {
                o.port2.postMessage(0);
              };
            }
            var h = [];
            function u() {
              var e3, t3;
              n = true;
              for (var r2 = h.length; r2; ) {
                for (t3 = h, h = [], e3 = -1; ++e3 < r2; ) t3[e3]();
                r2 = h.length;
              }
              n = false;
            }
            l.exports = function(e3) {
              1 !== h.push(e3) || n || r();
            };
          }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {}], 37: [function(e, t, r) {
          "use strict";
          var i = e("immediate");
          function u() {
          }
          var l = {}, s = ["REJECTED"], a = ["FULFILLED"], n = ["PENDING"];
          function o(e2) {
            if ("function" != typeof e2) throw new TypeError("resolver must be a function");
            this.state = n, this.queue = [], this.outcome = void 0, e2 !== u && d(this, e2);
          }
          function h(e2, t2, r2) {
            this.promise = e2, "function" == typeof t2 && (this.onFulfilled = t2, this.callFulfilled = this.otherCallFulfilled), "function" == typeof r2 && (this.onRejected = r2, this.callRejected = this.otherCallRejected);
          }
          function f(t2, r2, n2) {
            i(function() {
              var e2;
              try {
                e2 = r2(n2);
              } catch (e3) {
                return l.reject(t2, e3);
              }
              e2 === t2 ? l.reject(t2, new TypeError("Cannot resolve promise with itself")) : l.resolve(t2, e2);
            });
          }
          function c(e2) {
            var t2 = e2 && e2.then;
            if (e2 && ("object" == typeof e2 || "function" == typeof e2) && "function" == typeof t2) return function() {
              t2.apply(e2, arguments);
            };
          }
          function d(t2, e2) {
            var r2 = false;
            function n2(e3) {
              r2 || (r2 = true, l.reject(t2, e3));
            }
            function i2(e3) {
              r2 || (r2 = true, l.resolve(t2, e3));
            }
            var s2 = p(function() {
              e2(i2, n2);
            });
            "error" === s2.status && n2(s2.value);
          }
          function p(e2, t2) {
            var r2 = {};
            try {
              r2.value = e2(t2), r2.status = "success";
            } catch (e3) {
              r2.status = "error", r2.value = e3;
            }
            return r2;
          }
          (t.exports = o).prototype.finally = function(t2) {
            if ("function" != typeof t2) return this;
            var r2 = this.constructor;
            return this.then(function(e2) {
              return r2.resolve(t2()).then(function() {
                return e2;
              });
            }, function(e2) {
              return r2.resolve(t2()).then(function() {
                throw e2;
              });
            });
          }, o.prototype.catch = function(e2) {
            return this.then(null, e2);
          }, o.prototype.then = function(e2, t2) {
            if ("function" != typeof e2 && this.state === a || "function" != typeof t2 && this.state === s) return this;
            var r2 = new this.constructor(u);
            this.state !== n ? f(r2, this.state === a ? e2 : t2, this.outcome) : this.queue.push(new h(r2, e2, t2));
            return r2;
          }, h.prototype.callFulfilled = function(e2) {
            l.resolve(this.promise, e2);
          }, h.prototype.otherCallFulfilled = function(e2) {
            f(this.promise, this.onFulfilled, e2);
          }, h.prototype.callRejected = function(e2) {
            l.reject(this.promise, e2);
          }, h.prototype.otherCallRejected = function(e2) {
            f(this.promise, this.onRejected, e2);
          }, l.resolve = function(e2, t2) {
            var r2 = p(c, t2);
            if ("error" === r2.status) return l.reject(e2, r2.value);
            var n2 = r2.value;
            if (n2) d(e2, n2);
            else {
              e2.state = a, e2.outcome = t2;
              for (var i2 = -1, s2 = e2.queue.length; ++i2 < s2; ) e2.queue[i2].callFulfilled(t2);
            }
            return e2;
          }, l.reject = function(e2, t2) {
            e2.state = s, e2.outcome = t2;
            for (var r2 = -1, n2 = e2.queue.length; ++r2 < n2; ) e2.queue[r2].callRejected(t2);
            return e2;
          }, o.resolve = function(e2) {
            if (e2 instanceof this) return e2;
            return l.resolve(new this(u), e2);
          }, o.reject = function(e2) {
            var t2 = new this(u);
            return l.reject(t2, e2);
          }, o.all = function(e2) {
            var r2 = this;
            if ("[object Array]" !== Object.prototype.toString.call(e2)) return this.reject(new TypeError("must be an array"));
            var n2 = e2.length, i2 = false;
            if (!n2) return this.resolve([]);
            var s2 = new Array(n2), a2 = 0, t2 = -1, o2 = new this(u);
            for (; ++t2 < n2; ) h2(e2[t2], t2);
            return o2;
            function h2(e3, t3) {
              r2.resolve(e3).then(function(e4) {
                s2[t3] = e4, ++a2 !== n2 || i2 || (i2 = true, l.resolve(o2, s2));
              }, function(e4) {
                i2 || (i2 = true, l.reject(o2, e4));
              });
            }
          }, o.race = function(e2) {
            var t2 = this;
            if ("[object Array]" !== Object.prototype.toString.call(e2)) return this.reject(new TypeError("must be an array"));
            var r2 = e2.length, n2 = false;
            if (!r2) return this.resolve([]);
            var i2 = -1, s2 = new this(u);
            for (; ++i2 < r2; ) a2 = e2[i2], t2.resolve(a2).then(function(e3) {
              n2 || (n2 = true, l.resolve(s2, e3));
            }, function(e3) {
              n2 || (n2 = true, l.reject(s2, e3));
            });
            var a2;
            return s2;
          };
        }, { immediate: 36 }], 38: [function(e, t, r) {
          "use strict";
          var n = {};
          (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t.exports = n;
        }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, t, r) {
          "use strict";
          var a = e("./zlib/deflate"), o = e("./utils/common"), h = e("./utils/strings"), i = e("./zlib/messages"), s = e("./zlib/zstream"), u = Object.prototype.toString, l = 0, f = -1, c = 0, d = 8;
          function p(e2) {
            if (!(this instanceof p)) return new p(e2);
            this.options = o.assign({ level: f, method: d, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: c, to: "" }, e2 || {});
            var t2 = this.options;
            t2.raw && 0 < t2.windowBits ? t2.windowBits = -t2.windowBits : t2.gzip && 0 < t2.windowBits && t2.windowBits < 16 && (t2.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
            var r2 = a.deflateInit2(this.strm, t2.level, t2.method, t2.windowBits, t2.memLevel, t2.strategy);
            if (r2 !== l) throw new Error(i[r2]);
            if (t2.header && a.deflateSetHeader(this.strm, t2.header), t2.dictionary) {
              var n2;
              if (n2 = "string" == typeof t2.dictionary ? h.string2buf(t2.dictionary) : "[object ArrayBuffer]" === u.call(t2.dictionary) ? new Uint8Array(t2.dictionary) : t2.dictionary, (r2 = a.deflateSetDictionary(this.strm, n2)) !== l) throw new Error(i[r2]);
              this._dict_set = true;
            }
          }
          function n(e2, t2) {
            var r2 = new p(t2);
            if (r2.push(e2, true), r2.err) throw r2.msg || i[r2.err];
            return r2.result;
          }
          p.prototype.push = function(e2, t2) {
            var r2, n2, i2 = this.strm, s2 = this.options.chunkSize;
            if (this.ended) return false;
            n2 = t2 === ~~t2 ? t2 : true === t2 ? 4 : 0, "string" == typeof e2 ? i2.input = h.string2buf(e2) : "[object ArrayBuffer]" === u.call(e2) ? i2.input = new Uint8Array(e2) : i2.input = e2, i2.next_in = 0, i2.avail_in = i2.input.length;
            do {
              if (0 === i2.avail_out && (i2.output = new o.Buf8(s2), i2.next_out = 0, i2.avail_out = s2), 1 !== (r2 = a.deflate(i2, n2)) && r2 !== l) return this.onEnd(r2), !(this.ended = true);
              0 !== i2.avail_out && (0 !== i2.avail_in || 4 !== n2 && 2 !== n2) || ("string" === this.options.to ? this.onData(h.buf2binstring(o.shrinkBuf(i2.output, i2.next_out))) : this.onData(o.shrinkBuf(i2.output, i2.next_out)));
            } while ((0 < i2.avail_in || 0 === i2.avail_out) && 1 !== r2);
            return 4 === n2 ? (r2 = a.deflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === l) : 2 !== n2 || (this.onEnd(l), !(i2.avail_out = 0));
          }, p.prototype.onData = function(e2) {
            this.chunks.push(e2);
          }, p.prototype.onEnd = function(e2) {
            e2 === l && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
          }, r.Deflate = p, r.deflate = n, r.deflateRaw = function(e2, t2) {
            return (t2 = t2 || {}).raw = true, n(e2, t2);
          }, r.gzip = function(e2, t2) {
            return (t2 = t2 || {}).gzip = true, n(e2, t2);
          };
        }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, t, r) {
          "use strict";
          var c = e("./zlib/inflate"), d = e("./utils/common"), p = e("./utils/strings"), m = e("./zlib/constants"), n = e("./zlib/messages"), i = e("./zlib/zstream"), s = e("./zlib/gzheader"), _ = Object.prototype.toString;
          function a(e2) {
            if (!(this instanceof a)) return new a(e2);
            this.options = d.assign({ chunkSize: 16384, windowBits: 0, to: "" }, e2 || {});
            var t2 = this.options;
            t2.raw && 0 <= t2.windowBits && t2.windowBits < 16 && (t2.windowBits = -t2.windowBits, 0 === t2.windowBits && (t2.windowBits = -15)), !(0 <= t2.windowBits && t2.windowBits < 16) || e2 && e2.windowBits || (t2.windowBits += 32), 15 < t2.windowBits && t2.windowBits < 48 && 0 == (15 & t2.windowBits) && (t2.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new i(), this.strm.avail_out = 0;
            var r2 = c.inflateInit2(this.strm, t2.windowBits);
            if (r2 !== m.Z_OK) throw new Error(n[r2]);
            this.header = new s(), c.inflateGetHeader(this.strm, this.header);
          }
          function o(e2, t2) {
            var r2 = new a(t2);
            if (r2.push(e2, true), r2.err) throw r2.msg || n[r2.err];
            return r2.result;
          }
          a.prototype.push = function(e2, t2) {
            var r2, n2, i2, s2, a2, o2, h = this.strm, u = this.options.chunkSize, l = this.options.dictionary, f = false;
            if (this.ended) return false;
            n2 = t2 === ~~t2 ? t2 : true === t2 ? m.Z_FINISH : m.Z_NO_FLUSH, "string" == typeof e2 ? h.input = p.binstring2buf(e2) : "[object ArrayBuffer]" === _.call(e2) ? h.input = new Uint8Array(e2) : h.input = e2, h.next_in = 0, h.avail_in = h.input.length;
            do {
              if (0 === h.avail_out && (h.output = new d.Buf8(u), h.next_out = 0, h.avail_out = u), (r2 = c.inflate(h, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && l && (o2 = "string" == typeof l ? p.string2buf(l) : "[object ArrayBuffer]" === _.call(l) ? new Uint8Array(l) : l, r2 = c.inflateSetDictionary(this.strm, o2)), r2 === m.Z_BUF_ERROR && true === f && (r2 = m.Z_OK, f = false), r2 !== m.Z_STREAM_END && r2 !== m.Z_OK) return this.onEnd(r2), !(this.ended = true);
              h.next_out && (0 !== h.avail_out && r2 !== m.Z_STREAM_END && (0 !== h.avail_in || n2 !== m.Z_FINISH && n2 !== m.Z_SYNC_FLUSH) || ("string" === this.options.to ? (i2 = p.utf8border(h.output, h.next_out), s2 = h.next_out - i2, a2 = p.buf2string(h.output, i2), h.next_out = s2, h.avail_out = u - s2, s2 && d.arraySet(h.output, h.output, i2, s2, 0), this.onData(a2)) : this.onData(d.shrinkBuf(h.output, h.next_out)))), 0 === h.avail_in && 0 === h.avail_out && (f = true);
            } while ((0 < h.avail_in || 0 === h.avail_out) && r2 !== m.Z_STREAM_END);
            return r2 === m.Z_STREAM_END && (n2 = m.Z_FINISH), n2 === m.Z_FINISH ? (r2 = c.inflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === m.Z_OK) : n2 !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(h.avail_out = 0));
          }, a.prototype.onData = function(e2) {
            this.chunks.push(e2);
          }, a.prototype.onEnd = function(e2) {
            e2 === m.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = d.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
          }, r.Inflate = a, r.inflate = o, r.inflateRaw = function(e2, t2) {
            return (t2 = t2 || {}).raw = true, o(e2, t2);
          }, r.ungzip = o;
        }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, t, r) {
          "use strict";
          var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
          r.assign = function(e2) {
            for (var t2 = Array.prototype.slice.call(arguments, 1); t2.length; ) {
              var r2 = t2.shift();
              if (r2) {
                if ("object" != typeof r2) throw new TypeError(r2 + "must be non-object");
                for (var n2 in r2) r2.hasOwnProperty(n2) && (e2[n2] = r2[n2]);
              }
            }
            return e2;
          }, r.shrinkBuf = function(e2, t2) {
            return e2.length === t2 ? e2 : e2.subarray ? e2.subarray(0, t2) : (e2.length = t2, e2);
          };
          var i = { arraySet: function(e2, t2, r2, n2, i2) {
            if (t2.subarray && e2.subarray) e2.set(t2.subarray(r2, r2 + n2), i2);
            else for (var s2 = 0; s2 < n2; s2++) e2[i2 + s2] = t2[r2 + s2];
          }, flattenChunks: function(e2) {
            var t2, r2, n2, i2, s2, a;
            for (t2 = n2 = 0, r2 = e2.length; t2 < r2; t2++) n2 += e2[t2].length;
            for (a = new Uint8Array(n2), t2 = i2 = 0, r2 = e2.length; t2 < r2; t2++) s2 = e2[t2], a.set(s2, i2), i2 += s2.length;
            return a;
          } }, s = { arraySet: function(e2, t2, r2, n2, i2) {
            for (var s2 = 0; s2 < n2; s2++) e2[i2 + s2] = t2[r2 + s2];
          }, flattenChunks: function(e2) {
            return [].concat.apply([], e2);
          } };
          r.setTyped = function(e2) {
            e2 ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, i)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, s));
          }, r.setTyped(n);
        }, {}], 42: [function(e, t, r) {
          "use strict";
          var h = e("./common"), i = true, s = true;
          try {
            String.fromCharCode.apply(null, [0]);
          } catch (e2) {
            i = false;
          }
          try {
            String.fromCharCode.apply(null, new Uint8Array(1));
          } catch (e2) {
            s = false;
          }
          for (var u = new h.Buf8(256), n = 0; n < 256; n++) u[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;
          function l(e2, t2) {
            if (t2 < 65537 && (e2.subarray && s || !e2.subarray && i)) return String.fromCharCode.apply(null, h.shrinkBuf(e2, t2));
            for (var r2 = "", n2 = 0; n2 < t2; n2++) r2 += String.fromCharCode(e2[n2]);
            return r2;
          }
          u[254] = u[254] = 1, r.string2buf = function(e2) {
            var t2, r2, n2, i2, s2, a = e2.length, o = 0;
            for (i2 = 0; i2 < a; i2++) 55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
            for (t2 = new h.Buf8(o), i2 = s2 = 0; s2 < o; i2++) 55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
            return t2;
          }, r.buf2binstring = function(e2) {
            return l(e2, e2.length);
          }, r.binstring2buf = function(e2) {
            for (var t2 = new h.Buf8(e2.length), r2 = 0, n2 = t2.length; r2 < n2; r2++) t2[r2] = e2.charCodeAt(r2);
            return t2;
          }, r.buf2string = function(e2, t2) {
            var r2, n2, i2, s2, a = t2 || e2.length, o = new Array(2 * a);
            for (r2 = n2 = 0; r2 < a; ) if ((i2 = e2[r2++]) < 128) o[n2++] = i2;
            else if (4 < (s2 = u[i2])) o[n2++] = 65533, r2 += s2 - 1;
            else {
              for (i2 &= 2 === s2 ? 31 : 3 === s2 ? 15 : 7; 1 < s2 && r2 < a; ) i2 = i2 << 6 | 63 & e2[r2++], s2--;
              1 < s2 ? o[n2++] = 65533 : i2 < 65536 ? o[n2++] = i2 : (i2 -= 65536, o[n2++] = 55296 | i2 >> 10 & 1023, o[n2++] = 56320 | 1023 & i2);
            }
            return l(o, n2);
          }, r.utf8border = function(e2, t2) {
            var r2;
            for ((t2 = t2 || e2.length) > e2.length && (t2 = e2.length), r2 = t2 - 1; 0 <= r2 && 128 == (192 & e2[r2]); ) r2--;
            return r2 < 0 ? t2 : 0 === r2 ? t2 : r2 + u[e2[r2]] > t2 ? r2 : t2;
          };
        }, { "./common": 41 }], 43: [function(e, t, r) {
          "use strict";
          t.exports = function(e2, t2, r2, n) {
            for (var i = 65535 & e2 | 0, s = e2 >>> 16 & 65535 | 0, a = 0; 0 !== r2; ) {
              for (r2 -= a = 2e3 < r2 ? 2e3 : r2; s = s + (i = i + t2[n++] | 0) | 0, --a; ) ;
              i %= 65521, s %= 65521;
            }
            return i | s << 16 | 0;
          };
        }, {}], 44: [function(e, t, r) {
          "use strict";
          t.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
        }, {}], 45: [function(e, t, r) {
          "use strict";
          var o = (function() {
            for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
              e2 = r2;
              for (var n = 0; n < 8; n++) e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
              t2[r2] = e2;
            }
            return t2;
          })();
          t.exports = function(e2, t2, r2, n) {
            var i = o, s = n + r2;
            e2 ^= -1;
            for (var a = n; a < s; a++) e2 = e2 >>> 8 ^ i[255 & (e2 ^ t2[a])];
            return -1 ^ e2;
          };
        }, {}], 46: [function(e, t, r) {
          "use strict";
          var h, c = e("../utils/common"), u = e("./trees"), d = e("./adler32"), p = e("./crc32"), n = e("./messages"), l = 0, f = 4, m = 0, _ = -2, g = -1, b = 4, i = 2, v = 8, y = 9, s = 286, a = 30, o = 19, w = 2 * s + 1, k = 15, x = 3, S = 258, z = S + x + 1, C = 42, E = 113, A = 1, I = 2, O = 3, B = 4;
          function R(e2, t2) {
            return e2.msg = n[t2], t2;
          }
          function T(e2) {
            return (e2 << 1) - (4 < e2 ? 9 : 0);
          }
          function D(e2) {
            for (var t2 = e2.length; 0 <= --t2; ) e2[t2] = 0;
          }
          function F(e2) {
            var t2 = e2.state, r2 = t2.pending;
            r2 > e2.avail_out && (r2 = e2.avail_out), 0 !== r2 && (c.arraySet(e2.output, t2.pending_buf, t2.pending_out, r2, e2.next_out), e2.next_out += r2, t2.pending_out += r2, e2.total_out += r2, e2.avail_out -= r2, t2.pending -= r2, 0 === t2.pending && (t2.pending_out = 0));
          }
          function N(e2, t2) {
            u._tr_flush_block(e2, 0 <= e2.block_start ? e2.block_start : -1, e2.strstart - e2.block_start, t2), e2.block_start = e2.strstart, F(e2.strm);
          }
          function U(e2, t2) {
            e2.pending_buf[e2.pending++] = t2;
          }
          function P(e2, t2) {
            e2.pending_buf[e2.pending++] = t2 >>> 8 & 255, e2.pending_buf[e2.pending++] = 255 & t2;
          }
          function L(e2, t2) {
            var r2, n2, i2 = e2.max_chain_length, s2 = e2.strstart, a2 = e2.prev_length, o2 = e2.nice_match, h2 = e2.strstart > e2.w_size - z ? e2.strstart - (e2.w_size - z) : 0, u2 = e2.window, l2 = e2.w_mask, f2 = e2.prev, c2 = e2.strstart + S, d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
            e2.prev_length >= e2.good_match && (i2 >>= 2), o2 > e2.lookahead && (o2 = e2.lookahead);
            do {
              if (u2[(r2 = t2) + a2] === p2 && u2[r2 + a2 - 1] === d2 && u2[r2] === u2[s2] && u2[++r2] === u2[s2 + 1]) {
                s2 += 2, r2++;
                do {
                } while (u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && s2 < c2);
                if (n2 = S - (c2 - s2), s2 = c2 - S, a2 < n2) {
                  if (e2.match_start = t2, o2 <= (a2 = n2)) break;
                  d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
                }
              }
            } while ((t2 = f2[t2 & l2]) > h2 && 0 != --i2);
            return a2 <= e2.lookahead ? a2 : e2.lookahead;
          }
          function j(e2) {
            var t2, r2, n2, i2, s2, a2, o2, h2, u2, l2, f2 = e2.w_size;
            do {
              if (i2 = e2.window_size - e2.lookahead - e2.strstart, e2.strstart >= f2 + (f2 - z)) {
                for (c.arraySet(e2.window, e2.window, f2, f2, 0), e2.match_start -= f2, e2.strstart -= f2, e2.block_start -= f2, t2 = r2 = e2.hash_size; n2 = e2.head[--t2], e2.head[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; ) ;
                for (t2 = r2 = f2; n2 = e2.prev[--t2], e2.prev[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; ) ;
                i2 += f2;
              }
              if (0 === e2.strm.avail_in) break;
              if (a2 = e2.strm, o2 = e2.window, h2 = e2.strstart + e2.lookahead, u2 = i2, l2 = void 0, l2 = a2.avail_in, u2 < l2 && (l2 = u2), r2 = 0 === l2 ? 0 : (a2.avail_in -= l2, c.arraySet(o2, a2.input, a2.next_in, l2, h2), 1 === a2.state.wrap ? a2.adler = d(a2.adler, o2, l2, h2) : 2 === a2.state.wrap && (a2.adler = p(a2.adler, o2, l2, h2)), a2.next_in += l2, a2.total_in += l2, l2), e2.lookahead += r2, e2.lookahead + e2.insert >= x) for (s2 = e2.strstart - e2.insert, e2.ins_h = e2.window[s2], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + 1]) & e2.hash_mask; e2.insert && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + x - 1]) & e2.hash_mask, e2.prev[s2 & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = s2, s2++, e2.insert--, !(e2.lookahead + e2.insert < x)); ) ;
            } while (e2.lookahead < z && 0 !== e2.strm.avail_in);
          }
          function Z(e2, t2) {
            for (var r2, n2; ; ) {
              if (e2.lookahead < z) {
                if (j(e2), e2.lookahead < z && t2 === l) return A;
                if (0 === e2.lookahead) break;
              }
              if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 !== r2 && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2)), e2.match_length >= x) if (n2 = u._tr_tally(e2, e2.strstart - e2.match_start, e2.match_length - x), e2.lookahead -= e2.match_length, e2.match_length <= e2.max_lazy_match && e2.lookahead >= x) {
                for (e2.match_length--; e2.strstart++, e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart, 0 != --e2.match_length; ) ;
                e2.strstart++;
              } else e2.strstart += e2.match_length, e2.match_length = 0, e2.ins_h = e2.window[e2.strstart], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 1]) & e2.hash_mask;
              else n2 = u._tr_tally(e2, 0, e2.window[e2.strstart]), e2.lookahead--, e2.strstart++;
              if (n2 && (N(e2, false), 0 === e2.strm.avail_out)) return A;
            }
            return e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
          }
          function W(e2, t2) {
            for (var r2, n2, i2; ; ) {
              if (e2.lookahead < z) {
                if (j(e2), e2.lookahead < z && t2 === l) return A;
                if (0 === e2.lookahead) break;
              }
              if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), e2.prev_length = e2.match_length, e2.prev_match = e2.match_start, e2.match_length = x - 1, 0 !== r2 && e2.prev_length < e2.max_lazy_match && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2), e2.match_length <= 5 && (1 === e2.strategy || e2.match_length === x && 4096 < e2.strstart - e2.match_start) && (e2.match_length = x - 1)), e2.prev_length >= x && e2.match_length <= e2.prev_length) {
                for (i2 = e2.strstart + e2.lookahead - x, n2 = u._tr_tally(e2, e2.strstart - 1 - e2.prev_match, e2.prev_length - x), e2.lookahead -= e2.prev_length - 1, e2.prev_length -= 2; ++e2.strstart <= i2 && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 != --e2.prev_length; ) ;
                if (e2.match_available = 0, e2.match_length = x - 1, e2.strstart++, n2 && (N(e2, false), 0 === e2.strm.avail_out)) return A;
              } else if (e2.match_available) {
                if ((n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1])) && N(e2, false), e2.strstart++, e2.lookahead--, 0 === e2.strm.avail_out) return A;
              } else e2.match_available = 1, e2.strstart++, e2.lookahead--;
            }
            return e2.match_available && (n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1]), e2.match_available = 0), e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
          }
          function M(e2, t2, r2, n2, i2) {
            this.good_length = e2, this.max_lazy = t2, this.nice_length = r2, this.max_chain = n2, this.func = i2;
          }
          function H() {
            this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new c.Buf16(2 * w), this.dyn_dtree = new c.Buf16(2 * (2 * a + 1)), this.bl_tree = new c.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new c.Buf16(k + 1), this.heap = new c.Buf16(2 * s + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new c.Buf16(2 * s + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
          }
          function G(e2) {
            var t2;
            return e2 && e2.state ? (e2.total_in = e2.total_out = 0, e2.data_type = i, (t2 = e2.state).pending = 0, t2.pending_out = 0, t2.wrap < 0 && (t2.wrap = -t2.wrap), t2.status = t2.wrap ? C : E, e2.adler = 2 === t2.wrap ? 0 : 1, t2.last_flush = l, u._tr_init(t2), m) : R(e2, _);
          }
          function K(e2) {
            var t2 = G(e2);
            return t2 === m && (function(e3) {
              e3.window_size = 2 * e3.w_size, D(e3.head), e3.max_lazy_match = h[e3.level].max_lazy, e3.good_match = h[e3.level].good_length, e3.nice_match = h[e3.level].nice_length, e3.max_chain_length = h[e3.level].max_chain, e3.strstart = 0, e3.block_start = 0, e3.lookahead = 0, e3.insert = 0, e3.match_length = e3.prev_length = x - 1, e3.match_available = 0, e3.ins_h = 0;
            })(e2.state), t2;
          }
          function Y(e2, t2, r2, n2, i2, s2) {
            if (!e2) return _;
            var a2 = 1;
            if (t2 === g && (t2 = 6), n2 < 0 ? (a2 = 0, n2 = -n2) : 15 < n2 && (a2 = 2, n2 -= 16), i2 < 1 || y < i2 || r2 !== v || n2 < 8 || 15 < n2 || t2 < 0 || 9 < t2 || s2 < 0 || b < s2) return R(e2, _);
            8 === n2 && (n2 = 9);
            var o2 = new H();
            return (e2.state = o2).strm = e2, o2.wrap = a2, o2.gzhead = null, o2.w_bits = n2, o2.w_size = 1 << o2.w_bits, o2.w_mask = o2.w_size - 1, o2.hash_bits = i2 + 7, o2.hash_size = 1 << o2.hash_bits, o2.hash_mask = o2.hash_size - 1, o2.hash_shift = ~~((o2.hash_bits + x - 1) / x), o2.window = new c.Buf8(2 * o2.w_size), o2.head = new c.Buf16(o2.hash_size), o2.prev = new c.Buf16(o2.w_size), o2.lit_bufsize = 1 << i2 + 6, o2.pending_buf_size = 4 * o2.lit_bufsize, o2.pending_buf = new c.Buf8(o2.pending_buf_size), o2.d_buf = 1 * o2.lit_bufsize, o2.l_buf = 3 * o2.lit_bufsize, o2.level = t2, o2.strategy = s2, o2.method = r2, K(e2);
          }
          h = [new M(0, 0, 0, 0, function(e2, t2) {
            var r2 = 65535;
            for (r2 > e2.pending_buf_size - 5 && (r2 = e2.pending_buf_size - 5); ; ) {
              if (e2.lookahead <= 1) {
                if (j(e2), 0 === e2.lookahead && t2 === l) return A;
                if (0 === e2.lookahead) break;
              }
              e2.strstart += e2.lookahead, e2.lookahead = 0;
              var n2 = e2.block_start + r2;
              if ((0 === e2.strstart || e2.strstart >= n2) && (e2.lookahead = e2.strstart - n2, e2.strstart = n2, N(e2, false), 0 === e2.strm.avail_out)) return A;
              if (e2.strstart - e2.block_start >= e2.w_size - z && (N(e2, false), 0 === e2.strm.avail_out)) return A;
            }
            return e2.insert = 0, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B) : (e2.strstart > e2.block_start && (N(e2, false), e2.strm.avail_out), A);
          }), new M(4, 4, 8, 4, Z), new M(4, 5, 16, 8, Z), new M(4, 6, 32, 32, Z), new M(4, 4, 16, 16, W), new M(8, 16, 32, 32, W), new M(8, 16, 128, 128, W), new M(8, 32, 128, 256, W), new M(32, 128, 258, 1024, W), new M(32, 258, 258, 4096, W)], r.deflateInit = function(e2, t2) {
            return Y(e2, t2, v, 15, 8, 0);
          }, r.deflateInit2 = Y, r.deflateReset = K, r.deflateResetKeep = G, r.deflateSetHeader = function(e2, t2) {
            return e2 && e2.state ? 2 !== e2.state.wrap ? _ : (e2.state.gzhead = t2, m) : _;
          }, r.deflate = function(e2, t2) {
            var r2, n2, i2, s2;
            if (!e2 || !e2.state || 5 < t2 || t2 < 0) return e2 ? R(e2, _) : _;
            if (n2 = e2.state, !e2.output || !e2.input && 0 !== e2.avail_in || 666 === n2.status && t2 !== f) return R(e2, 0 === e2.avail_out ? -5 : _);
            if (n2.strm = e2, r2 = n2.last_flush, n2.last_flush = t2, n2.status === C) if (2 === n2.wrap) e2.adler = 0, U(n2, 31), U(n2, 139), U(n2, 8), n2.gzhead ? (U(n2, (n2.gzhead.text ? 1 : 0) + (n2.gzhead.hcrc ? 2 : 0) + (n2.gzhead.extra ? 4 : 0) + (n2.gzhead.name ? 8 : 0) + (n2.gzhead.comment ? 16 : 0)), U(n2, 255 & n2.gzhead.time), U(n2, n2.gzhead.time >> 8 & 255), U(n2, n2.gzhead.time >> 16 & 255), U(n2, n2.gzhead.time >> 24 & 255), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 255 & n2.gzhead.os), n2.gzhead.extra && n2.gzhead.extra.length && (U(n2, 255 & n2.gzhead.extra.length), U(n2, n2.gzhead.extra.length >> 8 & 255)), n2.gzhead.hcrc && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending, 0)), n2.gzindex = 0, n2.status = 69) : (U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 3), n2.status = E);
            else {
              var a2 = v + (n2.w_bits - 8 << 4) << 8;
              a2 |= (2 <= n2.strategy || n2.level < 2 ? 0 : n2.level < 6 ? 1 : 6 === n2.level ? 2 : 3) << 6, 0 !== n2.strstart && (a2 |= 32), a2 += 31 - a2 % 31, n2.status = E, P(n2, a2), 0 !== n2.strstart && (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), e2.adler = 1;
            }
            if (69 === n2.status) if (n2.gzhead.extra) {
              for (i2 = n2.pending; n2.gzindex < (65535 & n2.gzhead.extra.length) && (n2.pending !== n2.pending_buf_size || (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending !== n2.pending_buf_size)); ) U(n2, 255 & n2.gzhead.extra[n2.gzindex]), n2.gzindex++;
              n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), n2.gzindex === n2.gzhead.extra.length && (n2.gzindex = 0, n2.status = 73);
            } else n2.status = 73;
            if (73 === n2.status) if (n2.gzhead.name) {
              i2 = n2.pending;
              do {
                if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                  s2 = 1;
                  break;
                }
                s2 = n2.gzindex < n2.gzhead.name.length ? 255 & n2.gzhead.name.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
              } while (0 !== s2);
              n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.gzindex = 0, n2.status = 91);
            } else n2.status = 91;
            if (91 === n2.status) if (n2.gzhead.comment) {
              i2 = n2.pending;
              do {
                if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                  s2 = 1;
                  break;
                }
                s2 = n2.gzindex < n2.gzhead.comment.length ? 255 & n2.gzhead.comment.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
              } while (0 !== s2);
              n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.status = 103);
            } else n2.status = 103;
            if (103 === n2.status && (n2.gzhead.hcrc ? (n2.pending + 2 > n2.pending_buf_size && F(e2), n2.pending + 2 <= n2.pending_buf_size && (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), e2.adler = 0, n2.status = E)) : n2.status = E), 0 !== n2.pending) {
              if (F(e2), 0 === e2.avail_out) return n2.last_flush = -1, m;
            } else if (0 === e2.avail_in && T(t2) <= T(r2) && t2 !== f) return R(e2, -5);
            if (666 === n2.status && 0 !== e2.avail_in) return R(e2, -5);
            if (0 !== e2.avail_in || 0 !== n2.lookahead || t2 !== l && 666 !== n2.status) {
              var o2 = 2 === n2.strategy ? (function(e3, t3) {
                for (var r3; ; ) {
                  if (0 === e3.lookahead && (j(e3), 0 === e3.lookahead)) {
                    if (t3 === l) return A;
                    break;
                  }
                  if (e3.match_length = 0, r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++, r3 && (N(e3, false), 0 === e3.strm.avail_out)) return A;
                }
                return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
              })(n2, t2) : 3 === n2.strategy ? (function(e3, t3) {
                for (var r3, n3, i3, s3, a3 = e3.window; ; ) {
                  if (e3.lookahead <= S) {
                    if (j(e3), e3.lookahead <= S && t3 === l) return A;
                    if (0 === e3.lookahead) break;
                  }
                  if (e3.match_length = 0, e3.lookahead >= x && 0 < e3.strstart && (n3 = a3[i3 = e3.strstart - 1]) === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3]) {
                    s3 = e3.strstart + S;
                    do {
                    } while (n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && i3 < s3);
                    e3.match_length = S - (s3 - i3), e3.match_length > e3.lookahead && (e3.match_length = e3.lookahead);
                  }
                  if (e3.match_length >= x ? (r3 = u._tr_tally(e3, 1, e3.match_length - x), e3.lookahead -= e3.match_length, e3.strstart += e3.match_length, e3.match_length = 0) : (r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++), r3 && (N(e3, false), 0 === e3.strm.avail_out)) return A;
                }
                return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
              })(n2, t2) : h[n2.level].func(n2, t2);
              if (o2 !== O && o2 !== B || (n2.status = 666), o2 === A || o2 === O) return 0 === e2.avail_out && (n2.last_flush = -1), m;
              if (o2 === I && (1 === t2 ? u._tr_align(n2) : 5 !== t2 && (u._tr_stored_block(n2, 0, 0, false), 3 === t2 && (D(n2.head), 0 === n2.lookahead && (n2.strstart = 0, n2.block_start = 0, n2.insert = 0))), F(e2), 0 === e2.avail_out)) return n2.last_flush = -1, m;
            }
            return t2 !== f ? m : n2.wrap <= 0 ? 1 : (2 === n2.wrap ? (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), U(n2, e2.adler >> 16 & 255), U(n2, e2.adler >> 24 & 255), U(n2, 255 & e2.total_in), U(n2, e2.total_in >> 8 & 255), U(n2, e2.total_in >> 16 & 255), U(n2, e2.total_in >> 24 & 255)) : (P(n2, e2.adler >>> 16), P(n2, 65535 & e2.adler)), F(e2), 0 < n2.wrap && (n2.wrap = -n2.wrap), 0 !== n2.pending ? m : 1);
          }, r.deflateEnd = function(e2) {
            var t2;
            return e2 && e2.state ? (t2 = e2.state.status) !== C && 69 !== t2 && 73 !== t2 && 91 !== t2 && 103 !== t2 && t2 !== E && 666 !== t2 ? R(e2, _) : (e2.state = null, t2 === E ? R(e2, -3) : m) : _;
          }, r.deflateSetDictionary = function(e2, t2) {
            var r2, n2, i2, s2, a2, o2, h2, u2, l2 = t2.length;
            if (!e2 || !e2.state) return _;
            if (2 === (s2 = (r2 = e2.state).wrap) || 1 === s2 && r2.status !== C || r2.lookahead) return _;
            for (1 === s2 && (e2.adler = d(e2.adler, t2, l2, 0)), r2.wrap = 0, l2 >= r2.w_size && (0 === s2 && (D(r2.head), r2.strstart = 0, r2.block_start = 0, r2.insert = 0), u2 = new c.Buf8(r2.w_size), c.arraySet(u2, t2, l2 - r2.w_size, r2.w_size, 0), t2 = u2, l2 = r2.w_size), a2 = e2.avail_in, o2 = e2.next_in, h2 = e2.input, e2.avail_in = l2, e2.next_in = 0, e2.input = t2, j(r2); r2.lookahead >= x; ) {
              for (n2 = r2.strstart, i2 = r2.lookahead - (x - 1); r2.ins_h = (r2.ins_h << r2.hash_shift ^ r2.window[n2 + x - 1]) & r2.hash_mask, r2.prev[n2 & r2.w_mask] = r2.head[r2.ins_h], r2.head[r2.ins_h] = n2, n2++, --i2; ) ;
              r2.strstart = n2, r2.lookahead = x - 1, j(r2);
            }
            return r2.strstart += r2.lookahead, r2.block_start = r2.strstart, r2.insert = r2.lookahead, r2.lookahead = 0, r2.match_length = r2.prev_length = x - 1, r2.match_available = 0, e2.next_in = o2, e2.input = h2, e2.avail_in = a2, r2.wrap = s2, m;
          }, r.deflateInfo = "pako deflate (from Nodeca project)";
        }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, t, r) {
          "use strict";
          t.exports = function() {
            this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
          };
        }, {}], 48: [function(e, t, r) {
          "use strict";
          t.exports = function(e2, t2) {
            var r2, n, i, s, a, o, h, u, l, f, c, d, p, m, _, g, b, v, y, w, k, x, S, z, C;
            r2 = e2.state, n = e2.next_in, z = e2.input, i = n + (e2.avail_in - 5), s = e2.next_out, C = e2.output, a = s - (t2 - e2.avail_out), o = s + (e2.avail_out - 257), h = r2.dmax, u = r2.wsize, l = r2.whave, f = r2.wnext, c = r2.window, d = r2.hold, p = r2.bits, m = r2.lencode, _ = r2.distcode, g = (1 << r2.lenbits) - 1, b = (1 << r2.distbits) - 1;
            e: do {
              p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = m[d & g];
              t: for (; ; ) {
                if (d >>>= y = v >>> 24, p -= y, 0 === (y = v >>> 16 & 255)) C[s++] = 65535 & v;
                else {
                  if (!(16 & y)) {
                    if (0 == (64 & y)) {
                      v = m[(65535 & v) + (d & (1 << y) - 1)];
                      continue t;
                    }
                    if (32 & y) {
                      r2.mode = 12;
                      break e;
                    }
                    e2.msg = "invalid literal/length code", r2.mode = 30;
                    break e;
                  }
                  w = 65535 & v, (y &= 15) && (p < y && (d += z[n++] << p, p += 8), w += d & (1 << y) - 1, d >>>= y, p -= y), p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = _[d & b];
                  r: for (; ; ) {
                    if (d >>>= y = v >>> 24, p -= y, !(16 & (y = v >>> 16 & 255))) {
                      if (0 == (64 & y)) {
                        v = _[(65535 & v) + (d & (1 << y) - 1)];
                        continue r;
                      }
                      e2.msg = "invalid distance code", r2.mode = 30;
                      break e;
                    }
                    if (k = 65535 & v, p < (y &= 15) && (d += z[n++] << p, (p += 8) < y && (d += z[n++] << p, p += 8)), h < (k += d & (1 << y) - 1)) {
                      e2.msg = "invalid distance too far back", r2.mode = 30;
                      break e;
                    }
                    if (d >>>= y, p -= y, (y = s - a) < k) {
                      if (l < (y = k - y) && r2.sane) {
                        e2.msg = "invalid distance too far back", r2.mode = 30;
                        break e;
                      }
                      if (S = c, (x = 0) === f) {
                        if (x += u - y, y < w) {
                          for (w -= y; C[s++] = c[x++], --y; ) ;
                          x = s - k, S = C;
                        }
                      } else if (f < y) {
                        if (x += u + f - y, (y -= f) < w) {
                          for (w -= y; C[s++] = c[x++], --y; ) ;
                          if (x = 0, f < w) {
                            for (w -= y = f; C[s++] = c[x++], --y; ) ;
                            x = s - k, S = C;
                          }
                        }
                      } else if (x += f - y, y < w) {
                        for (w -= y; C[s++] = c[x++], --y; ) ;
                        x = s - k, S = C;
                      }
                      for (; 2 < w; ) C[s++] = S[x++], C[s++] = S[x++], C[s++] = S[x++], w -= 3;
                      w && (C[s++] = S[x++], 1 < w && (C[s++] = S[x++]));
                    } else {
                      for (x = s - k; C[s++] = C[x++], C[s++] = C[x++], C[s++] = C[x++], 2 < (w -= 3); ) ;
                      w && (C[s++] = C[x++], 1 < w && (C[s++] = C[x++]));
                    }
                    break;
                  }
                }
                break;
              }
            } while (n < i && s < o);
            n -= w = p >> 3, d &= (1 << (p -= w << 3)) - 1, e2.next_in = n, e2.next_out = s, e2.avail_in = n < i ? i - n + 5 : 5 - (n - i), e2.avail_out = s < o ? o - s + 257 : 257 - (s - o), r2.hold = d, r2.bits = p;
          };
        }, {}], 49: [function(e, t, r) {
          "use strict";
          var I = e("../utils/common"), O = e("./adler32"), B = e("./crc32"), R = e("./inffast"), T = e("./inftrees"), D = 1, F = 2, N = 0, U = -2, P = 1, n = 852, i = 592;
          function L(e2) {
            return (e2 >>> 24 & 255) + (e2 >>> 8 & 65280) + ((65280 & e2) << 8) + ((255 & e2) << 24);
          }
          function s() {
            this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
          }
          function a(e2) {
            var t2;
            return e2 && e2.state ? (t2 = e2.state, e2.total_in = e2.total_out = t2.total = 0, e2.msg = "", t2.wrap && (e2.adler = 1 & t2.wrap), t2.mode = P, t2.last = 0, t2.havedict = 0, t2.dmax = 32768, t2.head = null, t2.hold = 0, t2.bits = 0, t2.lencode = t2.lendyn = new I.Buf32(n), t2.distcode = t2.distdyn = new I.Buf32(i), t2.sane = 1, t2.back = -1, N) : U;
          }
          function o(e2) {
            var t2;
            return e2 && e2.state ? ((t2 = e2.state).wsize = 0, t2.whave = 0, t2.wnext = 0, a(e2)) : U;
          }
          function h(e2, t2) {
            var r2, n2;
            return e2 && e2.state ? (n2 = e2.state, t2 < 0 ? (r2 = 0, t2 = -t2) : (r2 = 1 + (t2 >> 4), t2 < 48 && (t2 &= 15)), t2 && (t2 < 8 || 15 < t2) ? U : (null !== n2.window && n2.wbits !== t2 && (n2.window = null), n2.wrap = r2, n2.wbits = t2, o(e2))) : U;
          }
          function u(e2, t2) {
            var r2, n2;
            return e2 ? (n2 = new s(), (e2.state = n2).window = null, (r2 = h(e2, t2)) !== N && (e2.state = null), r2) : U;
          }
          var l, f, c = true;
          function j(e2) {
            if (c) {
              var t2;
              for (l = new I.Buf32(512), f = new I.Buf32(32), t2 = 0; t2 < 144; ) e2.lens[t2++] = 8;
              for (; t2 < 256; ) e2.lens[t2++] = 9;
              for (; t2 < 280; ) e2.lens[t2++] = 7;
              for (; t2 < 288; ) e2.lens[t2++] = 8;
              for (T(D, e2.lens, 0, 288, l, 0, e2.work, { bits: 9 }), t2 = 0; t2 < 32; ) e2.lens[t2++] = 5;
              T(F, e2.lens, 0, 32, f, 0, e2.work, { bits: 5 }), c = false;
            }
            e2.lencode = l, e2.lenbits = 9, e2.distcode = f, e2.distbits = 5;
          }
          function Z(e2, t2, r2, n2) {
            var i2, s2 = e2.state;
            return null === s2.window && (s2.wsize = 1 << s2.wbits, s2.wnext = 0, s2.whave = 0, s2.window = new I.Buf8(s2.wsize)), n2 >= s2.wsize ? (I.arraySet(s2.window, t2, r2 - s2.wsize, s2.wsize, 0), s2.wnext = 0, s2.whave = s2.wsize) : (n2 < (i2 = s2.wsize - s2.wnext) && (i2 = n2), I.arraySet(s2.window, t2, r2 - n2, i2, s2.wnext), (n2 -= i2) ? (I.arraySet(s2.window, t2, r2 - n2, n2, 0), s2.wnext = n2, s2.whave = s2.wsize) : (s2.wnext += i2, s2.wnext === s2.wsize && (s2.wnext = 0), s2.whave < s2.wsize && (s2.whave += i2))), 0;
          }
          r.inflateReset = o, r.inflateReset2 = h, r.inflateResetKeep = a, r.inflateInit = function(e2) {
            return u(e2, 15);
          }, r.inflateInit2 = u, r.inflate = function(e2, t2) {
            var r2, n2, i2, s2, a2, o2, h2, u2, l2, f2, c2, d, p, m, _, g, b, v, y, w, k, x, S, z, C = 0, E = new I.Buf8(4), A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
            if (!e2 || !e2.state || !e2.output || !e2.input && 0 !== e2.avail_in) return U;
            12 === (r2 = e2.state).mode && (r2.mode = 13), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, f2 = o2, c2 = h2, x = N;
            e: for (; ; ) switch (r2.mode) {
              case P:
                if (0 === r2.wrap) {
                  r2.mode = 13;
                  break;
                }
                for (; l2 < 16; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (2 & r2.wrap && 35615 === u2) {
                  E[r2.check = 0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0), l2 = u2 = 0, r2.mode = 2;
                  break;
                }
                if (r2.flags = 0, r2.head && (r2.head.done = false), !(1 & r2.wrap) || (((255 & u2) << 8) + (u2 >> 8)) % 31) {
                  e2.msg = "incorrect header check", r2.mode = 30;
                  break;
                }
                if (8 != (15 & u2)) {
                  e2.msg = "unknown compression method", r2.mode = 30;
                  break;
                }
                if (l2 -= 4, k = 8 + (15 & (u2 >>>= 4)), 0 === r2.wbits) r2.wbits = k;
                else if (k > r2.wbits) {
                  e2.msg = "invalid window size", r2.mode = 30;
                  break;
                }
                r2.dmax = 1 << k, e2.adler = r2.check = 1, r2.mode = 512 & u2 ? 10 : 12, l2 = u2 = 0;
                break;
              case 2:
                for (; l2 < 16; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (r2.flags = u2, 8 != (255 & r2.flags)) {
                  e2.msg = "unknown compression method", r2.mode = 30;
                  break;
                }
                if (57344 & r2.flags) {
                  e2.msg = "unknown header flags set", r2.mode = 30;
                  break;
                }
                r2.head && (r2.head.text = u2 >> 8 & 1), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 3;
              case 3:
                for (; l2 < 32; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.head && (r2.head.time = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, E[2] = u2 >>> 16 & 255, E[3] = u2 >>> 24 & 255, r2.check = B(r2.check, E, 4, 0)), l2 = u2 = 0, r2.mode = 4;
              case 4:
                for (; l2 < 16; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.head && (r2.head.xflags = 255 & u2, r2.head.os = u2 >> 8), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0, r2.mode = 5;
              case 5:
                if (1024 & r2.flags) {
                  for (; l2 < 16; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.length = u2, r2.head && (r2.head.extra_len = u2), 512 & r2.flags && (E[0] = 255 & u2, E[1] = u2 >>> 8 & 255, r2.check = B(r2.check, E, 2, 0)), l2 = u2 = 0;
                } else r2.head && (r2.head.extra = null);
                r2.mode = 6;
              case 6:
                if (1024 & r2.flags && (o2 < (d = r2.length) && (d = o2), d && (r2.head && (k = r2.head.extra_len - r2.length, r2.head.extra || (r2.head.extra = new Array(r2.head.extra_len)), I.arraySet(r2.head.extra, n2, s2, d, k)), 512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, r2.length -= d), r2.length)) break e;
                r2.length = 0, r2.mode = 7;
              case 7:
                if (2048 & r2.flags) {
                  if (0 === o2) break e;
                  for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.name += String.fromCharCode(k)), k && d < o2; ) ;
                  if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k) break e;
                } else r2.head && (r2.head.name = null);
                r2.length = 0, r2.mode = 8;
              case 8:
                if (4096 & r2.flags) {
                  if (0 === o2) break e;
                  for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.comment += String.fromCharCode(k)), k && d < o2; ) ;
                  if (512 & r2.flags && (r2.check = B(r2.check, n2, d, s2)), o2 -= d, s2 += d, k) break e;
                } else r2.head && (r2.head.comment = null);
                r2.mode = 9;
              case 9:
                if (512 & r2.flags) {
                  for (; l2 < 16; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (u2 !== (65535 & r2.check)) {
                    e2.msg = "header crc mismatch", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.head && (r2.head.hcrc = r2.flags >> 9 & 1, r2.head.done = true), e2.adler = r2.check = 0, r2.mode = 12;
                break;
              case 10:
                for (; l2 < 32; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                e2.adler = r2.check = L(u2), l2 = u2 = 0, r2.mode = 11;
              case 11:
                if (0 === r2.havedict) return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, 2;
                e2.adler = r2.check = 1, r2.mode = 12;
              case 12:
                if (5 === t2 || 6 === t2) break e;
              case 13:
                if (r2.last) {
                  u2 >>>= 7 & l2, l2 -= 7 & l2, r2.mode = 27;
                  break;
                }
                for (; l2 < 3; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                switch (r2.last = 1 & u2, l2 -= 1, 3 & (u2 >>>= 1)) {
                  case 0:
                    r2.mode = 14;
                    break;
                  case 1:
                    if (j(r2), r2.mode = 20, 6 !== t2) break;
                    u2 >>>= 2, l2 -= 2;
                    break e;
                  case 2:
                    r2.mode = 17;
                    break;
                  case 3:
                    e2.msg = "invalid block type", r2.mode = 30;
                }
                u2 >>>= 2, l2 -= 2;
                break;
              case 14:
                for (u2 >>>= 7 & l2, l2 -= 7 & l2; l2 < 32; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if ((65535 & u2) != (u2 >>> 16 ^ 65535)) {
                  e2.msg = "invalid stored block lengths", r2.mode = 30;
                  break;
                }
                if (r2.length = 65535 & u2, l2 = u2 = 0, r2.mode = 15, 6 === t2) break e;
              case 15:
                r2.mode = 16;
              case 16:
                if (d = r2.length) {
                  if (o2 < d && (d = o2), h2 < d && (d = h2), 0 === d) break e;
                  I.arraySet(i2, n2, s2, d, a2), o2 -= d, s2 += d, h2 -= d, a2 += d, r2.length -= d;
                  break;
                }
                r2.mode = 12;
                break;
              case 17:
                for (; l2 < 14; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (r2.nlen = 257 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ndist = 1 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ncode = 4 + (15 & u2), u2 >>>= 4, l2 -= 4, 286 < r2.nlen || 30 < r2.ndist) {
                  e2.msg = "too many length or distance symbols", r2.mode = 30;
                  break;
                }
                r2.have = 0, r2.mode = 18;
              case 18:
                for (; r2.have < r2.ncode; ) {
                  for (; l2 < 3; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.lens[A[r2.have++]] = 7 & u2, u2 >>>= 3, l2 -= 3;
                }
                for (; r2.have < 19; ) r2.lens[A[r2.have++]] = 0;
                if (r2.lencode = r2.lendyn, r2.lenbits = 7, S = { bits: r2.lenbits }, x = T(0, r2.lens, 0, 19, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                  e2.msg = "invalid code lengths set", r2.mode = 30;
                  break;
                }
                r2.have = 0, r2.mode = 19;
              case 19:
                for (; r2.have < r2.nlen + r2.ndist; ) {
                  for (; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (b < 16) u2 >>>= _, l2 -= _, r2.lens[r2.have++] = b;
                  else {
                    if (16 === b) {
                      for (z = _ + 2; l2 < z; ) {
                        if (0 === o2) break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      if (u2 >>>= _, l2 -= _, 0 === r2.have) {
                        e2.msg = "invalid bit length repeat", r2.mode = 30;
                        break;
                      }
                      k = r2.lens[r2.have - 1], d = 3 + (3 & u2), u2 >>>= 2, l2 -= 2;
                    } else if (17 === b) {
                      for (z = _ + 3; l2 < z; ) {
                        if (0 === o2) break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      l2 -= _, k = 0, d = 3 + (7 & (u2 >>>= _)), u2 >>>= 3, l2 -= 3;
                    } else {
                      for (z = _ + 7; l2 < z; ) {
                        if (0 === o2) break e;
                        o2--, u2 += n2[s2++] << l2, l2 += 8;
                      }
                      l2 -= _, k = 0, d = 11 + (127 & (u2 >>>= _)), u2 >>>= 7, l2 -= 7;
                    }
                    if (r2.have + d > r2.nlen + r2.ndist) {
                      e2.msg = "invalid bit length repeat", r2.mode = 30;
                      break;
                    }
                    for (; d--; ) r2.lens[r2.have++] = k;
                  }
                }
                if (30 === r2.mode) break;
                if (0 === r2.lens[256]) {
                  e2.msg = "invalid code -- missing end-of-block", r2.mode = 30;
                  break;
                }
                if (r2.lenbits = 9, S = { bits: r2.lenbits }, x = T(D, r2.lens, 0, r2.nlen, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                  e2.msg = "invalid literal/lengths set", r2.mode = 30;
                  break;
                }
                if (r2.distbits = 6, r2.distcode = r2.distdyn, S = { bits: r2.distbits }, x = T(F, r2.lens, r2.nlen, r2.ndist, r2.distcode, 0, r2.work, S), r2.distbits = S.bits, x) {
                  e2.msg = "invalid distances set", r2.mode = 30;
                  break;
                }
                if (r2.mode = 20, 6 === t2) break e;
              case 20:
                r2.mode = 21;
              case 21:
                if (6 <= o2 && 258 <= h2) {
                  e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, R(e2, c2), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, 12 === r2.mode && (r2.back = -1);
                  break;
                }
                for (r2.back = 0; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (g && 0 == (240 & g)) {
                  for (v = _, y = g, w = b; g = (C = r2.lencode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  u2 >>>= v, l2 -= v, r2.back += v;
                }
                if (u2 >>>= _, l2 -= _, r2.back += _, r2.length = b, 0 === g) {
                  r2.mode = 26;
                  break;
                }
                if (32 & g) {
                  r2.back = -1, r2.mode = 12;
                  break;
                }
                if (64 & g) {
                  e2.msg = "invalid literal/length code", r2.mode = 30;
                  break;
                }
                r2.extra = 15 & g, r2.mode = 22;
              case 22:
                if (r2.extra) {
                  for (z = r2.extra; l2 < z; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.length += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
                }
                r2.was = r2.length, r2.mode = 23;
              case 23:
                for (; g = (C = r2.distcode[u2 & (1 << r2.distbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (0 == (240 & g)) {
                  for (v = _, y = g, w = b; g = (C = r2.distcode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  u2 >>>= v, l2 -= v, r2.back += v;
                }
                if (u2 >>>= _, l2 -= _, r2.back += _, 64 & g) {
                  e2.msg = "invalid distance code", r2.mode = 30;
                  break;
                }
                r2.offset = b, r2.extra = 15 & g, r2.mode = 24;
              case 24:
                if (r2.extra) {
                  for (z = r2.extra; l2 < z; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  r2.offset += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
                }
                if (r2.offset > r2.dmax) {
                  e2.msg = "invalid distance too far back", r2.mode = 30;
                  break;
                }
                r2.mode = 25;
              case 25:
                if (0 === h2) break e;
                if (d = c2 - h2, r2.offset > d) {
                  if ((d = r2.offset - d) > r2.whave && r2.sane) {
                    e2.msg = "invalid distance too far back", r2.mode = 30;
                    break;
                  }
                  p = d > r2.wnext ? (d -= r2.wnext, r2.wsize - d) : r2.wnext - d, d > r2.length && (d = r2.length), m = r2.window;
                } else m = i2, p = a2 - r2.offset, d = r2.length;
                for (h2 < d && (d = h2), h2 -= d, r2.length -= d; i2[a2++] = m[p++], --d; ) ;
                0 === r2.length && (r2.mode = 21);
                break;
              case 26:
                if (0 === h2) break e;
                i2[a2++] = r2.length, h2--, r2.mode = 21;
                break;
              case 27:
                if (r2.wrap) {
                  for (; l2 < 32; ) {
                    if (0 === o2) break e;
                    o2--, u2 |= n2[s2++] << l2, l2 += 8;
                  }
                  if (c2 -= h2, e2.total_out += c2, r2.total += c2, c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, a2 - c2) : O(r2.check, i2, c2, a2 - c2)), c2 = h2, (r2.flags ? u2 : L(u2)) !== r2.check) {
                    e2.msg = "incorrect data check", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.mode = 28;
              case 28:
                if (r2.wrap && r2.flags) {
                  for (; l2 < 32; ) {
                    if (0 === o2) break e;
                    o2--, u2 += n2[s2++] << l2, l2 += 8;
                  }
                  if (u2 !== (4294967295 & r2.total)) {
                    e2.msg = "incorrect length check", r2.mode = 30;
                    break;
                  }
                  l2 = u2 = 0;
                }
                r2.mode = 29;
              case 29:
                x = 1;
                break e;
              case 30:
                x = -3;
                break e;
              case 31:
                return -4;
              case 32:
              default:
                return U;
            }
            return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, (r2.wsize || c2 !== e2.avail_out && r2.mode < 30 && (r2.mode < 27 || 4 !== t2)) && Z(e2, e2.output, e2.next_out, c2 - e2.avail_out) ? (r2.mode = 31, -4) : (f2 -= e2.avail_in, c2 -= e2.avail_out, e2.total_in += f2, e2.total_out += c2, r2.total += c2, r2.wrap && c2 && (e2.adler = r2.check = r2.flags ? B(r2.check, i2, c2, e2.next_out - c2) : O(r2.check, i2, c2, e2.next_out - c2)), e2.data_type = r2.bits + (r2.last ? 64 : 0) + (12 === r2.mode ? 128 : 0) + (20 === r2.mode || 15 === r2.mode ? 256 : 0), (0 == f2 && 0 === c2 || 4 === t2) && x === N && (x = -5), x);
          }, r.inflateEnd = function(e2) {
            if (!e2 || !e2.state) return U;
            var t2 = e2.state;
            return t2.window && (t2.window = null), e2.state = null, N;
          }, r.inflateGetHeader = function(e2, t2) {
            var r2;
            return e2 && e2.state ? 0 == (2 & (r2 = e2.state).wrap) ? U : ((r2.head = t2).done = false, N) : U;
          }, r.inflateSetDictionary = function(e2, t2) {
            var r2, n2 = t2.length;
            return e2 && e2.state ? 0 !== (r2 = e2.state).wrap && 11 !== r2.mode ? U : 11 === r2.mode && O(1, t2, n2, 0) !== r2.check ? -3 : Z(e2, t2, n2, n2) ? (r2.mode = 31, -4) : (r2.havedict = 1, N) : U;
          }, r.inflateInfo = "pako inflate (from Nodeca project)";
        }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, t, r) {
          "use strict";
          var D = e("../utils/common"), F = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], U = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], P = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
          t.exports = function(e2, t2, r2, n, i, s, a, o) {
            var h, u, l, f, c, d, p, m, _, g = o.bits, b = 0, v = 0, y = 0, w = 0, k = 0, x = 0, S = 0, z = 0, C = 0, E = 0, A = null, I = 0, O = new D.Buf16(16), B = new D.Buf16(16), R = null, T = 0;
            for (b = 0; b <= 15; b++) O[b] = 0;
            for (v = 0; v < n; v++) O[t2[r2 + v]]++;
            for (k = g, w = 15; 1 <= w && 0 === O[w]; w--) ;
            if (w < k && (k = w), 0 === w) return i[s++] = 20971520, i[s++] = 20971520, o.bits = 1, 0;
            for (y = 1; y < w && 0 === O[y]; y++) ;
            for (k < y && (k = y), b = z = 1; b <= 15; b++) if (z <<= 1, (z -= O[b]) < 0) return -1;
            if (0 < z && (0 === e2 || 1 !== w)) return -1;
            for (B[1] = 0, b = 1; b < 15; b++) B[b + 1] = B[b] + O[b];
            for (v = 0; v < n; v++) 0 !== t2[r2 + v] && (a[B[t2[r2 + v]]++] = v);
            if (d = 0 === e2 ? (A = R = a, 19) : 1 === e2 ? (A = F, I -= 257, R = N, T -= 257, 256) : (A = U, R = P, -1), b = y, c = s, S = v = E = 0, l = -1, f = (C = 1 << (x = k)) - 1, 1 === e2 && 852 < C || 2 === e2 && 592 < C) return 1;
            for (; ; ) {
              for (p = b - S, _ = a[v] < d ? (m = 0, a[v]) : a[v] > d ? (m = R[T + a[v]], A[I + a[v]]) : (m = 96, 0), h = 1 << b - S, y = u = 1 << x; i[c + (E >> S) + (u -= h)] = p << 24 | m << 16 | _ | 0, 0 !== u; ) ;
              for (h = 1 << b - 1; E & h; ) h >>= 1;
              if (0 !== h ? (E &= h - 1, E += h) : E = 0, v++, 0 == --O[b]) {
                if (b === w) break;
                b = t2[r2 + a[v]];
              }
              if (k < b && (E & f) !== l) {
                for (0 === S && (S = k), c += y, z = 1 << (x = b - S); x + S < w && !((z -= O[x + S]) <= 0); ) x++, z <<= 1;
                if (C += 1 << x, 1 === e2 && 852 < C || 2 === e2 && 592 < C) return 1;
                i[l = E & f] = k << 24 | x << 16 | c - s | 0;
              }
            }
            return 0 !== E && (i[c + E] = b - S << 24 | 64 << 16 | 0), o.bits = k, 0;
          };
        }, { "../utils/common": 41 }], 51: [function(e, t, r) {
          "use strict";
          t.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
        }, {}], 52: [function(e, t, r) {
          "use strict";
          var i = e("../utils/common"), o = 0, h = 1;
          function n(e2) {
            for (var t2 = e2.length; 0 <= --t2; ) e2[t2] = 0;
          }
          var s = 0, a = 29, u = 256, l = u + 1 + a, f = 30, c = 19, _ = 2 * l + 1, g = 15, d = 16, p = 7, m = 256, b = 16, v = 17, y = 18, w = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], S = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], z = new Array(2 * (l + 2));
          n(z);
          var C = new Array(2 * f);
          n(C);
          var E = new Array(512);
          n(E);
          var A = new Array(256);
          n(A);
          var I = new Array(a);
          n(I);
          var O, B, R, T = new Array(f);
          function D(e2, t2, r2, n2, i2) {
            this.static_tree = e2, this.extra_bits = t2, this.extra_base = r2, this.elems = n2, this.max_length = i2, this.has_stree = e2 && e2.length;
          }
          function F(e2, t2) {
            this.dyn_tree = e2, this.max_code = 0, this.stat_desc = t2;
          }
          function N(e2) {
            return e2 < 256 ? E[e2] : E[256 + (e2 >>> 7)];
          }
          function U(e2, t2) {
            e2.pending_buf[e2.pending++] = 255 & t2, e2.pending_buf[e2.pending++] = t2 >>> 8 & 255;
          }
          function P(e2, t2, r2) {
            e2.bi_valid > d - r2 ? (e2.bi_buf |= t2 << e2.bi_valid & 65535, U(e2, e2.bi_buf), e2.bi_buf = t2 >> d - e2.bi_valid, e2.bi_valid += r2 - d) : (e2.bi_buf |= t2 << e2.bi_valid & 65535, e2.bi_valid += r2);
          }
          function L(e2, t2, r2) {
            P(e2, r2[2 * t2], r2[2 * t2 + 1]);
          }
          function j(e2, t2) {
            for (var r2 = 0; r2 |= 1 & e2, e2 >>>= 1, r2 <<= 1, 0 < --t2; ) ;
            return r2 >>> 1;
          }
          function Z(e2, t2, r2) {
            var n2, i2, s2 = new Array(g + 1), a2 = 0;
            for (n2 = 1; n2 <= g; n2++) s2[n2] = a2 = a2 + r2[n2 - 1] << 1;
            for (i2 = 0; i2 <= t2; i2++) {
              var o2 = e2[2 * i2 + 1];
              0 !== o2 && (e2[2 * i2] = j(s2[o2]++, o2));
            }
          }
          function W(e2) {
            var t2;
            for (t2 = 0; t2 < l; t2++) e2.dyn_ltree[2 * t2] = 0;
            for (t2 = 0; t2 < f; t2++) e2.dyn_dtree[2 * t2] = 0;
            for (t2 = 0; t2 < c; t2++) e2.bl_tree[2 * t2] = 0;
            e2.dyn_ltree[2 * m] = 1, e2.opt_len = e2.static_len = 0, e2.last_lit = e2.matches = 0;
          }
          function M(e2) {
            8 < e2.bi_valid ? U(e2, e2.bi_buf) : 0 < e2.bi_valid && (e2.pending_buf[e2.pending++] = e2.bi_buf), e2.bi_buf = 0, e2.bi_valid = 0;
          }
          function H(e2, t2, r2, n2) {
            var i2 = 2 * t2, s2 = 2 * r2;
            return e2[i2] < e2[s2] || e2[i2] === e2[s2] && n2[t2] <= n2[r2];
          }
          function G(e2, t2, r2) {
            for (var n2 = e2.heap[r2], i2 = r2 << 1; i2 <= e2.heap_len && (i2 < e2.heap_len && H(t2, e2.heap[i2 + 1], e2.heap[i2], e2.depth) && i2++, !H(t2, n2, e2.heap[i2], e2.depth)); ) e2.heap[r2] = e2.heap[i2], r2 = i2, i2 <<= 1;
            e2.heap[r2] = n2;
          }
          function K(e2, t2, r2) {
            var n2, i2, s2, a2, o2 = 0;
            if (0 !== e2.last_lit) for (; n2 = e2.pending_buf[e2.d_buf + 2 * o2] << 8 | e2.pending_buf[e2.d_buf + 2 * o2 + 1], i2 = e2.pending_buf[e2.l_buf + o2], o2++, 0 === n2 ? L(e2, i2, t2) : (L(e2, (s2 = A[i2]) + u + 1, t2), 0 !== (a2 = w[s2]) && P(e2, i2 -= I[s2], a2), L(e2, s2 = N(--n2), r2), 0 !== (a2 = k[s2]) && P(e2, n2 -= T[s2], a2)), o2 < e2.last_lit; ) ;
            L(e2, m, t2);
          }
          function Y(e2, t2) {
            var r2, n2, i2, s2 = t2.dyn_tree, a2 = t2.stat_desc.static_tree, o2 = t2.stat_desc.has_stree, h2 = t2.stat_desc.elems, u2 = -1;
            for (e2.heap_len = 0, e2.heap_max = _, r2 = 0; r2 < h2; r2++) 0 !== s2[2 * r2] ? (e2.heap[++e2.heap_len] = u2 = r2, e2.depth[r2] = 0) : s2[2 * r2 + 1] = 0;
            for (; e2.heap_len < 2; ) s2[2 * (i2 = e2.heap[++e2.heap_len] = u2 < 2 ? ++u2 : 0)] = 1, e2.depth[i2] = 0, e2.opt_len--, o2 && (e2.static_len -= a2[2 * i2 + 1]);
            for (t2.max_code = u2, r2 = e2.heap_len >> 1; 1 <= r2; r2--) G(e2, s2, r2);
            for (i2 = h2; r2 = e2.heap[1], e2.heap[1] = e2.heap[e2.heap_len--], G(e2, s2, 1), n2 = e2.heap[1], e2.heap[--e2.heap_max] = r2, e2.heap[--e2.heap_max] = n2, s2[2 * i2] = s2[2 * r2] + s2[2 * n2], e2.depth[i2] = (e2.depth[r2] >= e2.depth[n2] ? e2.depth[r2] : e2.depth[n2]) + 1, s2[2 * r2 + 1] = s2[2 * n2 + 1] = i2, e2.heap[1] = i2++, G(e2, s2, 1), 2 <= e2.heap_len; ) ;
            e2.heap[--e2.heap_max] = e2.heap[1], (function(e3, t3) {
              var r3, n3, i3, s3, a3, o3, h3 = t3.dyn_tree, u3 = t3.max_code, l2 = t3.stat_desc.static_tree, f2 = t3.stat_desc.has_stree, c2 = t3.stat_desc.extra_bits, d2 = t3.stat_desc.extra_base, p2 = t3.stat_desc.max_length, m2 = 0;
              for (s3 = 0; s3 <= g; s3++) e3.bl_count[s3] = 0;
              for (h3[2 * e3.heap[e3.heap_max] + 1] = 0, r3 = e3.heap_max + 1; r3 < _; r3++) p2 < (s3 = h3[2 * h3[2 * (n3 = e3.heap[r3]) + 1] + 1] + 1) && (s3 = p2, m2++), h3[2 * n3 + 1] = s3, u3 < n3 || (e3.bl_count[s3]++, a3 = 0, d2 <= n3 && (a3 = c2[n3 - d2]), o3 = h3[2 * n3], e3.opt_len += o3 * (s3 + a3), f2 && (e3.static_len += o3 * (l2[2 * n3 + 1] + a3)));
              if (0 !== m2) {
                do {
                  for (s3 = p2 - 1; 0 === e3.bl_count[s3]; ) s3--;
                  e3.bl_count[s3]--, e3.bl_count[s3 + 1] += 2, e3.bl_count[p2]--, m2 -= 2;
                } while (0 < m2);
                for (s3 = p2; 0 !== s3; s3--) for (n3 = e3.bl_count[s3]; 0 !== n3; ) u3 < (i3 = e3.heap[--r3]) || (h3[2 * i3 + 1] !== s3 && (e3.opt_len += (s3 - h3[2 * i3 + 1]) * h3[2 * i3], h3[2 * i3 + 1] = s3), n3--);
              }
            })(e2, t2), Z(s2, u2, e2.bl_count);
          }
          function X(e2, t2, r2) {
            var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
            for (0 === a2 && (h2 = 138, u2 = 3), t2[2 * (r2 + 1) + 1] = 65535, n2 = 0; n2 <= r2; n2++) i2 = a2, a2 = t2[2 * (n2 + 1) + 1], ++o2 < h2 && i2 === a2 || (o2 < u2 ? e2.bl_tree[2 * i2] += o2 : 0 !== i2 ? (i2 !== s2 && e2.bl_tree[2 * i2]++, e2.bl_tree[2 * b]++) : o2 <= 10 ? e2.bl_tree[2 * v]++ : e2.bl_tree[2 * y]++, s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4));
          }
          function V(e2, t2, r2) {
            var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
            for (0 === a2 && (h2 = 138, u2 = 3), n2 = 0; n2 <= r2; n2++) if (i2 = a2, a2 = t2[2 * (n2 + 1) + 1], !(++o2 < h2 && i2 === a2)) {
              if (o2 < u2) for (; L(e2, i2, e2.bl_tree), 0 != --o2; ) ;
              else 0 !== i2 ? (i2 !== s2 && (L(e2, i2, e2.bl_tree), o2--), L(e2, b, e2.bl_tree), P(e2, o2 - 3, 2)) : o2 <= 10 ? (L(e2, v, e2.bl_tree), P(e2, o2 - 3, 3)) : (L(e2, y, e2.bl_tree), P(e2, o2 - 11, 7));
              s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4);
            }
          }
          n(T);
          var q = false;
          function J(e2, t2, r2, n2) {
            P(e2, (s << 1) + (n2 ? 1 : 0), 3), (function(e3, t3, r3, n3) {
              M(e3), n3 && (U(e3, r3), U(e3, ~r3)), i.arraySet(e3.pending_buf, e3.window, t3, r3, e3.pending), e3.pending += r3;
            })(e2, t2, r2, true);
          }
          r._tr_init = function(e2) {
            q || ((function() {
              var e3, t2, r2, n2, i2, s2 = new Array(g + 1);
              for (n2 = r2 = 0; n2 < a - 1; n2++) for (I[n2] = r2, e3 = 0; e3 < 1 << w[n2]; e3++) A[r2++] = n2;
              for (A[r2 - 1] = n2, n2 = i2 = 0; n2 < 16; n2++) for (T[n2] = i2, e3 = 0; e3 < 1 << k[n2]; e3++) E[i2++] = n2;
              for (i2 >>= 7; n2 < f; n2++) for (T[n2] = i2 << 7, e3 = 0; e3 < 1 << k[n2] - 7; e3++) E[256 + i2++] = n2;
              for (t2 = 0; t2 <= g; t2++) s2[t2] = 0;
              for (e3 = 0; e3 <= 143; ) z[2 * e3 + 1] = 8, e3++, s2[8]++;
              for (; e3 <= 255; ) z[2 * e3 + 1] = 9, e3++, s2[9]++;
              for (; e3 <= 279; ) z[2 * e3 + 1] = 7, e3++, s2[7]++;
              for (; e3 <= 287; ) z[2 * e3 + 1] = 8, e3++, s2[8]++;
              for (Z(z, l + 1, s2), e3 = 0; e3 < f; e3++) C[2 * e3 + 1] = 5, C[2 * e3] = j(e3, 5);
              O = new D(z, w, u + 1, l, g), B = new D(C, k, 0, f, g), R = new D(new Array(0), x, 0, c, p);
            })(), q = true), e2.l_desc = new F(e2.dyn_ltree, O), e2.d_desc = new F(e2.dyn_dtree, B), e2.bl_desc = new F(e2.bl_tree, R), e2.bi_buf = 0, e2.bi_valid = 0, W(e2);
          }, r._tr_stored_block = J, r._tr_flush_block = function(e2, t2, r2, n2) {
            var i2, s2, a2 = 0;
            0 < e2.level ? (2 === e2.strm.data_type && (e2.strm.data_type = (function(e3) {
              var t3, r3 = 4093624447;
              for (t3 = 0; t3 <= 31; t3++, r3 >>>= 1) if (1 & r3 && 0 !== e3.dyn_ltree[2 * t3]) return o;
              if (0 !== e3.dyn_ltree[18] || 0 !== e3.dyn_ltree[20] || 0 !== e3.dyn_ltree[26]) return h;
              for (t3 = 32; t3 < u; t3++) if (0 !== e3.dyn_ltree[2 * t3]) return h;
              return o;
            })(e2)), Y(e2, e2.l_desc), Y(e2, e2.d_desc), a2 = (function(e3) {
              var t3;
              for (X(e3, e3.dyn_ltree, e3.l_desc.max_code), X(e3, e3.dyn_dtree, e3.d_desc.max_code), Y(e3, e3.bl_desc), t3 = c - 1; 3 <= t3 && 0 === e3.bl_tree[2 * S[t3] + 1]; t3--) ;
              return e3.opt_len += 3 * (t3 + 1) + 5 + 5 + 4, t3;
            })(e2), i2 = e2.opt_len + 3 + 7 >>> 3, (s2 = e2.static_len + 3 + 7 >>> 3) <= i2 && (i2 = s2)) : i2 = s2 = r2 + 5, r2 + 4 <= i2 && -1 !== t2 ? J(e2, t2, r2, n2) : 4 === e2.strategy || s2 === i2 ? (P(e2, 2 + (n2 ? 1 : 0), 3), K(e2, z, C)) : (P(e2, 4 + (n2 ? 1 : 0), 3), (function(e3, t3, r3, n3) {
              var i3;
              for (P(e3, t3 - 257, 5), P(e3, r3 - 1, 5), P(e3, n3 - 4, 4), i3 = 0; i3 < n3; i3++) P(e3, e3.bl_tree[2 * S[i3] + 1], 3);
              V(e3, e3.dyn_ltree, t3 - 1), V(e3, e3.dyn_dtree, r3 - 1);
            })(e2, e2.l_desc.max_code + 1, e2.d_desc.max_code + 1, a2 + 1), K(e2, e2.dyn_ltree, e2.dyn_dtree)), W(e2), n2 && M(e2);
          }, r._tr_tally = function(e2, t2, r2) {
            return e2.pending_buf[e2.d_buf + 2 * e2.last_lit] = t2 >>> 8 & 255, e2.pending_buf[e2.d_buf + 2 * e2.last_lit + 1] = 255 & t2, e2.pending_buf[e2.l_buf + e2.last_lit] = 255 & r2, e2.last_lit++, 0 === t2 ? e2.dyn_ltree[2 * r2]++ : (e2.matches++, t2--, e2.dyn_ltree[2 * (A[r2] + u + 1)]++, e2.dyn_dtree[2 * N(t2)]++), e2.last_lit === e2.lit_bufsize - 1;
          }, r._tr_align = function(e2) {
            P(e2, 2, 3), L(e2, m, z), (function(e3) {
              16 === e3.bi_valid ? (U(e3, e3.bi_buf), e3.bi_buf = 0, e3.bi_valid = 0) : 8 <= e3.bi_valid && (e3.pending_buf[e3.pending++] = 255 & e3.bi_buf, e3.bi_buf >>= 8, e3.bi_valid -= 8);
            })(e2);
          };
        }, { "../utils/common": 41 }], 53: [function(e, t, r) {
          "use strict";
          t.exports = function() {
            this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
          };
        }, {}], 54: [function(e, t, r) {
          (function(e2) {
            !(function(r2, n) {
              "use strict";
              if (!r2.setImmediate) {
                var i, s, t2, a, o = 1, h = {}, u = false, l = r2.document, e3 = Object.getPrototypeOf && Object.getPrototypeOf(r2);
                e3 = e3 && e3.setTimeout ? e3 : r2, i = "[object process]" === {}.toString.call(r2.process) ? function(e4) {
                  process.nextTick(function() {
                    c(e4);
                  });
                } : (function() {
                  if (r2.postMessage && !r2.importScripts) {
                    var e4 = true, t3 = r2.onmessage;
                    return r2.onmessage = function() {
                      e4 = false;
                    }, r2.postMessage("", "*"), r2.onmessage = t3, e4;
                  }
                })() ? (a = "setImmediate$" + Math.random() + "$", r2.addEventListener ? r2.addEventListener("message", d, false) : r2.attachEvent("onmessage", d), function(e4) {
                  r2.postMessage(a + e4, "*");
                }) : r2.MessageChannel ? ((t2 = new MessageChannel()).port1.onmessage = function(e4) {
                  c(e4.data);
                }, function(e4) {
                  t2.port2.postMessage(e4);
                }) : l && "onreadystatechange" in l.createElement("script") ? (s = l.documentElement, function(e4) {
                  var t3 = l.createElement("script");
                  t3.onreadystatechange = function() {
                    c(e4), t3.onreadystatechange = null, s.removeChild(t3), t3 = null;
                  }, s.appendChild(t3);
                }) : function(e4) {
                  setTimeout(c, 0, e4);
                }, e3.setImmediate = function(e4) {
                  "function" != typeof e4 && (e4 = new Function("" + e4));
                  for (var t3 = new Array(arguments.length - 1), r3 = 0; r3 < t3.length; r3++) t3[r3] = arguments[r3 + 1];
                  var n2 = { callback: e4, args: t3 };
                  return h[o] = n2, i(o), o++;
                }, e3.clearImmediate = f;
              }
              function f(e4) {
                delete h[e4];
              }
              function c(e4) {
                if (u) setTimeout(c, 0, e4);
                else {
                  var t3 = h[e4];
                  if (t3) {
                    u = true;
                    try {
                      !(function(e5) {
                        var t4 = e5.callback, r3 = e5.args;
                        switch (r3.length) {
                          case 0:
                            t4();
                            break;
                          case 1:
                            t4(r3[0]);
                            break;
                          case 2:
                            t4(r3[0], r3[1]);
                            break;
                          case 3:
                            t4(r3[0], r3[1], r3[2]);
                            break;
                          default:
                            t4.apply(n, r3);
                        }
                      })(t3);
                    } finally {
                      f(e4), u = false;
                    }
                  }
                }
              }
              function d(e4) {
                e4.source === r2 && "string" == typeof e4.data && 0 === e4.data.indexOf(a) && c(+e4.data.slice(a.length));
              }
            })("undefined" == typeof self ? void 0 === e2 ? this : e2 : self);
          }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
        }, {}] }, {}, [10])(10);
      });
    }
  });

  // vendor/papaparse.min.js
  var require_papaparse_min = __commonJS({
    "vendor/papaparse.min.js"(exports, module) {
      ((e, t) => {
        "function" == typeof define && define.amd ? define([], t) : "object" == typeof module && "undefined" != typeof exports ? module.exports = t() : e.Papa = t();
      })(exports, function r() {
        var n = "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== n ? n : {};
        var d, s = !n.document && !!n.postMessage, a = n.IS_PAPA_WORKER || false, o = {}, h = 0, v = {};
        function u(e) {
          this._handle = null, this._finished = false, this._completed = false, this._halted = false, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = true, this._completeResults = { data: [], errors: [], meta: {} }, function(e2) {
            var t = b(e2);
            t.chunkSize = parseInt(t.chunkSize), e2.step || e2.chunk || (t.chunkSize = null);
            this._handle = new i(t), (this._handle.streamer = this)._config = t;
          }.call(this, e), this.parseChunk = function(t, e2) {
            var i2 = parseInt(this._config.skipFirstNLines) || 0;
            if (this.isFirstChunk && 0 < i2) {
              let e3 = this._config.newline;
              e3 || (r2 = this._config.quoteChar || '"', e3 = this._handle.guessLineEndings(t, r2)), t = [...t.split(e3).slice(i2)].join(e3);
            }
            this.isFirstChunk && U(this._config.beforeFirstChunk) && void 0 !== (r2 = this._config.beforeFirstChunk(t)) && (t = r2), this.isFirstChunk = false, this._halted = false;
            var i2 = this._partialLine + t, r2 = (this._partialLine = "", this._handle.parse(i2, this._baseIndex, !this._finished));
            if (!this._handle.paused() && !this._handle.aborted()) {
              t = r2.meta.cursor, i2 = (this._finished || (this._partialLine = i2.substring(t - this._baseIndex), this._baseIndex = t), r2 && r2.data && (this._rowCount += r2.data.length), this._finished || this._config.preview && this._rowCount >= this._config.preview);
              if (a) n.postMessage({ results: r2, workerId: v.WORKER_ID, finished: i2 });
              else if (U(this._config.chunk) && !e2) {
                if (this._config.chunk(r2, this._handle), this._handle.paused() || this._handle.aborted()) return void (this._halted = true);
                this._completeResults = r2 = void 0;
              }
              return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(r2.data), this._completeResults.errors = this._completeResults.errors.concat(r2.errors), this._completeResults.meta = r2.meta), this._completed || !i2 || !U(this._config.complete) || r2 && r2.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = true), i2 || r2 && r2.meta.paused || this._nextChunk(), r2;
            }
            this._halted = true;
          }, this._sendError = function(e2) {
            U(this._config.error) ? this._config.error(e2) : a && this._config.error && n.postMessage({ workerId: v.WORKER_ID, error: e2, finished: false });
          };
        }
        function f(e) {
          var r2;
          (e = e || {}).chunkSize || (e.chunkSize = v.RemoteChunkSize), u.call(this, e), this._nextChunk = s ? function() {
            this._readChunk(), this._chunkLoaded();
          } : function() {
            this._readChunk();
          }, this.stream = function(e2) {
            this._input = e2, this._nextChunk();
          }, this._readChunk = function() {
            if (this._finished) this._chunkLoaded();
            else {
              if (r2 = new XMLHttpRequest(), this._config.withCredentials && (r2.withCredentials = this._config.withCredentials), s || (r2.onload = y(this._chunkLoaded, this), r2.onerror = y(this._chunkError, this)), r2.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !s), this._config.downloadRequestHeaders) {
                var e2, t = this._config.downloadRequestHeaders;
                for (e2 in t) r2.setRequestHeader(e2, t[e2]);
              }
              var i2;
              this._config.chunkSize && (i2 = this._start + this._config.chunkSize - 1, r2.setRequestHeader("Range", "bytes=" + this._start + "-" + i2));
              try {
                r2.send(this._config.downloadRequestBody);
              } catch (e3) {
                this._chunkError(e3.message);
              }
              s && 0 === r2.status && this._chunkError();
            }
          }, this._chunkLoaded = function() {
            4 === r2.readyState && (r2.status < 200 || 400 <= r2.status ? this._chunkError() : (this._start += this._config.chunkSize || r2.responseText.length, this._finished = !this._config.chunkSize || this._start >= ((e2) => null !== (e2 = e2.getResponseHeader("Content-Range")) ? parseInt(e2.substring(e2.lastIndexOf("/") + 1)) : -1)(r2), this.parseChunk(r2.responseText)));
          }, this._chunkError = function(e2) {
            e2 = r2.statusText || e2;
            this._sendError(new Error(e2));
          };
        }
        function l(e) {
          (e = e || {}).chunkSize || (e.chunkSize = v.LocalChunkSize), u.call(this, e);
          var i2, r2, n2 = "undefined" != typeof FileReader;
          this.stream = function(e2) {
            this._input = e2, r2 = e2.slice || e2.webkitSlice || e2.mozSlice, n2 ? ((i2 = new FileReader()).onload = y(this._chunkLoaded, this), i2.onerror = y(this._chunkError, this)) : i2 = new FileReaderSync(), this._nextChunk();
          }, this._nextChunk = function() {
            this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk();
          }, this._readChunk = function() {
            var e2 = this._input, t = (this._config.chunkSize && (t = Math.min(this._start + this._config.chunkSize, this._input.size), e2 = r2.call(e2, this._start, t)), i2.readAsText(e2, this._config.encoding));
            n2 || this._chunkLoaded({ target: { result: t } });
          }, this._chunkLoaded = function(e2) {
            this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(e2.target.result);
          }, this._chunkError = function() {
            this._sendError(i2.error);
          };
        }
        function c(e) {
          var i2;
          u.call(this, e = e || {}), this.stream = function(e2) {
            return i2 = e2, this._nextChunk();
          }, this._nextChunk = function() {
            var e2, t;
            if (!this._finished) return e2 = this._config.chunkSize, i2 = e2 ? (t = i2.substring(0, e2), i2.substring(e2)) : (t = i2, ""), this._finished = !i2, this.parseChunk(t);
          };
        }
        function p(e) {
          u.call(this, e = e || {});
          var t = [], i2 = true, r2 = false;
          this.pause = function() {
            u.prototype.pause.apply(this, arguments), this._input.pause();
          }, this.resume = function() {
            u.prototype.resume.apply(this, arguments), this._input.resume();
          }, this.stream = function(e2) {
            this._input = e2, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
          }, this._checkIsFinished = function() {
            r2 && 1 === t.length && (this._finished = true);
          }, this._nextChunk = function() {
            this._checkIsFinished(), t.length ? this.parseChunk(t.shift()) : i2 = true;
          }, this._streamData = y(function(e2) {
            try {
              t.push("string" == typeof e2 ? e2 : e2.toString(this._config.encoding)), i2 && (i2 = false, this._checkIsFinished(), this.parseChunk(t.shift()));
            } catch (e3) {
              this._streamError(e3);
            }
          }, this), this._streamError = y(function(e2) {
            this._streamCleanUp(), this._sendError(e2);
          }, this), this._streamEnd = y(function() {
            this._streamCleanUp(), r2 = true, this._streamData("");
          }, this), this._streamCleanUp = y(function() {
            this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
          }, this);
        }
        function i(m2) {
          var n2, s2, a2, t, o2 = Math.pow(2, 53), h2 = -o2, u2 = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/, d2 = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/, i2 = this, r2 = 0, f2 = 0, l2 = false, e = false, c2 = [], p2 = { data: [], errors: [], meta: {} };
          function y2(e2) {
            return "greedy" === m2.skipEmptyLines ? "" === e2.join("").trim() : 1 === e2.length && 0 === e2[0].length;
          }
          function g2() {
            if (p2 && a2 && (k("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + v.DefaultDelimiter + "'"), a2 = false), m2.skipEmptyLines && (p2.data = p2.data.filter(function(e3) {
              return !y2(e3);
            })), _2()) {
              let t3 = function(e3, t4) {
                U(m2.transformHeader) && (e3 = m2.transformHeader(e3, t4)), c2.push(e3);
              };
              var t2 = t3;
              if (p2) if (Array.isArray(p2.data[0])) {
                for (var e2 = 0; _2() && e2 < p2.data.length; e2++) p2.data[e2].forEach(t3);
                p2.data.splice(0, 1);
              } else p2.data.forEach(t3);
            }
            function i3(e3, t3) {
              for (var i4 = m2.header ? {} : [], r4 = 0; r4 < e3.length; r4++) {
                var n3 = r4, s3 = e3[r4], s3 = ((e4, t4) => ((e5) => (m2.dynamicTypingFunction && void 0 === m2.dynamicTyping[e5] && (m2.dynamicTyping[e5] = m2.dynamicTypingFunction(e5)), true === (m2.dynamicTyping[e5] || m2.dynamicTyping)))(e4) ? "true" === t4 || "TRUE" === t4 || "false" !== t4 && "FALSE" !== t4 && (((e5) => {
                  if (u2.test(e5)) {
                    e5 = parseFloat(e5);
                    if (h2 < e5 && e5 < o2) return 1;
                  }
                })(t4) ? parseFloat(t4) : d2.test(t4) ? new Date(t4) : "" === t4 ? null : t4) : t4)(n3 = m2.header ? r4 >= c2.length ? "__parsed_extra" : c2[r4] : n3, s3 = m2.transform ? m2.transform(s3, n3) : s3);
                "__parsed_extra" === n3 ? (i4[n3] = i4[n3] || [], i4[n3].push(s3)) : i4[n3] = s3;
              }
              return m2.header && (r4 > c2.length ? k("FieldMismatch", "TooManyFields", "Too many fields: expected " + c2.length + " fields but parsed " + r4, f2 + t3) : r4 < c2.length && k("FieldMismatch", "TooFewFields", "Too few fields: expected " + c2.length + " fields but parsed " + r4, f2 + t3)), i4;
            }
            var r3;
            p2 && (m2.header || m2.dynamicTyping || m2.transform) && (r3 = 1, !p2.data.length || Array.isArray(p2.data[0]) ? (p2.data = p2.data.map(i3), r3 = p2.data.length) : p2.data = i3(p2.data, 0), m2.header && p2.meta && (p2.meta.fields = c2), f2 += r3);
          }
          function _2() {
            return m2.header && 0 === c2.length;
          }
          function k(e2, t2, i3, r3) {
            e2 = { type: e2, code: t2, message: i3 };
            void 0 !== r3 && (e2.row = r3), p2.errors.push(e2);
          }
          U(m2.step) && (t = m2.step, m2.step = function(e2) {
            p2 = e2, _2() ? g2() : (g2(), 0 !== p2.data.length && (r2 += e2.data.length, m2.preview && r2 > m2.preview ? s2.abort() : (p2.data = p2.data[0], t(p2, i2))));
          }), this.parse = function(e2, t2, i3) {
            var r3 = m2.quoteChar || '"', r3 = (m2.newline || (m2.newline = this.guessLineEndings(e2, r3)), a2 = false, m2.delimiter ? U(m2.delimiter) && (m2.delimiter = m2.delimiter(e2), p2.meta.delimiter = m2.delimiter) : ((r3 = ((e3, t3, i4, r4, n3) => {
              var s3, a3, o3, h3;
              n3 = n3 || [",", "	", "|", ";", v.RECORD_SEP, v.UNIT_SEP];
              for (var u3 = 0; u3 < n3.length; u3++) {
                for (var d3, f3 = n3[u3], l3 = 0, c3 = 0, p3 = 0, g3 = (o3 = void 0, new E({ comments: r4, delimiter: f3, newline: t3, preview: 10 }).parse(e3)), _3 = 0; _3 < g3.data.length; _3++) i4 && y2(g3.data[_3]) ? p3++ : (d3 = g3.data[_3].length, c3 += d3, void 0 === o3 ? o3 = d3 : 0 < d3 && (l3 += Math.abs(d3 - o3), o3 = d3));
                0 < g3.data.length && (c3 /= g3.data.length - p3), (void 0 === a3 || l3 <= a3) && (void 0 === h3 || h3 < c3) && 1.99 < c3 && (a3 = l3, s3 = f3, h3 = c3);
              }
              return { successful: !!(m2.delimiter = s3), bestDelimiter: s3 };
            })(e2, m2.newline, m2.skipEmptyLines, m2.comments, m2.delimitersToGuess)).successful ? m2.delimiter = r3.bestDelimiter : (a2 = true, m2.delimiter = v.DefaultDelimiter), p2.meta.delimiter = m2.delimiter), b(m2));
            return m2.preview && m2.header && r3.preview++, n2 = e2, s2 = new E(r3), p2 = s2.parse(n2, t2, i3), g2(), l2 ? { meta: { paused: true } } : p2 || { meta: { paused: false } };
          }, this.paused = function() {
            return l2;
          }, this.pause = function() {
            l2 = true, s2.abort(), n2 = U(m2.chunk) ? "" : n2.substring(s2.getCharIndex());
          }, this.resume = function() {
            i2.streamer._halted ? (l2 = false, i2.streamer.parseChunk(n2, true)) : setTimeout(i2.resume, 3);
          }, this.aborted = function() {
            return e;
          }, this.abort = function() {
            e = true, s2.abort(), p2.meta.aborted = true, U(m2.complete) && m2.complete(p2), n2 = "";
          }, this.guessLineEndings = function(e2, t2) {
            e2 = e2.substring(0, 1048576);
            var t2 = new RegExp(P(t2) + "([^]*?)" + P(t2), "gm"), i3 = (e2 = e2.replace(t2, "")).split("\r"), t2 = e2.split("\n"), e2 = 1 < t2.length && t2[0].length < i3[0].length;
            if (1 === i3.length || e2) return "\n";
            for (var r3 = 0, n3 = 0; n3 < i3.length; n3++) "\n" === i3[n3][0] && r3++;
            return r3 >= i3.length / 2 ? "\r\n" : "\r";
          };
        }
        function P(e) {
          return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
        function E(C) {
          var S = (C = C || {}).delimiter, O = C.newline, x = C.comments, I = C.step, A = C.preview, T = C.fastMode, D = null, L = false, F = null == C.quoteChar ? '"' : C.quoteChar, j = F;
          if (void 0 !== C.escapeChar && (j = C.escapeChar), ("string" != typeof S || -1 < v.BAD_DELIMITERS.indexOf(S)) && (S = ","), x === S) throw new Error("Comment character same as delimiter");
          true === x ? x = "#" : ("string" != typeof x || -1 < v.BAD_DELIMITERS.indexOf(x)) && (x = false), "\n" !== O && "\r" !== O && "\r\n" !== O && (O = "\n");
          var z = 0, M = false;
          this.parse = function(i2, t, r2) {
            if ("string" != typeof i2) throw new Error("Input must be a string");
            var n2 = i2.length, e = S.length, s2 = O.length, a2 = x.length, o2 = U(I), h2 = [], u2 = [], d2 = [], f2 = z = 0;
            if (!i2) return w();
            if (T || false !== T && -1 === i2.indexOf(F)) {
              for (var l2 = i2.split(O), c2 = 0; c2 < l2.length; c2++) {
                if (d2 = l2[c2], z += d2.length, c2 !== l2.length - 1) z += O.length;
                else if (r2) return w();
                if (!x || d2.substring(0, a2) !== x) {
                  if (o2) {
                    if (h2 = [], k(d2.split(S)), R(), M) return w();
                  } else k(d2.split(S));
                  if (A && A <= c2) return h2 = h2.slice(0, A), w(true);
                }
              }
              return w();
            }
            for (var p2 = i2.indexOf(S, z), g2 = i2.indexOf(O, z), _2 = new RegExp(P(j) + P(F), "g"), m2 = i2.indexOf(F, z); ; ) if (i2[z] === F) for (m2 = z, z++; ; ) {
              if (-1 === (m2 = i2.indexOf(F, m2 + 1))) return r2 || u2.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: h2.length, index: z }), E2();
              if (m2 === n2 - 1) return E2(i2.substring(z, m2).replace(_2, F));
              if (F === j && i2[m2 + 1] === j) m2++;
              else if (F === j || 0 === m2 || i2[m2 - 1] !== j) {
                -1 !== p2 && p2 < m2 + 1 && (p2 = i2.indexOf(S, m2 + 1));
                var y2 = v2(-1 === (g2 = -1 !== g2 && g2 < m2 + 1 ? i2.indexOf(O, m2 + 1) : g2) ? p2 : Math.min(p2, g2));
                if (i2.substr(m2 + 1 + y2, e) === S) {
                  d2.push(i2.substring(z, m2).replace(_2, F)), i2[z = m2 + 1 + y2 + e] !== F && (m2 = i2.indexOf(F, z)), p2 = i2.indexOf(S, z), g2 = i2.indexOf(O, z);
                  break;
                }
                y2 = v2(g2);
                if (i2.substring(m2 + 1 + y2, m2 + 1 + y2 + s2) === O) {
                  if (d2.push(i2.substring(z, m2).replace(_2, F)), b2(m2 + 1 + y2 + s2), p2 = i2.indexOf(S, z), m2 = i2.indexOf(F, z), o2 && (R(), M)) return w();
                  if (A && h2.length >= A) return w(true);
                  break;
                }
                u2.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: h2.length, index: z }), m2++;
              }
            }
            else if (x && 0 === d2.length && i2.substring(z, z + a2) === x) {
              if (-1 === g2) return w();
              z = g2 + s2, g2 = i2.indexOf(O, z), p2 = i2.indexOf(S, z);
            } else if (-1 !== p2 && (p2 < g2 || -1 === g2)) d2.push(i2.substring(z, p2)), z = p2 + e, p2 = i2.indexOf(S, z);
            else {
              if (-1 === g2) break;
              if (d2.push(i2.substring(z, g2)), b2(g2 + s2), o2 && (R(), M)) return w();
              if (A && h2.length >= A) return w(true);
            }
            return E2();
            function k(e2) {
              h2.push(e2), f2 = z;
            }
            function v2(e2) {
              var t2 = 0;
              return t2 = -1 !== e2 && (e2 = i2.substring(m2 + 1, e2)) && "" === e2.trim() ? e2.length : t2;
            }
            function E2(e2) {
              return r2 || (void 0 === e2 && (e2 = i2.substring(z)), d2.push(e2), z = n2, k(d2), o2 && R()), w();
            }
            function b2(e2) {
              z = e2, k(d2), d2 = [], g2 = i2.indexOf(O, z);
            }
            function w(e2) {
              if (C.header && !t && h2.length && !L) {
                var s3 = h2[0], a3 = /* @__PURE__ */ Object.create(null), o3 = new Set(s3);
                let n3 = false;
                for (let r3 = 0; r3 < s3.length; r3++) {
                  let i3 = s3[r3];
                  if (a3[i3 = U(C.transformHeader) ? C.transformHeader(i3, r3) : i3]) {
                    let e3, t2 = a3[i3];
                    for (; e3 = i3 + "_" + t2, t2++, o3.has(e3); ) ;
                    o3.add(e3), s3[r3] = e3, a3[i3]++, n3 = true, (D = null === D ? {} : D)[e3] = i3;
                  } else a3[i3] = 1, s3[r3] = i3;
                  o3.add(i3);
                }
                n3 && console.warn("Duplicate headers found and renamed."), L = true;
              }
              return { data: h2, errors: u2, meta: { delimiter: S, linebreak: O, aborted: M, truncated: !!e2, cursor: f2 + (t || 0), renamedHeaders: D } };
            }
            function R() {
              I(w()), h2 = [], u2 = [];
            }
          }, this.abort = function() {
            M = true;
          }, this.getCharIndex = function() {
            return z;
          };
        }
        function g(e) {
          var t = e.data, i2 = o[t.workerId], r2 = false;
          if (t.error) i2.userError(t.error, t.file);
          else if (t.results && t.results.data) {
            var n2 = { abort: function() {
              r2 = true, _(t.workerId, { data: [], errors: [], meta: { aborted: true } });
            }, pause: m, resume: m };
            if (U(i2.userStep)) {
              for (var s2 = 0; s2 < t.results.data.length && (i2.userStep({ data: t.results.data[s2], errors: t.results.errors, meta: t.results.meta }, n2), !r2); s2++) ;
              delete t.results;
            } else U(i2.userChunk) && (i2.userChunk(t.results, n2, t.file), delete t.results);
          }
          t.finished && !r2 && _(t.workerId, t.results);
        }
        function _(e, t) {
          var i2 = o[e];
          U(i2.userComplete) && i2.userComplete(t), i2.terminate(), delete o[e];
        }
        function m() {
          throw new Error("Not implemented.");
        }
        function b(e) {
          if ("object" != typeof e || null === e) return e;
          var t, i2 = Array.isArray(e) ? [] : {};
          for (t in e) i2[t] = b(e[t]);
          return i2;
        }
        function y(e, t) {
          return function() {
            e.apply(t, arguments);
          };
        }
        function U(e) {
          return "function" == typeof e;
        }
        return v.parse = function(e, t) {
          var i2 = (t = t || {}).dynamicTyping || false;
          U(i2) && (t.dynamicTypingFunction = i2, i2 = {});
          if (t.dynamicTyping = i2, t.transform = !!U(t.transform) && t.transform, !t.worker || !v.WORKERS_SUPPORTED) return i2 = null, v.NODE_STREAM_INPUT, "string" == typeof e ? (e = ((e2) => 65279 !== e2.charCodeAt(0) ? e2 : e2.slice(1))(e), i2 = new (t.download ? f : c)(t)) : true === e.readable && U(e.read) && U(e.on) ? i2 = new p(t) : (n.File && e instanceof File || e instanceof Object) && (i2 = new l(t)), i2.stream(e);
          (i2 = (() => {
            var e2;
            return !!v.WORKERS_SUPPORTED && (e2 = (() => {
              var e3 = n.URL || n.webkitURL || null, t2 = r.toString();
              return v.BLOB_URL || (v.BLOB_URL = e3.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ", "(", t2, ")();"], { type: "text/javascript" })));
            })(), (e2 = new n.Worker(e2)).onmessage = g, e2.id = h++, o[e2.id] = e2);
          })()).userStep = t.step, i2.userChunk = t.chunk, i2.userComplete = t.complete, i2.userError = t.error, t.step = U(t.step), t.chunk = U(t.chunk), t.complete = U(t.complete), t.error = U(t.error), delete t.worker, i2.postMessage({ input: e, config: t, workerId: i2.id });
        }, v.unparse = function(e, t) {
          var n2 = false, _2 = true, m2 = ",", y2 = "\r\n", s2 = '"', a2 = s2 + s2, i2 = false, r2 = null, o2 = false, h2 = ((() => {
            if ("object" == typeof t) {
              if ("string" != typeof t.delimiter || v.BAD_DELIMITERS.filter(function(e2) {
                return -1 !== t.delimiter.indexOf(e2);
              }).length || (m2 = t.delimiter), "boolean" != typeof t.quotes && "function" != typeof t.quotes && !Array.isArray(t.quotes) || (n2 = t.quotes), "boolean" != typeof t.skipEmptyLines && "string" != typeof t.skipEmptyLines || (i2 = t.skipEmptyLines), "string" == typeof t.newline && (y2 = t.newline), "string" == typeof t.quoteChar && (s2 = t.quoteChar), "boolean" == typeof t.header && (_2 = t.header), Array.isArray(t.columns)) {
                if (0 === t.columns.length) throw new Error("Option columns is empty");
                r2 = t.columns;
              }
              void 0 !== t.escapeChar && (a2 = t.escapeChar + s2), t.escapeFormulae instanceof RegExp ? o2 = t.escapeFormulae : "boolean" == typeof t.escapeFormulae && t.escapeFormulae && (o2 = /^[=+\-@\t\r].*$/);
            }
          })(), new RegExp(P(s2), "g"));
          "string" == typeof e && (e = JSON.parse(e));
          if (Array.isArray(e)) {
            if (!e.length || Array.isArray(e[0])) return u2(null, e, i2);
            if ("object" == typeof e[0]) return u2(r2 || Object.keys(e[0]), e, i2);
          } else if ("object" == typeof e) return "string" == typeof e.data && (e.data = JSON.parse(e.data)), Array.isArray(e.data) && (e.fields || (e.fields = e.meta && e.meta.fields || r2), e.fields || (e.fields = Array.isArray(e.data[0]) ? e.fields : "object" == typeof e.data[0] ? Object.keys(e.data[0]) : []), Array.isArray(e.data[0]) || "object" == typeof e.data[0] || (e.data = [e.data])), u2(e.fields || [], e.data || [], i2);
          throw new Error("Unable to serialize unrecognized input");
          function u2(e2, t2, i3) {
            var r3 = "", n3 = ("string" == typeof e2 && (e2 = JSON.parse(e2)), "string" == typeof t2 && (t2 = JSON.parse(t2)), Array.isArray(e2) && 0 < e2.length), s3 = !Array.isArray(t2[0]);
            if (n3 && _2) {
              for (var a3 = 0; a3 < e2.length; a3++) 0 < a3 && (r3 += m2), r3 += k(e2[a3], a3);
              0 < t2.length && (r3 += y2);
            }
            for (var o3 = 0; o3 < t2.length; o3++) {
              var h3 = (n3 ? e2 : t2[o3]).length, u3 = false, d2 = n3 ? 0 === Object.keys(t2[o3]).length : 0 === t2[o3].length;
              if (i3 && !n3 && (u3 = "greedy" === i3 ? "" === t2[o3].join("").trim() : 1 === t2[o3].length && 0 === t2[o3][0].length), "greedy" === i3 && n3) {
                for (var f2 = [], l2 = 0; l2 < h3; l2++) {
                  var c2 = s3 ? e2[l2] : l2;
                  f2.push(t2[o3][c2]);
                }
                u3 = "" === f2.join("").trim();
              }
              if (!u3) {
                for (var p2 = 0; p2 < h3; p2++) {
                  0 < p2 && !d2 && (r3 += m2);
                  var g2 = n3 && s3 ? e2[p2] : p2;
                  r3 += k(t2[o3][g2], p2);
                }
                o3 < t2.length - 1 && (!i3 || 0 < h3 && !d2) && (r3 += y2);
              }
            }
            return r3;
          }
          function k(e2, t2) {
            var i3, r3;
            return null == e2 ? "" : e2.constructor === Date ? JSON.stringify(e2).slice(1, 25) : (r3 = false, o2 && "string" == typeof e2 && o2.test(e2) && (e2 = "'" + e2, r3 = true), i3 = e2.toString().replace(h2, a2), (r3 = r3 || true === n2 || "function" == typeof n2 && n2(e2, t2) || Array.isArray(n2) && n2[t2] || ((e3, t3) => {
              for (var i4 = 0; i4 < t3.length; i4++) if (-1 < e3.indexOf(t3[i4])) return true;
              return false;
            })(i3, v.BAD_DELIMITERS) || -1 < i3.indexOf(m2) || " " === i3.charAt(0) || " " === i3.charAt(i3.length - 1)) ? s2 + i3 + s2 : i3);
          }
        }, v.RECORD_SEP = String.fromCharCode(30), v.UNIT_SEP = String.fromCharCode(31), v.BYTE_ORDER_MARK = "\uFEFF", v.BAD_DELIMITERS = ["\r", "\n", '"', v.BYTE_ORDER_MARK], v.WORKERS_SUPPORTED = !s && !!n.Worker, v.NODE_STREAM_INPUT = 1, v.LocalChunkSize = 10485760, v.RemoteChunkSize = 5242880, v.DefaultDelimiter = ",", v.Parser = E, v.ParserHandle = i, v.NetworkStreamer = f, v.FileStreamer = l, v.StringStreamer = c, v.ReadableStreamStreamer = p, n.jQuery && ((d = n.jQuery).fn.parse = function(o2) {
          var i2 = o2.config || {}, h2 = [];
          return this.each(function(e2) {
            if (!("INPUT" === d(this).prop("tagName").toUpperCase() && "file" === d(this).attr("type").toLowerCase() && n.FileReader) || !this.files || 0 === this.files.length) return true;
            for (var t = 0; t < this.files.length; t++) h2.push({ file: this.files[t], inputElem: this, instanceConfig: d.extend({}, i2) });
          }), e(), this;
          function e() {
            if (0 === h2.length) U(o2.complete) && o2.complete();
            else {
              var e2, t, i3, r2, n2 = h2[0];
              if (U(o2.before)) {
                var s2 = o2.before(n2.file, n2.inputElem);
                if ("object" == typeof s2) {
                  if ("abort" === s2.action) return e2 = "AbortError", t = n2.file, i3 = n2.inputElem, r2 = s2.reason, void (U(o2.error) && o2.error({ name: e2 }, t, i3, r2));
                  if ("skip" === s2.action) return void u2();
                  "object" == typeof s2.config && (n2.instanceConfig = d.extend(n2.instanceConfig, s2.config));
                } else if ("skip" === s2) return void u2();
              }
              var a2 = n2.instanceConfig.complete;
              n2.instanceConfig.complete = function(e3) {
                U(a2) && a2(e3, n2.file, n2.inputElem), u2();
              }, v.parse(n2.file, n2.instanceConfig);
            }
          }
          function u2() {
            h2.splice(0, 1), e();
          }
        }), a && (n.onmessage = function(e) {
          e = e.data;
          void 0 === v.WORKER_ID && e && (v.WORKER_ID = e.workerId);
          "string" == typeof e.input ? n.postMessage({ workerId: v.WORKER_ID, results: v.parse(e.input, e.config), finished: true }) : (n.File && e.input instanceof File || e.input instanceof Object) && (e = v.parse(e.input, e.config)) && n.postMessage({ workerId: v.WORKER_ID, results: e, finished: true });
        }), (f.prototype = Object.create(u.prototype)).constructor = f, (l.prototype = Object.create(u.prototype)).constructor = l, (c.prototype = Object.create(c.prototype)).constructor = c, (p.prototype = Object.create(u.prototype)).constructor = p, v;
      });
    }
  });

  // js/v2/app-standalone.js
  var import_jszip_min2 = __toESM(require_jszip_min());
  var import_papaparse_min = __toESM(require_papaparse_min());

  // js/v2/core/events.js
  function createEventBus() {
    const handlers = /* @__PURE__ */ new Map();
    function on(eventName, fn) {
      if (!handlers.has(eventName)) handlers.set(eventName, /* @__PURE__ */ new Set());
      handlers.get(eventName).add(fn);
      return () => off(eventName, fn);
    }
    function off(eventName, fn) {
      const set = handlers.get(eventName);
      if (!set) return;
      set.delete(fn);
      if (set.size === 0) handlers.delete(eventName);
    }
    function emit(eventName, payload) {
      const set = handlers.get(eventName);
      if (!set) return;
      for (const fn of set) {
        try {
          fn(payload);
        } catch (err) {
          console.error("Event bus listener failed:", { eventName, err });
        }
      }
    }
    return { on, off, emit };
  }

  // js/v2/core/reducer.js
  var ActionTypes = {
    BOOTSTRAP_START: "BOOTSTRAP_START",
    BOOTSTRAP_READY: "BOOTSTRAP_READY",
    SET_ERROR: "SET_ERROR",
    CLEAR_ERROR: "CLEAR_ERROR",
    SET_CHARACTER: "SET_CHARACTER",
    SET_IMPORT_REPORT: "SET_IMPORT_REPORT",
    SET_DIRTY: "SET_DIRTY",
    SET_ACTIVE_CHARACTER_ID: "SET_ACTIVE_CHARACTER_ID"
  };
  function initialState() {
    return {
      app: {
        ready: false,
        bootstrapping: false,
        activeCharacterId: "",
        dirty: false,
        lastError: null,
        lastSavedUtc: ""
      },
      character: null,
      importReport: null
    };
  }
  function appReducer(state, action) {
    switch (action.type) {
      case ActionTypes.BOOTSTRAP_START:
        return {
          ...state,
          app: { ...state.app, bootstrapping: true, lastError: null }
        };
      case ActionTypes.BOOTSTRAP_READY:
        return {
          ...state,
          app: { ...state.app, bootstrapping: false, ready: true, lastError: null }
        };
      case ActionTypes.SET_ERROR:
        return {
          ...state,
          app: { ...state.app, lastError: action.error || "Unknown error" }
        };
      case ActionTypes.CLEAR_ERROR:
        return {
          ...state,
          app: { ...state.app, lastError: null }
        };
      case ActionTypes.SET_CHARACTER:
        return {
          ...state,
          character: action.character || null,
          app: {
            ...state.app,
            activeCharacterId: action.character?.meta?.id || state.app.activeCharacterId || "",
            dirty: Boolean(action.dirty),
            lastSavedUtc: action.lastSavedUtc || state.app.lastSavedUtc || ""
          }
        };
      case ActionTypes.SET_IMPORT_REPORT:
        return {
          ...state,
          importReport: action.report || null
        };
      case ActionTypes.SET_DIRTY:
        return {
          ...state,
          app: { ...state.app, dirty: Boolean(action.dirty) }
        };
      case ActionTypes.SET_ACTIVE_CHARACTER_ID:
        return {
          ...state,
          app: { ...state.app, activeCharacterId: action.id || "" }
        };
      default:
        return state;
    }
  }

  // js/v2/core/store.js
  function clone(value) {
    return structuredClone(value);
  }
  function nowIso() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  function withModifiedUtc(character) {
    if (!character || typeof character !== "object") return character;
    const out = clone(character);
    out.meta = out.meta || {};
    out.meta.modified_utc = nowIso();
    return out;
  }
  function createAppStore({ historyLimit = 50 } = {}) {
    let state = initialState();
    const subscribers = /* @__PURE__ */ new Set();
    const history = {
      past: [],
      future: [],
      limit: Math.max(1, historyLimit)
    };
    function notify(action) {
      const snapshot = clone(state);
      for (const fn of subscribers) fn(snapshot, action);
    }
    function commit(nextState, action) {
      state = nextState;
      notify(action);
      return clone(state);
    }
    function getState() {
      return clone(state);
    }
    function subscribe(fn) {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    }
    function dispatch(action) {
      const prev = state;
      const next = appReducer(prev, action);
      if (next === prev) return getState();
      return commit(next, action);
    }
    function pushHistory(characterBefore) {
      if (!characterBefore) return;
      history.past.push(clone(characterBefore));
      if (history.past.length > history.limit) history.past.shift();
      history.future = [];
    }
    function setCharacter(character, { dirty = false, pushUndo = false, lastSavedUtc = "" } = {}) {
      const prevCharacter = state.character;
      if (pushUndo && prevCharacter) pushHistory(prevCharacter);
      const nextCharacter = withModifiedUtc(character);
      return dispatch({
        type: ActionTypes.SET_CHARACTER,
        character: nextCharacter,
        dirty,
        lastSavedUtc
      });
    }
    function updateCharacter(mutator, { label = "character.update" } = {}) {
      if (!state.character) return getState();
      const before = clone(state.character);
      const after = clone(state.character);
      mutator(after);
      pushHistory(before);
      return setCharacter(after, { dirty: true, pushUndo: false, lastSavedUtc: "", label });
    }
    function canUndo() {
      return history.past.length > 0;
    }
    function canRedo() {
      return history.future.length > 0;
    }
    function undo() {
      if (!canUndo()) return getState();
      const previous = history.past.pop();
      if (state.character) history.future.push(clone(state.character));
      return setCharacter(previous, { dirty: true, pushUndo: false });
    }
    function redo() {
      if (!canRedo()) return getState();
      const next = history.future.pop();
      if (state.character) history.past.push(clone(state.character));
      return setCharacter(next, { dirty: true, pushUndo: false });
    }
    function clearHistory() {
      history.past = [];
      history.future = [];
    }
    return {
      getState,
      subscribe,
      dispatch,
      setCharacter,
      updateCharacter,
      canUndo,
      canRedo,
      undo,
      redo,
      clearHistory,
      actionTypes: ActionTypes
    };
  }

  // js/v2/storage/constants.js
  var DB_NAME = "living-codex-v2";
  var DB_VERSION = 3;
  var STORES = {
    CHARACTERS: "characters",
    APP: "app"
  };
  var APP_KEYS = {
    ACTIVE_CHARACTER_ID: "activeCharacterId",
    LAST_OPENED_AT: "lastOpenedAt",
    STORAGE_VERSION: "storageVersion"
  };

  // js/v2/storage/integrity.js
  function isPlainObject(value) {
    return value != null && typeof value === "object" && !Array.isArray(value);
  }
  function stableSortValue(value) {
    if (Array.isArray(value)) return value.map(stableSortValue);
    if (!isPlainObject(value)) return value;
    const keys = Object.keys(value).sort((a, b) => a.localeCompare(b));
    const out = {};
    for (const key of keys) {
      out[key] = stableSortValue(value[key]);
    }
    return out;
  }
  function stableStringify(value) {
    return JSON.stringify(stableSortValue(value));
  }
  function fallbackHash(text) {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return `fnv32-${(hash >>> 0).toString(16).padStart(8, "0")}`;
  }
  function bytesToHex(buf) {
    const view = new Uint8Array(buf);
    let out = "";
    for (let i = 0; i < view.length; i++) out += view[i].toString(16).padStart(2, "0");
    return out;
  }
  async function hashCharacterPayload(character) {
    const text = stableStringify(character);
    if (typeof crypto !== "undefined" && crypto.subtle && typeof TextEncoder !== "undefined") {
      const data = new TextEncoder().encode(text);
      const digest = await crypto.subtle.digest("SHA-256", data);
      return `sha256-${bytesToHex(digest)}`;
    }
    return fallbackHash(text);
  }
  async function verifyCharacterPayload(character, expectedHash) {
    const actual = await hashCharacterPayload(character);
    return {
      ok: actual === expectedHash,
      actual,
      expected: expectedHash || ""
    };
  }

  // js/v2/storage/migrations.js
  function runMigrations(db, tx, oldVersion, newVersion) {
    for (let version = oldVersion + 1; version <= newVersion; version++) {
      if (version === 1) migrateToV1(db, tx);
      if (version === 2) migrateToV2(db, tx);
      if (version === 3) migrateToV3(db, tx);
    }
  }
  function migrateToV1(db, tx) {
    if (!db.objectStoreNames.contains(STORES.CHARACTERS)) {
      const characters = db.createObjectStore(STORES.CHARACTERS, { keyPath: "id" });
      characters.createIndex("by_modified", "saved_utc", { unique: false });
      characters.createIndex("by_ruleset", "ruleset_id", { unique: false });
    }
    if (!db.objectStoreNames.contains(STORES.APP)) {
      db.createObjectStore(STORES.APP, { keyPath: "key" });
    }
    const appStore = tx.objectStore(STORES.APP);
    appStore.put({ key: APP_KEYS.STORAGE_VERSION, value: 1 });
  }
  function migrateToV2(db, tx) {
    if (!db.objectStoreNames.contains(STORES.CHARACTERS)) {
      const characters = db.createObjectStore(STORES.CHARACTERS, { keyPath: "id" });
      characters.createIndex("by_modified", "saved_utc", { unique: false });
      characters.createIndex("by_ruleset", "ruleset_id", { unique: false });
    } else {
      const characters = tx.objectStore(STORES.CHARACTERS);
      if (!characters.indexNames.contains("by_modified")) {
        characters.createIndex("by_modified", "saved_utc", { unique: false });
      }
      if (!characters.indexNames.contains("by_ruleset")) {
        characters.createIndex("by_ruleset", "ruleset_id", { unique: false });
      }
    }
    if (!db.objectStoreNames.contains(STORES.APP)) {
      db.createObjectStore(STORES.APP, { keyPath: "key" });
    }
    const appStore = tx.objectStore(STORES.APP);
    appStore.put({ key: APP_KEYS.STORAGE_VERSION, value: 2 });
  }
  function migrateToV3(db, tx) {
    if (!db.objectStoreNames.contains(STORES.CHARACTERS)) {
      const characters = db.createObjectStore(STORES.CHARACTERS, { keyPath: "id" });
      characters.createIndex("by_modified", "saved_utc", { unique: false });
      characters.createIndex("by_ruleset", "ruleset_id", { unique: false });
    } else {
      const characters = tx.objectStore(STORES.CHARACTERS);
      if (!characters.indexNames.contains("by_modified")) {
        characters.createIndex("by_modified", "saved_utc", { unique: false });
      }
      if (!characters.indexNames.contains("by_ruleset")) {
        characters.createIndex("by_ruleset", "ruleset_id", { unique: false });
      }
    }
    if (!db.objectStoreNames.contains(STORES.APP)) {
      db.createObjectStore(STORES.APP, { keyPath: "key" });
    }
    const appStore = tx.objectStore(STORES.APP);
    appStore.put({ key: APP_KEYS.STORAGE_VERSION, value: 3 });
  }

  // js/v2/storage/storage.js
  function nowIso2() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  function clone2(value) {
    return structuredClone(value);
  }
  function asString(value) {
    return (value ?? "").toString().trim();
  }
  function validateCharacterEnvelopeShape(character) {
    const errors = [];
    if (!character || typeof character !== "object") errors.push("Character is not an object.");
    if (!character?.meta || typeof character.meta !== "object") errors.push("Missing meta object.");
    if (!asString(character?.meta?.id)) errors.push("Missing meta.id.");
    if (!asString(character?.meta?.name)) errors.push("Missing meta.name.");
    if (!asString(character?.meta?.ruleset_id)) errors.push("Missing meta.ruleset_id.");
    return { ok: errors.length === 0, errors };
  }
  function requestToPromise(req) {
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error("IndexedDB request failed"));
    });
  }
  function txDone(tx) {
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error || new Error("IndexedDB transaction aborted"));
      tx.onerror = () => reject(tx.error || new Error("IndexedDB transaction failed"));
    });
  }
  var dbPromise = null;
  var healingAttempted = false;
  var localFallbackMode = false;
  var LOCAL_KEYS = {
    CHARACTERS: `${DB_NAME}.local.characters`,
    ACTIVE_ID: `${DB_NAME}.local.activeCharacterId`,
    LAST_OPENED: `${DB_NAME}.local.lastOpenedAt`,
    STORAGE_VERSION: `${DB_NAME}.local.storageVersion`
  };
  function readLocalJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }
  function writeLocalJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  function localCharactersMap() {
    return readLocalJson(LOCAL_KEYS.CHARACTERS, {});
  }
  function setLocalCharactersMap(map) {
    writeLocalJson(LOCAL_KEYS.CHARACTERS, map || {});
  }
  function localGetValue(key, fallback = "") {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : raw;
    } catch {
      return fallback;
    }
  }
  function localSetValue(key, value) {
    localStorage.setItem(key, value ?? "");
  }
  function hasRequiredStores(db) {
    return db.objectStoreNames.contains(STORES.CHARACTERS) && db.objectStoreNames.contains(STORES.APP);
  }
  function deleteDb(name) {
    return new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase(name);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error || new Error("Failed to delete storage database"));
      req.onblocked = () => reject(new Error("Database reset blocked. Close other tabs/windows and refresh."));
    });
  }
  function openDbRaw() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onblocked = () => {
        reject(new Error("Storage upgrade blocked. Close other tabs/windows using this app and refresh."));
      };
      req.onupgradeneeded = () => {
        const db = req.result;
        const tx = req.transaction;
        runMigrations(db, tx, req.oldVersion, req.newVersion || DB_VERSION);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error("Failed to open storage database"));
    });
  }
  async function openDb() {
    if (localFallbackMode) return null;
    if (dbPromise) return dbPromise;
    dbPromise = (async () => {
      const db = await openDbRaw();
      if (hasRequiredStores(db)) return db;
      db.close();
      if (healingAttempted) {
        localFallbackMode = true;
        return null;
      }
      healingAttempted = true;
      dbPromise = null;
      await deleteDb(DB_NAME);
      return openDb();
    })();
    try {
      return await dbPromise;
    } catch (err) {
      dbPromise = null;
      localFallbackMode = true;
      return null;
    }
  }
  async function getAppValueLocal(key, fallback = null) {
    const raw = localGetValue(key, "");
    if (raw === "") return fallback;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  async function setAppValueLocal(key, value) {
    if (typeof value === "string") {
      localSetValue(key, value);
      return;
    }
    localSetValue(key, JSON.stringify(value));
  }
  async function saveCharacterLocal(character, { makeActive = true } = {}) {
    const candidate = clone2(character);
    const shape = validateCharacterEnvelopeShape(candidate);
    if (!shape.ok) return { ok: false, errors: shape.errors };
    candidate.meta.modified_utc = nowIso2();
    const hash = await hashCharacterPayload(candidate);
    const record = makeRecord(candidate, hash);
    const map = localCharactersMap();
    map[record.id] = record;
    setLocalCharactersMap(map);
    localSetValue(LOCAL_KEYS.LAST_OPENED, nowIso2());
    if (makeActive) localSetValue(LOCAL_KEYS.ACTIVE_ID, record.id);
    localSetValue(LOCAL_KEYS.STORAGE_VERSION, `${DB_VERSION}`);
    return {
      ok: true,
      character: clone2(candidate),
      record: {
        id: record.id,
        name: record.name,
        ruleset_id: record.ruleset_id,
        saved_utc: record.saved_utc
      }
    };
  }
  async function loadCharacterByIdLocal(id) {
    const characterId = asString(id);
    if (!characterId) return { ok: false, blocked: [{ code: "missing-id", message: "Character ID is required." }] };
    const map = localCharactersMap();
    const row = map[characterId];
    if (!row) return { ok: false, blocked: [{ code: "not-found", message: `Character '${characterId}' not found.` }] };
    const shape = validateCharacterEnvelopeShape(row.character);
    if (!shape.ok) {
      return { ok: false, blocked: shape.errors.map((message) => ({ code: "invalid-shape", message })) };
    }
    const hashCheck = await verifyCharacterPayload(row.character, row.hash);
    if (!hashCheck.ok) {
      return {
        ok: false,
        blocked: [{ code: "integrity-mismatch", message: "Stored character hash mismatch.", expected: hashCheck.expected, actual: hashCheck.actual }],
        character: row.character
      };
    }
    return {
      ok: true,
      character: clone2(row.character),
      info: {
        id: row.id,
        name: row.name,
        ruleset_id: row.ruleset_id,
        saved_utc: row.saved_utc
      }
    };
  }
  async function loadActiveCharacterLocal() {
    const activeId = localGetValue(LOCAL_KEYS.ACTIVE_ID, "");
    if (!activeId) return { ok: false, blocked: [{ code: "no-active-character", message: "No active character." }] };
    const loaded = await loadCharacterByIdLocal(activeId);
    if (loaded.ok) localSetValue(LOCAL_KEYS.LAST_OPENED, nowIso2());
    return loaded;
  }
  async function listCharactersLocal() {
    const map = localCharactersMap();
    return Object.values(map).map((row) => ({ id: row.id, name: row.name, ruleset_id: row.ruleset_id, saved_utc: row.saved_utc })).sort((a, b) => b.saved_utc.localeCompare(a.saved_utc));
  }
  async function deleteCharacterLocal(id) {
    const characterId = asString(id);
    if (!characterId) return { ok: false, errors: ["Character ID is required."] };
    const map = localCharactersMap();
    delete map[characterId];
    setLocalCharactersMap(map);
    if (localGetValue(LOCAL_KEYS.ACTIVE_ID, "") === characterId) {
      localSetValue(LOCAL_KEYS.ACTIVE_ID, "");
    }
    return { ok: true };
  }
  async function setActiveCharacterLocal(id) {
    const characterId = asString(id);
    if (!characterId) return { ok: false, errors: ["Character ID is required."] };
    localSetValue(LOCAL_KEYS.ACTIVE_ID, characterId);
    localSetValue(LOCAL_KEYS.LAST_OPENED, nowIso2());
    return { ok: true };
  }
  async function getStorageHealthLocal() {
    const map = localCharactersMap();
    return {
      ok: true,
      db_name: `${DB_NAME}:localStorage`,
      db_version: DB_VERSION,
      character_count: Object.keys(map).length,
      active_character_id: localGetValue(LOCAL_KEYS.ACTIVE_ID, ""),
      last_opened_at: localGetValue(LOCAL_KEYS.LAST_OPENED, ""),
      storage_version: Number.parseInt(localGetValue(LOCAL_KEYS.STORAGE_VERSION, "0"), 10) || 0
    };
  }
  async function getAppValue(key, fallback = null) {
    if (localFallbackMode) return getAppValueLocal(key, fallback);
    const db = await openDb();
    if (!db) return getAppValueLocal(key, fallback);
    const tx = db.transaction(STORES.APP, "readonly");
    const store2 = tx.objectStore(STORES.APP);
    const row = await requestToPromise(store2.get(key));
    await txDone(tx);
    return row?.value ?? fallback;
  }
  async function setAppValue(key, value) {
    if (localFallbackMode) return setAppValueLocal(key, value);
    const db = await openDb();
    if (!db) return setAppValueLocal(key, value);
    const tx = db.transaction(STORES.APP, "readwrite");
    const store2 = tx.objectStore(STORES.APP);
    store2.put({ key, value });
    await txDone(tx);
  }
  function makeRecord(character, hash) {
    return {
      id: asString(character.meta.id),
      ruleset_id: asString(character.meta.ruleset_id),
      name: asString(character.meta.name),
      saved_utc: nowIso2(),
      hash,
      character
    };
  }
  async function saveCharacter(character, { makeActive = true } = {}) {
    if (localFallbackMode) return saveCharacterLocal(character, { makeActive });
    const candidate = clone2(character);
    const shape = validateCharacterEnvelopeShape(candidate);
    if (!shape.ok) {
      return {
        ok: false,
        errors: shape.errors
      };
    }
    candidate.meta.modified_utc = nowIso2();
    const hash = await hashCharacterPayload(candidate);
    const record = makeRecord(candidate, hash);
    const db = await openDb();
    if (!db) return saveCharacterLocal(character, { makeActive });
    const tx = db.transaction([STORES.CHARACTERS, STORES.APP], "readwrite");
    tx.objectStore(STORES.CHARACTERS).put(record);
    tx.objectStore(STORES.APP).put({ key: APP_KEYS.LAST_OPENED_AT, value: nowIso2() });
    if (makeActive) {
      tx.objectStore(STORES.APP).put({ key: APP_KEYS.ACTIVE_CHARACTER_ID, value: record.id });
    }
    await txDone(tx);
    return {
      ok: true,
      character: clone2(candidate),
      record: {
        id: record.id,
        name: record.name,
        ruleset_id: record.ruleset_id,
        saved_utc: record.saved_utc
      }
    };
  }
  async function loadCharacterById(id) {
    if (localFallbackMode) return loadCharacterByIdLocal(id);
    const characterId = asString(id);
    if (!characterId) {
      return { ok: false, blocked: [{ code: "missing-id", message: "Character ID is required." }] };
    }
    const db = await openDb();
    if (!db) return loadCharacterByIdLocal(id);
    const tx = db.transaction(STORES.CHARACTERS, "readonly");
    const store2 = tx.objectStore(STORES.CHARACTERS);
    const row = await requestToPromise(store2.get(characterId));
    await txDone(tx);
    if (!row) {
      return { ok: false, blocked: [{ code: "not-found", message: `Character '${characterId}' not found.` }] };
    }
    const shape = validateCharacterEnvelopeShape(row.character);
    if (!shape.ok) {
      return {
        ok: false,
        blocked: shape.errors.map((message) => ({ code: "invalid-shape", message }))
      };
    }
    const hashCheck = await verifyCharacterPayload(row.character, row.hash);
    if (!hashCheck.ok) {
      return {
        ok: false,
        blocked: [
          {
            code: "integrity-mismatch",
            message: "Stored character hash mismatch.",
            expected: hashCheck.expected,
            actual: hashCheck.actual
          }
        ],
        character: row.character
      };
    }
    return {
      ok: true,
      character: clone2(row.character),
      info: {
        id: row.id,
        name: row.name,
        ruleset_id: row.ruleset_id,
        saved_utc: row.saved_utc
      }
    };
  }
  async function loadActiveCharacter() {
    if (localFallbackMode) return loadActiveCharacterLocal();
    const activeId = await getAppValue(APP_KEYS.ACTIVE_CHARACTER_ID, "");
    if (!activeId) return { ok: false, blocked: [{ code: "no-active-character", message: "No active character." }] };
    const loaded = await loadCharacterById(activeId);
    if (loaded.ok) await setAppValue(APP_KEYS.LAST_OPENED_AT, nowIso2());
    return loaded;
  }
  async function listCharacters() {
    if (localFallbackMode) return listCharactersLocal();
    const db = await openDb();
    if (!db) return listCharactersLocal();
    const tx = db.transaction(STORES.CHARACTERS, "readonly");
    const store2 = tx.objectStore(STORES.CHARACTERS);
    const rows = await requestToPromise(store2.getAll());
    await txDone(tx);
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      ruleset_id: row.ruleset_id,
      saved_utc: row.saved_utc
    })).sort((a, b) => b.saved_utc.localeCompare(a.saved_utc));
  }
  async function deleteCharacter(id) {
    if (localFallbackMode) return deleteCharacterLocal(id);
    const characterId = asString(id);
    if (!characterId) return { ok: false, errors: ["Character ID is required."] };
    const currentActive = await getAppValue(APP_KEYS.ACTIVE_CHARACTER_ID, "");
    const db = await openDb();
    if (!db) return deleteCharacterLocal(id);
    const tx = db.transaction([STORES.CHARACTERS, STORES.APP], "readwrite");
    tx.objectStore(STORES.CHARACTERS).delete(characterId);
    if (currentActive === characterId) {
      tx.objectStore(STORES.APP).put({ key: APP_KEYS.ACTIVE_CHARACTER_ID, value: "" });
    }
    await txDone(tx);
    return { ok: true };
  }
  async function setActiveCharacter(id) {
    if (localFallbackMode) return setActiveCharacterLocal(id);
    const characterId = asString(id);
    if (!characterId) return { ok: false, errors: ["Character ID is required."] };
    await setAppValue(APP_KEYS.ACTIVE_CHARACTER_ID, characterId);
    await setAppValue(APP_KEYS.LAST_OPENED_AT, nowIso2());
    return { ok: true };
  }
  async function getStorageHealth() {
    if (localFallbackMode) return getStorageHealthLocal();
    const db = await openDb();
    if (!db) return getStorageHealthLocal();
    const tx = db.transaction([STORES.CHARACTERS, STORES.APP], "readonly");
    const characters = tx.objectStore(STORES.CHARACTERS);
    const app = tx.objectStore(STORES.APP);
    const count = await requestToPromise(characters.count());
    const activeIdRow = await requestToPromise(app.get(APP_KEYS.ACTIVE_CHARACTER_ID));
    const lastOpenedRow = await requestToPromise(app.get(APP_KEYS.LAST_OPENED_AT));
    const storageVersionRow = await requestToPromise(app.get(APP_KEYS.STORAGE_VERSION));
    await txDone(tx);
    return {
      ok: true,
      db_name: DB_NAME,
      db_version: db.version,
      character_count: count,
      active_character_id: activeIdRow?.value || "",
      last_opened_at: lastOpenedRow?.value || "",
      storage_version: storageVersionRow?.value || 0
    };
  }
  var V2Storage2 = {
    openDb,
    getAppValue,
    setAppValue,
    saveCharacter,
    loadCharacterById,
    loadActiveCharacter,
    listCharacters,
    deleteCharacter,
    setActiveCharacter,
    getStorageHealth
  };

  // js/v2/core/controller.js
  function nowIso3() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  function createAppController({
    storage = V2Storage2,
    historyLimit = 50
  } = {}) {
    const events = createEventBus();
    const store2 = createAppStore({ historyLimit });
    store2.subscribe((snapshot, action) => {
      events.emit("state:changed", { state: snapshot, action });
      if (action?.type === ActionTypes.SET_CHARACTER) {
        events.emit("character:changed", { character: snapshot.character, action });
      }
      if (snapshot.app.lastError) {
        events.emit("app:error", { error: snapshot.app.lastError, action });
      }
    });
    async function bootstrap() {
      store2.dispatch({ type: ActionTypes.BOOTSTRAP_START });
      try {
        await storage.openDb();
        const loaded = await storage.loadActiveCharacter();
        if (loaded.ok) {
          store2.setCharacter(loaded.character, { dirty: false, lastSavedUtc: loaded.info?.saved_utc || nowIso3() });
          store2.dispatch({ type: ActionTypes.SET_ACTIVE_CHARACTER_ID, id: loaded.character?.meta?.id || "" });
        }
        store2.dispatch({ type: ActionTypes.BOOTSTRAP_READY });
        return { ok: true, loaded: loaded.ok };
      } catch (err) {
        const message = err?.message || String(err);
        store2.dispatch({ type: ActionTypes.SET_ERROR, error: message });
        store2.dispatch({ type: ActionTypes.BOOTSTRAP_READY });
        return { ok: false, error: message };
      }
    }
    async function saveActiveCharacter({ makeActive = true } = {}) {
      const state = store2.getState();
      const character = state.character;
      if (!character) return { ok: false, errors: ["No active character to save."] };
      const result = await storage.saveCharacter(character, { makeActive });
      if (!result.ok) {
        store2.dispatch({ type: ActionTypes.SET_ERROR, error: (result.errors || []).join(" ") || "Save failed." });
        return result;
      }
      const persistedCharacter = result.character || character;
      store2.dispatch({ type: ActionTypes.CLEAR_ERROR });
      store2.dispatch({ type: ActionTypes.SET_DIRTY, dirty: false });
      store2.dispatch({
        type: ActionTypes.SET_CHARACTER,
        character: persistedCharacter,
        dirty: false,
        lastSavedUtc: result?.record?.saved_utc || nowIso3()
      });
      if (makeActive) {
        store2.dispatch({ type: ActionTypes.SET_ACTIVE_CHARACTER_ID, id: persistedCharacter.meta?.id || "" });
      }
      return result;
    }
    async function loadCharacterById2(id) {
      const loaded = await storage.loadCharacterById(id);
      if (!loaded.ok) {
        store2.dispatch({
          type: ActionTypes.SET_ERROR,
          error: loaded.blocked?.map((b) => b.message).join(" ") || "Load failed."
        });
        return loaded;
      }
      store2.clearHistory();
      store2.setCharacter(loaded.character, { dirty: false, lastSavedUtc: loaded.info?.saved_utc || nowIso3() });
      store2.dispatch({ type: ActionTypes.SET_ACTIVE_CHARACTER_ID, id: loaded.info?.id || "" });
      await storage.setActiveCharacter(loaded.info?.id || "");
      return loaded;
    }
    function applyImportedCharacter(result) {
      if (!result || typeof result !== "object") {
        return { ok: false, errors: ["Import result is invalid."] };
      }
      store2.dispatch({ type: ActionTypes.SET_IMPORT_REPORT, report: result.report || null });
      if (!result.ok || !result.character) {
        const message = result?.report?.blocked?.map((x) => x.message).join(" ") || "Import blocked due to validation errors.";
        store2.dispatch({ type: ActionTypes.SET_ERROR, error: message });
        return { ok: false, blocked: result?.report?.blocked || [] };
      }
      store2.clearHistory();
      store2.setCharacter(result.character, { dirty: true });
      store2.dispatch({ type: ActionTypes.CLEAR_ERROR });
      return { ok: true };
    }
    async function createNewCharacter(character) {
      store2.clearHistory();
      store2.setCharacter(character, { dirty: true });
      return { ok: true };
    }
    return {
      store: store2,
      events,
      bootstrap,
      saveActiveCharacter,
      loadCharacterById: loadCharacterById2,
      createNewCharacter,
      applyImportedCharacter
    };
  }

  // js/v2/core/default-character.js
  function nowIso4() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  function createDefaultCharacterV2({
    name = "New Character",
    rulesetId = "dnd5e_2014",
    classId = "",
    speciesId = ""
  } = {}) {
    const now = nowIso4();
    const id = crypto.randomUUID();
    return {
      meta: {
        schema: "living-codex-character",
        schema_version: "2.0.0",
        id,
        name,
        ruleset_id: rulesetId,
        created_utc: now,
        modified_utc: now
      },
      core: {
        rulesetId,
        speciesId,
        classes: classId ? [{ id: classId, level: 1, isPrimary: true, subclassId: "" }] : []
      },
      abilities: {
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10
      },
      combat: {
        ac: 10,
        initiative_bonus: 0,
        speed: 30,
        inspiration: 0,
        proficiency_bonus: 2,
        passive_perception: 10,
        hit_dice_total: 0,
        hit_dice_used: 0,
        concentration: { active: false, source: "", notes: "" },
        conditions: [],
        death_saves: { success: 0, fail: 0 },
        hp: {
          max: 1,
          current: 1,
          temp: 0
        }
      },
      identity: {
        player_name: "",
        campaign: "",
        ancestry: "",
        background: "",
        alignment: "",
        classes: []
      },
      defenses: {
        immunities: [],
        resistances: [],
        vulnerabilities: [],
        save_advantages: []
      },
      currency: {
        cp: 0,
        sp: 0,
        ep: 0,
        gp: 0,
        pp: 0
      },
      proficiencies: {
        skills: [],
        saves: [],
        tools: [],
        languages: [],
        armor: [],
        weapons: []
      },
      expertise: {
        skills: []
      },
      trackers: [],
      inventory: [],
      profile: {
        background: "",
        alignment: "",
        player_name: "",
        experience_points: 0,
        age: "",
        height: "",
        weight: "",
        eyes: "",
        skin: "",
        hair: "",
        personality_traits: "",
        ideals: "",
        bonds: "",
        flaws: "",
        other_proficiencies_languages: "",
        features_traits: "",
        backstory: "",
        allies_organizations: "",
        additional_features: "",
        treasure: ""
      },
      resources: {
        cp: 0,
        sp: 0,
        ep: 0,
        gp: 0,
        pp: 0
      },
      saving_throws: {
        str: { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 },
        dex: { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 },
        con: { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 },
        int: { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 },
        wis: { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 },
        cha: { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 }
      },
      skills: {},
      attacks: [],
      spellcasting: {
        class_id: classId || "",
        ability: "",
        save_dc_mode: "auto",
        save_dc_override: 0,
        attack_bonus_mode: "auto",
        attack_bonus_override: 0
      },
      spells_known: [],
      spells_prepared: [],
      spell_slots: {
        auto: true,
        pact: { max: 0, used: 0, level: 1 },
        levels: {}
      },
      log: [],
      ui: {}
    };
  }

  // js/v2/io/zipio.js
  var import_jszip_min = __toESM(require_jszip_min());

  // js/v2/io/headers.js
  var CSV_HEADERS = {
    inventory: [
      "id",
      "name",
      "category",
      "qty",
      "weight_each",
      "weight_unit",
      "value",
      "value_currency",
      "attunement",
      "container",
      "equipped",
      "notes"
    ],
    spells: [
      "id",
      "name",
      "level",
      "school",
      "source",
      "ritual",
      "concentration",
      "casting_time",
      "range",
      "components",
      "duration",
      "spell_id",
      "page",
      "notes"
    ],
    log: [
      "timestamp_utc",
      "type",
      "label",
      "data_json"
    ]
  };

  // js/v2/io/csv.js
  function assertPapa() {
    if (typeof Papa === "undefined") {
      throw new Error("PapaParse is required for CSV operations.");
    }
  }
  function asString2(v) {
    return (v ?? "").toString();
  }
  function toInt(v, fallback = 0) {
    const n = Number.parseInt(asString2(v), 10);
    return Number.isFinite(n) ? n : fallback;
  }
  function toBool(v) {
    const s = asString2(v).trim().toLowerCase();
    if (["true", "t", "yes", "y", "1"].includes(s)) return true;
    if (["false", "f", "no", "n", "0", ""].includes(s)) return false;
    return false;
  }
  function ensureHeaders(rows, headers) {
    return (rows || []).map((row) => {
      const out = {};
      for (const h of headers) out[h] = row?.[h] ?? "";
      return out;
    });
  }
  function parseCsv(text) {
    assertPapa();
    if (!text || !text.trim()) return [];
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    return (parsed.data || []).map((row) => {
      const out = {};
      for (const key of Object.keys(row || {})) out[key] = row[key] ?? "";
      return out;
    });
  }
  function generateCsv(rows, headers) {
    assertPapa();
    const normalized = ensureHeaders(rows, headers);
    if (normalized.length === 0) return `${headers.join(",")}
`;
    return `${Papa.unparse(normalized, { columns: headers })}
`;
  }
  function fromInventoryRows(rows) {
    return ensureHeaders(rows, CSV_HEADERS.inventory).map((r) => ({
      id: asString2(r.id),
      name: asString2(r.name),
      category: asString2(r.category),
      qty: toInt(r.qty, 1),
      weight_each: asString2(r.weight_each),
      weight_unit: asString2(r.weight_unit),
      value: asString2(r.value),
      value_currency: asString2(r.value_currency),
      attunement: asString2(r.attunement),
      container: asString2(r.container),
      equipped: toBool(r.equipped),
      notes: asString2(r.notes)
    }));
  }
  function toInventoryRows(character) {
    const list = Array.isArray(character?.inventory) ? character.inventory : [];
    return ensureHeaders(list, CSV_HEADERS.inventory).map((r) => ({
      ...r,
      qty: r.qty === "" ? "" : toInt(r.qty, 1),
      equipped: toBool(r.equipped) ? "true" : "false"
    }));
  }
  function fromSpellRows(rows) {
    return ensureHeaders(rows, CSV_HEADERS.spells).map((r) => ({
      id: asString2(r.id),
      name: asString2(r.name),
      level: toInt(r.level, 0),
      school: asString2(r.school),
      source: asString2(r.source),
      ritual: toBool(r.ritual),
      concentration: toBool(r.concentration),
      casting_time: asString2(r.casting_time),
      range: asString2(r.range),
      components: asString2(r.components),
      duration: asString2(r.duration),
      spell_id: asString2(r.spell_id),
      page: asString2(r.page),
      notes: asString2(r.notes)
    }));
  }
  function toSpellRows(character, which = "known") {
    const key = which === "prepared" ? "spells_prepared" : "spells_known";
    const list = Array.isArray(character?.[key]) ? character[key] : [];
    return ensureHeaders(list, CSV_HEADERS.spells).map((r) => ({
      ...r,
      level: r.level === "" ? "" : toInt(r.level, 0),
      ritual: toBool(r.ritual) ? "true" : "false",
      concentration: toBool(r.concentration) ? "true" : "false"
    }));
  }
  function parseJsonSafe(text) {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }
  function fromLogRows(rows) {
    return ensureHeaders(rows, CSV_HEADERS.log).map((r) => {
      const parsed = parseJsonSafe(asString2(r.data_json));
      const msg = parsed?.message ?? "";
      const id = parsed?.id ?? "";
      return {
        id: asString2(id),
        utc: asString2(r.timestamp_utc),
        tag: asString2(r.label),
        message: asString2(msg)
      };
    });
  }
  function toLogRows(character) {
    const list = Array.isArray(character?.log) ? character.log : [];
    return list.map((entry) => ({
      timestamp_utc: asString2(entry?.utc),
      type: "note",
      label: asString2(entry?.tag),
      data_json: JSON.stringify({
        id: asString2(entry?.id),
        message: asString2(entry?.message)
      })
    }));
  }

  // js/v2/io/validate.js
  function nowIso5() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  function asString3(v) {
    return (v ?? "").toString();
  }
  function isObj(v) {
    return v != null && typeof v === "object" && !Array.isArray(v);
  }
  function toBool2(v) {
    if (typeof v === "boolean") return v;
    const s = asString3(v).trim().toLowerCase();
    if (["true", "t", "yes", "y", "1"].includes(s)) return true;
    if (["false", "f", "no", "n", "0", ""].includes(s)) return false;
    return false;
  }
  function toInt2(v, fallback = 0) {
    const n = Number.parseInt(asString3(v), 10);
    return Number.isFinite(n) ? n : fallback;
  }
  function ensureArray(obj, key, report, path) {
    if (!Array.isArray(obj[key])) {
      const before = obj[key];
      obj[key] = [];
      report.fixes_applied.push({
        code: "init-array",
        mode: "auto",
        path,
        message: "Initialized missing array.",
        before,
        after: []
      });
    }
  }
  function ensureObject(obj, key, report, path) {
    if (!isObj(obj[key])) {
      const before = obj[key];
      obj[key] = {};
      report.fixes_applied.push({
        code: "init-object",
        mode: "auto",
        path,
        message: "Initialized missing object.",
        before,
        after: {}
      });
    }
  }
  function addBlocked(report, code, path, message, extra = {}) {
    report.blocked.push({ code, path, message, mode: "blocked", ...extra });
  }
  function addGuided(report, code, path, message, extra = {}) {
    report.fixes_available.push({ code, path, message, mode: "guided", ...extra });
  }
  function addWarning(report, code, path, message, extra = {}) {
    report.warnings.push({ code, path, message, ...extra });
  }
  function normalizeAliasFields(character, report) {
    if (!isObj(character.proficiencies)) return;
    const p = character.proficiencies;
    if (Array.isArray(p.armour) && !Array.isArray(p.armor)) {
      p.armor = p.armour;
      report.fixes_applied.push({
        code: "alias-armour-to-armor",
        mode: "auto",
        path: "proficiencies.armor",
        message: "Mapped legacy 'armour' to 'armor'."
      });
    }
    if (Array.isArray(p.saving_throws) && !Array.isArray(p.saves)) {
      p.saves = p.saving_throws;
      report.fixes_applied.push({
        code: "alias-saving-throws-to-saves",
        mode: "auto",
        path: "proficiencies.saves",
        message: "Mapped legacy 'saving_throws' to 'saves'."
      });
    }
  }
  function clampAbilityScores(character, report) {
    if (!isObj(character.abilities)) return;
    const keys = ["str", "dex", "con", "int", "wis", "cha"];
    for (const key of keys) {
      const raw = character.abilities[key];
      const n = toInt2(raw, 10);
      const clamped = Math.max(1, Math.min(30, n));
      if (raw !== clamped) {
        report.fixes_applied.push({
          code: "clamp-ability-score",
          mode: "auto",
          path: `abilities.${key}`,
          message: "Clamped ability score to 1..30.",
          before: raw,
          after: clamped
        });
      }
      character.abilities[key] = clamped;
    }
  }
  function normalizeTrackers(character, report) {
    ensureArray(character, "trackers", report, "trackers");
    character.trackers = character.trackers.map((t, idx) => {
      const out = isObj(t) ? t : {};
      if (!asString3(out.id)) out.id = crypto.randomUUID();
      if (!asString3(out.label)) out.label = `Tracker ${idx + 1}`;
      const rawType = asString3(out.type).trim().toLowerCase();
      if (!rawType) out.type = "counter";
      else if (rawType !== "counter") {
        out.type = "counter";
        report.fixes_applied.push({
          code: "normalize-tracker-type",
          mode: "auto",
          path: `trackers[${idx}].type`,
          message: "Normalized tracker type to 'counter' for v2 schema compatibility.",
          before: rawType,
          after: "counter"
        });
      } else {
        out.type = "counter";
      }
      if (!["none", "short_rest", "long_rest", "daily", "manual"].includes(asString3(out.reset))) {
        addGuided(
          report,
          "invalid-tracker-reset",
          `trackers[${idx}].reset`,
          "Tracker reset value is invalid.",
          { before: out.reset, suggested: "none" }
        );
        out.reset = "none";
      }
      out.max = Math.max(0, toInt2(out.max, 0));
      out.current = Math.max(0, toInt2(out.current, 0));
      if (out.current > out.max) {
        report.fixes_applied.push({
          code: "clamp-tracker-current",
          mode: "auto",
          path: `trackers[${idx}].current`,
          message: "Clamped tracker current to max.",
          before: out.current,
          after: out.max
        });
        out.current = out.max;
      }
      return out;
    });
  }
  function normalizeSpells(character, report) {
    ensureArray(character, "spells_known", report, "spells_known");
    ensureArray(character, "spells_prepared", report, "spells_prepared");
    for (const [key, list] of [["spells_known", character.spells_known], ["spells_prepared", character.spells_prepared]]) {
      for (let i = 0; i < list.length; i++) {
        const row = isObj(list[i]) ? list[i] : {};
        if (!asString3(row.id)) row.id = crypto.randomUUID();
        const beforeLevel = row.level;
        const level = Math.max(0, Math.min(9, toInt2(row.level, 0)));
        if (beforeLevel !== level) {
          report.fixes_applied.push({
            code: "clamp-spell-level",
            mode: "auto",
            path: `${key}[${i}].level`,
            message: "Clamped spell level to 0..9.",
            before: beforeLevel,
            after: level
          });
        }
        row.level = level;
        row.ritual = toBool2(row.ritual);
        row.concentration = toBool2(row.concentration);
        list[i] = row;
      }
    }
    const knownIds = new Set(character.spells_known.map((s) => asString3(s.id)));
    const notKnown = character.spells_prepared.filter((s) => !knownIds.has(asString3(s.id)));
    if (notKnown.length > 0) {
      addGuided(
        report,
        "prepared-not-known",
        "spells_prepared",
        "Some prepared spells are not in known spells.",
        { count: notKnown.length }
      );
    }
  }
  function normalizeCore(character, report) {
    ensureObject(character, "core", report, "core");
    const core = character.core;
    ensureArray(core, "classes", report, "core.classes");
    if (!asString3(core.rulesetId) && asString3(character?.meta?.ruleset_id)) {
      core.rulesetId = asString3(character.meta.ruleset_id);
      report.fixes_applied.push({
        code: "fill-core-ruleset",
        mode: "auto",
        path: "core.rulesetId",
        message: "Filled core.rulesetId from meta.ruleset_id.",
        after: core.rulesetId
      });
    }
    if (!asString3(core.speciesId)) {
      const speciesFallback = asString3(core.species_id) || asString3(core.raceId) || asString3(core.race_id) || asString3(character?.speciesId) || asString3(character?.raceId);
      if (speciesFallback) {
        core.speciesId = speciesFallback.toLowerCase();
        report.fixes_applied.push({
          code: "fill-core-species",
          mode: "auto",
          path: "core.speciesId",
          message: "Filled core.speciesId from legacy species/race fields.",
          after: core.speciesId
        });
      }
    }
    if (core.classes.length === 0) {
      const fallbackClass = asString3(core.classId) || asString3(core.class_id) || asString3(character.class_id) || asString3(character.class);
      const fallbackFromIdentity = Array.isArray(character?.identity?.classes) ? asString3(character.identity.classes[0]?.name) : "";
      const resolvedFallback = fallbackClass || fallbackFromIdentity;
      if (resolvedFallback) {
        addGuided(
          report,
          "legacy-single-class",
          "core.classes",
          "Legacy single-class fields found; can migrate to core.classes.",
          { suggested: [{ id: canonicalClassId(resolvedFallback), level: 1, isPrimary: true }] }
        );
        core.classes = [{ id: canonicalClassId(resolvedFallback), level: 1, isPrimary: true }];
      }
    }
    core.classes = core.classes.map((row, idx) => {
      const r = isObj(row) ? row : {};
      const originalId = asString3(r.id || r.class_id || r.name);
      const id = canonicalClassId(originalId);
      const level = Math.max(1, Math.min(20, toInt2(r.level, 1)));
      const subclassId = asString3(r.subclassId || r.subclass_id).trim().toLowerCase();
      const isPrimary = Boolean(r.isPrimary);
      if (originalId && originalId !== id) {
        report.fixes_applied.push({
          code: "normalize-class-id",
          mode: "auto",
          path: `core.classes[${idx}].id`,
          message: "Normalized class id to canonical form.",
          before: originalId,
          after: id
        });
      }
      return { id, level, subclassId, isPrimary };
    }).filter((r) => asString3(r.id));
    if (core.classes.length > 0 && !core.classes.some((r) => r.isPrimary)) {
      core.classes[0].isPrimary = true;
      report.fixes_applied.push({
        code: "set-primary-class",
        mode: "auto",
        path: "core.classes[0].isPrimary",
        message: "Assigned first class as primary.",
        after: true
      });
    }
  }
  function canonicalClassId(input) {
    const raw = asString3(input).trim().toLowerCase();
    if (!raw) return "";
    const key = raw.replace(/[_\-\s]+/g, " ");
    const known = [
      "artificer",
      "barbarian",
      "bard",
      "cleric",
      "druid",
      "fighter",
      "monk",
      "paladin",
      "ranger",
      "rogue",
      "sorcerer",
      "warlock",
      "wizard"
    ];
    for (const id of known) {
      const boundary = new RegExp(`(^|[^a-z])${id}([^a-z]|$)`);
      if (boundary.test(key)) return id;
    }
    const map = {
      artificer: "artificer",
      barbarian: "barbarian",
      bard: "bard",
      cleric: "cleric",
      druid: "druid",
      fighter: "fighter",
      monk: "monk",
      paladin: "paladin",
      ranger: "ranger",
      rogue: "rogue",
      sorcerer: "sorcerer",
      warlock: "warlock",
      wizard: "wizard"
    };
    if (map[key]) return map[key];
    return key.replace(/[^a-z0-9 ]+/g, " ").trim().replace(/\s+/g, "_");
  }
  function normalizeMeta(character, report) {
    ensureObject(character, "meta", report, "meta");
    const meta = character.meta;
    const schema = asString3(meta.schema);
    if (!schema) addBlocked(report, "missing-schema", "meta.schema", "Missing meta.schema.");
    else if (!["dnd-character-pack", "living-codex-character"].includes(schema)) {
      const normalized = schema.includes("living-codex") ? "living-codex-character" : "dnd-character-pack";
      report.fixes_applied.push({
        code: "normalize-schema",
        mode: "auto",
        path: "meta.schema",
        message: "Normalized unsupported schema to a compatible identifier.",
        before: schema,
        after: normalized
      });
      meta.schema = normalized;
    }
    if (!asString3(meta.id)) {
      meta.id = crypto.randomUUID();
      report.fixes_applied.push({
        code: "fill-meta-id",
        mode: "auto",
        path: "meta.id",
        message: "Filled missing meta.id.",
        after: meta.id
      });
    }
    if (!asString3(meta.name)) {
      meta.name = "Imported Character";
      report.fixes_applied.push({
        code: "fill-meta-name",
        mode: "auto",
        path: "meta.name",
        message: "Filled missing meta.name.",
        after: meta.name
      });
    }
    if (!asString3(meta.schema_version)) {
      meta.schema_version = "2.0.0";
      report.fixes_applied.push({
        code: "fill-schema-version",
        mode: "auto",
        path: "meta.schema_version",
        message: "Filled missing meta.schema_version.",
        after: meta.schema_version
      });
    } else if (asString3(meta.schema_version) !== "2.0.0") {
      const before = asString3(meta.schema_version);
      meta.schema_version = "2.0.0";
      report.fixes_applied.push({
        code: "normalize-schema-version",
        mode: "auto",
        path: "meta.schema_version",
        message: "Normalized schema version to v2 canonical value.",
        before,
        after: meta.schema_version
      });
    }
    if (!asString3(meta.ruleset_id)) {
      const inferred = asString3(character?.core?.rulesetId) || "dnd5e_2014";
      meta.ruleset_id = inferred;
      report.fixes_applied.push({
        code: "fill-ruleset",
        mode: "auto",
        path: "meta.ruleset_id",
        message: "Filled missing meta.ruleset_id.",
        after: inferred
      });
    } else if (!["dnd5e_2014", "dnd5e_2024"].includes(asString3(meta.ruleset_id))) {
      addGuided(
        report,
        "unknown-ruleset",
        "meta.ruleset_id",
        "Unknown ruleset id.",
        { before: meta.ruleset_id, suggested: "dnd5e_2014" }
      );
    }
    if (!asString3(meta.modified_utc)) {
      meta.modified_utc = nowIso5();
      report.fixes_applied.push({
        code: "fill-modified-utc",
        mode: "auto",
        path: "meta.modified_utc",
        message: "Filled missing modified_utc.",
        after: meta.modified_utc
      });
    }
    if (!asString3(meta.created_utc)) {
      meta.created_utc = meta.modified_utc || nowIso5();
      report.fixes_applied.push({
        code: "fill-created-utc",
        mode: "auto",
        path: "meta.created_utc",
        message: "Filled missing created_utc.",
        after: meta.created_utc
      });
    }
  }
  function normalizeRequiredObjects(character, report) {
    ensureObject(character, "abilities", report, "abilities");
    ensureObject(character, "combat", report, "combat");
    ensureObject(character, "identity", report, "identity");
    ensureObject(character, "defenses", report, "defenses");
    ensureObject(character, "currency", report, "currency");
    ensureObject(character, "proficiencies", report, "proficiencies");
    ensureObject(character, "expertise", report, "expertise");
    ensureObject(character, "spell_slots", report, "spell_slots");
    ensureObject(character, "ui", report, "ui");
  }
  function normalizeListObject(obj, key, report, path) {
    ensureArray(obj, key, report, path);
    obj[key] = obj[key].map((x) => asString3(x).trim()).filter(Boolean);
  }
  function normalizeProficiencies(character, report) {
    const p = character.proficiencies;
    normalizeListObject(p, "skills", report, "proficiencies.skills");
    if (!Array.isArray(p.saves) && Array.isArray(p.saving_throws)) p.saves = p.saving_throws;
    normalizeListObject(p, "saves", report, "proficiencies.saves");
    normalizeListObject(p, "tools", report, "proficiencies.tools");
    normalizeListObject(p, "languages", report, "proficiencies.languages");
    if (!Array.isArray(p.armor) && Array.isArray(p.armour)) p.armor = p.armour;
    normalizeListObject(p, "armor", report, "proficiencies.armor");
    normalizeListObject(p, "weapons", report, "proficiencies.weapons");
    ensureArray(character.expertise, "skills", report, "expertise.skills");
    character.expertise.skills = character.expertise.skills.map((x) => asString3(x).trim()).filter(Boolean);
  }
  function normalizeDefenses(character, report) {
    const d = character.defenses;
    normalizeListObject(d, "immunities", report, "defenses.immunities");
    normalizeListObject(d, "resistances", report, "defenses.resistances");
    normalizeListObject(d, "vulnerabilities", report, "defenses.vulnerabilities");
    normalizeListObject(d, "save_advantages", report, "defenses.save_advantages");
  }
  function normalizeSpellSlots(character, report) {
    const ss = character.spell_slots;
    ss.auto = typeof ss.auto === "boolean" ? ss.auto : toBool2(ss.auto);
    ensureObject(ss, "pact", report, "spell_slots.pact");
    ss.pact.max = Math.max(0, toInt2(ss.pact.max, 0));
    ss.pact.used = Math.max(0, toInt2(ss.pact.used, 0));
    if (ss.pact.used > ss.pact.max) ss.pact.used = ss.pact.max;
    ss.pact.level = Math.max(1, Math.min(9, toInt2(ss.pact.level, 1)));
    ensureObject(ss, "levels", report, "spell_slots.levels");
    for (let i = 1; i <= 9; i++) {
      const key = String(i);
      if (!isObj(ss.levels[key])) ss.levels[key] = { max: 0, used: 0 };
      ss.levels[key].max = Math.max(0, toInt2(ss.levels[key].max, 0));
      ss.levels[key].used = Math.max(0, toInt2(ss.levels[key].used, 0));
      if (ss.levels[key].used > ss.levels[key].max) ss.levels[key].used = ss.levels[key].max;
    }
  }
  function normalizeCurrency(character, report) {
    const cur = character.currency;
    for (const key of ["cp", "sp", "ep", "gp", "pp"]) {
      const before = cur[key];
      cur[key] = toInt2(cur[key], 0);
      if (before !== cur[key]) {
        report.fixes_applied.push({
          code: "coerce-currency-int",
          mode: "auto",
          path: `currency.${key}`,
          message: "Coerced currency field to integer.",
          before,
          after: cur[key]
        });
      }
    }
  }
  function normalizeSheetExtensions(character, report) {
    ensureObject(character, "profile", report, "profile");
    ensureObject(character, "resources", report, "resources");
    ensureObject(character, "saving_throws", report, "saving_throws");
    ensureObject(character, "skills", report, "skills");
    ensureObject(character, "spellcasting", report, "spellcasting");
    ensureArray(character, "attacks", report, "attacks");
    const c = character.combat;
    c.speed = Math.max(0, toInt2(c.speed, 30));
    c.inspiration = Math.max(0, Math.min(1, toInt2(c.inspiration, 0)));
    c.proficiency_bonus = toInt2(c.proficiency_bonus, 2);
    c.passive_perception = Math.max(0, toInt2(c.passive_perception, 10));
    c.hit_dice_total = Math.max(0, toInt2(c.hit_dice_total, 0));
    c.hit_dice_used = Math.max(0, toInt2(c.hit_dice_used, 0));
    ensureObject(c, "death_saves", report, "combat.death_saves");
    ensureObject(c, "concentration", report, "combat.concentration");
    ensureArray(c, "conditions", report, "combat.conditions");
    c.concentration.active = toBool2(c.concentration.active);
    c.concentration.source = asString3(c.concentration.source || "");
    c.concentration.notes = asString3(c.concentration.notes || "");
    c.conditions = c.conditions.map((row) => {
      if (typeof row === "string") {
        return { name: row, source: "", duration: "", notes: "", active: true };
      }
      const x = isObj(row) ? row : {};
      return {
        name: asString3(x.name || "").trim(),
        source: asString3(x.source || ""),
        duration: asString3(x.duration || ""),
        notes: asString3(x.notes || ""),
        active: x.active === void 0 ? true : toBool2(x.active)
      };
    }).filter((x) => x.name);
    c.death_saves.success = Math.max(0, Math.min(3, toInt2(c.death_saves.success, 0)));
    c.death_saves.fail = Math.max(0, Math.min(3, toInt2(c.death_saves.fail, 0)));
    for (const key of ["cp", "sp", "ep", "gp", "pp"]) {
      character.resources[key] = Math.max(0, toInt2(character.resources[key], 0));
    }
    const saveKeys = ["str", "dex", "con", "int", "wis", "cha"];
    for (const key of saveKeys) {
      const row = isObj(character.saving_throws[key]) ? character.saving_throws[key] : {};
      row.proficient = toBool2(row.proficient);
      row.bonus = toInt2(row.bonus, 0);
      row.manual_total = toInt2(row.manual_total, 0);
      row.bonus_mode = asString3(row.bonus_mode) === "manual" ? "manual" : "auto";
      character.saving_throws[key] = row;
    }
    for (const [key, rowRaw] of Object.entries(character.skills)) {
      const row = isObj(rowRaw) ? rowRaw : {};
      row.proficient = toBool2(row.proficient);
      row.expertise = toBool2(row.expertise);
      row.bonus = toInt2(row.bonus, 0);
      row.manual_total = toInt2(row.manual_total, 0);
      row.bonus_mode = asString3(row.bonus_mode) === "manual" ? "manual" : "auto";
      character.skills[key] = row;
    }
    const sc = character.spellcasting;
    sc.class_id = asString3(sc.class_id).trim().toLowerCase();
    sc.ability = asString3(sc.ability).trim().toLowerCase();
    if (!["str", "dex", "con", "int", "wis", "cha", ""].includes(sc.ability)) sc.ability = "";
    sc.save_dc_mode = asString3(sc.save_dc_mode) === "manual" ? "manual" : "auto";
    sc.attack_bonus_mode = asString3(sc.attack_bonus_mode) === "manual" ? "manual" : "auto";
    sc.save_dc_override = toInt2(sc.save_dc_override, 0);
    sc.attack_bonus_override = toInt2(sc.attack_bonus_override, 0);
    character.attacks = character.attacks.map((row, idx) => {
      const r = isObj(row) ? row : {};
      if (!asString3(r.id)) r.id = crypto.randomUUID();
      return {
        id: asString3(r.id),
        name: asString3(r.name || `Attack ${idx + 1}`),
        atk_bonus: toInt2(r.atk_bonus, 0),
        damage: asString3(r.damage || ""),
        damage_type: asString3(r.damage_type || ""),
        range: asString3(r.range || ""),
        notes: asString3(r.notes || "")
      };
    });
  }
  function validateAndFixImportPayload(character) {
    const report = {
      ok: false,
      errors: [],
      warnings: [],
      fixes_applied: [],
      fixes_available: [],
      blocked: []
    };
    if (!isObj(character)) {
      addBlocked(report, "root-not-object", "$", "Import payload root must be an object.");
      return { ok: false, character: null, report };
    }
    const out = structuredClone(character);
    normalizeMeta(out, report);
    normalizeRequiredObjects(out, report);
    normalizeAliasFields(out, report);
    normalizeCore(out, report);
    normalizeProficiencies(out, report);
    normalizeDefenses(out, report);
    normalizeSpellSlots(out, report);
    clampAbilityScores(out, report);
    normalizeCurrency(out, report);
    normalizeSheetExtensions(out, report);
    normalizeTrackers(out, report);
    normalizeSpells(out, report);
    ensureArray(out, "inventory", report, "inventory");
    ensureArray(out, "log", report, "log");
    if (report.blocked.length > 0) {
      report.ok = false;
      report.errors = report.blocked.map((b) => b.message);
      return { ok: false, character: out, report };
    }
    if (report.fixes_available.length > 0) {
      addWarning(
        report,
        "guided-fixes-available",
        "$",
        "Guided fixes are available for some fields."
      );
    }
    report.ok = true;
    return { ok: true, character: out, report };
  }

  // js/v2/io/zipio.js
  function assertJSZip() {
    const zipLib = (typeof import_jszip_min.default === "function" ? import_jszip_min.default : null) || (typeof import_jszip_min.default?.default === "function" ? import_jszip_min.default.default : null) || (typeof globalThis !== "undefined" && typeof globalThis.JSZip === "function" ? globalThis.JSZip : null);
    if (!zipLib) {
      throw new Error("JSZip is required for ZIP import/export.");
    }
    return zipLib;
  }
  function asString4(v) {
    return (v ?? "").toString();
  }
  function safeName(name) {
    return asString4(name).trim().toLowerCase().replace(/[^a-z0-9\- _]/g, "").replace(/\s+/g, "-").replace(/\-+/g, "-").replace(/^\-+|\-+$/g, "") || "character";
  }
  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
  }
  function toPrettyJson(obj) {
    return `${JSON.stringify(obj, null, 2)}
`;
  }
  async function parseCharacterJson(zip) {
    const entry = zip.file("character.json");
    if (!entry) throw new Error("Invalid pack: character.json not found.");
    const raw = await entry.async("string");
    try {
      return JSON.parse(raw);
    } catch {
      throw new Error("Invalid pack: character.json is not valid JSON.");
    }
  }
  async function applyOptionalCsvOverrides(zip, character) {
    const out = structuredClone(character);
    const inv = zip.file("inventory.csv");
    if (inv) {
      out.inventory = fromInventoryRows(parseCsv(await inv.async("string")));
    }
    const known = zip.file("spells_known.csv");
    if (known) {
      out.spells_known = fromSpellRows(parseCsv(await known.async("string")));
    }
    const prepared = zip.file("spells_prepared.csv");
    if (prepared) {
      out.spells_prepared = fromSpellRows(parseCsv(await prepared.async("string")));
    }
    const log = zip.file("log.csv");
    if (log) {
      out.log = fromLogRows(parseCsv(await log.async("string")));
    }
    return out;
  }
  async function importZipFromFile(file) {
    const JSZip = assertJSZip();
    if (!file) throw new Error("File is required.");
    const buf = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(buf);
    const baseCharacter = await parseCharacterJson(zip);
    const merged = await applyOptionalCsvOverrides(zip, baseCharacter);
    const result = validateAndFixImportPayload(merged);
    return {
      ok: result.ok,
      character: result.character,
      report: result.report
    };
  }
  async function buildExportZipBlob(character, { includeReport = false, report = null } = {}) {
    const JSZip = assertJSZip();
    if (!character || typeof character !== "object") throw new Error("Character object is required.");
    const zip = new JSZip();
    zip.file("character.json", toPrettyJson(character));
    zip.file("inventory.csv", generateCsv(toInventoryRows(character), CSV_HEADERS.inventory));
    zip.file("spells_known.csv", generateCsv(toSpellRows(character, "known"), CSV_HEADERS.spells));
    zip.file("spells_prepared.csv", generateCsv(toSpellRows(character, "prepared"), CSV_HEADERS.spells));
    zip.file("log.csv", generateCsv(toLogRows(character), CSV_HEADERS.log));
    if (includeReport && report) {
      zip.folder("report").file("import-report.json", toPrettyJson(report));
    }
    return zip.generateAsync({ type: "blob" });
  }
  async function exportZipToDownload(character, opts = {}) {
    const blob = await buildExportZipBlob(character, opts);
    const filename = `${safeName(character?.meta?.name)}-v2-pack.zip`;
    triggerDownload(blob, filename);
  }
  var V2ZipIO = {
    importZipFromFile,
    buildExportZipBlob,
    exportZipToDownload
  };

  // js/v2/ui/app-ui.js
  function esc(v) {
    return (v ?? "").toString().replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }
  function asInt(v, fallback = 0) {
    const n = Number.parseInt((v ?? "").toString(), 10);
    return Number.isFinite(n) ? n : fallback;
  }
  function norm(v) {
    return (v ?? "").toString().trim().toLowerCase();
  }
  function toBoolFlag(v) {
    if (typeof v === "boolean") return v;
    if (typeof v === "number") return v !== 0;
    const s = norm(v);
    if (!s) return false;
    return ["true", "yes", "y", "1", "concentration", "required"].includes(s);
  }
  function optionList(items, selected, placeholder) {
    const selectedNorm = norm(selected);
    const options = [`<option value="">${esc(placeholder)}</option>`];
    for (const item of items || []) {
      const id = (item?.id || "").toString();
      if (!id) continue;
      const sel = norm(id) === selectedNorm ? "selected" : "";
      options.push(`<option value="${esc(id)}" ${sel}>${esc(item?.name || id)}</option>`);
    }
    if (selected && !options.join("").includes(`value="${esc(selected)}"`)) {
      options.push(`<option value="${esc(selected)}" selected>${esc(selected)} (custom)</option>`);
    }
    return options.join("");
  }
  function subclassOptions(items, classId) {
    const selectedClass = norm(classId);
    return (items || []).filter((row) => norm(row?.class_id) === selectedClass).map((row) => `<option value="${esc(row?.id || "")}">${esc(row?.name || row?.id || "")} (${esc(row?.source || "UNKNOWN")})</option>`).join("");
  }
  function isTypingTarget(el) {
    if (!el) return false;
    const tag = (el.tagName || "").toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable;
  }
  function elementPathWithinRoot(el, root2) {
    if (!el || !root2 || !root2.contains(el)) return "";
    const parts = [];
    let node = el;
    while (node && node !== root2) {
      const parent = node.parentElement;
      if (!parent) break;
      const idx = Array.from(parent.children).indexOf(node);
      parts.push(`${node.tagName}:${idx}`);
      node = parent;
    }
    return parts.reverse().join(">");
  }
  function queryByElementPath(root2, path) {
    if (!root2 || !path) return null;
    let node = root2;
    const steps = path.split(">");
    for (const step of steps) {
      const [tag, idxRaw] = step.split(":");
      const idx = asInt(idxRaw, -1);
      if (!node || !Number.isInteger(idx) || idx < 0) return null;
      const child = node.children[idx];
      if (!child || child.tagName !== tag) return null;
      node = child;
    }
    return node;
  }
  function makeSpellId(spell) {
    return (spell?.id || spell?.spell_id || spell?.name || crypto.randomUUID()).toString();
  }
  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }
  function hexToRgbTriplet(hex, fallback = "253 249 239") {
    const raw = (hex || "").toString().trim();
    const m = raw.match(/^#?([0-9a-f]{6})$/i);
    if (!m) return fallback;
    const n = m[1];
    const r = Number.parseInt(n.slice(0, 2), 16);
    const g = Number.parseInt(n.slice(2, 4), 16);
    const b = Number.parseInt(n.slice(4, 6), 16);
    return `${r} ${g} ${b}`;
  }
  function hexToRgb(hex) {
    const raw = (hex || "").toString().trim();
    const m = raw.match(/^#?([0-9a-f]{6})$/i);
    if (!m) return null;
    const n = m[1];
    return {
      r: Number.parseInt(n.slice(0, 2), 16),
      g: Number.parseInt(n.slice(2, 4), 16),
      b: Number.parseInt(n.slice(4, 6), 16)
    };
  }
  function rgbToHex({ r, g, b }) {
    const clampByte = (x) => clamp(Math.round(x), 0, 255).toString(16).padStart(2, "0");
    return `#${clampByte(r)}${clampByte(g)}${clampByte(b)}`;
  }
  function blendHex(a, b, ratio = 0.5) {
    const c1 = hexToRgb(a);
    const c2 = hexToRgb(b);
    if (!c1 || !c2) return a || b || "#000000";
    const t = clamp(Number(ratio) || 0, 0, 1);
    return rgbToHex({
      r: c1.r + (c2.r - c1.r) * t,
      g: c1.g + (c2.g - c1.g) * t,
      b: c1.b + (c2.b - c1.b) * t
    });
  }
  function relativeLuminance(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return 1;
    const toLin = (n) => {
      const v = n / 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    const r = toLin(rgb.r);
    const g = toLin(rgb.g);
    const b = toLin(rgb.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function contrastRatio(fg, bg) {
    const l1 = relativeLuminance(fg);
    const l2 = relativeLuminance(bg);
    const hi = Math.max(l1, l2);
    const lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }
  function ensureContrast(fg, bg, minRatio = 4.5) {
    let out = fg;
    let attempts = 0;
    while (contrastRatio(out, bg) < minRatio && attempts < 20) {
      const darken = relativeLuminance(out) >= relativeLuminance(bg);
      out = blendHex(out, darken ? "#101010" : "#f8f4e8", 0.12);
      attempts += 1;
    }
    return out;
  }
  function titleizeId(v) {
    return (v || "").toString().trim().replaceAll("_", " ").replaceAll("-", " ").split(/\s+/).filter(Boolean).map((x) => x[0].toUpperCase() + x.slice(1)).join(" ");
  }
  var APPEARANCE_DEFAULTS = {
    bg: "#eee7d8",
    bgNoise: "#f6f1e6",
    paper: "#fdf9ef",
    paper2: "#f8f0dd",
    ink: "#2e2418",
    inkSoft: "#6d5a41",
    line: "#d6c7a8",
    accent: "#2c5f52",
    accent2: "#8b3a2f",
    ok: "#2f6f49",
    warn: "#9a6b1d",
    err: "#8f2f2f",
    surfaceAlpha: 0.9,
    shadowOpacity: 0.12,
    shadowBlur: 28
  };
  var APPEARANCE_FIELDS = [
    ["bg", "Background"],
    ["bgNoise", "Background Glow"],
    ["paper", "Surface Base"],
    ["paper2", "Surface Alt"],
    ["ink", "Primary Ink"],
    ["inkSoft", "Secondary Ink"],
    ["line", "Borders"],
    ["accent", "Accent"],
    ["accent2", "Accent Alt"],
    ["ok", "Success"],
    ["warn", "Warning"],
    ["err", "Error"]
  ];
  var CLASS_THEME_BASE = {
    artificer: { accent: "#3b6f78", accent2: "#9a6f2f", ok: "#2f6f55", warn: "#a06a2d", err: "#914646", paper: "#f8f2e4", paper2: "#efe3cc" },
    barbarian: { accent: "#7a3a2a", accent2: "#a06a36", ok: "#42613f", warn: "#a56a1d", err: "#8f2f2f", paper: "#f8efe2", paper2: "#f0dfca" },
    bard: { accent: "#5c3a73", accent2: "#97682e", ok: "#3f6a57", warn: "#a1722c", err: "#7f3450", paper: "#f9f0e8", paper2: "#f1e1d4" },
    cleric: { accent: "#466b74", accent2: "#9f7a36", ok: "#3d6e5a", warn: "#9f7828", err: "#8b3d3d", paper: "#f8f3e8", paper2: "#eee4d3" },
    druid: { accent: "#44664a", accent2: "#8e6a3c", ok: "#2f6f49", warn: "#9a6b1d", err: "#8f3a2f", paper: "#f4efe0", paper2: "#e8ddc4" },
    fighter: { accent: "#3d5b66", accent2: "#7f3f2e", ok: "#3e694f", warn: "#91662b", err: "#7a3131", paper: "#f4f0e7", paper2: "#e8dfcf" },
    monk: { accent: "#5f5a46", accent2: "#8a6d3f", ok: "#3e6b54", warn: "#9b7425", err: "#8d3c2f", paper: "#f7f2e7", paper2: "#ece2d1" },
    paladin: { accent: "#395a77", accent2: "#b08a3a", ok: "#3b7058", warn: "#a37d2f", err: "#8a3535", paper: "#f7f1e4", paper2: "#ece0ca" },
    ranger: { accent: "#3f634b", accent2: "#876736", ok: "#2f6a46", warn: "#8f6823", err: "#7e3a30", paper: "#f3eee0", paper2: "#e7dcc4" },
    rogue: { accent: "#4d4e55", accent2: "#7a5e3f", ok: "#3d6550", warn: "#8a6427", err: "#7a2f39", paper: "#f2ede3", paper2: "#e6dccf" },
    sorcerer: { accent: "#5f3f76", accent2: "#99543a", ok: "#3a6755", warn: "#9b652a", err: "#8a3352", paper: "#f8efe8", paper2: "#efe0d5" },
    warlock: { accent: "#3e385f", accent2: "#8b4a38", ok: "#345f50", warn: "#8f6028", err: "#742f47", paper: "#f3ecdf", paper2: "#e6dac9" },
    wizard: { accent: "#3c4f79", accent2: "#91633a", ok: "#356752", warn: "#916728", err: "#7f3450", paper: "#f5efe6", paper2: "#e9dece" }
  };
  var SPECIES_FAMILY_ACCENT = {
    draconic: { primary: "#9d6b2f", secondary: "#7e3b2a", glow: "#d8b87a", chip: "#f3e6ca" },
    infernal: { primary: "#8f3a4d", secondary: "#5a345f", glow: "#d2a6b2", chip: "#f0d9de" },
    celestial: { primary: "#8f7a36", secondary: "#4d6b74", glow: "#dfd5a6", chip: "#f3efd8" },
    fey: { primary: "#5f6f44", secondary: "#6a4f78", glow: "#c7dca7", chip: "#e8f0d8" },
    elfkin: { primary: "#4f6e67", secondary: "#6a5078", glow: "#b9d4cf", chip: "#e0eee9" },
    dwarven: { primary: "#6b5943", secondary: "#4d5f66", glow: "#cdbda8", chip: "#ebe3d8" },
    goblinoid: { primary: "#5f6a39", secondary: "#6f4a35", glow: "#c5cf9b", chip: "#e6ebd0" },
    planar: { primary: "#3f6880", secondary: "#6d5b91", glow: "#b1cad9", chip: "#dae8ef" },
    folk: { primary: "#6a604d", secondary: "#4f6a63", glow: "#d3c9b5", chip: "#ece7dc" }
  };
  var SPECIES_TO_FAMILY = {
    dragonborn: "draconic",
    kobold: "draconic",
    lizardfolk: "draconic",
    yuan_ti: "draconic",
    tiefling: "infernal",
    aasimar: "celestial",
    eladrin: "fey",
    fairy: "fey",
    satyr: "fey",
    harengon: "fey",
    firbolg: "fey",
    changeling: "fey",
    shifter: "fey",
    elf_high: "elfkin",
    elf_wood: "elfkin",
    elf_drow: "elfkin",
    sea_elf: "elfkin",
    shadar_kai: "elfkin",
    dwarf_hill: "dwarven",
    dwarf_mountain: "dwarven",
    duergar: "dwarven",
    gnome_forest: "dwarven",
    gnome_rock: "dwarven",
    deep_gnome: "dwarven",
    goblin: "goblinoid",
    hobgoblin: "goblinoid",
    bugbear: "goblinoid",
    orc: "goblinoid",
    half_orc: "goblinoid",
    minotaur: "goblinoid",
    kenku: "goblinoid",
    tabaxi: "goblinoid",
    goliath: "goblinoid",
    genasi_air: "planar",
    genasi_earth: "planar",
    genasi_fire: "planar",
    genasi_water: "planar",
    githyanki: "planar",
    githzerai: "planar",
    triton: "planar",
    human: "folk",
    half_elf: "folk",
    halfling_lightfoot: "folk",
    halfling_stout: "folk",
    tortle: "folk",
    centaur: "folk",
    aarakocra: "folk"
  };
  var SPECIES_TWEAK = {
    dragonborn: { shift: 0.1 },
    kobold: { shift: -0.1 },
    yuan_ti: { shift: -0.08 },
    tiefling: { shift: 0.08 },
    aasimar: { shift: -0.06 },
    elf_drow: { shift: 0.12 },
    sea_elf: { shift: -0.08 },
    duergar: { shift: 0.1 },
    goblin: { shift: -0.05 },
    githyanki: { shift: -0.04 },
    githzerai: { shift: 0.04 }
  };
  var SPECIES_DEFAULT_PORTRAITS = {
    aarakocra: "assets/species-portraits-by-id/aarakocra.png",
    aasimar: "assets/species-portraits-by-id/aasimar.png",
    bugbear: "assets/species-portraits-by-id/bugbear.png",
    centaur: "assets/species-portraits-by-id/centaur.png",
    changeling: "assets/species-portraits-by-id/changeling.png",
    deep_gnome: "assets/species-portraits-by-id/deep_gnome.png",
    dragonborn: "assets/species-portraits-by-id/dragonborn.png",
    elf_drow: "assets/species-portraits-by-id/elf_drow.png",
    duergar: "assets/species-portraits-by-id/duergar.png",
    eladrin: "assets/species-portraits-by-id/eladrin.png",
    fairy: "assets/species-portraits-by-id/fairy.png",
    firbolg: "assets/species-portraits-by-id/firbolg.png",
    gnome_forest: "assets/species-portraits-by-id/gnome_forest.png",
    genasi_air: "assets/species-portraits-by-id/genasi_air.png",
    genasi_earth: "assets/species-portraits-by-id/genasi_earth.png",
    genasi_fire: "assets/species-portraits-by-id/genasi_fire.png",
    genasi_water: "assets/species-portraits-by-id/genasi_water.png",
    githyanki: "assets/species-portraits-by-id/githyanki.png",
    githzerai: "assets/species-portraits-by-id/githzerai.png",
    goblin: "assets/species-portraits-by-id/goblin.png",
    goliath: "assets/species-portraits-by-id/goliath.png",
    half_elf: "assets/species-portraits-by-id/half_elf.png",
    half_orc: "assets/species-portraits-by-id/half_orc.png",
    harengon: "assets/species-portraits-by-id/harengon.png",
    elf_high: "assets/species-portraits-by-id/elf_high.png",
    dwarf_hill: "assets/species-portraits-by-id/dwarf_hill.png",
    hobgoblin: "assets/species-portraits-by-id/hobgoblin.png",
    human: "assets/species-portraits-by-id/human.png",
    kenku: "assets/species-portraits-by-id/kenku.png",
    kobold: "assets/species-portraits-by-id/kobold.png",
    halfling_lightfoot: "assets/species-portraits-by-id/halfling_lightfoot.png",
    lizardfolk: "assets/species-portraits-by-id/lizardfolk.png",
    minotaur: "assets/species-portraits-by-id/minotaur.png",
    dwarf_mountain: "assets/species-portraits-by-id/dwarf_mountain.png",
    orc: "assets/species-portraits-by-id/orc.png",
    gnome_rock: "assets/species-portraits-by-id/gnome_rock.png",
    satyr: "assets/species-portraits-by-id/satyr.png",
    sea_elf: "assets/species-portraits-by-id/sea_elf.png",
    shadar_kai: "assets/species-portraits-by-id/shadar_kai.png",
    shifter: "assets/species-portraits-by-id/shifter.png",
    halfling_stout: "assets/species-portraits-by-id/halfling_stout.png",
    tabaxi: "assets/species-portraits-by-id/tabaxi.png",
    tiefling: "assets/species-portraits-by-id/tiefling.png",
    tortle: "assets/species-portraits-by-id/tortle.png",
    triton: "assets/species-portraits-by-id/triton.png",
    elf_wood: "assets/species-portraits-by-id/elf_wood.png",
    yuan_ti: "assets/species-portraits-by-id/yuan_ti.png"
  };
  var CLASS_BADGES = {
    artificer: "assets/class-badges/artificer.png",
    barbarian: "assets/class-badges/Barbarian.png",
    bard: "assets/class-badges/Bard.png",
    cleric: "assets/class-badges/Cleric.png",
    druid: "assets/class-badges/Druid.png",
    fighter: "assets/class-badges/Fighter.png",
    monk: "assets/class-badges/Monk.png",
    paladin: "assets/class-badges/Paladin.png",
    ranger: "assets/class-badges/Ranger.png",
    rogue: "assets/class-badges/Rogue.png",
    sorcerer: "assets/class-badges/Sorcerer.png",
    warlock: "assets/class-badges/Warlock.png",
    wizard: "assets/class-badges/Wazard.png"
  };
  function getEffectivePortrait(character) {
    const uploaded = character?.ui?.portrait?.data_url || "";
    if (uploaded) return uploaded;
    const speciesId = norm(character?.core?.speciesId || "");
    return SPECIES_DEFAULT_PORTRAITS[speciesId] || "";
  }
  function getDraftPortrait(speciesId) {
    return SPECIES_DEFAULT_PORTRAITS[norm(speciesId)] || "";
  }
  function getClassBadge(classId) {
    return CLASS_BADGES[norm(classId)] || "";
  }
  function sanitizeAppearance(raw = {}) {
    const out = { ...APPEARANCE_DEFAULTS };
    for (const [key] of APPEARANCE_FIELDS) {
      const v = (raw?.[key] || "").toString().trim();
      if (/^#[0-9a-f]{6}$/i.test(v)) out[key] = v;
    }
    out.surfaceAlpha = clamp(Number(raw?.surfaceAlpha ?? out.surfaceAlpha) || out.surfaceAlpha, 0.65, 1);
    out.shadowOpacity = clamp(Number(raw?.shadowOpacity ?? out.shadowOpacity) || out.shadowOpacity, 0.05, 0.28);
    out.shadowBlur = clamp(asInt(raw?.shadowBlur, out.shadowBlur), 12, 44);
    return out;
  }
  function primaryClassRow(character) {
    const rows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
    if (!rows.length) return null;
    const primary = rows.find((x) => x?.isPrimary && norm(x?.id));
    if (primary) return primary;
    const ranked = [...rows].filter((x) => norm(x?.id)).sort((a, b) => asInt(b?.level, 0) - asInt(a?.level, 0));
    return ranked[0] || rows[0];
  }
  function autoThemeLabel(character) {
    const cls = primaryClassRow(character);
    const classText = titleizeId(norm(cls?.id));
    const speciesText = titleizeId(norm(character?.core?.speciesId));
    if (!classText || !speciesText) return "Default Parchment";
    return `${classText} + ${speciesText}`;
  }
  function tweakColor(hex, shift = 0) {
    if (!shift) return hex;
    return blendHex(shift > 0 ? hex : "#ffffff", shift > 0 ? "#1e1a14" : hex, Math.abs(shift));
  }
  function deriveAutoAppearance(character) {
    const cls = primaryClassRow(character);
    const classId = norm(cls?.id);
    const speciesId = norm(character?.core?.speciesId);
    if (!classId || !speciesId) {
      return { appearance: sanitizeAppearance(APPEARANCE_DEFAULTS), label: "Default Parchment" };
    }
    const base = CLASS_THEME_BASE[classId];
    if (!base) {
      return { appearance: sanitizeAppearance(APPEARANCE_DEFAULTS), label: autoThemeLabel(character) };
    }
    const familyId = SPECIES_TO_FAMILY[speciesId] || "folk";
    const family = SPECIES_FAMILY_ACCENT[familyId] || SPECIES_FAMILY_ACCENT.folk;
    const tweak = SPECIES_TWEAK[speciesId] || { shift: 0 };
    const primaryAccent = tweakColor(family.primary, tweak.shift || 0);
    const secondaryAccent = tweakColor(family.secondary, (tweak.shift || 0) * -0.6);
    const a = {
      ...APPEARANCE_DEFAULTS,
      paper: base.paper,
      paper2: blendHex(base.paper2, family.chip, 0.18),
      bg: blendHex(APPEARANCE_DEFAULTS.bg, base.paper, 0.25),
      bgNoise: blendHex(APPEARANCE_DEFAULTS.bgNoise, family.glow, 0.22),
      line: blendHex(APPEARANCE_DEFAULTS.line, family.secondary, 0.18),
      accent: blendHex(base.accent, primaryAccent, 0.32),
      accent2: blendHex(base.accent2, secondaryAccent, 0.32),
      ok: blendHex(base.ok, primaryAccent, 0.15),
      warn: base.warn,
      err: base.err,
      shadowOpacity: 0.12,
      shadowBlur: 28,
      surfaceAlpha: 0.9
    };
    a.ink = ensureContrast(APPEARANCE_DEFAULTS.ink, a.paper, 8);
    a.inkSoft = ensureContrast(blendHex(APPEARANCE_DEFAULTS.inkSoft, a.accent, 0.12), a.paper, 5.2);
    a.line = ensureContrast(a.line, a.paper, 2.1);
    a.accent = ensureContrast(a.accent, a.paper, 4);
    a.accent2 = ensureContrast(a.accent2, a.paper, 3.2);
    a.ok = ensureContrast(a.ok, a.paper, 3.3);
    a.warn = ensureContrast(a.warn, a.paper, 3.1);
    a.err = ensureContrast(a.err, a.paper, 3.8);
    return { appearance: sanitizeAppearance(a), label: autoThemeLabel(character) };
  }
  var ABILITY_KEYS = ["str", "dex", "con", "int", "wis", "cha"];
  var SKILL_DEFS = [
    ["acrobatics", "dex"],
    ["animal_handling", "wis"],
    ["arcana", "int"],
    ["athletics", "str"],
    ["deception", "cha"],
    ["history", "int"],
    ["insight", "wis"],
    ["intimidation", "cha"],
    ["investigation", "int"],
    ["medicine", "wis"],
    ["nature", "int"],
    ["perception", "wis"],
    ["performance", "cha"],
    ["persuasion", "cha"],
    ["religion", "int"],
    ["sleight_of_hand", "dex"],
    ["stealth", "dex"],
    ["survival", "wis"]
  ];
  function fmtSigned(n) {
    const v = Number.isFinite(n) ? n : 0;
    return v >= 0 ? `+${v}` : `${v}`;
  }
  function dieOutlineColor(die) {
    const d = asInt(die, 20);
    const map = {
      4: "#6a4f91",
      6: "#3d6f88",
      8: "#3f7a52",
      10: "#8a6a2f",
      12: "#a05b2f",
      20: "#8f3a2f",
      100: "#4b4b63"
    };
    return map[d] || "#2c5f52";
  }
  function dieShapeClass(die) {
    return `die-shape-d${asInt(die, 20)}`;
  }
  function totalLevel(character) {
    const rows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
    return rows.reduce((acc, row) => acc + clamp(asInt(row?.level, 0), 0, 20), 0);
  }
  function defaultProficiencyBonus(level) {
    if (level <= 0) return 2;
    return Math.min(6, 2 + Math.floor((Math.max(1, level) - 1) / 4));
  }
  function resolveSpellcastingClassId(character) {
    const chosen = norm(character?.spellcasting?.class_id || "");
    if (chosen) return chosen;
    const rows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
    const primary = rows.find((x) => x?.isPrimary) || rows[0];
    return norm(primary?.id);
  }
  function resolveSpellcastingAbility(character, classId) {
    const chosen = norm(character?.spellcasting?.ability || "");
    if (ABILITY_KEYS.includes(chosen)) return chosen;
    const map = {
      artificer: "int",
      bard: "cha",
      cleric: "wis",
      druid: "wis",
      paladin: "cha",
      ranger: "wis",
      sorcerer: "cha",
      warlock: "cha",
      wizard: "int"
    };
    return map[classId] || "int";
  }
  function deriveStats(character) {
    const abilities = character?.abilities || {};
    const abilityMods = {};
    for (const key of ABILITY_KEYS) {
      const score = clamp(asInt(abilities[key], 10), 1, 30);
      abilityMods[key] = Math.floor((score - 10) / 2);
    }
    const lvl = totalLevel(character);
    const profDefault = defaultProficiencyBonus(lvl);
    const prof = Number.isFinite(asInt(character?.combat?.proficiency_bonus, profDefault)) ? asInt(character?.combat?.proficiency_bonus, profDefault) : profDefault;
    const savingThrows = {};
    for (const key of ABILITY_KEYS) {
      const row = character?.saving_throws?.[key] || {};
      const base = abilityMods[key] + (row.proficient ? prof : 0) + asInt(row.bonus, 0);
      const total = row.bonus_mode === "manual" ? asInt(row.manual_total, base) : base;
      savingThrows[key] = { base, total };
    }
    const skills = {};
    for (const [skillId, ability2] of SKILL_DEFS) {
      const row = character?.skills?.[skillId] || {};
      const profMult = row.expertise ? 2 : row.proficient ? 1 : 0;
      const base = (abilityMods[ability2] || 0) + profMult * prof + asInt(row.bonus, 0);
      const total = row.bonus_mode === "manual" ? asInt(row.manual_total, base) : base;
      skills[skillId] = { base, total };
    }
    const passivePerceptionBase = 10 + (skills.perception?.total || 0);
    const passivePerception = Math.max(0, asInt(character?.combat?.passive_perception, passivePerceptionBase));
    const classId = resolveSpellcastingClassId(character);
    const ability = resolveSpellcastingAbility(character, classId);
    const spellMod = abilityMods[ability] || 0;
    const sc = character?.spellcasting || {};
    const saveDcBase = 8 + prof + spellMod;
    const attackBase = prof + spellMod;
    const spellSaveDc = sc.save_dc_mode === "manual" ? asInt(sc.save_dc_override, saveDcBase) : saveDcBase;
    const spellAttackBonus = sc.attack_bonus_mode === "manual" ? asInt(sc.attack_bonus_override, attackBase) : attackBase;
    return {
      level: lvl,
      abilityMods,
      proficiency: { default: profDefault, value: prof },
      savingThrows,
      skills,
      passivePerceptionBase,
      passivePerception,
      spellcasting: { classId, ability, spellMod, saveDcBase, spellSaveDc, attackBase, spellAttackBonus }
    };
  }
  function collectBonusActions(character) {
    const out = { features: [], spells: [] };
    const classes = Array.isArray(character?.core?.classes) ? character.core.classes : [];
    const primaryClass = primaryClassRow(character);
    const primaryClassBadge = getClassBadge(primaryClass?.id);
    const known = Array.isArray(character?.spells_known) ? character.spells_known : [];
    const prepared = Array.isArray(character?.spells_prepared) ? character.spells_prepared : [];
    const spellSource = prepared.length ? prepared : known;
    const starsDruid = classes.some((row) => norm(row?.id) === "druid" && norm(row?.subclassId || "").includes("stars"));
    if (starsDruid) {
      out.features.push({
        id: "stars_starry_form",
        title: "Starry Form",
        detail: "Bonus action to activate by expending one Wild Shape use."
      });
      out.features.push({
        id: "stars_archer",
        title: "Archer Constellation Shot",
        detail: "While Archer is active, bonus action each turn to fire the radiant arrow."
      });
    }
    const seenSpell = /* @__PURE__ */ new Set();
    for (const spell of spellSource) {
      const casting = (spell?.casting_time || "").toString().toLowerCase();
      if (!casting.includes("bonus action")) continue;
      const name = (spell?.name || spell?.id || "").toString().trim();
      if (!name) continue;
      const key = norm(name);
      if (seenSpell.has(key)) continue;
      seenSpell.add(key);
      out.spells.push({
        id: spell?.id || name,
        title: name,
        detail: `Casting time: ${spell?.casting_time || "Bonus Action"}`
      });
    }
    out.spells.sort((a, b) => a.title.localeCompare(b.title));
    return out;
  }
  function collectClassActionFeatures(character) {
    const rows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
    const out = { action: [], bonus: [], reaction: [], passive: [] };
    const ability = character?.abilities || {};
    const chaMod = Math.floor((clamp(asInt(ability.cha, 10), 1, 30) - 10) / 2);
    const push = (kind, id, title, detail, resource = null) => {
      if (!kind || !title) return;
      const bucket = out[kind] || out.passive;
      if (bucket.some((x) => x.id === id || x.title === title)) return;
      bucket.push({ id: id || norm(title), title, detail, resource });
    };
    for (const row of rows) {
      const cls = norm(row?.id);
      const sub = norm(row?.subclassId);
      const lvl = clamp(asInt(row?.level, 0), 0, 20);
      if (!cls || lvl <= 0) continue;
      if (cls === "artificer" && lvl >= 2) push("action", "infuse_item", "Infuse Item", "Action during downtime/loadout to apply infusions.");
      if (cls === "barbarian" && lvl >= 1) {
        const max = lvl >= 20 ? 99 : lvl >= 17 ? 6 : lvl >= 12 ? 5 : lvl >= 6 ? 4 : lvl >= 3 ? 3 : 2;
        push("bonus", "rage", "Rage", "Bonus action to enter a rage.", { max, rest: "long" });
      }
      if (cls === "bard" && lvl >= 1) push("bonus", "bardic_inspiration", "Bardic Inspiration", "Bonus action to grant an inspiration die.", { max: Math.max(1, chaMod), rest: "long" });
      if (cls === "bard" && lvl >= 14 && sub.includes("valor")) push("bonus", "battle_magic", "Battle Magic", "After casting a bard spell, you can make one weapon attack as a bonus action.");
      if (cls === "cleric" && lvl >= 2) push("action", "channel_divinity", "Channel Divinity", "Action to use Channel Divinity options.", { max: lvl >= 18 ? 3 : lvl >= 6 ? 2 : 1, rest: "short" });
      if (cls === "druid" && lvl >= 2) push("action", "wild_shape", "Wild Shape", "Action to transform using Wild Shape.", { max: lvl >= 20 ? 99 : 2, rest: "short" });
      if (cls === "druid" && lvl >= 18) push("bonus", "beast_spells", "Beast Spells", "While in Wild Shape, you can cast many spells (action economy follows each spell).");
      if (cls === "fighter" && lvl >= 1) push("bonus", "second_wind", "Second Wind", "Bonus action to regain hit points.", { max: 1, rest: "short" });
      if (cls === "fighter" && lvl >= 2) push("action", "action_surge", "Action Surge", "Special action boost on your turn.", { max: lvl >= 17 ? 2 : 1, rest: "short" });
      if (cls === "fighter" && lvl >= 3 && sub.includes("samurai")) push("bonus", "fighting_spirit", "Fighting Spirit", "Bonus action to gain advantage and temporary hit points.", { max: 3, rest: "long" });
      if (cls === "fighter" && lvl >= 3 && sub.includes("cavalier")) push("bonus", "unwavering_mark", "Warding Maneuver / Mark Follow-up", "Subclass can produce bonus-action follow-up attacks in specific conditions.");
      if (cls === "monk" && lvl >= 2) {
        push("bonus", "flurry_of_blows", "Flurry of Blows", "Bonus action after Attack; spend 1 ki.", { max: lvl, rest: "short", pool: "ki" });
        push("bonus", "patient_defense", "Patient Defense", "Bonus action; spend 1 ki to Dodge.", { max: lvl, rest: "short", pool: "ki" });
        push("bonus", "step_of_the_wind", "Step of the Wind", "Bonus action; spend 1 ki to Dash/Disengage.", { max: lvl, rest: "short", pool: "ki" });
      }
      if (cls === "paladin" && lvl >= 1) push("action", "lay_on_hands", "Lay on Hands", "Action to heal using your pool.", { max: lvl * 5, rest: "long" });
      if (cls === "ranger" && lvl >= 1) push("bonus", "two_weapon_fighting", "Two-Weapon Fighting (if dual wielding)", "Bonus action off-hand attack when eligible.");
      if (cls === "ranger" && lvl >= 3 && sub.includes("beast_master")) push("bonus", "beast_command", "Companion Command", "Use bonus action to command companion attacks (Primal Companion style).");
      if (cls === "ranger" && lvl >= 3 && sub.includes("horizon_walker")) push("bonus", "planar_warrior", "Planar Warrior", "Bonus action to empower one weapon attack this turn.");
      if (cls === "rogue" && lvl >= 2) push("bonus", "cunning_action", "Cunning Action", "Bonus action Dash, Disengage, or Hide.");
      if (cls === "rogue" && lvl >= 3 && sub.includes("mastermind")) push("bonus", "master_of_tactics", "Master of Tactics", "Bonus action Help at range (subclass feature).");
      if (cls === "rogue" && lvl >= 3 && sub.includes("thief")) push("bonus", "fast_hands", "Fast Hands", "Bonus action Sleight of Hand / thieves' tools / Use Object options.");
      if (cls === "rogue" && lvl >= 13 && sub.includes("arcane_trickster")) push("bonus", "versatile_trickster", "Versatile Trickster", "Bonus action to have Mage Hand distract target for advantage setup.");
      if (cls === "sorcerer" && lvl >= 3) push("bonus", "quickened_spell", "Quickened Spell", "Cast select spells as a bonus action via Metamagic.");
      if (cls === "sorcerer" && lvl >= 6 && sub.includes("storm")) push("bonus", "heart_of_the_storm", "Storm Sorcery Mobility", "Subclass enables bonus-action repositioning after leveled spellcasting.");
      if (cls === "warlock" && lvl >= 1) push("bonus", "hex_setup", "Hex / Hex-like effects", "Many warlock staples use bonus action setup.");
      if (cls === "warlock" && lvl >= 1 && sub.includes("hexblade")) push("bonus", "hexblades_curse", "Hexblade's Curse", "Bonus action to curse one creature.");
      if (cls === "wizard" && lvl >= 18) push("action", "spell_mastery", "Spell Mastery (at-will choices)", "Frequent action economy casting options.");
      if (cls === "druid" && sub.includes("stars") && lvl >= 2) {
        push("bonus", "starry_form", "Starry Form", "Bonus action to activate by expending one Wild Shape use.");
        push("bonus", "archer_constellation_shot", "Archer Constellation Shot", "While Archer is active, bonus action each turn to fire radiant arrow.");
      }
    }
    const species = norm(character?.core?.speciesId || "");
    if (species === "dragonborn") {
      push("action", "dragonborn_breath", "Breath Weapon", "Action to exhale destructive energy (species trait).");
    }
    if (species === "goblin") {
      push("bonus", "nimble_escape", "Nimble Escape", "Bonus action Disengage or Hide (species trait).");
    }
    if (species === "aasimar") {
      push("action", "celestial_revelation", "Celestial Revelation", "Action to unleash celestial form (species trait, level-dependent by source).");
    }
    return out;
  }
  function lookupLabel(rows, id) {
    const key = norm(id);
    if (!key) return "";
    const row = (rows || []).find((x) => norm(x?.id) === key);
    return (row?.name || "").toString().trim() || titleizeId(key);
  }
  function characterSubtitle(character, catalog2 = {}) {
    const classes = Array.isArray(character?.core?.classes) ? character.core.classes : [];
    const classRows = classes.filter((c) => norm(c?.id));
    const classText = classRows.length <= 1 ? (() => {
      const row = classRows[0];
      if (!row) return "";
      const className = lookupLabel(catalog2.classes || [], row.id);
      const subclassName = norm(row?.subclassId) ? lookupLabel(catalog2.subclasses || [], row.subclassId) : "";
      const lvl = clamp(asInt(row.level, 1), 1, 20);
      return subclassName ? `Level ${lvl} ${subclassName} ${className}` : `Level ${lvl} ${className}`;
    })() : `Classes: ${classRows.map((row) => `Level ${clamp(asInt(row.level, 1), 1, 20)} ${lookupLabel(catalog2.classes || [], row.id)}`).join(" / ")}`;
    const species = lookupLabel(catalog2.species || [], character?.core?.speciesId || "");
    const background = (character?.profile?.background || "").toString().trim();
    const alignment = (character?.profile?.alignment || "").toString().trim();
    return [classText, species, background, alignment].filter(Boolean).join(" \u2022 ");
  }
  var EDIT_TABS = [
    { id: "core", label: "Core", sections: ["sec-core", "sec-classes"] },
    { id: "battle", label: "Battle", sections: ["sec-combat", "sec-mechanics"] },
    { id: "spellcraft", label: "Spellcraft", sections: ["sec-spells"] },
    { id: "gear", label: "Gear", sections: ["sec-inventory", "sec-trackers"] },
    { id: "chronicle", label: "Chronicle", sections: ["sec-profile"] }
  ];
  var PLAY_PANES = [
    { id: "spells", label: "Spells" },
    { id: "bonus", label: "Bonus Actions" },
    { id: "attacks", label: "Attacks" },
    { id: "trackers", label: "Trackers" },
    { id: "log", label: "Log" },
    { id: "notes", label: "Notes" }
  ];
  function tabSections(tabId) {
    return EDIT_TABS.find((t) => t.id === tabId)?.sections || EDIT_TABS[0].sections;
  }
  function classCasterProgression(classId, subclassId) {
    const c = norm(classId);
    if (["bard", "cleric", "druid", "sorcerer", "wizard"].includes(c)) return "full";
    if (["paladin", "ranger", "artificer"].includes(c)) return "half";
    if (c === "warlock") return "pact";
    if (c === "fighter" && norm(subclassId) === "eldritch_knight") return "third";
    if (c === "rogue" && norm(subclassId) === "arcane_trickster") return "third";
    return "none";
  }
  function standardSlotsByCasterLevel(casterLevel) {
    const table = {
      0: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
      2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
      3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
      4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
      5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
      6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
      7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
      8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
      9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
      10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
      11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
      12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
      13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
      14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
      15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
      16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
      17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
      18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
      19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
      20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
    };
    return table[clamp(casterLevel, 0, 20)] || table[0];
  }
  function warlockPactByLevel(level) {
    const l = clamp(level, 0, 20);
    if (l <= 0) return { max: 0, level: 1 };
    if (l <= 1) return { max: 1, level: 1 };
    if (l <= 10) return { max: 2, level: clamp(Math.ceil(l / 2), 1, 5) };
    if (l <= 16) return { max: 3, level: 5 };
    return { max: 4, level: 5 };
  }
  function computeEffectiveSlots(character) {
    const classes = Array.isArray(character?.core?.classes) ? character.core.classes : [];
    const existing = character?.spell_slots?.levels || {};
    const pactExisting = character?.spell_slots?.pact || { max: 0, used: 0, level: 1 };
    let casterLevel = 0;
    let warlockLevel = 0;
    for (const row of classes) {
      const lvl = clamp(asInt(row?.level, 0), 0, 20);
      const prog = classCasterProgression(row?.id, row?.subclassId);
      if (prog === "full") casterLevel += lvl;
      if (prog === "half") casterLevel += row?.id === "artificer" ? Math.ceil(lvl / 2) : Math.floor(lvl / 2);
      if (prog === "third") casterLevel += Math.floor((lvl + 2) / 3);
      if (prog === "pact") warlockLevel += lvl;
    }
    casterLevel = clamp(casterLevel, 0, 20);
    const std = standardSlotsByCasterLevel(casterLevel);
    const levels = {};
    for (let i = 1; i <= 9; i++) {
      const key = String(i);
      const max = std[i - 1] || 0;
      const used = clamp(asInt(existing?.[key]?.used, 0), 0, max);
      levels[key] = { max, used };
    }
    const pactAuto = warlockPactByLevel(warlockLevel);
    const pact = {
      max: pactAuto.max,
      level: pactAuto.level,
      used: clamp(asInt(pactExisting?.used, 0), 0, pactAuto.max)
    };
    return { levels, pact };
  }
  function renderReport(report) {
    if (!report) return `<p class="hint">No import diagnostics yet.</p>`;
    const rows = [
      ...report.blocked || [],
      ...(report.errors || []).map((message) => ({ code: "error", message })),
      ...report.warnings || [],
      ...report.fixes_applied || [],
      ...report.fixes_available || []
    ].slice(0, 12);
    return `<div class="diag-grid">
    <span><strong>ok</strong> ${esc(report.ok)}</span>
    <span><strong>errors</strong> ${esc(report.errors?.length || 0)}</span>
    <span><strong>warnings</strong> ${esc(report.warnings?.length || 0)}</span>
    <span><strong>fixes</strong> ${esc(report.fixes_applied?.length || 0)}</span>
    <span><strong>guided</strong> ${esc(report.fixes_available?.length || 0)}</span>
    <span><strong>blocked</strong> ${esc(report.blocked?.length || 0)}</span>
  </div>
  <ul class="diag-list">
    ${rows.map((row) => `<li><code>${esc(row.code || "note")}</code> ${esc(row.message || "")}</li>`).join("")}
  </ul>`;
  }
  function renderLookup(state) {
    if (!state.open) return "";
    const subtitle = state.type === "spell" ? "Search and insert spell records" : state.type === "class" ? "Choose a class" : "Choose a species";
    return `<div class="lookup-overlay" id="lookupOverlay">
    <section class="card lookup-panel" id="lookupPanel" role="dialog" aria-modal="true">
      <button type="button" class="overlay-close" data-overlay-close="lookup" aria-label="Close overlay">\xD7</button>
      <h2>Lookup: ${esc(state.type)}</h2>
      <div class="card-body">
      <p class="hint">${esc(subtitle)}</p>
      <div class="lookup-controls">
        <input id="lookupQuery" placeholder="Type to search" value="${esc(state.query)}" />
        ${state.type === "spell" ? `<select id="lookupSpellLevel">
          <option value="">Any level</option>
          ${Array.from({ length: 10 }, (_, i) => `<option value="${i}" ${state.level === String(i) ? "selected" : ""}>Level ${i}</option>`).join("")}
        </select>
        <label class="check lookup-dm-override"><input type="checkbox" id="lookupDmSpellOverride" ${state.allowOffClassSpells ? "checked" : ""} />Allow other-class spells (DM approved)</label>` : ""}
        <button type="button" id="lookupCancel">Cancel</button>
        <button type="button" class="btn-primary" id="lookupSave">Save</button>
      </div>
      <div class="lookup-list">
        ${state.results.length === 0 ? `<p class="hint">No results</p>` : state.results.map((row, idx) => `<button type="button" class="lookup-row ${state.selected === idx ? "is-selected" : ""}" data-lookup-pick="${idx}">
          <span>${esc(row.title)}</span>
          <small>${esc(row.subtitle || "")}</small>
        </button>`).join("")}
      </div>
      ${state.feedback ? `<p class="inline-note">${esc(state.feedback)}</p>` : ""}
      </div>
    </section>
  </div>`;
  }
  function renderPalette(state, commands) {
    if (!state.open) return "";
    return `<div class="palette-overlay" id="paletteOverlay">
    <section class="palette" role="dialog" aria-modal="true">
      <button type="button" class="overlay-close" data-overlay-close="palette" aria-label="Close overlay">\xD7</button>
      <input id="paletteQuery" placeholder="Type a command..." value="${esc(state.query)}" />
      <div class="palette-list">
        ${commands.length === 0 ? `<p class="hint">No commands</p>` : commands.map((cmd, idx) => `<button type="button" class="palette-row ${state.selected === idx ? "is-selected" : ""}" data-command-id="${esc(cmd.id)}">
            <span>${esc(cmd.label)}</span>
            <small>${esc(cmd.hint || "")}</small>
          </button>`).join("")}
      </div>
    </section>
  </div>`;
  }
  var LOG_NOTES_CHAR_LIMIT = 5e6;
  function textLen(v) {
    return (v ?? "").toString().length;
  }
  function parseRoundsFromDuration(durationText) {
    const raw = (durationText || "").toString().trim().toLowerCase();
    if (!raw) return null;
    const match = raw.match(/(\d+)\s*(round|rounds|minute|minutes|hour|hours)/);
    if (!match) return null;
    const qty = asInt(match[1], 0);
    const unit = match[2];
    if (qty <= 0) return null;
    if (unit.startsWith("round")) return qty;
    if (unit.startsWith("minute")) return qty * 10;
    if (unit.startsWith("hour")) return qty * 600;
    return null;
  }
  function computeLogNotesChars(character) {
    const log = Array.isArray(character?.log) ? character.log : [];
    const sessionNotes = (character?.play_state?.session_notes ?? "").toString();
    let used = textLen(sessionNotes);
    for (const row of log) {
      if (!row || typeof row !== "object") continue;
      used += textLen(row.tag);
      used += textLen(row.message);
      used += textLen(row.type);
      used += textLen(row.label);
      used += textLen(row.data_json);
      used += textLen(row.notes);
    }
    return {
      used,
      remaining: Math.max(0, LOG_NOTES_CHAR_LIMIT - used),
      limit: LOG_NOTES_CHAR_LIMIT
    };
  }
  function clampToBudget(character, incoming, existing = "") {
    const stats = computeLogNotesChars(character);
    const existingLen = textLen(existing);
    const allowed = Math.max(0, existingLen + stats.remaining);
    return (incoming ?? "").toString().slice(0, allowed);
  }
  function findSpellByAnyKey(rows, key) {
    const target = norm(key);
    if (!target || !Array.isArray(rows)) return null;
    return rows.find((s) => {
      const keys = [s?.id, s?.spell_id, s?.name].map((v) => norm(v)).filter(Boolean);
      return keys.includes(target);
    }) || null;
  }
  function inferConcentrationRoundsFromSource(sourceName, actions) {
    const name = norm(sourceName);
    if (!name) return null;
    const cat = actions?.getCatalog ? actions.getCatalog() : null;
    const spells = Array.isArray(cat?.spells) ? cat.spells : [];
    const row = spells.find((s) => norm(s?.name) === name || norm(s?.id) === name || norm(s?.spell_id) === name);
    if (!row) return null;
    return parseRoundsFromDuration(row?.duration || "");
  }
  function renderPlayMode(character, uiState, actions) {
    const hp = character?.combat?.hp || { max: 0, current: 0, temp: 0 };
    const trackers = Array.isArray(character?.trackers) ? character.trackers : [];
    const log = Array.isArray(character?.log) ? character.log : [];
    const sessionNotes = (character?.play_state?.session_notes ?? "").toString();
    const known = Array.isArray(character?.spells_known) ? character.spells_known : [];
    const prepared = Array.isArray(character?.spells_prepared) ? character.spells_prepared : [];
    const slots = computeEffectiveSlots(character).levels;
    const visibleSlotLevels = Array.from({ length: 9 }, (_, i) => i + 1).filter((lvl) => {
      const row = slots[String(lvl)] || { max: 0, used: 0 };
      return row.max > 0 || row.used > 0;
    });
    const slotSummary = visibleSlotLevels.map((lvl) => {
      const row = slots[String(lvl)] || { max: 0, used: 0 };
      return { lvl, max: row.max, used: row.used, avail: Math.max(0, row.max - row.used) };
    });
    const spellSource = prepared.length ? prepared : known;
    const activeConditionsRaw = Array.isArray(character?.combat?.conditions) ? character.combat.conditions : [];
    const activeConditions = activeConditionsRaw.map((c, idx) => {
      if (typeof c === "string") return { name: c, source: "", duration: "", notes: "", active: true, _idx: idx };
      return {
        name: c?.name || `Condition ${idx + 1}`,
        source: c?.source || "",
        duration: c?.duration || "",
        rounds_remaining: c?.rounds_remaining ?? null,
        notes: c?.notes || "",
        active: c?.active !== false,
        _idx: idx
      };
    }).filter((c) => c.active !== false);
    const concentration = character?.combat?.concentration || { active: false, source: "", notes: "", rounds_remaining: null };
    const concentrationResolvedRounds = (() => {
      const n = asInt(concentration?.rounds_remaining, NaN);
      if (Number.isFinite(n) && n > 0) return n;
      if (!concentration?.active) return null;
      const inferred = inferConcentrationRoundsFromSource(concentration?.source, actions);
      return Number.isFinite(inferred) && inferred > 0 ? inferred : null;
    })();
    const controls = uiState.playBoard?.conditionControls || {};
    const showConditionControls = Boolean(controls.showConditions || activeConditions.length);
    const showConcentrationControls = Boolean(controls.showConcentration || concentration.active);
    const concentrationLabel = concentration.active ? `${concentration.source || "Concentration"}${concentrationResolvedRounds > 0 ? ` (${concentrationResolvedRounds} rounds)` : " (no round timer)"}` : "";
    const recentActions = Array.isArray(character?.play_state?.recent_actions) ? character.play_state.recent_actions.slice(0, 5) : [];
    const castFeedback = character?.play_state?.cast_feedback || "";
    const diceRollState = character?.play_state?.dice_last_roll || null;
    const checkRollState = character?.play_state?.last_check_roll || null;
    const rollState = (() => {
      if (!diceRollState && !checkRollState) return null;
      if (!diceRollState) {
        return {
          label: checkRollState?.label || "Check",
          total: checkRollState?.total ?? 0
        };
      }
      if (!checkRollState) return diceRollState;
      const diceAt = Date.parse(diceRollState?.utc || "");
      const checkAt = Date.parse(checkRollState?.utc || "");
      if (!Number.isFinite(diceAt) && !Number.isFinite(checkAt)) return diceRollState;
      if (!Number.isFinite(diceAt)) return { label: checkRollState?.label || "Check", total: checkRollState?.total ?? 0 };
      if (!Number.isFinite(checkAt)) return diceRollState;
      if (checkAt >= diceAt) {
        return {
          label: checkRollState?.label || "Check",
          total: checkRollState?.total ?? 0
        };
      }
      return diceRollState;
    })();
    const attacks = Array.isArray(character?.attacks) ? character.attacks : [];
    const logBudget = computeLogNotesChars(character);
    const derived = deriveStats(character);
    const bonusActions = collectBonusActions(character);
    const classActions = collectClassActionFeatures(character);
    const resolveFeatureUsage = (feature) => {
      const max = Math.max(0, asInt(feature?.resource?.max, 0));
      if (max <= 0) return { max: 0, current: 0, trackerIdx: -1 };
      const titleKey = norm(feature?.title || "");
      const idKey = norm(feature?.id || "");
      const trackerIdx = trackers.findIndex((t) => {
        const l = norm(t?.label || "");
        return l && (l.includes(titleKey) || idKey && l.includes(idKey.replaceAll("_", " ")));
      });
      if (trackerIdx >= 0) {
        const t = trackers[trackerIdx] || {};
        const tMax = Math.max(0, asInt(t.max, max));
        const cur2 = clamp(asInt(t.current, tMax), 0, tMax);
        return { max: tMax, current: cur2, trackerIdx };
      }
      const uses = character?.play_state?.feature_uses || {};
      const cur = clamp(asInt(uses[idKey], max), 0, max);
      return { max, current: cur, trackerIdx: -1 };
    };
    const byLevel = /* @__PURE__ */ new Map();
    for (const s of spellSource) {
      const lvl = clamp(asInt(s?.level, 0), 0, 9);
      if (!byLevel.has(lvl)) byLevel.set(lvl, []);
      byLevel.get(lvl).push(s);
    }
    const levelsWithSpells = [...byLevel.keys()].sort((a, b) => a - b);
    const saveRows = ["str", "dex", "con", "int", "wis", "cha"].map((id) => ({
      id,
      label: `${id.toUpperCase()} Save`,
      mod: asInt(derived?.savingThrows?.[id]?.total, 0)
    }));
    const skillRows = SKILL_DEFS.map(([id]) => ({
      id,
      label: titleizeId(id),
      mod: asInt(derived?.skills?.[id]?.total, 0)
    }));
    const lastCheckRoll = checkRollState;
    const activePane = uiState.activePlayPane || "spells";
    const paneNav = `<nav class="play-pane-tabs">${PLAY_PANES.map((p) => `<button type="button" class="${activePane === p.id ? "is-active" : ""}" data-play-pane="${p.id}">${esc(p.label)}</button>`).join("")}
      <button type="button" data-open-checks-drawer>Checks</button>
      <button type="button" data-toggle-utility>${uiState.playBoard?.utilityRailOpen !== false ? "Hide Utility Rail" : "Show Utility Rail"}</button>
      <button type="button" data-toggle-band>${uiState.playBoard?.bandCompact ? "Expand Combat Band" : "Compact Combat Band"}</button>
    </nav>`;
    const spellsPane = `<article class="card play-actions"><h2>Spell Console</h2><div class="card-body">
      <div class="inline-actions">
        <button type="button" id="undoLastCast">Undo Last Cast</button>
        <button type="button" id="shortRestSlots">Short Rest</button>
        <button type="button" id="longRestSlots">Long Rest</button>
      </div>
      <p class="hint">${prepared.length ? "Prepared list active. Click a spell to cast and consume a slot automatically." : "Known list active. Click a spell to cast and consume a slot automatically."}</p>
      ${castFeedback ? `<p class="play-feedback">${esc(castFeedback)}</p>` : ""}
      ${levelsWithSpells.length === 0 ? `<p class="hint">No spells on this character yet.</p>` : `<div class="spell-level-groups">
        ${levelsWithSpells.map((lvl) => {
      const row = slots[String(lvl)] || { max: 0, used: 0 };
      const available = lvl === 0 ? "At-will" : `${Math.max(0, (row.max || 0) - (row.used || 0))}/${row.max || 0} slots`;
      const pips = lvl === 0 ? `<span class="slot-pips cantrip">Cantrip</span>` : `<span class="slot-pips">${Array.from({ length: row.max || 0 }, (_, i) => `<i class="${i < Math.max(0, (row.max || 0) - (row.used || 0)) ? "is-full" : "is-empty"}"></i>`).join("")}</span>`;
      return `<section class="spell-level-group">
            <header><strong>Level ${lvl}</strong><small>${esc(available)}</small>${pips}</header>
            <ul class="pill-list">${(byLevel.get(lvl) || []).slice(0, 16).map((s) => {
        const canCast = lvl === 0 || Math.max(0, (row.max || 0) - (row.used || 0)) > 0;
        return `<li><button type="button" class="spell-cast-pill" data-cast-spell="${esc(s.id || s.name || "spell")}" data-cast-name="${esc(s.name || s.id || "Spell")}" data-cast-base-level="${lvl}" data-cast-concentration="${toBoolFlag(s?.concentration) ? "1" : "0"}" data-cast-duration="${esc(s?.duration || "")}" ${canCast ? "" : 'disabled title="No slots left at this level"'}>${esc(s.name || s.id || "Spell")}</button></li>`;
      }).join("")}</ul>
          </section>`;
    }).join("")}
      </div>`}
    </div></article>`;
    const attacksPane = `<article class="card"><h2>Arsenal</h2><div class="card-body">
      ${attacks.length === 0 ? `<p class="hint">No attacks added yet.</p>` : `<div class="attack-list">${attacks.slice(0, 8).map((a) => `<div class="attack-row"><strong>${esc(a.name || "Attack")}</strong><span>${esc(fmtSigned(asInt(a.atk_bonus, 0)))}</span><span>${esc([a.damage, a.damage_type].filter(Boolean).join(" "))}</span></div>`).join("")}</div>`}
    </div></article>`;
    const trackersPane = `<article class="card"><h2>Trackers</h2><div class="card-body stack">
      <div class="inline-actions"><button type="button" id="playTrackerAdd">Add Tracker</button></div>
      ${trackers.length === 0 ? `<p class="hint">No trackers</p>` : trackers.map((t, idx) => `<div class="tracker-row">
        <input data-play-tracker-label="${idx}" value="${esc(t.label || "")}" placeholder="Tracker label" />
        <input data-play-tracker-current="${idx}" type="number" min="0" value="${esc(t.current ?? 0)}" />
        <input data-play-tracker-max="${idx}" type="number" min="0" value="${esc(t.max ?? 0)}" />
        <button type="button" data-play-tracker="${idx}:down">-1</button><button type="button" data-play-tracker="${idx}:up">+1</button><button type="button" data-play-tracker="${idx}:reset">Reset</button><button type="button" data-play-tracker-del="${idx}">Delete</button>
      </div>`).join("")}
    </div></article>`;
    const logPane = `<article class="card"><h2>Adventure Log</h2><div class="card-body stack">
      <div class="inline-actions"><button type="button" id="playLogAdd">Add Log Entry</button></div>
      <div class="log-list">
        ${log.length === 0 ? `<p class="hint">No log entries</p>` : log.map((_, idx) => {
      const realIdx = log.length - 1 - idx;
      const row = log[realIdx];
      return `<div class="play-log-row">
          <input data-play-log-tag="${realIdx}" value="${esc(row.tag || "")}" placeholder="tag" />
          <input data-play-log-message="${realIdx}" value="${esc(row.message || "")}" placeholder="Log entry" />
          <button type="button" data-play-log-del="${realIdx}">Delete</button>
        </div>`;
    }).join("")}
      </div>
    </div></article>`;
    const notesPane = `<article class="card"><h2>Session Notes</h2><div class="card-body stack">
      <section class="session-notes-block">
        <textarea id="playSessionNotes" rows="20" placeholder="Write long-form notes for this session...">${esc(sessionNotes)}</textarea>
        <div class="inline-actions"><button type="button" id="playSessionNotesSave">Save Notes</button></div>
      </section>
    </div></article>`;
    const bonusPane = `<article class="card bonus-actions-card"><h2>Class Powers & Bonus Actions</h2><div class="card-body stack">
      ${classActions.bonus.length ? `<section><h3>Bonus Action Features</h3><ul class="bonus-actions-list">
        ${classActions.bonus.map((row) => {
      const usage = resolveFeatureUsage(row);
      const hasResource = usage.max > 0;
      return `<li><strong>${esc(row.title)}</strong><small>${esc(row.detail)}</small>
            ${hasResource ? `<div class="feature-usage"><span class="derived-chip">${esc(usage.current)}/${esc(usage.max)}</span>
              <button type="button" data-feature-use="${esc(row.id)}">Use</button>
              <button type="button" data-feature-refund="${esc(row.id)}">Restore</button>
            </div>` : `<div class="feature-usage"><button type="button" data-feature-tap="${esc(row.id)}">Mark Used</button></div>`}
          </li>`;
    }).join("")}
      </ul></section>` : `<p class="hint">No class bonus-action features detected at current levels.</p>`}
      ${bonusActions.spells.length ? `<section><h3>Bonus Action Spells</h3><ul class="bonus-actions-list">
        ${bonusActions.spells.map((row) => `<li><strong>${esc(row.title)}</strong><small>${esc(row.detail)}</small></li>`).join("")}
      </ul></section>` : ""}
      ${classActions.action.length ? `<section><h3>Action Features</h3><ul class="bonus-actions-list">
        ${classActions.action.map((row) => {
      const usage = resolveFeatureUsage(row);
      const hasResource = usage.max > 0;
      return `<li><strong>${esc(row.title)}</strong><small>${esc(row.detail)}</small>
            ${hasResource ? `<div class="feature-usage"><span class="derived-chip">${esc(usage.current)}/${esc(usage.max)}</span>
              <button type="button" data-feature-use="${esc(row.id)}">Use</button>
              <button type="button" data-feature-refund="${esc(row.id)}">Restore</button>
            </div>` : `<div class="feature-usage"><button type="button" data-feature-tap="${esc(row.id)}">Mark Used</button></div>`}
          </li>`;
    }).join("")}
      </ul></section>` : ""}
      ${classActions.reaction.length ? `<section><h3>Reaction Features</h3><ul class="bonus-actions-list">
        ${classActions.reaction.map((row) => `<li><strong>${esc(row.title)}</strong><small>${esc(row.detail)}</small></li>`).join("")}
      </ul></section>` : ""}
    </div></article>`;
    const paneMap = { spells: spellsPane, bonus: bonusPane, attacks: attacksPane, trackers: trackersPane, log: logPane, notes: notesPane };
    const hpPct = hp.max > 0 ? Math.max(0, Math.min(100, Math.round(hp.current / hp.max * 100))) : 0;
    return `<section class="workspace play-workspace ${uiState.densityMode === "compact" ? "density-compact" : ""}">
    <section class="play-hud card ${uiState.playBoard?.bandCompact ? "is-compact" : ""} ${uiState.playBoard?.hudCollapsed ? "is-collapsed" : ""}">
      <h2>Combat HUD <button type="button" class="card-toggle" id="toggleHudCollapse">${uiState.playBoard?.hudCollapsed ? "Expand" : "Collapse"}</button></h2>
      <div class="card-body">
      <div class="hud-grid">
      <div class="hud-stat"><strong>AC</strong><p class="hud-value">${esc(character?.combat?.ac ?? 10)}</p></div>
      <button type="button" class="hud-stat hud-stat-action" id="rollInitiativeBtn" title="Roll initiative (1d20 + modifier)">
        <strong>Initiative</strong>
        <p class="hud-value">${esc(character?.combat?.initiative_bonus ?? 0)}</p>
        <small class="hint">Roll initiative</small>
      </button>
      <div class="hud-stat"><strong>Speed</strong><p class="hud-value">${esc(character?.combat?.speed ?? 30)}</p></div>
      <div class="hud-stat"><strong>Prof</strong><p class="hud-value">${esc(fmtSigned(derived.proficiency.value))}</p></div>
      <div class="hud-stat"><strong>Passive Perception</strong><p class="hud-value">${esc(derived.passivePerception)}</p></div>
      <div class="hud-stat"><strong>Inspiration</strong><p class="hud-value">${esc(character?.combat?.inspiration ?? 0)}</p></div>
      <div class="hud-stat hud-hp"><strong>HP</strong><p class="hud-value">${esc(hp.current)}/${esc(hp.max)} <small>(+${esc(hp.temp)} temp)</small></p>
        <span class="hp-bar"><i style="width:${hpPct}%"></i></span>
      </div>
      <div class="inline-actions hud-actions">
        <button type="button" data-play-hp="-1">-1 HP</button>
        <button type="button" data-play-hp="1">+1 HP</button>
        <input type="number" id="playHpCurrent" min="0" value="${esc(hp.current)}" aria-label="Current HP" />
        <button type="button" id="playHpSet">Set HP</button>
        <button type="button" id="openDiceTrayHud" class="d20-roll-tile" title="Open Dice Tray">
          <span class="d20-roll-icon" aria-hidden="true">
            <svg viewBox="0 0 100 100" focusable="false">
              <polygon points="50,6 88,28 88,72 50,94 12,72 12,28"></polygon>
              <line x1="50" y1="6" x2="50" y2="94"></line>
              <line x1="12" y1="28" x2="88" y2="28"></line>
              <line x1="12" y1="72" x2="88" y2="72"></line>
              <line x1="12" y1="28" x2="50" y2="50"></line>
              <line x1="88" y1="28" x2="50" y2="50"></line>
              <line x1="12" y1="72" x2="50" y2="50"></line>
              <line x1="88" y1="72" x2="50" y2="50"></line>
            </svg>
          </span>
          <span class="d20-roll-label">Roll Dice</span>
        </button>
      </div>
      </div>
      <div class="play-conditions">
        <div class="inline-actions">
          <strong>Turn Effects</strong>
          <label class="check check-condition"><input type="checkbox" id="conditionsVisibleToggle" ${showConditionControls ? "checked" : ""} />Track conditions</label>
          <label class="check check-concentration"><input type="checkbox" id="concentrationVisibleToggle" ${showConcentrationControls ? "checked" : ""} />Track concentration</label>
          ${activeConditions.length > 0 || concentration.active ? `<button type="button" id="advanceRoundBtn">End Round</button>` : ""}
        </div>
        <div class="inline-actions play-effects-actions">
          ${showConditionControls ? `<button type="button" id="addConditionBtn">+ Condition</button>` : ""}
        </div>
        <ul class="condition-strip">
          ${activeConditions.map((c) => `<li class="condition-pill"><button type="button" class="condition-chip-btn" data-cond-edit="${c._idx}">${esc(c.name)}${c.rounds_remaining > 0 ? ` (${esc(c.rounds_remaining)} rounds)` : c.duration ? ` (${esc(c.duration)})` : ""}</button></li>`).join("")}
        </ul>
        ${showConcentrationControls && concentration.active ? `<ul class="condition-strip concentration-strip"><li class="concentration-pill"><button type="button" class="condition-chip-btn concentration-chip-btn" id="concentrationPill">${esc(concentrationLabel)}</button></li></ul>` : ""}
      </div>
      <div class="play-math-strip">
        <span>STR ${esc(fmtSigned(derived.abilityMods.str))}</span><span>DEX ${esc(fmtSigned(derived.abilityMods.dex))}</span><span>CON ${esc(fmtSigned(derived.abilityMods.con))}</span><span>INT ${esc(fmtSigned(derived.abilityMods.int))}</span><span>WIS ${esc(fmtSigned(derived.abilityMods.wis))}</span><span>CHA ${esc(fmtSigned(derived.abilityMods.cha))}</span>
        <span>STR Save ${esc(fmtSigned(derived.savingThrows.str.total))}</span><span>DEX Save ${esc(fmtSigned(derived.savingThrows.dex.total))}</span><span>CON Save ${esc(fmtSigned(derived.savingThrows.con.total))}</span><span>WIS Save ${esc(fmtSigned(derived.savingThrows.wis.total))}</span>
        <span>Spell DC ${esc(derived.spellcasting.spellSaveDc)}</span><span>Spell Atk ${esc(fmtSigned(derived.spellcasting.spellAttackBonus))}</span>
      </div>
      </div>
      <div class="play-hud-nav">
        ${paneNav}
      </div>
    </section>

    <section class="play-body">
      <div class="play-main-grid">
        <section class="play-turn-console">
          ${paneMap[activePane] || spellsPane}
        </section>
        ${uiState.playBoard?.utilityRailOpen !== false ? `<aside class="play-utility-rail">
          <article class="card play-recent"><h2>Recent Actions <small class="char-budget">${esc(logBudget.remaining.toLocaleString())} chars left</small></h2><div class="card-body">
          ${recentActions.length ? `<ul class="recent-actions-list">${recentActions.map((entry) => `<li>${esc(entry)}</li>`).join("")}</ul>` : `<p class="hint">No recent actions yet.</p>`}
          ${rollState ? `<p class="hint">Last roll: <strong>${esc(rollState.label || "Roll")}</strong> = ${esc(rollState.total)}</p>` : ""}
          </div></article>
          <article class="card"><h2>Session Log</h2><div class="card-body">
            ${log.length ? log.slice().reverse().map((entry) => `<p><strong>${esc(entry.tag || "note")}</strong> ${esc(entry.message || "")}</p>`).join("") : `<p class="hint">No log entries</p>`}
          </div></article>
        </aside>` : ""}
      </div>
    </section>
    ${uiState.checksDrawerOpen ? `<div class="palette-overlay" id="checksDrawerOverlay">
      <aside class="checks-drawer" role="dialog" aria-modal="true" aria-label="Checks and saves">
        <button type="button" class="overlay-close" id="checksDrawerClose" aria-label="Close checks drawer">\xD7</button>
        <h3>Checks &amp; Saves</h3>
        ${lastCheckRoll ? `<p class="checks-last-roll ${lastCheckRoll.nat20 ? "is-nat20" : ""} ${lastCheckRoll.nat1 ? "is-nat1" : ""}">${esc(lastCheckRoll.label)}: d20(${lastCheckRoll.d20}) ${lastCheckRoll.mod >= 0 ? "+" : "-"} ${esc(Math.abs(lastCheckRoll.mod))} = <strong>${esc(lastCheckRoll.total)}</strong></p>` : `<p class="hint">Tap any row to roll a d20 with your current modifier.</p>`}
        <div class="checks-drawer-body">
          <section>
            <h4>Saves</h4>
            <ul class="checks-roll-list">
              ${saveRows.map((row) => `<li><span>${esc(row.label)}</span><strong>${esc(fmtSigned(row.mod))}</strong><button type="button" data-roll-save="${esc(row.id)}">Roll</button></li>`).join("")}
            </ul>
          </section>
          <section>
            <h4>Skills</h4>
            <ul class="checks-roll-list">
              ${skillRows.map((row) => `<li><span>${esc(row.label)}</span><strong>${esc(fmtSigned(row.mod))}</strong><button type="button" data-roll-skill="${esc(row.id)}">Roll</button></li>`).join("")}
            </ul>
          </section>
        </div>
      </aside>
    </div>` : ""}
  </section>`;
  }
  function cardTitle(label, isEdited) {
    return `${esc(label)}${isEdited ? ` <span class="card-change-badge">Changes not saved</span>` : ""}`;
  }
  function renderEditMode(character, catalog2, lookupState, edited = {}, uiState = {}) {
    const classes = Array.isArray(character?.core?.classes) ? character.core.classes : [];
    const inventory = Array.isArray(character?.inventory) ? character.inventory : [];
    const spells = Array.isArray(character?.spells_known) ? character.spells_known : [];
    const trackers = Array.isArray(character?.trackers) ? character.trackers : [];
    const log = Array.isArray(character?.log) ? character.log : [];
    const profile = character?.profile || {};
    const resources = character?.resources || {};
    const skills = character?.skills || {};
    const savingThrows = character?.saving_throws || {};
    const attacks = Array.isArray(character?.attacks) ? character.attacks : [];
    const derived = deriveStats(character);
    const spellcasting = character?.spellcasting || {};
    const portrait = getEffectivePortrait(character);
    const uploadedPortrait = character?.ui?.portrait?.data_url || "";
    const activeTab = uiState.activeEditTab || "core";
    const activeSections = new Set(tabSections(activeTab));
    const collapsed = uiState.collapsedSectionsByTab?.[activeTab] || {};
    const sectionClass = (id) => `${activeSections.has(id) ? "" : "is-hidden"} ${collapsed[id] ? "is-collapsed" : ""}`.trim();
    const summaryByTab = {
      core: `Level ${derived.level} \xB7 ${esc(character?.core?.speciesId || "species")} \xB7 ${esc(classes[0]?.id || "class")}`,
      battle: `AC ${esc(character?.combat?.ac ?? 10)} \xB7 HP ${esc(character?.combat?.hp?.current ?? 0)}/${esc(character?.combat?.hp?.max ?? 0)} \xB7 Prof ${esc(fmtSigned(derived.proficiency.value))}`,
      spellcraft: `Save DC ${esc(derived.spellcasting.spellSaveDc)} \xB7 Spell Attack ${esc(fmtSigned(derived.spellcasting.spellAttackBonus))}`,
      gear: `${esc(inventory.length)} items \xB7 ${esc(trackers.length)} trackers`,
      chronicle: `${esc(character?.meta?.name || "Adventurer")} \xB7 Chronicle entries ready`
    };
    return `<section class="workspace edit-workspace ${uiState.densityMode === "compact" ? "density-compact" : ""}">
    <aside class="edit-rail card">
      <h2>Navigator</h2>
      <div class="card-body stack">
        <nav class="edit-tab-strip">
          ${EDIT_TABS.map((t) => `<button type="button" class="${activeTab === t.id ? "is-active" : ""}" data-edit-tab="${t.id}">${esc(t.label)}</button>`).join("")}
        </nav>
        <p class="hint">${summaryByTab[activeTab] || ""}</p>
        <div class="edit-section-links">
          ${tabSections(activeTab).map((sid) => `<button type="button" data-jump-sec="${sid}">${esc((sid || "").replace("sec-", "").replaceAll("-", " "))}${edited.core || edited.classes || edited.combat || edited.spells || edited.inventory || edited.trackers ? "" : ""}</button>`).join("")}
        </div>
        <div class="inline-actions"><button type="button" data-collapse-all>Collapse all</button><button type="button" data-expand-all>Expand all</button></div>
      </div>
    </aside>
    <section class="edit-content edit-stack">
    <article class="card ${sectionClass("sec-core")}" id="sec-core"><h2>${cardTitle("Core", edited.core)} <button type="button" class="card-toggle" data-toggle-sec="sec-core">${collapsed["sec-core"] ? "Expand" : "Collapse"}</button></h2><div class="card-body grid2">
      <label>Name<input id="charName" value="${esc(character?.meta?.name || "")}" /></label>
      <label>Ruleset<input id="charRuleset" value="${esc(character?.meta?.ruleset_id || "")}" /></label>
      <label>Species<select id="charSpecies">${optionList(catalog2.species || [], character?.core?.speciesId || "", "Select species")}</select></label>
      <div class="inline-actions"><button type="button" data-open-lookup="species">Lookup Species</button></div>
      <div class="six-grid">
        ${["str", "dex", "con", "int", "wis", "cha"].map((k) => `<label>${k.toUpperCase()}<input type="number" min="1" max="30" data-ability="${k}" value="${esc(character?.abilities?.[k] ?? 10)}" /><small>Mod ${esc(fmtSigned(derived.abilityMods[k]))}</small></label>`).join("")}
      </div>
    </div></article>

    <article class="card ${sectionClass("sec-classes")}" id="sec-classes"><h2>${cardTitle("Classes", edited.classes)} <button type="button" class="card-toggle" data-toggle-sec="sec-classes">${collapsed["sec-classes"] ? "Expand" : "Collapse"}</button></h2><div class="card-body stack">
      <div class="inline-actions"><button type="button" id="classAdd">Add Class</button><button type="button" data-open-lookup="class">Lookup Class</button><button type="button" data-open-lookup="subclass">Lookup Subclass</button></div>
      ${classes.length === 0 ? `<p class="hint">No classes</p>` : classes.map((row, idx) => `<div class="class-row">
        ${getClassBadge(row.id) ? `<img class="class-badge" src="${esc(getClassBadge(row.id))}" alt="${esc(titleizeId(row.id))} badge" />` : `<span class="class-badge class-badge-placeholder" aria-hidden="true"></span>`}
        <select data-class-id="${idx}">${optionList(catalog2.classes || [], row.id || "", "Select class")}</select>
        <input type="number" min="1" max="20" data-class-level="${idx}" value="${esc(row.level ?? 1)}" />
        <input data-class-subclass="${idx}" list="subclass-list-${idx}" value="${esc(row.subclassId || "")}" placeholder="subclass id" />
        <datalist id="subclass-list-${idx}">${subclassOptions(catalog2.subclasses || [], row.id || "")}</datalist>
        <button type="button" data-class-del="${idx}">Delete</button>
      </div>`).join("")}
    </div></article>

    <article class="card ${sectionClass("sec-combat")}" id="sec-combat"><h2>${cardTitle("Combat", edited.combat)} <button type="button" class="card-toggle" data-toggle-sec="sec-combat">${collapsed["sec-combat"] ? "Expand" : "Collapse"}</button></h2><div class="card-body grid2">
      <label>AC<input id="combatAc" type="number" min="0" value="${esc(character?.combat?.ac ?? 10)}" /></label>
      <label>Initiative<input id="combatInit" type="number" value="${esc(character?.combat?.initiative_bonus ?? 0)}" /></label>
      <label>HP Max<input id="hpMax" type="number" min="0" value="${esc(character?.combat?.hp?.max ?? 1)}" /></label>
      <label>HP Current<input id="hpCurrent" type="number" min="0" value="${esc(character?.combat?.hp?.current ?? 1)}" /></label>
      <label>HP Temp<input id="hpTemp" type="number" min="0" value="${esc(character?.combat?.hp?.temp ?? 0)}" /></label>
      <label>Speed<input id="combatSpeed" type="number" min="0" value="${esc(character?.combat?.speed ?? 30)}" /></label>
      <label>Inspiration<input id="combatInspiration" type="number" min="0" max="1" value="${esc(character?.combat?.inspiration ?? 0)}" /></label>
      <label>Proficiency Bonus<input id="combatProfBonus" type="number" value="${esc(character?.combat?.proficiency_bonus ?? derived.proficiency.default)}" /><small>Default for level ${esc(derived.level)}: ${esc(fmtSigned(derived.proficiency.default))}</small></label>
      <label>Passive Perception<input id="combatPassivePerception" type="number" min="0" value="${esc(character?.combat?.passive_perception ?? derived.passivePerceptionBase)}" /><small>Derived default: ${esc(derived.passivePerceptionBase)}</small></label>
      <label>Hit Dice Total<input id="combatHitDiceTotal" type="number" min="0" value="${esc(character?.combat?.hit_dice_total ?? 0)}" /></label>
      <label>Hit Dice Used<input id="combatHitDiceUsed" type="number" min="0" value="${esc(character?.combat?.hit_dice_used ?? 0)}" /></label>
      <label>Death Saves Success<input id="combatDeathSaveSuccess" type="number" min="0" max="3" value="${esc(character?.combat?.death_saves?.success ?? 0)}" /></label>
      <label>Death Saves Fail<input id="combatDeathSaveFail" type="number" min="0" max="3" value="${esc(character?.combat?.death_saves?.fail ?? 0)}" /></label>
    </div></article>

    <article class="card ${sectionClass("sec-profile")}" id="sec-profile"><h2>${cardTitle("Adventurer's Chronicle", edited.core)} <button type="button" class="card-toggle" data-toggle-sec="sec-profile">${collapsed["sec-profile"] ? "Expand" : "Collapse"}</button></h2><div class="card-body grid2">
      <div class="portrait-editor">
        ${portrait ? `<img class="portrait-preview" src="${esc(portrait)}" alt="Character portrait" />` : `<div class="portrait-placeholder">No portrait</div>`}
        <div class="inline-actions">
          <input id="portraitUpload" type="file" accept="image/*" />
          ${uploadedPortrait ? `<button type="button" id="portraitRemove">Remove</button>` : ""}
        </div>
      </div>
      <label>Background<input id="profileBackground" value="${esc(profile.background || "")}" /></label>
      <label>Alignment<input id="profileAlignment" value="${esc(profile.alignment || "")}" /></label>
      <label>Player Name<input id="profilePlayerName" value="${esc(profile.player_name || "")}" /></label>
      <label>XP<input id="profileXp" type="number" min="0" value="${esc(profile.experience_points ?? 0)}" /></label>
      <label>Age<input id="profileAge" value="${esc(profile.age || "")}" /></label>
      <label>Height<input id="profileHeight" value="${esc(profile.height || "")}" /></label>
      <label>Weight<input id="profileWeight" value="${esc(profile.weight || "")}" /></label>
      <label>Eyes<input id="profileEyes" value="${esc(profile.eyes || "")}" /></label>
      <label>Skin<input id="profileSkin" value="${esc(profile.skin || "")}" /></label>
      <label>Hair<input id="profileHair" value="${esc(profile.hair || "")}" /></label>
      <label>Personality Traits<textarea id="profileTraits">${esc(profile.personality_traits || "")}</textarea></label>
      <label>Ideals<textarea id="profileIdeals">${esc(profile.ideals || "")}</textarea></label>
      <label>Bonds<textarea id="profileBonds">${esc(profile.bonds || "")}</textarea></label>
      <label>Flaws<textarea id="profileFlaws">${esc(profile.flaws || "")}</textarea></label>
      <label>Other Proficiencies & Languages<textarea id="profileProficiencies">${esc(profile.other_proficiencies_languages || "")}</textarea></label>
      <label>Features & Traits<textarea id="profileFeatures">${esc(profile.features_traits || "")}</textarea></label>
      <label>Backstory<textarea id="profileBackstory">${esc(profile.backstory || "")}</textarea></label>
      <label>Allies & Organizations<textarea id="profileAllies">${esc(profile.allies_organizations || "")}</textarea></label>
      <label>Additional Features<textarea id="profileAdditionalFeatures">${esc(profile.additional_features || "")}</textarea></label>
      <label>Treasure<textarea id="profileTreasure">${esc(profile.treasure || "")}</textarea></label>
      <label>CP<input id="resCp" type="number" min="0" value="${esc(resources.cp ?? 0)}" /></label>
      <label>SP<input id="resSp" type="number" min="0" value="${esc(resources.sp ?? 0)}" /></label>
      <label>EP<input id="resEp" type="number" min="0" value="${esc(resources.ep ?? 0)}" /></label>
      <label>GP<input id="resGp" type="number" min="0" value="${esc(resources.gp ?? 0)}" /></label>
      <label>PP<input id="resPp" type="number" min="0" value="${esc(resources.pp ?? 0)}" /></label>
    </div></article>

    <article class="card ${sectionClass("sec-mechanics")}" id="sec-mechanics"><h2>${cardTitle("Battle Ledger", edited.combat)} <button type="button" class="card-toggle" data-toggle-sec="sec-mechanics">${collapsed["sec-mechanics"] ? "Expand" : "Collapse"}</button></h2><div class="card-body stack">
      <h3>Spellcraft</h3>
      <div class="grid2">
        <label>Spellcasting Class
          <select id="spellcastingClassId">
            <option value="">Auto (Primary class)</option>
            ${classes.map((row) => `<option value="${esc(row.id || "")}" ${norm(row.id) === derived.spellcasting.classId ? "selected" : ""}>${esc(row.id || "class")}</option>`).join("")}
          </select>
        </label>
        <label>Spellcasting Ability
          <select id="spellcastingAbility">
            ${ABILITY_KEYS.map((k) => `<option value="${k}" ${k === derived.spellcasting.ability ? "selected" : ""}>${k.toUpperCase()}</option>`).join("")}
          </select>
        </label>
        <label>Spell Save DC Mode
          <select id="spellcastingSaveDcMode"><option value="auto" ${(spellcasting.save_dc_mode || "auto") === "auto" ? "selected" : ""}>Auto</option><option value="manual" ${spellcasting.save_dc_mode === "manual" ? "selected" : ""}>Manual</option></select>
        </label>
        <label>Spell Save DC Override<input id="spellcastingSaveDcOverride" type="number" value="${esc(spellcasting.save_dc_override ?? derived.spellcasting.saveDcBase)}" /></label>
        <label>Spell Attack Mode
          <select id="spellcastingAtkMode"><option value="auto" ${(spellcasting.attack_bonus_mode || "auto") === "auto" ? "selected" : ""}>Auto</option><option value="manual" ${spellcasting.attack_bonus_mode === "manual" ? "selected" : ""}>Manual</option></select>
        </label>
        <label>Spell Attack Override<input id="spellcastingAtkOverride" type="number" value="${esc(spellcasting.attack_bonus_override ?? derived.spellcasting.attackBase)}" /></label>
        <p class="hint">Computed: Spell Save DC <strong>${esc(derived.spellcasting.spellSaveDc)}</strong> \xB7 Spell Attack <strong>${esc(fmtSigned(derived.spellcasting.spellAttackBonus))}</strong></p>
      </div>
      <h3>Saves</h3>
      <div class="saves-table">
        ${["str", "dex", "con", "int", "wis", "cha"].map((k) => `<div class="save-row">
          <strong>${k.toUpperCase()}</strong>
          <label class="check"><input type="checkbox" data-save-prof="${k}" ${savingThrows?.[k]?.proficient ? "checked" : ""}/>Prof</label>
          <label class="check"><input type="checkbox" data-save-mode="${k}" ${(savingThrows?.[k]?.bonus_mode || "auto") === "manual" ? "checked" : ""}/>Manual</label>
          <input type="number" data-save-bonus="${k}" value="${esc(savingThrows?.[k]?.bonus ?? 0)}" aria-label="${k.toUpperCase()} bonus" title="${k.toUpperCase()} bonus" />
          <input type="number" data-save-manual="${k}" value="${esc(savingThrows?.[k]?.manual_total ?? derived.savingThrows[k].base)}" aria-label="${k.toUpperCase()} manual total" title="${k.toUpperCase()} manual total" />
          <span class="derived-chip" title="Computed total">${esc(fmtSigned(derived.savingThrows[k].total))}</span>
        </div>`).join("")}
      </div>
      <h3>Talents</h3>
      <div class="stack">
        ${SKILL_DEFS.map(([id, ability]) => {
      const row = skills?.[id] || {};
      return `<div class="skill-row">
            <strong>${esc(id.replaceAll("_", " "))} (${esc(ability.toUpperCase())})</strong>
            <label class="check"><input type="checkbox" data-skill-prof="${esc(id)}" ${row.proficient ? "checked" : ""}/>Prof</label>
            <label class="check"><input type="checkbox" data-skill-exp="${esc(id)}" ${row.expertise ? "checked" : ""}/>Expertise</label>
            <label class="check"><input type="checkbox" data-skill-mode="${esc(id)}" ${(row.bonus_mode || "auto") === "manual" ? "checked" : ""}/>Manual total</label>
            <input type="number" data-skill-bonus="${esc(id)}" value="${esc(row.bonus ?? 0)}" placeholder="bonus" />
            <input type="number" data-skill-manual="${esc(id)}" value="${esc(row.manual_total ?? derived.skills[id].base)}" placeholder="manual total" />
            <span class="derived-chip">${esc(fmtSigned(derived.skills[id].total))}</span>
          </div>`;
    }).join("")}
      </div>
      <h3>Arsenal</h3>
      <div class="inline-actions"><button type="button" id="attackAdd">Add Attack</button></div>
      <div class="stack">
        ${attacks.length === 0 ? `<p class="hint">No attacks</p>` : attacks.map((a, idx) => `<div class="attack-edit-row">
          <input data-attack-name="${idx}" value="${esc(a.name || "")}" placeholder="Name" />
          <input data-attack-bonus="${idx}" type="number" value="${esc(a.atk_bonus ?? 0)}" placeholder="Atk bonus" />
          <input data-attack-damage="${idx}" value="${esc(a.damage || "")}" placeholder="Damage dice" />
          <input data-attack-damagetype="${idx}" value="${esc(a.damage_type || "")}" placeholder="Damage type" />
          <input data-attack-range="${idx}" value="${esc(a.range || "")}" placeholder="Range/Reach" />
          <input data-attack-notes="${idx}" value="${esc(a.notes || "")}" placeholder="Notes" />
          <button type="button" data-attack-del="${idx}">Delete</button>
        </div>`).join("")}
      </div>
    </div></article>

    <article class="card ${sectionClass("sec-spells")}" id="sec-spells"><h2>${cardTitle("Spells", edited.spells)} <button type="button" class="card-toggle" data-toggle-sec="sec-spells">${collapsed["sec-spells"] ? "Expand" : "Collapse"}</button></h2><div class="card-body stack">
      <div class="inline-actions"><button type="button" id="spellAdd">Add Spell</button><button type="button" data-open-lookup="spell">Lookup Spells</button></div>
      ${spells.length === 0 ? `<p class="hint">No known spells</p>` : spells.map((s, idx) => `<div class="spell-row">
        <input data-spell-name="${idx}" value="${esc(s.name || "")}" placeholder="Name" />
        <input data-spell-level="${idx}" type="number" min="0" max="9" value="${esc(s.level ?? 0)}" />
        <input data-spell-school="${idx}" value="${esc(s.school || "")}" placeholder="School" />
        <label class="check"><input type="checkbox" data-spell-prep="${idx}" ${Array.isArray(character?.spells_prepared) && character.spells_prepared.some((p) => p.id === s.id) ? "checked" : ""}/>Prepared</label>
        <button type="button" data-spell-del="${idx}">Delete</button>
      </div>`).join("")}
    </div></article>

    <article class="card ${sectionClass("sec-inventory")}" id="sec-inventory"><h2>${cardTitle("Inventory", edited.inventory)} <button type="button" class="card-toggle" data-toggle-sec="sec-inventory">${collapsed["sec-inventory"] ? "Expand" : "Collapse"}</button></h2><div class="card-body stack">
      <button type="button" id="invAdd">Add Item</button>
      ${inventory.length === 0 ? `<p class="hint">No inventory items</p>` : inventory.map((r, idx) => `<div class="inv-row">
        <input data-inv-name="${idx}" value="${esc(r.name || "")}" placeholder="Item" />
        <input data-inv-qty="${idx}" type="number" min="0" value="${esc(r.qty ?? 1)}" />
        <input data-inv-notes="${idx}" value="${esc(r.notes || "")}" placeholder="Notes" />
        <button type="button" data-inv-del="${idx}">Delete</button>
      </div>`).join("")}
    </div></article>

    <article class="card ${sectionClass("sec-trackers")}" id="sec-trackers"><h2>${cardTitle("Trackers & Log", edited.trackers)} <button type="button" class="card-toggle" data-toggle-sec="sec-trackers">${collapsed["sec-trackers"] ? "Expand" : "Collapse"}</button></h2><div class="card-body stack">
      <div class="inline-actions"><button type="button" id="trackerAdd">Add Tracker</button><button type="button" id="logAdd">Add Log Entry</button></div>
      ${trackers.length === 0 ? `<p class="hint">No trackers</p>` : trackers.map((t, idx) => `<div class="tracker-row">
        <input data-tracker-label="${idx}" value="${esc(t.label || "")}" placeholder="Label" />
        <select data-tracker-reset="${idx}">${["none", "short_rest", "long_rest", "daily", "manual"].map((x) => `<option value="${x}" ${(t.reset || "none") === x ? "selected" : ""}>${x}</option>`).join("")}</select>
        <input data-tracker-max="${idx}" type="number" min="0" value="${esc(t.max ?? 0)}" />
        <input data-tracker-current="${idx}" type="number" min="0" value="${esc(t.current ?? 0)}" />
        <button type="button" data-tracker-del="${idx}">Delete</button>
      </div>`).join("")}
      <div class="log-list">
        ${log.slice().reverse().map((entry) => `<p><strong>${esc(entry.tag || "note")}</strong> ${esc(entry.message || "")}</p>`).join("") || `<p class="hint">No log entries</p>`}
      </div>
    </div></article>

    ${renderLookup(lookupState)}
    </section>
  </section>`;
  }
  function mountV2UI({ root: root2, getState, actions }) {
    if (!root2) throw new Error("mountV2UI requires root");
    const MODE_KEY = "living-codex-v2.ui.mode";
    const POLICY_KEY = "living-codex-v2.ui.policy";
    const DENSITY_KEY = "living-codex-v2.ui.density";
    const EDIT_TAB_KEY = "living-codex-v2.ui.edit_tab";
    const PLAY_PANE_KEY = "living-codex-v2.ui.play_pane";
    const PLAY_BOARD_KEY = "living-codex-v2.ui.play_board";
    const APPEARANCE_KEY = "living-codex-v2.ui.appearance";
    const draft = {
      name: "New Character",
      rulesetId: "dnd5e_2014",
      classId: "",
      speciesId: "",
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10
    };
    function readInitialPlayPane() {
      const valid = new Set(PLAY_PANES.map((p) => p.id));
      try {
        const fromSession = (sessionStorage.getItem(PLAY_PANE_KEY) || "").trim();
        if (valid.has(fromSession)) return fromSession;
      } catch {
      }
      const fromLocal = (localStorage.getItem(PLAY_PANE_KEY) || "").trim();
      if (valid.has(fromLocal)) return fromLocal;
      try {
        const raw = JSON.parse(localStorage.getItem(PLAY_BOARD_KEY) || "{}");
        const fromBoard = (raw?.activeModule || "").toString().trim();
        if (valid.has(fromBoard)) return fromBoard;
      } catch {
      }
      return "spells";
    }
    const uiState = {
      mode: localStorage.getItem(MODE_KEY) === "play" ? "play" : "edit",
      policyMode: localStorage.getItem(POLICY_KEY) === "core_only" ? "core_only" : "all_official",
      showCreate: false,
      diagnosticsOpen: false,
      edited: { core: false, classes: false, combat: false, spells: false, inventory: false, trackers: false },
      densityMode: localStorage.getItem(DENSITY_KEY) === "compact" ? "compact" : "comfortable",
      activeEditTab: localStorage.getItem(EDIT_TAB_KEY) || "core",
      activePlayPane: readInitialPlayPane(),
      playBoard: (() => {
        try {
          const raw = JSON.parse(localStorage.getItem(PLAY_BOARD_KEY) || "{}");
          return {
            utilityRailOpen: raw?.utilityRailOpen !== false,
            bandCompact: raw?.bandCompact === true,
            hudCollapsed: raw?.hudCollapsed === true,
            activeModule: typeof raw?.activeModule === "string" ? raw.activeModule : "spells"
          };
        } catch {
          return { utilityRailOpen: true, bandCompact: false, hudCollapsed: false, activeModule: "spells" };
        }
      })(),
      collapsedSectionsByTab: {},
      hudState: { pinned: true, collapsed: false },
      lastCastLevel: 0,
      lastAction: "",
      checksDrawerOpen: false,
      conditionEditor: { open: false, index: -1, model: { name: "", source: "", duration: "", rounds_remaining: "", notes: "", active: true } },
      diceTray: { open: false, die: 20, count: 1, mod: 0, rolling: false },
      portraitCrop: { open: false, src: "", zoom: 1, x: 0, y: 0, iw: 0, ih: 0 },
      toolsMenuOpen: false,
      toolsMenuOpenedAt: 0,
      exportMenuOpen: false,
      exportMenuOpenedAt: 0,
      appearanceOpen: false,
      appearanceSource: "auto",
      appearanceAutoLabel: "Default Parchment",
      appearanceDraft: sanitizeAppearance(),
      castMenu: { open: false, spellName: "", spellKey: "", baseLevel: 0, options: [], spellRef: null, concentrationForce: false, concentrationRounds: "" },
      palette: { open: false, query: "", selected: 0, recents: [] },
      lookup: { open: false, type: "spell", query: "", level: "", allowOffClassSpells: false, selected: 0, results: [], feedback: "", originSectionId: "", originScrollY: 0, cursor: 0 }
    };
    const sectionIds = ["sec-core", "sec-classes", "sec-combat", "sec-profile", "sec-mechanics", "sec-spells", "sec-inventory", "sec-trackers"];
    function captureFocusState() {
      const active = document.activeElement;
      if (!active || !root2.contains(active) || !isTypingTarget(active)) return null;
      const textLike = active.tagName === "TEXTAREA" || active.tagName === "INPUT" && !["checkbox", "radio", "button", "submit", "range", "color"].includes((active.type || "").toLowerCase());
      return {
        id: active.id || "",
        path: elementPathWithinRoot(active, root2),
        start: textLike ? active.selectionStart ?? null : null,
        end: textLike ? active.selectionEnd ?? null : null
      };
    }
    function restoreFocusState(state) {
      if (!state) return false;
      const target = state.id && root2.querySelector(`#${CSS.escape(state.id)}`) || queryByElementPath(root2, state.path);
      if (!target || !isTypingTarget(target)) return false;
      target.focus();
      if (state.start != null && typeof target.setSelectionRange === "function") {
        const max = (target.value || "").length;
        const s = clamp(asInt(state.start, 0), 0, max);
        const e = clamp(asInt(state.end, s), 0, max);
        target.setSelectionRange(s, e);
      }
      return true;
    }
    function readLocalAppearance() {
      try {
        const stored = localStorage.getItem(APPEARANCE_KEY);
        if (!stored) return null;
        const raw = JSON.parse(stored || "{}");
        if (!raw || typeof raw !== "object" || Object.keys(raw).length === 0) return null;
        return sanitizeAppearance(raw);
      } catch {
        return null;
      }
    }
    function readCharacterAppearance(character) {
      const raw = character?.ui?.appearance;
      if (!raw || typeof raw !== "object" || Object.keys(raw).length === 0) return null;
      return sanitizeAppearance(raw);
    }
    function sameAppearance(a, b) {
      const left = sanitizeAppearance(a || {});
      const right = sanitizeAppearance(b || {});
      for (const [key] of APPEARANCE_FIELDS) {
        if (left[key] !== right[key]) return false;
      }
      return left.surfaceAlpha === right.surfaceAlpha && left.shadowOpacity === right.shadowOpacity && left.shadowBlur === right.shadowBlur;
    }
    function persistAppearance(character, appearance, mode = "user") {
      if (!character) return;
      const finalAppearance = sanitizeAppearance(appearance);
      const currentAppearance = readCharacterAppearance(character);
      const currentMode = norm(character?.ui?.appearance_mode || "");
      if (sameAppearance(currentAppearance, finalAppearance) && currentMode === mode) return;
      actions.updateCharacter((c) => {
        c.ui = c.ui || {};
        c.ui.appearance = finalAppearance;
        c.ui.appearance_mode = mode;
      });
    }
    function resolveAppearance(character) {
      const appearanceMode = norm(character?.ui?.appearance_mode || "");
      const charTheme = readCharacterAppearance(character);
      if (charTheme && appearanceMode === "user") {
        uiState.appearanceSource = "user";
        uiState.appearanceAutoLabel = autoThemeLabel(character);
        return charTheme;
      }
      if (charTheme && appearanceMode === "auto") {
        const auto2 = deriveAutoAppearance(character);
        uiState.appearanceSource = "auto";
        uiState.appearanceAutoLabel = auto2.label;
        if (!sameAppearance(charTheme, auto2.appearance)) {
          persistAppearance(character, auto2.appearance, "auto");
        }
        return auto2.appearance;
      }
      if (charTheme && !appearanceMode) {
        const auto2 = deriveAutoAppearance(character);
        const isAuto = sameAppearance(charTheme, auto2.appearance);
        if (isAuto) {
          uiState.appearanceSource = "auto";
          uiState.appearanceAutoLabel = auto2.label;
          persistAppearance(character, auto2.appearance, "auto");
          return auto2.appearance;
        }
        uiState.appearanceSource = "user";
        uiState.appearanceAutoLabel = auto2.label;
        persistAppearance(character, charTheme, "user");
        return charTheme;
      }
      const localTheme = readLocalAppearance();
      if (localTheme && appearanceMode !== "auto") {
        uiState.appearanceSource = "user";
        uiState.appearanceAutoLabel = autoThemeLabel(character);
        return localTheme;
      }
      const auto = deriveAutoAppearance(character);
      uiState.appearanceSource = "auto";
      uiState.appearanceAutoLabel = auto.label;
      persistAppearance(character, auto.appearance, "auto");
      return auto.appearance;
    }
    function applyAppearance(appearance) {
      const a = sanitizeAppearance(appearance);
      const rootStyle = document.documentElement.style;
      rootStyle.setProperty("--bg", a.bg);
      rootStyle.setProperty("--bg-noise", a.bgNoise);
      rootStyle.setProperty("--paper", a.paper);
      rootStyle.setProperty("--paper-2", a.paper2);
      const paperRgb = hexToRgbTriplet(a.paper);
      rootStyle.setProperty("--paper-rgb", paperRgb);
      rootStyle.setProperty("--paper-2-rgb", hexToRgbTriplet(a.paper2, paperRgb));
      rootStyle.setProperty("--topbar-rgb", paperRgb);
      rootStyle.setProperty("--ink", a.ink);
      rootStyle.setProperty("--ink-soft", a.inkSoft);
      rootStyle.setProperty("--line", a.line);
      rootStyle.setProperty("--accent", a.accent);
      rootStyle.setProperty("--accent-2", a.accent2);
      rootStyle.setProperty("--ok", a.ok);
      rootStyle.setProperty("--warn", a.warn);
      rootStyle.setProperty("--err", a.err);
      rootStyle.setProperty("--surface-alpha", String(a.surfaceAlpha));
      rootStyle.setProperty("--shadow-alpha", String(a.shadowOpacity));
      rootStyle.setProperty("--shadow-blur", `${a.shadowBlur}px`);
    }
    function openAppearanceCustomizer() {
      const state = getState();
      uiState.appearanceDraft = resolveAppearance(state.character);
      uiState.appearanceOpen = true;
      uiState.toolsMenuOpen = false;
      applyAppearance(uiState.appearanceDraft);
      render();
    }
    function closeAppearanceCustomizer({ revert = false } = {}) {
      uiState.appearanceOpen = false;
      if (revert) {
        const state = getState();
        applyAppearance(resolveAppearance(state.character));
      }
      render();
    }
    function policyAllows(row) {
      if (uiState.policyMode !== "core_only") return true;
      return (row?.availability?.default || "allowed") !== "requires_dm_approval";
    }
    function policyCatalog(catalog2) {
      const classes = (catalog2.classes || []).filter(policyAllows);
      const species = (catalog2.species || []).filter(policyAllows);
      const subclasses = (catalog2.subclasses || []).filter(policyAllows);
      return { ...catalog2, classes, species, subclasses };
    }
    function classIdsFromCharacter(character) {
      const rows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
      return rows.map((x) => norm(x.id)).filter(Boolean);
    }
    function primaryClassId(character) {
      const rows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
      const primary = rows.find((x) => x?.isPrimary) || rows[0];
      return norm(primary?.id);
    }
    function refreshLookup() {
      if (!uiState.lookup.open || typeof actions.lookupProvider !== "function") return;
      const state = getState();
      uiState.lookup.results = actions.lookupProvider({
        type: uiState.lookup.type,
        query: uiState.lookup.query,
        filters: {
          level: uiState.lookup.level,
          classIds: classIdsFromCharacter(state.character),
          subclassIds: (Array.isArray(state.character?.core?.classes) ? state.character.core.classes : []).map((x) => norm(x?.subclassId)).filter(Boolean),
          classId: primaryClassId(state.character),
          allowOffClassSpells: Boolean(uiState.lookup.allowOffClassSpells),
          policyMode: uiState.policyMode
        }
      }) || [];
      if (uiState.lookup.selected >= uiState.lookup.results.length) uiState.lookup.selected = Math.max(0, uiState.lookup.results.length - 1);
    }
    function setMode(mode) {
      uiState.mode = mode === "play" ? "play" : "edit";
      if (uiState.mode !== "play") uiState.checksDrawerOpen = false;
      localStorage.setItem(MODE_KEY, uiState.mode);
    }
    function setPolicyMode(mode) {
      uiState.policyMode = mode === "core_only" ? "core_only" : "all_official";
      localStorage.setItem(POLICY_KEY, uiState.policyMode);
    }
    function setDensityMode(mode) {
      uiState.densityMode = mode === "compact" ? "compact" : "comfortable";
      localStorage.setItem(DENSITY_KEY, uiState.densityMode);
    }
    function setActiveEditTab(tabId) {
      const id = EDIT_TABS.some((t) => t.id === tabId) ? tabId : "core";
      uiState.activeEditTab = id;
      localStorage.setItem(EDIT_TAB_KEY, id);
      if (!uiState.collapsedSectionsByTab[id]) uiState.collapsedSectionsByTab[id] = {};
    }
    function setActivePlayPane(paneId) {
      const id = PLAY_PANES.some((p) => p.id === paneId) ? paneId : "spells";
      uiState.activePlayPane = id;
      uiState.playBoard.activeModule = id;
      localStorage.setItem(PLAY_PANE_KEY, id);
      try {
        sessionStorage.setItem(PLAY_PANE_KEY, id);
      } catch {
      }
      localStorage.setItem(PLAY_BOARD_KEY, JSON.stringify(uiState.playBoard));
    }
    function persistPlayBoard() {
      localStorage.setItem(PLAY_BOARD_KEY, JSON.stringify(uiState.playBoard));
    }
    function setPlayBoard(patch) {
      uiState.playBoard = { ...uiState.playBoard, ...patch || {} };
      persistPlayBoard();
    }
    function openConditionEditor(index = -1) {
      const state = getState();
      const rows = Array.isArray(state.character?.combat?.conditions) ? state.character.combat.conditions : [];
      const row = index >= 0 ? rows[index] : null;
      const model = typeof row === "string" ? { name: row, source: "", duration: "", rounds_remaining: "", notes: "", active: true } : {
        name: row?.name || "",
        source: row?.source || "",
        duration: row?.duration || "",
        rounds_remaining: row?.rounds_remaining ?? "",
        notes: row?.notes || "",
        active: row?.active !== false
      };
      uiState.conditionEditor = { open: true, index, model };
      render();
    }
    function closeConditionEditor() {
      uiState.conditionEditor = { open: false, index: -1, model: { name: "", source: "", duration: "", rounds_remaining: "", notes: "", active: true } };
      render();
    }
    function openConcentrationEditor(prefill = {}) {
      const state = getState();
      const current = state.character?.combat?.concentration || {};
      uiState.conditionEditor = {
        open: true,
        index: -2,
        model: {
          name: "Concentration",
          source: prefill.source || current.source || "",
          duration: prefill.duration || "",
          rounds_remaining: Number.isFinite(prefill.rounds_remaining) ? prefill.rounds_remaining : current.rounds_remaining ?? "",
          notes: prefill.notes || current.notes || "",
          active: prefill.active !== void 0 ? Boolean(prefill.active) : current.active !== false
        }
      };
      render();
    }
    function setConditionControls(patch = {}) {
      const current = uiState.playBoard?.conditionControls || { showConditions: false, showConcentration: false };
      setPlayBoard({ conditionControls: { ...current, ...patch } });
    }
    function advanceRound(steps = 1) {
      const roundsToAdvance = Math.max(1, asInt(steps, 1));
      let changed = false;
      actions.updateCharacter((c) => {
        c.combat = c.combat || {};
        c.combat.conditions = Array.isArray(c.combat.conditions) ? c.combat.conditions : [];
        c.combat.conditions = c.combat.conditions.map((row) => {
          if (!row || typeof row !== "object" || row.active === false) return row;
          const rounds = asInt(row.rounds_remaining, NaN);
          if (!Number.isFinite(rounds) || rounds <= 0) return row;
          changed = true;
          const next = Math.max(0, rounds - roundsToAdvance);
          return { ...row, rounds_remaining: next, active: next > 0 };
        });
        c.combat.concentration = c.combat.concentration || { active: false, source: "", notes: "", rounds_remaining: null };
        let cRounds = asInt(c.combat.concentration.rounds_remaining, NaN);
        if (c.combat.concentration.active && !Number.isFinite(cRounds)) {
          const inferred = inferConcentrationRoundsFromSource(c.combat.concentration.source, actions);
          if (Number.isFinite(inferred) && inferred > 0) {
            c.combat.concentration.rounds_remaining = inferred;
            cRounds = inferred;
            changed = true;
          }
        }
        if (c.combat.concentration.active && Number.isFinite(cRounds) && cRounds > 0) {
          changed = true;
          c.combat.concentration.rounds_remaining = Math.max(0, cRounds - roundsToAdvance);
          if (c.combat.concentration.rounds_remaining <= 0) {
            c.combat.concentration.active = false;
            c.combat.concentration.source = "";
          }
        }
      });
      const stateAfter = getState();
      const activeConcentration = Boolean(stateAfter?.character?.combat?.concentration?.active);
      const activeConditionsAfter = Array.isArray(stateAfter?.character?.combat?.conditions) ? stateAfter.character.combat.conditions.some((row) => {
        if (!row) return false;
        if (typeof row === "string") return true;
        return row.active !== false;
      }) : false;
      if (!activeConcentration) setConditionControls({ showConcentration: false });
      if (!activeConditionsAfter) setConditionControls({ showConditions: false });
      if (changed) recordPlayAction(`Advanced ${roundsToAdvance} round${roundsToAdvance === 1 ? "" : "s"}`);
    }
    function openDiceTray() {
      uiState.diceTray.open = true;
      render();
    }
    function closeDiceTray() {
      uiState.diceTray.open = false;
      uiState.diceTray.rolling = false;
      render();
    }
    function openChecksDrawer() {
      uiState.checksDrawerOpen = true;
      render();
    }
    function closeChecksDrawer() {
      uiState.checksDrawerOpen = false;
      render();
    }
    function secureDieRoll(sides) {
      const max = Math.max(2, asInt(sides, 20));
      const span = Math.floor(4294967296 / max) * max;
      const bucket = new Uint32Array(1);
      let v = 0;
      do {
        crypto.getRandomValues(bucket);
        v = bucket[0];
      } while (v >= span);
      return v % max + 1;
    }
    function buildDicePayload(die, count, mod) {
      const rolls = Array.from({ length: count }, () => secureDieRoll(die));
      const subtotal = rolls.reduce((a, b) => a + b, 0);
      const total = subtotal + mod;
      const label = `${count}d${die}${mod ? mod > 0 ? ` + ${mod}` : ` - ${Math.abs(mod)}` : ""}`;
      return { die, count, mod, rolls, subtotal, total, label, utc: (/* @__PURE__ */ new Date()).toISOString() };
    }
    function applyDicePayload(payload) {
      const { die, count, mod, rolls, subtotal, total, label, utc } = payload;
      actions.updateCharacter((c) => {
        c.play_state = c.play_state || {};
        c.play_state.dice_last_roll = {
          die,
          count,
          mod,
          rolls,
          subtotal,
          total,
          label,
          utc
        };
        c.log = Array.isArray(c.log) ? c.log : [];
        c.log.push({ id: crypto.randomUUID(), utc, tag: "roll", message: `${label} => [${rolls.join(", ")}] = ${total}` });
      });
      recordPlayAction(`Rolled ${label}: ${total}`);
    }
    function performDiceRoll() {
      const die = Math.max(2, asInt(uiState.diceTray.die, 20));
      const count = clamp(asInt(uiState.diceTray.count, 1), 1, 20);
      const mod = clamp(asInt(uiState.diceTray.mod, 0), -99, 99);
      applyDicePayload(buildDicePayload(die, count, mod));
    }
    function applyCheckRollResult(payload, type, id, label, mod) {
      const d20 = payload.rolls?.[0] ?? payload.total;
      const nat1 = d20 === 1;
      const nat20 = d20 === 20;
      actions.updateCharacter((c) => {
        c.play_state = c.play_state || {};
        c.play_state.last_check_roll = {
          type,
          id,
          label,
          mod,
          d20,
          total: payload.total,
          nat1,
          nat20,
          utc: payload.utc
        };
        c.log = Array.isArray(c.log) ? c.log : [];
        c.log.push({
          id: crypto.randomUUID(),
          utc: payload.utc,
          tag: type === "save" ? "save" : "check",
          message: `${label}: d20(${d20}) ${mod >= 0 ? "+" : "-"} ${Math.abs(mod)} = ${payload.total}`
        });
      });
      recordPlayAction(`${label}: d20(${d20}) ${mod >= 0 ? "+" : "-"} ${Math.abs(mod)} = ${payload.total}${nat20 ? " (nat 20)" : nat1 ? " (nat 1)" : ""}`);
    }
    function performModifierRoll(type, id, label, mod = 0) {
      const payload = buildDicePayload(20, 1, clamp(asInt(mod, 0), -99, 99));
      applyCheckRollResult(payload, type, id, label, mod);
    }
    function performInitiativeRoll() {
      const state = getState();
      const derived = deriveStats(state.character || {});
      const initiativeMod = asInt(derived?.abilityMods?.dex, 0);
      const payload = buildDicePayload(20, 1, initiativeMod);
      const d20 = payload.rolls?.[0] ?? payload.total;
      actions.updateCharacter((c) => {
        c.combat = c.combat || {};
        c.combat.initiative_bonus = payload.total;
        c.play_state = c.play_state || {};
        c.play_state.last_check_roll = {
          type: "initiative",
          id: "initiative",
          label: "Initiative",
          mod: initiativeMod,
          d20,
          total: payload.total,
          nat1: d20 === 1,
          nat20: d20 === 20,
          utc: payload.utc
        };
        c.log = Array.isArray(c.log) ? c.log : [];
        c.log.push({ id: crypto.randomUUID(), utc: payload.utc, tag: "initiative", message: `Rolled initiative: d20(${d20}) ${initiativeMod >= 0 ? "+" : "-"} ${Math.abs(initiativeMod)} = ${payload.total}` });
      });
      recordPlayAction(`Rolled initiative: d20(${d20}) ${initiativeMod >= 0 ? "+" : "-"} ${Math.abs(initiativeMod)} = ${payload.total}`);
    }
    function openPortraitCrop(src, iw, ih) {
      uiState.portraitCrop = { open: true, src, zoom: 1, x: 0, y: 0, iw, ih };
      render();
    }
    function closePortraitCrop() {
      uiState.portraitCrop = { open: false, src: "", zoom: 1, x: 0, y: 0, iw: 0, ih: 0 };
      render();
    }
    function drawPortraitPreview(size = 280) {
      const crop = uiState.portraitCrop;
      if (!crop.open || !crop.src) return;
      const canvas = root2.querySelector("#portraitPreview");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, size, size);
        const base = Math.max(size / img.width, size / img.height) * crop.zoom;
        const dw = img.width * base;
        const dh = img.height * base;
        const dx = (size - dw) / 2 + crop.x * (Math.abs(size - dw) / 2);
        const dy = (size - dh) / 2 + crop.y * (Math.abs(size - dh) / 2);
        ctx.drawImage(img, dx, dy, dw, dh);
      };
      img.src = crop.src;
    }
    function savePortraitFromCrop() {
      const crop = uiState.portraitCrop;
      if (!crop.open || !crop.src) return;
      const img = new Image();
      img.onload = () => {
        const out = document.createElement("canvas");
        out.width = 1024;
        out.height = 1024;
        const ctx = out.getContext("2d");
        const base = Math.max(1024 / img.width, 1024 / img.height) * crop.zoom;
        const dw = img.width * base;
        const dh = img.height * base;
        const dx = (1024 - dw) / 2 + crop.x * (Math.abs(1024 - dw) / 2);
        const dy = (1024 - dh) / 2 + crop.y * (Math.abs(1024 - dh) / 2);
        ctx.drawImage(img, dx, dy, dw, dh);
        const dataUrl = out.toDataURL("image/jpeg", 0.92);
        actions.updateCharacter((c) => {
          c.ui = c.ui || {};
          c.ui.portrait = { data_url: dataUrl, width: 1024, height: 1024, mime: "image/jpeg" };
        });
        closePortraitCrop();
      };
      img.src = crop.src;
    }
    function markEdited(sectionKey) {
      if (!sectionKey || !Object.prototype.hasOwnProperty.call(uiState.edited, sectionKey)) return;
      uiState.edited[sectionKey] = true;
    }
    function clearEdited() {
      for (const k of Object.keys(uiState.edited)) uiState.edited[k] = false;
    }
    function commandRegistry() {
      const state = getState();
      const hasCharacter = Boolean(state.character);
      return [
        { id: "save", label: "Save Character", hint: "Cmd/Ctrl+S", keywords: ["save", "persist"], enabled: () => hasCharacter, run: () => actions.saveNow() },
        { id: "import", label: "Import ZIP", hint: "Pack import", keywords: ["import", "zip"], enabled: () => true, run: () => actions.importZip() },
        { id: "export", label: "Export ZIP", hint: "Pack export", keywords: ["export", "zip"], enabled: () => hasCharacter, run: () => actions.exportZip() },
        { id: "toggle-mode", label: uiState.mode === "edit" ? "Switch to Play Mode" : "Switch to Edit Mode", hint: "View mode", keywords: ["mode", "play", "edit"], enabled: () => hasCharacter, run: () => setMode(uiState.mode === "edit" ? "play" : "edit") },
        { id: "policy-core", label: "Policy: Core Only", hint: "Hide DM approval options", keywords: ["policy", "core", "dm"], enabled: () => true, run: () => setPolicyMode("core_only") },
        { id: "policy-all", label: "Policy: All Official", hint: "Include DM approval options", keywords: ["policy", "all", "official"], enabled: () => true, run: () => setPolicyMode("all_official") },
        { id: "ui.openDiagnosticsDrawer", label: "Open Diagnostics", hint: "Drawer", keywords: ["diagnostics", "report", "errors"], enabled: () => true, run: () => {
          uiState.diagnosticsOpen = true;
        } },
        { id: "ui.openToolsMenu", label: "Open Tools Menu", hint: "Header tools", keywords: ["tools", "gear", "menu"], enabled: () => true, run: () => {
          uiState.toolsMenuOpen = true;
        } },
        { id: "ui.openAppearanceCustomizer", label: "Customize Appearance", hint: "Theme board", keywords: ["appearance", "theme", "colors"], enabled: () => true, run: () => openAppearanceCustomizer() },
        { id: "ui.openPalette", label: "Open Command Palette", hint: "Cmd/Ctrl+K", keywords: ["palette", "command"], enabled: () => true, run: () => {
          uiState.palette.open = true;
          uiState.palette.query = "";
          uiState.palette.selected = 0;
        } },
        { id: "new", label: "Open Create Character", hint: "New draft", keywords: ["new", "create"], enabled: () => true, run: () => {
          uiState.showCreate = true;
        } },
        { id: "jump-core", label: "Jump: Core", hint: "Ctrl/Cmd+1", keywords: ["jump", "core"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(0) },
        { id: "jump-classes", label: "Jump: Classes", hint: "Ctrl/Cmd+2", keywords: ["jump", "classes"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(1) },
        { id: "jump-combat", label: "Jump: Combat", hint: "Ctrl/Cmd+3", keywords: ["jump", "combat"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(2) },
        { id: "jump-spells", label: "Jump: Spells", hint: "Ctrl/Cmd+4", keywords: ["jump", "spells"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(5) },
        { id: "jump-inventory", label: "Jump: Inventory", hint: "Ctrl/Cmd+5", keywords: ["jump", "inventory"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(6) },
        { id: "jump-trackers", label: "Jump: Trackers & Log", hint: "Ctrl/Cmd+6", keywords: ["jump", "trackers", "log"], enabled: () => uiState.mode === "edit", run: () => jumpToSection(7) },
        { id: "lookup-spell", label: "Open Spell Lookup", hint: "Rules data", keywords: ["lookup", "spell"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => openLookup("spell") },
        { id: "lookup-class", label: "Open Class Lookup", hint: "Rules data", keywords: ["lookup", "class"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => openLookup("class") },
        { id: "lookup-subclass", label: "Open Subclass Lookup", hint: "Rules data", keywords: ["lookup", "subclass"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => openLookup("subclass") },
        { id: "lookup-species", label: "Open Species Lookup", hint: "Rules data", keywords: ["lookup", "species"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => openLookup("species") },
        { id: "ui.toggleDensity", label: uiState.densityMode === "compact" ? "Switch to Comfortable View" : "Switch to Compact View", hint: "Density", keywords: ["density", "compact", "comfortable"], enabled: () => true, run: () => setDensityMode(uiState.densityMode === "compact" ? "comfortable" : "compact") },
        { id: "ui.tab.core", label: "Tab: Core", hint: "Edit tab", keywords: ["tab", "core"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => setActiveEditTab("core") },
        { id: "ui.tab.battle", label: "Tab: Battle", hint: "Edit tab", keywords: ["tab", "battle"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => setActiveEditTab("battle") },
        { id: "ui.tab.spellcraft", label: "Tab: Spellcraft", hint: "Edit tab", keywords: ["tab", "spells"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => setActiveEditTab("spellcraft") },
        { id: "ui.tab.gear", label: "Tab: Gear", hint: "Edit tab", keywords: ["tab", "gear", "inventory"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => setActiveEditTab("gear") },
        { id: "ui.tab.chronicle", label: "Tab: Chronicle", hint: "Edit tab", keywords: ["tab", "chronicle"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => setActiveEditTab("chronicle") },
        { id: "ui.collapseAll", label: "Collapse All Sections", hint: "Edit", keywords: ["collapse", "sections"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => {
          const tab = uiState.activeEditTab || "core";
          uiState.collapsedSectionsByTab[tab] = Object.fromEntries(tabSections(tab).map((s) => [s, true]));
        } },
        { id: "ui.expandAll", label: "Expand All Sections", hint: "Edit", keywords: ["expand", "sections"], enabled: () => hasCharacter && uiState.mode === "edit", run: () => {
          const tab = uiState.activeEditTab || "core";
          uiState.collapsedSectionsByTab[tab] = Object.fromEntries(tabSections(tab).map((s) => [s, false]));
        } },
        { id: "ui.pane.spells", label: "Play Pane: Spells", hint: "Play pane", keywords: ["pane", "spells"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("spells") },
        { id: "ui.pane.bonus", label: "Play Pane: Bonus Actions", hint: "Play pane", keywords: ["pane", "bonus", "actions", "class"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("bonus") },
        { id: "ui.pane.attacks", label: "Play Pane: Attacks", hint: "Play pane", keywords: ["pane", "attacks"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("attacks") },
        { id: "ui.pane.trackers", label: "Play Pane: Trackers", hint: "Play pane", keywords: ["pane", "trackers"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("trackers") },
        { id: "ui.pane.log", label: "Play Pane: Log", hint: "Play pane", keywords: ["pane", "log"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("log") },
        { id: "ui.pane.notes", label: "Play Pane: Notes", hint: "Play pane", keywords: ["pane", "notes", "session"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("notes") },
        { id: "ui.play.openChecksDrawer", label: "Play: Open Checks Drawer", hint: "Checks and saves", keywords: ["play", "checks", "saves", "drawer"], enabled: () => hasCharacter && uiState.mode === "play", run: () => openChecksDrawer() },
        { id: "ui.play.closeChecksDrawer", label: "Play: Close Checks Drawer", hint: "Checks and saves", keywords: ["play", "checks", "saves", "drawer", "close"], enabled: () => hasCharacter && uiState.mode === "play" && uiState.checksDrawerOpen, run: () => closeChecksDrawer() },
        { id: "ui.play.focusCast", label: "Play Focus: Cast", hint: "Turn console", keywords: ["play", "cast", "focus"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("spells") },
        { id: "ui.play.focusBonus", label: "Play Focus: Bonus Actions", hint: "Turn console", keywords: ["play", "bonus", "focus"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("bonus") },
        { id: "ui.play.focusAttack", label: "Play Focus: Attack", hint: "Turn console", keywords: ["play", "attack", "focus"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("attacks") },
        { id: "ui.play.focusChecks", label: "Play Focus: Checks", hint: "Checks and saves", keywords: ["play", "checks", "focus"], enabled: () => hasCharacter && uiState.mode === "play", run: () => openChecksDrawer() },
        { id: "ui.play.focusResources", label: "Play Focus: Resources", hint: "Turn console", keywords: ["play", "resources", "focus"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setActivePlayPane("trackers") },
        { id: "ui.play.toggleUtilityRail", label: uiState.playBoard?.utilityRailOpen !== false ? "Hide Utility Rail" : "Show Utility Rail", hint: "Play layout", keywords: ["play", "utility", "rail"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setPlayBoard({ utilityRailOpen: !(uiState.playBoard?.utilityRailOpen !== false) }) },
        { id: "ui.play.toggleCompactBand", label: uiState.playBoard?.bandCompact ? "Expand Combat Band" : "Compact Combat Band", hint: "Play layout", keywords: ["play", "combat", "band", "compact"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setPlayBoard({ bandCompact: !uiState.playBoard?.bandCompact }) },
        { id: "ui.play.toggleHud", label: uiState.playBoard?.hudCollapsed ? "Expand Combat HUD" : "Collapse Combat HUD", hint: "Play layout", keywords: ["play", "hud", "collapse"], enabled: () => hasCharacter && uiState.mode === "play", run: () => setPlayBoard({ hudCollapsed: !uiState.playBoard?.hudCollapsed }) },
        { id: "play.openDiceTray", label: "Play: Roll Dice", hint: "Open dice tray", keywords: ["play", "dice", "roll", "d20"], enabled: () => hasCharacter && uiState.mode === "play", run: () => openDiceTray() },
        { id: "play.rollInitiative", label: "Play: Roll Initiative", hint: "1d20 + Dex", keywords: ["play", "initiative", "roll"], enabled: () => hasCharacter && uiState.mode === "play", run: () => performInitiativeRoll() },
        { id: "play.roll.d20", label: "Play: Quick Roll 1d20", hint: "Immediate roll", keywords: ["play", "quick", "d20"], enabled: () => hasCharacter && uiState.mode === "play", run: () => {
          uiState.diceTray = { ...uiState.diceTray, die: 20, count: 1, mod: 0 };
          performDiceRoll();
        } },
        { id: "play.shortRest", label: "Play: Short Rest", hint: "Restore pact slots", keywords: ["play", "short", "rest", "slots"], enabled: () => hasCharacter && uiState.mode === "play", run: () => performShortRest() },
        { id: "play.longRest", label: "Play: Long Rest", hint: "Restore all slots", keywords: ["play", "long", "rest", "slots"], enabled: () => hasCharacter && uiState.mode === "play", run: () => performLongRest() },
        { id: "play.undoLastCast", label: "Play: Undo Last Cast", hint: "Reverse recent cast", keywords: ["play", "undo", "cast"], enabled: () => hasCharacter && uiState.mode === "play", run: () => performUndoLastCast() },
        { id: "play.castSpell", label: "Play: Cast Spell", hint: "Consume selected slot", keywords: ["play", "cast", "spell"], enabled: () => false, run: () => {
        } }
      ];
    }
    function recordPlayAction(label) {
      uiState.lastAction = label;
      actions.updateCharacter((c) => {
        c.play_state = c.play_state || {};
        const existing = Array.isArray(c.play_state.recent_actions) ? c.play_state.recent_actions : [];
        c.play_state.recent_actions = [label, ...existing].slice(0, 5);
      });
    }
    function setCastFeedback(message) {
      actions.updateCharacter((c) => {
        c.play_state = c.play_state || {};
        c.play_state.cast_feedback = message;
      });
    }
    function adjustFeatureUse(featureId, delta = -1) {
      const state = getState();
      const actionsByKind = collectClassActionFeatures(state.character || {});
      const all = [...actionsByKind.bonus, ...actionsByKind.action, ...actionsByKind.reaction, ...actionsByKind.passive];
      const feature = all.find((f) => norm(f.id) === norm(featureId));
      if (!feature?.resource?.max) return;
      const max = Math.max(0, asInt(feature.resource.max, 0));
      const titleKey = norm(feature.title || "");
      const trackerIdx = (state.character?.trackers || []).findIndex((t) => {
        const l = norm(t?.label || "");
        return l && l.includes(titleKey);
      });
      actions.updateCharacter((c) => {
        c.play_state = c.play_state || {};
        c.play_state.feature_uses = c.play_state.feature_uses || {};
        if (trackerIdx >= 0 && c.trackers?.[trackerIdx]) {
          const t = c.trackers[trackerIdx];
          const tMax = Math.max(0, asInt(t.max, max));
          t.current = clamp(asInt(t.current, tMax) + asInt(delta, 0), 0, tMax);
          return;
        }
        const key = norm(feature.id);
        const cur = clamp(asInt(c.play_state.feature_uses[key], max), 0, max);
        c.play_state.feature_uses[key] = clamp(cur + asInt(delta, 0), 0, max);
      });
      recordPlayAction(`${delta < 0 ? "Used" : "Restored"} feature: ${feature.title}`);
    }
    function markFeatureUsed(featureId) {
      const state = getState();
      const actionsByKind = collectClassActionFeatures(state.character || {});
      const all = [...actionsByKind.bonus, ...actionsByKind.action, ...actionsByKind.reaction, ...actionsByKind.passive];
      const feature = all.find((f) => norm(f.id) === norm(featureId));
      if (!feature) return;
      recordPlayAction(`Used feature: ${feature.title}`);
    }
    function resetFeatureUses(restKind = "long") {
      actions.updateCharacter((c) => {
        const actionsByKind = collectClassActionFeatures(c || {});
        const all = [...actionsByKind.bonus, ...actionsByKind.action, ...actionsByKind.reaction, ...actionsByKind.passive];
        c.play_state = c.play_state || {};
        c.play_state.feature_uses = c.play_state.feature_uses || {};
        for (const feature of all) {
          const max = Math.max(0, asInt(feature?.resource?.max, 0));
          const reset = feature?.resource?.rest || "";
          if (!max) continue;
          if (restKind === "long" || restKind === "short" && reset === "short") {
            c.play_state.feature_uses[norm(feature.id)] = max;
          }
        }
      });
    }
    function performUndoLastCast() {
      const lvl = clamp(asInt(uiState.lastCastLevel, 0), 0, 9);
      if (lvl <= 0) {
        setCastFeedback("No prior leveled spell cast to undo.");
        return;
      }
      actions.updateCharacter((c) => {
        c.spell_slots = c.spell_slots || { levels: {} };
        c.spell_slots.levels = c.spell_slots.levels || {};
        const key = String(lvl);
        const row = c.spell_slots.levels[key] || { max: 0, used: 0 };
        row.used = Math.max(0, (row.used || 0) - 1);
        c.spell_slots.levels[key] = row;
      });
      recordPlayAction(`Undo cast: level ${lvl} slot refunded`);
      setCastFeedback(`Undo complete: restored one level ${lvl} slot.`);
    }
    function performShortRest() {
      actions.updateCharacter((c) => {
        const effective = computeEffectiveSlots(c);
        c.spell_slots = c.spell_slots || { levels: {}, pact: { max: 0, used: 0, level: 1 } };
        c.spell_slots.pact = {
          max: effective.pact?.max || 0,
          level: effective.pact?.level || 1,
          used: 0
        };
      });
      resetFeatureUses("short");
      recordPlayAction("Short rest: pact slots restored");
      setCastFeedback("Short rest applied: pact slots restored.");
    }
    function performLongRest() {
      actions.updateCharacter((c) => {
        const effective = computeEffectiveSlots(c);
        c.spell_slots = c.spell_slots || { levels: {}, pact: { max: 0, used: 0, level: 1 } };
        c.spell_slots.levels = c.spell_slots.levels || {};
        for (let i = 1; i <= 9; i++) {
          const key = String(i);
          const autoMax = effective.levels?.[key]?.max || 0;
          c.spell_slots.levels[key] = { max: autoMax, used: 0 };
        }
        c.spell_slots.pact = {
          max: effective.pact?.max || 0,
          level: effective.pact?.level || 1,
          used: 0
        };
      });
      resetFeatureUses("long");
      recordPlayAction("Long rest: all spell slots restored");
      setCastFeedback("Long rest applied: all spell slots restored.");
    }
    function openCastMenu(spellName, spellKey, baseLevel, spellRef = null) {
      const state = getState();
      const effective = computeEffectiveSlots(state.character).levels;
      const options = [];
      for (let lvl = baseLevel; lvl <= 9; lvl++) {
        const row = effective[String(lvl)] || { max: 0, used: 0 };
        const avail = Math.max(0, (row.max || 0) - (row.used || 0));
        if (avail > 0) options.push({ level: lvl, available: avail, max: row.max || 0 });
      }
      const catalogSpell = (() => {
        const cat = actions.getCatalog ? actions.getCatalog() : null;
        const spells = Array.isArray(cat?.spells) ? cat.spells : [];
        return findSpellByAnyKey(spells, spellRef?.id || spellRef?.spell_id || spellKey || spellName) || spells.find((s) => norm(s?.name) === norm(spellName)) || null;
      })();
      const detectedConcentration = toBoolFlag(spellRef?.concentration) || toBoolFlag(catalogSpell?.concentration);
      const detectedRounds = parseRoundsFromDuration(spellRef?.duration || catalogSpell?.duration || "");
      uiState.castMenu = {
        open: true,
        spellName,
        spellKey,
        baseLevel,
        options,
        spellRef: spellRef || uiState.castMenu?.spellRef || null,
        concentrationForce: detectedConcentration,
        concentrationRounds: Number.isFinite(detectedRounds) ? String(detectedRounds) : ""
      };
      render();
    }
    function closeCastMenu() {
      uiState.castMenu = { open: false, spellName: "", spellKey: "", baseLevel: 0, options: [], spellRef: null, concentrationForce: false, concentrationRounds: "" };
      render();
    }
    function performCastAtLevel(lvl, spellName = "Spell", spellRef = null, castOptions = {}) {
      const level = clamp(asInt(lvl, 0), 0, 9);
      if (level === 0) {
        setCastFeedback("Cantrip cast: no slot consumed.");
        recordPlayAction(`Cast cantrip: ${spellName}`);
        return;
      }
      let consumed = false;
      actions.updateCharacter((c) => {
        const effective = computeEffectiveSlots(c);
        const key = String(level);
        c.spell_slots = c.spell_slots || { levels: {} };
        c.spell_slots.levels = c.spell_slots.levels || {};
        const autoMax = effective.levels?.[key]?.max || 0;
        if (autoMax <= 0) return;
        const row = c.spell_slots.levels[key] || { max: autoMax, used: 0 };
        if ((row.used || 0) >= autoMax) return;
        row.max = autoMax;
        row.used = Math.min(autoMax, (row.used || 0) + 1);
        c.spell_slots.levels[key] = row;
        consumed = true;
      });
      if (consumed) {
        uiState.lastCastLevel = level;
        const castSpell = (() => {
          if (spellRef) return spellRef;
          const ch = getState().character || {};
          const knownRows = Array.isArray(ch.spells_known) ? ch.spells_known : [];
          const preparedRows = Array.isArray(ch.spells_prepared) ? ch.spells_prepared : [];
          const allRows = [...knownRows, ...preparedRows];
          return findSpellByAnyKey(allRows, spellName) || allRows.find((s) => norm(s?.name) === norm(spellName)) || null;
        })();
        const catalogSpell = (() => {
          const cat = actions.getCatalog ? actions.getCatalog() : null;
          const spells = Array.isArray(cat?.spells) ? cat.spells : [];
          const direct = findSpellByAnyKey(spells, castSpell?.id || castSpell?.spell_id || spellName);
          return direct || spells.find((s) => norm(s?.name) === norm(castSpell?.name || spellName)) || null;
        })();
        const isConcentration = toBoolFlag(castSpell?.concentration) || toBoolFlag(catalogSpell?.concentration);
        const manualConcentration = castOptions?.forceConcentration === true;
        if (isConcentration || manualConcentration) {
          const manualRounds = asInt(castOptions?.concentrationRounds, 0);
          const rounds = (() => {
            if (manualRounds > 0) return manualRounds;
            const fromCatalog = parseRoundsFromDuration(catalogSpell?.duration || "");
            if (Number.isFinite(fromCatalog) && fromCatalog > 0) return fromCatalog;
            const fromSpellRow = parseRoundsFromDuration(castSpell?.duration || "");
            if (Number.isFinite(fromSpellRow) && fromSpellRow > 0) return fromSpellRow;
            return null;
          })();
          const sourceName = castSpell?.name || catalogSpell?.name || spellName;
          actions.updateCharacter((c) => {
            c.combat = c.combat || {};
            c.combat.concentration = c.combat.concentration || { active: false, source: "", notes: "", rounds_remaining: null };
            c.combat.concentration.active = true;
            c.combat.concentration.source = sourceName;
            c.combat.concentration.rounds_remaining = Number.isFinite(rounds) ? rounds : null;
          });
          setConditionControls({ showConcentration: true });
          if (!Number.isFinite(rounds) || rounds <= 0) {
            openConcentrationEditor({ source: sourceName, active: true, rounds_remaining: "" });
            recordPlayAction(`Concentration started: ${sourceName} (set rounds)`);
          } else {
            recordPlayAction(`Concentration started: ${sourceName} (${rounds} rounds)`);
          }
        }
        setCastFeedback(`Cast applied: ${spellName} at level ${level}.`);
        recordPlayAction(`Cast ${spellName} at L${level}`);
        return;
      }
      setCastFeedback(`No level ${level} slots available.`);
    }
    function visibleCommands() {
      const q = norm(uiState.palette.query);
      return commandRegistry().filter((cmd) => cmd.enabled()).filter((cmd) => {
        if (!q) return true;
        const hay = `${cmd.label} ${(cmd.keywords || []).join(" ")} ${cmd.id}`.toLowerCase();
        return hay.includes(q);
      });
    }
    function runCommand(id) {
      const cmd = commandRegistry().find((c) => c.id === id && c.enabled());
      if (!cmd) return;
      cmd.run();
      uiState.palette.recents = [id, ...uiState.palette.recents.filter((x) => x !== id)].slice(0, 8);
      uiState.palette.open = false;
      uiState.palette.query = "";
      uiState.palette.selected = 0;
      render();
    }
    function applyLookupSelection(index = uiState.lookup.selected) {
      const state = getState();
      const character = state.character;
      const row = uiState.lookup.results[index];
      if (!row || !character) return false;
      if (uiState.lookup.type === "species") {
        markEdited("core");
        actions.updateCharacter((c) => {
          c.core = c.core || { classes: [] };
          c.core.speciesId = row.id;
        });
        uiState.lookup.feedback = `Set species to ${row.title}.`;
        return true;
      }
      if (uiState.lookup.type === "class") {
        const existing = Array.isArray(character?.core?.classes) ? character.core.classes.some((x) => norm(x?.id) === norm(row.id)) : false;
        if (existing) {
          uiState.lookup.feedback = `Class already present: ${row.title}.`;
          return false;
        }
        markEdited("classes");
        actions.updateCharacter((c) => {
          c.core = c.core || { classes: [] };
          c.core.classes = Array.isArray(c.core.classes) ? c.core.classes : [];
          c.core.classes.push({ id: row.id, level: 1, isPrimary: c.core.classes.length === 0, subclassId: "" });
        });
        uiState.lookup.feedback = `Added class ${row.title}.`;
        return true;
      }
      if (uiState.lookup.type === "spell") {
        const spellId = makeSpellId(row.raw);
        const exists = (character.spells_known || []).some((x) => (x.id || x.spell_id || x.name) === spellId);
        if (exists) {
          uiState.lookup.feedback = `Spell already exists: ${row.title}.`;
          return false;
        }
        markEdited("spells");
        actions.updateCharacter((c) => {
          c.spells_known = Array.isArray(c.spells_known) ? c.spells_known : [];
          c.spells_known.push({
            id: spellId,
            name: row.raw?.name || row.title,
            level: asInt(row.raw?.level, 0),
            school: row.raw?.school || "",
            source: row.raw?.source || "",
            ritual: toBoolFlag(row.raw?.ritual),
            concentration: toBoolFlag(row.raw?.concentration),
            casting_time: row.raw?.casting_time || "",
            range: row.raw?.range || "",
            components: row.raw?.components || "",
            duration: row.raw?.duration || "",
            spell_id: row.raw?.id || "",
            page: row.raw?.page || "",
            notes: ""
          });
        });
        uiState.lookup.feedback = `Added spell ${row.title}.`;
        return true;
      }
      if (uiState.lookup.type === "subclass") {
        const classRows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
        const targetIdx = classRows.findIndex((x) => norm(x?.id) === norm(row.raw?.class_id));
        if (targetIdx < 0) {
          uiState.lookup.feedback = `No matching class found for ${row.title}. Add ${row.raw?.class_id || "that class"} first.`;
          return false;
        }
        markEdited("classes");
        actions.updateCharacter((c) => {
          c.core = c.core || { classes: [] };
          c.core.classes = Array.isArray(c.core.classes) ? c.core.classes : [];
          if (!c.core.classes[targetIdx]) return;
          c.core.classes[targetIdx].subclassId = row.id;
        });
        uiState.lookup.feedback = `Set subclass to ${row.title}.`;
        return true;
      }
      return false;
    }
    function jumpToSection(idx) {
      const ids = uiState.mode === "edit" ? tabSections(uiState.activeEditTab || "core") : sectionIds;
      const id = ids[idx];
      if (!id) return;
      const el = root2.querySelector(`#${id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function openLookup(type) {
      const active = document.activeElement;
      const section = active?.closest?.(".card[id]") || null;
      uiState.lookup.open = true;
      uiState.lookup.type = type;
      uiState.lookup.query = "";
      uiState.lookup.level = "";
      uiState.lookup.allowOffClassSpells = false;
      uiState.lookup.selected = 0;
      uiState.lookup.cursor = 0;
      uiState.lookup.feedback = "";
      uiState.lookup.originSectionId = section?.id || "";
      uiState.lookup.originScrollY = window.scrollY || 0;
      refreshLookup();
      render();
    }
    function closeLookup({ restore = true } = {}) {
      const sectionId = uiState.lookup.originSectionId;
      const scrollY = uiState.lookup.originScrollY;
      uiState.lookup.open = false;
      uiState.lookup.originSectionId = "";
      uiState.lookup.originScrollY = 0;
      render();
      if (!restore) return;
      requestAnimationFrame(() => {
        const target = sectionId ? root2.querySelector(`#${sectionId}`) : null;
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        window.scrollTo({ top: scrollY, behavior: "smooth" });
      });
    }
    function cycleSections(step) {
      if (uiState.mode !== "edit") return;
      const ids = tabSections(uiState.activeEditTab || "core");
      const tops = ids.map((id, idx) => ({ idx, el: root2.querySelector(`#${id}`) })).filter((x) => x.el).map((x) => ({ idx: x.idx, top: x.el.getBoundingClientRect().top }));
      if (!tops.length) return;
      const current = tops.find((x) => x.top > 0) || tops[tops.length - 1];
      const next = (current.idx + step + ids.length) % ids.length;
      jumpToSection(next);
    }
    function render() {
      const priorFocus = captureFocusState();
      const state = getState();
      const character = state.character;
      const rawCatalog = actions.getCatalog ? actions.getCatalog() : { classes: [], species: [], spells: [], error: "" };
      const catalog2 = policyCatalog(rawCatalog);
      const runtime = actions.getRuntimeStatus ? actions.getRuntimeStatus() : { message: "", tone: "info", at: "" };
      if (!state.app.dirty) clearEdited();
      refreshLookup();
      const commands = visibleCommands();
      applyAppearance(uiState.appearanceOpen ? uiState.appearanceDraft : resolveAppearance(character));
      const portrait = getEffectivePortrait(character);
      const hasPortrait = Boolean(portrait);
      const classBadgeRows = Array.isArray(character?.core?.classes) ? character.core.classes : [];
      const classBadgeItems = classBadgeRows.map((row) => ({ id: norm(row?.id), level: clamp(asInt(row?.level, 1), 1, 20) })).filter((row) => row.id && getClassBadge(row.id)).filter((row, idx, arr) => arr.findIndex((x) => x.id === row.id) === idx);
      root2.innerHTML = `
      <header class="shell-topbar ${hasPortrait ? "has-play-portrait" : ""}">
        ${hasPortrait ? `<img class="play-profile-portrait" src="${esc(portrait)}" alt="${esc(character?.meta?.name || "Character")} portrait" />` : ""}
        <div class="brand-block">
          <h1>${character ? esc(character?.meta?.name || "Unnamed") : "No active character"}</h1>
          <p class="brand-meta">${character ? esc(characterSubtitle(character, catalog2)) : "The Living Codex"} </p>
          ${classBadgeItems.length ? `<div class="header-class-strip" aria-label="Class badges">
            ${classBadgeItems.map((row) => `<img class="header-class-badge" src="${esc(getClassBadge(row.id))}" alt="${esc(titleizeId(row.id))} class badge" title="${esc(`${titleizeId(row.id)} (Level ${row.level})`)}" />`).join("")}
          </div>` : ""}
        </div>
        <div class="top-actions">
          <div class="top-controls-grid">
            <div class="toggle-stack">
              <label class="dual-toggle-chip" for="policyModeToggle" title="Choose which player options appear in lookups and selectors">
                <span class="${uiState.policyMode === "all_official" ? "is-active" : ""}">All Official Player Options</span>
                <input id="policyModeToggle" type="checkbox" ${uiState.policyMode === "core_only" ? "checked" : ""} />
                <span class="policy-switch" aria-hidden="true"></span>
                <span class="${uiState.policyMode === "core_only" ? "is-active" : ""}">Core Options Only (PHB)</span>
              </label>
              <label class="dual-toggle-chip ${character ? "" : "is-disabled"}" for="modeToggle">
                <span class="${uiState.mode === "edit" ? "is-active" : ""}">Edit</span>
                <input id="modeToggle" type="checkbox" ${uiState.mode === "play" ? "checked" : ""} ${character ? "" : "disabled"} />
                <span class="policy-switch" aria-hidden="true"></span>
                <span class="${uiState.mode === "play" ? "is-active" : ""}">Play</span>
              </label>
            </div>
          </div>
          <div class="top-row-actions">
            <span class="status-chip ${state.app.dirty ? "dirty" : "saved"}" title="${esc(runtime.message || "No recent action")}">${state.app.dirty ? "Unsaved" : "Saved"}</span>
            <div class="tools-menu-wrap">
              <button type="button" id="toolsMenuBtn" title="Tools" aria-label="Tools">\u2699</button>
              ${uiState.toolsMenuOpen ? `<div class="tools-menu" id="toolsMenu">
                <button type="button" id="toolsOpenPalette">Command Palette</button>
                <button type="button" id="toolsExportPdf" ${character ? "" : "disabled"}>Export PDF</button>
                <button type="button" id="toolsOpenAppearance">Customize Appearance</button>
                <button type="button" id="toolsOpenDiagnostics">Diagnostics</button>
              </div>` : ""}
            </div>
            <button type="button" class="btn-primary" id="saveBtn" ${character ? "" : "disabled"}>Save</button>
            <button type="button" id="importBtn">Import</button>
            <div class="tools-menu-wrap export-menu-wrap">
              <button type="button" id="exportMenuBtn" ${character ? "" : "disabled"}>Export</button>
              ${uiState.exportMenuOpen ? `<div class="tools-menu" id="exportMenu">
                <button type="button" id="exportZipOption" ${character ? "" : "disabled"}>Export ZIP</button>
                <button type="button" id="exportPdfOption" ${character ? "" : "disabled"}>Export PDF</button>
              </div>` : ""}
            </div>
            <button type="button" id="newCharBtn">New Character</button>
          </div>
        </div>
      </header>

      ${!character || uiState.showCreate ? `<section class="card"><h2>Create Character</h2><div class="card-body create-grid">
        <div class="create-portrait-preview">
          ${getDraftPortrait(draft.speciesId) ? `<img src="${esc(getDraftPortrait(draft.speciesId))}" alt="${esc(titleizeId(draft.speciesId || "species"))} portrait preview" />` : `<div class="create-portrait-placeholder">Select a species to preview default portrait</div>`}
        </div>
        <label>Name<input id="newName" value="${esc(draft.name)}" /></label>
        <label>Ruleset<select id="newRuleset"><option value="dnd5e_2014" ${draft.rulesetId === "dnd5e_2014" ? "selected" : ""}>D&D 5e (2014)</option><option value="dnd5e_2024" ${draft.rulesetId === "dnd5e_2024" ? "selected" : ""}>D&D 5e (2024)</option></select></label>
        <label>Class
          <div class="create-class-picker">
            ${getClassBadge(draft.classId) ? `<img class="create-class-badge" src="${esc(getClassBadge(draft.classId))}" alt="${esc(titleizeId(draft.classId || "class"))} badge" />` : `<span class="create-class-badge-placeholder" aria-hidden="true"></span>`}
            <select id="newClass">${optionList(catalog2.classes || [], draft.classId, "Optional class")}</select>
          </div>
        </label>
        <label>Species<select id="newSpecies">${optionList(catalog2.species || [], draft.speciesId, "Optional species")}</select></label>
        <div class="create-identity-preview">
          ${getClassBadge(draft.classId) ? `<img class="create-class-badge" src="${esc(getClassBadge(draft.classId))}" alt="${esc(titleizeId(draft.classId || "class"))} badge" />` : `<span class="create-class-badge-placeholder" aria-hidden="true"></span>`}
          <span>${esc(titleizeId(draft.classId || "no class selected"))}</span>
          <span>\u2022</span>
          <span>${esc(titleizeId(draft.speciesId || "no species selected"))}</span>
        </div>
        <div class="six-grid">${["str", "dex", "con", "int", "wis", "cha"].map((k) => `<label>${k.toUpperCase()}<input id="new${k.toUpperCase()}" type="number" min="1" max="30" value="${esc(draft[k])}" /></label>`).join("")}</div>
        <div class="inline-actions"><button type="button" class="btn-primary" id="createBtn">Create Character</button>${character ? `<button type="button" id="cancelCreateBtn">Cancel</button>` : ""}</div>
      </div></section>` : `${uiState.mode === "play" ? renderPlayMode(character, uiState, actions) : renderEditMode(character, catalog2, uiState.lookup, uiState.edited, uiState)}`}

      ${renderPalette(uiState.palette, commands)}
      ${uiState.appearanceOpen ? `<div class="palette-overlay" id="appearanceOverlay">
        <section class="palette cast-menu" role="dialog" aria-modal="true">
          <button type="button" class="overlay-close" data-overlay-close="appearance" aria-label="Close overlay">\xD7</button>
          <h3>Customize Appearance</h3>
          <p class="hint">Theme source: <strong>${uiState.appearanceSource === "auto" ? `Auto (${esc(uiState.appearanceAutoLabel)})` : "User Customized"}</strong></p>
          <div class="grid2 appearance-grid">
            ${APPEARANCE_FIELDS.map(([key, label]) => `<label>${esc(label)}<input type="color" data-appearance-color="${esc(key)}" value="${esc(uiState.appearanceDraft[key])}" /></label>`).join("")}
            <label>Surface Transparency<input type="range" min="0.65" max="1" step="0.01" data-appearance-range="surfaceAlpha" value="${esc(uiState.appearanceDraft.surfaceAlpha)}" /></label>
            <label>Shadow Depth<input type="range" min="12" max="44" step="1" data-appearance-range="shadowBlur" value="${esc(uiState.appearanceDraft.shadowBlur)}" /></label>
            <label>Shadow Opacity<input type="range" min="0.05" max="0.28" step="0.01" data-appearance-range="shadowOpacity" value="${esc(uiState.appearanceDraft.shadowOpacity)}" /></label>
          </div>
          <div class="inline-actions">
            <button type="button" id="appearanceReset">Reset to Auto Theme</button>
            <button type="button" id="appearanceCancel">Cancel</button>
            <button type="button" class="btn-primary" id="appearanceSave">Save Theme</button>
          </div>
        </section>
      </div>` : ""}
      ${uiState.castMenu.open ? `<div class="palette-overlay" id="castOverlay">
        <section class="palette cast-menu" role="dialog" aria-modal="true">
          <button type="button" class="overlay-close" data-overlay-close="cast" aria-label="Close overlay">\xD7</button>
          <h3>Cast ${esc(uiState.castMenu.spellName)}</h3>
          <p class="hint">Choose spell slot level</p>
          <div class="cast-options">
            ${uiState.castMenu.options.length ? uiState.castMenu.options.map((x) => `<button type="button" data-cast-at="${x.level}">Level ${x.level} (${x.available}/${x.max})</button>`).join("") : `<p class="hint">No available slots for this spell.</p>`}
          </div>
          <div class="inline-actions"><button type="button" id="castMenuCancel">Cancel</button></div>
        </section>
      </div>` : ""}
      ${uiState.conditionEditor.open ? `<div class="palette-overlay" id="conditionOverlay">
        <section class="palette cast-menu" role="dialog" aria-modal="true">
          <button type="button" class="overlay-close" data-overlay-close="condition" aria-label="Close overlay">\xD7</button>
          <h3>${uiState.conditionEditor.index === -2 ? "Set Concentration Details" : uiState.conditionEditor.index >= 0 ? "Edit Condition" : "Add Condition"}</h3>
          <div class="stack">
            ${uiState.conditionEditor.index === -2 ? `<p class="hint">Tell the app what you are concentrating on, and if known, how many rounds concentration lasts.</p>` : ""}
            ${uiState.conditionEditor.index === -2 ? "" : `<label>Name<input id="condName" value="${esc(uiState.conditionEditor.model.name || "")}" placeholder="e.g. Poisoned" /></label>`}
            <label>${uiState.conditionEditor.index === -2 ? "Concentrating on" : "Source"}<input id="condSource" value="${esc(uiState.conditionEditor.model.source || "")}" placeholder="e.g. Hold Person" /></label>
            ${uiState.conditionEditor.index === -2 ? "" : `<label>Duration text<input id="condDuration" value="${esc(uiState.conditionEditor.model.duration || "")}" placeholder="e.g. Until the start of your next turn" /></label>`}
            <label>${uiState.conditionEditor.index === -2 ? "How many rounds does concentration last?" : "How many rounds does this condition last?"}<input id="condRounds" type="number" min="1" value="${esc(uiState.conditionEditor.model.rounds_remaining ?? "")}" placeholder="Leave blank if open-ended" /></label>
            <label>Notes<textarea id="condNotes">${esc(uiState.conditionEditor.model.notes || "")}</textarea></label>
            <label class="check"><input type="checkbox" id="condActive" ${uiState.conditionEditor.model.active !== false ? "checked" : ""}/>Active</label>
          </div>
          <div class="inline-actions">
            ${uiState.conditionEditor.index >= 0 || uiState.conditionEditor.index === -2 ? `<button type="button" id="condDelete">${uiState.conditionEditor.index === -2 ? "Clear" : "Remove"}</button>` : ""}
            <button type="button" id="condCancel">Cancel</button>
            <button type="button" class="btn-primary" id="condSave">Save</button>
          </div>
        </section>
      </div>` : ""}
      ${uiState.diceTray.open ? `<div class="palette-overlay" id="diceOverlay">
        <section class="palette cast-menu dice-tray" role="dialog" aria-modal="true" style="--die-outline:${esc(dieOutlineColor(uiState.diceTray.die))}">
          <button type="button" class="overlay-close" data-overlay-close="dice" aria-label="Close overlay">\xD7</button>
          <h3>Dice Tray</h3>
          <p class="hint">Choose dice, then roll.</p>
          <div class="grid2">
            <label>Dice Type
              <select id="diceType">
                ${[4, 6, 8, 10, 12, 20, 100].map((d) => `<option value="${d}" ${asInt(uiState.diceTray.die, 20) === d ? "selected" : ""}>d${d}</option>`).join("")}
              </select>
            </label>
            <label>Dice Count<input id="diceCount" type="number" min="1" max="20" value="${esc(uiState.diceTray.count)}" /></label>
            <label>Modifier<input id="diceMod" type="number" min="-99" max="99" value="${esc(uiState.diceTray.mod)}" /></label>
          </div>
          <div class="inline-actions">
            <button type="button" id="diceQuickD20">Quick 1d20</button>
            <button type="button" id="diceQuick2d6">Quick 2d6</button>
            <button type="button" id="diceCancel">Close</button>
            <button type="button" class="btn-primary" id="diceRollBtn">Roll</button>
          </div>
          ${character?.play_state?.dice_last_roll ? `<div class="dice-result">
            <p><strong>${esc(character.play_state.dice_last_roll.label || "Roll")}</strong></p>
            <p class="dice-result-rolls">Dice: ${(character.play_state.dice_last_roll.rolls || []).map((v) => `<span class="die-chip ${dieShapeClass(character.play_state.dice_last_roll.die || uiState.diceTray.die)}">${esc(v)}</span>`).join("")}</p>
            <p>Total: <strong>${esc(character.play_state.dice_last_roll.total ?? 0)}</strong></p>
          </div>` : ""}
        </section>
      </div>` : ""}
      ${uiState.diagnosticsOpen ? `<div class="palette-overlay" id="diagnosticsOverlay">
        <section class="diag-drawer" role="dialog" aria-modal="true">
          <button type="button" class="overlay-close" data-overlay-close="diagnostics" aria-label="Close overlay">\xD7</button>
          <h3>Diagnostics</h3>
          <div class="diag-drawer-body">
            ${runtime.message ? `<p class="tone tone-${esc(runtime.tone || "info")}">${esc(runtime.message)}</p>` : `<p class="hint">No recent runtime message.</p>`}
            ${rawCatalog.error ? `<p class="error">Rules data error: ${esc(rawCatalog.error)}</p>` : ""}
            ${state.app.lastError ? `<p class="error">App error: ${esc(state.app.lastError)}</p>` : ""}
            ${renderReport(state.importReport)}
          </div>
        </section>
      </div>` : ""}
      ${uiState.portraitCrop.open ? `<div class="palette-overlay" id="portraitOverlay">
        <section class="palette cast-menu" role="dialog" aria-modal="true">
          <button type="button" class="overlay-close" data-overlay-close="portrait" aria-label="Close overlay">\xD7</button>
          <h3>Crop Portrait</h3>
          <div class="split-grid">
            <canvas id="portraitPreview" width="280" height="280"></canvas>
            <div class="stack">
              <label>Zoom<input id="portraitZoom" type="range" min="1" max="3" step="0.01" value="${esc(uiState.portraitCrop.zoom)}" /></label>
              <label>Horizontal<input id="portraitX" type="range" min="-1" max="1" step="0.01" value="${esc(uiState.portraitCrop.x)}" /></label>
              <label>Vertical<input id="portraitY" type="range" min="-1" max="1" step="0.01" value="${esc(uiState.portraitCrop.y)}" /></label>
            </div>
          </div>
          <div class="inline-actions"><button type="button" id="portraitCancel">Cancel</button><button type="button" class="btn-primary" id="portraitSave">Save Portrait</button></div>
        </section>
      </div>` : ""}
      <footer class="app-footer">
        <div class="app-footer-mark" aria-hidden="true"></div>
        <div class="app-footer-left">
          <strong>The Living Codex <sup>v2</sup></strong>
        </div>
        <div class="app-footer-right">
          <p>Dungeons & Dragons and related marks are property of Wizards of the Coast. All trademarks and copyrights belong to their respective owners.</p>
          <p>No warranty. Use at your own risk; you\u2019re responsible for outcomes and any errors.</p>
        </div>
      </footer>
    `;
      bindEvents();
      let explicitFocusHandled = false;
      if (uiState.palette.open) {
        const query = root2.querySelector("#paletteQuery");
        if (query) {
          query.focus();
          explicitFocusHandled = true;
        }
      }
      if (uiState.lookup.open) {
        const lookup = root2.querySelector("#lookupQuery");
        if (lookup) {
          lookup.focus();
          const pos = clamp(asInt(uiState.lookup.cursor, lookup.value.length), 0, lookup.value.length);
          lookup.setSelectionRange(pos, pos);
          explicitFocusHandled = true;
        }
      }
      if (uiState.portraitCrop.open) drawPortraitPreview();
      if (!explicitFocusHandled) restoreFocusState(priorFocus);
    }
    function bindEvents() {
      const state = getState();
      const character = state.character;
      root2.querySelector("#toolsMenuBtn")?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        uiState.toolsMenuOpen = !uiState.toolsMenuOpen;
        uiState.exportMenuOpen = false;
        if (uiState.toolsMenuOpen) uiState.toolsMenuOpenedAt = Date.now();
        render();
      });
      root2.querySelector("#exportMenuBtn")?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!character) return;
        uiState.exportMenuOpen = !uiState.exportMenuOpen;
        uiState.toolsMenuOpen = false;
        if (uiState.exportMenuOpen) uiState.exportMenuOpenedAt = Date.now();
        render();
      });
      root2.querySelector("#toolsOpenPalette")?.addEventListener("click", () => {
        uiState.toolsMenuOpen = false;
        uiState.palette.open = true;
        uiState.palette.query = "";
        uiState.palette.selected = 0;
        render();
      });
      root2.querySelector("#toolsExportPdf")?.addEventListener("click", async () => {
        uiState.toolsMenuOpen = false;
        render();
        await actions.exportPdf();
      });
      root2.querySelector("#exportZipOption")?.addEventListener("click", async () => {
        uiState.exportMenuOpen = false;
        render();
        await actions.exportZip();
      });
      root2.querySelector("#exportPdfOption")?.addEventListener("click", async () => {
        uiState.exportMenuOpen = false;
        render();
        await actions.exportPdf();
      });
      root2.querySelector("#toolsOpenAppearance")?.addEventListener("click", () => openAppearanceCustomizer());
      root2.querySelector("#toolsOpenDiagnostics")?.addEventListener("click", () => {
        uiState.toolsMenuOpen = false;
        uiState.diagnosticsOpen = true;
        render();
      });
      root2.querySelector("#saveBtn")?.addEventListener("click", () => actions.saveNow());
      root2.querySelector("#densityToggle")?.addEventListener("click", () => {
        setDensityMode(uiState.densityMode === "compact" ? "comfortable" : "compact");
        render();
      });
      root2.querySelector("#newCharBtn")?.addEventListener("click", () => {
        uiState.showCreate = true;
        render();
      });
      root2.querySelector("#policyModeToggle")?.addEventListener("change", (e) => {
        setPolicyMode(e.target.checked ? "core_only" : "all_official");
        render();
      });
      root2.querySelector("#importBtn")?.addEventListener("click", async () => {
        await actions.importZip();
        if (getState().character) {
          uiState.showCreate = false;
          render();
        }
      });
      root2.querySelector("#modeToggle")?.addEventListener("change", (e) => {
        setMode(e.target.checked ? "play" : "edit");
        render();
      });
      root2.querySelector("#createBtn")?.addEventListener("click", () => {
        draft.name = root2.querySelector("#newName")?.value || draft.name;
        draft.rulesetId = root2.querySelector("#newRuleset")?.value || draft.rulesetId;
        draft.classId = root2.querySelector("#newClass")?.value || "";
        draft.speciesId = root2.querySelector("#newSpecies")?.value || "";
        for (const k of ["str", "dex", "con", "int", "wis", "cha"]) draft[k] = asInt(root2.querySelector(`#new${k.toUpperCase()}`)?.value, 10);
        actions.newCharacter(draft);
        uiState.showCreate = false;
      });
      root2.querySelector("#newSpecies")?.addEventListener("change", (e) => {
        draft.speciesId = e.target.value || "";
        render();
      });
      root2.querySelector("#newClass")?.addEventListener("change", (e) => {
        draft.classId = e.target.value || "";
        render();
      });
      root2.querySelector("#cancelCreateBtn")?.addEventListener("click", () => {
        uiState.showCreate = false;
        render();
      });
      root2.querySelector("#paletteOverlay")?.addEventListener("click", (e) => {
        if (e.target?.id === "paletteOverlay") {
          uiState.palette.open = false;
          render();
        }
      });
      root2.querySelector("#appearanceOverlay")?.addEventListener("click", (e) => {
        if (e.target?.id === "appearanceOverlay") closeAppearanceCustomizer({ revert: true });
      });
      root2.querySelectorAll("[data-overlay-close]").forEach((el) => {
        el.addEventListener("click", (e) => {
          const type = e.currentTarget.getAttribute("data-overlay-close");
          if (type === "palette") {
            uiState.palette.open = false;
            render();
            return;
          }
          if (type === "lookup") {
            closeLookup({ restore: true });
            return;
          }
          if (type === "cast") {
            closeCastMenu();
            return;
          }
          if (type === "condition") {
            closeConditionEditor();
            return;
          }
          if (type === "dice") {
            closeDiceTray();
            return;
          }
          if (type === "appearance") {
            closeAppearanceCustomizer({ revert: true });
            return;
          }
          if (type === "diagnostics") {
            uiState.diagnosticsOpen = false;
            render();
            return;
          }
          if (type === "portrait") {
            closePortraitCrop();
          }
        });
      });
      root2.querySelector("#appearanceCancel")?.addEventListener("click", () => closeAppearanceCustomizer({ revert: true }));
      root2.querySelector("#appearanceReset")?.addEventListener("click", () => {
        const stateNow = getState();
        const auto = deriveAutoAppearance(stateNow.character);
        uiState.appearanceDraft = auto.appearance;
        uiState.appearanceSource = "auto";
        uiState.appearanceAutoLabel = auto.label;
        persistAppearance(stateNow.character, auto.appearance, "auto");
        applyAppearance(uiState.appearanceDraft);
        render();
      });
      root2.querySelector("#appearanceSave")?.addEventListener("click", () => {
        const finalAppearance = sanitizeAppearance(uiState.appearanceDraft);
        localStorage.setItem(APPEARANCE_KEY, JSON.stringify(finalAppearance));
        uiState.appearanceSource = "user";
        const stateNow = getState();
        persistAppearance(stateNow.character, finalAppearance, "user");
        closeAppearanceCustomizer({ revert: false });
      });
      root2.querySelectorAll("[data-appearance-color]").forEach((el) => el.addEventListener("input", (e) => {
        const key = e.target.getAttribute("data-appearance-color");
        uiState.appearanceDraft[key] = e.target.value;
        applyAppearance(uiState.appearanceDraft);
      }));
      root2.querySelectorAll("[data-appearance-range]").forEach((el) => el.addEventListener("input", (e) => {
        const key = e.target.getAttribute("data-appearance-range");
        uiState.appearanceDraft[key] = e.target.value;
        applyAppearance(uiState.appearanceDraft);
      }));
      root2.querySelector("#castOverlay")?.addEventListener("click", (e) => {
        if (e.target?.id === "castOverlay") closeCastMenu();
      });
      root2.querySelector("#conditionOverlay")?.addEventListener("click", (e) => {
        if (e.target?.id === "conditionOverlay") closeConditionEditor();
      });
      root2.querySelector("#diceOverlay")?.addEventListener("click", (e) => {
        if (e.target?.id === "diceOverlay") closeDiceTray();
      });
      root2.querySelector("#checksDrawerOverlay")?.addEventListener("click", (e) => {
        if (e.target?.id === "checksDrawerOverlay") closeChecksDrawer();
      });
      root2.querySelector("#diagnosticsOverlay")?.addEventListener("click", (e) => {
        if (e.target?.id === "diagnosticsOverlay") {
          uiState.diagnosticsOpen = false;
          render();
        }
      });
      root2.querySelector("#portraitOverlay")?.addEventListener("click", (e) => {
        if (e.target?.id === "portraitOverlay") closePortraitCrop();
      });
      root2.querySelector("#castMenuCancel")?.addEventListener("click", () => closeCastMenu());
      root2.querySelector("#condCancel")?.addEventListener("click", () => {
        if (uiState.conditionEditor.index === -2) {
          setConditionControls({ showConcentration: false });
        } else {
          setConditionControls({ showConditions: false });
        }
        closeConditionEditor();
      });
      root2.querySelector("#condSave")?.addEventListener("click", () => {
        const idx = uiState.conditionEditor.index;
        const payload = {
          name: (root2.querySelector("#condName")?.value || "").trim(),
          source: (root2.querySelector("#condSource")?.value || "").trim(),
          duration: (root2.querySelector("#condDuration")?.value || "").trim(),
          rounds_remaining: (() => {
            const raw = (root2.querySelector("#condRounds")?.value || "").trim();
            if (!raw) return null;
            const n = asInt(raw, 0);
            return n > 0 ? n : null;
          })(),
          notes: (root2.querySelector("#condNotes")?.value || "").trim(),
          active: Boolean(root2.querySelector("#condActive")?.checked)
        };
        if (idx !== -2 && !payload.name) return;
        if (idx === -2) {
          actions.updateCharacter((c) => {
            c.combat = c.combat || {};
            c.combat.concentration = c.combat.concentration || { active: false, source: "", notes: "", rounds_remaining: null };
            c.combat.concentration.active = payload.active;
            c.combat.concentration.source = payload.source;
            c.combat.concentration.notes = payload.notes;
            c.combat.concentration.rounds_remaining = payload.rounds_remaining;
          });
          setConditionControls({ showConcentration: payload.active || Boolean(payload.source || payload.rounds_remaining) });
          recordPlayAction(payload.active ? `Concentration set: ${payload.source || "effect"}` : "Concentration cleared");
          closeConditionEditor();
          return;
        }
        actions.updateCharacter((c) => {
          c.combat = c.combat || {};
          c.combat.conditions = Array.isArray(c.combat.conditions) ? c.combat.conditions : [];
          if (idx >= 0 && c.combat.conditions[idx]) c.combat.conditions[idx] = payload;
          else c.combat.conditions.push(payload);
        });
        recordPlayAction(`${idx >= 0 ? "Updated" : "Added"} condition: ${payload.name}`);
        closeConditionEditor();
      });
      root2.querySelector("#condDelete")?.addEventListener("click", () => {
        const idx = uiState.conditionEditor.index;
        if (idx === -2) {
          actions.updateCharacter((c) => {
            c.combat = c.combat || {};
            c.combat.concentration = { active: false, source: "", notes: "", rounds_remaining: null };
          });
          setConditionControls({ showConcentration: false });
          recordPlayAction("Concentration cleared");
          closeConditionEditor();
          return;
        }
        if (idx < 0) return;
        actions.updateCharacter((c) => {
          c.combat = c.combat || {};
          c.combat.conditions = Array.isArray(c.combat.conditions) ? c.combat.conditions : [];
          if (idx >= 0 && idx < c.combat.conditions.length) c.combat.conditions.splice(idx, 1);
        });
        setConditionControls({ showConditions: false });
        recordPlayAction("Removed condition");
        closeConditionEditor();
      });
      root2.querySelector("#diceCancel")?.addEventListener("click", () => closeDiceTray());
      root2.querySelector("#checksDrawerClose")?.addEventListener("click", () => closeChecksDrawer());
      root2.querySelector("#diceQuickD20")?.addEventListener("click", () => {
        uiState.diceTray.die = 20;
        uiState.diceTray.count = 1;
        uiState.diceTray.mod = 0;
        performDiceRoll();
        render();
      });
      root2.querySelector("#diceQuick2d6")?.addEventListener("click", () => {
        uiState.diceTray.die = 6;
        uiState.diceTray.count = 2;
        uiState.diceTray.mod = 0;
        performDiceRoll();
        render();
      });
      root2.querySelector("#diceType")?.addEventListener("change", (e) => {
        uiState.diceTray.die = asInt(e.target.value, uiState.diceTray.die || 20);
        render();
      });
      root2.querySelector("#diceRollBtn")?.addEventListener("click", () => {
        uiState.diceTray.die = asInt(root2.querySelector("#diceType")?.value, uiState.diceTray.die || 20);
        uiState.diceTray.count = clamp(asInt(root2.querySelector("#diceCount")?.value, uiState.diceTray.count || 1), 1, 20);
        uiState.diceTray.mod = clamp(asInt(root2.querySelector("#diceMod")?.value, uiState.diceTray.mod || 0), -99, 99);
        performDiceRoll();
        render();
      });
      root2.querySelector("#portraitCancel")?.addEventListener("click", () => closePortraitCrop());
      root2.querySelector("#portraitSave")?.addEventListener("click", () => savePortraitFromCrop());
      root2.querySelector("#portraitZoom")?.addEventListener("input", (e) => {
        uiState.portraitCrop.zoom = Number(e.target.value);
        drawPortraitPreview();
      });
      root2.querySelector("#portraitX")?.addEventListener("input", (e) => {
        uiState.portraitCrop.x = Number(e.target.value);
        drawPortraitPreview();
      });
      root2.querySelector("#portraitY")?.addEventListener("input", (e) => {
        uiState.portraitCrop.y = Number(e.target.value);
        drawPortraitPreview();
      });
      root2.querySelectorAll("[data-cast-at]").forEach((el) => {
        el.addEventListener("click", (e) => {
          const lvl = asInt(e.currentTarget.getAttribute("data-cast-at"), 0);
          const spellName = uiState.castMenu.spellName || "Spell";
          const spellRef = uiState.castMenu.spellRef || null;
          closeCastMenu();
          performCastAtLevel(lvl, spellName, spellRef);
        });
      });
      root2.querySelector("#paletteQuery")?.addEventListener("input", (e) => {
        uiState.palette.query = e.target.value;
        uiState.palette.selected = 0;
        render();
      });
      root2.querySelectorAll("[data-command-id]").forEach((el) => {
        el.addEventListener("click", (e) => runCommand(e.currentTarget.getAttribute("data-command-id")));
      });
      root2.querySelector("#lookupOverlay")?.addEventListener("click", (e) => {
        if (e.target?.id === "lookupOverlay") closeLookup({ restore: true });
      });
      root2.querySelector("#lookupCancel")?.addEventListener("click", () => closeLookup({ restore: true }));
      root2.querySelector("#lookupSave")?.addEventListener("click", () => {
        const ok = applyLookupSelection(uiState.lookup.selected);
        if (ok) closeLookup({ restore: true });
        else render();
      });
      root2.querySelector("#lookupQuery")?.addEventListener("input", (e) => {
        uiState.lookup.query = e.target.value;
        uiState.lookup.cursor = e.target.selectionStart ?? uiState.lookup.query.length;
        refreshLookup();
        render();
      });
      root2.querySelector("#lookupSpellLevel")?.addEventListener("change", (e) => {
        uiState.lookup.level = e.target.value;
        refreshLookup();
        render();
      });
      root2.querySelector("#lookupDmSpellOverride")?.addEventListener("change", (e) => {
        uiState.lookup.allowOffClassSpells = Boolean(e.target.checked);
        refreshLookup();
        render();
      });
      root2.querySelectorAll("[data-lookup-pick]").forEach((el) => {
        el.addEventListener("click", (e) => {
          const idx = asInt(e.currentTarget.getAttribute("data-lookup-pick"), 0);
          uiState.lookup.selected = Math.max(0, Math.min(uiState.lookup.results.length - 1, idx));
          render();
        });
      });
      root2.querySelectorAll("[data-open-lookup]").forEach((el) => {
        el.addEventListener("click", (e) => openLookup(e.currentTarget.getAttribute("data-open-lookup")));
      });
      root2.querySelectorAll("[data-edit-tab]").forEach((el) => {
        el.addEventListener("click", (e) => {
          setActiveEditTab(e.currentTarget.getAttribute("data-edit-tab"));
          render();
        });
      });
      root2.querySelectorAll("[data-jump-sec]").forEach((el) => {
        el.addEventListener("click", (e) => {
          const sec = e.currentTarget.getAttribute("data-jump-sec");
          const target = sec ? root2.querySelector(`#${sec}`) : null;
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
      root2.querySelectorAll("[data-toggle-sec]").forEach((el) => {
        el.addEventListener("click", (e) => {
          const sec = e.currentTarget.getAttribute("data-toggle-sec");
          const tab = uiState.activeEditTab || "core";
          if (!uiState.collapsedSectionsByTab[tab]) uiState.collapsedSectionsByTab[tab] = {};
          uiState.collapsedSectionsByTab[tab][sec] = !uiState.collapsedSectionsByTab[tab][sec];
          render();
        });
      });
      root2.querySelector("[data-collapse-all]")?.addEventListener("click", () => {
        const tab = uiState.activeEditTab || "core";
        uiState.collapsedSectionsByTab[tab] = Object.fromEntries(tabSections(tab).map((s) => [s, true]));
        render();
      });
      root2.querySelector("[data-expand-all]")?.addEventListener("click", () => {
        const tab = uiState.activeEditTab || "core";
        uiState.collapsedSectionsByTab[tab] = Object.fromEntries(tabSections(tab).map((s) => [s, false]));
        render();
      });
      if (!character) return;
      if (uiState.mode === "play") {
        root2.querySelector("#toggleHudCollapse")?.addEventListener("click", () => {
          setPlayBoard({ hudCollapsed: !uiState.playBoard?.hudCollapsed });
          render();
        });
        root2.querySelector("#rollInitiativeBtn")?.addEventListener("click", () => performInitiativeRoll());
        root2.querySelector("#openDiceTrayHud")?.addEventListener("click", () => openDiceTray());
        root2.querySelectorAll("[data-open-checks-drawer]").forEach((el) => el.addEventListener("click", () => openChecksDrawer()));
        root2.querySelectorAll("[data-toggle-utility]").forEach((el) => el.addEventListener("click", () => {
          setPlayBoard({ utilityRailOpen: !(uiState.playBoard?.utilityRailOpen !== false) });
          render();
        }));
        root2.querySelectorAll("[data-toggle-band]").forEach((el) => el.addEventListener("click", () => {
          setPlayBoard({ bandCompact: !uiState.playBoard?.bandCompact });
          render();
        }));
        root2.querySelectorAll("[data-play-pane]").forEach((el) => {
          el.addEventListener("click", (e) => {
            setActivePlayPane(e.currentTarget.getAttribute("data-play-pane"));
            render();
          });
        });
        root2.querySelectorAll("[data-roll-save]").forEach((el) => {
          el.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-roll-save") || "";
            const mod = asInt(deriveStats(getState().character || {}).savingThrows?.[id]?.total, 0);
            performModifierRoll("save", id, `${id.toUpperCase()} Save`, mod);
          });
        });
        root2.querySelectorAll("[data-roll-skill]").forEach((el) => {
          el.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-roll-skill") || "";
            const mod = asInt(deriveStats(getState().character || {}).skills?.[id]?.total, 0);
            performModifierRoll("skill", id, titleizeId(id), mod);
          });
        });
        root2.querySelectorAll("[data-feature-use]").forEach((el) => {
          el.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-feature-use") || "";
            adjustFeatureUse(id, -1);
          });
        });
        root2.querySelectorAll("[data-feature-refund]").forEach((el) => {
          el.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-feature-refund") || "";
            adjustFeatureUse(id, 1);
          });
        });
        root2.querySelectorAll("[data-feature-tap]").forEach((el) => {
          el.addEventListener("click", (e) => {
            const id = e.currentTarget.getAttribute("data-feature-tap") || "";
            markFeatureUsed(id);
          });
        });
        root2.querySelector("#addConditionBtn")?.addEventListener("click", () => openConditionEditor(-1));
        root2.querySelector("#concentrationPill")?.addEventListener("click", () => openConcentrationEditor());
        root2.querySelector("#conditionsVisibleToggle")?.addEventListener("change", (e) => {
          setConditionControls({ showConditions: Boolean(e.target.checked) });
          render();
        });
        root2.querySelector("#concentrationVisibleToggle")?.addEventListener("change", (e) => {
          const on = Boolean(e.target.checked);
          setConditionControls({ showConcentration: on });
          if (!on) {
            actions.updateCharacter((c) => {
              c.combat = c.combat || {};
              c.combat.concentration = { active: false, source: "", notes: "", rounds_remaining: null };
            });
            recordPlayAction("Concentration cleared");
          } else {
            openConcentrationEditor();
          }
        });
        root2.querySelector("#advanceRoundBtn")?.addEventListener("click", () => advanceRound());
        root2.querySelectorAll("[data-cond-edit]").forEach((el) => {
          el.addEventListener("click", (e) => openConditionEditor(asInt(e.currentTarget.getAttribute("data-cond-edit"), -1)));
        });
        root2.querySelector("#undoLastCast")?.addEventListener("click", () => performUndoLastCast());
        root2.querySelector("#shortRestSlots")?.addEventListener("click", () => performShortRest());
        root2.querySelector("#longRestSlots")?.addEventListener("click", () => performLongRest());
        root2.querySelectorAll("[data-play-hp]").forEach((el) => {
          el.addEventListener("click", (e) => {
            const delta = asInt(e.currentTarget.getAttribute("data-play-hp"), 0);
            actions.updateCharacter((c) => {
              c.combat = c.combat || { hp: { max: 1, current: 1, temp: 0 } };
              c.combat.hp = c.combat.hp || { max: 1, current: 1, temp: 0 };
              c.combat.hp.current = Math.max(0, Math.min(c.combat.hp.max || 0, (c.combat.hp.current || 0) + delta));
            });
            recordPlayAction(delta > 0 ? `HP +${delta}` : `HP ${delta}`);
          });
        });
        root2.querySelector("#playHpSet")?.addEventListener("click", () => {
          const val = Math.max(0, asInt(root2.querySelector("#playHpCurrent")?.value, 0));
          actions.updateCharacter((c) => {
            c.combat = c.combat || { hp: { max: 1, current: 1, temp: 0 } };
            c.combat.hp = c.combat.hp || { max: 1, current: 1, temp: 0 };
            c.combat.hp.current = Math.min(c.combat.hp.max || 0, val);
          });
          recordPlayAction(`HP set to ${val}`);
        });
        root2.querySelectorAll("[data-cast-spell]").forEach((el) => {
          el.addEventListener("click", (e) => {
            const baseLevel = clamp(asInt(e.currentTarget.getAttribute("data-cast-base-level"), 0), 0, 9);
            const spellName = e.currentTarget.getAttribute("data-cast-name") || "Spell";
            const spellKey = e.currentTarget.getAttribute("data-cast-spell") || spellName;
            const characterNow = getState().character || {};
            const knownRows = Array.isArray(characterNow.spells_known) ? characterNow.spells_known : [];
            const preparedRows = Array.isArray(characterNow.spells_prepared) ? characterNow.spells_prepared : [];
            const sourceRows = [...knownRows, ...preparedRows];
            let spellRef = sourceRows.find((s) => norm(s?.id || s?.spell_id || s?.name) === norm(spellKey) || norm(s?.name) === norm(spellName)) || null;
            if (!spellRef) {
              spellRef = {
                id: spellKey,
                name: spellName,
                concentration: toBoolFlag(e.currentTarget.getAttribute("data-cast-concentration")),
                duration: e.currentTarget.getAttribute("data-cast-duration") || ""
              };
            }
            if (baseLevel === 0) {
              performCastAtLevel(0, spellName, spellRef);
              return;
            }
            openCastMenu(spellName, spellKey, baseLevel);
            uiState.castMenu.spellRef = spellRef;
          });
        });
        root2.querySelectorAll("[data-play-tracker]").forEach((el) => {
          el.addEventListener("click", (e) => {
            const [idxStr, op] = (e.currentTarget.getAttribute("data-play-tracker") || "").split(":");
            const idx = asInt(idxStr, -1);
            actions.updateCharacter((c) => {
              c.trackers = Array.isArray(c.trackers) ? c.trackers : [];
              if (!c.trackers[idx]) return;
              if (op === "up") c.trackers[idx].current = Math.min(c.trackers[idx].max || 0, (c.trackers[idx].current || 0) + 1);
              if (op === "down") c.trackers[idx].current = Math.max(0, (c.trackers[idx].current || 0) - 1);
              if (op === "reset") c.trackers[idx].current = c.trackers[idx].max || 0;
            });
            recordPlayAction(`Tracker ${op}`);
          });
        });
        root2.querySelector("#playTrackerAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
          c.trackers = Array.isArray(c.trackers) ? c.trackers : [];
          c.trackers.push({ id: crypto.randomUUID(), label: "", type: "counter", reset: "none", max: 0, current: 0 });
        }));
        root2.querySelector("#playLogAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
          const stats = computeLogNotesChars(c);
          if (stats.remaining <= 0) return;
          c.log = Array.isArray(c.log) ? c.log : [];
          c.log.push({ id: crypto.randomUUID(), utc: (/* @__PURE__ */ new Date()).toISOString(), tag: "note", message: "" });
        }));
        const saveSessionNotes = () => {
          const text = root2.querySelector("#playSessionNotes")?.value || "";
          actions.updateCharacter((c) => {
            c.play_state = c.play_state || {};
            c.play_state.session_notes = clampToBudget(c, text, c.play_state.session_notes || "");
          });
          recordPlayAction("Updated session notes");
        };
        const pinSessionNotesToBottom = () => {
          const notesEl = root2.querySelector("#playSessionNotes");
          if (!notesEl) return;
          notesEl.scrollTop = notesEl.scrollHeight;
        };
        root2.querySelector("#playSessionNotesSave")?.addEventListener("click", () => saveSessionNotes());
        root2.querySelector("#playSessionNotes")?.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            saveSessionNotes();
          }
          setTimeout(pinSessionNotesToBottom, 0);
        });
        root2.querySelector("#playSessionNotes")?.addEventListener("input", (e) => {
          const state2 = getState();
          const c = state2.character || {};
          const existing = c?.play_state?.session_notes || "";
          const clamped = clampToBudget(c, e.target.value, existing);
          if (clamped !== e.target.value) e.target.value = clamped;
          pinSessionNotesToBottom();
        });
        setTimeout(() => {
          pinSessionNotesToBottom();
          const notesEl = root2.querySelector("#playSessionNotes");
          if (notesEl && document.activeElement === notesEl) {
            const end = notesEl.value.length;
            notesEl.setSelectionRange(end, end);
          }
        });
        root2.querySelectorAll("[data-play-tracker-label]").forEach((el) => el.addEventListener("change", (e) => {
          const i = asInt(e.target.getAttribute("data-play-tracker-label"), -1);
          actions.updateCharacter((c) => {
            if (c.trackers?.[i]) c.trackers[i].label = e.target.value;
          });
        }));
        root2.querySelectorAll("[data-play-tracker-current]").forEach((el) => el.addEventListener("input", (e) => {
          const i = asInt(e.target.getAttribute("data-play-tracker-current"), -1);
          actions.updateCharacter((c) => {
            if (c.trackers?.[i]) c.trackers[i].current = Math.max(0, Math.min(c.trackers[i].max || 0, asInt(e.target.value, 0)));
          });
        }));
        root2.querySelectorAll("[data-play-tracker-max]").forEach((el) => el.addEventListener("input", (e) => {
          const i = asInt(e.target.getAttribute("data-play-tracker-max"), -1);
          actions.updateCharacter((c) => {
            if (c.trackers?.[i]) c.trackers[i].max = Math.max(0, asInt(e.target.value, 0));
          });
        }));
        root2.querySelectorAll("[data-play-tracker-del]").forEach((el) => el.addEventListener("click", (e) => {
          const i = asInt(e.currentTarget.getAttribute("data-play-tracker-del"), -1);
          actions.updateCharacter((c) => {
            if (Array.isArray(c.trackers)) c.trackers.splice(i, 1);
          });
        }));
        root2.querySelectorAll("[data-play-log-tag]").forEach((el) => el.addEventListener("change", (e) => {
          const i = asInt(e.target.getAttribute("data-play-log-tag"), -1);
          actions.updateCharacter((c) => {
            if (c.log?.[i]) c.log[i].tag = clampToBudget(c, e.target.value, c.log[i].tag || "");
          });
        }));
        root2.querySelectorAll("[data-play-log-message]").forEach((el) => el.addEventListener("change", (e) => {
          const i = asInt(e.target.getAttribute("data-play-log-message"), -1);
          actions.updateCharacter((c) => {
            if (c.log?.[i]) c.log[i].message = clampToBudget(c, e.target.value, c.log[i].message || "");
          });
        }));
        root2.querySelectorAll("[data-play-log-del]").forEach((el) => el.addEventListener("click", (e) => {
          const i = asInt(e.currentTarget.getAttribute("data-play-log-del"), -1);
          actions.updateCharacter((c) => {
            if (Array.isArray(c.log)) c.log.splice(i, 1);
          });
        }));
        return;
      }
      root2.querySelector("#charName")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.meta.name = e.target.value;
      }));
      root2.querySelector("#charRuleset")?.addEventListener("change", (e) => {
        actions.updateCharacter((c) => {
          c.meta.ruleset_id = e.target.value.trim() || "dnd5e_2014";
          c.core = c.core || { classes: [] };
          c.core.rulesetId = c.meta.ruleset_id;
        });
        actions.ensureCatalog(e.target.value.trim() || "dnd5e_2014");
      });
      root2.querySelector("#charSpecies")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.core.speciesId = e.target.value;
      }));
      root2.querySelectorAll("[data-ability]").forEach((el) => {
        el.addEventListener("change", (e) => {
          const key = e.target.getAttribute("data-ability");
          actions.updateCharacter((c) => {
            c.abilities[key] = Math.max(1, Math.min(30, asInt(e.target.value, 10)));
          });
        });
      });
      root2.querySelector("#classAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
        c.core.classes = Array.isArray(c.core.classes) ? c.core.classes : [];
        c.core.classes.push({ id: "", level: 1, isPrimary: c.core.classes.length === 0, subclassId: "" });
      }));
      root2.querySelectorAll("[data-class-id]").forEach((el) => el.addEventListener("change", (e) => {
        const idx = asInt(e.target.getAttribute("data-class-id"), -1);
        actions.updateCharacter((c) => {
          if (c.core.classes[idx]) c.core.classes[idx].id = e.target.value;
        });
      }));
      root2.querySelectorAll("[data-class-level]").forEach((el) => el.addEventListener("change", (e) => {
        const idx = asInt(e.target.getAttribute("data-class-level"), -1);
        actions.updateCharacter((c) => {
          if (c.core.classes[idx]) c.core.classes[idx].level = Math.max(1, Math.min(20, asInt(e.target.value, 1)));
        });
      }));
      root2.querySelectorAll("[data-class-subclass]").forEach((el) => el.addEventListener("change", (e) => {
        const idx = asInt(e.target.getAttribute("data-class-subclass"), -1);
        actions.updateCharacter((c) => {
          if (c.core.classes[idx]) c.core.classes[idx].subclassId = e.target.value.trim().toLowerCase();
        });
      }));
      root2.querySelectorAll("[data-class-del]").forEach((el) => el.addEventListener("click", (e) => {
        const idx = asInt(e.currentTarget.getAttribute("data-class-del"), -1);
        actions.updateCharacter((c) => {
          c.core.classes.splice(idx, 1);
          if (c.core.classes[0]) c.core.classes[0].isPrimary = true;
        });
      }));
      root2.querySelector("#combatAc")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.combat.ac = Math.max(0, asInt(e.target.value, 10));
      }));
      root2.querySelector("#combatInit")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.combat.initiative_bonus = asInt(e.target.value, 0);
      }));
      root2.querySelector("#hpMax")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.combat.hp.max = Math.max(0, asInt(e.target.value, 1));
        if (c.combat.hp.current > c.combat.hp.max) c.combat.hp.current = c.combat.hp.max;
      }));
      root2.querySelector("#hpCurrent")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.combat.hp.current = Math.max(0, asInt(e.target.value, 1));
        if (c.combat.hp.current > c.combat.hp.max) c.combat.hp.current = c.combat.hp.max;
      }));
      root2.querySelector("#hpTemp")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.combat.hp.temp = Math.max(0, asInt(e.target.value, 0));
      }));
      root2.querySelector("#combatSpeed")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.combat.speed = Math.max(0, asInt(e.target.value, 30));
      }));
      root2.querySelector("#combatInspiration")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.combat.inspiration = Math.max(0, Math.min(1, asInt(e.target.value, 0)));
      }));
      root2.querySelector("#combatProfBonus")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.combat.proficiency_bonus = asInt(e.target.value, 2);
      }));
      root2.querySelector("#combatPassivePerception")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.combat.passive_perception = Math.max(0, asInt(e.target.value, 10));
      }));
      root2.querySelector("#combatHitDiceTotal")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.combat.hit_dice_total = Math.max(0, asInt(e.target.value, 0));
      }));
      root2.querySelector("#combatHitDiceUsed")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.combat.hit_dice_used = Math.max(0, asInt(e.target.value, 0));
      }));
      root2.querySelector("#combatDeathSaveSuccess")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.combat.death_saves = c.combat.death_saves || { success: 0, fail: 0 };
        c.combat.death_saves.success = Math.max(0, Math.min(3, asInt(e.target.value, 0)));
      }));
      root2.querySelector("#combatDeathSaveFail")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.combat.death_saves = c.combat.death_saves || { success: 0, fail: 0 };
        c.combat.death_saves.fail = Math.max(0, Math.min(3, asInt(e.target.value, 0)));
      }));
      root2.querySelector("#spellcastingClassId")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.spellcasting = c.spellcasting || {};
        c.spellcasting.class_id = e.target.value;
      }));
      root2.querySelector("#spellcastingAbility")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.spellcasting = c.spellcasting || {};
        c.spellcasting.ability = e.target.value;
      }));
      root2.querySelector("#spellcastingSaveDcMode")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.spellcasting = c.spellcasting || {};
        c.spellcasting.save_dc_mode = e.target.value === "manual" ? "manual" : "auto";
      }));
      root2.querySelector("#spellcastingSaveDcOverride")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.spellcasting = c.spellcasting || {};
        c.spellcasting.save_dc_override = asInt(e.target.value, 0);
      }));
      root2.querySelector("#spellcastingAtkMode")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.spellcasting = c.spellcasting || {};
        c.spellcasting.attack_bonus_mode = e.target.value === "manual" ? "manual" : "auto";
      }));
      root2.querySelector("#spellcastingAtkOverride")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.spellcasting = c.spellcasting || {};
        c.spellcasting.attack_bonus_override = asInt(e.target.value, 0);
      }));
      root2.querySelector("#profileBackground")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.background = e.target.value;
      }));
      root2.querySelector("#profileAlignment")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.alignment = e.target.value;
      }));
      root2.querySelector("#profilePlayerName")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.player_name = e.target.value;
      }));
      root2.querySelector("#profileXp")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.experience_points = Math.max(0, asInt(e.target.value, 0));
      }));
      root2.querySelector("#profileAge")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.age = e.target.value;
      }));
      root2.querySelector("#profileHeight")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.height = e.target.value;
      }));
      root2.querySelector("#profileWeight")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.weight = e.target.value;
      }));
      root2.querySelector("#profileEyes")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.eyes = e.target.value;
      }));
      root2.querySelector("#profileSkin")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.skin = e.target.value;
      }));
      root2.querySelector("#profileHair")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.hair = e.target.value;
      }));
      root2.querySelector("#profileTraits")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.personality_traits = e.target.value;
      }));
      root2.querySelector("#profileIdeals")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.ideals = e.target.value;
      }));
      root2.querySelector("#profileBonds")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.bonds = e.target.value;
      }));
      root2.querySelector("#profileFlaws")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.flaws = e.target.value;
      }));
      root2.querySelector("#profileProficiencies")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.other_proficiencies_languages = e.target.value;
      }));
      root2.querySelector("#profileFeatures")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.features_traits = e.target.value;
      }));
      root2.querySelector("#profileBackstory")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.backstory = e.target.value;
      }));
      root2.querySelector("#profileAllies")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.allies_organizations = e.target.value;
      }));
      root2.querySelector("#profileAdditionalFeatures")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.additional_features = e.target.value;
      }));
      root2.querySelector("#profileTreasure")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.profile = c.profile || {};
        c.profile.treasure = e.target.value;
      }));
      root2.querySelector("#portraitUpload")?.addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const src = reader.result?.toString() || "";
          const img = new Image();
          img.onload = () => openPortraitCrop(src, img.width, img.height);
          img.src = src;
        };
        reader.readAsDataURL(file);
      });
      root2.querySelector("#portraitRemove")?.addEventListener("click", () => actions.updateCharacter((c) => {
        c.ui = c.ui || {};
        delete c.ui.portrait;
      }));
      root2.querySelector("#resCp")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.resources = c.resources || {};
        c.resources.cp = Math.max(0, asInt(e.target.value, 0));
      }));
      root2.querySelector("#resSp")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.resources = c.resources || {};
        c.resources.sp = Math.max(0, asInt(e.target.value, 0));
      }));
      root2.querySelector("#resEp")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.resources = c.resources || {};
        c.resources.ep = Math.max(0, asInt(e.target.value, 0));
      }));
      root2.querySelector("#resGp")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.resources = c.resources || {};
        c.resources.gp = Math.max(0, asInt(e.target.value, 0));
      }));
      root2.querySelector("#resPp")?.addEventListener("change", (e) => actions.updateCharacter((c) => {
        c.resources = c.resources || {};
        c.resources.pp = Math.max(0, asInt(e.target.value, 0));
      }));
      root2.querySelectorAll("[data-save-prof]").forEach((el) => el.addEventListener("change", (e) => {
        const key = e.target.getAttribute("data-save-prof");
        actions.updateCharacter((c) => {
          c.saving_throws = c.saving_throws || {};
          c.saving_throws[key] = c.saving_throws[key] || { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
          c.saving_throws[key].proficient = Boolean(e.target.checked);
        });
      }));
      root2.querySelectorAll("[data-save-bonus]").forEach((el) => el.addEventListener("change", (e) => {
        const key = e.target.getAttribute("data-save-bonus");
        actions.updateCharacter((c) => {
          c.saving_throws = c.saving_throws || {};
          c.saving_throws[key] = c.saving_throws[key] || { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
          c.saving_throws[key].bonus = asInt(e.target.value, 0);
        });
      }));
      root2.querySelectorAll("[data-save-mode]").forEach((el) => el.addEventListener("change", (e) => {
        const key = e.target.getAttribute("data-save-mode");
        actions.updateCharacter((c) => {
          c.saving_throws = c.saving_throws || {};
          c.saving_throws[key] = c.saving_throws[key] || { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
          c.saving_throws[key].bonus_mode = e.target.checked ? "manual" : "auto";
        });
      }));
      root2.querySelectorAll("[data-save-manual]").forEach((el) => el.addEventListener("change", (e) => {
        const key = e.target.getAttribute("data-save-manual");
        actions.updateCharacter((c) => {
          c.saving_throws = c.saving_throws || {};
          c.saving_throws[key] = c.saving_throws[key] || { proficient: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
          c.saving_throws[key].manual_total = asInt(e.target.value, 0);
        });
      }));
      root2.querySelectorAll("[data-skill-prof]").forEach((el) => el.addEventListener("change", (e) => {
        const key = e.target.getAttribute("data-skill-prof");
        actions.updateCharacter((c) => {
          c.skills = c.skills || {};
          c.skills[key] = c.skills[key] || { proficient: false, expertise: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
          c.skills[key].proficient = Boolean(e.target.checked);
        });
      }));
      root2.querySelectorAll("[data-skill-exp]").forEach((el) => el.addEventListener("change", (e) => {
        const key = e.target.getAttribute("data-skill-exp");
        actions.updateCharacter((c) => {
          c.skills = c.skills || {};
          c.skills[key] = c.skills[key] || { proficient: false, expertise: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
          c.skills[key].expertise = Boolean(e.target.checked);
        });
      }));
      root2.querySelectorAll("[data-skill-bonus]").forEach((el) => el.addEventListener("change", (e) => {
        const key = e.target.getAttribute("data-skill-bonus");
        actions.updateCharacter((c) => {
          c.skills = c.skills || {};
          c.skills[key] = c.skills[key] || { proficient: false, expertise: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
          c.skills[key].bonus = asInt(e.target.value, 0);
        });
      }));
      root2.querySelectorAll("[data-skill-mode]").forEach((el) => el.addEventListener("change", (e) => {
        const key = e.target.getAttribute("data-skill-mode");
        actions.updateCharacter((c) => {
          c.skills = c.skills || {};
          c.skills[key] = c.skills[key] || { proficient: false, expertise: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
          c.skills[key].bonus_mode = e.target.checked ? "manual" : "auto";
        });
      }));
      root2.querySelectorAll("[data-skill-manual]").forEach((el) => el.addEventListener("change", (e) => {
        const key = e.target.getAttribute("data-skill-manual");
        actions.updateCharacter((c) => {
          c.skills = c.skills || {};
          c.skills[key] = c.skills[key] || { proficient: false, expertise: false, bonus: 0, bonus_mode: "auto", manual_total: 0 };
          c.skills[key].manual_total = asInt(e.target.value, 0);
        });
      }));
      root2.querySelector("#attackAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
        c.attacks = Array.isArray(c.attacks) ? c.attacks : [];
        c.attacks.push({ id: crypto.randomUUID(), name: "", atk_bonus: 0, damage: "", damage_type: "", range: "", notes: "" });
      }));
      root2.querySelectorAll("[data-attack-name]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-attack-name"), -1);
        actions.updateCharacter((c) => {
          if (c.attacks?.[i]) c.attacks[i].name = e.target.value;
        });
      }));
      root2.querySelectorAll("[data-attack-bonus]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-attack-bonus"), -1);
        actions.updateCharacter((c) => {
          if (c.attacks?.[i]) c.attacks[i].atk_bonus = asInt(e.target.value, 0);
        });
      }));
      root2.querySelectorAll("[data-attack-damage]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-attack-damage"), -1);
        actions.updateCharacter((c) => {
          if (c.attacks?.[i]) c.attacks[i].damage = e.target.value;
        });
      }));
      root2.querySelectorAll("[data-attack-damagetype]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-attack-damagetype"), -1);
        actions.updateCharacter((c) => {
          if (c.attacks?.[i]) c.attacks[i].damage_type = e.target.value;
        });
      }));
      root2.querySelectorAll("[data-attack-range]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-attack-range"), -1);
        actions.updateCharacter((c) => {
          if (c.attacks?.[i]) c.attacks[i].range = e.target.value;
        });
      }));
      root2.querySelectorAll("[data-attack-notes]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-attack-notes"), -1);
        actions.updateCharacter((c) => {
          if (c.attacks?.[i]) c.attacks[i].notes = e.target.value;
        });
      }));
      root2.querySelectorAll("[data-attack-del]").forEach((el) => el.addEventListener("click", (e) => {
        const i = asInt(e.currentTarget.getAttribute("data-attack-del"), -1);
        actions.updateCharacter((c) => {
          if (Array.isArray(c.attacks)) c.attacks.splice(i, 1);
        });
      }));
      root2.querySelector("#spellAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
        c.spells_known = Array.isArray(c.spells_known) ? c.spells_known : [];
        c.spells_known.push({ id: crypto.randomUUID(), name: "", level: 0, school: "", source: "", ritual: false, concentration: false, casting_time: "", range: "", components: "", duration: "", spell_id: "", page: "", notes: "" });
      }));
      root2.querySelectorAll("[data-spell-name]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-spell-name"), -1);
        actions.updateCharacter((c) => {
          if (c.spells_known[i]) c.spells_known[i].name = e.target.value;
        });
      }));
      root2.querySelectorAll("[data-spell-level]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-spell-level"), -1);
        actions.updateCharacter((c) => {
          if (c.spells_known[i]) c.spells_known[i].level = Math.max(0, Math.min(9, asInt(e.target.value, 0)));
        });
      }));
      root2.querySelectorAll("[data-spell-school]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-spell-school"), -1);
        actions.updateCharacter((c) => {
          if (c.spells_known[i]) c.spells_known[i].school = e.target.value;
        });
      }));
      root2.querySelectorAll("[data-spell-prep]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-spell-prep"), -1);
        actions.updateCharacter((c) => {
          c.spells_prepared = Array.isArray(c.spells_prepared) ? c.spells_prepared : [];
          const spell = c.spells_known[i];
          if (!spell) return;
          const at = c.spells_prepared.findIndex((x) => x.id === spell.id);
          if (e.target.checked && at < 0) c.spells_prepared.push(structuredClone(spell));
          if (!e.target.checked && at >= 0) c.spells_prepared.splice(at, 1);
        });
      }));
      root2.querySelectorAll("[data-spell-del]").forEach((el) => el.addEventListener("click", (e) => {
        const i = asInt(e.currentTarget.getAttribute("data-spell-del"), -1);
        actions.updateCharacter((c) => {
          const removed = c.spells_known[i]?.id;
          c.spells_known.splice(i, 1);
          c.spells_prepared = (c.spells_prepared || []).filter((x) => x.id !== removed);
        });
      }));
      root2.querySelector("#invAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
        c.inventory = Array.isArray(c.inventory) ? c.inventory : [];
        c.inventory.push({ id: crypto.randomUUID(), name: "", qty: 1, notes: "" });
      }));
      root2.querySelectorAll("[data-inv-name]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-inv-name"), -1);
        actions.updateCharacter((c) => {
          if (c.inventory[i]) c.inventory[i].name = e.target.value;
        });
      }));
      root2.querySelectorAll("[data-inv-qty]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-inv-qty"), -1);
        actions.updateCharacter((c) => {
          if (c.inventory[i]) c.inventory[i].qty = Math.max(0, asInt(e.target.value, 1));
        });
      }));
      root2.querySelectorAll("[data-inv-notes]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-inv-notes"), -1);
        actions.updateCharacter((c) => {
          if (c.inventory[i]) c.inventory[i].notes = e.target.value;
        });
      }));
      root2.querySelectorAll("[data-inv-del]").forEach((el) => el.addEventListener("click", (e) => {
        const i = asInt(e.currentTarget.getAttribute("data-inv-del"), -1);
        actions.updateCharacter((c) => {
          c.inventory.splice(i, 1);
        });
      }));
      root2.querySelector("#trackerAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
        c.trackers = Array.isArray(c.trackers) ? c.trackers : [];
        c.trackers.push({ id: crypto.randomUUID(), label: "", type: "counter", reset: "none", max: 0, current: 0 });
      }));
      root2.querySelectorAll("[data-tracker-label]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-tracker-label"), -1);
        actions.updateCharacter((c) => {
          if (c.trackers[i]) c.trackers[i].label = e.target.value;
        });
      }));
      root2.querySelectorAll("[data-tracker-reset]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-tracker-reset"), -1);
        actions.updateCharacter((c) => {
          if (c.trackers[i]) c.trackers[i].reset = e.target.value;
        });
      }));
      root2.querySelectorAll("[data-tracker-max]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-tracker-max"), -1);
        actions.updateCharacter((c) => {
          if (c.trackers[i]) {
            c.trackers[i].max = Math.max(0, asInt(e.target.value, 0));
            if (c.trackers[i].current > c.trackers[i].max) c.trackers[i].current = c.trackers[i].max;
          }
        });
      }));
      root2.querySelectorAll("[data-tracker-current]").forEach((el) => el.addEventListener("change", (e) => {
        const i = asInt(e.target.getAttribute("data-tracker-current"), -1);
        actions.updateCharacter((c) => {
          if (c.trackers[i]) c.trackers[i].current = Math.max(0, Math.min(c.trackers[i].max || 0, asInt(e.target.value, 0)));
        });
      }));
      root2.querySelectorAll("[data-tracker-del]").forEach((el) => el.addEventListener("click", (e) => {
        const i = asInt(e.currentTarget.getAttribute("data-tracker-del"), -1);
        actions.updateCharacter((c) => {
          c.trackers.splice(i, 1);
        });
      }));
      root2.querySelector("#logAdd")?.addEventListener("click", () => actions.updateCharacter((c) => {
        const stats = computeLogNotesChars(c);
        if (stats.remaining <= 0) return;
        c.log = Array.isArray(c.log) ? c.log : [];
        c.log.push({ id: crypto.randomUUID(), utc: (/* @__PURE__ */ new Date()).toISOString(), tag: "note", message: "" });
      }));
    }
    function handleGlobalHotkeys(e) {
      const cmd = e.metaKey || e.ctrlKey;
      const hasAnyMod = e.metaKey || e.ctrlKey || e.altKey || e.shiftKey;
      const targetTyping = isTypingTarget(e.target);
      if (cmd && e.key.toLowerCase() === "k") {
        e.preventDefault();
        uiState.palette.open = true;
        uiState.palette.query = "";
        uiState.palette.selected = 0;
        render();
        return;
      }
      if (cmd && !e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        actions.saveNow();
        return;
      }
      if (uiState.appearanceOpen && e.key === "Escape") {
        e.preventDefault();
        closeAppearanceCustomizer({ revert: true });
        return;
      }
      if (uiState.toolsMenuOpen && e.key === "Escape") {
        e.preventDefault();
        uiState.toolsMenuOpen = false;
        render();
        return;
      }
      if (uiState.exportMenuOpen && e.key === "Escape") {
        e.preventDefault();
        uiState.exportMenuOpen = false;
        render();
        return;
      }
      if (uiState.diagnosticsOpen && e.key === "Escape") {
        e.preventDefault();
        uiState.diagnosticsOpen = false;
        render();
        return;
      }
      if (uiState.checksDrawerOpen && e.key === "Escape") {
        e.preventDefault();
        closeChecksDrawer();
        return;
      }
      if (uiState.palette.open) {
        const list = visibleCommands();
        if (e.key === "Escape") {
          uiState.palette.open = false;
          render();
          return;
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          uiState.palette.selected = Math.min(list.length - 1, uiState.palette.selected + 1);
          render();
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          uiState.palette.selected = Math.max(0, uiState.palette.selected - 1);
          render();
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          const cmdRow = list[uiState.palette.selected];
          if (cmdRow) runCommand(cmdRow.id);
          return;
        }
      }
      if (uiState.lookup.open) {
        if (e.key === "Escape") {
          closeLookup({ restore: true });
          return;
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          uiState.lookup.selected = Math.min(uiState.lookup.results.length - 1, uiState.lookup.selected + 1);
          render();
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          uiState.lookup.selected = Math.max(0, uiState.lookup.selected - 1);
          render();
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          const ok = applyLookupSelection(uiState.lookup.selected);
          if (ok) closeLookup({ restore: true });
          else render();
          return;
        }
      }
      if (uiState.diceTray.open) {
        if (e.key === "Escape") {
          e.preventDefault();
          closeDiceTray();
          return;
        }
        if (e.key === "Enter" && !targetTyping) {
          e.preventDefault();
          performDiceRoll();
          render();
          return;
        }
      }
      if (targetTyping) return;
      if (uiState.mode === "play" && e.altKey && /[1-5]/.test(e.key)) {
        e.preventDefault();
        const idx = asInt(e.key, 1) - 1;
        const pane = PLAY_PANES[idx]?.id;
        if (pane) {
          setActivePlayPane(pane);
          render();
        }
        return;
      }
      if (uiState.mode === "play" && !hasAnyMod) {
        if (e.key.toLowerCase() === "c") {
          e.preventDefault();
          setActivePlayPane("spells");
          render();
          return;
        }
        if (e.key.toLowerCase() === "a") {
          e.preventDefault();
          setActivePlayPane("attacks");
          render();
          return;
        }
        if (e.key.toLowerCase() === "b") {
          e.preventDefault();
          setActivePlayPane("bonus");
          render();
          return;
        }
        if (e.key.toLowerCase() === "k") {
          e.preventDefault();
          openChecksDrawer();
          return;
        }
        if (e.key.toLowerCase() === "r") {
          e.preventDefault();
          setActivePlayPane("trackers");
          render();
          return;
        }
        if (e.key.toLowerCase() === "d") {
          e.preventDefault();
          openDiceTray();
          return;
        }
      }
      if (uiState.mode === "edit" && e.altKey && /[1-5]/.test(e.key)) {
        e.preventDefault();
        const idx = asInt(e.key, 1) - 1;
        const tab = EDIT_TABS[idx]?.id;
        if (tab) {
          setActiveEditTab(tab);
          render();
        }
        return;
      }
      if (cmd && /[1-6]/.test(e.key)) {
        e.preventDefault();
        jumpToSection(asInt(e.key, 1) - 1);
        return;
      }
      if (!hasAnyMod && e.key === "[") {
        e.preventDefault();
        cycleSections(-1);
        return;
      }
      if (!hasAnyMod && e.key === "]") {
        e.preventDefault();
        cycleSections(1);
      }
    }
    window.addEventListener("keydown", handleGlobalHotkeys);
    if (!root2.__lcxToolsDelegationBound) {
      root2.addEventListener("click", (e) => {
        const target = e.target && e.target.nodeType === 1 ? e.target : e.target?.parentElement;
        if (!target) return;
        const importBtn = typeof target.closest === "function" ? target.closest("#importBtn") : null;
        if (importBtn) {
          e.preventDefault();
          e.stopPropagation();
          Promise.resolve(actions.importZip()).then(() => {
            if (getState().character) {
              uiState.showCreate = false;
              render();
            }
          });
          return;
        }
        const newCharBtn = typeof target.closest === "function" ? target.closest("#newCharBtn") : null;
        if (newCharBtn) {
          e.preventDefault();
          e.stopPropagation();
          uiState.showCreate = true;
          render();
          return;
        }
        const cancelCreateBtn = typeof target.closest === "function" ? target.closest("#cancelCreateBtn") : null;
        if (cancelCreateBtn) {
          e.preventDefault();
          e.stopPropagation();
          uiState.showCreate = false;
          render();
          return;
        }
        const createBtn = typeof target.closest === "function" ? target.closest("#createBtn") : null;
        if (createBtn) {
          e.preventDefault();
          e.stopPropagation();
          draft.name = root2.querySelector("#newName")?.value || draft.name;
          draft.rulesetId = root2.querySelector("#newRuleset")?.value || draft.rulesetId;
          draft.classId = root2.querySelector("#newClass")?.value || "";
          draft.speciesId = root2.querySelector("#newSpecies")?.value || "";
          for (const k of ["str", "dex", "con", "int", "wis", "cha"]) draft[k] = asInt(root2.querySelector(`#new${k.toUpperCase()}`)?.value, 10);
          actions.newCharacter(draft);
          uiState.showCreate = false;
          return;
        }
        const btn = typeof target.closest === "function" ? target.closest("#toolsMenuBtn") : null;
        if (btn) {
          e.preventDefault();
          e.stopPropagation();
          uiState.toolsMenuOpen = !uiState.toolsMenuOpen;
          if (uiState.toolsMenuOpen) uiState.toolsMenuOpenedAt = Date.now();
          render();
          return;
        }
        const openPaletteBtn = typeof target.closest === "function" ? target.closest("#toolsOpenPalette") : null;
        if (openPaletteBtn) {
          e.preventDefault();
          e.stopPropagation();
          uiState.toolsMenuOpen = false;
          uiState.palette.open = true;
          uiState.palette.query = "";
          uiState.palette.selected = 0;
          render();
          return;
        }
        const openAppearanceBtn = typeof target.closest === "function" ? target.closest("#toolsOpenAppearance") : null;
        if (openAppearanceBtn) {
          e.preventDefault();
          e.stopPropagation();
          openAppearanceCustomizer();
          return;
        }
        const openDiagnosticsBtn = typeof target.closest === "function" ? target.closest("#toolsOpenDiagnostics") : null;
        if (openDiagnosticsBtn) {
          e.preventDefault();
          e.stopPropagation();
          uiState.toolsMenuOpen = false;
          uiState.diagnosticsOpen = true;
          render();
        }
      });
      root2.__lcxToolsDelegationBound = true;
    }
    if (!root2.__lcxChangeDelegationBound) {
      root2.addEventListener("change", (e) => {
        const target = e.target && e.target.nodeType === 1 ? e.target : e.target?.parentElement;
        if (!target) return;
        if (target.id === "modeToggle") {
          setMode(target.checked ? "play" : "edit");
          render();
          return;
        }
        if (target.id === "policyModeToggle") {
          setPolicyMode(target.checked ? "core_only" : "all_official");
          render();
        }
      });
      root2.__lcxChangeDelegationBound = true;
    }
    document.addEventListener("click", (e) => {
      if (!uiState.toolsMenuOpen && !uiState.exportMenuOpen) return;
      const openedAt = Math.max(asInt(uiState.toolsMenuOpenedAt, 0), asInt(uiState.exportMenuOpenedAt, 0));
      if (Date.now() - openedAt < 220) return;
      const path = typeof e.composedPath === "function" ? e.composedPath() : [];
      const targetEl = e.target && e.target.nodeType === 1 ? e.target : e.target?.parentElement;
      const insideToolsByClosest = typeof targetEl?.closest === "function" && targetEl.closest(".tools-menu-wrap");
      const insideToolsByPath = Array.isArray(path) && path.some((node) => node?.classList?.contains?.("tools-menu-wrap"));
      const insideTools = Boolean(insideToolsByClosest || insideToolsByPath);
      if (!insideTools) {
        uiState.toolsMenuOpen = false;
        uiState.exportMenuOpen = false;
        render();
      }
    });
    return {
      render,
      openPalette: () => {
        uiState.palette.open = true;
        uiState.palette.query = "";
        uiState.palette.selected = 0;
        render();
      },
      getActionRegistry: () => commandRegistry().map((cmd) => ({
        id: cmd.id,
        label: cmd.label,
        enabled: cmd.enabled(),
        keywords: cmd.keywords || []
      }))
    };
  }

  // data/dnd5e_2014/classes.min.json
  var classes_min_default = [{ id: "barbarian", name: "Barbarian", source: "PHB", saving_throws: ["str", "con"] }, { id: "bard", name: "Bard", source: "PHB", saving_throws: ["dex", "cha"], spellcasting: true, spellcasting_ability: "cha" }, { id: "cleric", name: "Cleric", source: "PHB", spellcasting: true, saving_throws: ["wis", "cha"], spellcasting_ability: "wis" }, { id: "druid", name: "Druid", source: "PHB", spellcasting: true, saving_throws: ["int", "wis"], spellcasting_ability: "wis" }, { id: "fighter", name: "Fighter", source: "PHB", saving_throws: ["str", "con"] }, { id: "monk", name: "Monk", source: "PHB", saving_throws: ["str", "dex"] }, { id: "paladin", name: "Paladin", source: "PHB", spellcasting: true, saving_throws: ["wis", "cha"], spellcasting_ability: "cha" }, { id: "ranger", name: "Ranger", source: "PHB", spellcasting: true, saving_throws: ["str", "dex"], spellcasting_ability: "wis" }, { id: "rogue", name: "Rogue", source: "PHB", saving_throws: ["dex", "int"] }, { id: "sorcerer", name: "Sorcerer", source: "PHB", spellcasting: true, saving_throws: ["con", "cha"], spellcasting_ability: "cha" }, { id: "warlock", name: "Warlock", source: "PHB", spellcasting: true, saving_throws: ["wis", "cha"], spellcasting_ability: "cha" }, { id: "wizard", name: "Wizard", source: "PHB", spellcasting: true, saving_throws: ["int", "wis"], spellcasting_ability: "int" }, { id: "artificer", name: "Artificer", source: "TCE", spellcasting: true, saving_throws: ["con", "int"], spellcasting_ability: "int" }];

  // data/dnd5e_2014/subclasses.min.json
  var subclasses_min_default = [
    {
      id: "alchemist",
      class_id: "artificer",
      name: "Alchemist",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "armorer",
      class_id: "artificer",
      name: "Armorer",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "artillerist",
      class_id: "artificer",
      name: "Artillerist",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "battle_smith",
      class_id: "artificer",
      name: "Battle Smith",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "ancestral_guardian",
      class_id: "barbarian",
      name: "Path of the Ancestral Guardian",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "battlerager",
      class_id: "barbarian",
      name: "Path of the Battlerager",
      source: "SCAG",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "beast",
      class_id: "barbarian",
      name: "Path of the Beast",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "berserker",
      class_id: "barbarian",
      name: "Path of the Berserker",
      source: "PHB",
      min_level: 3,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "giant",
      class_id: "barbarian",
      name: "Path of the Giant",
      source: "BPGG",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "storm_herald",
      class_id: "barbarian",
      name: "Path of the Storm Herald",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "totem_warrior",
      class_id: "barbarian",
      name: "Path of the Totem Warrior",
      source: "PHB",
      min_level: 3,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "zealot",
      class_id: "barbarian",
      name: "Path of the Zealot",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "wild_magic",
      class_id: "barbarian",
      name: "Path of Wild Magic",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "creation",
      class_id: "bard",
      name: "College of Creation",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "eloquence",
      class_id: "bard",
      name: "College of Eloquence",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "glamour",
      class_id: "bard",
      name: "College of Glamour",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "lore",
      class_id: "bard",
      name: "College of Lore",
      source: "PHB",
      min_level: 3,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "spirits",
      class_id: "bard",
      name: "College of Spirits",
      source: "VRGR",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "swords",
      class_id: "bard",
      name: "College of Swords",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "valor",
      class_id: "bard",
      name: "College of Valor",
      source: "PHB",
      min_level: 3,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "whispers",
      class_id: "bard",
      name: "College of Whispers",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "arcana",
      class_id: "cleric",
      name: "Arcana Domain",
      source: "SCAG",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "death",
      class_id: "cleric",
      name: "Death Domain",
      source: "DMG",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "forge",
      class_id: "cleric",
      name: "Forge Domain",
      source: "XGE",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "grave",
      class_id: "cleric",
      name: "Grave Domain",
      source: "XGE",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "knowledge",
      class_id: "cleric",
      name: "Knowledge Domain",
      source: "PHB",
      min_level: 1,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "life",
      class_id: "cleric",
      name: "Life Domain",
      source: "PHB",
      min_level: 1,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "light",
      class_id: "cleric",
      name: "Light Domain",
      source: "PHB",
      min_level: 1,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "nature",
      class_id: "cleric",
      name: "Nature Domain",
      source: "PHB",
      min_level: 1,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "order",
      class_id: "cleric",
      name: "Order Domain",
      source: "TCE",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "peace",
      class_id: "cleric",
      name: "Peace Domain",
      source: "TCE",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "tempest",
      class_id: "cleric",
      name: "Tempest Domain",
      source: "PHB",
      min_level: 1,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "trickery",
      class_id: "cleric",
      name: "Trickery Domain",
      source: "PHB",
      min_level: 1,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "twilight",
      class_id: "cleric",
      name: "Twilight Domain",
      source: "TCE",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "war",
      class_id: "cleric",
      name: "War Domain",
      source: "PHB",
      min_level: 1,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "dreams",
      class_id: "druid",
      name: "Circle of Dreams",
      source: "XGE",
      min_level: 2,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "spores",
      class_id: "druid",
      name: "Circle of Spores",
      source: "TCE",
      min_level: 2,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "stars",
      class_id: "druid",
      name: "Circle of Stars",
      source: "TCE",
      min_level: 2,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "land",
      class_id: "druid",
      name: "Circle of the Land",
      source: "PHB",
      min_level: 2,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "moon",
      class_id: "druid",
      name: "Circle of the Moon",
      source: "PHB",
      min_level: 2,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "shepherd",
      class_id: "druid",
      name: "Circle of the Shepherd",
      source: "XGE",
      min_level: 2,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "wildfire",
      class_id: "druid",
      name: "Circle of Wildfire",
      source: "TCE",
      min_level: 2,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "arcane_archer",
      class_id: "fighter",
      name: "Arcane Archer",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "battle_master",
      class_id: "fighter",
      name: "Battle Master",
      source: "PHB",
      min_level: 3,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "cavalier",
      class_id: "fighter",
      name: "Cavalier",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "champion",
      class_id: "fighter",
      name: "Champion",
      source: "PHB",
      min_level: 3,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "echo_knight",
      class_id: "fighter",
      name: "Echo Knight",
      source: "EGW",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "eldritch_knight",
      class_id: "fighter",
      name: "Eldritch Knight",
      source: "PHB",
      min_level: 3,
      caster_progression_override: "third",
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      },
      spell_access: {
        class_ids: [
          "wizard"
        ],
        schools: [
          "abjuration",
          "evocation"
        ],
        notes: "Subclass access to wizard spells; school restrictions may apply by level/feature."
      }
    },
    {
      id: "psi_warrior",
      class_id: "fighter",
      name: "Psi Warrior",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "purple_dragon_knight",
      class_id: "fighter",
      name: "Purple Dragon Knight",
      source: "SCAG",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "rune_knight",
      class_id: "fighter",
      name: "Rune Knight",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "samurai",
      class_id: "fighter",
      name: "Samurai",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "mercy",
      class_id: "monk",
      name: "Way of Mercy",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "shadow",
      class_id: "monk",
      name: "Way of Shadow",
      source: "PHB",
      min_level: 3,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "ascendant_dragon",
      class_id: "monk",
      name: "Way of the Ascendant Dragon",
      source: "FTD",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "astral_self",
      class_id: "monk",
      name: "Way of the Astral Self",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "drunken_master",
      class_id: "monk",
      name: "Way of the Drunken Master",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "four_elements",
      class_id: "monk",
      name: "Way of the Four Elements",
      source: "PHB",
      min_level: 3,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "kensei",
      class_id: "monk",
      name: "Way of the Kensei",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "long_death",
      class_id: "monk",
      name: "Way of the Long Death",
      source: "SCAG",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "open_hand",
      class_id: "monk",
      name: "Way of the Open Hand",
      source: "PHB",
      min_level: 3,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "sun_soul",
      class_id: "monk",
      name: "Way of the Sun Soul",
      source: "XGE",
      sources: [
        "SCAG",
        "XGE"
      ],
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "conquest",
      class_id: "paladin",
      name: "Oath of Conquest",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "devotion",
      class_id: "paladin",
      name: "Oath of Devotion",
      source: "PHB",
      min_level: 3,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "glory",
      class_id: "paladin",
      name: "Oath of Glory",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "redemption",
      class_id: "paladin",
      name: "Oath of Redemption",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "ancients",
      class_id: "paladin",
      name: "Oath of the Ancients",
      source: "PHB",
      min_level: 3,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "crown",
      class_id: "paladin",
      name: "Oath of the Crown",
      source: "SCAG",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "watchers",
      class_id: "paladin",
      name: "Oath of the Watchers",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "vengeance",
      class_id: "paladin",
      name: "Oath of Vengeance",
      source: "PHB",
      min_level: 3,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "oathbreaker",
      class_id: "paladin",
      name: "Oathbreaker",
      source: "DMG",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "beast_master",
      class_id: "ranger",
      name: "Beast Master",
      source: "PHB",
      min_level: 3,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "drakewarden",
      class_id: "ranger",
      name: "Drakewarden",
      source: "FTD",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "fey_wanderer",
      class_id: "ranger",
      name: "Fey Wanderer",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "gloom_stalker",
      class_id: "ranger",
      name: "Gloom Stalker",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "horizon_walker",
      class_id: "ranger",
      name: "Horizon Walker",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "hunter",
      class_id: "ranger",
      name: "Hunter",
      source: "PHB",
      min_level: 3,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "monster_slayer",
      class_id: "ranger",
      name: "Monster Slayer",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "swarmkeeper",
      class_id: "ranger",
      name: "Swarmkeeper",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "arcane_trickster",
      class_id: "rogue",
      name: "Arcane Trickster",
      source: "PHB",
      min_level: 3,
      caster_progression_override: "third",
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      },
      spell_access: {
        class_ids: [
          "wizard"
        ],
        schools: [
          "enchantment",
          "illusion"
        ],
        notes: "Subclass access to wizard spells; school restrictions may apply by level/feature."
      }
    },
    {
      id: "assassin",
      class_id: "rogue",
      name: "Assassin",
      source: "PHB",
      min_level: 3,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "inquisitive",
      class_id: "rogue",
      name: "Inquisitive",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "mastermind",
      class_id: "rogue",
      name: "Mastermind",
      source: "XGE",
      sources: [
        "SCAG",
        "XGE"
      ],
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "phantom",
      class_id: "rogue",
      name: "Phantom",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "scout",
      class_id: "rogue",
      name: "Scout",
      source: "XGE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "soulknife",
      class_id: "rogue",
      name: "Soulknife",
      source: "TCE",
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "swashbuckler",
      class_id: "rogue",
      name: "Swashbuckler",
      source: "XGE",
      sources: [
        "SCAG",
        "XGE"
      ],
      min_level: 3,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "thief",
      class_id: "rogue",
      name: "Thief",
      source: "PHB",
      min_level: 3,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "aberrant_mind",
      class_id: "sorcerer",
      name: "Aberrant Mind",
      source: "TCE",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "clockwork_soul",
      class_id: "sorcerer",
      name: "Clockwork Soul",
      source: "TCE",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "divine_soul",
      class_id: "sorcerer",
      name: "Divine Soul",
      source: "XGE",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "draconic_bloodline",
      class_id: "sorcerer",
      name: "Draconic Bloodline",
      source: "PHB",
      min_level: 1,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "lunar_sorcery",
      class_id: "sorcerer",
      name: "Lunar Sorcery",
      source: "DSOTDQ",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "shadow_magic",
      class_id: "sorcerer",
      name: "Shadow Magic",
      source: "XGE",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "storm_sorcery",
      class_id: "sorcerer",
      name: "Storm Sorcery",
      source: "XGE",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "wild_magic_sorcerer",
      class_id: "sorcerer",
      name: "Wild Magic",
      source: "PHB",
      min_level: 1,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "archfey",
      class_id: "warlock",
      name: "The Archfey",
      source: "PHB",
      min_level: 1,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "celestial",
      class_id: "warlock",
      name: "The Celestial",
      source: "XGE",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "fathomless",
      class_id: "warlock",
      name: "The Fathomless",
      source: "TCE",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "fiend",
      class_id: "warlock",
      name: "The Fiend",
      source: "PHB",
      min_level: 1,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "genie",
      class_id: "warlock",
      name: "The Genie",
      source: "TCE",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "great_old_one",
      class_id: "warlock",
      name: "The Great Old One",
      source: "PHB",
      min_level: 1,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "hexblade",
      class_id: "warlock",
      name: "The Hexblade",
      source: "XGE",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "undead",
      class_id: "warlock",
      name: "The Undead",
      source: "VRGR",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "undying",
      class_id: "warlock",
      name: "The Undying",
      source: "SCAG",
      min_level: 1,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "bladesinging",
      class_id: "wizard",
      name: "Bladesinging",
      source: "XGE",
      sources: [
        "SCAG",
        "XGE"
      ],
      min_level: 2,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "chronurgy_magic",
      class_id: "wizard",
      name: "Chronurgy Magic",
      source: "EGW",
      min_level: 2,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "graviturgy_magic",
      class_id: "wizard",
      name: "Graviturgy Magic",
      source: "EGW",
      min_level: 2,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "order_of_scribes",
      class_id: "wizard",
      name: "Order of Scribes",
      source: "TCE",
      min_level: 2,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "abjuration",
      class_id: "wizard",
      name: "School of Abjuration",
      source: "PHB",
      min_level: 2,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "conjuration",
      class_id: "wizard",
      name: "School of Conjuration",
      source: "PHB",
      min_level: 2,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "divination",
      class_id: "wizard",
      name: "School of Divination",
      source: "PHB",
      min_level: 2,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "enchantment",
      class_id: "wizard",
      name: "School of Enchantment",
      source: "PHB",
      min_level: 2,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "evocation",
      class_id: "wizard",
      name: "School of Evocation",
      source: "PHB",
      min_level: 2,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "illusion",
      class_id: "wizard",
      name: "School of Illusion",
      source: "PHB",
      min_level: 2,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "necromancy",
      class_id: "wizard",
      name: "School of Necromancy",
      source: "PHB",
      min_level: 2,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "transmutation",
      class_id: "wizard",
      name: "School of Transmutation",
      source: "PHB",
      min_level: 2,
      availability: {
        default: "allowed",
        content_group: "core",
        official: true,
        era: "5e_2014"
      }
    },
    {
      id: "war_magic",
      class_id: "wizard",
      name: "War Magic",
      source: "XGE",
      min_level: 2,
      availability: {
        default: "requires_dm_approval",
        content_group: "expanded",
        official: true,
        era: "5e_2014"
      }
    }
  ];

  // data/dnd5e_2014/species.min.json
  var species_min_default = [{ id: "aarakocra", name: "Aarakocra", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "aasimar", name: "Aasimar", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "bugbear", name: "Bugbear", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "centaur", name: "Centaur", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "changeling", name: "Changeling", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "deep_gnome", name: "Deep Gnome", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "dragonborn", name: "Dragonborn", source: "PHB", page: 32, languages: ["common", "draconic"], availability: { default: "allowed", content_group: "core", official: true, era: "5e_2014" } }, { id: "elf_drow", name: "Drow", source: "PHB", page: 24, languages: ["common", "elvish"], availability: { default: "allowed", content_group: "core", official: true, era: "5e_2014" } }, { id: "duergar", name: "Duergar", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "eladrin", name: "Eladrin", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "fairy", name: "Fairy", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "firbolg", name: "Firbolg", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "gnome_forest", name: "Forest Gnome", source: "PHB", page: 37, languages: ["common", "gnomish"], availability: { default: "allowed", content_group: "core", official: true, era: "5e_2014" } }, { id: "genasi_air", name: "Genasi (Air)", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "genasi_earth", name: "Genasi (Earth)", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "genasi_fire", name: "Genasi (Fire)", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "genasi_water", name: "Genasi (Water)", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "githyanki", name: "Githyanki", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "githzerai", name: "Githzerai", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "goblin", name: "Goblin", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "goliath", name: "Goliath", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "half_elf", name: "Half-Elf", source: "PHB", page: 39, languages: ["common", "elvish"], availability: { default: "allowed", content_group: "core", official: true, era: "5e_2014" } }, { id: "half_orc", name: "Half-Orc", source: "PHB", page: 41, languages: ["common", "orc"], availability: { default: "allowed", content_group: "core", official: true, era: "5e_2014" } }, { id: "harengon", name: "Harengon", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "elf_high", name: "High Elf", source: "PHB", page: 23, languages: ["common", "elvish"], availability: { default: "allowed", content_group: "core", official: true, era: "5e_2014" } }, { id: "dwarf_hill", name: "Hill Dwarf", source: "PHB", page: 20, languages: ["common", "dwarvish"], availability: { default: "allowed", content_group: "core", official: true, era: "5e_2014" } }, { id: "hobgoblin", name: "Hobgoblin", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "human", name: "Human", source: "PHB", page: 29, languages: ["common"], availability: { default: "allowed", content_group: "core", official: true, era: "5e_2014" } }, { id: "kenku", name: "Kenku", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "kobold", name: "Kobold", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "halfling_lightfoot", name: "Lightfoot Halfling", source: "PHB", page: 28, languages: ["common", "halfling"], availability: { default: "allowed", content_group: "core", official: true, era: "5e_2014" } }, { id: "lizardfolk", name: "Lizardfolk", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "minotaur", name: "Minotaur", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "dwarf_mountain", name: "Mountain Dwarf", source: "PHB", page: 20, languages: ["common", "dwarvish"], availability: { default: "allowed", content_group: "core", official: true, era: "5e_2014" } }, { id: "orc", name: "Orc", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "gnome_rock", name: "Rock Gnome", source: "PHB", page: 37, languages: ["common", "gnomish"], availability: { default: "allowed", content_group: "core", official: true, era: "5e_2014" } }, { id: "satyr", name: "Satyr", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "sea_elf", name: "Sea Elf", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "shadar_kai", name: "Shadar-kai", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "shifter", name: "Shifter", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "halfling_stout", name: "Stout Halfling", source: "PHB", page: 28, languages: ["common", "halfling"], availability: { default: "allowed", content_group: "core", official: true, era: "5e_2014" } }, { id: "tabaxi", name: "Tabaxi", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "tiefling", name: "Tiefling", source: "PHB", page: 43, languages: ["common", "infernal"], availability: { default: "allowed", content_group: "core", official: true, era: "5e_2014" } }, { id: "tortle", name: "Tortle", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "triton", name: "Triton", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }, { id: "elf_wood", name: "Wood Elf", source: "PHB", page: 24, languages: ["common", "elvish"], availability: { default: "allowed", content_group: "core", official: true, era: "5e_2014" } }, { id: "yuan_ti", name: "Yuan-ti", source: "MOTM", availability: { default: "requires_dm_approval", content_group: "expanded", official: true, era: "5e_2014" } }];

  // data/dnd5e_2014/spells.min.json
  var spells_min_default = [
    {
      id: "spell_acid_splash",
      name: "Acid Splash",
      level: 0,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "211",
      summary_basic: "1d6 acid damage against up to two adjacent targets, Dex saves. Damage increases with higher caster level.",
      summary_expert: ""
    },
    {
      id: "spell_alarm",
      name: "Alarm",
      level: 1,
      school: "Abjuration",
      ritual: true,
      concentration: false,
      casting_time: "1 minute",
      range: "30 feet",
      components: "V, S, M",
      duration: "8 hour",
      classes: [
        "artificer",
        "ranger",
        "wizard",
        "fighter",
        "paladin",
        "rogue",
        "sorcerer"
      ],
      source: "PHB",
      page: "211",
      summary_basic: "Sets an alarm which pings you if you're within a mile when something passes through the marked area.",
      summary_expert: ""
    },
    {
      id: "spell_animal_friendship",
      name: "Animal Friendship",
      level: 1,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "24 hour",
      classes: [
        "bard",
        "druid",
        "ranger",
        "cleric"
      ],
      source: "PHB",
      page: "212",
      summary_basic: "Charms a beast with <3 Int for the day. Upcast to charm 1 more beast/level.",
      summary_expert: ""
    },
    {
      id: "spell_armor_of_agathys",
      name: "Armor Of Agathys",
      level: 1,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "warlock",
        "paladin"
      ],
      source: "PHB",
      page: "215",
      summary_basic: "+5 temporary HP, and 5 cold damage to melee attackers while you have the temporary HP. Upcasting increases both temporary HP and cold damage.",
      summary_expert: ""
    },
    {
      id: "spell_beast_bond",
      name: "Beast Bond",
      level: 1,
      school: "Divination",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "druid"
      ],
      source: "XGE",
      page: "150",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_blade_ward",
      name: "Blade Ward",
      level: 0,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "1 round",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "218",
      summary_basic: "Resistance to bludgeoning, piercing, slashing until your next turn.",
      summary_expert: ""
    },
    {
      id: "spell_booming_blade",
      name: "Booming Blade",
      level: 0,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "5 feet",
      components: "S, M",
      duration: "1 round",
      classes: [
        "artificer",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "TCE",
      page: "106",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_chill_touch",
      name: "Chill Touch",
      level: 0,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "1 round",
      classes: [
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "druid",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "221",
      summary_basic: "Target takes 1d8 necrotic damage and can't heal until your next turn. Damage increases at higher caster levels.",
      summary_expert: ""
    },
    {
      id: "spell_control_flames",
      name: "Control Flames",
      level: 0,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "S",
      duration: "Instantaneous; 1 hour",
      classes: [
        "cleric",
        "druid",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "152",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_create_bonfire",
      name: "Create Bonfire",
      level: 0,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "cleric",
        "druid",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "152",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_dancing_lights",
      name: "Dancing Lights",
      level: 0,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "artificer",
        "bard",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "230",
      summary_basic: "Creates four torch-sized lights, which illuminate 10' and can be moved 60' as a bonus action.",
      summary_expert: ""
    },
    {
      id: "spell_druidcraft",
      name: "Druidcraft",
      level: 0,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "druid",
        "barbarian",
        "cleric",
        "fighter"
      ],
      source: "PHB",
      page: "236",
      summary_basic: "Cause one of several minor nature-related effects: weather report for the next 24h, plant blooming, 5' cube of sensory effect, and lighting or snuffing out a small fire.",
      summary_expert: ""
    },
    {
      id: "spell_eldritch_blast",
      name: "Eldritch Blast",
      level: 0,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "warlock"
      ],
      source: "PHB",
      page: "237",
      summary_basic: "Deals 1d10 force damage to target. More attacks at higher caster levels.",
      summary_expert: ""
    },
    {
      id: "spell_elemental_bane",
      name: "Elemental Bane",
      level: 4,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "warlock",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "155",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_encode_thoughts",
      name: "Encode Thoughts",
      level: 0,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "S",
      duration: "8 hour",
      classes: [],
      source: "GGR",
      page: "47",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_ents",
      name: "Ents",
      level: 0,
      school: "",
      ritual: false,
      concentration: true,
      casting_time: "",
      range: "\uE30F \uE30B \uE30B \uE30F 6 1 reaction, which you take 60 feet \uE30F \uE30B \uE01D \uE30B \uE30F 1 action 90 feet \uE30F \uE30B \uE01D \uE30B \uE30F 1 bonus action Self \uE30F \uE30B \uE01D \uE30B \uE30F when a humanoid you can \uE30F \uE30B \uE30F \uE30B",
      components: "",
      duration: "\uE30F \uE30B see within d 6 i 0 es feet of you \uE30F \uE30B \uE30B \uE30B \uE30F \uE30F COM V P , O S, N M ENTS Conce D n U tra R tio A n T , u I p O to N 1",
      classes: [
        "warlock"
      ],
      source: "",
      page: "",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_fire_bolt",
      name: "Fire Bolt",
      level: 0,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "242",
      summary_basic: "Target takes 1d10 fire damage. Damage increases at higher caster levels.",
      summary_expert: ""
    },
    {
      id: "spell_friends",
      name: "Friends",
      level: 0,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "S, M",
      duration: "1 minute",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "244",
      summary_basic: "Grants advantage on Cha checks against target, but at the end, the creature knows you used magic on it and becomes hostile.",
      summary_expert: ""
    },
    {
      id: "spell_frostbite",
      name: "Frostbite",
      level: 0,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "druid",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "156",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_green_flame_blade",
      name: "Green-Flame Blade",
      level: 0,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "5 feet",
      components: "S, M",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "TCE",
      page: "107",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_guidance",
      name: "Guidance",
      level: 0,
      school: "Divination",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "artificer",
        "cleric",
        "druid",
        "bard",
        "sorcerer"
      ],
      source: "PHB",
      page: "248",
      summary_basic: "Target can roll 1d4 and add it to a single ability check, at which point the spell ends.",
      summary_expert: ""
    },
    {
      id: "spell_gust",
      name: "Gust",
      level: 0,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "druid",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "157",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_infestation",
      name: "Infestation",
      level: 0,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "druid",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "158",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_light",
      name: "Light",
      level: 0,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, M",
      duration: "1 hour",
      classes: [
        "artificer",
        "bard",
        "cleric",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue",
        "warlock"
      ],
      source: "PHB",
      page: "255",
      summary_basic: "Object sheds 20' of bright light and an additional 20' of dim light.",
      summary_expert: ""
    },
    {
      id: "spell_lightning_lure",
      name: "Lightning Lure",
      level: 0,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "15 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "TCE",
      page: "107",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_mage_hand",
      name: "Mage Hand",
      level: 0,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "artificer",
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "ranger",
        "rogue"
      ],
      source: "PHB",
      page: "256",
      summary_basic: "Creates spectral hand that can lift 10lbs, but not attack or activate magic items.",
      summary_expert: ""
    },
    {
      id: "spell_magic_stone",
      name: "Magic Stone",
      level: 0,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 bonus",
      range: "touch",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "cleric",
        "druid"
      ],
      source: "XGE",
      page: "160",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_mending",
      name: "Mending",
      level: 0,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "bard",
        "cleric",
        "druid",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "259",
      summary_basic: "Repairs a single break or tear in the touched object.",
      summary_expert: ""
    },
    {
      id: "spell_message",
      name: "Message",
      level: 0,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "1 round",
      classes: [
        "artificer",
        "bard",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "259",
      summary_basic: "Sends a whispered message to a target which only they can hear. Can send through sufficiently thin solid objects if you know the target.",
      summary_expert: ""
    },
    {
      id: "spell_mind_sliver",
      name: "Mind Sliver",
      level: 0,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V",
      duration: "1 round",
      classes: [
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "TCE",
      page: "108",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_minor_illusion",
      name: "Minor Illusion",
      level: 0,
      school: "Illusion",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "S, M",
      duration: "1 minute",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "monk",
        "rogue"
      ],
      source: "PHB",
      page: "260",
      summary_basic: "Creates an auditory or visual hallucination; if visual, must fit in a 5' cube.",
      summary_expert: ""
    },
    {
      id: "spell_mold_earth",
      name: "Mold Earth",
      level: 0,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "S",
      duration: "Instantaneous; 1 hour",
      classes: [
        "cleric",
        "druid",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "162",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_poison_spray",
      name: "Poison Spray",
      level: 0,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "10 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "druid",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "266",
      summary_basic: "Target takes 1d12 poison damage, Con save prevents. Damage increases at higher caster levels.",
      summary_expert: ""
    },
    {
      id: "spell_prestidigitation",
      name: "Prestidigitation",
      level: 0,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "10 feet",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "artificer",
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "267",
      summary_basic: "Creates one of a variety of minor, practical effects, such as sparks of light, cleaning or soiling 1 cubic foot, chilling, warming, or flavoring nonliving matter for an hour, or creating an illusion in your hand until the end of your next turn.",
      summary_expert: ""
    },
    {
      id: "spell_primal_savagery",
      name: "Primal Savagery",
      level: 0,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "S",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "druid"
      ],
      source: "XGE",
      page: "163",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_produce_flame",
      name: "Produce Flame",
      level: 0,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "druid",
        "cleric"
      ],
      source: "PHB",
      page: "269",
      summary_basic: "Ranged spell attack within 30' deals 1d8 fire damage. Damage increases at higher levels.",
      summary_expert: ""
    },
    {
      id: "spell_ray_of_frost",
      name: "Ray of Frost",
      level: 0,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "271",
      summary_basic: "Target takes 1d8 cold damage and loss 10' of move speed for a turn. Damage increases at higher caster levels.",
      summary_expert: ""
    },
    {
      id: "spell_resistance",
      name: "Resistance",
      level: 0,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "artificer",
        "cleric",
        "druid",
        "sorcerer"
      ],
      source: "PHB",
      page: "272",
      summary_basic: "Lets the target creature add +1d4 to a save, once, then the spell ends.",
      summary_expert: ""
    },
    {
      id: "spell_sacred_flame",
      name: "Sacred Flame",
      level: 0,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "272",
      summary_basic: "1d8 radiant damage, Dex save stops. Damage increases with caster level.",
      summary_expert: ""
    },
    {
      id: "spell_sapping_sting",
      name: "Sapping Sting",
      level: 0,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "wizard"
      ],
      source: "EGW",
      page: "189",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_scag",
      name: "Scag",
      level: 0,
      school: "Evocation",
      ritual: true,
      concentration: true,
      casting_time: "",
      range: "\uE30F \uE30B \uE30B \uE30F 0 1 action 5 feet \uE30F \uE30B \uE2F2 \uE30B \uE30F 1 action 120 feet \uE30F \uE30B \uE2F2 \uE30B \uE30F 1 action 60 feet \uE30F \uE30B \uE2F2 \uE30B \uE30F \uE30F \uE30B \uE30F \uE30B \uE30F \uE30B",
      components: "",
      duration: "\uE30B \uE30F",
      classes: [
        "sorcerer",
        "warlock",
        "wizard"
      ],
      source: "",
      page: "",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_shape_water",
      name: "Shape Water",
      level: 0,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "S",
      duration: "Instantaneous; 1 hour",
      classes: [
        "cleric",
        "druid",
        "fighter",
        "rogue",
        "wizard"
      ],
      source: "XGE",
      page: "164",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_shillelagh",
      name: "Shillelagh",
      level: 0,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 bonus",
      range: "touch",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "druid",
        "cleric"
      ],
      source: "PHB",
      page: "275",
      summary_basic: "Held club or quarterstaff uses spellcasting ability instead of Strength for attack and damage rolls, weapon's damage die becomes d8, and weapon becomes magical.",
      summary_expert: ""
    },
    {
      id: "spell_shocking_grasp",
      name: "Shocking Grasp",
      level: 0,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "275",
      summary_basic: "Target takes 1d8 lightning damage, and can't take reactions. Damage increases at higher caster levels.",
      summary_expert: ""
    },
    {
      id: "spell_spare_the_dying",
      name: "Spare the Dying",
      level: 0,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "cleric",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "277",
      summary_basic: "Target creature at 0 hp is stabilized.",
      summary_expert: ""
    },
    {
      id: "spell_sword_burst",
      name: "Sword Burst",
      level: 0,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "5 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "TCE",
      page: "115",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_thaumaturgy",
      name: "Thaumaturgy",
      level: 0,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V",
      duration: "1 minute",
      classes: [
        "cleric",
        "barbarian",
        "ranger",
        "sorcerer"
      ],
      source: "PHB",
      page: "282",
      summary_basic: "Manifest a minor effect that is suggestive of supernatural power, such as making your voice loud, causing flames to flicker or change color, or altering the appearance of your eyes. Up to three such effects can be active at a time.",
      summary_expert: ""
    },
    {
      id: "spell_thorn_whip",
      name: "Thorn Whip",
      level: 0,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "druid",
        "cleric"
      ],
      source: "PHB",
      page: "282",
      summary_basic: "Melee spell attack deals 1d6 piercing damage, and if it is Large or smaller, is pulled 10' towards you. Higher caster levels increase damage.",
      summary_expert: ""
    },
    {
      id: "spell_thunderclap",
      name: "Thunderclap",
      level: 0,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "5 feet",
      components: "S",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "druid",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "168",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_toll_the_dead",
      name: "Toll the Dead",
      level: 0,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "XGE",
      page: "169",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_true_strike",
      name: "True Strike",
      level: 0,
      school: "Divination",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "S",
      duration: "1 round",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "284",
      summary_basic: "Grants advantage on an attack roll against chosen creature next round.",
      summary_expert: ""
    },
    {
      id: "spell_vicious_mockery",
      name: "Vicious Mockery",
      level: 0,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "bard"
      ],
      source: "PHB",
      page: "285",
      summary_basic: "Target takes 1d4 psychic and has disadvantage on next attack roll, Wis save stops damage and effect. Higher caster levels increase damage.",
      summary_expert: ""
    },
    {
      id: "spell_word_of_radiance",
      name: "Word of Radiance",
      level: 0,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "5 feet",
      components: "V, M",
      duration: "Instantaneous",
      classes: [
        "sorcerer"
      ],
      source: "XGE",
      page: "171",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_absorb_elements",
      name: "Absorb Elements",
      level: 1,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 reaction (which you take when you take acid, cold, fire, lightning, or thunder damage)",
      range: "self",
      components: "S",
      duration: "1 round",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "150",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_arms_of_hadar",
      name: "Arms Of Hadar",
      level: 1,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "10 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "215",
      summary_basic: "Creatures within 10' of caster must save or take 2d6 necrotic damage. Upcasting increases damage.",
      summary_expert: ""
    },
    {
      id: "spell_augury",
      name: "Augury",
      level: 2,
      school: "Divination",
      ritual: true,
      concentration: false,
      casting_time: "1 minute",
      range: "self",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "druid",
        "barbarian",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "PHB",
      page: "215",
      summary_basic: "Receive a fortune reading on something you plan to do in <30 minutes.",
      summary_expert: ""
    },
    {
      id: "spell_bane",
      name: "Bane",
      level: 1,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "bard",
        "cleric",
        "paladin",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "216",
      summary_basic: "Up to three creatures must make a Cha  save or suffer a 1d4 penalty each time they attack or save. Upcasting increases the number of targets by 1/level.",
      summary_expert: ""
    },
    {
      id: "spell_barkskin",
      name: "Barkskin",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "druid",
        "ranger",
        "cleric"
      ],
      source: "PHB",
      page: "217",
      summary_basic: "Target's AC set to 16 minimum.",
      summary_expert: ""
    },
    {
      id: "spell_bless",
      name: "Bless",
      level: 1,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "cleric",
        "paladin",
        "sorcerer"
      ],
      source: "PHB",
      page: "219",
      summary_basic: "Target adds 1d4 to all attack rolls and saves. Upcasting increases the number of targets by 1/level.",
      summary_expert: ""
    },
    {
      id: "spell_burning_hands",
      name: "Burning Hands",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "15 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "sorcerer",
        "wizard",
        "druid",
        "fighter",
        "monk",
        "rogue",
        "warlock"
      ],
      source: "PHB",
      page: "220",
      summary_basic: "15' cone of 3d6 fire damage, Dex save halves. Upcasting increases damage by 1d6/level.",
      summary_expert: ""
    },
    {
      id: "spell_catapult",
      name: "Catapult",
      level: 1,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "S",
      duration: "Instantaneous",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "150",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_cause_fear",
      name: "Cause Fear",
      level: 1,
      school: "Necromancy",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V",
      duration: "1 minute",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "151",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_ceremony",
      name: "Ceremony",
      level: 1,
      school: "Abjuration",
      ritual: true,
      concentration: false,
      casting_time: "1 hour",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "paladin",
        "sorcerer"
      ],
      source: "XGE",
      page: "151",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_chaos_bolt",
      name: "Chaos Bolt",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [],
      source: "XGE",
      page: "151",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_charm_person",
      name: "Charm Person",
      level: 1,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "bard",
        "cleric",
        "druid",
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "ranger",
        "rogue"
      ],
      source: "PHB",
      page: "221",
      summary_basic: "Wis save or target is charmed, and thinks of you as a friendly acquaintance, realizing magic was used on it when the duration ends. Upcasting increases the number of targets by 1/level.",
      summary_expert: ""
    },
    {
      id: "spell_chromatic_orb",
      name: "Chromatic Orb",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "221",
      summary_basic: "Deals 3d8 damage of acid, cold, fire, lightning, poison or thunder type, your choice. Upcasting increases damage by 1d8/level.",
      summary_expert: ""
    },
    {
      id: "spell_color_spray",
      name: "Color Spray",
      level: 1,
      school: "Illusion",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "15 feet",
      components: "V, S, M",
      duration: "1 round",
      classes: [
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "222",
      summary_basic: "Blinds 6d10 hit points worth of creatures in 15' cone. Upcasting increases total hit points of creatures by 2d10/level.",
      summary_expert: ""
    },
    {
      id: "spell_command",
      name: "Command",
      level: 1,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V",
      duration: "1 round",
      classes: [
        "cleric",
        "paladin",
        "warlock",
        "bard",
        "sorcerer"
      ],
      source: "PHB",
      page: "223",
      summary_basic: "Issue a one word command that is not harmful to the target. Wisdom save counters. Upcasting adds one target/level.",
      summary_expert: ""
    },
    {
      id: "spell_compelled_duel",
      name: "Compelled Duel",
      level: 1,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "30 feet",
      components: "V",
      duration: "1 minute",
      classes: [
        "paladin"
      ],
      source: "PHB",
      page: "224",
      summary_basic: "Target must make Wis save or be compelled to fight you and stay near, so long as you stay in a one-on-one with it.",
      summary_expert: ""
    },
    {
      id: "spell_comprehend_languages",
      name: "Comprehend Languages",
      level: 1,
      school: "Divination",
      ritual: true,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "224",
      summary_basic: "Allows you to understand any spoken or written language for an hour.",
      summary_expert: ""
    },
    {
      id: "spell_create_or_destroy_water",
      name: "Create Or Destroy Water",
      level: 1,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "druid",
        "warlock",
        "sorcerer"
      ],
      source: "PHB",
      page: "229",
      summary_basic: "Creates or destroys 10gal of water, can be used to create 30' rain or disperse 30' fog. Upcast for +10gal/+5' area/level.",
      summary_expert: ""
    },
    {
      id: "spell_cure_wounds",
      name: "Cure Wounds",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "bard",
        "cleric",
        "druid",
        "paladin",
        "ranger",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "230",
      summary_basic: "Heals 1d8 + (spellcasting ability modifier) damage. Upcasting heals an additional 1d8/level.",
      summary_expert: ""
    },
    {
      id: "spell_detect_evil_and_good",
      name: "Detect Evil and Good",
      level: 1,
      school: "Divination",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "cleric",
        "paladin",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "231",
      summary_basic: "Recognizes aberration, celestial, fey, fiend, or undead, as well as magical consecration/desecration, within 30'.",
      summary_expert: ""
    },
    {
      id: "spell_detect_magic",
      name: "Detect Magic",
      level: 1,
      school: "Divination",
      ritual: true,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "artificer",
        "bard",
        "cleric",
        "druid",
        "paladin",
        "ranger",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "231",
      summary_basic: "Senses magical objects or creatures within 30', and school of magic.",
      summary_expert: ""
    },
    {
      id: "spell_detect_poison_and_disease",
      name: "Detect Poison and Disease",
      level: 1,
      school: "Divination",
      ritual: true,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "cleric",
        "druid",
        "paladin",
        "ranger",
        "sorcerer"
      ],
      source: "PHB",
      page: "231",
      summary_basic: "Senses poison, poisonous creatures, and disease within 30', and identifies type of poison, poisonous creature, or disease.",
      summary_expert: ""
    },
    {
      id: "spell_disguise_self",
      name: "Disguise Self",
      level: 1,
      school: "Illusion",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "artificer",
        "bard",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "ranger",
        "rogue"
      ],
      source: "PHB",
      page: "233",
      summary_basic: "Makes you and your armor look like another person; purely illusory.",
      summary_expert: ""
    },
    {
      id: "spell_dissonant_whispers",
      name: "Dissonant Whispers",
      level: 1,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "bard",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "234",
      summary_basic: "3d6 psychic damage, and target must use reaction to flee you. Wis save for half damage, no effect.",
      summary_expert: ""
    },
    {
      id: "spell_distort_value",
      name: "Distort Value",
      level: 1,
      school: "Illusion",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "touch",
      components: "V",
      duration: "8 hour",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "AI",
      page: "75",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_divine_favor",
      name: "Divine Favor",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "cleric",
        "paladin"
      ],
      source: "PHB",
      page: "234",
      summary_basic: "Weapon deals +1d4 radiant damage.",
      summary_expert: ""
    },
    {
      id: "spell_earth_tremor",
      name: "Earth Tremor",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "10 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "155",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_ensnaring_strike",
      name: "Ensnaring Strike",
      level: 1,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V",
      duration: "1 minute",
      classes: [
        "ranger",
        "paladin"
      ],
      source: "PHB",
      page: "237",
      summary_basic: "When you next hit an opponent with your weapon, target is restrained by vines, and takes 1d6 piercing damage at the start of each turn. Str save prevents, and can spend an action to try again. Upcasting adds +1d6 damage/level.",
      summary_expert: ""
    },
    {
      id: "spell_entangle",
      name: "Entangle",
      level: 1,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "druid",
        "ranger"
      ],
      source: "PHB",
      page: "238",
      summary_basic: "20' square of difficult terrain. Creatures in area must make Str save or be restrained, spending an action to try again.",
      summary_expert: ""
    },
    {
      id: "spell_expeditious_retreat",
      name: "Expeditious Retreat",
      level: 1,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "artificer",
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "238",
      summary_basic: "Can take the Dash action as a bonus action while spell is active.",
      summary_expert: ""
    },
    {
      id: "spell_faerie_fire",
      name: "Faerie Fire",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V",
      duration: "1 minute",
      classes: [
        "artificer",
        "bard",
        "druid",
        "cleric",
        "ranger",
        "warlock"
      ],
      source: "PHB",
      page: "239",
      summary_basic: "Objects and people in a 20' cube are lit up, counteracting invisibility for the duration. Dex save prevents.",
      summary_expert: ""
    },
    {
      id: "spell_false_life",
      name: "False Life",
      level: 1,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "artificer",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "rogue",
        "warlock"
      ],
      source: "PHB",
      page: "239",
      summary_basic: "Gives you 1d4 + 4 temporary hit points for duration. Upcasting adds +5 hit points/level.",
      summary_expert: ""
    },
    {
      id: "spell_feather_fall",
      name: "Feather Fall",
      level: 1,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 reaction (which you take when you or a creature within 60 feet of you falls)",
      range: "60 feet",
      components: "V, M",
      duration: "1 minute",
      classes: [
        "artificer",
        "bard",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "239",
      summary_basic: "Up to five falling creatures have their descent velocity capped at 60'/round. If they hit the ground while the spell is ongoing, they take no fall damage.",
      summary_expert: ""
    },
    {
      id: "spell_find_familiar",
      name: "Find Familiar",
      level: 1,
      school: "Conjuration",
      ritual: true,
      concentration: false,
      casting_time: "1 hour",
      range: "10 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "240",
      summary_basic: "Summons a creature to act as your familiar. Can sense via familiar, telepathically communicate, resummon if dead, or use as a proxy for touch-range spells.",
      summary_expert: ""
    },
    {
      id: "spell_fog_cloud",
      name: "Fog Cloud",
      level: 1,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "druid",
        "ranger",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "rogue",
        "warlock"
      ],
      source: "PHB",
      page: "243",
      summary_basic: "20' fog heavily obscures area. Upcasting adds +20' radius/level.",
      summary_expert: ""
    },
    {
      id: "spell_frost_fingers",
      name: "Frost Fingers",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "15 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "IDRotF",
      page: "318",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_gift_of_alacrity",
      name: "Gift of Alacrity",
      level: 1,
      school: "Divination",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "touch",
      components: "V, S",
      duration: "8 hour",
      classes: [
        "wizard"
      ],
      source: "EGW",
      page: "186",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_goodberry",
      name: "Goodberry",
      level: 1,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "druid",
        "ranger"
      ],
      source: "PHB",
      page: "246",
      summary_basic: "Creates ten magic berries that each heal 1 hit point and provide a day's nourishment.",
      summary_expert: ""
    },
    {
      id: "spell_grease",
      name: "Grease",
      level: 1,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "artificer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "246",
      summary_basic: "10' square of area is covered in grease, making those in the area, ending their turn on the area, or entering the area, fall prone; Dex save prevents.",
      summary_expert: ""
    },
    {
      id: "spell_guiding_bolt",
      name: "Guiding Bolt",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "1 round",
      classes: [
        "cleric",
        "druid",
        "paladin",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "248",
      summary_basic: "Ranged attack dealing 4d6 radiant damage and giving advantage on the next attack roll. Upcasting is +1d6/level.",
      summary_expert: ""
    },
    {
      id: "spell_hail_of_thorns",
      name: "Hail Of Thorns",
      level: 1,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V",
      duration: "1 minute",
      classes: [
        "ranger"
      ],
      source: "PHB",
      page: "249",
      summary_basic: "Around next creature struck with ranged weapon attack, deal 1d10 pierce to target and all within 5', Dex save halves. Upcasting +1d10/level (cap 6d10).",
      summary_expert: ""
    },
    {
      id: "spell_healing_word",
      name: "Healing Word",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 bonus",
      range: "60 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "bard",
        "cleric",
        "druid",
        "sorcerer",
        "artificer"
      ],
      source: "PHB",
      page: "250",
      summary_basic: "Creature regain 1d4 + (spellcasting ability mod) HP. Upcasting adds +1d4 healing/level.",
      summary_expert: ""
    },
    {
      id: "spell_hellish_rebuke",
      name: "Hellish Rebuke",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 reaction (which you take in response to being damaged by a creature within 60 feet of you that you can see)",
      range: "60 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "warlock",
        "paladin"
      ],
      source: "PHB",
      page: "250",
      summary_basic: "Person that damaged you takes 2d10 fire damage, Dex save halves. Upcasting adds +1d10 damage/level.",
      summary_expert: ""
    },
    {
      id: "spell_heroism",
      name: "Heroism",
      level: 1,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "bard",
        "paladin",
        "cleric",
        "artificer"
      ],
      source: "PHB",
      page: "250",
      summary_basic: "Creature gains immunity to being frightened and gains temporary hit points equal to your spellcasting ability modifier at the start of its turn. Upcasting adds +1 target/level.",
      summary_expert: ""
    },
    {
      id: "spell_hex",
      name: "Hex",
      level: 1,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "warlock"
      ],
      source: "PHB",
      page: "251",
      summary_basic: "You deal an extra 1d6 necrotic damage to the target whenever you hit it with an attack, and the target suffers disadvantage to checks with one ability score (your choice). Upcasting increases duration.",
      summary_expert: ""
    },
    {
      id: "spell_hunters_mark",
      name: "Hunter's Mark",
      level: 1,
      school: "Divination",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "90 feet",
      components: "V",
      duration: "1 hour",
      classes: [
        "ranger",
        "paladin"
      ],
      source: "PHB",
      page: "251",
      summary_basic: "Marks target, granting +1d6 damage and advantage to Perception and Survival checks to find it. Upcasting increases duration.",
      summary_expert: ""
    },
    {
      id: "spell_ice_knife",
      name: "Ice Knife",
      level: 1,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "S, M",
      duration: "Instantaneous",
      classes: [
        "druid",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "157",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_identify",
      name: "Identify",
      level: 1,
      school: "Divination",
      ritual: true,
      concentration: false,
      casting_time: "1 minute",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "bard",
        "cleric",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "252",
      summary_basic: "Identifies what a magical item does, what magic created an object, and what spells are currently affecting a touched creature.",
      summary_expert: ""
    },
    {
      id: "spell_illusory_script",
      name: "Illusory Script",
      level: 1,
      school: "Illusion",
      ritual: true,
      concentration: false,
      casting_time: "1 minute",
      range: "touch",
      components: "S, M",
      duration: "10 day",
      classes: [
        "bard",
        "warlock",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "252",
      summary_basic: "Only designated creatures and those with truesight can read your hidden message, with a false or gibberish text appearing for all others.",
      summary_expert: ""
    },
    {
      id: "spell_inflict_wounds",
      name: "Inflict Wounds",
      level: 1,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "paladin",
        "sorcerer"
      ],
      source: "PHB",
      page: "253",
      summary_basic: "Deals 3d10 necrotic damage. Upcasting adds +1d10/level.",
      summary_expert: ""
    },
    {
      id: "spell_jims_magic_missile",
      name: "Jim's Magic Missile",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "AI",
      page: "76",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_jump",
      name: "Jump",
      level: 1,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "artificer",
        "druid",
        "ranger",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "254",
      summary_basic: "Triples target's jump distance.",
      summary_expert: ""
    },
    {
      id: "spell_longstrider",
      name: "Longstrider",
      level: 1,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "artificer",
        "bard",
        "druid",
        "ranger",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "256",
      summary_basic: "Target's speed increases by +10'. Upcasting adds +1 creature/level.",
      summary_expert: ""
    },
    {
      id: "spell_mage_armor",
      name: "Mage Armor",
      level: 1,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "8 hour",
      classes: [
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "256",
      summary_basic: "Target's AC becomes 13 + Dex. Only works on those not wearing armor.",
      summary_expert: ""
    },
    {
      id: "spell_magic_missile",
      name: "Magic Missile",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "rogue",
        "artificer"
      ],
      source: "PHB",
      page: "257",
      summary_basic: "Three darts, each of which deal 1d4 + 1 damage. Upcasting adds 1 dart/level.",
      summary_expert: ""
    },
    {
      id: "spell_magnify_gravity",
      name: "Magnify Gravity",
      level: 1,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "1 round",
      classes: [
        "wizard"
      ],
      source: "EGW",
      page: "188",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_protection_from_evil_and_good",
      name: "Protection From Evil And Good",
      level: 1,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "cleric",
        "paladin",
        "warlock",
        "wizard",
        "fighter",
        "ranger",
        "rogue",
        "sorcerer"
      ],
      source: "PHB",
      page: "270",
      summary_basic: "Target creature is protected against aberrations, celestials, elementals, fey, fiends, and undead. Against such creature, the target gains a bunch of benefits against them.",
      summary_expert: ""
    },
    {
      id: "spell_purify_food_and_drink",
      name: "Purify Food and Drink",
      level: 1,
      school: "Transmutation",
      ritual: true,
      concentration: false,
      casting_time: "1 action",
      range: "10 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "cleric",
        "druid",
        "paladin",
        "sorcerer"
      ],
      source: "PHB",
      page: "270",
      summary_basic: "All nonmagical food and drink within 5' is purified and free of poison and disease.",
      summary_expert: ""
    },
    {
      id: "spell_ray_of_sickness",
      name: "Ray Of Sickness",
      level: 1,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "rogue",
        "warlock"
      ],
      source: "PHB",
      page: "271",
      summary_basic: "Target takes 2d8 poison damage and is poisoned for a turn. Con save clears poison, but not damage. Upcasting increases damage by 1d8 per level.",
      summary_expert: ""
    },
    {
      id: "spell_sanctuary",
      name: "Sanctuary",
      level: 1,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 bonus",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "artificer",
        "cleric",
        "warlock",
        "monk",
        "paladin",
        "sorcerer"
      ],
      source: "PHB",
      page: "272",
      summary_basic: "Any creature wishing to attack the chosen creature must make a Wis save; on a fail, they must target someone else. Spell ends if warded creature attacks or casts an offensive spell.",
      summary_expert: ""
    },
    {
      id: "spell_searing_smite",
      name: "Searing Smite",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V",
      duration: "1 minute",
      classes: [
        "paladin",
        "cleric"
      ],
      source: "PHB",
      page: "274",
      summary_basic: "Adds 1d6 fire damage to next melee weapon attack. Target struck makes Con save at end of each turn, failure inflicts additional 1d6 fire damage, save ends. Upcasting increases initial damage +1d6/level.",
      summary_expert: ""
    },
    {
      id: "spell_shield",
      name: "Shield",
      level: 1,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 reaction (which you take when you are hit by an attack or targeted by the magic missile spell)",
      range: "self",
      components: "V, S",
      duration: "1 round",
      classes: [
        "artificer",
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "275",
      summary_basic: "In response to an attack or magic missile, +5 AC and immunity to magic missile until your next turn.",
      summary_expert: ""
    },
    {
      id: "spell_shield_of_faith",
      name: "Shield of Faith",
      level: 1,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "60 feet",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "cleric",
        "paladin",
        "sorcerer"
      ],
      source: "PHB",
      page: "275",
      summary_basic: "Grants +2 AC to target for duration.",
      summary_expert: ""
    },
    {
      id: "spell_silent_image",
      name: "Silent Image",
      level: 1,
      school: "Illusion",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "bard",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "276",
      summary_basic: "Creates a visual illusion that you can move and make look as if it's moving naturally.",
      summary_expert: ""
    },
    {
      id: "spell_silvery_barbs",
      name: "Silvery Barbs",
      level: 1,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 reaction (which you take when a creature you can see within 60 feet of yourself succeeds on an attack roll, an ability check, or a saving throw)",
      range: "60 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "bard",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "SCC",
      page: "38",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_sleep",
      name: "Sleep",
      level: 1,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "bard",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "paladin",
        "rogue",
        "warlock"
      ],
      source: "PHB",
      page: "276",
      summary_basic: "5d8 hit points of creatures are put to sleep. Upcasting adds +2d8 HP of targets/level.",
      summary_expert: ""
    },
    {
      id: "spell_snare",
      name: "Snare",
      level: 1,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "touch",
      components: "S, M",
      duration: "8 hour",
      classes: [
        "artificer",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "165",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_speak_with_animals",
      name: "Speak With Animals",
      level: 1,
      school: "Divination",
      ritual: true,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "bard",
        "cleric",
        "druid",
        "paladin",
        "ranger",
        "barbarian"
      ],
      source: "PHB",
      page: "277",
      summary_basic: "You can speak and verbally communicate with beasts for the duration.",
      summary_expert: ""
    },
    {
      id: "spell_tashas_caustic_brew",
      name: "Tasha'S Caustic Brew",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "artificer",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "TCE",
      page: "115",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_tashas_hideous_laughter",
      name: "Tasha's Hideous Laughter",
      level: 1,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "bard",
        "wizard",
        "fighter",
        "rogue",
        "warlock"
      ],
      source: "PHB",
      page: "280",
      summary_basic: "Target falls prone and is incapacitated, unable to stand. Wis save prevents. Each turn and when damaged, target can make fresh Wis save.",
      summary_expert: ""
    },
    {
      id: "spell_tensers_floating_disk",
      name: "Tenser's Floating Disk",
      level: 1,
      school: "Conjuration",
      ritual: true,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "282",
      summary_basic: "3' diameter floating disk carries up to 500lbs and follows you at a distance of 20'.",
      summary_expert: ""
    },
    {
      id: "spell_thunderous_smite",
      name: "Thunderous Smite",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V",
      duration: "1 minute",
      classes: [
        "paladin",
        "cleric"
      ],
      source: "PHB",
      page: "282",
      summary_basic: "Next attack deals 2d6 thunder damage to the target and pushes it 10' away, knocking it prone. Str save prevents effect but not damage.",
      summary_expert: ""
    },
    {
      id: "spell_thunderwave",
      name: "Thunderwave",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "15 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "bard",
        "druid",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "rogue",
        "warlock",
        "artificer"
      ],
      source: "PHB",
      page: "282",
      summary_basic: "Those within 15' take 2d8 thunder damage and are pushed 10' away. Con save halves damage and prevents push. Upcasting increases damage by +1d8/level.",
      summary_expert: ""
    },
    {
      id: "spell_unseen_servant",
      name: "Unseen Servant",
      level: 1,
      school: "Conjuration",
      ritual: true,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "bard",
        "warlock",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "284",
      summary_basic: "Creates an invisible servant incapable of attacking that performs simple tasks at your command. You can give new commands as a bonus action.",
      summary_expert: ""
    },
    {
      id: "spell_witch_bolt",
      name: "Witch Bolt",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "289",
      summary_basic: "Deals 1d12 lightning damage, and you can spend your action to deal another 1d12 lightning damage each round. Upcasting increases initial damage by +1d12/level.",
      summary_expert: ""
    },
    {
      id: "spell_wrathful_smite",
      name: "Wrathful Smite",
      level: 1,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V",
      duration: "1 minute",
      classes: [
        "paladin",
        "warlock"
      ],
      source: "PHB",
      page: "289",
      summary_basic: "Next melee weapon attack deals 1d6 psychic damage and is frightened until the spell ends, Wis save prevents effect. As an action, creature can take Wis save to end the effect.",
      summary_expert: ""
    },
    {
      id: "spell_zephyr_strike",
      name: "Zephyr Strike",
      level: 1,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V",
      duration: "1 minute",
      classes: [],
      source: "XGE",
      page: "171",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_aganazzars_scorcher",
      name: "Aganazzar's Scorcher",
      level: 2,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "150",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_aid",
      name: "Aid",
      level: 2,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "8 hour",
      classes: [
        "artificer",
        "cleric",
        "paladin",
        "sorcerer"
      ],
      source: "PHB",
      page: "211",
      summary_basic: "+5 max and current HP for 8h. If upcast, +5HP per spell level.",
      summary_expert: ""
    },
    {
      id: "spell_air_bubble",
      name: "Air Bubble",
      level: 2,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "S",
      duration: "24 hour",
      classes: [
        "artificer",
        "druid",
        "ranger",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "AAG",
      page: "22",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_alter_self",
      name: "Alter Self",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "artificer",
        "sorcerer",
        "wizard",
        "druid",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "211",
      summary_basic: "Choose between aquatic adaptation, change appearance, and natural weapons. Can change between while active.",
      summary_expert: ""
    },
    {
      id: "spell_animal_messenger",
      name: "Animal Messenger",
      level: 2,
      school: "Enchantment",
      ritual: true,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "24 hour",
      classes: [
        "bard",
        "druid",
        "ranger"
      ],
      source: "PHB",
      page: "212",
      summary_basic: "Tiny beast seeks out a chosen location/target, speaks up to 25 words. Upcast for longer distances/duration.",
      summary_expert: ""
    },
    {
      id: "spell_animate_dead",
      name: "Animate Dead",
      level: 3,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "10 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "wizard",
        "druid",
        "fighter",
        "paladin",
        "rogue",
        "sorcerer"
      ],
      source: "PHB",
      page: "212",
      summary_basic: "Raises a zombie or skeleton, which obeys your orders for 24h unless spell is recast. Upcast to increase the number of undead by 2/level.",
      summary_expert: ""
    },
    {
      id: "spell_arcane_lock",
      name: "Arcane Lock",
      level: 2,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "Until dispel",
      classes: [
        "artificer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "215",
      summary_basic: "Magically locks something, making it difficult to break or pick. A spoken password suppresses the effect.",
      summary_expert: ""
    },
    {
      id: "spell_beast_sense",
      name: "Beast Sense",
      level: 2,
      school: "Divination",
      ritual: true,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "S",
      duration: "1 hour",
      classes: [
        "druid",
        "ranger",
        "barbarian"
      ],
      source: "PHB",
      page: "217",
      summary_basic: "Sense through a touched beast's eyes.",
      summary_expert: ""
    },
    {
      id: "spell_blindness",
      name: "Blindness",
      level: 2,
      school: "Enchantment",
      ritual: true,
      concentration: true,
      casting_time: "",
      range: "\uE30F \uE30B \uE30B \uE30F 2 1 action 60 feet \uE30F \uE30B \uE314 \uE30B \uE30F 1 action 30 feet \uE30F \uE30B \uE314 \uE30B \uE30F 1 action 30 feet \uE30F \uE30B \uE314 \uE30B \uE30F \uE30F \uE30B",
      components: "",
      duration: "\uE30F \uE30B",
      classes: [
        "bard",
        "cleric",
        "druid"
      ],
      source: "",
      page: "",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_blindness_deafness",
      name: "Blindness/Deafness",
      level: 2,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V",
      duration: "1 minute",
      classes: [
        "bard",
        "cleric",
        "sorcerer",
        "wizard",
        "druid",
        "fighter",
        "rogue",
        "warlock"
      ],
      source: "PHB",
      page: "219",
      summary_basic: "Target makes Con save or is blinded/deafened (your choice). Upcasting increases number of targets by 1/level.",
      summary_expert: ""
    },
    {
      id: "spell_blur",
      name: "Blur",
      level: 2,
      school: "Illusion",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V",
      duration: "1 minute",
      classes: [
        "artificer",
        "sorcerer",
        "wizard",
        "druid",
        "fighter",
        "rogue",
        "warlock"
      ],
      source: "PHB",
      page: "219",
      summary_basic: "Blur self, inflicting disadvantage on attacks against you.",
      summary_expert: ""
    },
    {
      id: "spell_borrowed_knowledge",
      name: "Borrowed Knowledge",
      level: 2,
      school: "Divination",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "bard",
        "cleric",
        "warlock",
        "wizard",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "SCC",
      page: "37",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_branding_smite",
      name: "Branding Smite",
      level: 2,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V",
      duration: "1 minute",
      classes: [
        "artificer",
        "paladin",
        "warlock"
      ],
      source: "PHB",
      page: "219",
      summary_basic: "Next attack deals 2d6 radiant damage, target becomes visible and illuminated and can't become invisible. Upcasting increases damage by 1d6/level.",
      summary_expert: ""
    },
    {
      id: "spell_call_lightning",
      name: "Call Lightning",
      level: 3,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "druid",
        "cleric"
      ],
      source: "PHB",
      page: "220",
      summary_basic: "Storm cloud appears, letting you strike target 5' zone of your choice in 60' cylinder for 3d10 lightning damage every round. Upcasting increases damage by 1d10/level.",
      summary_expert: ""
    },
    {
      id: "spell_calm_emotions",
      name: "Calm Emotions",
      level: 2,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "bard",
        "cleric",
        "paladin",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "221",
      summary_basic: "Cha save (can choose to fail) or suppress charm/frighten. Alternately, Cha save or become indifferent to previously-hostile creatures until attacked or harmed.",
      summary_expert: ""
    },
    {
      id: "spell_catnap",
      name: "Catnap",
      level: 3,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "S, M",
      duration: "10 minute",
      classes: [
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "151",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_cloud_of_daggers",
      name: "Cloud Of Daggers",
      level: 2,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "222",
      summary_basic: "Creates a 5' cube of daggers which deal 4d4 slashing damage to those who pass through. Upcasting increases damage by 2d4/level.",
      summary_expert: ""
    },
    {
      id: "spell_continual_flame",
      name: "Continual Flame",
      level: 2,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "Until dispel",
      classes: [
        "artificer",
        "cleric",
        "wizard",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "PHB",
      page: "227",
      summary_basic: "Creates a light that can't be quenched.",
      summary_expert: ""
    },
    {
      id: "spell_cordon_of_arrows",
      name: "Cordon of Arrows",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "5 feet",
      components: "V, S, M",
      duration: "8 hour",
      classes: [
        "ranger"
      ],
      source: "PHB",
      page: "228",
      summary_basic: "Plant four arrows within 5' of you; they attack anyone who comes within 30' of them, dealing 1d6 piercing damage (Dex save prevents) and destroying themselves. Upcasting increases number of arrows by 2/level.",
      summary_expert: ""
    },
    {
      id: "spell_crown_of_madness",
      name: "Crown Of Madness",
      level: 2,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "paladin",
        "rogue"
      ],
      source: "PHB",
      page: "229",
      summary_basic: "Target attacks who you command it to as an action, as long as it continues to fail Wis saves and it can. Otherwise it is free to act.",
      summary_expert: ""
    },
    {
      id: "spell_darkness",
      name: "Darkness",
      level: 2,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, M",
      duration: "10 minute",
      classes: [
        "sorcerer",
        "warlock",
        "wizard",
        "druid",
        "fighter",
        "monk",
        "paladin",
        "rogue"
      ],
      source: "PHB",
      page: "230",
      summary_basic: "Magical darkness covers a 15' radius sphere. Dispels 2nd level or lower magical lights.",
      summary_expert: ""
    },
    {
      id: "spell_darkvision",
      name: "Darkvision",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "8 hour",
      classes: [
        "artificer",
        "druid",
        "ranger",
        "sorcerer",
        "wizard",
        "fighter",
        "monk",
        "rogue"
      ],
      source: "PHB",
      page: "230",
      summary_basic: "Touched creature gains 60' of darkvision for 8 hours.",
      summary_expert: ""
    },
    {
      id: "spell_detect_thoughts",
      name: "Detect Thoughts",
      level: 2,
      school: "Divination",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "bard",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue",
        "warlock"
      ],
      source: "PHB",
      page: "231",
      summary_basic: "Detect surface thoughts of one creature at a time within 30'. Can plunge deeper for insight into reasoning, emotional state, and important things, but this lets it resist with a successful Wis save ending the spell. Continued probing means Int v. Int checks that end the spell if it wins. Can detect invisible within 30'. No effect on creatures with <3 Int or no language.",
      summary_expert: ""
    },
    {
      id: "spell_dragons_breath",
      name: "Dragon's Breath",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "touch",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "154",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_dust_devil",
      name: "Dust Devil",
      level: 2,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "154",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_earthbind",
      name: "Earthbind",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "300 feet",
      components: "V",
      duration: "1 minute",
      classes: [
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "154",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_enhance_ability",
      name: "Enhance Ability",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "artificer",
        "bard",
        "cleric",
        "druid",
        "paladin",
        "ranger",
        "sorcerer",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "237",
      summary_basic: "Creature gains advantage on chosen Ability checks, and additional benefits for Str/Dex/Con. Upcasting lets you target +1 creature/level.",
      summary_expert: ""
    },
    {
      id: "spell_enlarge",
      name: "Enlarge",
      level: 2,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "",
      range: "\uE30F \uE30B \uE30B \uE30F 2 1 action Touch \uE30F \uE30B \uE14C \uE30B \uE30F 1 action Touch \uE30F \uE30B \uE14C \uE30B \uE30F 1 action Touch \uE30F \uE30B \uE14C \uE30B \uE30F \uE30F \uE30B \uE30F \uE30B \uE30F \uE30B",
      components: "",
      duration: "\uE30B \uE30F",
      classes: [
        "artificer",
        "bard"
      ],
      source: "",
      page: "",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_enlarge_reduce",
      name: "Enlarge/Reduce",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "artificer",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "237",
      summary_basic: "Increases/decreases size category by one step, grants advantage/disadvantage on Strength rolls, and add/reduces damage by 1d4.",
      summary_expert: ""
    },
    {
      id: "spell_enthrall",
      name: "Enthrall",
      level: 2,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "bard",
        "warlock"
      ],
      source: "PHB",
      page: "238",
      summary_basic: "Creatures you choose within range must make a Wis save or suffer disadvantage on Perception checks to perceive anyone but you. Target has advantage on Wis save if they're fighting you or your companions.",
      summary_expert: ""
    },
    {
      id: "spell_find_steed",
      name: "Find Steed",
      level: 2,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "10 minute",
      range: "30 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "paladin"
      ],
      source: "PHB",
      page: "240",
      summary_basic: "Summons a loyal steed, which can understand one language and you may speak to it telepathically within 1 mile.",
      summary_expert: ""
    },
    {
      id: "spell_find_traps",
      name: "Find Traps",
      level: 2,
      school: "Divination",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "druid",
        "ranger",
        "sorcerer"
      ],
      source: "PHB",
      page: "241",
      summary_basic: "Detects the presence and general nature of traps within range and line of sight.",
      summary_expert: ""
    },
    {
      id: "spell_flame_blade",
      name: "Flame Blade",
      level: 2,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "druid"
      ],
      source: "PHB",
      page: "242",
      summary_basic: "Fire blade held in hand acts as weapon dealing 3d6 fire damage. Upcasting adds +1d6/two levels.",
      summary_expert: ""
    },
    {
      id: "spell_flaming_sphere",
      name: "Flaming Sphere",
      level: 2,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "druid",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "rogue",
        "artificer"
      ],
      source: "PHB",
      page: "242",
      summary_basic: "5' diameter sphere deals 2d6 damage to those within 5' of it, Dex save halves. Sphere can be moved up to 30' as a bonus action. Upcasting adds +1d6 damage/level.",
      summary_expert: ""
    },
    {
      id: "spell_flock_of_familiars",
      name: "Flock of Familiars",
      level: 2,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 minute",
      range: "touch",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "warlock",
        "wizard"
      ],
      source: "LLK",
      page: "57",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_fortunes_favor",
      name: "Fortune's Favor",
      level: 2,
      school: "Divination",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "wizard"
      ],
      source: "EGW",
      page: "186",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_gentle_repose",
      name: "Gentle Repose",
      level: 2,
      school: "Necromancy",
      ritual: true,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "10 day",
      classes: [
        "cleric",
        "wizard",
        "druid",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "PHB",
      page: "245",
      summary_basic: "Corpse doesn't decay/age for duration - including for purposes of raise dead- and can't become undead.",
      summary_expert: ""
    },
    {
      id: "spell_gift_of_gab",
      name: "Gift of Gab",
      level: 2,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 reaction (which you take when you speak to another creature)",
      range: "self",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "bard",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "AI",
      page: "76",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_gust_of_wind",
      name: "Gust Of Wind",
      level: 2,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "druid",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "248",
      summary_basic: "60' long, 10' wind gust of wind is pushed 15' unless it passes a Str save, and has movement speed halved towards user.",
      summary_expert: ""
    },
    {
      id: "spell_healing_spirit",
      name: "Healing Spirit",
      level: 2,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "60 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [],
      source: "XGE",
      page: "157",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_heat_metal",
      name: "Heat Metal",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "artificer",
        "bard",
        "druid",
        "cleric"
      ],
      source: "PHB",
      page: "250",
      summary_basic: "Metal object becomes red-hot, dealing 2d8 fire damage to those in contact with it. As a bonus action, deal damage again. Holding the object inflicts disadvantage to attack rolls and ability checks until your next turn. Upcasting adds +1d8 damage/level.",
      summary_expert: ""
    },
    {
      id: "spell_hold_person",
      name: "Hold Person",
      level: 2,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "bard",
        "cleric",
        "druid",
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "paladin",
        "rogue"
      ],
      source: "PHB",
      page: "251",
      summary_basic: "Paralyzes humanoid target, Wis save ends, try again each turn. Upcasting adds +1 target/level.",
      summary_expert: ""
    },
    {
      id: "spell_immovable_object",
      name: "Immovable Object",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "wizard"
      ],
      source: "EGW",
      page: "187",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_invisibility",
      name: "Invisibility",
      level: 2,
      school: "Illusion",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "artificer",
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "druid",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "254",
      summary_basic: "Target turns invisible, ends if they attack or cast spell. Upcasting adds +1 target/level.",
      summary_expert: ""
    },
    {
      id: "spell_jims_glowing_coin",
      name: "Jim's Glowing Coin",
      level: 2,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "S, M",
      duration: "1 minute",
      classes: [
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "AI",
      page: "76",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_kinetic_jaunt",
      name: "Kinetic Jaunt",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "S",
      duration: "1 minute",
      classes: [
        "artificer",
        "bard",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "SCC",
      page: "37",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_knock",
      name: "Knock",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "bard",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "254",
      summary_basic: "Unlocks object, creates loud sound audible up to 300' away.",
      summary_expert: ""
    },
    {
      id: "spell_lesser_restoration",
      name: "Lesser Restoration",
      level: 2,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "bard",
        "cleric",
        "druid",
        "paladin",
        "ranger",
        "warlock",
        "sorcerer"
      ],
      source: "PHB",
      page: "255",
      summary_basic: "End one disease or condition (blinded, deafened, paralyzed, poisoned) afflicting the touched creature.",
      summary_expert: ""
    },
    {
      id: "spell_levitate",
      name: "Levitate",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "artificer",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "255",
      summary_basic: "Lift up to 500lbs 20' into the air. Move it up/down 20' on your turn. Con save prevents.",
      summary_expert: ""
    },
    {
      id: "spell_locate_animals_or_plants",
      name: "Locate Animals Or Plants",
      level: 2,
      school: "Divination",
      ritual: true,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "bard",
        "druid",
        "ranger"
      ],
      source: "PHB",
      page: "256",
      summary_basic: "Learn the direction or distance of the nearest specimen of a species of beast or plant within 5 miles.",
      summary_expert: ""
    },
    {
      id: "spell_locate_object",
      name: "Locate Object",
      level: 2,
      school: "Divination",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "bard",
        "cleric",
        "druid",
        "paladin",
        "ranger",
        "wizard",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "PHB",
      page: "256",
      summary_basic: "Sense the direction of an object within 1000' of you.",
      summary_expert: ""
    },
    {
      id: "spell_magic_mouth",
      name: "Magic Mouth",
      level: 2,
      school: "Illusion",
      ritual: true,
      concentration: false,
      casting_time: "1 minute",
      range: "30 feet",
      components: "V, S, M",
      duration: "Until dispel",
      classes: [
        "artificer",
        "bard",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "257",
      summary_basic: "On trigger, object speaks a message of 25 words or less. Can repeat, or end after a single speech.",
      summary_expert: ""
    },
    {
      id: "spell_magic_weapon",
      name: "Magic Weapon",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "touch",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "artificer",
        "paladin",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "257",
      summary_basic: "Weapon gains +1 bonus to attack and damage rolls. Upcasting allows you to increase bonus.",
      summary_expert: ""
    },
    {
      id: "spell_maximilians_earthen_grasp",
      name: "Maximilian'S Earthen Grasp",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "sorcerer",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "161",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_melfs_acid_arrow",
      name: "Melf'S Acid Arrow",
      level: 2,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "wizard",
        "druid",
        "fighter",
        "rogue",
        "artificer"
      ],
      source: "PHB",
      page: "259",
      summary_basic: "Attack deals 4d4 acid damage and 2d4 acid damage on the end of target's next turn. Miss halves initial damage and has no lasting damage. Upcasting adds +1d4 damage (both initial and later)/level.",
      summary_expert: ""
    },
    {
      id: "spell_mind_spike",
      name: "Mind Spike",
      level: 2,
      school: "Divination",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "S",
      duration: "1 hour",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "162",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_mirror_image",
      name: "Mirror Image",
      level: 2,
      school: "Illusion",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "artificer",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "druid",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "260",
      summary_basic: "Creates three illusory duplicates; if a duplicate is hit by an attack (but not other effects/damage), it is destroyed.",
      summary_expert: ""
    },
    {
      id: "spell_misty_step",
      name: "Misty Step",
      level: 2,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 bonus",
      range: "self",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "paladin",
        "sorcerer",
        "warlock",
        "wizard",
        "druid",
        "fighter",
        "ranger",
        "rogue"
      ],
      source: "PHB",
      page: "260",
      summary_basic: "Teleport 30'.",
      summary_expert: ""
    },
    {
      id: "spell_moonbeam",
      name: "Moonbeam",
      level: 2,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "cleric",
        "druid",
        "paladin"
      ],
      source: "PHB",
      page: "261",
      summary_basic: "Creates a 5' radius, 40' tall cylinder of pale light. Those inside take 2d10 radiant damage, Con save halves. Shapechangers make their save with disadvantage, and if they fail, are forced into original form. Upcasting adds +1d10 damage/level.",
      summary_expert: ""
    },
    {
      id: "spell_nystuls_magic_aura",
      name: "Nystul'S Magic Aura",
      level: 2,
      school: "Illusion",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "24 hour",
      classes: [
        "cleric",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "263",
      summary_basic: "Divination spells on target receive false information.",
      summary_expert: ""
    },
    {
      id: "spell_pass_without_trace",
      name: "Pass Without Trace",
      level: 2,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "druid",
        "ranger",
        "cleric",
        "monk"
      ],
      source: "PHB",
      page: "264",
      summary_basic: "+10 bonus to Stealth for you and allies within 30'.",
      summary_expert: ""
    },
    {
      id: "spell_phantasmal_force",
      name: "Phantasmal Force",
      level: 2,
      school: "Illusion",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "bard",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue",
        "warlock"
      ],
      source: "PHB",
      page: "264",
      summary_basic: "Creates an illusory object in a single target's mind. Int save prevents, and an action and Int (Investigation) check can reveal it. Otherwise, the target becomes irrationally convinced of the illusion's reality, and can take 1d6 psychic damage from it if it would harm it.",
      summary_expert: ""
    },
    {
      id: "spell_prayer_of_healing",
      name: "Prayer Of Healing",
      level: 2,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "10 minute",
      range: "30 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "paladin",
        "sorcerer"
      ],
      source: "PHB",
      page: "267",
      summary_basic: "Up to 6 creatures regain 2d8 + your spellcasting ability modifier health. Upcasting adds +1d8/level.",
      summary_expert: ""
    },
    {
      id: "spell_protection_from_poison",
      name: "Protection From Poison",
      level: 2,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "artificer",
        "cleric",
        "druid",
        "paladin",
        "ranger",
        "sorcerer"
      ],
      source: "PHB",
      page: "270",
      summary_basic: "Neutralizes one poison in the target, and gives advantage on saves against poisons and resistance to poison damage for the duration.",
      summary_expert: ""
    },
    {
      id: "spell_pyrotechnics",
      name: "Pyrotechnics",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "163",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_ray_of_enfeeblement",
      name: "Ray Of Enfeeblement",
      level: 2,
      school: "Necromancy",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "271",
      summary_basic: "On a successful hit, the target deals only half damage with weapon attacks that use Strength until the spell ends. At the end of its turn, it can make a Con save to try to end the spell.",
      summary_expert: ""
    },
    {
      id: "spell_rimes_binding_ice",
      name: "Rime'S Binding Ice",
      level: 2,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "S, M",
      duration: "Instantaneous",
      classes: [
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "FTD",
      page: "21",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_rope_trick",
      name: "Rope Trick",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "artificer",
        "wizard",
        "fighter",
        "ranger",
        "rogue"
      ],
      source: "PHB",
      page: "272",
      summary_basic: "Rope rises into the air, and at the top of its length is an invisible entrance to an extradimensional space you can rest in for the duration. Rope can be pulled up into the portal.",
      summary_expert: ""
    },
    {
      id: "spell_scorching_ray",
      name: "Scorching Ray",
      level: 2,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "wizard",
        "cleric",
        "druid",
        "fighter",
        "rogue",
        "warlock",
        "artificer"
      ],
      source: "PHB",
      page: "273",
      summary_basic: "Three rays deal 2d6 fire damage each, against one or more targets. Upcasting adds 1 ray/level.",
      summary_expert: ""
    },
    {
      id: "spell_see_invisibility",
      name: "See Invisibility",
      level: 2,
      school: "Divination",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "artificer",
        "bard",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "paladin",
        "rogue"
      ],
      source: "PHB",
      page: "274",
      summary_basic: "Lets you see invisible creatures and objects, and things in the Ethereal Plane.",
      summary_expert: ""
    },
    {
      id: "spell_shadow_blade",
      name: "Shadow Blade",
      level: 2,
      school: "Illusion",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "sorcerer",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "164",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_shatter",
      name: "Shatter",
      level: 2,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "rogue",
        "artificer"
      ],
      source: "PHB",
      page: "275",
      summary_basic: "All creatures in a 10' radius sphere take 3d8 thunder damage, Con save halves. Inorganic creatures have disadvantage on the save. Upcasting adds +1d8 damage/level.",
      summary_expert: ""
    },
    {
      id: "spell_silence",
      name: "Silence",
      level: 2,
      school: "Illusion",
      ritual: true,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "bard",
        "cleric",
        "druid",
        "ranger",
        "warlock",
        "monk",
        "sorcerer"
      ],
      source: "PHB",
      page: "275",
      summary_basic: "No sound can be created within or pass through a 20' radius sphere. Creatures inside are immune to thunder damage and deafened. Spells with verbal components cannot be cast.",
      summary_expert: ""
    },
    {
      id: "spell_skywrite",
      name: "Skywrite",
      level: 2,
      school: "Transmutation",
      ritual: true,
      concentration: true,
      casting_time: "1 action",
      range: "sight",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "165",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_snillocs_snowball_swarm",
      name: "Snilloc's Snowball Swarm",
      level: 2,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "165",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_spider_climb",
      name: "Spider Climb",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "artificer",
        "sorcerer",
        "warlock",
        "wizard",
        "druid",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "277",
      summary_basic: "Target can walk on vertical surfaces or upside down on ceilings at normal move speed.",
      summary_expert: ""
    },
    {
      id: "spell_spike_growth",
      name: "Spike Growth",
      level: 2,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "150 feet",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "druid",
        "ranger",
        "cleric",
        "warlock"
      ],
      source: "PHB",
      page: "277",
      summary_basic: "20' radius of grown sprouts camouflaged spikes and thorns. It becomes difficult terrain and inflicts 2d4 piercing damage per 5' someone travels within.",
      summary_expert: ""
    },
    {
      id: "spell_spiritual_weapon",
      name: "Spiritual Weapon",
      level: 2,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 bonus",
      range: "60 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "cleric",
        "paladin",
        "sorcerer"
      ],
      source: "PHB",
      page: "278",
      summary_basic: "Floating weapon deals 1d8 + spellcasting ability modifier force damage. Upcasting adds +1d8 damage.",
      summary_expert: ""
    },
    {
      id: "spell_spray_of_cards",
      name: "Spray of Cards",
      level: 2,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "15 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "BMT",
      page: "50",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_suggestion",
      name: "Suggestion",
      level: 2,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, M",
      duration: "8 hour",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "279",
      summary_basic: "Target must take some apparently-reasonable action you suggest, Wis save prevents.",
      summary_expert: ""
    },
    {
      id: "spell_summon_beast",
      name: "Summon Beast",
      level: 2,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [],
      source: "TCE",
      page: "109",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_tashas_mind_whip",
      name: "Tasha'S Mind Whip",
      level: 2,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "90 feet",
      components: "V",
      duration: "1 round",
      classes: [
        "sorcerer",
        "fighter",
        "rogue"
      ],
      source: "TCE",
      page: "115",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_vortex_warp",
      name: "Vortex Warp",
      level: 2,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "SCC",
      page: "38",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_warding_bond",
      name: "Warding Bond",
      level: 2,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "cleric",
        "paladin",
        "sorcerer",
        "artificer"
      ],
      source: "PHB",
      page: "287",
      summary_basic: "Target gains +1 AC and +1 to saves, and resistance to all damage. You take damage when the creature does. Ends if you are separated by more than 60' or reduced to 0 hit points.",
      summary_expert: ""
    },
    {
      id: "spell_warding_wind",
      name: "Warding Wind",
      level: 2,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V",
      duration: "10 minute",
      classes: [
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "170",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_warp_sense",
      name: "Warp Sense",
      level: 2,
      school: "Divination",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "SatO",
      page: "12",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_web",
      name: "Web",
      level: 2,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "artificer",
        "sorcerer",
        "wizard",
        "druid",
        "fighter",
        "ranger",
        "rogue"
      ],
      source: "PHB",
      page: "287",
      summary_basic: "Thick webbing fills 20' cube, restraining creatures inside. Dex save prevents. A creature restrained can make a Str save as an action to break free.",
      summary_expert: ""
    },
    {
      id: "spell_wither_and_bloom",
      name: "Wither and Bloom",
      level: 2,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "druid",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "SCC",
      page: "38",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_wristpocket",
      name: "Wristpocket",
      level: 2,
      school: "Conjuration",
      ritual: true,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "S",
      duration: "1 hour",
      classes: [
        "wizard"
      ],
      source: "EGW",
      page: "190",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_zone_of_truth",
      name: "Zone Of Truth",
      level: 2,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "bard",
        "cleric",
        "paladin",
        "ranger",
        "sorcerer"
      ],
      source: "PHB",
      page: "289",
      summary_basic: "Creatures inside the zone must make a Cha save; if they fail, they cannot speak a deliberate lie within the area, and you know if they succeeded/failed.",
      summary_expert: ""
    },
    {
      id: "spell_antagonize",
      name: "Antagonize",
      level: 3,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "BMT",
      page: "50",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_ashardalons_stride",
      name: "Ashardalon's Stride",
      level: 3,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "FTD",
      page: "19",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_aura_of_vitality",
      name: "Aura Of Vitality",
      level: 3,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V",
      duration: "1 minute",
      classes: [
        "druid",
        "paladin",
        "cleric",
        "sorcerer",
        "artificer"
      ],
      source: "PHB",
      page: "216",
      summary_basic: "30' aura where you can heal one creature 2d6 damage as a bonus action.",
      summary_expert: ""
    },
    {
      id: "spell_beacon_of_hope",
      name: "Beacon of Hope",
      level: 3,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "cleric",
        "paladin",
        "sorcerer"
      ],
      source: "PHB",
      page: "217",
      summary_basic: "Allies gain advantage on Wis and death saves, and gains maximum possible HP from any healing.",
      summary_expert: ""
    },
    {
      id: "spell_bestow_curse",
      name: "Bestow Curse",
      level: 3,
      school: "Necromancy",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "bard",
        "cleric",
        "paladin",
        "wizard",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "PHB",
      page: "218",
      summary_basic: "Curses touched target, inflicting one of: disadvantage on ability scores; disadvantage attacks against you; forcing Wis saves to act; or taking additional necrotic damage from your attacks. Upcasting increases duration and can remove concentration.",
      summary_expert: ""
    },
    {
      id: "spell_blight",
      name: "Blight",
      level: 4,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "druid",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "paladin",
        "rogue",
        "artificer"
      ],
      source: "PHB",
      page: "219",
      summary_basic: "8d8 necrotic damage to target, Con save halves. Upcasting increases damage by 1d8/level.",
      summary_expert: ""
    },
    {
      id: "spell_blinding_smite",
      name: "Blinding Smite",
      level: 3,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V",
      duration: "1 minute",
      classes: [
        "paladin"
      ],
      source: "PHB",
      page: "219",
      summary_basic: "Bonus 3d8 radiant damage to attack, target makes Con save or is blinded for duration.",
      summary_expert: ""
    },
    {
      id: "spell_blink",
      name: "Blink",
      level: 3,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "artificer",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "rogue",
        "warlock"
      ],
      source: "PHB",
      page: "219",
      summary_basic: "At the end of each turn, 50% chance of entering the Ethereal plane, returning within 10' at the start of your next turn.",
      summary_expert: ""
    },
    {
      id: "spell_clairvoyance",
      name: "Clairvoyance",
      level: 3,
      school: "Divination",
      ritual: false,
      concentration: true,
      casting_time: "10 minute",
      range: "1 miles",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "bard",
        "cleric",
        "sorcerer",
        "warlock",
        "wizard",
        "barbarian",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "222",
      summary_basic: "Creates an invisible sensor within a mile, which you can see or hear through for 10 minutes.",
      summary_expert: ""
    },
    {
      id: "spell_compo",
      name: "Compo",
      level: 3,
      school: "Illusion",
      ritual: false,
      concentration: false,
      casting_time: "",
      range: "\uE30F \uE30B \uE30B \uE30F 3 1 action 30 feet \uE30F \uE30B \uE314 \uE30B \uE30F 1 minute Self h ( e 1 m 0- i f s o p o h t e - r r e a ) dius \uE30F \uE30B \uE314 \uE30B \uE30F 1 action 120 feet \uE30F \uE30B \uE314 \uE30B \uE30F \uE30F \uE30B \uE30F \uE30B \uE30F \uE30B COMPO V NENTS Conce D n U tra R tio A n T , u I p O to N 1 hour \uE30F \uE30B \uE30B \uE30B \uE30F \uE30F COM V P , O S, N M ENTS DU 8 R h A o T ur IO s N \uE30F \uE30B \uE30B \uE30B \uE30F \uE30F COM V P , O S, N M ENTS Concen D tra U tio R n A , u T p t I o O 1 N 0 minutes \uE30F \uE30B \uE30B \uE30B \uE30F \uE30F \uE30F \uE30B \uE30F \uE30B \uE30F \uE30B F c d W A u a o s a t n i i m r n s H t d s g a h e i o g g a e e m e h s d w , p , e a u a i e r s t r n l h a w l L d t i s n e i e l C o o v l r l n h t a e a , a o n l s y r s f g o i a s : e 4 u d m W t h v h o a a a h r l s n s e e o a r t v n n a e v e e y g s i l n o i e o w s g u t r o i a t l c n h l h n i a i n r I c g s n o g e h t t w e c t e t h o r r s l , l e . i i p s y g a o s s e t y u p u n c r e c c h e l e a l i , y c n ou \uE30F \uE30B \uE30F \uE30B \uE30B \uE30B \uE077 \uE30B \uE30B \uE30F \uE30B \uE30F \uE30B \uE30F A A i r e n e n s t 1 m m d o 0 a s a e l - l i i f x n f c o r i y s y s o s o t s t t e u a t - a n l r l b a t c e e i d e a o a i d v n u a e a r s o r i i t y m u s n f m a o d r r o e a t b a n h i . d l e e a d d b u o o r m a v t e e i o y o n o f . u f T o a h r n c e d e s s p p e r ll ings \uE30F \uE30B \uE30F \uE30B \uE30B \uE30B \uE077 \uE30B \uE30B \uE30F \uE30B \uE30F \uE30B \uE30F A Y o f s c o e o o t b o h e m u it t e w p c o r c r f l i u v e t e fl b h i t a e s e e i e t i n b l c . e y e T l r t e a r h h e n p e e a g h i l i e m e , m i n a n a a o n c g g m d l e e u l e a d o a n p i f s n o p t a g s n e n s f a t o o o r h b r s u a j t n a t e h t d c i e s a s t , , n d s a s o u p m c r o l r a a e t e t r l t l i a g s o h t e , n a u a r t . r n t I e y h t d , o a s o u e n r e c a s m a o 2 n s m 0- e \uE30F \uE30B \uE30F \uE30B \uE30B \uE30B \uE077 \uE30B \uE30B \uE30F \uE30B \uE30F \uE30B \uE30F target one additional creature for each slot level 9 creatures of Medium size or smaller can fit temperature appropriate to the thing depicted. You above 3rd. The creatures must be within 30 feet inside the dome with you. The spell fails if its can't create sufficient heat or cold to cause damage, a of each other when you target them. \uE30B \uE30B \uE30B a c d r r o e e m a a t e i u n w r c e l h u s e . d n C e y r s e o a a u l t a c u r a r g s e e t s r t a h c n r is d e a s o p t b u e j r l e l e c c t o a s r n w m m i o t o h r v e in e t t t h h h a e r n o 9 ugh \uE30B \uE30B \uE30B s a a o c t u r r o n e g a d l t o l u o d r u y e d t , e o e ' r n s a o s t u s e m g n h e c t h ll o ) t . d h e a a t l m th ig u h n t d s e ic r k d e a n m a a c g r e e a o t r u d r e e a ( f l e ik n e \uE30B \uE30B \uE30B \uE30F \uE30B it freely. All other creatures and objects are \uE30F \uE30B As long as you are within",
      components: "",
      duration: ". The spell \uE30B number of hit points equal to twice the necrotic \uE30B using a spell slot of 4th level or higher, you can \uE30B \uE30B",
      classes: [
        "bard",
        "wizard"
      ],
      source: "",
      page: "",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_compulsion",
      name: "Compulsion",
      level: 4,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "bard",
        "paladin",
        "cleric"
      ],
      source: "PHB",
      page: "224",
      summary_basic: "Affected creatures must move horizontal from you, with a Wis save resisting.",
      summary_expert: ""
    },
    {
      id: "spell_conjure_animals",
      name: "Conjure Animals",
      level: 3,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "druid",
        "ranger"
      ],
      source: "PHB",
      page: "225",
      summary_basic: "Summons CR2 or less beasts that obey verbal commands. Upcasting allows you to summon more animals.",
      summary_expert: ""
    },
    {
      id: "spell_conjure_barrage",
      name: "Conjure Barrage",
      level: 3,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "ranger"
      ],
      source: "PHB",
      page: "225",
      summary_basic: "Duplicate thrown weapon/ammunition, with copies dealing 3d8 damage in a 60' cone, Dex save halves. Same damage type as thrown weapon/ammunition.",
      summary_expert: ""
    },
    {
      id: "spell_conjure_woodland_beings",
      name: "Conjure Woodland Beings",
      level: 4,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "druid",
        "ranger"
      ],
      source: "PHB",
      page: "226",
      summary_basic: "Summons CR2 or less fey that obey verbal commands. Upcasting lets you summon more fey creatures.",
      summary_expert: ""
    },
    {
      id: "spell_counterspell",
      name: "Counterspell",
      level: 3,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 reaction (which you take when you see a creature within 60 feet of you casting a spell)",
      range: "60 feet",
      components: "S",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "paladin",
        "rogue"
      ],
      source: "PHB",
      page: "228",
      summary_basic: "A creature casting a spell of 3rd level or lower automatically fails; if it is 4th or higher, make a DC 10 + [target spell level] Ability check instead. Upcast to raise the spell level for autosuccess.",
      summary_expert: ""
    },
    {
      id: "spell_create_food_and_water",
      name: "Create Food and Water",
      level: 3,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "cleric",
        "paladin",
        "druid",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "229",
      summary_basic: "Creates 45lbs of food and 30gal of water. Food lasts 24h unless eaten, water doesn't spoil.",
      summary_expert: ""
    },
    {
      id: "spell_crusaders_mantle",
      name: "Crusader'S Mantle",
      level: 3,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V",
      duration: "1 minute",
      classes: [
        "cleric",
        "paladin"
      ],
      source: "PHB",
      page: "230",
      summary_basic: "30' aura adds 1d4 radiant damage to all weapon attacks for duration.",
      summary_expert: ""
    },
    {
      id: "spell_daylight",
      name: "Daylight",
      level: 3,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "cleric",
        "druid",
        "paladin",
        "ranger",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "230",
      summary_basic: "Creates a 60' radius sphere of bright light, with an additional 60' of dim light. Dispels 3rd level or lower magical darkness.",
      summary_expert: ""
    },
    {
      id: "spell_dispel_magic",
      name: "Dispel Magic",
      level: 3,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "bard",
        "cleric",
        "druid",
        "paladin",
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "ranger",
        "rogue"
      ],
      source: "PHB",
      page: "234",
      summary_basic: "Cancels any spell of 3rd level or below on target creature, object, or magical effect. DC 10 + spell level check to dispel higher level. Upcasting auto-cancels higher level spells.",
      summary_expert: ""
    },
    {
      id: "spell_elemental_weapon",
      name: "Elemental Weapon",
      level: 3,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "artificer",
        "paladin",
        "cleric",
        "warlock"
      ],
      source: "PHB",
      page: "237",
      summary_basic: "Weapon has +1 to attack rolls and deals +1d4 acid/cold/fire/lightning/thunder (your choice) damage. Upcasting increases damage and bonus.",
      summary_expert: ""
    },
    {
      id: "spell_enemies_abound",
      name: "Enemies Abound",
      level: 3,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "sorcerer",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "155",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_erupting_earth",
      name: "Erupting Earth",
      level: 3,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "155",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_fast_friends",
      name: "Fast Friends",
      level: 3,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V",
      duration: "1 hour",
      classes: [
        "bard",
        "cleric",
        "wizard",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "AI",
      page: "75",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_fear",
      name: "Fear",
      level: 3,
      school: "Illusion",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "paladin",
        "ranger",
        "rogue"
      ],
      source: "PHB",
      page: "239",
      summary_basic: "Each creature in 30' cone drops what it's holding and becomes frightened. Wis saving throw prevents. Can flee, and can make a new Wis saving throw when it can no longer see you.",
      summary_expert: ""
    },
    {
      id: "spell_feign_death",
      name: "Feign Death",
      level: 3,
      school: "Necromancy",
      ritual: true,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "bard",
        "cleric",
        "druid",
        "wizard",
        "fighter",
        "rogue",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "240",
      summary_basic: "Willing creature appears dead for one hour.",
      summary_expert: ""
    },
    {
      id: "spell_fireball",
      name: "Fireball",
      level: 3,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "150 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "rogue",
        "warlock"
      ],
      source: "PHB",
      page: "241",
      summary_basic: "20' radius sphere deals 8d6 fire damage, Dex save halves. Upcasting adds +1d6 damage/level.",
      summary_expert: ""
    },
    {
      id: "spell_flame_arrows",
      name: "Flame Arrows",
      level: 3,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "156",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_fly",
      name: "Fly",
      level: 3,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "artificer",
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "243",
      summary_basic: "Target gains 60' flying speed. Upcasting adds +1 target/level.",
      summary_expert: ""
    },
    {
      id: "spell_galders_tower",
      name: "Galder's Tower",
      level: 3,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "10 minute",
      range: "30 feet",
      components: "V, S, M",
      duration: "24 hour",
      classes: [
        "wizard"
      ],
      source: "LLK",
      page: "57",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_gaseous_form",
      name: "Gaseous Form",
      level: 3,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "sorcerer",
        "warlock",
        "wizard",
        "druid",
        "fighter",
        "ranger",
        "rogue",
        "artificer"
      ],
      source: "PHB",
      page: "244",
      summary_basic: "Turns touched target into gas, granting 10' flying speed, resistance to nonmagical damage, advantage on Str/Dex/Con saves, and pass through narrow openings. Ends when they hit 0 hit points.",
      summary_expert: ""
    },
    {
      id: "spell_glyph_of_warding",
      name: "Glyph Of Warding",
      level: 3,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 hour",
      range: "touch",
      components: "V, S, M",
      duration: "Until dispel, trigger",
      classes: [
        "artificer",
        "bard",
        "cleric",
        "wizard",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "PHB",
      page: "245",
      summary_basic: "Places a hidden glyph on a surface or inside an openable object, which either erupts in 5d8 acid/cold/fire/lightning/thunder damage (your choice) that can be halved by a successful Dex save, or a 3rd level or lower spell. Upcasting grants +1d8 damage/level, or allows +1 spell level/level.",
      summary_expert: ""
    },
    {
      id: "spell_haste",
      name: "Haste",
      level: 3,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "artificer",
        "druid",
        "paladin",
        "ranger",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "250",
      summary_basic: "Target has doubled move speed, extra action, +2 AC, and advantage on Dex saves.",
      summary_expert: ""
    },
    {
      id: "spell_hunger_of_hadar",
      name: "Hunger of Hadar",
      level: 3,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "150 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "warlock",
        "sorcerer"
      ],
      source: "PHB",
      page: "251",
      summary_basic: "20' radius sphere creates total darkness, cacophonous whispering, deals 2d6 cold damage to those that start their turn there, and 2d6 acid damage to those that end their turn there. Dex save prevents acid damage.",
      summary_expert: ""
    },
    {
      id: "spell_hypnotic_pattern",
      name: "Hypnotic Pattern",
      level: 3,
      school: "Illusion",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "S, M",
      duration: "1 minute",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "paladin",
        "rogue",
        "artificer"
      ],
      source: "PHB",
      page: "252",
      summary_basic: "Targets incapacitated and speed of 0. Wis save stops. Ends if target attacked.",
      summary_expert: ""
    },
    {
      id: "spell_incite_greed",
      name: "Incite Greed",
      level: 3,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "cleric",
        "warlock",
        "wizard",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "AI",
      page: "76",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_intellect_fortress",
      name: "Intellect Fortress",
      level: 3,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V",
      duration: "1 hour",
      classes: [
        "artificer",
        "bard",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "TCE",
      page: "107",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_leomunds_tiny_hut",
      name: "Leomund'S Tiny Hut",
      level: 3,
      school: "Evocation",
      ritual: true,
      concentration: false,
      casting_time: "1 minute",
      range: "10 feet",
      components: "V, S, M",
      duration: "8 hour",
      classes: [
        "bard",
        "cleric",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "255",
      summary_basic: "10' radius immobile dome appears around you, providing protection from all outside, including spells or inclement weather.",
      summary_expert: ""
    },
    {
      id: "spell_life_transference",
      name: "Life Transference",
      level: 3,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "XGE",
      page: "160",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_lightning_arrow",
      name: "Lightning Arrow",
      level: 3,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "ranger"
      ],
      source: "PHB",
      page: "255",
      summary_basic: "Next ranged attack deals 4d8 lightning damage instead of normal, half damage on a miss. Those within 10' of target take 2d8 lightning damage, Dex save halves. Upcasting adds +1d8/level to both effects.",
      summary_expert: ""
    },
    {
      id: "spell_lightning_bolt",
      name: "Lightning Bolt",
      level: 3,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "100 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "warlock",
        "wizard",
        "druid",
        "fighter",
        "rogue",
        "artificer"
      ],
      source: "PHB",
      page: "255",
      summary_basic: "100'x5' line deals 8d6 lightning damage, Dex save halves. Upcasting adds +1d6 damage/level.",
      summary_expert: ""
    },
    {
      id: "spell_linked_glyphs",
      name: "Linked Glyphs",
      level: 3,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 hour",
      range: "touch",
      components: "V, S, M",
      duration: "Until dispel, trigger",
      classes: [
        "artificer",
        "bard",
        "cleric",
        "wizard"
      ],
      source: "AitFR-AVT",
      page: "9",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_magic_circle",
      name: "Magic Circle",
      level: 3,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "10 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "cleric",
        "paladin",
        "warlock",
        "wizard",
        "fighter",
        "ranger",
        "rogue",
        "sorcerer"
      ],
      source: "PHB",
      page: "256",
      summary_basic: "10' radius, 20' tall cylinder provides protection against one or more of celestials, elementals, fey, fiends, or undead. Can also cast in reverse to trap such beings inside. Upcasting increases duration by +1h/level.",
      summary_expert: ""
    },
    {
      id: "spell_major_image",
      name: "Major Image",
      level: 3,
      school: "Illusion",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "258",
      summary_basic: "Creates a convincing illusion that sounds, smells, looks, and has the warmth/cold of the real thing, in a 20' cube. Upcasting voids Concentration tag at 6th level.",
      summary_expert: ""
    },
    {
      id: "spell_mass_healing_word",
      name: "Mass Healing Word",
      level: 3,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 bonus",
      range: "60 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "bard",
        "cleric",
        "sorcerer",
        "artificer"
      ],
      source: "PHB",
      page: "258",
      summary_basic: "Heals up to 6 creatures by 1d4 + spellcasting ability modifier. Upcasting adds +1d4/level.",
      summary_expert: ""
    },
    {
      id: "spell_meld_into_stone",
      name: "Meld Into Stone",
      level: 3,
      school: "Transmutation",
      ritual: true,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "8 hour",
      classes: [
        "cleric",
        "druid",
        "ranger",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "259",
      summary_basic: "Step into stone object, completely hiding within it to all nonmagical senses.",
      summary_expert: ""
    },
    {
      id: "spell_melfs_minute_meteors",
      name: "Melf's Minute Meteors",
      level: 3,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "161",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_motivational_speech",
      name: "Motivational Speech",
      level: 3,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "60 feet",
      components: "V",
      duration: "1 hour",
      classes: [
        "bard",
        "cleric",
        "sorcerer"
      ],
      source: "AI",
      page: "77",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_phantom_steed",
      name: "Phantom Steed",
      level: 3,
      school: "Illusion",
      ritual: true,
      concentration: false,
      casting_time: "1 minute",
      range: "30 feet",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "wizard",
        "fighter",
        "rogue",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "265",
      summary_basic: "Creates a steed that can be ridden. Moves at 100'/10mph. Steed disappears if it takes damage.",
      summary_expert: ""
    },
    {
      id: "spell_plant_growth",
      name: "Plant Growth",
      level: 3,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action; 8 hour",
      range: "150 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "bard",
        "druid",
        "ranger",
        "warlock",
        "cleric",
        "paladin"
      ],
      source: "PHB",
      page: "266",
      summary_basic: "All normal plants in a 100' radius become thick and overgrown, quadrupling movement costs. Alternately, cast the spell over eight hours, doubling  harvests for the year.",
      summary_expert: ""
    },
    {
      id: "spell_protection_from_energy",
      name: "Protection From Energy",
      level: 3,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "artificer",
        "cleric",
        "druid",
        "ranger",
        "sorcerer",
        "wizard",
        "fighter",
        "paladin",
        "rogue"
      ],
      source: "PHB",
      page: "270",
      summary_basic: "Target gains resistance to your choice of acid, cold, fire, lightning, or thunder.",
      summary_expert: ""
    },
    {
      id: "spell_pulse_wave",
      name: "Pulse Wave",
      level: 3,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "wizard"
      ],
      source: "EGW",
      page: "188",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_remove_curse",
      name: "Remove Curse",
      level: 3,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "paladin",
        "warlock",
        "wizard",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "PHB",
      page: "271",
      summary_basic: "Removes curses affecting a creature or object, unless it is a cursed magic item, in which case it ends attunement.",
      summary_expert: ""
    },
    {
      id: "spell_revivify",
      name: "Revivify",
      level: 3,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "cleric",
        "paladin",
        "druid",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "272",
      summary_basic: "Creature that died within the last minute is returned to life with 1 hit point.",
      summary_expert: ""
    },
    {
      id: "spell_sending",
      name: "Sending",
      level: 3,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "unlimited",
      components: "V, S, M",
      duration: "1 round",
      classes: [
        "bard",
        "cleric",
        "warlock",
        "wizard",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "PHB",
      page: "274",
      summary_basic: "Send a message of 25 words or less to a creature you know, which is heard in their mind. Works across planes 95% of the time.",
      summary_expert: ""
    },
    {
      id: "spell_sleet_storm",
      name: "Sleet Storm",
      level: 3,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "150 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "druid",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "276",
      summary_basic: "Creates 40' radius region of sleet and freezing rain, creating difficult terrain and obscuring visibility. Can break concentration or knock creatures prone.",
      summary_expert: ""
    },
    {
      id: "spell_slow",
      name: "Slow",
      level: 3,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "sorcerer",
        "wizard",
        "cleric",
        "druid",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "277",
      summary_basic: "Up to 6 creatures in a 40' cube are slowed. Wis save prevents. Slow halves their movement speed, gives -2 to AC and Dex saves, stops reactions, and forces it to take either a bonus action or action, not both. Spells have a 50% chance to wait until the next round to finish, risking losing them altogether. At the end of its turn, can roll Wis save again to break slow.",
      summary_expert: ""
    },
    {
      id: "spell_speak_with_dead",
      name: "Speak with Dead",
      level: 3,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "10 feet",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "bard",
        "cleric",
        "fighter",
        "rogue",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "277",
      summary_basic: "Ask the corpse up to five questions, which it may answer as it likes.",
      summary_expert: ""
    },
    {
      id: "spell_speak_with_plants",
      name: "Speak with Plants",
      level: 3,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "bard",
        "druid",
        "ranger"
      ],
      source: "PHB",
      page: "277",
      summary_basic: "Plants within 30' have limited sentience and animation, letting them communicate with you and follow simple commands.",
      summary_expert: ""
    },
    {
      id: "spell_spirit_guardians",
      name: "Spirit Guardians",
      level: 3,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "15 feet",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "cleric",
        "paladin",
        "sorcerer"
      ],
      source: "PHB",
      page: "278",
      summary_basic: "Spirits protect you, impeding those within 15', halving their speed, and inflicting 3d8 radiant or necrotic (depending on your alignment) to those within radius. Wis save halves damage.",
      summary_expert: ""
    },
    {
      id: "spell_spirit_shroud",
      name: "Spirit Shroud",
      level: 3,
      school: "Necromancy",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "paladin",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "TCE",
      page: "108",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_stinking_cloud",
      name: "Stinking Cloud",
      level: 3,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "bard",
        "sorcerer",
        "wizard",
        "druid",
        "fighter",
        "rogue",
        "warlock"
      ],
      source: "PHB",
      page: "278",
      summary_basic: "20' radius sphere of nauseating gas forces creatures within to spend their action retching and reeling, Con save allows normal action.",
      summary_expert: ""
    },
    {
      id: "spell_summon_fey",
      name: "Summon Fey",
      level: 3,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "druid",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "TCE",
      page: "112",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_summon_lesser_demons",
      name: "Summon Lesser Demons",
      level: 3,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "warlock",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "167",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_summon_shadowspawn",
      name: "Summon Shadowspawn",
      level: 3,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "TCE",
      page: "113",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_summon_undead",
      name: "Summon Undead",
      level: 3,
      school: "Necromancy",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "TCE",
      page: "114",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_thunder_step",
      name: "Thunder Step",
      level: 3,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "90 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "warlock",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "168",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_tidal_wave",
      name: "Tidal Wave",
      level: 3,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "168",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_tiny_servant",
      name: "Tiny Servant",
      level: 3,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "touch",
      components: "V, S",
      duration: "8 hour",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "168",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_tongues",
      name: "Tongues",
      level: 3,
      school: "Divination",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, M",
      duration: "1 hour",
      classes: [
        "bard",
        "cleric",
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "283",
      summary_basic: "Touched creature understands any spoken language, and can be understood by any creature that knows at least one language.",
      summary_expert: ""
    },
    {
      id: "spell_vampiric_touch",
      name: "Vampiric Touch",
      level: 3,
      school: "Necromancy",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "cleric",
        "warlock",
        "wizard",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "PHB",
      page: "285",
      summary_basic: "Melee spell attack deals 3d6 necrotic damage and returns half the damage to you as healing; can attack again for duration. Upcasting increases damage by +1d6/level.",
      summary_expert: ""
    },
    {
      id: "spell_wall_of_sand",
      name: "Wall of Sand",
      level: 3,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "170",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_wall_of_water",
      name: "Wall Of Water",
      level: 3,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "sorcerer",
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "170",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_water_breathing",
      name: "Water Breathing",
      level: 3,
      school: "Transmutation",
      ritual: true,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "24 hour",
      classes: [
        "artificer",
        "druid",
        "ranger",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "287",
      summary_basic: "Up to 10 creatures can breathe underwater.",
      summary_expert: ""
    },
    {
      id: "spell_water_walk",
      name: "Water Walk",
      level: 3,
      school: "Transmutation",
      ritual: true,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "artificer",
        "cleric",
        "druid",
        "ranger",
        "sorcerer"
      ],
      source: "PHB",
      page: "287",
      summary_basic: "Up to 10 creatures can walk across surface of liquid, and (if submerged) resurface at 60'/round.",
      summary_expert: ""
    },
    {
      id: "spell_wind_wall",
      name: "Wind Wall",
      level: 3,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "druid",
        "ranger",
        "cleric",
        "warlock",
        "artificer"
      ],
      source: "PHB",
      page: "288",
      summary_basic: "Creates a wall of wind, which deals 3d8 bludgeoning damage to those caught within, Str halves. Small projectiles, flying humanoids, gasses, etc, can't pass through or are harmlessly diverted.",
      summary_expert: ""
    },
    {
      id: "spell_animate_objects",
      name: "Animate Objects",
      level: 5,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "artificer",
        "bard",
        "sorcerer",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "213",
      summary_basic: "Animates up to ten nonmagical objects. Upcast for +2 objects/level.",
      summary_expert: ""
    },
    {
      id: "spell_arcane_eye",
      name: "Arcane Eye",
      level: 4,
      school: "Divination",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "artificer",
        "wizard",
        "cleric",
        "fighter",
        "ranger",
        "rogue"
      ],
      source: "PHB",
      page: "214",
      summary_basic: "Creates an invisible magic eye that you can see through and sees within 30'.",
      summary_expert: ""
    },
    {
      id: "spell_aura_of_life",
      name: "Aura Of Life",
      level: 4,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V",
      duration: "10 minute",
      classes: [
        "druid",
        "paladin",
        "cleric",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "216",
      summary_basic: "30' aura provides resistance to necrotic damage, prevents max HP reduction, and heals living, nonhostile creatures to 1hp.",
      summary_expert: ""
    },
    {
      id: "spell_aura_of_purity",
      name: "Aura Of Purity",
      level: 4,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V",
      duration: "10 minute",
      classes: [
        "cleric",
        "paladin",
        "sorcerer",
        "artificer"
      ],
      source: "PHB",
      page: "216",
      summary_basic: "30' aura provides immunity to disease, resistance to poison damage, and advantage on saves against most conditions.",
      summary_expert: ""
    },
    {
      id: "spell_banishment",
      name: "Banishment",
      level: 4,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "cleric",
        "paladin",
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "ranger",
        "rogue"
      ],
      source: "PHB",
      page: "217",
      summary_basic: "Target must make a Cha save or be banished to its home plane (or a harmless demiplane if it's on its home plane). Upcasting increases the number of targets by 1/level.",
      summary_expert: ""
    },
    {
      id: "spell_charm_monster",
      name: "Charm Monster",
      level: 4,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "151",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_confusion",
      name: "Confusion",
      level: 4,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "bard",
        "druid",
        "paladin",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "224",
      summary_basic: "10' radius sphere become confused, taking random actions, unless they make a Wis save (repeats each round). Upcasting adds +5' radius/level.",
      summary_expert: ""
    },
    {
      id: "spell_conjure_minor_elementals",
      name: "Conjure Minor Elementals",
      level: 4,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 minute",
      range: "90 feet",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "druid",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "226",
      summary_basic: "Summons CR2 or less elementals that obey verbal commands. Upcasting allows you to summon more elementals.",
      summary_expert: ""
    },
    {
      id: "spell_control_water",
      name: "Control Water",
      level: 4,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "300 feet",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "cleric",
        "druid",
        "warlock",
        "wizard",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "PHB",
      page: "227",
      summary_basic: "Control up to 100'x100'x100' cube of water.",
      summary_expert: ""
    },
    {
      id: "spell_death_ward",
      name: "Death Ward",
      level: 4,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "8 hour",
      classes: [
        "cleric",
        "paladin",
        "sorcerer",
        "warlock",
        "artificer"
      ],
      source: "PHB",
      page: "230",
      summary_basic: "If the target would drop to 0 hit points due to damage, they instead drop to 1 hit point and the spell ends.",
      summary_expert: ""
    },
    {
      id: "spell_dimension_door",
      name: "Dimension Door",
      level: 4,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "500 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "paladin",
        "ranger",
        "rogue"
      ],
      source: "PHB",
      page: "233",
      summary_basic: "Teleport self, carried objects, one willing creature. Take 4d6 force damage and spell fails if you try to teleport into something.",
      summary_expert: ""
    },
    {
      id: "spell_divination",
      name: "Divination",
      level: 4,
      school: "Divination",
      ritual: true,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "wizard",
        "druid",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "PHB",
      page: "234",
      summary_basic: "Ask one question about something that will happen within 7 days. Repeated casts before a long rest cause risk of random results.",
      summary_expert: ""
    },
    {
      id: "spell_dominate_beast",
      name: "Dominate Beast",
      level: 4,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "cleric",
        "druid",
        "ranger",
        "sorcerer",
        "paladin",
        "warlock"
      ],
      source: "PHB",
      page: "234",
      summary_basic: "Charms a beast, letting you telepathically give it commands for the duration. Wis save prevents, and taking damage while charmed prompts a new Wis save. Upcasting increases duration.",
      summary_expert: ""
    },
    {
      id: "spell_evards_black_tentacles",
      name: "Evard'S Black Tentacles",
      level: 4,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "sorcerer",
        "wizard",
        "fighter",
        "rogue",
        "warlock"
      ],
      source: "PHB",
      page: "238",
      summary_basic: "20' region of writhing tentacles. People caught in the effect or who move through it must make a Dex save or be restrained and take 3d6 bludgeoning damage, repeating each round. Restrained creatures may spend their action to make a Str or Dex save (their choice) to escape.",
      summary_expert: ""
    },
    {
      id: "spell_fabricate",
      name: "Fabricate",
      level: 4,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "10 minute",
      range: "120 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "wizard",
        "cleric",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "239",
      summary_basic: "Turns raw material into a finished good, such as furniture from wood.",
      summary_expert: ""
    },
    {
      id: "spell_find_greater_steed",
      name: "Find Greater Steed",
      level: 4,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "10 minute",
      range: "30 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "paladin"
      ],
      source: "XGE",
      page: "156",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_fire_shield",
      name: "Fire Shield",
      level: 4,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "wizard",
        "cleric",
        "druid",
        "fighter",
        "rogue",
        "warlock",
        "artificer"
      ],
      source: "PHB",
      page: "242",
      summary_basic: "Lights 20' nearby, provides resistance to cold or fire damage (chosen at cast), and deals 2d8 fire/cold damage (opposite of resistance) to melee attackers within 5'.",
      summary_expert: ""
    },
    {
      id: "spell_freedom_of_movement",
      name: "Freedom Of Movement",
      level: 4,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "artificer",
        "bard",
        "cleric",
        "druid",
        "ranger",
        "paladin",
        "sorcerer"
      ],
      source: "PHB",
      page: "244",
      summary_basic: "Touched creature is unaffected by difficult terrain, or magical effects that reduce movement speed or cause it to be paralyzed or restrained.",
      summary_expert: ""
    },
    {
      id: "spell_galders_speedy_courier",
      name: "Galder's Speedy Courier",
      level: 4,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "10 feet",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "warlock",
        "wizard"
      ],
      source: "LLK",
      page: "57",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_gate_seal",
      name: "Gate Seal",
      level: 4,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "60 feet",
      components: "V, S, M",
      duration: "24 hour",
      classes: [
        "sorcerer",
        "warlock",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "SatO",
      page: "12",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_giant_insect",
      name: "Giant Insect",
      level: 4,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "druid"
      ],
      source: "PHB",
      page: "245",
      summary_basic: "Enlarges specimens of several species of arthropods when cast; the resulting creatures obey your verbal commands. Depending on species, may enlarge one or several with a single casting.",
      summary_expert: ""
    },
    {
      id: "spell_grasping_vine",
      name: "Grasping Vine",
      level: 4,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "30 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "druid",
        "ranger",
        "cleric"
      ],
      source: "PHB",
      page: "246",
      summary_basic: "Vine grabs a chosen creature within 30', pulling it 20' towards it (Dex save prevents), can be ordered to grab at same target or new as a bonus action each turn.",
      summary_expert: ""
    },
    {
      id: "spell_gravity_sinkhole",
      name: "Gravity Sinkhole",
      level: 4,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "wizard"
      ],
      source: "EGW",
      page: "187",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_greater_invisibility",
      name: "Greater Invisibility",
      level: 4,
      school: "Illusion",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "bard",
        "druid",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "fighter",
        "ranger",
        "rogue",
        "artificer"
      ],
      source: "PHB",
      page: "246",
      summary_basic: "Target becomes invisible.",
      summary_expert: ""
    },
    {
      id: "spell_guardian_of_faith",
      name: "Guardian Of Faith",
      level: 4,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V",
      duration: "8 hour",
      classes: [
        "cleric",
        "paladin",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "246",
      summary_basic: "Creates a Large spectral guardian. When a creature moves within 10' of it, it deals 20 radiant damage, Dex save halves. When it's dealt 60 damage total, it vanishes.",
      summary_expert: ""
    },
    {
      id: "spell_guardian_of_nature",
      name: "Guardian of Nature",
      level: 4,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V",
      duration: "1 minute",
      classes: [],
      source: "XGE",
      page: "157",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_hallucinatory_terrain",
      name: "Hallucinatory Terrain",
      level: 4,
      school: "Illusion",
      ritual: false,
      concentration: false,
      casting_time: "10 minute",
      range: "300 feet",
      components: "V, S, M",
      duration: "24 hour",
      classes: [
        "bard",
        "druid",
        "warlock",
        "wizard",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "PHB",
      page: "249",
      summary_basic: "150' cube of natural terrain appears entirely like a different sort of natural terrain.",
      summary_expert: ""
    },
    {
      id: "spell_ice_storm",
      name: "Ice Storm",
      level: 4,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "300 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "druid",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "paladin",
        "rogue",
        "artificer"
      ],
      source: "PHB",
      page: "252",
      summary_basic: "Each creature in 20' radius 40' height cylinder takes 4d6 cold damage and 2d8 bludgeoning damage, Dex save halves. Upcasting adds +1d8 bludgeoning damage.",
      summary_expert: ""
    },
    {
      id: "spell_leomunds_secret_chest",
      name: "Leomund'S Secret Chest",
      level: 4,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "cleric",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "254",
      summary_basic: "Hides a chest and its contents on the Ethereal Plane for up to 60 days safely. You can recall the chest back using a Tiny replica.",
      summary_expert: ""
    },
    {
      id: "spell_locate_creature",
      name: "Locate Creature",
      level: 4,
      school: "Divination",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "bard",
        "cleric",
        "druid",
        "paladin",
        "ranger",
        "wizard",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "PHB",
      page: "256",
      summary_basic: "Sense the direction of a creature within 1000' of you.",
      summary_expert: ""
    },
    {
      id: "spell_mordenkainens_faithful_hound",
      name: "Mordenkainen'S Faithful Hound",
      level: 4,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "8 hour",
      classes: [
        "artificer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "261",
      summary_basic: "Creates a invisible watchdog that sees invisible creatures, into the Ethereal plane, and ignores illusions. It barks when a creature comes within 30', and bites hostile creatures each turn, attacking and dealing 4d8 piercing damage.",
      summary_expert: ""
    },
    {
      id: "spell_mordenkainens_private_sanctum",
      name: "Mordenkainen'S Private Sanctum",
      level: 4,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "10 minute",
      range: "120 feet",
      components: "V, S, M",
      duration: "24 hour",
      classes: [
        "artificer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "262",
      summary_basic: "Cubic area up to 100' on a side becomes magically secure, protected from external sounds, vision through, divination spells, teleportation, and planar travelers. Upcasting increases the maximum size of the cube by +100'/level.",
      summary_expert: ""
    },
    {
      id: "spell_otilukes_resilient_sphere",
      name: "Otiluke's Resilient Sphere",
      level: 4,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "artificer",
        "wizard",
        "cleric",
        "fighter",
        "paladin",
        "rogue"
      ],
      source: "PHB",
      page: "264",
      summary_basic: "Impenetrable sphere surrounds creature or object of Large or smaller size, protecting it from everything. Dex save avoids being caught. Sphere can be rolled from inside at half normal speed, or moved from outside.",
      summary_expert: ""
    },
    {
      id: "spell_phantasmal_killer",
      name: "Phantasmal Killer",
      level: 4,
      school: "Illusion",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "warlock",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "265",
      summary_basic: "Target must make Wis save or be frightened. Thereafter, each turn, must make a Wis save or take 4d10 psychic damage, with a Wis save ending the effect. Upcasting adds +1d10 damage/level.",
      summary_expert: ""
    },
    {
      id: "spell_polymorph",
      name: "Polymorph",
      level: 4,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "bard",
        "cleric",
        "druid",
        "sorcerer",
        "wizard",
        "fighter",
        "rogue"
      ],
      source: "PHB",
      page: "266",
      summary_basic: "Target is transformed into a new shape with a CR equal to or less than its CR (or level). All stats are replaced, including current and maximum hit points. Unwilling targets may make a Wis save to prevent. Unwilling shapechangers cannot be targeted.",
      summary_expert: ""
    },
    {
      id: "spell_shadow_of_moil",
      name: "Shadow of Moil",
      level: 4,
      school: "Necromancy",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "1 minute",
      classes: [],
      source: "XGE",
      page: "164",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_sickening_radiance",
      name: "Sickening Radiance",
      level: 4,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "164",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_spirit_of_death",
      name: "Spirit of Death",
      level: 4,
      school: "Necromancy",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "BMT",
      page: "50",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_staggering_smite",
      name: "Staggering Smite",
      level: 4,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V",
      duration: "1 minute",
      classes: [
        "paladin",
        "warlock"
      ],
      source: "PHB",
      page: "278",
      summary_basic: "Next creature hit with a melee weapon attack takes 4d6 psychic damage and gets disadvantage on attack rolls and ability checks and cannot take reactions until the end of its next turn. Wis save cancels effect but not damage.",
      summary_expert: ""
    },
    {
      id: "spell_stone_shape",
      name: "Stone Shape",
      level: 4,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "cleric",
        "druid",
        "wizard",
        "fighter",
        "rogue",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "278",
      summary_basic: "Reshapes a Medium size stone object or 5' cube section of stone.",
      summary_expert: ""
    },
    {
      id: "spell_stoneskin",
      name: "Stoneskin",
      level: 4,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "artificer",
        "druid",
        "ranger",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "paladin",
        "rogue"
      ],
      source: "PHB",
      page: "278",
      summary_basic: "Willing creature has resistance to nonmagical bludgeoning, piercing, and slashing damage.",
      summary_expert: ""
    },
    {
      id: "spell_storm_sphere",
      name: "Storm Sphere",
      level: 4,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "150 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "166",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_summon_aberration",
      name: "Summon Aberration",
      level: 4,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "wizard",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "TCE",
      page: "109",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_summon_construct",
      name: "Summon Construct",
      level: 4,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "artificer",
        "fighter",
        "rogue",
        "sorcerer"
      ],
      source: "TCE",
      page: "111",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_summon_draconic_spirit",
      name: "Summon Draconic Spirit",
      level: 5,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "sorcerer"
      ],
      source: "FTD",
      page: "21",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_summon_elemental",
      name: "Summon Elemental",
      level: 4,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "druid",
        "ranger",
        "fighter",
        "rogue",
        "warlock"
      ],
      source: "TCE",
      page: "111",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_summon_greater_demon",
      name: "Summon Greater Demon",
      level: 4,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "166",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_vitriolic_sphere",
      name: "Vitriolic Sphere",
      level: 4,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "150 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "170",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_wall_of_fire",
      name: "Wall Of Fire",
      level: 4,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "artificer",
        "druid",
        "sorcerer",
        "wizard",
        "cleric",
        "fighter",
        "rogue",
        "warlock"
      ],
      source: "PHB",
      page: "285",
      summary_basic: "Fire wall deals 5d8 fire damage to those within. Dex save halves. Continues to damage those within and within 10' for 5d8 fire damage, no save. Upcasting adds +1d8 damage/level.",
      summary_expert: ""
    },
    {
      id: "spell_watery_sphere",
      name: "Watery Sphere",
      level: 4,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "fighter",
        "rogue"
      ],
      source: "XGE",
      page: "170",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_antilife_shell",
      name: "Antilife Shell",
      level: 5,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "10 feet",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "druid",
        "cleric",
        "warlock"
      ],
      source: "PHB",
      page: "213",
      summary_basic: "Living creatures cannot pass through 10' radius around you, in/out.",
      summary_expert: ""
    },
    {
      id: "spell_arcane_gate",
      name: "Arcane Gate",
      level: 6,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "500 feet",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "sorcerer",
        "warlock",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "214",
      summary_basic: "Create two portals that people can walk between.",
      summary_expert: ""
    },
    {
      id: "spell_awaken",
      name: "Awaken",
      level: 5,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "8 hour",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "bard",
        "druid"
      ],
      source: "PHB",
      page: "216",
      summary_basic: "Makes a dumb beast or plant Int 10 and positively inclined towards you.",
      summary_expert: ""
    },
    {
      id: "spell_banishing_smite",
      name: "Banishing Smite",
      level: 5,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V",
      duration: "1 minute",
      classes: [
        "artificer",
        "paladin",
        "warlock"
      ],
      source: "PHB",
      page: "216",
      summary_basic: "Next attack deals bonus 5d10 force damage, banishing it to its home plane (or a harmless demiplane if it's on its home plane).",
      summary_expert: ""
    },
    {
      id: "spell_bigbys_hand",
      name: "Bigby'S Hand",
      level: 5,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "artificer",
        "sorcerer",
        "warlock",
        "wizard"
      ],
      source: "PHB",
      page: "218",
      summary_basic: "Creates a giant hand that can grab, punch, block, and crush things. Upcasting increases the damage of the punch (force) and crushing (bludgeoning) options.",
      summary_expert: ""
    },
    {
      id: "spell_blade_barrier",
      name: "Blade Barrier",
      level: 6,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "cleric",
        "sorcerer"
      ],
      source: "PHB",
      page: "218",
      summary_basic: "Vertical wall of blades cuts creatures for 6d10 slashing damage; Dex save halves damage.",
      summary_expert: ""
    },
    {
      id: "spell_circle_of_death",
      name: "Circle Of Death",
      level: 6,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "150 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "warlock",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "221",
      summary_basic: "60' sphere which deals 8d6 necrotic damage, Con save halves. Upcasting increases damage by 2d6/level.",
      summary_expert: ""
    },
    {
      id: "spell_circle_of_power",
      name: "Circle of Power",
      level: 5,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V",
      duration: "10 minute",
      classes: [
        "paladin",
        "cleric"
      ],
      source: "PHB",
      page: "221",
      summary_basic: "30' aura provides advantage on saves against spells or magical effects, and half-damage on save becomes no damage on save.",
      summary_expert: ""
    },
    {
      id: "spell_cloudkill",
      name: "Cloudkill",
      level: 5,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "cleric",
        "sorcerer",
        "wizard",
        "druid",
        "paladin",
        "warlock",
        "artificer"
      ],
      source: "PHB",
      page: "222",
      summary_basic: "Creates a 20' radius fog which deals 5d8 poison damage, Con save halves. Upcasting increases damage by 1d8/level.",
      summary_expert: ""
    },
    {
      id: "spell_commune",
      name: "Commune",
      level: 5,
      school: "Divination",
      ritual: true,
      concentration: false,
      casting_time: "1 minute",
      range: "self",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "cleric",
        "paladin",
        "sorcerer"
      ],
      source: "PHB",
      page: "223",
      summary_basic: "Ask your god three yes-or-no questions.",
      summary_expert: ""
    },
    {
      id: "spell_commune_with_nature",
      name: "Commune with Nature",
      level: 5,
      school: "Divination",
      ritual: true,
      concentration: false,
      casting_time: "1 minute",
      range: "self",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "druid",
        "ranger",
        "barbarian",
        "paladin"
      ],
      source: "PHB",
      page: "224",
      summary_basic: "Gain awareness of the nearest 3 miles (300' underground), so long as those environs are natural.",
      summary_expert: ""
    },
    {
      id: "spell_cone_of_cold",
      name: "Cone Of Cold",
      level: 5,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "druid",
        "sorcerer",
        "warlock",
        "wizard",
        "artificer"
      ],
      source: "PHB",
      page: "224",
      summary_basic: "8d8 cold damage to targets in 60' cone, Con save halves damage. Upcasting adds 1d8 damage/level.",
      summary_expert: ""
    },
    {
      id: "spell_conjure_elemental",
      name: "Conjure Elemental",
      level: 5,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 minute",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "druid",
        "wizard"
      ],
      source: "PHB",
      page: "225",
      summary_basic: "Summons a CR5 or less elemental that obeys your verbal commands, and becomes hostile to you if your concentration is interrupted. Upcasting adds 1 CR to the cap/level.",
      summary_expert: ""
    },
    {
      id: "spell_conjure_volley",
      name: "Conjure Volley",
      level: 5,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "150 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "ranger"
      ],
      source: "PHB",
      page: "226",
      summary_basic: "Duplicate thrown weapon/ammunition, with copies dealing 8d8 damage in a 40' radius/20' height cylinder. Dex save halves. Same damage type as thrown weapon/ammunition.",
      summary_expert: ""
    },
    {
      id: "spell_contact_other_plane",
      name: "Contact Other Plane",
      level: 5,
      school: "Divination",
      ritual: true,
      concentration: false,
      casting_time: "1 minute",
      range: "self",
      components: "V",
      duration: "1 minute",
      classes: [
        "warlock",
        "wizard"
      ],
      source: "PHB",
      page: "226",
      summary_basic: "Ask a powerful being up to five questions, with one word answers. Make a DC 15 Int save or take 6d6 psychic damage and go insane until you take a long rest or have greater restoration cast on you.",
      summary_expert: ""
    },
    {
      id: "spell_contagion",
      name: "Contagion",
      level: 5,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "7 day",
      classes: [
        "cleric",
        "druid",
        "paladin",
        "warlock",
        "sorcerer"
      ],
      source: "PHB",
      page: "227",
      summary_basic: "Touched target is afflicted with one of several diseases; 3 succeeded Con saves clears the disease, and 3 failed Con saves lead to it lasting 7 days.",
      summary_expert: ""
    },
    {
      id: "spell_control_winds",
      name: "Control Winds",
      level: 5,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "300 feet",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "sorcerer"
      ],
      source: "XGE",
      page: "152",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_create_spelljamming_helm",
      name: "Create Spelljamming Helm",
      level: 5,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "wizard"
      ],
      source: "AAG",
      page: "22",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_creation",
      name: "Creation",
      level: 5,
      school: "Illusion",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "30 feet",
      components: "V, S, M",
      duration: "Special",
      classes: [
        "artificer",
        "sorcerer",
        "wizard",
        "cleric",
        "warlock"
      ],
      source: "PHB",
      page: "229",
      summary_basic: "Creates an object fitting in a 5' cube, duration based on quality of matter. Upcasting increases size of cube by 5'/level.",
      summary_expert: ""
    },
    {
      id: "spell_danse_macabre",
      name: "Danse Macabre",
      level: 5,
      school: "Necromancy",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "1 hour",
      classes: [],
      source: "XGE",
      page: "153",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_dawn",
      name: "Dawn",
      level: 5,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "wizard",
        "sorcerer"
      ],
      source: "XGE",
      page: "153",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_destructive_wave",
      name: "Destructive Wave",
      level: 5,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "paladin",
        "cleric"
      ],
      source: "PHB",
      page: "231",
      summary_basic: "Deals 5d6 thunder damage + 5d6 radiant/necrotic (caster's choice) damage in a 30' radius around yourself to those you pick, and knocks them prone. Con save for half damage, no effect.",
      summary_expert: ""
    },
    {
      id: "spell_dispel_evil_and_good",
      name: "Dispel Evil And Good",
      level: 5,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "cleric",
        "paladin",
        "sorcerer"
      ],
      source: "PHB",
      page: "233",
      summary_basic: "Celestials, elementals, fey, fiends, and undead have disadvantage on attack rolls. Can end to break charm/fright/possession from such beings on allies, or to try to banish (Cha save prevents) such beings back to their home plane.",
      summary_expert: ""
    },
    {
      id: "spell_dominate_person",
      name: "Dominate Person",
      level: 5,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "bard",
        "cleric",
        "sorcerer",
        "wizard",
        "paladin",
        "warlock"
      ],
      source: "PHB",
      page: "235",
      summary_basic: "Charms a humanoid, letting you telepathically give it commands for the duration. Wis save prevents, and taking damage while charmed prompts a new Wis save. Upcasting increases duration.",
      summary_expert: ""
    },
    {
      id: "spell_dream",
      name: "Dream",
      level: 5,
      school: "Illusion",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "special",
      components: "V, S, M",
      duration: "8 hour",
      classes: [
        "bard",
        "warlock",
        "wizard",
        "druid"
      ],
      source: "PHB",
      page: "236",
      summary_basic: "You or someone you touch enters the dream of a target on the same plane, letting them talk to them. If they appear monstrous, they can't say more than ten words, but the target must make a Wis save or take 3d6 psychic damage and lose any benefits of sleep.",
      summary_expert: ""
    },
    {
      id: "spell_enervation",
      name: "Enervation",
      level: 5,
      school: "Necromancy",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [],
      source: "XGE",
      page: "155",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_far_step",
      name: "Far Step",
      level: 5,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V",
      duration: "1 minute",
      classes: [
        "sorcerer"
      ],
      source: "XGE",
      page: "155",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_flame_strike",
      name: "Flame Strike",
      level: 5,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "druid",
        "warlock",
        "paladin",
        "sorcerer"
      ],
      source: "PHB",
      page: "242",
      summary_basic: "Deals 4d6 fire and 4d6 radiant damage in a 10' radius, 40' height cylinder, Dex save halves. Upcasting adds +1d6 damage/level.",
      summary_expert: ""
    },
    {
      id: "spell_geas",
      name: "Geas",
      level: 5,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "60 feet",
      components: "V",
      duration: "30 day",
      classes: [
        "bard",
        "cleric",
        "druid",
        "paladin",
        "wizard",
        "sorcerer"
      ],
      source: "PHB",
      page: "244",
      summary_basic: "Give a creature that can understand you a magical command, charming them. Acting against the command causes 5d10 psychic damage (once per day) for the duration. Wisdom save stops. Upcasting extends duration.",
      summary_expert: ""
    },
    {
      id: "spell_greater_restoration",
      name: "Greater Restoration",
      level: 5,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "artificer",
        "bard",
        "cleric",
        "druid",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "246",
      summary_basic: "Reduce exhaustion by one or cancel a single instance of a charm, petrification, curse, attunement to a cursed item, ability score reduction, or hit point maximum reduction.",
      summary_expert: ""
    },
    {
      id: "spell_hallow",
      name: "Hallow",
      level: 5,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "24 hour",
      range: "touch",
      components: "V, S, M",
      duration: "Until dispel",
      classes: [
        "cleric",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "249",
      summary_basic: "60' radius area is hallowed, stopping celestials, elementals, fey, fiends, and undead (can exclude creature types) from entering it or charming/frightening/possessing those within. Can also add one of several additional buffs that benefit those within the area.",
      summary_expert: ""
    },
    {
      id: "spell_hold_monster",
      name: "Hold Monster",
      level: 5,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "bard",
        "paladin",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric",
        "ranger"
      ],
      source: "PHB",
      page: "251",
      summary_basic: "Paralyzes non-undead target, Wis save ends, try again each turn. Upcasting adds +1 target/level.",
      summary_expert: ""
    },
    {
      id: "spell_holy_weapon",
      name: "Holy Weapon",
      level: 5,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "touch",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "paladin",
        "sorcerer"
      ],
      source: "XGE",
      page: "157",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_immolation",
      name: "Immolation",
      level: 5,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V",
      duration: "1 minute",
      classes: [
        "wizard"
      ],
      source: "XGE",
      page: "158",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_infernal_calling",
      name: "Infernal Calling",
      level: 5,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 minute",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "warlock"
      ],
      source: "XGE",
      page: "158",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_insect_plague",
      name: "Insect Plague",
      level: 5,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "300 feet",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "cleric",
        "druid",
        "sorcerer",
        "ranger"
      ],
      source: "PHB",
      page: "254",
      summary_basic: "20' radius sphere deals 4d10 piercing damage to those inside, Con save halves. +1d10 damage/level.",
      summary_expert: ""
    },
    {
      id: "spell_legend_lore",
      name: "Legend Lore",
      level: 5,
      school: "Divination",
      ritual: false,
      concentration: false,
      casting_time: "10 minute",
      range: "self",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "bard",
        "cleric",
        "wizard",
        "sorcerer",
        "warlock"
      ],
      source: "PHB",
      page: "254",
      summary_basic: "Gives accurate information about a named or described legendary person, place, or object.",
      summary_expert: ""
    },
    {
      id: "spell_maelstrom",
      name: "Maelstrom",
      level: 5,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "druid"
      ],
      source: "XGE",
      page: "160",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_mass_cure_wounds",
      name: "Mass Cure Wounds",
      level: 5,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "bard",
        "cleric",
        "druid",
        "sorcerer",
        "artificer"
      ],
      source: "PHB",
      page: "258",
      summary_basic: "Up to 6 creatures in a 30' radius heal 3d8 + spellcasting ability modifier. Upcasting increases by +1d8/level.",
      summary_expert: ""
    },
    {
      id: "spell_mislead",
      name: "Mislead",
      level: 5,
      school: "Illusion",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "S",
      duration: "1 hour",
      classes: [
        "bard",
        "wizard",
        "cleric",
        "ranger",
        "sorcerer"
      ],
      source: "PHB",
      page: "260",
      summary_basic: "Become invisible and create illusory double; invisibility ends on attack, and double does what you wish. You can see through double as a bonus action instead of own senses.",
      summary_expert: ""
    },
    {
      id: "spell_modify_memory",
      name: "Modify Memory",
      level: 5,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "bard",
        "cleric",
        "wizard"
      ],
      source: "PHB",
      page: "261",
      summary_basic: "Charms targeted creature, incapacitating it and making it unaware of its surroundings. Wis save prevents, and advantage on save if you are fighting it. While incapacitated, creature can have memories within 24h adjusted by you talking to it. Upcasting increases maximum age of memory affected.",
      summary_expert: ""
    },
    {
      id: "spell_negative_energy_flood",
      name: "Negative Energy Flood",
      level: 5,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, M",
      duration: "Instantaneous",
      classes: [
        "warlock"
      ],
      source: "XGE",
      page: "163",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_passwall",
      name: "Passwall",
      level: 5,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "wizard",
        "druid",
        "artificer"
      ],
      source: "PHB",
      page: "264",
      summary_basic: "Creates an up to 20' deep passage through a wall, ceiling, or floor.",
      summary_expert: ""
    },
    {
      id: "spell_planar_binding",
      name: "Planar Binding",
      level: 5,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 hour",
      range: "60 feet",
      components: "V, S, M",
      duration: "24 hour",
      classes: [
        "bard",
        "cleric",
        "druid",
        "wizard",
        "sorcerer"
      ],
      source: "PHB",
      page: "265",
      summary_basic: "Binds a celestial, elemental, fey, or fiend into your service for  the duration. Cha save at end of casting prevents. Upcasting increases the duration.",
      summary_expert: ""
    },
    {
      id: "spell_raise_dead",
      name: "Raise Dead",
      level: 5,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 hour",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "bard",
        "cleric",
        "paladin",
        "sorcerer",
        "artificer"
      ],
      source: "PHB",
      page: "270",
      summary_basic: "Brings back a dead person who hasn't been dead for longer than ten days.",
      summary_expert: ""
    },
    {
      id: "spell_rarys_telepathic_bond",
      name: "Rary'S Telepathic Bond",
      level: 5,
      school: "Divination",
      ritual: true,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "cleric",
        "wizard",
        "sorcerer"
      ],
      source: "PHB",
      page: "270",
      summary_basic: "Allows up to eight willing creatures to communicate telepathically through the bond, without range limit.",
      summary_expert: ""
    },
    {
      id: "spell_reincarnate",
      name: "Reincarnate",
      level: 5,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 hour",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "druid"
      ],
      source: "PHB",
      page: "271",
      summary_basic: "Target deceased humanoid that has been dead no longer than ten days enters a new body, probably of a different race.",
      summary_expert: ""
    },
    {
      id: "spell_scrying",
      name: "Scrying",
      level: 5,
      school: "Divination",
      ritual: false,
      concentration: true,
      casting_time: "10 minute",
      range: "self",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "bard",
        "cleric",
        "druid",
        "paladin",
        "warlock",
        "wizard",
        "sorcerer"
      ],
      source: "PHB",
      page: "273",
      summary_basic: "Lets you see and hear a particular creature on the same plane of existence. Wis save prevents for next 24 hours.",
      summary_expert: ""
    },
    {
      id: "spell_seeming",
      name: "Seeming",
      level: 5,
      school: "Illusion",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "8 hour",
      classes: [
        "bard",
        "ranger",
        "sorcerer",
        "wizard",
        "warlock"
      ],
      source: "PHB",
      page: "274",
      summary_basic: "Any number of creatures in range are given a new, illusory appearance. Cha save prevents.",
      summary_expert: ""
    },
    {
      id: "spell_skill_empowerment",
      name: "Skill Empowerment",
      level: 5,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "bard"
      ],
      source: "XGE",
      page: "165",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_steel_wind_strike",
      name: "Steel Wind Strike",
      level: 5,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "S, M",
      duration: "Instantaneous",
      classes: [],
      source: "XGE",
      page: "166",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_summon_celestial",
      name: "Summon Celestial",
      level: 5,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "sorcerer"
      ],
      source: "TCE",
      page: "110",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_swift_quiver",
      name: "Swift Quiver",
      level: 5,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "touch",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "ranger"
      ],
      source: "PHB",
      page: "279",
      summary_basic: "Creates endless ammunition and lets you make two attacks with that ammunition as a bonus action.",
      summary_expert: ""
    },
    {
      id: "spell_synaptic_static",
      name: "Synaptic Static",
      level: 5,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "wizard"
      ],
      source: "XGE",
      page: "167",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_telekinesis",
      name: "Telekinesis",
      level: 5,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "sorcerer",
        "warlock",
        "wizard",
        "fighter"
      ],
      source: "PHB",
      page: "280",
      summary_basic: "For duration of spell can move a Huge or smaller creature, or a 1000lbs or less object, switching targets as you wish.",
      summary_expert: ""
    },
    {
      id: "spell_teleportation_circle",
      name: "Teleportation Circle",
      level: 5,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "10 feet",
      components: "V, M",
      duration: "1 round",
      classes: [
        "bard",
        "cleric",
        "ranger",
        "sorcerer",
        "warlock",
        "wizard"
      ],
      source: "PHB",
      page: "282",
      summary_basic: "10' diameter circle teleports you to a known permanent teleportation circle. It can create a permanent teleportation circle by casting on a specific location every day for a year.",
      summary_expert: ""
    },
    {
      id: "spell_temporal_shunt",
      name: "Temporal Shunt",
      level: 5,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 reaction (taken when a creature you can see makes an attack roll or starts to cast a spell)",
      range: "120 feet",
      components: "V, S",
      duration: "1 round",
      classes: [
        "wizard"
      ],
      source: "EGW",
      page: "189",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_transmute_rock",
      name: "Transmute Rock",
      level: 5,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "Until dispel",
      classes: [
        "artificer",
        "druid"
      ],
      source: "XGE",
      page: "169",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_tree_stride",
      name: "Tree Stride",
      level: 5,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "druid",
        "ranger",
        "cleric",
        "paladin"
      ],
      source: "PHB",
      page: "283",
      summary_basic: "Allows you to teleport between trees of the same kind within 500' of each other.",
      summary_expert: ""
    },
    {
      id: "spell_wall_of_force",
      name: "Wall Of Force",
      level: 5,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "artificer",
        "wizard",
        "paladin",
        "sorcerer"
      ],
      source: "PHB",
      page: "285",
      summary_basic: "Creates an impenetrable wall that stops things from physically passing through and extends into the Ethereal Plane. Dispel magic doesn't work, but disintegrate does.",
      summary_expert: ""
    },
    {
      id: "spell_wall_of_light",
      name: "Wall Of Light",
      level: 5,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "sorcerer",
        "warlock",
        "wizard"
      ],
      source: "XGE",
      page: "170",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_wall_of_stone",
      name: "Wall of Stone",
      level: 5,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "artificer",
        "druid",
        "sorcerer",
        "wizard",
        "warlock"
      ],
      source: "PHB",
      page: "287",
      summary_basic: "Creates a wall of stone that can trap people. If concentration is maintained the whole duration, it becomes permanent.",
      summary_expert: ""
    },
    {
      id: "spell_wrath_of_nature",
      name: "Wrath of Nature",
      level: 5,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [],
      source: "XGE",
      page: "171",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_bones_of_the_earth",
      name: "Bones of the Earth",
      level: 6,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [],
      source: "XGE",
      page: "150",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_chain_lightning",
      name: "Chain Lightning",
      level: 6,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "150 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "221",
      summary_basic: "Lightning hits one target, then up to 3 additional targets within 30' of them. 10d8 lightning damage, half on Dex save. Upcasting provides an extra secondary target/level.",
      summary_expert: ""
    },
    {
      id: "spell_conjure_fey",
      name: "Conjure Fey",
      level: 6,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 minute",
      range: "90 feet",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "druid",
        "warlock"
      ],
      source: "PHB",
      page: "226",
      summary_basic: "Summons a CR6 or less fey or CR 6 or less beast that obeys verbal commands, and becomes hostile to you if your concentration is interrupted. Upcasting adds 1 CR to the cap/level.",
      summary_expert: ""
    },
    {
      id: "spell_contingency",
      name: "Contingency",
      level: 6,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "10 minute",
      range: "self",
      components: "V, S, M",
      duration: "10 day",
      classes: [
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "227",
      summary_basic: "Cast a 5th spell or lower with a 1 action casting time that targets you, but it is activated on a predefined trigger within the next ten days. Can only have one contingency at a time.",
      summary_expert: ""
    },
    {
      id: "spell_create_homunculus",
      name: "Create Homunculus",
      level: 6,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 hour",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "wizard",
        "cleric"
      ],
      source: "XGE",
      page: "152",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_create_undead",
      name: "Create Undead",
      level: 6,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "10 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "warlock",
        "wizard",
        "sorcerer"
      ],
      source: "PHB",
      page: "229",
      summary_basic: "Raises up to three ghouls, which obey your orders for 24h unless spell is recast. Upcasting increases number of undead and allows better undead.",
      summary_expert: ""
    },
    {
      id: "spell_disintegrate",
      name: "Disintegrate",
      level: 6,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "233",
      summary_basic: "Deals 10d6 + 40 force damage, disintegrates if reduced to 0, Dex save prevents all damage. Instantly disintegrates Large or smaller nonmagical objects/obstacles/creations of magical force, or a 10'x10'x10' cube of larger such things. Upcasting adds 3d6 damage/level.",
      summary_expert: ""
    },
    {
      id: "spell_divine_word",
      name: "Divine Word",
      level: 7,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 bonus",
      range: "30 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "sorcerer"
      ],
      source: "PHB",
      page: "234",
      summary_basic: "Creatures that can hear you suffer increasing negative effects (starting with deafening, adding blinding, then stunning, then killing) based on current hit points, if they fail a Cha save. Celestials, elementals, fey, and fiends are forced back to their home plane if they fail their save, regardless of current hit points.",
      summary_expert: ""
    },
    {
      id: "spell_drawmijs_instant_summons",
      name: "Drawmij's Instant Summons",
      level: 6,
      school: "Conjuration",
      ritual: true,
      concentration: false,
      casting_time: "1 minute",
      range: "touch",
      components: "V, S, M",
      duration: "Until dispel",
      classes: [
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "235",
      summary_basic: "Leaves a mark on an object 10lbs or less. You can consume the material component of this spell to summon it to your side instantly, if it is not held or carried by someone.",
      summary_expert: ""
    },
    {
      id: "spell_dream_of_the_blue_veil",
      name: "Dream Of The Blue Veil",
      level: 7,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "10 minute",
      range: "20 feet",
      components: "V, S, M",
      duration: "6 hour",
      classes: [
        "bard",
        "cleric"
      ],
      source: "TCE",
      page: "106",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_druid_grove",
      name: "Druid Grove",
      level: 6,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "10 minute",
      range: "touch",
      components: "V, S, M",
      duration: "24 hour",
      classes: [
        "druid"
      ],
      source: "XGE",
      page: "154",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_eyebite",
      name: "Eyebite",
      level: 6,
      school: "Necromancy",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "238",
      summary_basic: "While active, can send a single creature within 60' to sleep, into a panic, or sicken it. Can apply to a new creature each round. A successful Wis save stops effect and provides immunity for the duration.",
      summary_expert: ""
    },
    {
      id: "spell_find_the_path",
      name: "Find the Path",
      level: 6,
      school: "Divination",
      ritual: false,
      concentration: true,
      casting_time: "1 minute",
      range: "self",
      components: "V, S, M",
      duration: "1 day",
      classes: [
        "bard",
        "cleric",
        "druid",
        "sorcerer"
      ],
      source: "PHB",
      page: "240",
      summary_basic: "Finds the shortest route to a location you know on the same plane as you.",
      summary_expert: ""
    },
    {
      id: "spell_fizbans_platinum_shield",
      name: "Fizban's Platinum Shield",
      level: 6,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "cleric"
      ],
      source: "FTD",
      page: "20",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_flesh_to_stone",
      name: "Flesh to Stone",
      level: 6,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "warlock",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "243",
      summary_basic: "Target begins turning to stone, causing it to be restrained; Con save prevents. If restrained, makes Con save each turn, and if it fails three times before succeeding three times, it is petrified; if you keep up concentration until duration ends, the transformation is permanent.",
      summary_expert: ""
    },
    {
      id: "spell_forbiddance",
      name: "Forbiddance",
      level: 6,
      school: "Abjuration",
      ritual: true,
      concentration: false,
      casting_time: "10 minute",
      range: "touch",
      components: "V, S, M",
      duration: "1 day",
      classes: [
        "cleric",
        "sorcerer"
      ],
      source: "PHB",
      page: "243",
      summary_basic: "40,000 sqft of space (and 30' up) is warded against teleportation, planar travel, etc. It can also deal 5d10 radiant/necrotic (your choice on casting) damage to celestials, elementals, fey, fiends, and/or undead (your choice on casting) who enter or start their turn in the area.",
      summary_expert: ""
    },
    {
      id: "spell_globe_of_invulnerability",
      name: "Globe of Invulnerability",
      level: 6,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "10 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "sorcerer",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "245",
      summary_basic: "Immobile 10' radius barrier surrounds you, preventing 5th level or lower spells from affecting those inside. Upcasting increases level of spells affected, +1 level/level.",
      summary_expert: ""
    },
    {
      id: "spell_gravity_fissure",
      name: "Gravity Fissure",
      level: 6,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "100 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "wizard"
      ],
      source: "EGW",
      page: "187",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_guards_and_wards",
      name: "Guards And Wards",
      level: 6,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "10 minute",
      range: "touch",
      components: "V, S, M",
      duration: "24 hour",
      classes: [
        "bard",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "248",
      summary_basic: "Ward protects 2500 sqft of floor space, creating a variety of effects within the area.",
      summary_expert: ""
    },
    {
      id: "spell_harm",
      name: "Harm",
      level: 6,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "sorcerer"
      ],
      source: "PHB",
      page: "249",
      summary_basic: "Deals 14d6 necrotic damage, Con save halves. Damage can't reduce HP below 1, but maximum HP are reduced for 1h by the damage taken. Effects which remove disease also work on the lost temporary HP.",
      summary_expert: ""
    },
    {
      id: "spell_heal",
      name: "Heal",
      level: 6,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "druid",
        "sorcerer"
      ],
      source: "PHB",
      page: "250",
      summary_basic: "Target regains 70 hp and is cured of blindness, deafness, and any diseases. Upcasting grants +10 hp/level.",
      summary_expert: ""
    },
    {
      id: "spell_heroes_feast",
      name: "Heroes' Feast",
      level: 6,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "10 minute",
      range: "30 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "druid",
        "sorcerer"
      ],
      source: "PHB",
      page: "250",
      summary_basic: "Summons a feast. After spending an hour eating, those who partake are cured of all diseases and poisons. They also become immune to poison, gain advantage on Wis saves, and gain 2d10 hit point maximum/healing for the next 24 hours.",
      summary_expert: ""
    },
    {
      id: "spell_investiture_of_flame",
      name: "Investiture Of Flame",
      level: 6,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "sorcerer",
        "warlock",
        "cleric"
      ],
      source: "XGE",
      page: "159",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_investiture_of_ice",
      name: "Investiture Of Ice",
      level: 6,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "wizard",
        "cleric"
      ],
      source: "XGE",
      page: "159",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_investiture_of_stone",
      name: "Investiture of Stone",
      level: 6,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "cleric"
      ],
      source: "XGE",
      page: "159",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_investiture_of_wind",
      name: "Investiture Of Wind",
      level: 6,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "warlock",
        "cleric"
      ],
      source: "XGE",
      page: "160",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_magic_jar",
      name: "Magic Jar",
      level: 6,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "self",
      components: "V, S, M",
      duration: "Until dispel",
      classes: [
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "257",
      summary_basic: "Moves your soul into a container, from which you can possess people if they are within 100' and fail a Cha save.",
      summary_expert: ""
    },
    {
      id: "spell_mass_suggestion",
      name: "Mass Suggestion",
      level: 6,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, M",
      duration: "24 hour",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "258",
      summary_basic: "Up to twelve creatures obey your reasonable-sounding suggestion. Wis save prevents. Upcasting increases duration.",
      summary_expert: ""
    },
    {
      id: "spell_mental_prison",
      name: "Mental Prison",
      level: 6,
      school: "Illusion",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "S",
      duration: "1 minute",
      classes: [
        "sorcerer",
        "cleric"
      ],
      source: "XGE",
      page: "161",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_mirage_arcane",
      name: "Mirage Arcane",
      level: 7,
      school: "Illusion",
      ritual: false,
      concentration: false,
      casting_time: "10 minute",
      range: "sight",
      components: "V, S",
      duration: "10 day",
      classes: [
        "bard",
        "druid",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "260",
      summary_basic: "Terrain in up to 1 mile square looks, sounds, smells, and feels like a different terrain.",
      summary_expert: ""
    },
    {
      id: "spell_move_earth",
      name: "Move Earth",
      level: 6,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "2 hour",
      classes: [
        "druid",
        "sorcerer",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "263",
      summary_basic: "In upwards of a 40'x40'x40' area, slowly reshape terrain. Can change area targeted once every ten minutes.",
      summary_expert: ""
    },
    {
      id: "spell_nondetection",
      name: "Nondetection",
      level: 3,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "8 hour",
      classes: [
        "bard",
        "ranger",
        "wizard",
        "cleric",
        "fighter",
        "paladin",
        "rogue"
      ],
      source: "PHB",
      page: "263",
      summary_basic: "Target creature, place, or object can't be targeted or perceived by divination or magical scrying.",
      summary_expert: ""
    },
    {
      id: "spell_otilukes_freezing_sphere",
      name: "Otiluke'S Freezing Sphere",
      level: 6,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "300 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "263",
      summary_basic: "Globe explodes in frost in 60' radius sphere and deals 10d6 cold damage, Con save halves. Globe can be thrown/slung normally by self or other, but only lasts 1 minute before exploding otherwise. Upcasting adds +1d6 damage/level.",
      summary_expert: ""
    },
    {
      id: "spell_ottos_irresistible_dance",
      name: "Otto'S Irresistible Dance",
      level: 6,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V",
      duration: "1 minute",
      classes: [
        "bard",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "264",
      summary_basic: "Targeted creature uses all movement to dance, giving it disadvantage on Dex saves and attack rolls, and giving others advantage on attacks against it. As an action, Wis save ends.",
      summary_expert: ""
    },
    {
      id: "spell_planar_ally",
      name: "Planar Ally",
      level: 6,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "10 minute",
      range: "60 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "sorcerer"
      ],
      source: "PHB",
      page: "265",
      summary_basic: "Calls upon a powerful otherworldly entity, which sends a celestial, elemental, or fiend to aid you. You are expected to offer some sort of payment in exchange for services.",
      summary_expert: ""
    },
    {
      id: "spell_primordial_ward",
      name: "Primordial Ward",
      level: 6,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "1 minute",
      classes: [],
      source: "XGE",
      page: "163",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_programmed_illusion",
      name: "Programmed Illusion",
      level: 6,
      school: "Illusion",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "Until dispel",
      classes: [
        "bard",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "269",
      summary_basic: "Creates an illusory object, creature, or other visible phenomenon that activates when a specific condition occurs, playing up to a five minute performance. Resets after ten minutes of dormancy.",
      summary_expert: ""
    },
    {
      id: "spell_scatter",
      name: "Scatter",
      level: 6,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "30 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "cleric"
      ],
      source: "XGE",
      page: "164",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_soul_cage",
      name: "Soul Cage",
      level: 6,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 reaction (which you take when a humanoid you can see within 60 feet of you dies)",
      range: "60 feet",
      components: "V, S, M",
      duration: "8 hour",
      classes: [
        "warlock",
        "cleric"
      ],
      source: "XGE",
      page: "165",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_summon_fiend",
      name: "Summon Fiend",
      level: 6,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "cleric"
      ],
      source: "TCE",
      page: "112",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_sunbeam",
      name: "Sunbeam",
      level: 6,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "druid",
        "sorcerer",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "279",
      summary_basic: "60' line inflicts 6d8 radiant damage and blinds, Con save halves. Can change direction of line as your action.",
      summary_expert: ""
    },
    {
      id: "spell_tashas_otherworldly_guise",
      name: "Tasha's Otherworldly Guise",
      level: 6,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "cleric"
      ],
      source: "TCE",
      page: "116",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_tensers_transformation",
      name: "Tenser's Transformation",
      level: 6,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "cleric"
      ],
      source: "XGE",
      page: "168",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_transport_via_plants",
      name: "Transport via Plants",
      level: 6,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "10 feet",
      components: "V, S",
      duration: "1 round",
      classes: [
        "druid"
      ],
      source: "PHB",
      page: "283",
      summary_basic: "Allows people to teleport via a Large or larger inanimate plant to another plant you have seen or touched for the duration.",
      summary_expert: ""
    },
    {
      id: "spell_true_seeing",
      name: "True Seeing",
      level: 6,
      school: "Divination",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "bard",
        "cleric",
        "sorcerer",
        "warlock",
        "wizard"
      ],
      source: "PHB",
      page: "284",
      summary_basic: "Grants target truesight, secret door detection, and ability to see into Ethereal Plane for 120'.",
      summary_expert: ""
    },
    {
      id: "spell_wall_of_ice",
      name: "Wall Of Ice",
      level: 6,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "285",
      summary_basic: "Creates a wall of ice on a solid surface, dealing 10d6 cold damage to those caught inside, Dex save halves. Can be destroyed. Moving through the frigid air means you take 5d6 cold damage, Con save halves. Upcasting increases the damage by +2d6 for initial, +1d6 for later/level.",
      summary_expert: ""
    },
    {
      id: "spell_wall_of_thorns",
      name: "Wall of Thorns",
      level: 6,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "druid"
      ],
      source: "PHB",
      page: "287",
      summary_basic: "Creates a wall of thorns that deals 7d8 piercing to those trapped inside, Dex save halves. Creatures can move through, but movement speed is one fourth and the creature takes 7d8 slashing damage, Dex save halves. Upcasting increases both types of damage by +1d8/level.",
      summary_expert: ""
    },
    {
      id: "spell_wind_walk",
      name: "Wind Walk",
      level: 6,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "30 feet",
      components: "V, S, M",
      duration: "8 hour",
      classes: [
        "druid"
      ],
      source: "PHB",
      page: "288",
      summary_basic: "You and up to ten creatures take on a gaseous form, which grants a flying speed of 300' and resistance to damage from nonmagical weapons, but can't take actions other than move, Dash, and revert to its original form.",
      summary_expert: ""
    },
    {
      id: "spell_word_of_recall",
      name: "Word of Recall",
      level: 6,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "5 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "sorcerer"
      ],
      source: "PHB",
      page: "289",
      summary_basic: "You and up to five willing creatures teleport to a previously designated sanctuary such as a temple to your deity.",
      summary_expert: ""
    },
    {
      id: "spell_abi_dalzims_horrid_wilting",
      name: "Abi-Dalzim'S Horrid Wilting",
      level: 8,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "150 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "wizard",
        "cleric"
      ],
      source: "XGE",
      page: "150",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_animal_shapes",
      name: "Animal Shapes",
      level: 8,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S",
      duration: "24 hour",
      classes: [
        "druid"
      ],
      source: "PHB",
      page: "212",
      summary_basic: "Transforms willing targets within range into CR 4- Large or smaller beasts.",
      summary_expert: ""
    },
    {
      id: "spell_conjure_celestial",
      name: "Conjure Celestial",
      level: 7,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 minute",
      range: "90 feet",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "cleric",
        "sorcerer"
      ],
      source: "PHB",
      page: "225",
      summary_basic: "Summons a CR4 or less celestial that obeys verbal commands that don't conflict with its alignment. Upcasting at 9th level allows a CR5 or less celestial.",
      summary_expert: ""
    },
    {
      id: "spell_create_magen",
      name: "Create Magen",
      level: 7,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 hour",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "wizard",
        "cleric"
      ],
      source: "IDRotF",
      page: "318",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_crown_of_stars",
      name: "Crown of Stars",
      level: 7,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "cleric"
      ],
      source: "XGE",
      page: "152",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_delayed_blast_fireball",
      name: "Delayed Blast Fireball",
      level: 7,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "150 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "sorcerer",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "230",
      summary_basic: "Creates an undetonated fireball that deals 12d6 fire damage in a 20' radius, +1d6 per round it isn't detonated, Dex save halves. Explodes after 1 minute/10 rounds, or when concentration is broken. Upcasting adds +1d6 base damage/level.",
      summary_expert: ""
    },
    {
      id: "spell_draconic_transformation",
      name: "Draconic Transformation",
      level: 7,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "self",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "cleric"
      ],
      source: "FTD",
      page: "19",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_ents_du",
      name: "Ents Du",
      level: 7,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "",
      range: "\uE30F \uE30B \uE30B \uE30F 7 CAS 1 T m IN in G u t T e IME R 30 A 0 N fe G e E t \uE30F \uE30F \uE30B \uE314 \uE30B \uE30B \uE30F CAS 1 T m IN in G u t T e IME R 30 A 0 N fe G e E t \uE30F \uE30F \uE30B \uE314 \uE30B \uE30B \uE30F 1 action 60 feet \uE30F \uE30F \uE30B \uE314 \uE30B \uE30B \uE30F \uE30B \uE30F \uE30B \uE30F",
      components: "",
      duration: "\uE30B \uE30F COM V P , O S, N M ENTS DU 24 R h A o T u I r O s N \uE30F \uE30F \uE30B \uE30B \uE30B \uE30F COM V P , O S, N M ENTS DU 24 R h A o T u I r O s N",
      classes: [
        "bard",
        "cleric",
        "wizard"
      ],
      source: "",
      page: "",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_etherealness",
      name: "Etherealness",
      level: 7,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V, S",
      duration: "8 hour",
      classes: [
        "bard",
        "cleric",
        "sorcerer",
        "warlock",
        "wizard"
      ],
      source: "PHB",
      page: "238",
      summary_basic: "Enter the Border Ethereal until you leave. You can see, but not interact with, the material plane up to 60', and otherwise move in all directions. Upcasting lets you bring +2/+5 willing creatures/level with you.",
      summary_expert: ""
    },
    {
      id: "spell_finger_of_death",
      name: "Finger Of Death",
      level: 7,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "warlock",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "241",
      summary_basic: "Target takes 7d8+30 necrotic damage, Con save halves. Humanoids killed this way rise as a zombie under your permanent command.",
      summary_expert: ""
    },
    {
      id: "spell_fire_storm",
      name: "Fire Storm",
      level: 7,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "150 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "druid",
        "sorcerer"
      ],
      source: "PHB",
      page: "242",
      summary_basic: "Creates an area of ten 10' cubes, which deal 7d10 fire damage to all within, Dex save halves.",
      summary_expert: ""
    },
    {
      id: "spell_forcecage",
      name: "Forcecage",
      level: 7,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "100 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "bard",
        "warlock",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "243",
      summary_basic: "An immobile, invisible prison surrounds up to 20'x20'x20' cage, or 10'x10'x10' for a completely sealed box. Creatures inside can't escape without magic, and escaping with magic requires a Cha save. Immune to dispel magic.",
      summary_expert: ""
    },
    {
      id: "spell_mordenkainens_magnificent_mansion",
      name: "Mordenkainen's Magnificent Mansion",
      level: 7,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "300 feet",
      components: "V, S, M",
      duration: "24 hour",
      classes: [
        "bard",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "261",
      summary_basic: "Creates an elaborate extradimensional dwelling, with a 5'x10' entrance, which you can open or close while within 30'. It has 100 people's worth of food and 100 near-transparent servants.",
      summary_expert: ""
    },
    {
      id: "spell_mordenkainens_sword",
      name: "Mordenkainen's Sword",
      level: 7,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "bard",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "262",
      summary_basic: "Sword-shaped plane of force deals 3d10 force damage, can be moved 20' as a bonus action to attack again.",
      summary_expert: ""
    },
    {
      id: "spell_nathairs_mischief",
      name: "Nathair'S Mischief",
      level: 2,
      school: "Illusion",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "S, M",
      duration: "1 minute",
      classes: [
        "sorcerer",
        "fighter",
        "rogue"
      ],
      source: "FTD",
      page: "20",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_plane_shift",
      name: "Plane Shift",
      level: 7,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "druid",
        "sorcerer",
        "warlock",
        "wizard"
      ],
      source: "PHB",
      page: "266",
      summary_basic: "You and eight others are transported to another plane of your choice. Can be used as a melee spell attack, Cha save prevents.",
      summary_expert: ""
    },
    {
      id: "spell_power_word_pain",
      name: "Power Word Pain",
      level: 7,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "wizard",
        "cleric"
      ],
      source: "XGE",
      page: "163",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_prismatic_spray",
      name: "Prismatic Spray",
      level: 7,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "bard",
        "sorcerer",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "267",
      summary_basic: "Targets in a 60' cone are struck by magical multicolored rays of light, typically dealing 10d6 damage of a random type. Dex save halves damage.",
      summary_expert: ""
    },
    {
      id: "spell_project_image",
      name: "Project Image",
      level: 7,
      school: "Illusion",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "500 miles",
      components: "V, S, M",
      duration: "1 day",
      classes: [
        "bard",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "270",
      summary_basic: "Illusory copy of yourself created within range, which can move and act at your command. Can see through its senses or yours, but not both.",
      summary_expert: ""
    },
    {
      id: "spell_regenerate",
      name: "Regenerate",
      level: 7,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "touch",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "bard",
        "cleric",
        "druid",
        "sorcerer"
      ],
      source: "PHB",
      page: "271",
      summary_basic: "Target regains 4d8 + 15 hit points, and recovers 1 hit point per turn, and regenerates severed extremities after two minutes.",
      summary_expert: ""
    },
    {
      id: "spell_resurrection",
      name: "Resurrection",
      level: 7,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 hour",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "bard",
        "cleric",
        "sorcerer"
      ],
      source: "PHB",
      page: "272",
      summary_basic: "Dead creature that did not die of old age and died within the past century is brought back to life.",
      summary_expert: ""
    },
    {
      id: "spell_reverse_gravity",
      name: "Reverse Gravity",
      level: 7,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "100 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "druid",
        "sorcerer",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "272",
      summary_basic: "50' radius 100' cylinder has reversed gravity.",
      summary_expert: ""
    },
    {
      id: "spell_sequester",
      name: "Sequester",
      level: 7,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S, M",
      duration: "Until dispel",
      classes: [
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "274",
      summary_basic: "Touched target becomes invisible, impossible to target or perceive by divination. Target also falls into a state of suspended animation until the spell ends. You may set a special condition for it ending.",
      summary_expert: ""
    },
    {
      id: "spell_simulacrum",
      name: "Simulacrum",
      level: 7,
      school: "Illusion",
      ritual: false,
      concentration: false,
      casting_time: "12 hour",
      range: "touch",
      components: "V, S, M",
      duration: "Until dispel",
      classes: [
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "276",
      summary_basic: "Illusory duplicate has no equipment and half health, but otherwise same game stats as base creature. It is friendly and obeys your spoken commands, but cannot learn or regain spell slots. Casting again kills current duplicates.",
      summary_expert: ""
    },
    {
      id: "spell_symbol",
      name: "Symbol",
      level: 7,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "touch",
      components: "V, S, M",
      duration: "Until dispel, trigger",
      classes: [
        "bard",
        "cleric",
        "druid",
        "wizard",
        "sorcerer"
      ],
      source: "PHB",
      page: "280",
      summary_basic: "Harmful glyph inflicts one of a variety of effects within a 60' radius sphere for 10 minutes when triggered.",
      summary_expert: ""
    },
    {
      id: "spell_teleport",
      name: "Teleport",
      level: 7,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "10 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "bard",
        "sorcerer",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "281",
      summary_basic: "Instantly transports you and up to eight other willing creatures to a destination you know on the same plane of existence.",
      summary_expert: ""
    },
    {
      id: "spell_temple_of_the_gods",
      name: "Temple Of The Gods",
      level: 7,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 hour",
      range: "120 feet",
      components: "V, S, M",
      duration: "24 hour",
      classes: [
        "cleric",
        "sorcerer"
      ],
      source: "XGE",
      page: "167",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_tether_essence",
      name: "Tether Essence",
      level: 7,
      school: "Necromancy",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "wizard"
      ],
      source: "EGW",
      page: "189",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_whirlwind",
      name: "Whirlwind",
      level: 7,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "300 feet",
      components: "V, M",
      duration: "1 minute",
      classes: [
        "cleric"
      ],
      source: "XGE",
      page: "171",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_antimagic_field",
      name: "Antimagic Field",
      level: 8,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "10 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "cleric",
        "wizard",
        "sorcerer"
      ],
      source: "PHB",
      page: "213",
      summary_basic: "All magic ceases to function within a 10' radius of you.",
      summary_expert: ""
    },
    {
      id: "spell_antipathy",
      name: "Antipathy",
      level: 8,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "",
      range: "\uE30F \uE30B \uE30B \uE30F 8 1 action 60 feet \uE30F \uE30B \uE314 \uE30B \uE30F 1 hour 60 feet \uE30F \uE30B \uE314 \uE30B \uE30F 1 hour 60 feet \uE30F \uE30B \uE314 \uE30B \uE30F \uE30F \uE30B",
      components: "",
      duration: "\uE30F \uE30B",
      classes: [
        "bard"
      ],
      source: "",
      page: "",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_antipathy_sympathy",
      name: "Antipathy/Sympathy",
      level: 8,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 hour",
      range: "60 feet",
      components: "V, S, M",
      duration: "10 day",
      classes: [
        "druid",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "214",
      summary_basic: "An enchanted object or area attracts or repels creatures of a particular type.",
      summary_expert: ""
    },
    {
      id: "spell_astral_projection",
      name: "Astral Projection",
      level: 9,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 hour",
      range: "10 feet",
      components: "V, S, M",
      duration: "Special",
      classes: [
        "cleric",
        "monk",
        "warlock",
        "wizard",
        "sorcerer"
      ],
      source: "PHB",
      page: "215",
      summary_basic: "Project yourself and up to eight creatures into the Astral Plane.",
      summary_expert: ""
    },
    {
      id: "spell_blade_of_disaster",
      name: "Blade Of Disaster",
      level: 9,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 bonus",
      range: "60 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "sorcerer",
        "cleric"
      ],
      source: "TCE",
      page: "106",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_clone",
      name: "Clone",
      level: 8,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 hour",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "222",
      summary_basic: "Creates a clone, with the process finishing after 120 days. If the original dies, their soul inhabits the new body, effectively resurrecting them immediately.",
      summary_expert: ""
    },
    {
      id: "spell_control_weather",
      name: "Control Weather",
      level: 8,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "10 minute",
      range: "5 miles",
      components: "V, S, M",
      duration: "8 hour",
      classes: [
        "cleric",
        "druid",
        "wizard",
        "sorcerer"
      ],
      source: "PHB",
      page: "228",
      summary_basic: "Changes weather conditions within a 5mi radius.",
      summary_expert: ""
    },
    {
      id: "spell_dark_star",
      name: "Dark Star",
      level: 8,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "150 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "wizard"
      ],
      source: "EGW",
      page: "186",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_demiplane",
      name: "Demiplane",
      level: 8,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "S",
      duration: "1 hour",
      classes: [
        "warlock",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "231",
      summary_basic: "Creates a door to a demiplane, a 30'x30'x30' empty room; the door lasts an hour, but the demiplane exists indefinitely. You can open a new door to the same demiplane, a new one, or one another caster made that you know about.",
      summary_expert: ""
    },
    {
      id: "spell_dominate_monster",
      name: "Dominate Monster",
      level: 8,
      school: "Enchantment",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "1 hour",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "235",
      summary_basic: "Charms a creature, letting you telepathically give it commands for the duration. Wis save prevents, and taking damage while charmed prompts a new Wis save. Upcasting increases duration.",
      summary_expert: ""
    },
    {
      id: "spell_earthquake",
      name: "Earthquake",
      level: 8,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "500 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "cleric",
        "druid",
        "sorcerer"
      ],
      source: "PHB",
      page: "236",
      summary_basic: "Shaking ground creates 100' radius difficult terrain, and breaks Concentration without a Con save. Each round, creatures in region must make Dex save or be knocked prone. Knocks down structures and creates fissures at DM's discretion.",
      summary_expert: ""
    },
    {
      id: "spell_feeblemind",
      name: "Feeblemind",
      level: 8,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "150 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "bard",
        "druid",
        "warlock",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "239",
      summary_basic: "Target takes 4d6 psychic damage. It must also make an Int save or have Int and Cha set to 1, and lose the ability to activate magic items, cast spells, understand language, or communicate. Can attempt Int save again once every 30 days to clear the effect.",
      summary_expert: ""
    },
    {
      id: "spell_glibness",
      name: "Glibness",
      level: 8,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V",
      duration: "1 hour",
      classes: [
        "bard",
        "warlock"
      ],
      source: "PHB",
      page: "245",
      summary_basic: "Replace any rolled Charisma check with a 15, and overpowers truth-telling magic.",
      summary_expert: ""
    },
    {
      id: "spell_holy_aura",
      name: "Holy Aura",
      level: 8,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "cleric",
        "sorcerer"
      ],
      source: "PHB",
      page: "251",
      summary_basic: "Creatures you choose within 30' of you gain advantage on all saves, and other creatures have disadvantage on attacks against them. Additionally, fiends and undead that attack an affected creature are blinded unless they make a Con save.",
      summary_expert: ""
    },
    {
      id: "spell_illusory_dragon",
      name: "Illusory Dragon",
      level: 8,
      school: "Illusion",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "S",
      duration: "1 minute",
      classes: [
        "cleric"
      ],
      source: "XGE",
      page: "157",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_incendiary_cloud",
      name: "Incendiary Cloud",
      level: 8,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "150 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "sorcerer",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "253",
      summary_basic: "20' radius sphere deals 10d8 fire damage to those inside, Dex save halves. Moves 10' away from you each turn.",
      summary_expert: ""
    },
    {
      id: "spell_maddening_darkness",
      name: "Maddening Darkness",
      level: 8,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "150 feet",
      components: "V, M",
      duration: "10 minute",
      classes: [
        "cleric"
      ],
      source: "XGE",
      page: "160",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_maze",
      name: "Maze",
      level: 8,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "258",
      summary_basic: "Tosses creature into a labyrinthine demiplane, which they can only escape by making a DC 20 Int check as an action.",
      summary_expert: ""
    },
    {
      id: "spell_mighty_fortress",
      name: "Mighty Fortress",
      level: 8,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "1 miles",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "wizard",
        "cleric"
      ],
      source: "XGE",
      page: "161",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_mind_blank",
      name: "Mind Blank",
      level: 8,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "24 hour",
      classes: [
        "bard",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "259",
      summary_basic: "Touched creature is immune to psychic damage, emotion or thought-detecting effects, divination in general, and the charmed condition.",
      summary_expert: ""
    },
    {
      id: "spell_power_word_stun",
      name: "Power Word Stun",
      level: 8,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "267",
      summary_basic: "Target creature with fewer than 150 hit points is stunned. Repeatable Con save at end of its turn ends this effect.",
      summary_expert: ""
    },
    {
      id: "spell_reality_break",
      name: "Reality Break",
      level: 8,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "wizard"
      ],
      source: "EGW",
      page: "189",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_sunburst",
      name: "Sunburst",
      level: 8,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "150 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "druid",
        "sorcerer",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "279",
      summary_basic: "Deals 12d6 radiant damage and blinds within a 60' radius. Con save halves and prevents blinding. Blinded creatures can make fresh Con saves at the end of their turns to clear blindness.",
      summary_expert: ""
    },
    {
      id: "spell_telepathy",
      name: "Telepathy",
      level: 8,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "unlimited",
      components: "V, S, M",
      duration: "24 hour",
      classes: [
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "281",
      summary_basic: "Creates a telepathic link between you and another creature on the same plane.",
      summary_expert: ""
    },
    {
      id: "spell_tsunami",
      name: "Tsunami",
      level: 8,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 minute",
      range: "sight",
      components: "V, S",
      duration: "6 round",
      classes: [
        "druid"
      ],
      source: "PHB",
      page: "284",
      summary_basic: "300'x300'x50' wall of water, which deals 6d10 bludgeoning damage to those within its area at creation, Str save halves. Wall moves away 50'/round, losing 50' of height/round and dealing 5d10 bludgeoning damage (reducing 1d10/round) to those struck, Str save prevents damage.",
      summary_expert: ""
    },
    {
      id: "spell_foresight",
      name: "Foresight",
      level: 9,
      school: "Divination",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "touch",
      components: "V, S, M",
      duration: "8 hour",
      classes: [
        "bard",
        "druid",
        "warlock",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "244",
      summary_basic: "Touched creature cannot be surprised, has advantage on attack rolls, ability checks, and saving throws; other creatures have disadvantage on attack rolls for duration. Can only be active on one creature at a time.",
      summary_expert: ""
    },
    {
      id: "spell_gate",
      name: "Gate",
      level: 9,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "cleric",
        "sorcerer",
        "warlock",
        "wizard"
      ],
      source: "PHB",
      page: "244",
      summary_basic: "Creates a 5' to 20' diameter portal to another plane. Can target a creature on another plane whose name you know.",
      summary_expert: ""
    },
    {
      id: "spell_imprisonment",
      name: "Imprisonment",
      level: 9,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 minute",
      range: "30 feet",
      components: "V, S, M",
      duration: "Until dispel",
      classes: [
        "warlock",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "252",
      summary_basic: "Target is magically imprisoned in a manner you choose, making them impossible to perceive or locate by divination, and immune to hunger, thirst, asphyxiation, and age. A successful Wis save grants permanent immunity. You can specify a condition that will cause the spell to end and release the target.",
      summary_expert: ""
    },
    {
      id: "spell_invulnerability",
      name: "Invulnerability",
      level: 9,
      school: "Abjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "10 minute",
      classes: [
        "cleric"
      ],
      source: "XGE",
      page: "160",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_mass_heal",
      name: "Mass Heal",
      level: 9,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "sorcerer"
      ],
      source: "PHB",
      page: "258",
      summary_basic: "Restores up to 700 hit points across any creatures within range. Creatures healed are cured of all diseases and blindness and deafness.",
      summary_expert: ""
    },
    {
      id: "spell_mass_polymorph",
      name: "Mass Polymorph",
      level: 9,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "wizard",
        "cleric"
      ],
      source: "XGE",
      page: "160",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_meteor_swarm",
      name: "Meteor Swarm",
      level: 9,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "1 miles",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "259",
      summary_basic: "Creates four 40' radius spheres, all creatures within take 20d6 fire and 20d6 bludgeoning damage, Dex save halves.",
      summary_expert: ""
    },
    {
      id: "spell_power_word_heal",
      name: "Power Word Heal",
      level: 9,
      school: "Evocation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "touch",
      components: "V, S",
      duration: "Instantaneous",
      classes: [
        "bard",
        "cleric",
        "sorcerer"
      ],
      source: "PHB",
      page: "266",
      summary_basic: "Target regains all hit points, and stops being charmed, frightened, paralyzed, or stunned.",
      summary_expert: ""
    },
    {
      id: "spell_power_word_kill",
      name: "Power Word Kill",
      level: 9,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "bard",
        "sorcerer",
        "warlock",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "266",
      summary_basic: "Target creature with less than 100 hit points instantly dies.",
      summary_expert: ""
    },
    {
      id: "spell_prismatic_wall",
      name: "Prismatic Wall",
      level: 9,
      school: "Abjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "60 feet",
      components: "V, S",
      duration: "10 minute",
      classes: [
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "267",
      summary_basic: "90'x30' wall or 30' sphere briefly blinds those within 20' (Con save halves), and those who pass through it take up to 50d6 damage of various types, Dex save halves 10d6 each time, and are restrained and blinded, unless they have begun breaking down the wall other ways. You can designate yourself and allies as immune to these effect.",
      summary_expert: ""
    },
    {
      id: "spell_psychic_scream",
      name: "Psychic Scream",
      level: 9,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "90 feet",
      components: "S",
      duration: "Instantaneous",
      classes: [
        "bard",
        "cleric"
      ],
      source: "XGE",
      page: "163",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_raulothims_psychic_lance",
      name: "Raulothim'S Psychic Lance",
      level: 4,
      school: "Enchantment",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "120 feet",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "bard",
        "fighter",
        "rogue"
      ],
      source: "FTD",
      page: "21",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_ravenous_void",
      name: "Ravenous Void",
      level: 9,
      school: "Evocation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "1000 feet",
      components: "V, S, M",
      duration: "1 minute",
      classes: [
        "wizard"
      ],
      source: "EGW",
      page: "188",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_shapechange",
      name: "Shapechange",
      level: 9,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "self",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "druid",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "274",
      summary_basic: "You transform into another creature, replacing game stats besides Int, Wis, Cha, and alignment.",
      summary_expert: ""
    },
    {
      id: "spell_storm_of_vengeance",
      name: "Storm of Vengeance",
      level: 9,
      school: "Conjuration",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "sight",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "druid"
      ],
      source: "PHB",
      page: "279",
      summary_basic: "Creates a 360' radius storm, which inflicts a variety of damage and effect over the duration. Immediately causes 2d6 thunder damage and five minute deafening for those within area who fail Con save.",
      summary_expert: ""
    },
    {
      id: "spell_time_ravage",
      name: "Time Ravage",
      level: 9,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "90 feet",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "wizard"
      ],
      source: "EGW",
      page: "189",
      summary_basic: "",
      summary_expert: ""
    },
    {
      id: "spell_time_stop",
      name: "Time Stop",
      level: 9,
      school: "Transmutation",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "283",
      summary_basic: "You can take 1d4+1 turns in a row, but cannot affect a creature other than you or an object being worn or carried.",
      summary_expert: ""
    },
    {
      id: "spell_true_polymorph",
      name: "True Polymorph",
      level: 9,
      school: "Transmutation",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "30 feet",
      components: "V, S, M",
      duration: "1 hour",
      classes: [
        "bard",
        "warlock",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "283",
      summary_basic: "Transforms a creature into a different creature, into an object, or an object into a creature. Shapechangers aren't affected, and unwilling creatures may make a Wis save.",
      summary_expert: ""
    },
    {
      id: "spell_true_resurrection",
      name: "True Resurrection",
      level: 9,
      school: "Necromancy",
      ritual: false,
      concentration: false,
      casting_time: "1 hour",
      range: "touch",
      components: "V, S, M",
      duration: "Instantaneous",
      classes: [
        "cleric",
        "druid",
        "sorcerer"
      ],
      source: "PHB",
      page: "284",
      summary_basic: "Resurrects a creature that has been dead for less than 200 years, even if the body is destroyed.",
      summary_expert: ""
    },
    {
      id: "spell_weird",
      name: "Weird",
      level: 9,
      school: "Illusion",
      ritual: false,
      concentration: true,
      casting_time: "1 action",
      range: "120 feet",
      components: "V, S",
      duration: "1 minute",
      classes: [
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "288",
      summary_basic: "In a 30' radius sphere, creatures are overcome by their deepest fears and become frightened, Wis save prevents. At the start of the frightened creatures' turns, they take 4d10 psychic damage, Wis save ends.",
      summary_expert: ""
    },
    {
      id: "spell_wish",
      name: "Wish",
      level: 9,
      school: "Conjuration",
      ritual: false,
      concentration: false,
      casting_time: "1 action",
      range: "self",
      components: "V",
      duration: "Instantaneous",
      classes: [
        "sorcerer",
        "warlock",
        "wizard",
        "cleric"
      ],
      source: "PHB",
      page: "288",
      summary_basic: "Duplicates any 8th level or lower spell, or a wide variety of other effects, or a custom wish that may be creatively interpreted by the DM. Afterwards, you are excruciatingly stressed/exhausted, and there is a 33% chance you will never be able to cast wish again.",
      summary_expert: ""
    }
  ];

  // js/v2/catalog-standalone.js
  function asList(v) {
    return Array.isArray(v) ? v : [];
  }
  var STANDALONE_CATALOG = {
    dnd5e_2014: {
      rulesetId: "dnd5e_2014",
      classes: asList(classes_min_default),
      subclasses: asList(subclasses_min_default),
      species: asList(species_min_default),
      spells: asList(spells_min_default)
    },
    dnd5e_2024: {
      rulesetId: "dnd5e_2024",
      classes: asList(classes_min_default),
      subclasses: asList(subclasses_min_default),
      species: asList(species_min_default),
      spells: asList(spells_min_default)
    }
  };

  // js/v2/app-standalone.js
  var root = document.getElementById("v2AppRoot");
  if (!root) throw new Error("Missing #v2AppRoot mount element");
  var controller = createAppController();
  var store = controller.store;
  var ui = null;
  var LOCAL_BACKUP_KEY = "living-codex-v2.backup";
  var autosaveTimer = null;
  var AUTOSAVE_MS = 220;
  var saveInFlight = false;
  var saveQueued = false;
  var catalog = {
    rulesetId: "dnd5e_2014",
    classes: [],
    subclasses: [],
    species: [],
    spells: [],
    error: ""
  };
  var runtimeStatus = {
    message: "",
    at: "",
    tone: "info"
  };
  function setRuntimeStatus(message, tone = "info") {
    runtimeStatus.message = message || "";
    runtimeStatus.at = (/* @__PURE__ */ new Date()).toISOString();
    runtimeStatus.tone = tone;
    if (ui) ui.render();
  }
  function clampAbilityScore(v) {
    const n = Number.parseInt((v ?? "").toString(), 10);
    if (!Number.isFinite(n)) return 10;
    return Math.max(1, Math.min(30, n));
  }
  function readLocalBackup() {
    try {
      const raw = localStorage.getItem(LOCAL_BACKUP_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  function writeLocalBackup(character) {
    try {
      if (!character) return;
      localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(character));
    } catch {
    }
  }
  async function flushSave({ makeActive = true } = {}) {
    if (saveInFlight) {
      saveQueued = true;
      return { ok: true, queued: true, attempted: false, saved: false };
    }
    saveInFlight = true;
    try {
      const state = store.getState();
      if (!state.character) {
        return { ok: false, attempted: false, saved: false, reason: "no-character" };
      }
      if (!state.app.dirty) {
        return { ok: true, attempted: false, saved: false, reason: "not-dirty" };
      }
      const result = await controller.saveActiveCharacter({ makeActive });
      if (result.ok) {
        writeLocalBackup(store.getState().character);
        return { ok: true, attempted: true, saved: true, result };
      }
      return {
        ok: false,
        attempted: true,
        saved: false,
        errors: result?.errors || ["Save failed."]
      };
    } finally {
      saveInFlight = false;
      if (saveQueued) {
        saveQueued = false;
        await flushSave({ makeActive: true });
      }
    }
  }
  function scheduleAutosave() {
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      flushSave({ makeActive: true });
    }, AUTOSAVE_MS);
  }
  async function ensureCatalog(rulesetId = "dnd5e_2014") {
    const id = (rulesetId || "").toString().trim() || "dnd5e_2014";
    const selected = STANDALONE_CATALOG[id] || STANDALONE_CATALOG.dnd5e_2014;
    catalog = {
      rulesetId: selected.rulesetId,
      classes: selected.classes,
      subclasses: selected.subclasses || [],
      species: selected.species,
      spells: selected.spells,
      error: ""
    };
    ui.render();
  }
  async function pickZipFile() {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".zip";
      input.style.display = "none";
      input.addEventListener("change", () => {
        const file = input.files && input.files[0] ? input.files[0] : null;
        input.remove();
        resolve(file);
      });
      document.body.appendChild(input);
      input.click();
    });
  }
  function normText(v) {
    return (v ?? "").toString().trim().toLowerCase();
  }
  function policyBadge(row) {
    const mode = row?.availability?.default;
    if (mode === "requires_dm_approval") return "DM Approval";
    return "Core";
  }
  function formatSubtitle(kind, row) {
    const src = (row?.source || "UNKNOWN").toString();
    if (kind === "spell") {
      const cls = Array.isArray(row?.classes) ? row.classes.join(", ") : "";
      return `Level ${row?.level ?? 0} \xB7 ${row?.school || "Unknown school"}${cls ? ` \xB7 ${cls}` : ""}`;
    }
    return `${kind} \xB7 ${src} \xB7 ${policyBadge(row)}`;
  }
  function isAllowedByPolicy(row, policyMode) {
    if (policyMode !== "core_only") return true;
    return (row?.availability?.default || "allowed") !== "requires_dm_approval";
  }
  ui = mountV2UI({
    root,
    getState: () => store.getState(),
    actions: {
      getCatalog: () => catalog,
      getRuntimeStatus: () => ({ ...runtimeStatus }),
      lookupProvider: ({ type, query = "", filters = {} } = {}) => {
        const q = normText(query);
        const policyMode = filters.policyMode || "all_official";
        if (type === "class") {
          return (catalog.classes || []).filter((row) => isAllowedByPolicy(row, policyMode)).filter((row) => !q || normText(row?.name || row?.id).includes(q)).slice(0, 40).map((row) => ({
            id: (row?.id || "").toString(),
            title: (row?.name || row?.id || "").toString(),
            subtitle: formatSubtitle("Class", row),
            raw: row
          }));
        }
        if (type === "species") {
          return (catalog.species || []).filter((row) => isAllowedByPolicy(row, policyMode)).filter((row) => !q || normText(row?.name || row?.id).includes(q)).slice(0, 40).map((row) => ({
            id: (row?.id || "").toString(),
            title: (row?.name || row?.id || "").toString(),
            subtitle: formatSubtitle("Species", row),
            raw: row
          }));
        }
        if (type === "subclass") {
          const classFilters = Array.isArray(filters.classIds) ? filters.classIds.map(normText).filter(Boolean) : [];
          const primaryClassFilter = normText(filters.classId || "");
          return (catalog.subclasses || []).filter((row) => isAllowedByPolicy(row, policyMode)).filter((row) => {
            const rowClassId = normText(row?.class_id);
            const classMatch = classFilters.length ? classFilters.includes(rowClassId) : !primaryClassFilter || rowClassId === primaryClassFilter;
            return classMatch && (!q || normText(row?.name || row?.id).includes(q));
          }).slice(0, 60).map((row) => ({
            id: (row?.id || "").toString(),
            title: (row?.name || row?.id || "").toString(),
            subtitle: `${formatSubtitle("Subclass", row)} \xB7 ${row?.class_id || "class"}`,
            raw: row
          }));
        }
        if (type === "spell") {
          const classFilter = Array.isArray(filters.classIds) ? filters.classIds.map(normText).filter(Boolean) : [];
          const subclassFilter = Array.isArray(filters.subclassIds) ? filters.subclassIds.map(normText).filter(Boolean) : [];
          const allowOffClassSpells = Boolean(filters.allowOffClassSpells);
          const levelFilter = filters.level === "" || filters.level == null ? "" : Number.parseInt(`${filters.level}`, 10);
          const subclassRows = (catalog.subclasses || []).filter((row) => subclassFilter.includes(normText(row?.id)));
          return (catalog.spells || []).filter((row) => {
            if (q && !normText(row?.name || row?.id).includes(q)) return false;
            const rowLevel = Number.parseInt(`${row?.level ?? 0}`, 10);
            if (Number.isFinite(levelFilter) && rowLevel !== levelFilter) return false;
            if (!allowOffClassSpells && classFilter.length > 0) {
              const classes = Array.isArray(row?.classes) ? row.classes.map(normText) : [];
              const school = normText(row?.school || "");
              const baseClassMatch = classes.some((id2) => classFilter.includes(id2));
              const subclassExpandedMatch = subclassRows.some((sub) => {
                const access = sub?.spell_access || {};
                const extraClasses = Array.isArray(access.class_ids) ? access.class_ids.map(normText).filter(Boolean) : [];
                if (!extraClasses.length || !classes.some((id2) => extraClasses.includes(id2))) return false;
                const schoolAllow = Array.isArray(access.schools) ? access.schools.map(normText).filter(Boolean) : [];
                if (!schoolAllow.length) return true;
                return schoolAllow.includes(school);
              });
              if (!baseClassMatch && !subclassExpandedMatch) return false;
            }
            return true;
          }).slice(0, 60).map((row) => ({
            id: (row?.id || row?.name || "").toString(),
            title: (row?.name || row?.id || "").toString(),
            subtitle: formatSubtitle("spell", row),
            raw: row
          }));
        }
        return [];
      },
      ensureCatalog,
      newCharacter: async (draft) => {
        const name = (draft?.name || "New Character").toString().trim() || "New Character";
        const rulesetId = (draft?.rulesetId || "dnd5e_2014").toString().trim() || "dnd5e_2014";
        const classId = (draft?.classId || "").toString().trim().toLowerCase();
        const speciesId = (draft?.speciesId || "").toString().trim().toLowerCase();
        const character = createDefaultCharacterV2({ name, rulesetId, classId, speciesId });
        if (draft && typeof draft === "object") {
          character.abilities.str = clampAbilityScore(draft.str);
          character.abilities.dex = clampAbilityScore(draft.dex);
          character.abilities.con = clampAbilityScore(draft.con);
          character.abilities.int = clampAbilityScore(draft.int);
          character.abilities.wis = clampAbilityScore(draft.wis);
          character.abilities.cha = clampAbilityScore(draft.cha);
        }
        await controller.createNewCharacter(character);
        await flushSave({ makeActive: true });
        await ensureCatalog(rulesetId);
        setRuntimeStatus(`Created character '${name}'.`, "success");
      },
      importZip: async () => {
        try {
          const file = await pickZipFile();
          if (!file) return;
          setRuntimeStatus(`Importing '${file.name}'...`, "info");
          const result = await V2ZipIO.importZipFromFile(file);
          const applied = controller.applyImportedCharacter(result);
          if (result.ok && applied.ok) {
            await flushSave({ makeActive: true });
            const ruleset = store.getState().character?.meta?.ruleset_id || "dnd5e_2014";
            await ensureCatalog(ruleset);
            setRuntimeStatus(`Import succeeded (${result.report?.fixes_applied?.length || 0} auto-fixes).`, "success");
          } else {
            setRuntimeStatus(`Import blocked (${result.report?.blocked?.length || 0} issues).`, "warn");
          }
        } catch (err) {
          const message = err?.message || String(err);
          setRuntimeStatus(`Import failed: ${message}`, "error");
        }
      },
      exportZip: async () => {
        if (!store.getState().character) {
          setRuntimeStatus("Export failed: no character loaded.", "warn");
          return;
        }
        try {
          const save = await flushSave({ makeActive: true });
          if (!save.ok) {
            setRuntimeStatus(`Export blocked: ${(save.errors || []).join(" ") || "save failed."}`, "error");
            return;
          }
          const latest = store.getState();
          await V2ZipIO.exportZipToDownload(latest.character);
          setRuntimeStatus("Exported ZIP.", "success");
        } catch (err) {
          setRuntimeStatus(`Export failed: ${err?.message || String(err)}`, "error");
        }
      },
      exportPdf: async () => {
        const state = store.getState();
        if (!state.character) {
          setRuntimeStatus("Export PDF failed: no character loaded.", "warn");
          return;
        }
        try {
          const save = await flushSave({ makeActive: true });
          if (!save.ok) {
            setRuntimeStatus(`Export PDF blocked: ${(save.errors || []).join(" ") || "save failed."}`, "error");
            return;
          }
          const latest = store.getState();
          if (globalThis?.LivingCodexPdfHtml?.openPrintableHtml) {
            await globalThis.LivingCodexPdfHtml.openPrintableHtml(latest.character, catalog);
          } else {
            throw new Error("PDF HTML renderer not loaded");
          }
          setRuntimeStatus("Exported PDF.", "success");
        } catch (err) {
          setRuntimeStatus(`Export PDF failed: ${err?.message || String(err)}`, "error");
        }
      },
      saveNow: async () => {
        const save = await flushSave({ makeActive: true });
        if (!save.ok) {
          setRuntimeStatus(`Save failed: ${(save.errors || []).join(" ") || "unknown error"}`, "error");
          return;
        }
        if (!save.attempted) {
          if (save.reason === "no-character") setRuntimeStatus("Save skipped: no character loaded.", "warn");
          else setRuntimeStatus("No changes to save.", "info");
          return;
        }
        setRuntimeStatus("Saved character.", "success");
      },
      undo: () => {
        store.undo();
        scheduleAutosave();
        setRuntimeStatus("Undo.", "info");
      },
      redo: () => {
        store.redo();
        scheduleAutosave();
        setRuntimeStatus("Redo.", "info");
      },
      canUndo: () => store.canUndo(),
      canRedo: () => store.canRedo(),
      updateCharacter: (mutator) => {
        store.updateCharacter(mutator);
        writeLocalBackup(store.getState().character);
        scheduleAutosave();
        setRuntimeStatus("Edited character.", "info");
      }
    }
  });
  controller.events.on("state:changed", () => {
    ui.render();
  });
  window.addEventListener("beforeunload", () => {
    const state = store.getState();
    if (state.character) writeLocalBackup(state.character);
  });
  (async () => {
    await controller.bootstrap();
    let state = store.getState();
    if (!state.character) {
      const backup = readLocalBackup();
      if (backup) {
        const parsed = validateAndFixImportPayload(backup);
        controller.applyImportedCharacter(parsed);
        if (parsed.ok) await flushSave({ makeActive: true });
        if (parsed.ok) setRuntimeStatus("Recovered character from local backup.", "success");
      }
      state = store.getState();
      if (!state.character) {
        const listed = await V2Storage.listCharacters();
        if (Array.isArray(listed) && listed.length > 0) {
          const mostRecent = listed[0];
          const loaded = await controller.loadCharacterById(mostRecent.id);
          if (loaded?.ok) setRuntimeStatus(`Recovered most recent character: ${mostRecent.name || mostRecent.id}.`, "success");
        }
      }
    } else {
      setRuntimeStatus("Loaded active character from storage.", "success");
    }
    const activeRuleset = store.getState().character?.meta?.ruleset_id || "dnd5e_2014";
    await ensureCatalog(activeRuleset);
    ui.render();
  })();
})();
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
/* @license
Papa Parse
v5.5.3
https://github.com/mholt/PapaParse
License: MIT
*/

(typeof Crypto == "undefined" || !Crypto.util) &&
  (function () {
    var a = (Crypto = {}),
      b = (a.util = {
        rotl: function (a, b) {
          return (a << b) | (a >>> (32 - b));
        },
        rotr: function (a, b) {
          return (a << (32 - b)) | (a >>> b);
        },
        endian: function (a) {
          if (a.constructor == Number)
            return (b.rotl(a, 8) & 16711935) | (b.rotl(a, 24) & 4278255360);
          for (var c = 0; c < a.length; c++) a[c] = b.endian(a[c]);
          return a;
        },
        randomBytes: function (a) {
          for (var b = []; a > 0; a--) b.push(Math.floor(Math.random() * 256));
          return b;
        },
        bytesToWords: function (a) {
          for (var b = [], c = 0, d = 0; c < a.length; c++, d += 8)
            b[d >>> 5] |= (a[c] & 255) << (24 - (d % 32));
          return b;
        },
        wordsToBytes: function (a) {
          for (var b = [], c = 0; c < a.length * 32; c += 8)
            b.push((a[c >>> 5] >>> (24 - (c % 32))) & 255);
          return b;
        },
        bytesToHex: function (a) {
          for (var b = [], c = 0; c < a.length; c++)
            b.push((a[c] >>> 4).toString(16)), b.push((a[c] & 15).toString(16));
          return b.join("");
        },
        hexToBytes: function (a) {
          for (var b = [], c = 0; c < a.length; c += 2)
            b.push(parseInt(a.substr(c, 2), 16));
          return b;
        },
        bytesToBase64: function (a) {
          if (typeof btoa == "function") return btoa(c.bytesToString(a));
          for (var b = [], d = 0; d < a.length; d += 3)
            for (
              var e = (a[d] << 16) | (a[d + 1] << 8) | a[d + 2], g = 0;
              g < 4;
              g++
            )
              d * 8 + g * 6 <= a.length * 8
                ? b.push(
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(
                      (e >>> (6 * (3 - g))) & 63
                    )
                  )
                : b.push("=");
          return b.join("");
        },
        base64ToBytes: function (a) {
          if (typeof atob == "function") return c.stringToBytes(atob(a));
          for (
            var a = a.replace(/[^A-Z0-9+\/]/gi, ""), b = [], d = 0, e = 0;
            d < a.length;
            e = ++d % 4
          )
            e != 0 &&
              b.push(
                (("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(
                  a.charAt(d - 1)
                ) &
                  (Math.pow(2, -2 * e + 8) - 1)) <<
                  (e * 2)) |
                  ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(
                    a.charAt(d)
                  ) >>>
                    (6 - e * 2))
              );
          return b;
        },
      }),
      a = (a.charenc = {});
    a.UTF8 = {
      stringToBytes: function (a) {
        return c.stringToBytes(unescape(encodeURIComponent(a)));
      },
      bytesToString: function (a) {
        return decodeURIComponent(escape(c.bytesToString(a)));
      },
    };
    var c = (a.Binary = {
      stringToBytes: function (a) {
        for (var b = [], c = 0; c < a.length; c++)
          b.push(a.charCodeAt(c) & 255);
        return b;
      },
      bytesToString: function (a) {
        for (var b = [], c = 0; c < a.length; c++)
          b.push(String.fromCharCode(a[c]));
        return b.join("");
      },
    });
  })();
(function () {
  var a = Crypto,
    b = a.util,
    c = a.charenc,
    d = c.UTF8,
    e = c.Binary,
    f = (a.SHA1 = function (a, c) {
      var d = b.wordsToBytes(f._sha1(a));
      return c && c.asBytes
        ? d
        : c && c.asString
        ? e.bytesToString(d)
        : b.bytesToHex(d);
    });
  f._sha1 = function (a) {
    a.constructor == String && (a = d.stringToBytes(a));
    var c = b.bytesToWords(a),
      e = a.length * 8,
      a = [],
      f = 1732584193,
      g = -271733879,
      h = -1732584194,
      i = 271733878,
      k = -1009589776;
    c[e >> 5] |= 128 << (24 - (e % 32));
    c[(((e + 64) >>> 9) << 4) + 15] = e;
    for (e = 0; e < c.length; e += 16) {
      for (var l = f, m = g, n = h, o = i, p = k, q = 0; q < 80; q++) {
        if (q < 16) a[q] = c[e + q];
        else {
          var r = a[q - 3] ^ a[q - 8] ^ a[q - 14] ^ a[q - 16];
          a[q] = (r << 1) | (r >>> 31);
        }
        r =
          ((f << 5) | (f >>> 27)) +
          k +
          (a[q] >>> 0) +
          (q < 20
            ? ((g & h) | (~g & i)) + 1518500249
            : q < 40
            ? (g ^ h ^ i) + 1859775393
            : q < 60
            ? ((g & h) | (g & i) | (h & i)) - 1894007588
            : (g ^ h ^ i) - 899497514);
        k = i;
        i = h;
        h = (g << 30) | (g >>> 2);
        g = f;
        f = r;
      }
      f += l;
      g += m;
      h += n;
      i += o;
      k += p;
    }
    return [f, g, h, i, k];
  };
  f._blocksize = 16;
  f._digestsize = 20;
})();
(function () {
  var a = Crypto,
    b = a.util,
    c = a.charenc,
    d = c.UTF8,
    e = c.Binary;
  a.HMAC = function (a, c, f, g) {
    c.constructor == String && (c = d.stringToBytes(c));
    f.constructor == String && (f = d.stringToBytes(f));
    f.length > a._blocksize * 4 && (f = a(f, { asBytes: !0 }));
    for (var h = f.slice(0), f = f.slice(0), i = 0; i < a._blocksize * 4; i++)
      (h[i] ^= 92), (f[i] ^= 54);
    a = a(h.concat(a(f.concat(c), { asBytes: !0 })), { asBytes: !0 });
    return g && g.asBytes
      ? a
      : g && g.asString
      ? e.bytesToString(a)
      : b.bytesToHex(a);
  };
})();
(function () {
  var a = Crypto,
    b = a.util,
    c = a.charenc,
    d = c.UTF8,
    e = c.Binary;
  a.PBKDF2 = function (c, f, g, h) {
    function i(b, c) {
      return a.HMAC(k, c, b, { asBytes: !0 });
    }
    c.constructor == String && (c = d.stringToBytes(c));
    f.constructor == String && (f = d.stringToBytes(f));
    for (
      var k = (h && h.hasher) || a.SHA1,
        l = (h && h.iterations) || 1,
        m = [],
        n = 1;
      m.length < g;

    ) {
      for (
        var o = i(c, f.concat(b.wordsToBytes([n]))), p = o, q = 1;
        q < l;
        q++
      )
        for (var p = i(c, p), r = 0; r < o.length; r++) o[r] ^= p[r];
      m = m.concat(o);
      n++;
    }
    m.length = g;
    return h && h.asBytes
      ? m
      : h && h.asString
      ? e.bytesToString(m)
      : b.bytesToHex(m);
  };
})();
(function (a) {
  function b(a, b) {
    var c = a._blocksize * 4;
    return c - (b.length % c);
  }
  var c = (a.pad = {}),
    d = function (a) {
      for (var b = a.pop(), c = 1; c < b; c++) a.pop();
    };
  c.NoPadding = { pad: function () {}, unpad: function () {} };
  c.ZeroPadding = {
    pad: function (a, b) {
      var c = a._blocksize * 4,
        d = b.length % c;
      if (d != 0) for (d = c - d; d > 0; d--) b.push(0);
    },
    unpad: function () {},
  };
  c.iso7816 = {
    pad: function (a, c) {
      var d = b(a, c);
      for (c.push(128); d > 1; d--) c.push(0);
    },
    unpad: function (a) {
      for (; a.pop() != 128; );
    },
  };
  c.ansix923 = {
    pad: function (a, c) {
      for (var d = b(a, c), e = 1; e < d; e++) c.push(0);
      c.push(d);
    },
    unpad: d,
  };
  c.iso10126 = {
    pad: function (a, c) {
      for (var d = b(a, c), e = 1; e < d; e++)
        c.push(Math.floor(Math.random() * 256));
      c.push(d);
    },
    unpad: d,
  };
  c.pkcs7 = {
    pad: function (a, c) {
      for (var d = b(a, c), e = 0; e < d; e++) c.push(d);
    },
    unpad: d,
  };
  var a = (a.mode = {}),
    e = (a.Mode = function (a) {
      if (a) this._padding = a;
    });
  e.prototype = {
    encrypt: function (a, b, c) {
      this._padding.pad(a, b);
      this._doEncrypt(a, b, c);
    },
    decrypt: function (a, b, c) {
      this._doDecrypt(a, b, c);
      this._padding.unpad(b);
    },
    _padding: c.iso7816,
  };
  d = (a.ECB = function () {
    e.apply(this, arguments);
  }).prototype = new e();
  d._doEncrypt = function (a, b) {
    for (var c = a._blocksize * 4, d = 0; d < b.length; d += c)
      a._encryptblock(b, d);
  };
  d._doDecrypt = function (a, b) {
    for (var c = a._blocksize * 4, d = 0; d < b.length; d += c)
      a._decryptblock(b, d);
  };
  d.fixOptions = function (a) {
    a.iv = [];
  };
  d = (a.CBC = function () {
    e.apply(this, arguments);
  }).prototype = new e();
  d._doEncrypt = function (a, b, c) {
    for (var d = a._blocksize * 4, e = 0; e < b.length; e += d) {
      if (e == 0) for (var f = 0; f < d; f++) b[f] ^= c[f];
      else for (f = 0; f < d; f++) b[e + f] ^= b[e + f - d];
      a._encryptblock(b, e);
    }
  };
  d._doDecrypt = function (a, b, c) {
    for (var d = a._blocksize * 4, e = 0; e < b.length; e += d) {
      var f = b.slice(e, e + d);
      a._decryptblock(b, e);
      for (var g = 0; g < d; g++) b[e + g] ^= c[g];
      c = f;
    }
  };
  d = (a.CFB = function () {
    e.apply(this, arguments);
  }).prototype = new e();
  d._padding = c.NoPadding;
  d._doEncrypt = function (a, b, c) {
    for (var d = a._blocksize * 4, c = c.slice(0), e = 0; e < b.length; e++) {
      var f = e % d;
      f == 0 && a._encryptblock(c, 0);
      b[e] ^= c[f];
      c[f] = b[e];
    }
  };
  d._doDecrypt = function (a, b, c) {
    for (var d = a._blocksize * 4, c = c.slice(0), e = 0; e < b.length; e++) {
      var f = e % d;
      f == 0 && a._encryptblock(c, 0);
      var g = b[e];
      b[e] ^= c[f];
      c[f] = g;
    }
  };
  d = (a.OFB = function () {
    e.apply(this, arguments);
  }).prototype = new e();
  d._padding = c.NoPadding;
  d._doEncrypt = function (a, b, c) {
    for (var d = a._blocksize * 4, c = c.slice(0), e = 0; e < b.length; e++)
      e % d == 0 && a._encryptblock(c, 0), (b[e] ^= c[e % d]);
  };
  d._doDecrypt = d._doEncrypt;
  a = (a.CTR = function () {
    e.apply(this, arguments);
  }).prototype = new e();
  a._padding = c.NoPadding;
  a._doEncrypt = function (a, b, c) {
    for (var d = a._blocksize * 4, c = c.slice(0), e = 0; e < b.length; ) {
      var f = c.slice(0);
      a._encryptblock(f, 0);
      for (var g = 0; e < b.length && g < d; g++, e++) b[e] ^= f[g];
      ++c[d - 1] == 256 &&
        ((c[d - 1] = 0),
        ++c[d - 2] == 256 &&
          ((c[d - 2] = 0), ++c[d - 3] == 256 && ((c[d - 3] = 0), ++c[d - 4])));
    }
  };
  a._doDecrypt = a._doEncrypt;
})(Crypto);
(function () {
  function a(a, b) {
    for (var c = 0, d = 0; d < 8; d++) {
      b & 1 && (c ^= a);
      var e = a & 128,
        a = (a << 1) & 255;
      e && (a ^= 27);
      b >>>= 1;
    }
    return c;
  }
  for (
    var b = Crypto,
      c = b.util,
      d = b.charenc.UTF8,
      e = [
        99,
        124,
        119,
        123,
        242,
        107,
        111,
        197,
        48,
        1,
        103,
        43,
        254,
        215,
        171,
        118,
        202,
        130,
        201,
        125,
        250,
        89,
        71,
        240,
        173,
        212,
        162,
        175,
        156,
        164,
        114,
        192,
        183,
        253,
        147,
        38,
        54,
        63,
        247,
        204,
        52,
        165,
        229,
        241,
        113,
        216,
        49,
        21,
        4,
        199,
        35,
        195,
        24,
        150,
        5,
        154,
        7,
        18,
        128,
        226,
        235,
        39,
        178,
        117,
        9,
        131,
        44,
        26,
        27,
        110,
        90,
        160,
        82,
        59,
        214,
        179,
        41,
        227,
        47,
        132,
        83,
        209,
        0,
        237,
        32,
        252,
        177,
        91,
        106,
        203,
        190,
        57,
        74,
        76,
        88,
        207,
        208,
        239,
        170,
        251,
        67,
        77,
        51,
        133,
        69,
        249,
        2,
        127,
        80,
        60,
        159,
        168,
        81,
        163,
        64,
        143,
        146,
        157,
        56,
        245,
        188,
        182,
        218,
        33,
        16,
        255,
        243,
        210,
        205,
        12,
        19,
        236,
        95,
        151,
        68,
        23,
        196,
        167,
        126,
        61,
        100,
        93,
        25,
        115,
        96,
        129,
        79,
        220,
        34,
        42,
        144,
        136,
        70,
        238,
        184,
        20,
        222,
        94,
        11,
        219,
        224,
        50,
        58,
        10,
        73,
        6,
        36,
        92,
        194,
        211,
        172,
        98,
        145,
        149,
        228,
        121,
        231,
        200,
        55,
        109,
        141,
        213,
        78,
        169,
        108,
        86,
        244,
        234,
        101,
        122,
        174,
        8,
        186,
        120,
        37,
        46,
        28,
        166,
        180,
        198,
        232,
        221,
        116,
        31,
        75,
        189,
        139,
        138,
        112,
        62,
        181,
        102,
        72,
        3,
        246,
        14,
        97,
        53,
        87,
        185,
        134,
        193,
        29,
        158,
        225,
        248,
        152,
        17,
        105,
        217,
        142,
        148,
        155,
        30,
        135,
        233,
        206,
        85,
        40,
        223,
        140,
        161,
        137,
        13,
        191,
        230,
        66,
        104,
        65,
        153,
        45,
        15,
        176,
        84,
        187,
        22,
      ],
      f = [],
      g = 0;
    g < 256;
    g++
  )
    f[e[g]] = g;
  for (var h = [], i = [], j = [], k = [], l = [], m = [], g = 0; g < 256; g++)
    (h[g] = a(g, 2)),
      (i[g] = a(g, 3)),
      (j[g] = a(g, 9)),
      (k[g] = a(g, 11)),
      (l[g] = a(g, 13)),
      (m[g] = a(g, 14));
  var n = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
    o = [[], [], [], []],
    p,
    q,
    r,
    s = (b.AES = {
      encrypt: function (a, e, f) {
        var f = f || {},
          g = f.mode || new b.mode.OFB();
        g.fixOptions && g.fixOptions(f);
        var a = a.constructor == String ? d.stringToBytes(a) : a,
          h = f.iv || c.randomBytes(s._blocksize * 4),
          e =
            e.constructor == String
              ? b.PBKDF2(e, h, 32, { asBytes: !0, iterations: f.iterations })
              : e;
        s._init(e);
        g.encrypt(s, a, h);
        a = f.iv ? a : h.concat(a);
        return f && f.asBytes ? a : c.bytesToBase64(a);
      },
      decrypt: function (a, e, f) {
        var f = f || {},
          g = f.mode || new b.mode.OFB();
        g.fixOptions && g.fixOptions(f);
        var a = a.constructor == String ? c.base64ToBytes(a) : a,
          h = f.iv || a.splice(0, s._blocksize * 4),
          e =
            e.constructor == String
              ? b.PBKDF2(e, h, 32, { asBytes: !0, iterations: f.iterations })
              : e;
        s._init(e);
        g.decrypt(s, a, h);
        return f && f.asBytes ? a : d.bytesToString(a);
      },
      _blocksize: 4,
      _encryptblock: function (a, b) {
        for (var c = 0; c < s._blocksize; c++)
          for (var d = 0; d < 4; d++) o[c][d] = a[b + d * 4 + c];
        for (c = 0; c < 4; c++) for (d = 0; d < 4; d++) o[c][d] ^= r[d][c];
        for (var f = 1; f < q; f++) {
          for (c = 0; c < 4; c++) for (d = 0; d < 4; d++) o[c][d] = e[o[c][d]];
          o[1].push(o[1].shift());
          o[2].push(o[2].shift());
          o[2].push(o[2].shift());
          o[3].unshift(o[3].pop());
          for (d = 0; d < 4; d++) {
            var c = o[0][d],
              g = o[1][d],
              j = o[2][d],
              k = o[3][d];
            o[0][d] = h[c] ^ i[g] ^ j ^ k;
            o[1][d] = c ^ h[g] ^ i[j] ^ k;
            o[2][d] = c ^ g ^ h[j] ^ i[k];
            o[3][d] = i[c] ^ g ^ j ^ h[k];
          }
          for (c = 0; c < 4; c++)
            for (d = 0; d < 4; d++) o[c][d] ^= r[f * 4 + d][c];
        }
        for (c = 0; c < 4; c++) for (d = 0; d < 4; d++) o[c][d] = e[o[c][d]];
        o[1].push(o[1].shift());
        o[2].push(o[2].shift());
        o[2].push(o[2].shift());
        o[3].unshift(o[3].pop());
        for (c = 0; c < 4; c++)
          for (d = 0; d < 4; d++) o[c][d] ^= r[q * 4 + d][c];
        for (c = 0; c < s._blocksize; c++)
          for (d = 0; d < 4; d++) a[b + d * 4 + c] = o[c][d];
      },
      _decryptblock: function (a, b) {
        for (var c = 0; c < s._blocksize; c++)
          for (var d = 0; d < 4; d++) o[c][d] = a[b + d * 4 + c];
        for (c = 0; c < 4; c++)
          for (d = 0; d < 4; d++) o[c][d] ^= r[q * 4 + d][c];
        for (var e = 1; e < q; e++) {
          o[1].unshift(o[1].pop());
          o[2].push(o[2].shift());
          o[2].push(o[2].shift());
          o[3].push(o[3].shift());
          for (c = 0; c < 4; c++) for (d = 0; d < 4; d++) o[c][d] = f[o[c][d]];
          for (c = 0; c < 4; c++)
            for (d = 0; d < 4; d++) o[c][d] ^= r[(q - e) * 4 + d][c];
          for (d = 0; d < 4; d++) {
            var c = o[0][d],
              g = o[1][d],
              h = o[2][d],
              i = o[3][d];
            o[0][d] = m[c] ^ k[g] ^ l[h] ^ j[i];
            o[1][d] = j[c] ^ m[g] ^ k[h] ^ l[i];
            o[2][d] = l[c] ^ j[g] ^ m[h] ^ k[i];
            o[3][d] = k[c] ^ l[g] ^ j[h] ^ m[i];
          }
        }
        o[1].unshift(o[1].pop());
        o[2].push(o[2].shift());
        o[2].push(o[2].shift());
        o[3].push(o[3].shift());
        for (c = 0; c < 4; c++) for (d = 0; d < 4; d++) o[c][d] = f[o[c][d]];
        for (c = 0; c < 4; c++) for (d = 0; d < 4; d++) o[c][d] ^= r[d][c];
        for (c = 0; c < s._blocksize; c++)
          for (d = 0; d < 4; d++) a[b + d * 4 + c] = o[c][d];
      },
      _init: function (a) {
        p = a.length / 4;
        q = p + 6;
        s._keyexpansion(a);
      },
      _keyexpansion: function (a) {
        r = [];
        for (var b = 0; b < p; b++)
          r[b] = [a[b * 4], a[b * 4 + 1], a[b * 4 + 2], a[b * 4 + 3]];
        for (b = p; b < s._blocksize * (q + 1); b++)
          (a = [r[b - 1][0], r[b - 1][1], r[b - 1][2], r[b - 1][3]]),
            b % p == 0
              ? (a.push(a.shift()),
                (a[0] = e[a[0]]),
                (a[1] = e[a[1]]),
                (a[2] = e[a[2]]),
                (a[3] = e[a[3]]),
                (a[0] ^= n[b / p]))
              : p > 6 &&
                b % p == 4 &&
                ((a[0] = e[a[0]]),
                (a[1] = e[a[1]]),
                (a[2] = e[a[2]]),
                (a[3] = e[a[3]])),
            (r[b] = [
              r[b - p][0] ^ a[0],
              r[b - p][1] ^ a[1],
              r[b - p][2] ^ a[2],
              r[b - p][3] ^ a[3],
            ]);
      },
    });
})();
//Changed padding to CBC iso10126 9th March 2012

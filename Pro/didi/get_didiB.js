"use strict";

global.Buffer = global.Buffer || require('buffer').Buffer;

if (typeof btoa === 'undefined') {
    global.btoa = function (str) {
        return new Buffer(str).toString('base64');
    };
}

if (typeof atob === 'undefined') {
    global.atob = function (b64Encoded) {
        return new Buffer(b64Encoded, 'base64').toString();
    };
}

function hex2b64(t) {
    var e, i, r = "";
    for (e = 0; e + 3 <= t.length; e += 3)
        i = parseInt(t.substring(e, e + 3), 16),
        r += b64map.charAt(i >> 6) + b64map.charAt(63 & i);
    for (e + 1 == t.length ? (i = parseInt(t.substring(e, e + 1), 16),
    r += b64map.charAt(i << 2)) : e + 2 == t.length && (i = parseInt(t.substring(e, e + 2), 16),
    r += b64map.charAt(i >> 2) + b64map.charAt((3 & i) << 4)); (3 & r.length) > 0; )
        r += b64pad;
    return r
}
function b64tohex(t) {
    var e, i, r = "", n = 0;
    for (e = 0; e < t.length && t.charAt(e) != b64pad; ++e) {
        var s = b64map.indexOf(t.charAt(e));
        0 > s || (0 == n ? (r += int2char(s >> 2),
        i = 3 & s,
        n = 1) : 1 == n ? (r += int2char(i << 2 | s >> 4),
        i = 15 & s,
        n = 2) : 2 == n ? (r += int2char(i),
        r += int2char(s >> 2),
        i = 3 & s,
        n = 3) : (r += int2char(i << 2 | s >> 4),
        r += int2char(15 & s),
        n = 0))
    }
    return 1 == n && (r += int2char(i << 2)),
    r
}
function b64toBA(t) {
    var e, i = b64tohex(t), r = new Array;
    for (e = 0; 2 * e < i.length; ++e)
        r[e] = parseInt(i.substring(2 * e, 2 * e + 2), 16);
    return r
}
function BigInteger(t, e, i) {
    null != t && ("number" == typeof t ? this.fromNumber(t, e, i) : null == e && "string" != typeof t ? this.fromString(t, 256) : this.fromString(t, e))
}
function nbi() {
    return new BigInteger(null )
}
function am1(t, e, i, r, n, s) {
    for (; --s >= 0; ) {
        var o = e * this[t++] + i[r] + n;
        n = Math.floor(o / 67108864),
        i[r++] = 67108863 & o
    }
    return n
}
function am2(t, e, i, r, n, s) {
    for (var o = 32767 & e, a = e >> 15; --s >= 0; ) {
        var h = 32767 & this[t]
          , c = this[t++] >> 15
          , u = a * h + c * o;
        h = o * h + ((32767 & u) << 15) + i[r] + (1073741823 & n),
        n = (h >>> 30) + (u >>> 15) + a * c + (n >>> 30),
        i[r++] = 1073741823 & h
    }
    return n
}
function am3(t, e, i, r, n, s) {
    for (var o = 16383 & e, a = e >> 14; --s >= 0; ) {
        var h = 16383 & this[t]
          , c = this[t++] >> 14
          , u = a * h + c * o;
        h = o * h + ((16383 & u) << 14) + i[r] + n,
        n = (h >> 28) + (u >> 14) + a * c,
        i[r++] = 268435455 & h
    }
    return n
}
function int2char(t) {
    return BI_RM.charAt(t)
}
function intAt(t, e) {
    var i = BI_RC[t.charCodeAt(e)];
    return null == i ? -1 : i
}
function bnpCopyTo(t) {
    for (var e = this.t - 1; e >= 0; --e)
        t[e] = this[e];
    t.t = this.t,
    t.s = this.s
}
function bnpFromInt(t) {
    this.t = 1,
    this.s = 0 > t ? -1 : 0,
    t > 0 ? this[0] = t : -1 > t ? this[0] = t + DV : this.t = 0
}
function nbv(t) {
    var e = nbi();
    return e.fromInt(t),
    e
}
function bnpFromString(t, e) {
    var i;
    if (16 == e)
        i = 4;
    else if (8 == e)
        i = 3;
    else if (256 == e)
        i = 8;
    else if (2 == e)
        i = 1;
    else if (32 == e)
        i = 5;
    else {
        if (4 != e)
            return void this.fromRadix(t, e);
        i = 2
    }
    this.t = 0,
    this.s = 0;
    for (var r = t.length, n = !1, s = 0; --r >= 0; ) {
        var o = 8 == i ? 255 & t[r] : intAt(t, r);
        0 > o ? "-" == t.charAt(r) && (n = !0) : (n = !1,
        0 == s ? this[this.t++] = o : s + i > this.DB ? (this[this.t - 1] |= (o & (1 << this.DB - s) - 1) << s,
        this[this.t++] = o >> this.DB - s) : this[this.t - 1] |= o << s,
        (s += i) >= this.DB && (s -= this.DB))
    }
    8 == i && 0 != (128 & t[0]) && (this.s = -1,
    s > 0 && (this[this.t - 1] |= (1 << this.DB - s) - 1 << s)),
    this.clamp(),
    n && BigInteger.ZERO.subTo(this, this)
}
function bnpClamp() {
    for (var t = this.s & this.DM; this.t > 0 && this[this.t - 1] == t; )
        --this.t
}
function bnToString(t) {
    if (this.s < 0)
        return "-" + this.negate().toString(t);
    var e;
    if (16 == t)
        e = 4;
    else if (8 == t)
        e = 3;
    else if (2 == t)
        e = 1;
    else if (32 == t)
        e = 5;
    else {
        if (4 != t)
            return this.toRadix(t);
        e = 2
    }
    var i, r = (1 << e) - 1, n = !1, s = "", o = this.t, a = this.DB - o * this.DB % e;
    if (o-- > 0)
        for (a < this.DB && (i = this[o] >> a) > 0 && (n = !0,
        s = int2char(i)); o >= 0; )
            e > a ? (i = (this[o] & (1 << a) - 1) << e - a,
            i |= this[--o] >> (a += this.DB - e)) : (i = this[o] >> (a -= e) & r,
            0 >= a && (a += this.DB,
            --o)),
            i > 0 && (n = !0),
            n && (s += int2char(i));
    return n ? s : "0"
}
function bnNegate() {
    var t = nbi();
    return BigInteger.ZERO.subTo(this, t),
    t
}
function bnAbs() {
    return this.s < 0 ? this.negate() : this
}
function bnCompareTo(t) {
    var e = this.s - t.s;
    if (0 != e)
        return e;
    var i = this.t;
    if (0 != (e = i - t.t))
        return e;
    for (; --i >= 0; )
        if (0 != (e = this[i] - t[i]))
            return e;
    return 0
}
function nbits(t) {
    var e, i = 1;
    return 0 != (e = t >>> 16) && (t = e,
    i += 16),
    0 != (e = t >> 8) && (t = e,
    i += 8),
    0 != (e = t >> 4) && (t = e,
    i += 4),
    0 != (e = t >> 2) && (t = e,
    i += 2),
    0 != (e = t >> 1) && (t = e,
    i += 1),
    i
}
function bnBitLength() {
    return this.t <= 0 ? 0 : this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM)
}
function bnpDLShiftTo(t, e) {
    var i;
    for (i = this.t - 1; i >= 0; --i)
        e[i + t] = this[i];
    for (i = t - 1; i >= 0; --i)
        e[i] = 0;
    e.t = this.t + t,
    e.s = this.s
}
function bnpDRShiftTo(t, e) {
    for (var i = t; i < this.t; ++i)
        e[i - t] = this[i];
    e.t = Math.max(this.t - t, 0),
    e.s = this.s
}
function bnpLShiftTo(t, e) {
    var i, r = t % this.DB, n = this.DB - r, s = (1 << n) - 1, o = Math.floor(t / this.DB), a = this.s << r & this.DM;
    for (i = this.t - 1; i >= 0; --i)
        e[i + o + 1] = this[i] >> n | a,
        a = (this[i] & s) << r;
    for (i = o - 1; i >= 0; --i)
        e[i] = 0;
    e[o] = a,
    e.t = this.t + o + 1,
    e.s = this.s,
    e.clamp()
}
function bnpRShiftTo(t, e) {
    e.s = this.s;
    var i = Math.floor(t / this.DB);
    if (i >= this.t)
        return void (e.t = 0);
    var r = t % this.DB
      , n = this.DB - r
      , s = (1 << r) - 1;
    e[0] = this[i] >> r;
    for (var o = i + 1; o < this.t; ++o)
        e[o - i - 1] |= (this[o] & s) << n,
        e[o - i] = this[o] >> r;
    r > 0 && (e[this.t - i - 1] |= (this.s & s) << n),
    e.t = this.t - i,
    e.clamp()
}
function bnpSubTo(t, e) {
    for (var i = 0, r = 0, n = Math.min(t.t, this.t); n > i; )
        r += this[i] - t[i],
        e[i++] = r & this.DM,
        r >>= this.DB;
    if (t.t < this.t) {
        for (r -= t.s; i < this.t; )
            r += this[i],
            e[i++] = r & this.DM,
            r >>= this.DB;
        r += this.s
    } else {
        for (r += this.s; i < t.t; )
            r -= t[i],
            e[i++] = r & this.DM,
            r >>= this.DB;
        r -= t.s
    }
    e.s = 0 > r ? -1 : 0,
    -1 > r ? e[i++] = this.DV + r : r > 0 && (e[i++] = r),
    e.t = i,
    e.clamp()
}
function bnpMultiplyTo(t, e) {
    var i = this.abs()
      , r = t.abs()
      , n = i.t;
    for (e.t = n + r.t; --n >= 0; )
        e[n] = 0;
    for (n = 0; n < r.t; ++n)
        e[n + i.t] = i.am(0, r[n], e, n, 0, i.t);
    e.s = 0,
    e.clamp(),
    this.s != t.s && BigInteger.ZERO.subTo(e, e)
}
function bnpSquareTo(t) {
    for (var e = this.abs(), i = t.t = 2 * e.t; --i >= 0; )
        t[i] = 0;
    for (i = 0; i < e.t - 1; ++i) {
        var r = e.am(i, e[i], t, 2 * i, 0, 1);
        (t[i + e.t] += e.am(i + 1, 2 * e[i], t, 2 * i + 1, r, e.t - i - 1)) >= e.DV && (t[i + e.t] -= e.DV,
        t[i + e.t + 1] = 1)
    }
    t.t > 0 && (t[t.t - 1] += e.am(i, e[i], t, 2 * i, 0, 1)),
    t.s = 0,
    t.clamp()
}
function bnpDivRemTo(t, e, i) {
    var r = t.abs();
    if (!(r.t <= 0)) {
        var n = this.abs();
        if (n.t < r.t)
            return null != e && e.fromInt(0),
            void (null != i && this.copyTo(i));
        null == i && (i = nbi());
        var s = nbi()
          , o = this.s
          , a = t.s
          , h = this.DB - nbits(r[r.t - 1]);
        h > 0 ? (r.lShiftTo(h, s),
        n.lShiftTo(h, i)) : (r.copyTo(s),
        n.copyTo(i));
        var c = s.t
          , u = s[c - 1];
        if (0 != u) {
            var l = u * (1 << this.F1) + (c > 1 ? s[c - 2] >> this.F2 : 0)
              , p = this.FV / l
              , f = (1 << this.F1) / l
              , g = 1 << this.F2
              , b = i.t
              , m = b - c
              , d = null == e ? nbi() : e;
            for (s.dlShiftTo(m, d),
            i.compareTo(d) >= 0 && (i[i.t++] = 1,
            i.subTo(d, i)),
            BigInteger.ONE.dlShiftTo(c, d),
            d.subTo(s, s); s.t < c; )
                s[s.t++] = 0;
            for (; --m >= 0; ) {
                var v = i[--b] == u ? this.DM : Math.floor(i[b] * p + (i[b - 1] + g) * f);
                if ((i[b] += s.am(0, v, i, m, 0, c)) < v)
                    for (s.dlShiftTo(m, d),
                    i.subTo(d, i); i[b] < --v; )
                        i.subTo(d, i)
            }
            null != e && (i.drShiftTo(c, e),
            o != a && BigInteger.ZERO.subTo(e, e)),
            i.t = c,
            i.clamp(),
            h > 0 && i.rShiftTo(h, i),
            0 > o && BigInteger.ZERO.subTo(i, i)
        }
    }
}
function bnMod(t) {
    var e = nbi();
    return this.abs().divRemTo(t, null , e),
    this.s < 0 && e.compareTo(BigInteger.ZERO) > 0 && t.subTo(e, e),
    e
}
function Classic(t) {
    this.m = t
}
function cConvert(t) {
    return t.s < 0 || t.compareTo(this.m) >= 0 ? t.mod(this.m) : t
}
function cRevert(t) {
    return t
}
function cReduce(t) {
    t.divRemTo(this.m, null , t)
}
function cMulTo(t, e, i) {
    t.multiplyTo(e, i),
    this.reduce(i)
}
function cSqrTo(t, e) {
    t.squareTo(e),
    this.reduce(e)
}
function bnpInvDigit() {
    if (this.t < 1)
        return 0;
    var t = this[0];
    if (0 == (1 & t))
        return 0;
    var e = 3 & t;
    return e = e * (2 - (15 & t) * e) & 15,
    e = e * (2 - (255 & t) * e) & 255,
    e = e * (2 - ((65535 & t) * e & 65535)) & 65535,
    e = e * (2 - t * e % this.DV) % this.DV,
    e > 0 ? this.DV - e : -e
}
function Montgomery(t) {
    this.m = t,
    this.mp = t.invDigit(),
    this.mpl = 32767 & this.mp,
    this.mph = this.mp >> 15,
    this.um = (1 << t.DB - 15) - 1,
    this.mt2 = 2 * t.t
}
function montConvert(t) {
    var e = nbi();
    return t.abs().dlShiftTo(this.m.t, e),
    e.divRemTo(this.m, null , e),
    t.s < 0 && e.compareTo(BigInteger.ZERO) > 0 && this.m.subTo(e, e),
    e
}
function montRevert(t) {
    var e = nbi();
    return t.copyTo(e),
    this.reduce(e),
    e
}
function montReduce(t) {
    for (; t.t <= this.mt2; )
        t[t.t++] = 0;
    for (var e = 0; e < this.m.t; ++e) {
        var i = 32767 & t[e]
          , r = i * this.mpl + ((i * this.mph + (t[e] >> 15) * this.mpl & this.um) << 15) & t.DM;
        for (i = e + this.m.t,
        t[i] += this.m.am(0, r, t, e, 0, this.m.t); t[i] >= t.DV; )
            t[i] -= t.DV,
            t[++i]++
    }
    t.clamp(),
    t.drShiftTo(this.m.t, t),
    t.compareTo(this.m) >= 0 && t.subTo(this.m, t)
}
function montSqrTo(t, e) {
    t.squareTo(e),
    this.reduce(e)
}
function montMulTo(t, e, i) {
    t.multiplyTo(e, i),
    this.reduce(i)
}
function bnpIsEven() {
    return 0 == (this.t > 0 ? 1 & this[0] : this.s)
}
function bnpExp(t, e) {
    if (t > 4294967295 || 1 > t)
        return BigInteger.ONE;
    var i = nbi()
      , r = nbi()
      , n = e.convert(this)
      , s = nbits(t) - 1;
    for (n.copyTo(i); --s >= 0; )
        if (e.sqrTo(i, r),
        (t & 1 << s) > 0)
            e.mulTo(r, n, i);
        else {
            var o = i;
            i = r,
            r = o
        }
    return e.revert(i)
}
function bnModPowInt(t, e) {
    var i;
    return i = 256 > t || e.isEven() ? new Classic(e) : new Montgomery(e),
    this.exp(t, i)
}
function bnClone() {
    var t = nbi();
    return this.copyTo(t),
    t
}
function bnIntValue() {
    if (this.s < 0) {
        if (1 == this.t)
            return this[0] - this.DV;
        if (0 == this.t)
            return -1
    } else {
        if (1 == this.t)
            return this[0];
        if (0 == this.t)
            return 0
    }
    return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
}
function bnByteValue() {
    return 0 == this.t ? this.s : this[0] << 24 >> 24
}
function bnShortValue() {
    return 0 == this.t ? this.s : this[0] << 16 >> 16
}
function bnpChunkSize(t) {
    return Math.floor(Math.LN2 * this.DB / Math.log(t))
}
function bnSigNum() {
    return this.s < 0 ? -1 : this.t <= 0 || 1 == this.t && this[0] <= 0 ? 0 : 1
}
function bnpToRadix(t) {
    if (null == t && (t = 10),
    0 == this.signum() || 2 > t || t > 36)
        return "0";
    var e = this.chunkSize(t)
      , i = Math.pow(t, e)
      , r = nbv(i)
      , n = nbi()
      , s = nbi()
      , o = "";
    for (this.divRemTo(r, n, s); n.signum() > 0; )
        o = (i + s.intValue()).toString(t).substr(1) + o,
        n.divRemTo(r, n, s);
    return s.intValue().toString(t) + o
}
function bnpFromRadix(t, e) {
    this.fromInt(0),
    null == e && (e = 10);
    for (var i = this.chunkSize(e), r = Math.pow(e, i), n = !1, s = 0, o = 0, a = 0; a < t.length; ++a) {
        var h = intAt(t, a);
        0 > h ? "-" == t.charAt(a) && 0 == this.signum() && (n = !0) : (o = e * o + h,
        ++s >= i && (this.dMultiply(r),
        this.dAddOffset(o, 0),
        s = 0,
        o = 0))
    }
    s > 0 && (this.dMultiply(Math.pow(e, s)),
    this.dAddOffset(o, 0)),
    n && BigInteger.ZERO.subTo(this, this)
}
function bnpFromNumber(t, e, i) {
    if ("number" == typeof e)
        if (2 > t)
            this.fromInt(1);
        else
            for (this.fromNumber(t, i),
            this.testBit(t - 1) || this.bitwiseTo(BigInteger.ONE.shiftLeft(t - 1), op_or, this),
            this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(e); )
                this.dAddOffset(2, 0),
                this.bitLength() > t && this.subTo(BigInteger.ONE.shiftLeft(t - 1), this);
    else {
        var r = new Array
          , n = 7 & t;
        r.length = 1 + (t >> 3),
        e.nextBytes(r),
        n > 0 ? r[0] &= (1 << n) - 1 : r[0] = 0,
        this.fromString(r, 256)
    }
}
function bnToByteArray() {
    var t = this.t
      , e = new Array;
    e[0] = this.s;
    var i, r = this.DB - t * this.DB % 8, n = 0;
    if (t-- > 0)
        for (r < this.DB && (i = this[t] >> r) != (this.s & this.DM) >> r && (e[n++] = i | this.s << this.DB - r); t >= 0; )
            8 > r ? (i = (this[t] & (1 << r) - 1) << 8 - r,
            i |= this[--t] >> (r += this.DB - 8)) : (i = this[t] >> (r -= 8) & 255,
            0 >= r && (r += this.DB,
            --t)),
            0 != (128 & i) && (i |= -256),
            0 == n && (128 & this.s) != (128 & i) && ++n,
            (n > 0 || i != this.s) && (e[n++] = i);
    return e
}
function bnEquals(t) {
    return 0 == this.compareTo(t)
}
function bnMin(t) {
    return this.compareTo(t) < 0 ? this : t
}
function bnMax(t) {
    return this.compareTo(t) > 0 ? this : t
}
function bnpBitwiseTo(t, e, i) {
    var r, n, s = Math.min(t.t, this.t);
    for (r = 0; s > r; ++r)
        i[r] = e(this[r], t[r]);
    if (t.t < this.t) {
        for (n = t.s & this.DM,
        r = s; r < this.t; ++r)
            i[r] = e(this[r], n);
        i.t = this.t
    } else {
        for (n = this.s & this.DM,
        r = s; r < t.t; ++r)
            i[r] = e(n, t[r]);
        i.t = t.t
    }
    i.s = e(this.s, t.s),
    i.clamp()
}
function op_and(t, e) {
    return t & e
}
function bnAnd(t) {
    var e = nbi();
    return this.bitwiseTo(t, op_and, e),
    e
}
function op_or(t, e) {
    return t | e
}
function bnOr(t) {
    var e = nbi();
    return this.bitwiseTo(t, op_or, e),
    e
}
function op_xor(t, e) {
    return t ^ e
}
function bnXor(t) {
    var e = nbi();
    return this.bitwiseTo(t, op_xor, e),
    e
}
function op_andnot(t, e) {
    return t & ~e
}
function bnAndNot(t) {
    var e = nbi();
    return this.bitwiseTo(t, op_andnot, e),
    e
}
function bnNot() {
    for (var t = nbi(), e = 0; e < this.t; ++e)
        t[e] = this.DM & ~this[e];
    return t.t = this.t,
    t.s = ~this.s,
    t
}
function bnShiftLeft(t) {
    var e = nbi();
    return 0 > t ? this.rShiftTo(-t, e) : this.lShiftTo(t, e),
    e
}
function bnShiftRight(t) {
    var e = nbi();
    return 0 > t ? this.lShiftTo(-t, e) : this.rShiftTo(t, e),
    e
}
function lbit(t) {
    if (0 == t)
        return -1;
    var e = 0;
    return 0 == (65535 & t) && (t >>= 16,
    e += 16),
    0 == (255 & t) && (t >>= 8,
    e += 8),
    0 == (15 & t) && (t >>= 4,
    e += 4),
    0 == (3 & t) && (t >>= 2,
    e += 2),
    0 == (1 & t) && ++e,
    e
}
function bnGetLowestSetBit() {
    for (var t = 0; t < this.t; ++t)
        if (0 != this[t])
            return t * this.DB + lbit(this[t]);
    return this.s < 0 ? this.t * this.DB : -1
}
function cbit(t) {
    for (var e = 0; 0 != t; )
        t &= t - 1,
        ++e;
    return e
}
function bnBitCount() {
    for (var t = 0, e = this.s & this.DM, i = 0; i < this.t; ++i)
        t += cbit(this[i] ^ e);
    return t
}
function bnTestBit(t) {
    var e = Math.floor(t / this.DB);
    return e >= this.t ? 0 != this.s : 0 != (this[e] & 1 << t % this.DB)
}
function bnpChangeBit(t, e) {
    var i = BigInteger.ONE.shiftLeft(t);
    return this.bitwiseTo(i, e, i),
    i
}
function bnSetBit(t) {
    return this.changeBit(t, op_or)
}
function bnClearBit(t) {
    return this.changeBit(t, op_andnot)
}
function bnFlipBit(t) {
    return this.changeBit(t, op_xor)
}
function bnpAddTo(t, e) {
    for (var i = 0, r = 0, n = Math.min(t.t, this.t); n > i; )
        r += this[i] + t[i],
        e[i++] = r & this.DM,
        r >>= this.DB;
    if (t.t < this.t) {
        for (r += t.s; i < this.t; )
            r += this[i],
            e[i++] = r & this.DM,
            r >>= this.DB;
        r += this.s
    } else {
        for (r += this.s; i < t.t; )
            r += t[i],
            e[i++] = r & this.DM,
            r >>= this.DB;
        r += t.s
    }
    e.s = 0 > r ? -1 : 0,
    r > 0 ? e[i++] = r : -1 > r && (e[i++] = this.DV + r),
    e.t = i,
    e.clamp()
}
function bnAdd(t) {
    var e = nbi();
    return this.addTo(t, e),
    e
}
function bnSubtract(t) {
    var e = nbi();
    return this.subTo(t, e),
    e
}
function bnMultiply(t) {
    var e = nbi();
    return this.multiplyTo(t, e),
    e
}
function bnDivide(t) {
    var e = nbi();
    return this.divRemTo(t, e, null ),
    e
}
function bnRemainder(t) {
    var e = nbi();
    return this.divRemTo(t, null , e),
    e
}
function bnDivideAndRemainder(t) {
    var e = nbi()
      , i = nbi();
    return this.divRemTo(t, e, i),
    new Array(e,i)
}
function bnpDMultiply(t) {
    this[this.t] = this.am(0, t - 1, this, 0, 0, this.t),
    ++this.t,
    this.clamp()
}
function bnpDAddOffset(t, e) {
    if (0 != t) {
        for (; this.t <= e; )
            this[this.t++] = 0;
        for (this[e] += t; this[e] >= this.DV; )
            this[e] -= this.DV,
            ++e >= this.t && (this[this.t++] = 0),
            ++this[e]
    }
}
function NullExp() {}
function nNop(t) {
    return t
}
function nMulTo(t, e, i) {
    t.multiplyTo(e, i)
}
function nSqrTo(t, e) {
    t.squareTo(e)
}
function bnPow(t) {
    return this.exp(t, new NullExp)
}
function bnpMultiplyLowerTo(t, e, i) {
    var r = Math.min(this.t + t.t, e);
    for (i.s = 0,
    i.t = r; r > 0; )
        i[--r] = 0;
    var n;
    for (n = i.t - this.t; n > r; ++r)
        i[r + this.t] = this.am(0, t[r], i, r, 0, this.t);
    for (n = Math.min(t.t, e); n > r; ++r)
        this.am(0, t[r], i, r, 0, e - r);
    i.clamp()
}
function bnpMultiplyUpperTo(t, e, i) {
    --e;
    var r = i.t = this.t + t.t - e;
    for (i.s = 0; --r >= 0; )
        i[r] = 0;
    for (r = Math.max(e - this.t, 0); r < t.t; ++r)
        i[this.t + r - e] = this.am(e - r, t[r], i, 0, 0, this.t + r - e);
    i.clamp(),
    i.drShiftTo(1, i)
}
function Barrett(t) {
    this.r2 = nbi(),
    this.q3 = nbi(),
    BigInteger.ONE.dlShiftTo(2 * t.t, this.r2),
    this.mu = this.r2.divide(t),
    this.m = t
}
function barrettConvert(t) {
    if (t.s < 0 || t.t > 2 * this.m.t)
        return t.mod(this.m);
    if (t.compareTo(this.m) < 0)
        return t;
    var e = nbi();
    return t.copyTo(e),
    this.reduce(e),
    e
}
function barrettRevert(t) {
    return t
}
function barrettReduce(t) {
    for (t.drShiftTo(this.m.t - 1, this.r2),
    t.t > this.m.t + 1 && (t.t = this.m.t + 1,
    t.clamp()),
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3),
    this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); t.compareTo(this.r2) < 0; )
        t.dAddOffset(1, this.m.t + 1);
    for (t.subTo(this.r2, t); t.compareTo(this.m) >= 0; )
        t.subTo(this.m, t)
}
function barrettSqrTo(t, e) {
    t.squareTo(e),
    this.reduce(e)
}
function barrettMulTo(t, e, i) {
    t.multiplyTo(e, i),
    this.reduce(i)
}
function bnModPow(t, e) {
    var i, r, n = t.bitLength(), s = nbv(1);
    if (0 >= n)
        return s;
    i = 18 > n ? 1 : 48 > n ? 3 : 144 > n ? 4 : 768 > n ? 5 : 6,
    r = 8 > n ? new Classic(e) : e.isEven() ? new Barrett(e) : new Montgomery(e);
    var o = new Array
      , a = 3
      , h = i - 1
      , c = (1 << i) - 1;
    if (o[1] = r.convert(this),
    i > 1) {
        var u = nbi();
        for (r.sqrTo(o[1], u); c >= a; )
            o[a] = nbi(),
            r.mulTo(u, o[a - 2], o[a]),
            a += 2
    }
    var l, p, f = t.t - 1, g = !0, b = nbi();
    for (n = nbits(t[f]) - 1; f >= 0; ) {
        for (n >= h ? l = t[f] >> n - h & c : (l = (t[f] & (1 << n + 1) - 1) << h - n,
        f > 0 && (l |= t[f - 1] >> this.DB + n - h)),
        a = i; 0 == (1 & l); )
            l >>= 1,
            --a;
        if ((n -= a) < 0 && (n += this.DB,
        --f),
        g)
            o[l].copyTo(s),
            g = !1;
        else {
            for (; a > 1; )
                r.sqrTo(s, b),
                r.sqrTo(b, s),
                a -= 2;
            a > 0 ? r.sqrTo(s, b) : (p = s,
            s = b,
            b = p),
            r.mulTo(b, o[l], s)
        }
        for (; f >= 0 && 0 == (t[f] & 1 << n); )
            r.sqrTo(s, b),
            p = s,
            s = b,
            b = p,
            --n < 0 && (n = this.DB - 1,
            --f)
    }
    return r.revert(s)
}
function bnGCD(t) {
    var e = this.s < 0 ? this.negate() : this.clone()
      , i = t.s < 0 ? t.negate() : t.clone();
    if (e.compareTo(i) < 0) {
        var r = e;
        e = i,
        i = r
    }
    var n = e.getLowestSetBit()
      , s = i.getLowestSetBit();
    if (0 > s)
        return e;
    for (s > n && (s = n),
    s > 0 && (e.rShiftTo(s, e),
    i.rShiftTo(s, i)); e.signum() > 0; )
        (n = e.getLowestSetBit()) > 0 && e.rShiftTo(n, e),
        (n = i.getLowestSetBit()) > 0 && i.rShiftTo(n, i),
        e.compareTo(i) >= 0 ? (e.subTo(i, e),
        e.rShiftTo(1, e)) : (i.subTo(e, i),
        i.rShiftTo(1, i));
    return s > 0 && i.lShiftTo(s, i),
    i
}
function bnpModInt(t) {
    if (0 >= t)
        return 0;
    var e = this.DV % t
      , i = this.s < 0 ? t - 1 : 0;
    if (this.t > 0)
        if (0 == e)
            i = this[0] % t;
        else
            for (var r = this.t - 1; r >= 0; --r)
                i = (e * i + this[r]) % t;
    return i
}
function bnModInverse(t) {
    var e = t.isEven();
    if (this.isEven() && e || 0 == t.signum())
        return BigInteger.ZERO;
    for (var i = t.clone(), r = this.clone(), n = nbv(1), s = nbv(0), o = nbv(0), a = nbv(1); 0 != i.signum(); ) {
        for (; i.isEven(); )
            i.rShiftTo(1, i),
            e ? (n.isEven() && s.isEven() || (n.addTo(this, n),
            s.subTo(t, s)),
            n.rShiftTo(1, n)) : s.isEven() || s.subTo(t, s),
            s.rShiftTo(1, s);
        for (; r.isEven(); )
            r.rShiftTo(1, r),
            e ? (o.isEven() && a.isEven() || (o.addTo(this, o),
            a.subTo(t, a)),
            o.rShiftTo(1, o)) : a.isEven() || a.subTo(t, a),
            a.rShiftTo(1, a);
        i.compareTo(r) >= 0 ? (i.subTo(r, i),
        e && n.subTo(o, n),
        s.subTo(a, s)) : (r.subTo(i, r),
        e && o.subTo(n, o),
        a.subTo(s, a))
    }
    return 0 != r.compareTo(BigInteger.ONE) ? BigInteger.ZERO : a.compareTo(t) >= 0 ? a.subtract(t) : a.signum() < 0 ? (a.addTo(t, a),
    a.signum() < 0 ? a.add(t) : a) : a
}
function bnIsProbablePrime(t) {
    var e, i = this.abs();
    if (1 == i.t && i[0] <= lowprimes[lowprimes.length - 1]) {
        for (e = 0; e < lowprimes.length; ++e)
            if (i[0] == lowprimes[e])
                return !0;
        return !1
    }
    if (i.isEven())
        return !1;
    for (e = 1; e < lowprimes.length; ) {
        for (var r = lowprimes[e], n = e + 1; n < lowprimes.length && lplim > r; )
            r *= lowprimes[n++];
        for (r = i.modInt(r); n > e; )
            if (r % lowprimes[e++] == 0)
                return !1
    }
    return i.millerRabin(t)
}
function bnpMillerRabin(t) {
    var e = this.subtract(BigInteger.ONE)
      , i = e.getLowestSetBit();
    if (0 >= i)
        return !1;
    var r = e.shiftRight(i);
    (t = t + 1 >> 1) > lowprimes.length && (t = lowprimes.length);
    for (var n = nbi(), s = 0; t > s; ++s) {
        n.fromInt(lowprimes[s]);
        var o = n.modPow(r, this);
        if (0 != o.compareTo(BigInteger.ONE) && 0 != o.compareTo(e)) {
            for (var a = 1; a++ < i && 0 != o.compareTo(e); )
                if (o = o.modPowInt(2, this),
                0 == o.compareTo(BigInteger.ONE))
                    return !1;
            if (0 != o.compareTo(e))
                return !1
        }
    }
    return !0
}
function parseBigInt(t, e) {
    return new BigInteger(t,e)
}
function linebrk(t, e) {
    for (var i = "", r = 0; r + e < t.length; )
        i += t.substring(r, r + e) + "\n",
        r += e;
    return i + t.substring(r, t.length)
}
function byte2Hex(t) {
    return 16 > t ? "0" + t.toString(16) : t.toString(16)
}
function pkcs1pad2(t, e) {
    if (e < t.length + 11)
        return alert("Message too long for RSA"),
        null ;
    for (var i = new Array, r = t.length - 1; r >= 0 && e > 0; ) {
        var n = t.charCodeAt(r--);
        128 > n ? i[--e] = n : n > 127 && 2048 > n ? (i[--e] = 63 & n | 128,
        i[--e] = n >> 6 | 192) : (i[--e] = 63 & n | 128,
        i[--e] = n >> 6 & 63 | 128,
        i[--e] = n >> 12 | 224)
    }
    i[--e] = 0;
    for (var s = new SecureRandom, o = new Array; e > 2; ) {
        for (o[0] = 0; 0 == o[0]; )
            s.nextBytes(o);
        i[--e] = o[0]
    }
    return i[--e] = 2,
    i[--e] = 0,
    new BigInteger(i)
}
function RSAKey() {
    this.n = null ,
    this.e = 0,
    this.d = null ,
    this.p = null ,
    this.q = null ,
    this.dmp1 = null ,
    this.dmq1 = null ,
    this.coeff = null
}
function RSASetPublic(t, e) {
    null != t && null != e && t.length > 0 && e.length > 0 ? (this.n = parseBigInt(t, 16),
    this.e = parseInt(e, 16)) : alert("Invalid RSA public key")
}
function RSADoPublic(t) {
    return t.modPowInt(this.e, this.n)
}
function RSAEncrypt(t) {
    var e = pkcs1pad2(t, this.n.bitLength() + 7 >> 3);
    if (null == e)
        return null ;
    var i = this.doPublic(e);
    if (null == i)
        return null ;
    var r = i.toString(16);
    return 0 == (1 & r.length) ? r : "0" + r
}
function pkcs1unpad2(t, e) {
    for (var i = t.toByteArray(), r = 0; r < i.length && 0 == i[r]; )
        ++r;
    if (i.length - r != e - 1 || 2 != i[r])
        return null ;
    for (++r; 0 != i[r]; )
        if (++r >= i.length)
            return null ;
    for (var n = ""; ++r < i.length; ) {
        var s = 255 & i[r];
        128 > s ? n += String.fromCharCode(s) : s > 191 && 224 > s ? (n += String.fromCharCode((31 & s) << 6 | 63 & i[r + 1]),
        ++r) : (n += String.fromCharCode((15 & s) << 12 | (63 & i[r + 1]) << 6 | 63 & i[r + 2]),
        r += 2)
    }
    return n
}
function RSASetPrivate(t, e, i) {
    null != t && null != e && t.length > 0 && e.length > 0 ? (this.n = parseBigInt(t, 16),
    this.e = parseInt(e, 16),
    this.d = parseBigInt(i, 16)) : alert("Invalid RSA private key")
}
function RSASetPrivateEx(t, e, i, r, n, s, o, a) {
    null != t && null != e && t.length > 0 && e.length > 0 ? (this.n = parseBigInt(t, 16),
    this.e = parseInt(e, 16),
    this.d = parseBigInt(i, 16),
    this.p = parseBigInt(r, 16),
    this.q = parseBigInt(n, 16),
    this.dmp1 = parseBigInt(s, 16),
    this.dmq1 = parseBigInt(o, 16),
    this.coeff = parseBigInt(a, 16)) : alert("Invalid RSA private key")
}
function RSAGenerate(t, e) {
    var i = new SecureRandom
      , r = t >> 1;
    this.e = parseInt(e, 16);
    for (var n = new BigInteger(e,16); ; ) {
        for (; this.p = new BigInteger(t - r,1,i),
        0 != this.p.subtract(BigInteger.ONE).gcd(n).compareTo(BigInteger.ONE) || !this.p.isProbablePrime(10); )
            ;
        for (; this.q = new BigInteger(r,1,i),
        0 != this.q.subtract(BigInteger.ONE).gcd(n).compareTo(BigInteger.ONE) || !this.q.isProbablePrime(10); )
            ;
        if (this.p.compareTo(this.q) <= 0) {
            var s = this.p;
            this.p = this.q,
            this.q = s
        }
        var o = this.p.subtract(BigInteger.ONE)
          , a = this.q.subtract(BigInteger.ONE)
          , h = o.multiply(a);
        if (0 == h.gcd(n).compareTo(BigInteger.ONE)) {
            this.n = this.p.multiply(this.q),
            this.d = n.modInverse(h),
            this.dmp1 = this.d.mod(o),
            this.dmq1 = this.d.mod(a),
            this.coeff = this.q.modInverse(this.p);
            break
        }
    }
}
function RSADoPrivate(t) {
    if (null == this.p || null == this.q)
        return t.modPow(this.d, this.n);
    for (var e = t.mod(this.p).modPow(this.dmp1, this.p), i = t.mod(this.q).modPow(this.dmq1, this.q); e.compareTo(i) < 0; )
        e = e.add(this.p);
    return e.subtract(i).multiply(this.coeff).mod(this.p).multiply(this.q).add(i)
}
function RSADecrypt(t) {
    var e = parseBigInt(t, 16)
      , i = this.doPrivate(e);
    return null == i ? null : pkcs1unpad2(i, this.n.bitLength() + 7 >> 3)
}
function _asnhex_getByteLengthOfL_AtObj(t, e) {
    if ("8" != t.substring(e + 2, e + 3))
        return 1;
    var i = parseInt(t.substring(e + 3, e + 4));
    return 0 == i ? -1 : i > 0 && 10 > i ? i + 1 : -2
}
function _asnhex_getHexOfL_AtObj(t, e) {
    var i = _asnhex_getByteLengthOfL_AtObj(t, e);
    return 1 > i ? "" : t.substring(e + 2, e + 2 + 2 * i)
}
function _asnhex_getIntOfL_AtObj(t, e) {
    var i = _asnhex_getHexOfL_AtObj(t, e);
    if ("" == i)
        return -1;
    var r;
    return r = parseInt(i.substring(0, 1)) < 8 ? parseBigInt(i, 16) : parseBigInt(i.substring(2), 16),
    r.intValue()
}
function _asnhex_getStartPosOfV_AtObj(t, e) {
    var i = _asnhex_getByteLengthOfL_AtObj(t, e);
    return 0 > i ? i : e + 2 * (i + 1)
}
function _asnhex_getHexOfV_AtObj(t, e) {
    var i = _asnhex_getStartPosOfV_AtObj(t, e)
      , r = _asnhex_getIntOfL_AtObj(t, e);
    return t.substring(i, i + 2 * r)
}
function _asnhex_getPosOfNextSibling_AtObj(t, e) {
    return _asnhex_getStartPosOfV_AtObj(t, e) + 2 * _asnhex_getIntOfL_AtObj(t, e)
}
function _asnhex_getPosArrayOfChildren_AtObj(t, e) {
    var i = new Array
      , r = _asnhex_getStartPosOfV_AtObj(t, e);
    i.push(r);
    for (var n = _asnhex_getIntOfL_AtObj(t, e), s = r, o = 0; ; ) {
        var a = _asnhex_getPosOfNextSibling_AtObj(t, s);
        if (null == a || a - r >= 2 * n)
            break;
        if (o >= 200)
            break;
        i.push(a),
        s = a,
        o++
    }
    return i
}
function _rsapem_pemToBase64(t) {
    var e = t;
    return e = e.replace("-----BEGIN RSA PRIVATE KEY-----", ""),
    e = e.replace("-----END RSA PRIVATE KEY-----", ""),
    e = e.replace(/[ \n]+/g, "")
}
function _rsapem_getPosArrayOfChildrenFromHex(t) {
    var e = new Array
      , i = _asnhex_getStartPosOfV_AtObj(t, 0)
      , r = _asnhex_getPosOfNextSibling_AtObj(t, i)
      , n = _asnhex_getPosOfNextSibling_AtObj(t, r)
      , s = _asnhex_getPosOfNextSibling_AtObj(t, n)
      , o = _asnhex_getPosOfNextSibling_AtObj(t, s)
      , a = _asnhex_getPosOfNextSibling_AtObj(t, o)
      , h = _asnhex_getPosOfNextSibling_AtObj(t, a)
      , c = _asnhex_getPosOfNextSibling_AtObj(t, h)
      , u = _asnhex_getPosOfNextSibling_AtObj(t, c);
    return e.push(i, r, n, s, o, a, h, c, u),
    e
}
function _rsapem_getHexValueArrayOfChildrenFromHex(t) {
    var e = _rsapem_getPosArrayOfChildrenFromHex(t)
      , i = _asnhex_getHexOfV_AtObj(t, e[0])
      , r = _asnhex_getHexOfV_AtObj(t, e[1])
      , n = _asnhex_getHexOfV_AtObj(t, e[2])
      , s = _asnhex_getHexOfV_AtObj(t, e[3])
      , o = _asnhex_getHexOfV_AtObj(t, e[4])
      , a = _asnhex_getHexOfV_AtObj(t, e[5])
      , h = _asnhex_getHexOfV_AtObj(t, e[6])
      , c = _asnhex_getHexOfV_AtObj(t, e[7])
      , u = _asnhex_getHexOfV_AtObj(t, e[8])
      , l = new Array;
    return l.push(i, r, n, s, o, a, h, c, u),
    l
}
function _rsapem_readPrivateKeyFromPEMString(t) {
    var e = _rsapem_pemToBase64(t)
      , i = b64tohex(e)
      , r = _rsapem_getHexValueArrayOfChildrenFromHex(i);
    this.setPrivateEx(r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8])
}
function _rsasign_getHexPaddedDigestInfoForString(t, e, i) {
    for (var r = e / 4, n = _RSASIGN_HASHHEXFUNC[i], s = n(t), o = "0001", a = "00" + _RSASIGN_DIHEAD[i] + s, h = "", c = r - o.length - a.length, u = 0; c > u; u += 2)
        h += "ff";
    return o + h + a
}
function _rsasign_signString(t, e) {
    var i = _rsasign_getHexPaddedDigestInfoForString(t, this.n.bitLength(), e)
      , r = parseBigInt(i, 16);
    return this.doPrivate(r).toString(16)
}
function _rsasign_signStringWithSHA1(t) {
    var e = _rsasign_getHexPaddedDigestInfoForString(t, this.n.bitLength(), "sha1")
      , i = parseBigInt(e, 16);
    return this.doPrivate(i).toString(16)
}
function _rsasign_signStringWithSHA256(t) {
    var e = _rsasign_getHexPaddedDigestInfoForString(t, this.n.bitLength(), "sha256")
      , i = parseBigInt(e, 16);
    return this.doPrivate(i).toString(16)
}
function _rsasign_getDecryptSignatureBI(t, e, i) {
    var r = new RSAKey;
    return r.setPublic(e, i),
    r.doPublic(t)
}
function _rsasign_getHexDigestInfoFromSig(t, e, i) {
    return _rsasign_getDecryptSignatureBI(t, e, i).toString(16).replace(/^1f+00/, "")
}
function _rsasign_getAlgNameAndHashFromHexDisgestInfo(t) {
    for (var e in _RSASIGN_DIHEAD) {
        var i = _RSASIGN_DIHEAD[e]
          , r = i.length;
        if (t.substring(0, r) == i) {
            return [e, t.substring(r)]
        }
    }
    return []
}
function _rsasign_verifySignatureWithArgs(t, e, i, r) {
    var n = _rsasign_getHexDigestInfoFromSig(e, i, r)
      , s = _rsasign_getAlgNameAndHashFromHexDisgestInfo(n);
    if (0 == s.length)
        return !1;
    var o = s[0];
    return s[1] == (0,
    _RSASIGN_HASHHEXFUNC[o])(t)
}
function _rsasign_verifyHexSignatureForMessage(t, e) {
    return _rsasign_verifySignatureWithArgs(e, parseBigInt(t, 16), this.n.toString(16), this.e.toString(16))
}
function _rsasign_verifyString(t, e) {
    e = e.replace(/[ \n]+/g, "");
    var i = parseBigInt(e, 16)
      , r = this.doPublic(i)
      , n = r.toString(16).replace(/^1f+00/, "")
      , s = _rsasign_getAlgNameAndHashFromHexDisgestInfo(n);
    if (0 == s.length)
        return !1;
    var o = s[0];
    return s[1] == (0,
    _RSASIGN_HASHHEXFUNC[o])(t)
}
function _x509_pemToBase64(t) {
    var e = t;
    return e = e.replace("-----BEGIN CERTIFICATE-----", ""),
    e = e.replace("-----END CERTIFICATE-----", ""),
    e = e.replace(/[ \n]+/g, "")
}
function _x509_pemToHex(t) {
    return b64tohex(_x509_pemToBase64(t))
}
function _x509_getHexTbsCertificateFromCert(t) {
    return _asnhex_getStartPosOfV_AtObj(t, 0)
}
function _x509_getSubjectPublicKeyInfoPosFromCertHex(t) {
    var e = _asnhex_getStartPosOfV_AtObj(t, 0)
      , i = _asnhex_getPosArrayOfChildren_AtObj(t, e);
    return i.length < 1 ? -1 : "a003020102" == t.substring(i[0], i[0] + 10) ? i.length < 6 ? -1 : i[6] : i.length < 5 ? -1 : i[5]
}
function _x509_getSubjectPublicKeyPosFromCertHex(t) {
    var e = _x509_getSubjectPublicKeyInfoPosFromCertHex(t);
    if (-1 == e)
        return -1;
    var i = _asnhex_getPosArrayOfChildren_AtObj(t, e);
    if (2 != i.length)
        return -1;
    var r = i[1];
    if ("03" != t.substring(r, r + 2))
        return -1;
    var n = _asnhex_getStartPosOfV_AtObj(t, r);
    return "00" != t.substring(n, n + 2) ? -1 : n + 2
}
function _x509_getPublicKeyHexArrayFromCertHex(t) {
    var e = _x509_getSubjectPublicKeyPosFromCertHex(t)
      , i = _asnhex_getPosArrayOfChildren_AtObj(t, e);
    if (2 != i.length)
        return [];
    var r = _asnhex_getHexOfV_AtObj(t, i[0])
      , n = _asnhex_getHexOfV_AtObj(t, i[1]);
    return null != r && null != n ? [r, n] : []
}
function _x509_getPublicKeyHexArrayFromCertPEM(t) {
    return _x509_getPublicKeyHexArrayFromCertHex(_x509_pemToHex(t))
}
function _x509_readCertPEM(t) {
    var e = _x509_pemToHex(t)
      , i = _x509_getPublicKeyHexArrayFromCertHex(e)
      , r = new RSAKey;
    r.setPublic(i[0], i[1]),
    this.subjectPublicKeyRSA = r,
    this.subjectPublicKeyRSA_hN = i[0],
    this.subjectPublicKeyRSA_hE = i[1]
}
function _x509_readCertPEMWithoutRSAInit(t) {
    var e = _x509_pemToHex(t)
      , i = _x509_getPublicKeyHexArrayFromCertHex(e);
    this.subjectPublicKeyRSA.setPublic(i[0], i[1]),
    this.subjectPublicKeyRSA_hN = i[0],
    this.subjectPublicKeyRSA_hE = i[1]
}
function X509() {
    this.subjectPublicKeyRSA = null ,
    this.subjectPublicKeyRSA_hN = null ,
    this.subjectPublicKeyRSA_hE = null
}
var sjcl = {
    cipher: {},
    hash: {},
    mode: {},
    misc: {},
    codec: {},
    exception: {
        corrupt: function(t) {
            this.toString = function() {
                return "CORRUPT: " + this.message
            }
            ,
            this.message = t
        },
        invalid: function(t) {
            this.toString = function() {
                return "INVALID: " + this.message
            }
            ,
            this.message = t
        },
        bug: function(t) {
            this.toString = function() {
                return "BUG: " + this.message
            }
            ,
            this.message = t
        }
    }
};
sjcl.cipher.aes = function(t) {
    this.h[0][0][0] || this.w();
    var e, i, r, n, s = this.h[0][4], o = this.h[1];
    e = t.length;
    var a = 1;
    if (4 !== e && 6 !== e && 8 !== e)
        throw new sjcl.exception.invalid("invalid aes key size");
    for (this.a = [r = t.slice(0), n = []],
    t = e; 4 * e + 28 > t; t++)
        i = r[t - 1],
        (t % e == 0 || 8 === e && t % e == 4) && (i = s[i >>> 24] << 24 ^ s[i >> 16 & 255] << 16 ^ s[i >> 8 & 255] << 8 ^ s[255 & i],
        t % e == 0 && (i = i << 8 ^ i >>> 24 ^ a << 24,
        a = a << 1 ^ 283 * (a >> 7))),
        r[t] = r[t - e] ^ i;
    for (e = 0; t; e++,
    t--)
        i = r[3 & e ? t : t - 4],
        n[e] = 4 >= t || 4 > e ? i : o[0][s[i >>> 24]] ^ o[1][s[i >> 16 & 255]] ^ o[2][s[i >> 8 & 255]] ^ o[3][s[255 & i]]
}
,
sjcl.cipher.aes.prototype = {
    encrypt: function(t) {
        return this.H(t, 0)
    },
    decrypt: function(t) {
        return this.H(t, 1)
    },
    h: [[[], [], [], [], []], [[], [], [], [], []]],
    w: function() {
        var t, e, i, r, n, s, o, a = this.h[0], h = this.h[1], c = a[4], u = h[4], l = [], p = [];
        for (t = 0; 256 > t; t++)
            p[(l[t] = t << 1 ^ 283 * (t >> 7)) ^ t] = t;
        for (e = i = 0; !c[e]; e ^= r || 1,
        i = p[i] || 1)
            for (s = i ^ i << 1 ^ i << 2 ^ i << 3 ^ i << 4,
            s = s >> 8 ^ 255 & s ^ 99,
            c[e] = s,
            u[s] = e,
            n = l[t = l[r = l[e]]],
            o = 16843009 * n ^ 65537 * t ^ 257 * r ^ 16843008 * e,
            n = 257 * l[s] ^ 16843008 * s,
            t = 0; 4 > t; t++)
                a[t][e] = n = n << 24 ^ n >>> 8,
                h[t][s] = o = o << 24 ^ o >>> 8;
        for (t = 0; 5 > t; t++)
            a[t] = a[t].slice(0),
            h[t] = h[t].slice(0)
    },
    H: function(t, e) {
        if (4 !== t.length)
            throw new sjcl.exception.invalid("invalid aes block size");
        var i = this.a[e]
          , r = t[0] ^ i[0]
          , n = t[e ? 3 : 1] ^ i[1]
          , s = t[2] ^ i[2];
        t = t[e ? 1 : 3] ^ i[3];
        var o, a, h, c, u = i.length / 4 - 2, l = 4, p = [0, 0, 0, 0];
        o = this.h[e];
        var f = o[0]
          , g = o[1]
          , b = o[2]
          , m = o[3]
          , d = o[4];
        for (c = 0; u > c; c++)
            o = f[r >>> 24] ^ g[n >> 16 & 255] ^ b[s >> 8 & 255] ^ m[255 & t] ^ i[l],
            a = f[n >>> 24] ^ g[s >> 16 & 255] ^ b[t >> 8 & 255] ^ m[255 & r] ^ i[l + 1],
            h = f[s >>> 24] ^ g[t >> 16 & 255] ^ b[r >> 8 & 255] ^ m[255 & n] ^ i[l + 2],
            t = f[t >>> 24] ^ g[r >> 16 & 255] ^ b[n >> 8 & 255] ^ m[255 & s] ^ i[l + 3],
            l += 4,
            r = o,
            n = a,
            s = h;
        for (c = 0; 4 > c; c++)
            p[e ? 3 & -c : c] = d[r >>> 24] << 24 ^ d[n >> 16 & 255] << 16 ^ d[s >> 8 & 255] << 8 ^ d[255 & t] ^ i[l++],
            o = r,
            r = n,
            n = s,
            s = t,
            t = o;
        return p
    }
},
sjcl.bitArray = {
    bitSlice: function(t, e, i) {
        return t = sjcl.bitArray.P(t.slice(e / 32), 32 - (31 & e)).slice(1),
        void 0 === i ? t : sjcl.bitArray.clamp(t, i - e)
    },
    concat: function(t, e) {
        if (0 === t.length || 0 === e.length)
            return t.concat(e);
        var i = t[t.length - 1]
          , r = sjcl.bitArray.getPartial(i);
        return 32 === r ? t.concat(e) : sjcl.bitArray.P(e, r, 0 | i, t.slice(0, t.length - 1))
    },
    bitLength: function(t) {
        var e = t.length;
        return 0 === e ? 0 : 32 * (e - 1) + sjcl.bitArray.getPartial(t[e - 1])
    },
    clamp: function(t, e) {
        if (32 * t.length < e)
            return t;
        t = t.slice(0, Math.ceil(e / 32));
        var i = t.length;
        return e &= 31,
        i > 0 && e && (t[i - 1] = sjcl.bitArray.partial(e, t[i - 1] & 2147483648 >> e - 1, 1)),
        t
    },
    partial: function(t, e, i) {
        return 32 === t ? e : (i ? 0 | e : e << 32 - t) + 1099511627776 * t
    },
    getPartial: function(t) {
        return Math.round(t / 1099511627776) || 32
    },
    equal: function(t, e) {
        if (sjcl.bitArray.bitLength(t) !== sjcl.bitArray.bitLength(e))
            return !1;
        var i, r = 0;
        for (i = 0; i < t.length; i++)
            r |= t[i] ^ e[i];
        return 0 === r
    },
    P: function(t, e, i, r) {
        var n;
        for (n = 0,
        void 0 === r && (r = []); e >= 32; e -= 32)
            r.push(i),
            i = 0;
        if (0 === e)
            return r.concat(t);
        for (n = 0; n < t.length; n++)
            r.push(i | t[n] >>> e),
            i = t[n] << 32 - e;
        return n = t.length ? t[t.length - 1] : 0,
        t = sjcl.bitArray.getPartial(n),
        r.push(sjcl.bitArray.partial(e + t & 31, e + t > 32 ? i : r.pop(), 1)),
        r
    },
    k: function(t, e) {
        return [t[0] ^ e[0], t[1] ^ e[1], t[2] ^ e[2], t[3] ^ e[3]]
    }
},
sjcl.codec.utf8String = {
    fromBits: function(t) {
        var e, i, r = "", n = sjcl.bitArray.bitLength(t);
        for (e = 0; n / 8 > e; e++)
            0 == (3 & e) && (i = t[e / 4]),
            r += String.fromCharCode(i >>> 24),
            i <<= 8;
        return decodeURIComponent(escape(r))
    },
    toBits: function(t) {
        t = unescape(encodeURIComponent(t));
        var e, i = [], r = 0;
        for (e = 0; e < t.length; e++)
            r = r << 8 | t.charCodeAt(e),
            3 == (3 & e) && (i.push(r),
            r = 0);
        return 3 & e && i.push(sjcl.bitArray.partial(8 * (3 & e), r)),
        i
    }
},
sjcl.codec.hex = {
    fromBits: function(t) {
        var e, i = "";
        for (e = 0; e < t.length; e++)
            i += (0xf00000000000 + (0 | t[e])).toString(16).substr(4);
        return i.substr(0, sjcl.bitArray.bitLength(t) / 4)
    },
    toBits: function(t) {
        var e, i, r = [];
        for (t = t.replace(/\s|0x/g, ""),
        i = t.length,
        t += "00000000",
        e = 0; e < t.length; e += 8)
            r.push(0 ^ parseInt(t.substr(e, 8), 16));
        return sjcl.bitArray.clamp(r, 4 * i)
    }
},
sjcl.codec.base64 = {
    D: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    fromBits: function(t, e) {
        var i, r = "", n = 0, s = sjcl.codec.base64.D, o = 0, a = sjcl.bitArray.bitLength(t);
        for (i = 0; 6 * r.length < a; )
            r += s.charAt((o ^ t[i] >>> n) >>> 26),
            6 > n ? (o = t[i] << 6 - n,
            n += 26,
            i++) : (o <<= 6,
            n -= 6);
        for (; 3 & r.length && !e; )
            r += "=";
        return r
    },
    toBits: function(t) {
        t = t.replace(/\s|=/g, "");
        var e, i, r = [], n = 0, s = sjcl.codec.base64.D, o = 0;
        for (e = 0; e < t.length; e++) {
            if (0 > (i = s.indexOf(t.charAt(e))))
                throw new sjcl.exception.invalid("this isn't base64!");
            n > 26 ? (n -= 26,
            r.push(o ^ i >>> n),
            o = i << 32 - n) : (n += 6,
            o ^= i << 32 - n)
        }
        return 56 & n && r.push(sjcl.bitArray.partial(56 & n, o, 1)),
        r
    }
},
sjcl.hash.sha256 = function(t) {
    this.a[0] || this.w(),
    t ? (this.n = t.n.slice(0),
    this.i = t.i.slice(0),
    this.e = t.e) : this.reset()
}
,
sjcl.hash.sha256.hash = function(t) {
    return (new sjcl.hash.sha256).update(t).finalize()
}
,
sjcl.hash.sha256.prototype = {
    blockSize: 512,
    reset: function() {
        return this.n = this.N.slice(0),
        this.i = [],
        this.e = 0,
        this
    },
    update: function(t) {
        "string" == typeof t && (t = sjcl.codec.utf8String.toBits(t));
        var e, i = this.i = sjcl.bitArray.concat(this.i, t);
        for (e = this.e,
        t = this.e = e + sjcl.bitArray.bitLength(t),
        e = 512 + e & -512; t >= e; e += 512)
            this.C(i.splice(0, 16));
        return this
    },
    finalize: function() {
        var t, e = this.i, i = this.n;
        for (e = sjcl.bitArray.concat(e, [sjcl.bitArray.partial(1, 1)]),
        t = e.length + 2; 15 & t; t++)
            e.push(0);
        for (e.push(Math.floor(this.e / 4294967296)),
        e.push(0 | this.e); e.length; )
            this.C(e.splice(0, 16));
        return this.reset(),
        i
    },
    N: [],
    a: [],
    w: function() {
        function t(t) {
            return 4294967296 * (t - Math.floor(t)) | 0
        }
        var e, i = 0, r = 2;
        t: for (; 64 > i; r++) {
            for (e = 2; r >= e * e; e++)
                if (r % e == 0)
                    continue t;
            8 > i && (this.N[i] = t(Math.pow(r, .5))),
            this.a[i] = t(Math.pow(r, 1 / 3)),
            i++
        }
    },
    C: function(t) {
        var e, i, r = t.slice(0), n = this.n, s = this.a, o = n[0], a = n[1], h = n[2], c = n[3], u = n[4], l = n[5], p = n[6], f = n[7];
        for (t = 0; 64 > t; t++)
            16 > t ? e = r[t] : (e = r[t + 1 & 15],
            i = r[t + 14 & 15],
            e = r[15 & t] = (e >>> 7 ^ e >>> 18 ^ e >>> 3 ^ e << 25 ^ e << 14) + (i >>> 17 ^ i >>> 19 ^ i >>> 10 ^ i << 15 ^ i << 13) + r[15 & t] + r[t + 9 & 15] | 0),
            e = e + f + (u >>> 6 ^ u >>> 11 ^ u >>> 25 ^ u << 26 ^ u << 21 ^ u << 7) + (p ^ u & (l ^ p)) + s[t],
            f = p,
            p = l,
            l = u,
            u = c + e | 0,
            c = h,
            h = a,
            a = o,
            o = e + (a & h ^ c & (a ^ h)) + (a >>> 2 ^ a >>> 13 ^ a >>> 22 ^ a << 30 ^ a << 19 ^ a << 10) | 0;
        n[0] = n[0] + o | 0,
        n[1] = n[1] + a | 0,
        n[2] = n[2] + h | 0,
        n[3] = n[3] + c | 0,
        n[4] = n[4] + u | 0,
        n[5] = n[5] + l | 0,
        n[6] = n[6] + p | 0,
        n[7] = n[7] + f | 0
    }
},
sjcl.mode.ccm = {
    name: "ccm",
    encrypt: function(t, e, i, r, n) {
        var s, o = e.slice(0), a = sjcl.bitArray, h = a.bitLength(i) / 8, c = a.bitLength(o) / 8;
        if (n = n || 64,
        r = r || [],
        7 > h)
            throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");
        for (s = 2; 4 > s && c >>> 8 * s; s++)
            ;
        return 15 - h > s && (s = 15 - h),
        i = a.clamp(i, 8 * (15 - s)),
        e = sjcl.mode.ccm.G(t, e, i, r, n, s),
        o = sjcl.mode.ccm.I(t, o, i, e, n, s),
        a.concat(o.data, o.tag)
    },
    decrypt: function(t, e, i, r, n) {
        n = n || 64,
        r = r || [];
        var s = sjcl.bitArray
          , o = s.bitLength(i) / 8
          , a = s.bitLength(e)
          , h = s.clamp(e, a - n)
          , c = s.bitSlice(e, a - n);
        if (a = (a - n) / 8,
        7 > o)
            throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");
        for (e = 2; 4 > e && a >>> 8 * e; e++)
            ;
        if (15 - o > e && (e = 15 - o),
        i = s.clamp(i, 8 * (15 - e)),
        h = sjcl.mode.ccm.I(t, h, i, c, n, e),
        t = sjcl.mode.ccm.G(t, h.data, i, r, n, e),
        !s.equal(h.tag, t))
            throw new sjcl.exception.corrupt("ccm: tag doesn't match");
        return h.data
    },
    G: function(t, e, i, r, n, s) {
        var o = []
          , a = sjcl.bitArray
          , h = a.k;
        if ((n /= 8) % 2 || 4 > n || n > 16)
            throw new sjcl.exception.invalid("ccm: invalid tag length");
        if (r.length > 4294967295 || e.length > 4294967295)
            throw new sjcl.exception.bug("ccm: can't deal with 4GiB or more data");
        if (s = [a.partial(8, (r.length ? 64 : 0) | n - 2 << 2 | s - 1)],
        s = a.concat(s, i),
        s[3] |= a.bitLength(e) / 8,
        s = t.encrypt(s),
        r.length)
            for (i = a.bitLength(r) / 8,
            65279 >= i ? o = [a.partial(16, i)] : 4294967295 >= i && (o = a.concat([a.partial(16, 65534)], [i])),
            o = a.concat(o, r),
            r = 0; r < o.length; r += 4)
                s = t.encrypt(h(s, o.slice(r, r + 4)));
        for (r = 0; r < e.length; r += 4)
            s = t.encrypt(h(s, e.slice(r, r + 4)));
        return a.clamp(s, 8 * n)
    },
    I: function(t, e, i, r, n, s) {
        var o, a = sjcl.bitArray;
        o = a.k;
        var h = e.length
          , c = a.bitLength(e);
        if (i = a.concat([a.partial(8, s - 1)], i).concat([0, 0, 0]).slice(0, 4),
        r = a.bitSlice(o(r, t.encrypt(i)), 0, n),
        !h)
            return {
                tag: r,
                data: []
            };
        for (o = 0; h > o; o += 4)
            i[3]++,
            n = t.encrypt(i),
            e[o] ^= n[0],
            e[o + 1] ^= n[1],
            e[o + 2] ^= n[2],
            e[o + 3] ^= n[3];
        return {
            tag: r,
            data: a.clamp(e, c)
        }
    }
},
sjcl.mode.ocb2 = {
    name: "ocb2",
    encrypt: function(t, e, i, r, n, s) {
        if (128 !== sjcl.bitArray.bitLength(i))
            throw new sjcl.exception.invalid("ocb iv must be 128 bits");
        var o, a = sjcl.mode.ocb2.A, h = sjcl.bitArray, c = h.k, u = [0, 0, 0, 0];
        i = a(t.encrypt(i));
        var l, p = [];
        for (r = r || [],
        n = n || 64,
        o = 0; o + 4 < e.length; o += 4)
            l = e.slice(o, o + 4),
            u = c(u, l),
            p = p.concat(c(i, t.encrypt(c(i, l)))),
            i = a(i);
        return l = e.slice(o),
        e = h.bitLength(l),
        o = t.encrypt(c(i, [0, 0, 0, e])),
        l = h.clamp(c(l, o), e),
        u = c(u, c(l, o)),
        u = t.encrypt(c(u, c(i, a(i)))),
        r.length && (u = c(u, s ? r : sjcl.mode.ocb2.pmac(t, r))),
        p.concat(h.concat(l, h.clamp(u, n)))
    },
    decrypt: function(t, e, i, r, n, s) {
        if (128 !== sjcl.bitArray.bitLength(i))
            throw new sjcl.exception.invalid("ocb iv must be 128 bits");
        n = n || 64;
        var o, a, h = sjcl.mode.ocb2.A, c = sjcl.bitArray, u = c.k, l = [0, 0, 0, 0], p = h(t.encrypt(i)), f = sjcl.bitArray.bitLength(e) - n, g = [];
        for (r = r || [],
        i = 0; f / 32 > i + 4; i += 4)
            o = u(p, t.decrypt(u(p, e.slice(i, i + 4)))),
            l = u(l, o),
            g = g.concat(o),
            p = h(p);
        if (a = f - 32 * i,
        o = t.encrypt(u(p, [0, 0, 0, a])),
        o = u(o, c.clamp(e.slice(i), a)),
        l = u(l, o),
        l = t.encrypt(u(l, u(p, h(p)))),
        r.length && (l = u(l, s ? r : sjcl.mode.ocb2.pmac(t, r))),
        !c.equal(c.clamp(l, n), c.bitSlice(e, f)))
            throw new sjcl.exception.corrupt("ocb: tag doesn't match");
        return g.concat(c.clamp(o, a))
    },
    pmac: function(t, e) {
        var i, r = sjcl.mode.ocb2.A, n = sjcl.bitArray, s = n.k, o = [0, 0, 0, 0], a = t.encrypt([0, 0, 0, 0]);
        for (a = s(a, r(r(a))),
        i = 0; i + 4 < e.length; i += 4)
            a = r(a),
            o = s(o, t.encrypt(s(a, e.slice(i, i + 4))));
        return e = e.slice(i),
        n.bitLength(e) < 128 && (a = s(a, r(a)),
        e = n.concat(e, [-2147483648])),
        o = s(o, e),
        t.encrypt(s(r(s(a, r(a))), o))
    },
    A: function(t) {
        return [t[0] << 1 ^ t[1] >>> 31, t[1] << 1 ^ t[2] >>> 31, t[2] << 1 ^ t[3] >>> 31, t[3] << 1 ^ 135 * (t[0] >>> 31)]
    }
},
sjcl.misc.hmac = function(t, e) {
    this.M = e = e || sjcl.hash.sha256;
    var i = [[], []]
      , r = e.prototype.blockSize / 32;
    for (this.l = [new e, new e],
    t.length > r && (t = e.hash(t)),
    e = 0; r > e; e++)
        i[0][e] = 909522486 ^ t[e],
        i[1][e] = 1549556828 ^ t[e];
    this.l[0].update(i[0]),
    this.l[1].update(i[1])
}
,
sjcl.misc.hmac.prototype.encrypt = sjcl.misc.hmac.prototype.mac = function(t, e) {
    return t = new this.M(this.l[0]).update(t, e).finalize(),
    new this.M(this.l[1]).update(t).finalize()
}
,
sjcl.misc.pbkdf2 = function(t, e, i, r, n) {
    if (i = i || 1e3,
    0 > r || 0 > i)
        throw sjcl.exception.invalid("invalid params to pbkdf2");
    "string" == typeof t && (t = sjcl.codec.utf8String.toBits(t)),
    n = n || sjcl.misc.hmac,
    t = new n(t);
    var s, o, a, h, c = [], u = sjcl.bitArray;
    for (h = 1; 32 * c.length < (r || 1); h++) {
        for (n = s = t.encrypt(u.concat(e, [h])),
        o = 1; i > o; o++)
            for (s = t.encrypt(s),
            a = 0; a < s.length; a++)
                n[a] ^= s[a];
        c = c.concat(n)
    }
    return r && (c = u.clamp(c, r)),
    c
}
,
sjcl.random = {
    randomWords: function(t, e) {
        var i = [];
        e = this.isReady(e);
        var r;
        if (0 === e)
            throw new sjcl.exception.notready("generator isn't seeded");
        for (2 & e && this.U(!(1 & e)),
        e = 0; t > e; e += 4)
            (e + 1) % 65536 == 0 && this.L(),
            r = this.u(),
            i.push(r[0], r[1], r[2], r[3]);
        return this.L(),
        i.slice(0, t)
    },
    setDefaultParanoia: function(t) {
        this.t = t
    },
    addEntropy: function(t, e, i) {
        i = i || "user";
        var r, n, s = (new Date).valueOf(), o = this.q[i], a = this.isReady();
        switch (r = this.F[i],
        void 0 === r && (r = this.F[i] = this.R++),
        void 0 === o && (o = this.q[i] = 0),
        this.q[i] = (this.q[i] + 1) % this.b.length,
        typeof t) {
        case "number":
            break;
        case "object":
            if (void 0 === e)
                for (i = e = 0; i < t.length; i++)
                    for (n = t[i]; n > 0; )
                        e++,
                        n >>>= 1;
            this.b[o].update([r, this.J++, 2, e, s, t.length].concat(t));
            break;
        case "string":
            void 0 === e && (e = t.length),
            this.b[o].update([r, this.J++, 3, e, s, t.length]),
            this.b[o].update(t);
            break;
        default:
            throw new sjcl.exception.bug("random: addEntropy only supports number, array or string")
        }
        this.j[o] += e,
        this.f += e,
        0 === a && (0 !== this.isReady() && this.K("seeded", Math.max(this.g, this.f)),
        this.K("progress", this.getProgress()))
    },
    isReady: function(t) {
        return t = this.B[void 0 !== t ? t : this.t],
        this.g && this.g >= t ? this.j[0] > 80 && (new Date).valueOf() > this.O ? 3 : 1 : this.f >= t ? 2 : 0
    },
    getProgress: function(t) {
        return t = this.B[t || this.t],
        this.g >= t ? 1[0] : this.f > t ? 1[0] : this.f / t
    },
    startCollectors: function() {
        if (!this.m) {
            if (addEventListener)
                addEventListener("load", this.o, !1),
                addEventListener("mousemove", this.p, !1);
            else {
                if (!document.attachEvent)
                    throw new sjcl.exception.bug("can't attach event");
                document.attachEvent("onload", this.o),
                document.attachEvent("onmousemove", this.p)
            }
            this.m = !0
        }
    },
    stopCollectors: function() {
        this.m && (removeEventListener ? (removeEventListener("load", this.o),
        removeEventListener("mousemove", this.p)) : detachEvent && (detachEvent("onload", this.o),
        detachEvent("onmousemove", this.p)),
        this.m = !1)
    },
    addEventListener: function(t, e) {
        this.r[t][this.Q++] = e
    },
    removeEventListener: function(t, e) {
        var i;
        t = this.r[t];
        var r = [];
        for (i in t)
            t.hasOwnProperty[i] && t[i] === e && r.push(i);
        for (e = 0; e < r.length; e++)
            i = r[e],
            delete t[i]
    },
    b: [new sjcl.hash.sha256],
    j: [0],
    z: 0,
    q: {},
    J: 0,
    F: {},
    R: 0,
    g: 0,
    f: 0,
    O: 0,
    a: [0, 0, 0, 0, 0, 0, 0, 0],
    d: [0, 0, 0, 0],
    s: void 0,
    t: 6,
    m: !1,
    r: {
        progress: {},
        seeded: {}
    },
    Q: 0,
    B: [0, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024],
    u: function() {
        for (var t = 0; 4 > t && (this.d[t] = this.d[t] + 1 | 0,
        !this.d[t]); t++)
            ;
        return this.s.encrypt(this.d)
    },
    L: function() {
        this.a = this.u().concat(this.u()),
        this.s = new sjcl.cipher.aes(this.a)
    },
    T: function(t) {
        for (this.a = sjcl.hash.sha256.hash(this.a.concat(t)),
        this.s = new sjcl.cipher.aes(this.a),
        t = 0; 4 > t && (this.d[t] = this.d[t] + 1 | 0,
        !this.d[t]); t++)
            ;
    },
    U: function(t) {
        var e, i = [], r = 0;
        for (this.O = i[0] = (new Date).valueOf() + 3e4,
        e = 0; 16 > e; e++)
            i.push(4294967296 * Math.random() | 0);
        for (e = 0; e < this.b.length && (i = i.concat(this.b[e].finalize()),
        r += this.j[e],
        this.j[e] = 0,
        t || !(this.z & 1 << e)); e++)
            ;
        this.z >= 1 << this.b.length && (this.b.push(new sjcl.hash.sha256),
        this.j.push(0)),
        this.f -= r,
        r > this.g && (this.g = r),
        this.z++,
        this.T(i)
    },
    p: function(t) {
        sjcl.random.addEntropy([t.x || t.clientX || t.offsetX, t.y || t.clientY || t.offsetY], 2, "mouse")
    },
    o: function() {
        sjcl.random.addEntropy(new Date, 2, "loadtime")
    },
    K: function(t, e) {
        var i;
        t = sjcl.random.r[t];
        var r = [];
        for (i in t)
            t.hasOwnProperty(i) && r.push(t[i]);
        for (i = 0; i < r.length; i++)
            r[i](e)
    }
},
sjcl.json = {
    defaults: {
        v: 1,
        iter: 1e3,
        ks: 128,
        ts: 64,
        mode: "ccm",
        adata: "",
        cipher: "aes"
    },
    encrypt: function(t, e, i, r) {
        i = i || {},
        r = r || {};
        var n = sjcl.json
          , s = n.c({
            iv: sjcl.random.randomWords(4, 0)
        }, n.defaults);
        if (n.c(s, i),
        "string" == typeof s.salt && (s.salt = sjcl.codec.base64.toBits(s.salt)),
        "string" == typeof s.iv && (s.iv = sjcl.codec.base64.toBits(s.iv)),
        !sjcl.mode[s.mode] || !sjcl.cipher[s.cipher] || "string" == typeof t && s.iter <= 100 || 64 !== s.ts && 96 !== s.ts && 128 !== s.ts || 128 !== s.ks && 192 !== s.ks && 256 !== s.ks || s.iv.length < 2 || s.iv.length > 4)
            throw new sjcl.exception.invalid("json encrypt: invalid parameters");
        return "string" == typeof t && (i = sjcl.misc.cachedPbkdf2(t, s),
        t = i.key.slice(0, s.ks / 32),
        s.salt = i.salt),
        "string" == typeof e && (e = sjcl.codec.utf8String.toBits(e)),
        i = new sjcl.cipher[s.cipher](t),
        n.c(r, s),
        r.key = t,
        s.ct = sjcl.mode[s.mode].encrypt(i, e, s.iv, s.adata, s.tag),
        n.encode(n.V(s, n.defaults))
    },
    decrypt: function(t, e, i, r) {
        i = i || {},
        r = r || {};
        var n = sjcl.json;
        if (e = n.c(n.c(n.c({}, n.defaults), n.decode(e)), i, !0),
        "string" == typeof e.salt && (e.salt = sjcl.codec.base64.toBits(e.salt)),
        "string" == typeof e.iv && (e.iv = sjcl.codec.base64.toBits(e.iv)),
        !sjcl.mode[e.mode] || !sjcl.cipher[e.cipher] || "string" == typeof t && e.iter <= 100 || 64 !== e.ts && 96 !== e.ts && 128 !== e.ts || 128 !== e.ks && 192 !== e.ks && 256 !== e.ks || !e.iv || e.iv.length < 2 || e.iv.length > 4)
            throw new sjcl.exception.invalid("json decrypt: invalid parameters");
        return "string" == typeof t && (i = sjcl.misc.cachedPbkdf2(t, e),
        t = i.key.slice(0, e.ks / 32),
        e.salt = i.salt),
        i = new sjcl.cipher[e.cipher](t),
        i = sjcl.mode[e.mode].decrypt(i, e.ct, e.iv, e.adata, e.tag),
        n.c(r, e),
        r.key = t,
        sjcl.codec.utf8String.fromBits(i)
    },
    encode: function(t) {
        var e, i = "{", r = "";
        for (e in t)
            if (t.hasOwnProperty(e)) {
                if (!e.match(/^[a-z0-9]+$/i))
                    throw new sjcl.exception.invalid("json encode: invalid property name");
                switch (i += r + e + ":",
                r = ",",
                typeof t[e]) {
                case "number":
                case "boolean":
                    i += t[e];
                    break;
                case "string":
                    i += '"' + escape(t[e]) + '"';
                    break;
                case "object":
                    i += '"' + sjcl.codec.base64.fromBits(t[e], 1) + '"';
                    break;
                default:
                    throw new sjcl.exception.bug("json encode: unsupported type")
                }
            }
        return i + "}"
    },
    decode: function(t) {
        if (t = t.replace(/\s/g, ""),
        !t.match(/^\{.*\}$/))
            throw new sjcl.exception.invalid("json decode: this isn't json!");
        t = t.replace(/^\{|\}$/g, "").split(/,/);
        var e, i, r = {};
        for (e = 0; e < t.length; e++) {
            if (!(i = t[e].match(/^([a-z][a-z0-9]*):(?:(\d+)|"([a-z0-9+\/%*_.@=\-]*)")$/i)))
                throw new sjcl.exception.invalid("json decode: this isn't json!");
            r[i[1]] = i[2] ? parseInt(i[2], 10) : i[1].match(/^(ct|salt|iv)$/) ? sjcl.codec.base64.toBits(i[3]) : unescape(i[3])
        }
        return r
    },
    c: function(t, e, i) {
        if (void 0 === t && (t = {}),
        void 0 === e)
            return t;
        var r;
        for (r in e)
            if (e.hasOwnProperty(r)) {
                if (i && void 0 !== t[r] && t[r] !== e[r])
                    throw new sjcl.exception.invalid("required parameter overridden");
                t[r] = e[r]
            }
        return t
    },
    V: function(t, e) {
        var i, r = {};
        for (i in t)
            t.hasOwnProperty(i) && t[i] !== e[i] && (r[i] = t[i]);
        return r
    },
    W: function(t, e) {
        var i, r = {};
        for (i = 0; i < e.length; i++)
            void 0 !== t[e[i]] && (r[e[i]] = t[e[i]]);
        return r
    }
},
sjcl.encrypt = sjcl.json.encrypt,
sjcl.decrypt = sjcl.json.decrypt,
sjcl.misc.S = {},
sjcl.misc.cachedPbkdf2 = function(t, e) {
    var i, r = sjcl.misc.S;
    return e = e || {},
    i = e.iter || 1e3,
    r = r[t] = r[t] || {},
    i = r[i] = r[i] || {
        firstSalt: e.salt && e.salt.length ? e.salt.slice(0) : sjcl.random.randomWords(2, 0)
    },
    r = void 0 === e.salt ? i.firstSalt : e.salt,
    i[r] = i[r] || sjcl.misc.pbkdf2(t, r, e.iter),
    {
        key: i[r].slice(0),
        salt: r.slice(0)
    }
}
;
var navigator = {appName:'Netscape'};
var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", b64pad = "=", dbits, canary = 0xdeadbeefcafe, j_lm = 15715070 == (16777215 & canary);
j_lm && "Microsoft Internet Explorer" == navigator.appName ? (BigInteger.prototype.am = am2,
dbits = 30) : j_lm && "Netscape" != navigator.appName ? (BigInteger.prototype.am = am1,
dbits = 26) : (BigInteger.prototype.am = am3,
dbits = 28),
BigInteger.prototype.DB = dbits,
BigInteger.prototype.DM = (1 << dbits) - 1,
BigInteger.prototype.DV = 1 << dbits;
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP),
BigInteger.prototype.F1 = BI_FP - dbits,
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz", BI_RC = new Array, rr, vv;
for (rr = "0".charCodeAt(0),
vv = 0; 9 >= vv; ++vv)
    BI_RC[rr++] = vv;
for (rr = "a".charCodeAt(0),
vv = 10; 36 > vv; ++vv)
    BI_RC[rr++] = vv;
for (rr = "A".charCodeAt(0),
vv = 10; 36 > vv; ++vv)
    BI_RC[rr++] = vv;
Classic.prototype.convert = cConvert,
Classic.prototype.revert = cRevert,
Classic.prototype.reduce = cReduce,
Classic.prototype.mulTo = cMulTo,
Classic.prototype.sqrTo = cSqrTo,
Montgomery.prototype.convert = montConvert,
Montgomery.prototype.revert = montRevert,
Montgomery.prototype.reduce = montReduce,
Montgomery.prototype.mulTo = montMulTo,
Montgomery.prototype.sqrTo = montSqrTo,
BigInteger.prototype.copyTo = bnpCopyTo,
BigInteger.prototype.fromInt = bnpFromInt,
BigInteger.prototype.fromString = bnpFromString,
BigInteger.prototype.clamp = bnpClamp,
BigInteger.prototype.dlShiftTo = bnpDLShiftTo,
BigInteger.prototype.drShiftTo = bnpDRShiftTo,
BigInteger.prototype.lShiftTo = bnpLShiftTo,
BigInteger.prototype.rShiftTo = bnpRShiftTo,
BigInteger.prototype.subTo = bnpSubTo,
BigInteger.prototype.multiplyTo = bnpMultiplyTo,
BigInteger.prototype.squareTo = bnpSquareTo,
BigInteger.prototype.divRemTo = bnpDivRemTo,
BigInteger.prototype.invDigit = bnpInvDigit,
BigInteger.prototype.isEven = bnpIsEven,
BigInteger.prototype.exp = bnpExp,
BigInteger.prototype.toString = bnToString,
BigInteger.prototype.negate = bnNegate,
BigInteger.prototype.abs = bnAbs,
BigInteger.prototype.compareTo = bnCompareTo,
BigInteger.prototype.bitLength = bnBitLength,
BigInteger.prototype.mod = bnMod,
BigInteger.prototype.modPowInt = bnModPowInt,
BigInteger.ZERO = nbv(0),
BigInteger.ONE = nbv(1),
NullExp.prototype.convert = nNop,
NullExp.prototype.revert = nNop,
NullExp.prototype.mulTo = nMulTo,
NullExp.prototype.sqrTo = nSqrTo,
Barrett.prototype.convert = barrettConvert,
Barrett.prototype.revert = barrettRevert,
Barrett.prototype.reduce = barrettReduce,
Barrett.prototype.mulTo = barrettMulTo,
Barrett.prototype.sqrTo = barrettSqrTo;
var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509]
  , lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
BigInteger.prototype.chunkSize = bnpChunkSize,
BigInteger.prototype.toRadix = bnpToRadix,
BigInteger.prototype.fromRadix = bnpFromRadix,
BigInteger.prototype.fromNumber = bnpFromNumber,
BigInteger.prototype.bitwiseTo = bnpBitwiseTo,
BigInteger.prototype.changeBit = bnpChangeBit,
BigInteger.prototype.addTo = bnpAddTo,
BigInteger.prototype.dMultiply = bnpDMultiply,
BigInteger.prototype.dAddOffset = bnpDAddOffset,
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo,
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo,
BigInteger.prototype.modInt = bnpModInt,
BigInteger.prototype.millerRabin = bnpMillerRabin,
BigInteger.prototype.clone = bnClone,
BigInteger.prototype.intValue = bnIntValue,
BigInteger.prototype.byteValue = bnByteValue,
BigInteger.prototype.shortValue = bnShortValue,
BigInteger.prototype.signum = bnSigNum,
BigInteger.prototype.toByteArray = bnToByteArray,
BigInteger.prototype.equals = bnEquals,
BigInteger.prototype.min = bnMin,
BigInteger.prototype.max = bnMax,
BigInteger.prototype.and = bnAnd,
BigInteger.prototype.or = bnOr,
BigInteger.prototype.xor = bnXor,
BigInteger.prototype.andNot = bnAndNot,
BigInteger.prototype.not = bnNot,
BigInteger.prototype.shiftLeft = bnShiftLeft,
BigInteger.prototype.shiftRight = bnShiftRight,
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit,
BigInteger.prototype.bitCount = bnBitCount,
BigInteger.prototype.testBit = bnTestBit,
BigInteger.prototype.setBit = bnSetBit,
BigInteger.prototype.clearBit = bnClearBit,
BigInteger.prototype.flipBit = bnFlipBit,
BigInteger.prototype.add = bnAdd,
BigInteger.prototype.subtract = bnSubtract,
BigInteger.prototype.multiply = bnMultiply,
BigInteger.prototype.divide = bnDivide,
BigInteger.prototype.remainder = bnRemainder,
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder,
BigInteger.prototype.modPow = bnModPow,
BigInteger.prototype.modInverse = bnModInverse,
BigInteger.prototype.pow = bnPow,
BigInteger.prototype.gcd = bnGCD,
BigInteger.prototype.isProbablePrime = bnIsProbablePrime,
RSAKey.prototype.doPublic = RSADoPublic,
RSAKey.prototype.setPublic = RSASetPublic,
RSAKey.prototype.encrypt = RSAEncrypt,
RSAKey.prototype.doPrivate = RSADoPrivate,
RSAKey.prototype.setPrivate = RSASetPrivate,
RSAKey.prototype.setPrivateEx = RSASetPrivateEx,
RSAKey.prototype.generate = RSAGenerate,
RSAKey.prototype.decrypt = RSADecrypt,
RSAKey.prototype.readPrivateKeyFromPEMString = _rsapem_readPrivateKeyFromPEMString;
var _RSASIGN_DIHEAD = [];
_RSASIGN_DIHEAD.sha1 = "3021300906052b0e03021a05000414",
_RSASIGN_DIHEAD.sha256 = "3031300d060960864801650304020105000420";
var _RSASIGN_HASHHEXFUNC = [];
_RSASIGN_HASHHEXFUNC.sha256 = function(t) {
    return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(t))
}
,
RSAKey.prototype.signString = _rsasign_signString,
RSAKey.prototype.signStringWithSHA1 = _rsasign_signStringWithSHA1,
RSAKey.prototype.signStringWithSHA256 = _rsasign_signStringWithSHA256,
RSAKey.prototype.verifyString = _rsasign_verifyString,
RSAKey.prototype.verifyHexSignatureForMessage = _rsasign_verifyHexSignatureForMessage,
X509.prototype.readCertPEM = _x509_readCertPEM,
X509.prototype.readCertPEMWithoutRSAInit = _x509_readCertPEMWithoutRSAInit;
var jwt = {}
  , JWTInternals = function() {
    function t(t) {
        var e, i, r = "", n = 0;
        for (e = 0; e < t.length; ++e) {
            var s = l.indexOf(t.charAt(e));
            0 > s || (0 == n ? (r += int2char(s >> 2),
            i = 3 & s,
            n = 1) : 1 == n ? (r += int2char(i << 2 | s >> 4),
            i = 15 & s,
            n = 2) : 2 == n ? (r += int2char(i),
            r += int2char(s >> 2),
            i = 3 & s,
            n = 3) : (r += int2char(i << 2 | s >> 4),
            r += int2char(15 & s),
            n = 0))
        }
        return 1 == n && (r += int2char(i << 2)),
        r
    }
    function e(t) {
        var e = btoa(t);
        return e = e.split("=")[0],
        e = e.replace(/\+/g, "-"),
        e = e.replace(/\//g, "_")
    }
    function i(t) {
        var e = t;
        switch (e = e.replace(/-/g, "+"),
        e = e.replace(/_/g, "/"),
        e.length % 4) {
        case 0:
            break;
        case 2:
            e += "==";
            break;
        case 3:
            e += "=";
            break;
        default:
            throw new s("Illegal base64url string!")
        }
        return atob(e)
    }
    function r(t) {
        this.message = t,
        this.toString = function() {
            return "No such algorithm: " + this.message
        }
    }
    function n(t) {
        this.message = t,
        this.toString = function() {
            return "Not implemented: " + this.message
        }
    }
    function s(t) {
        this.message = t,
        this.toString = function() {
            return "Malformed input: " + this.message
        }
    }
    function o(t, e) {
        if ("sha256" != t)
            throw new r("HMAC does not support hash " + t);
        this.hash = sjcl.hash.sha256,
        this.key = sjcl.codec.utf8String.toBits(e)
    }
    function a(t, e) {
        if ("sha1" == t)
            this.hash = "sha1";
        else {
            if ("sha256" != t)
                throw new r("JWT algorithm: " + t);
            this.hash = "sha256"
        }
        this.keyPEM = e
    }
    function h(t, e) {
        this.objectStr = t,
        this.pkAlgorithm = e
    }
    function c(t) {
        return "string" == typeof t ? JSON.parse(t) : t
    }
    function u(t, e) {
        if ("ES256" === t)
            throw new n("ECDSA-SHA256 not yet implemented");
        if ("ES384" === t)
            throw new n("ECDSA-SHA384 not yet implemented");
        if ("ES512" === t)
            throw new n("ECDSA-SHA512 not yet implemented");
        if ("HS256" === t)
            return new o("sha256",e);
        if ("HS384" === t)
            throw new n("HMAC-SHA384 not yet implemented");
        if ("HS512" === t)
            throw new n("HMAC-SHA512 not yet implemented");
        if ("RS256" === t)
            return new a("sha256",e);
        throw "RS384" === t ? new n("RSA-SHA384 not yet implemented") : "RS512" === t ? new n("RSA-SHA512 not yet implemented") : new r("Unknown algorithm: " + t)
    }
    var l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    o.prototype = {
        update: function(t) {
            this.data = t
        },
        finalize: function() {},
        sign: function() {
            var t = new sjcl.misc.hmac(this.key,this.hash)
              , i = t.encrypt(this.data);
            var e = sjcl.codec.base64.fromBits(i);
            //console.log("eeee: "+e);
            return e = e.split("=")[0],
                e = e.replace(/\+/g, "-"),
                e = e.replace(/\//g, "_");
        },
        verify: function(t) {
            var i = new sjcl.misc.hmac(this.key,this.hash)
              , r = i.encrypt(this.data);
            return e(atob(sjcl.codec.base64.fromBits(r))) == t
        }
    },
    a.prototype = {
        update: function(t) {
            this.data = t
        },
        finalize: function() {},
        sign: function() {
            var t = new RSAKey;
            return t.readPrivateKeyFromPEMString(this.keyPEM),
            e(i(hex2b64(t.signString(this.data, this.hash))))
        },
        verify: function(e) {
            return this.keyPEM.verifyString(this.data, t(e))
        }
    };
    var p = {
        parse: function(t) {
            var e = t.split(".");
            if (3 != e.length)
                throw new MalformedWebToken("Must have three parts");
            var r = new h;
            return r.headerSegment = e[0],
            r.payloadSegment = e[1],
            r.cryptoSegment = e[2],
            r.pkAlgorithm = i(e[0]),
            r
        }
    };
    h.prototype = {
        serialize: function(t) {
            var i = c(this.pkAlgorithm)
              , r = i.alg
              , n = u(r, t)
              , s = e(this.pkAlgorithm)
              , o = e(this.objectStr)
              , a = s + "." + o;
            return n.update(a), s + "." + o + "." + (n.finalize(), n.sign())
        },
        verify: function(t) {
            var e = c(this.pkAlgorithm)
              , i = e.alg
              , r = u(i, t);
            return r.update(this.headerSegment + "." + this.payloadSegment),
            r.finalize(),
            r.verify(this.cryptoSegment)
        }
    },
    jwt.WebToken = h,
    jwt.WebTokenParser = p,
    jwt.base64urlencode = e,
    jwt.base64urldecode = i
}();








function get_didi() {
	var timestamp = (new Date).getTime() + "";
	//var timestamp = '1507889865131';
	var n = {num: "113", timestamp: timestamp, rand_seed: "1"};
	var e = {typ: "JWT", alg: "HS256"};

	var ticket = '-uLRciBTNFHujUhK2EMBenscC5QZM-JI-GKCLtI35ERMzTsOwkAMANGroKld2Osk3vVt-IRPgZBYUUV7dyRoUs40b-NIgnAiS3WzKWZtU2m1CBfShJXcDvTX531ef6M_O2mzRm0eyzKE676FG4m5qml4cUe4_5EHqeMbAAD__w==';
	var o = (ticket + "").substr(0, 16);
	var sign=new jwt.WebToken(JSON.stringify(n),JSON.stringify(e)).serialize(o);
	//console.log('sign: '+sign);



	var http=require('https');  
	http.get('https://gsh5act.xiaojukeji.com/gsh5act/reward?callback=jQuery21404272219444368843_1506739040442&ticket='+ticket+'&act_id=zXnaxYqk&sign='+sign+'&num='+n.num+'&timestamp='+timestamp+'&rand_seed='+n.rand_seed+'&_=1906739040443',function(req,res){
	    var html='';  
	    req.on('data',function(data){  
		html+=data;  
	    });  
	    req.on('end',function(){  
		console.info(html);  
	    });  
	});  
}

var count = 10;
function didi() {
	get_didi();
	if (count-- < 0) return;
	setTimeout(didi, 2*60*1000);	
}

didi();




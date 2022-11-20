function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;
  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }
  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);
  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }
  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }
  return desc;
}

// make PromiseIndex a nominal typing
var PromiseIndexBrand;
(function (PromiseIndexBrand) {
  PromiseIndexBrand[PromiseIndexBrand["_"] = -1] = "_";
})(PromiseIndexBrand || (PromiseIndexBrand = {}));
const TYPE_KEY = "typeInfo";
var TypeBrand;
(function (TypeBrand) {
  TypeBrand["BIGINT"] = "bigint";
  TypeBrand["DATE"] = "date";
})(TypeBrand || (TypeBrand = {}));
const ERR_INCONSISTENT_STATE = "The collection is an inconsistent state. Did previous smart contract execution terminate unexpectedly?";
const ERR_INDEX_OUT_OF_BOUNDS = "Index out of bounds";
const ACCOUNT_ID_REGEX = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
function u8ArrayToBytes(array) {
  return array.reduce((result, value) => `${result}${String.fromCharCode(value)}`, "");
}
/**
 * Asserts that the expression passed to the function is truthy, otherwise throws a new Error with the provided message.
 *
 * @param expression - The expression to be asserted.
 * @param message - The error message to be printed.
 */
function assert(expression, message) {
  if (!expression) {
    throw new Error("assertion failed: " + message);
  }
}
function getValueWithOptions(value, options = {
  deserializer: deserialize
}) {
  const deserialized = deserialize(value);
  if (deserialized === undefined || deserialized === null) {
    return options?.defaultValue ?? null;
  }
  if (options?.reconstructor) {
    return options.reconstructor(deserialized);
  }
  return deserialized;
}
function serializeValueWithOptions(value, {
  serializer
} = {
  serializer: serialize
}) {
  return serializer(value);
}
function serialize(valueToSerialize) {
  return JSON.stringify(valueToSerialize, function (key, value) {
    if (typeof value === "bigint") {
      return {
        value: value.toString(),
        [TYPE_KEY]: TypeBrand.BIGINT
      };
    }
    if (typeof this[key] === "object" && this[key] !== null && this[key] instanceof Date) {
      return {
        value: this[key].toISOString(),
        [TYPE_KEY]: TypeBrand.DATE
      };
    }
    return value;
  });
}
function deserialize(valueToDeserialize) {
  return JSON.parse(valueToDeserialize, (_, value) => {
    if (value !== null && typeof value === "object" && Object.keys(value).length === 2 && Object.keys(value).every(key => ["value", TYPE_KEY].includes(key))) {
      switch (value[TYPE_KEY]) {
        case TypeBrand.BIGINT:
          return BigInt(value["value"]);
        case TypeBrand.DATE:
          return new Date(value["value"]);
      }
    }
    return value;
  });
}
/**
 * Validates the Account ID according to the NEAR protocol
 * [Account ID rules](https://nomicon.io/DataStructures/Account#account-id-rules).
 *
 * @param accountId - The Account ID string you want to validate.
 */
function validateAccountId(accountId) {
  return accountId.length >= 2 && accountId.length <= 64 && ACCOUNT_ID_REGEX.test(accountId);
}

/**
 * A Promise result in near can be one of:
 * - NotReady = 0 - the promise you are specifying is still not ready, not yet failed nor successful.
 * - Successful = 1 - the promise has been successfully executed and you can retrieve the resulting value.
 * - Failed = 2 - the promise execution has failed.
 */
var PromiseResult;
(function (PromiseResult) {
  PromiseResult[PromiseResult["NotReady"] = 0] = "NotReady";
  PromiseResult[PromiseResult["Successful"] = 1] = "Successful";
  PromiseResult[PromiseResult["Failed"] = 2] = "Failed";
})(PromiseResult || (PromiseResult = {}));
/**
 * A promise error can either be due to the promise failing or not yet being ready.
 */
var PromiseError;
(function (PromiseError) {
  PromiseError[PromiseError["Failed"] = 0] = "Failed";
  PromiseError[PromiseError["NotReady"] = 1] = "NotReady";
})(PromiseError || (PromiseError = {}));

/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function assertNumber(n) {
  if (!Number.isSafeInteger(n)) throw new Error(`Wrong integer: ${n}`);
}
function chain(...args) {
  const wrap = (a, b) => c => a(b(c));
  const encode = Array.from(args).reverse().reduce((acc, i) => acc ? wrap(acc, i.encode) : i.encode, undefined);
  const decode = args.reduce((acc, i) => acc ? wrap(acc, i.decode) : i.decode, undefined);
  return {
    encode,
    decode
  };
}
function alphabet(alphabet) {
  return {
    encode: digits => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== 'number') throw new Error('alphabet.encode input should be an array of numbers');
      return digits.map(i => {
        assertNumber(i);
        if (i < 0 || i >= alphabet.length) throw new Error(`Digit index outside alphabet: ${i} (alphabet: ${alphabet.length})`);
        return alphabet[i];
      });
    },
    decode: input => {
      if (!Array.isArray(input) || input.length && typeof input[0] !== 'string') throw new Error('alphabet.decode input should be array of strings');
      return input.map(letter => {
        if (typeof letter !== 'string') throw new Error(`alphabet.decode: not string element=${letter}`);
        const index = alphabet.indexOf(letter);
        if (index === -1) throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet}`);
        return index;
      });
    }
  };
}
function join(separator = '') {
  if (typeof separator !== 'string') throw new Error('join separator should be string');
  return {
    encode: from => {
      if (!Array.isArray(from) || from.length && typeof from[0] !== 'string') throw new Error('join.encode input should be array of strings');
      for (let i of from) if (typeof i !== 'string') throw new Error(`join.encode: non-string input=${i}`);
      return from.join(separator);
    },
    decode: to => {
      if (typeof to !== 'string') throw new Error('join.decode input should be string');
      return to.split(separator);
    }
  };
}
function padding(bits, chr = '=') {
  assertNumber(bits);
  if (typeof chr !== 'string') throw new Error('padding chr should be string');
  return {
    encode(data) {
      if (!Array.isArray(data) || data.length && typeof data[0] !== 'string') throw new Error('padding.encode input should be array of strings');
      for (let i of data) if (typeof i !== 'string') throw new Error(`padding.encode: non-string input=${i}`);
      while (data.length * bits % 8) data.push(chr);
      return data;
    },
    decode(input) {
      if (!Array.isArray(input) || input.length && typeof input[0] !== 'string') throw new Error('padding.encode input should be array of strings');
      for (let i of input) if (typeof i !== 'string') throw new Error(`padding.decode: non-string input=${i}`);
      let end = input.length;
      if (end * bits % 8) throw new Error('Invalid padding: string should have whole number of bytes');
      for (; end > 0 && input[end - 1] === chr; end--) {
        if (!((end - 1) * bits % 8)) throw new Error('Invalid padding: string has too much padding');
      }
      return input.slice(0, end);
    }
  };
}
function normalize(fn) {
  if (typeof fn !== 'function') throw new Error('normalize fn should be function');
  return {
    encode: from => from,
    decode: to => fn(to)
  };
}
function convertRadix(data, from, to) {
  if (from < 2) throw new Error(`convertRadix: wrong from=${from}, base cannot be less than 2`);
  if (to < 2) throw new Error(`convertRadix: wrong to=${to}, base cannot be less than 2`);
  if (!Array.isArray(data)) throw new Error('convertRadix: data should be array');
  if (!data.length) return [];
  let pos = 0;
  const res = [];
  const digits = Array.from(data);
  digits.forEach(d => {
    assertNumber(d);
    if (d < 0 || d >= from) throw new Error(`Wrong integer: ${d}`);
  });
  while (true) {
    let carry = 0;
    let done = true;
    for (let i = pos; i < digits.length; i++) {
      const digit = digits[i];
      const digitBase = from * carry + digit;
      if (!Number.isSafeInteger(digitBase) || from * carry / from !== carry || digitBase - digit !== from * carry) {
        throw new Error('convertRadix: carry overflow');
      }
      carry = digitBase % to;
      digits[i] = Math.floor(digitBase / to);
      if (!Number.isSafeInteger(digits[i]) || digits[i] * to + carry !== digitBase) throw new Error('convertRadix: carry overflow');
      if (!done) continue;else if (!digits[i]) pos = i;else done = false;
    }
    res.push(carry);
    if (done) break;
  }
  for (let i = 0; i < data.length - 1 && data[i] === 0; i++) res.push(0);
  return res.reverse();
}
const gcd = (a, b) => !b ? a : gcd(b, a % b);
const radix2carry = (from, to) => from + (to - gcd(from, to));
function convertRadix2(data, from, to, padding) {
  if (!Array.isArray(data)) throw new Error('convertRadix2: data should be array');
  if (from <= 0 || from > 32) throw new Error(`convertRadix2: wrong from=${from}`);
  if (to <= 0 || to > 32) throw new Error(`convertRadix2: wrong to=${to}`);
  if (radix2carry(from, to) > 32) {
    throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${radix2carry(from, to)}`);
  }
  let carry = 0;
  let pos = 0;
  const mask = 2 ** to - 1;
  const res = [];
  for (const n of data) {
    assertNumber(n);
    if (n >= 2 ** from) throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
    carry = carry << from | n;
    if (pos + from > 32) throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
    pos += from;
    for (; pos >= to; pos -= to) res.push((carry >> pos - to & mask) >>> 0);
    carry &= 2 ** pos - 1;
  }
  carry = carry << to - pos & mask;
  if (!padding && pos >= from) throw new Error('Excess padding');
  if (!padding && carry) throw new Error(`Non-zero padding: ${carry}`);
  if (padding && pos > 0) res.push(carry >>> 0);
  return res;
}
function radix(num) {
  assertNumber(num);
  return {
    encode: bytes => {
      if (!(bytes instanceof Uint8Array)) throw new Error('radix.encode input should be Uint8Array');
      return convertRadix(Array.from(bytes), 2 ** 8, num);
    },
    decode: digits => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== 'number') throw new Error('radix.decode input should be array of strings');
      return Uint8Array.from(convertRadix(digits, num, 2 ** 8));
    }
  };
}
function radix2(bits, revPadding = false) {
  assertNumber(bits);
  if (bits <= 0 || bits > 32) throw new Error('radix2: bits should be in (0..32]');
  if (radix2carry(8, bits) > 32 || radix2carry(bits, 8) > 32) throw new Error('radix2: carry overflow');
  return {
    encode: bytes => {
      if (!(bytes instanceof Uint8Array)) throw new Error('radix2.encode input should be Uint8Array');
      return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
    },
    decode: digits => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== 'number') throw new Error('radix2.decode input should be array of strings');
      return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
    }
  };
}
function unsafeWrapper(fn) {
  if (typeof fn !== 'function') throw new Error('unsafeWrapper fn should be function');
  return function (...args) {
    try {
      return fn.apply(null, args);
    } catch (e) {}
  };
}
const base16 = chain(radix2(4), alphabet('0123456789ABCDEF'), join(''));
const base32 = chain(radix2(5), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'), padding(5), join(''));
chain(radix2(5), alphabet('0123456789ABCDEFGHIJKLMNOPQRSTUV'), padding(5), join(''));
chain(radix2(5), alphabet('0123456789ABCDEFGHJKMNPQRSTVWXYZ'), join(''), normalize(s => s.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1')));
const base64 = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'), padding(6), join(''));
const base64url = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'), padding(6), join(''));
const genBase58 = abc => chain(radix(58), alphabet(abc), join(''));
const base58 = genBase58('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
genBase58('123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ');
genBase58('rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz');
const XMR_BLOCK_LEN = [0, 2, 3, 5, 6, 7, 9, 10, 11];
const base58xmr = {
  encode(data) {
    let res = '';
    for (let i = 0; i < data.length; i += 8) {
      const block = data.subarray(i, i + 8);
      res += base58.encode(block).padStart(XMR_BLOCK_LEN[block.length], '1');
    }
    return res;
  },
  decode(str) {
    let res = [];
    for (let i = 0; i < str.length; i += 11) {
      const slice = str.slice(i, i + 11);
      const blockLen = XMR_BLOCK_LEN.indexOf(slice.length);
      const block = base58.decode(slice);
      for (let j = 0; j < block.length - blockLen; j++) {
        if (block[j] !== 0) throw new Error('base58xmr: wrong padding');
      }
      res = res.concat(Array.from(block.slice(block.length - blockLen)));
    }
    return Uint8Array.from(res);
  }
};
const BECH_ALPHABET = chain(alphabet('qpzry9x8gf2tvdw0s3jn54khce6mua7l'), join(''));
const POLYMOD_GENERATORS = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
function bech32Polymod(pre) {
  const b = pre >> 25;
  let chk = (pre & 0x1ffffff) << 5;
  for (let i = 0; i < POLYMOD_GENERATORS.length; i++) {
    if ((b >> i & 1) === 1) chk ^= POLYMOD_GENERATORS[i];
  }
  return chk;
}
function bechChecksum(prefix, words, encodingConst = 1) {
  const len = prefix.length;
  let chk = 1;
  for (let i = 0; i < len; i++) {
    const c = prefix.charCodeAt(i);
    if (c < 33 || c > 126) throw new Error(`Invalid prefix (${prefix})`);
    chk = bech32Polymod(chk) ^ c >> 5;
  }
  chk = bech32Polymod(chk);
  for (let i = 0; i < len; i++) chk = bech32Polymod(chk) ^ prefix.charCodeAt(i) & 0x1f;
  for (let v of words) chk = bech32Polymod(chk) ^ v;
  for (let i = 0; i < 6; i++) chk = bech32Polymod(chk);
  chk ^= encodingConst;
  return BECH_ALPHABET.encode(convertRadix2([chk % 2 ** 30], 30, 5, false));
}
function genBech32(encoding) {
  const ENCODING_CONST = encoding === 'bech32' ? 1 : 0x2bc830a3;
  const _words = radix2(5);
  const fromWords = _words.decode;
  const toWords = _words.encode;
  const fromWordsUnsafe = unsafeWrapper(fromWords);
  function encode(prefix, words, limit = 90) {
    if (typeof prefix !== 'string') throw new Error(`bech32.encode prefix should be string, not ${typeof prefix}`);
    if (!Array.isArray(words) || words.length && typeof words[0] !== 'number') throw new Error(`bech32.encode words should be array of numbers, not ${typeof words}`);
    const actualLength = prefix.length + 7 + words.length;
    if (limit !== false && actualLength > limit) throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
    prefix = prefix.toLowerCase();
    return `${prefix}1${BECH_ALPHABET.encode(words)}${bechChecksum(prefix, words, ENCODING_CONST)}`;
  }
  function decode(str, limit = 90) {
    if (typeof str !== 'string') throw new Error(`bech32.decode input should be string, not ${typeof str}`);
    if (str.length < 8 || limit !== false && str.length > limit) throw new TypeError(`Wrong string length: ${str.length} (${str}). Expected (8..${limit})`);
    const lowered = str.toLowerCase();
    if (str !== lowered && str !== str.toUpperCase()) throw new Error(`String must be lowercase or uppercase`);
    str = lowered;
    const sepIndex = str.lastIndexOf('1');
    if (sepIndex === 0 || sepIndex === -1) throw new Error(`Letter "1" must be present between prefix and data only`);
    const prefix = str.slice(0, sepIndex);
    const _words = str.slice(sepIndex + 1);
    if (_words.length < 6) throw new Error('Data must be at least 6 characters long');
    const words = BECH_ALPHABET.decode(_words).slice(0, -6);
    const sum = bechChecksum(prefix, words, ENCODING_CONST);
    if (!_words.endsWith(sum)) throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
    return {
      prefix,
      words
    };
  }
  const decodeUnsafe = unsafeWrapper(decode);
  function decodeToBytes(str) {
    const {
      prefix,
      words
    } = decode(str, false);
    return {
      prefix,
      words,
      bytes: fromWords(words)
    };
  }
  return {
    encode,
    decode,
    decodeToBytes,
    decodeUnsafe,
    fromWords,
    fromWordsUnsafe,
    toWords
  };
}
genBech32('bech32');
genBech32('bech32m');
const utf8 = {
  encode: data => new TextDecoder().decode(data),
  decode: str => new TextEncoder().encode(str)
};
const hex = chain(radix2(4), alphabet('0123456789abcdef'), join(''), normalize(s => {
  if (typeof s !== 'string' || s.length % 2) throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
  return s.toLowerCase();
}));
const CODERS = {
  utf8,
  hex,
  base16,
  base32,
  base64,
  base64url,
  base58,
  base58xmr
};
`Invalid encoding type. Available types: ${Object.keys(CODERS).join(', ')}`;

var CurveType;
(function (CurveType) {
  CurveType[CurveType["ED25519"] = 0] = "ED25519";
  CurveType[CurveType["SECP256K1"] = 1] = "SECP256K1";
})(CurveType || (CurveType = {}));
var DataLength;
(function (DataLength) {
  DataLength[DataLength["ED25519"] = 32] = "ED25519";
  DataLength[DataLength["SECP256K1"] = 64] = "SECP256K1";
})(DataLength || (DataLength = {}));

const U64_MAX = 2n ** 64n - 1n;
const EVICTED_REGISTER = U64_MAX - 1n;
/**
 * Logs parameters in the NEAR WASM virtual machine.
 *
 * @param params - Parameters to log.
 */
function log(...params) {
  env.log(params.reduce((accumulated, parameter, index) => {
    // Stringify undefined
    const param = parameter === undefined ? "undefined" : parameter;
    // Convert Objects to strings and convert to string
    const stringified = typeof param === "object" ? JSON.stringify(param) : `${param}`;
    if (index === 0) {
      return stringified;
    }
    return `${accumulated} ${stringified}`;
  }, ""));
}
/**
 * Returns the account ID of the account that called the function.
 * Can only be called in a call or initialize function.
 */
function predecessorAccountId() {
  env.predecessor_account_id(0);
  return env.read_register(0);
}
/**
 * Returns the account ID of the current contract - the contract that is being executed.
 */
function currentAccountId() {
  env.current_account_id(0);
  return env.read_register(0);
}
/**
 * Returns the amount of NEAR attached to this function call.
 * Can only be called in payable functions.
 */
function attachedDeposit() {
  return env.attached_deposit();
}
/**
 * Returns the current account's account balance.
 */
function accountBalance() {
  return env.account_balance();
}
/**
 * Reads the value from NEAR storage that is stored under the provided key.
 *
 * @param key - The key to read from storage.
 */
function storageRead(key) {
  const returnValue = env.storage_read(key, 0);
  if (returnValue !== 1n) {
    return null;
  }
  return env.read_register(0);
}
/**
 * Checks for the existance of a value under the provided key in NEAR storage.
 *
 * @param key - The key to check for in storage.
 */
function storageHasKey(key) {
  return env.storage_has_key(key) === 1n;
}
/**
 * Get the last written or removed value from NEAR storage.
 */
function storageGetEvicted() {
  return env.read_register(EVICTED_REGISTER);
}
/**
 * Writes the provided bytes to NEAR storage under the provided key.
 *
 * @param key - The key under which to store the value.
 * @param value - The value to store.
 */
function storageWrite(key, value) {
  return env.storage_write(key, value, EVICTED_REGISTER) === 1n;
}
/**
 * Removes the value of the provided key from NEAR storage.
 *
 * @param key - The key to be removed.
 */
function storageRemove(key) {
  return env.storage_remove(key, EVICTED_REGISTER) === 1n;
}
/**
 * Returns the arguments passed to the current smart contract call.
 */
function input() {
  env.input(0);
  return env.read_register(0);
}
/**
 * Create a NEAR promise which will have multiple promise actions inside.
 *
 * @param accountId - The account ID of the target contract.
 */
function promiseBatchCreate(accountId) {
  return env.promise_batch_create(accountId);
}
/**
 * Attach a transfer promise action to the NEAR promise index with the provided promise index.
 *
 * @param promiseIndex - The index of the promise to attach a transfer action to.
 * @param amount - The amount of NEAR to transfer.
 */
function promiseBatchActionTransfer(promiseIndex, amount) {
  env.promise_batch_action_transfer(promiseIndex, amount);
}
/**
 * Executes the promise in the NEAR WASM virtual machine.
 *
 * @param promiseIndex - The index of the promise to execute.
 */
function promiseReturn(promiseIndex) {
  env.promise_return(promiseIndex);
}

/**
 * Tells the SDK to use this function as the initialization function of the contract.
 *
 * @param _empty - An empty object.
 */
function initialize(_empty) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (_target, _key, _descriptor
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {};
}
/**
 * Tells the SDK to expose this function as a view function.
 *
 * @param _empty - An empty object.
 */
function view(_empty) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (_target, _key, _descriptor
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {};
}
function call({
  privateFunction = false,
  payableFunction = false
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (_target, _key, descriptor) {
    const originalMethod = descriptor.value;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    descriptor.value = function (...args) {
      if (privateFunction && predecessorAccountId() !== currentAccountId()) {
        throw new Error("Function is private");
      }
      if (!payableFunction && attachedDeposit() > 0n) {
        throw new Error("Function is not payable");
      }
      return originalMethod.apply(this, args);
    };
  };
}
function NearBindgen({
  requireInit = false,
  serializer = serialize,
  deserializer = deserialize
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return target => {
    return class extends target {
      static _create() {
        return new target();
      }
      static _getState() {
        const rawState = storageRead("STATE");
        return rawState ? this._deserialize(rawState) : null;
      }
      static _saveToStorage(objectToSave) {
        storageWrite("STATE", this._serialize(objectToSave));
      }
      static _getArgs() {
        return JSON.parse(input() || "{}");
      }
      static _serialize(value, forReturn = false) {
        if (forReturn) {
          return JSON.stringify(value, (_, value) => typeof value === "bigint" ? `${value}` : value);
        }
        return serializer(value);
      }
      static _deserialize(value) {
        return deserializer(value);
      }
      static _reconstruct(classObject, plainObject) {
        for (const item in classObject) {
          const reconstructor = classObject[item].constructor?.reconstruct;
          classObject[item] = reconstructor ? reconstructor(plainObject[item]) : plainObject[item];
        }
        return classObject;
      }
      static _requireInit() {
        return requireInit;
      }
    };
  };
}

/**
 * A lookup map that stores data in NEAR storage.
 */
class LookupMap {
  /**
   * @param keyPrefix - The byte prefix to use when storing elements inside this collection.
   */
  constructor(keyPrefix) {
    this.keyPrefix = keyPrefix;
  }
  /**
   * Checks whether the collection contains the value.
   *
   * @param key - The value for which to check the presence.
   */
  containsKey(key) {
    const storageKey = this.keyPrefix + key;
    return storageHasKey(storageKey);
  }
  /**
   * Get the data stored at the provided key.
   *
   * @param key - The key at which to look for the data.
   * @param options - Options for retrieving the data.
   */
  get(key, options) {
    const storageKey = this.keyPrefix + key;
    const value = storageRead(storageKey);
    return getValueWithOptions(value, options);
  }
  /**
   * Removes and retrieves the element with the provided key.
   *
   * @param key - The key at which to remove data.
   * @param options - Options for retrieving the data.
   */
  remove(key, options) {
    const storageKey = this.keyPrefix + key;
    if (!storageRemove(storageKey)) {
      return options?.defaultValue ?? null;
    }
    const value = storageGetEvicted();
    return getValueWithOptions(value, options);
  }
  /**
   * Store a new value at the provided key.
   *
   * @param key - The key at which to store in the collection.
   * @param newValue - The value to store in the collection.
   * @param options - Options for retrieving and storing the data.
   */
  set(key, newValue, options) {
    const storageKey = this.keyPrefix + key;
    const storageValue = serializeValueWithOptions(newValue, options);
    if (!storageWrite(storageKey, storageValue)) {
      return options?.defaultValue ?? null;
    }
    const value = storageGetEvicted();
    return getValueWithOptions(value, options);
  }
  /**
   * Extends the current collection with the passed in array of key-value pairs.
   *
   * @param keyValuePairs - The key-value pairs to extend the collection with.
   * @param options - Options for storing the data.
   */
  extend(keyValuePairs, options) {
    for (const [key, value] of keyValuePairs) {
      this.set(key, value, options);
    }
  }
  /**
   * Serialize the collection.
   *
   * @param options - Options for storing the data.
   */
  serialize(options) {
    return serializeValueWithOptions(this, options);
  }
  /**
   * Converts the deserialized data from storage to a JavaScript instance of the collection.
   *
   * @param data - The deserialized data to create an instance from.
   */
  static reconstruct(data) {
    return new LookupMap(data.keyPrefix);
  }
}

function indexToKey(prefix, index) {
  const data = new Uint32Array([index]);
  const array = new Uint8Array(data.buffer);
  const key = u8ArrayToBytes(array);
  return prefix + key;
}
/**
 * An iterable implementation of vector that stores its content on the trie.
 * Uses the following map: index -> element
 */
class Vector {
  /**
   * @param prefix - The byte prefix to use when storing elements inside this collection.
   * @param length - The initial length of the collection. By default 0.
   */
  constructor(prefix, length = 0) {
    this.prefix = prefix;
    this.length = length;
  }
  /**
   * Checks whether the collection is empty.
   */
  isEmpty() {
    return this.length === 0;
  }
  /**
   * Get the data stored at the provided index.
   *
   * @param index - The index at which to look for the data.
   * @param options - Options for retrieving the data.
   */
  get(index, options) {
    if (index >= this.length) {
      return options?.defaultValue ?? null;
    }
    const storageKey = indexToKey(this.prefix, index);
    const value = storageRead(storageKey);
    return getValueWithOptions(value, options);
  }
  /**
   * Removes an element from the vector and returns it in serialized form.
   * The removed element is replaced by the last element of the vector.
   * Does not preserve ordering, but is `O(1)`.
   *
   * @param index - The index at which to remove the element.
   * @param options - Options for retrieving and storing the data.
   */
  swapRemove(index, options) {
    assert(index < this.length, ERR_INDEX_OUT_OF_BOUNDS);
    if (index + 1 === this.length) {
      return this.pop(options);
    }
    const key = indexToKey(this.prefix, index);
    const last = this.pop(options);
    assert(storageWrite(key, serializeValueWithOptions(last, options)), ERR_INCONSISTENT_STATE);
    const value = storageGetEvicted();
    return getValueWithOptions(value, options);
  }
  /**
   * Adds data to the collection.
   *
   * @param element - The data to store.
   * @param options - Options for storing the data.
   */
  push(element, options) {
    const key = indexToKey(this.prefix, this.length);
    this.length += 1;
    storageWrite(key, serializeValueWithOptions(element, options));
  }
  /**
   * Removes and retrieves the element with the highest index.
   *
   * @param options - Options for retrieving the data.
   */
  pop(options) {
    if (this.isEmpty()) {
      return options?.defaultValue ?? null;
    }
    const lastIndex = this.length - 1;
    const lastKey = indexToKey(this.prefix, lastIndex);
    this.length -= 1;
    assert(storageRemove(lastKey), ERR_INCONSISTENT_STATE);
    const value = storageGetEvicted();
    return getValueWithOptions(value, options);
  }
  /**
   * Replaces the data stored at the provided index with the provided data and returns the previously stored data.
   *
   * @param index - The index at which to replace the data.
   * @param element - The data to replace with.
   * @param options - Options for retrieving and storing the data.
   */
  replace(index, element, options) {
    assert(index < this.length, ERR_INDEX_OUT_OF_BOUNDS);
    const key = indexToKey(this.prefix, index);
    assert(storageWrite(key, serializeValueWithOptions(element, options)), ERR_INCONSISTENT_STATE);
    const value = storageGetEvicted();
    return getValueWithOptions(value, options);
  }
  /**
   * Extends the current collection with the passed in array of elements.
   *
   * @param elements - The elements to extend the collection with.
   */
  extend(elements) {
    for (const element of elements) {
      this.push(element);
    }
  }
  [Symbol.iterator]() {
    return new VectorIterator(this);
  }
  /**
   * Create a iterator on top of the default collection iterator using custom options.
   *
   * @param options - Options for retrieving and storing the data.
   */
  createIteratorWithOptions(options) {
    return {
      [Symbol.iterator]: () => new VectorIterator(this, options)
    };
  }
  /**
   * Return a JavaScript array of the data stored within the collection.
   *
   * @param options - Options for retrieving and storing the data.
   */
  toArray(options) {
    const array = [];
    const iterator = options ? this.createIteratorWithOptions(options) : this;
    for (const value of iterator) {
      array.push(value);
    }
    return array;
  }
  /**
   * Remove all of the elements stored within the collection.
   */
  clear() {
    for (let index = 0; index < this.length; index++) {
      const key = indexToKey(this.prefix, index);
      storageRemove(key);
    }
    this.length = 0;
  }
  /**
   * Serialize the collection.
   *
   * @param options - Options for storing the data.
   */
  serialize(options) {
    return serializeValueWithOptions(this, options);
  }
  /**
   * Converts the deserialized data from storage to a JavaScript instance of the collection.
   *
   * @param data - The deserialized data to create an instance from.
   */
  static reconstruct(data) {
    const vector = new Vector(data.prefix, data.length);
    return vector;
  }
}
/**
 * An iterator for the Vector collection.
 */
class VectorIterator {
  /**
   * @param vector - The vector collection to create an iterator for.
   * @param options - Options for retrieving and storing data.
   */
  constructor(vector, options) {
    this.vector = vector;
    this.options = options;
    this.current = 0;
  }
  next() {
    if (this.current >= this.vector.length) {
      return {
        value: null,
        done: true
      };
    }
    const value = this.vector.get(this.current, this.options);
    this.current += 1;
    return {
      value,
      done: false
    };
  }
}

/**
 * An unordered map that stores data in NEAR storage.
 */
class UnorderedMap {
  /**
   * @param prefix - The byte prefix to use when storing elements inside this collection.
   */
  constructor(prefix) {
    this.prefix = prefix;
    this.keys = new Vector(`${prefix}u`); // intentional different prefix with old UnorderedMap
    this.values = new LookupMap(`${prefix}m`);
  }
  /**
   * The number of elements stored in the collection.
   */
  get length() {
    return this.keys.length;
  }
  /**
   * Checks whether the collection is empty.
   */
  isEmpty() {
    return this.keys.isEmpty();
  }
  /**
   * Get the data stored at the provided key.
   *
   * @param key - The key at which to look for the data.
   * @param options - Options for retrieving the data.
   */
  get(key, options) {
    const valueAndIndex = this.values.get(key);
    if (valueAndIndex === null) {
      return options?.defaultValue ?? null;
    }
    const [value] = valueAndIndex;
    return getValueWithOptions(value, options);
  }
  /**
   * Store a new value at the provided key.
   *
   * @param key - The key at which to store in the collection.
   * @param value - The value to store in the collection.
   * @param options - Options for retrieving and storing the data.
   */
  set(key, value, options) {
    const valueAndIndex = this.values.get(key);
    const serialized = serializeValueWithOptions(value, options);
    if (valueAndIndex === null) {
      const newElementIndex = this.length;
      this.keys.push(key);
      this.values.set(key, [serialized, newElementIndex]);
      return null;
    }
    const [oldValue, oldIndex] = valueAndIndex;
    this.values.set(key, [serialized, oldIndex]);
    return getValueWithOptions(oldValue, options);
  }
  /**
   * Removes and retrieves the element with the provided key.
   *
   * @param key - The key at which to remove data.
   * @param options - Options for retrieving the data.
   */
  remove(key, options) {
    const oldValueAndIndex = this.values.remove(key);
    if (oldValueAndIndex === null) {
      return options?.defaultValue ?? null;
    }
    const [value, index] = oldValueAndIndex;
    assert(this.keys.swapRemove(index) !== null, ERR_INCONSISTENT_STATE);
    // the last key is swapped to key[index], the corresponding [value, index] need update
    if (!this.keys.isEmpty() && index !== this.keys.length) {
      // if there is still elements and it was not the last element
      const swappedKey = this.keys.get(index);
      const swappedValueAndIndex = this.values.get(swappedKey);
      assert(swappedValueAndIndex !== null, ERR_INCONSISTENT_STATE);
      this.values.set(swappedKey, [swappedValueAndIndex[0], index]);
    }
    return getValueWithOptions(value, options);
  }
  /**
   * Remove all of the elements stored within the collection.
   */
  clear() {
    for (const key of this.keys) {
      // Set instead of remove to avoid loading the value from storage.
      this.values.set(key, null);
    }
    this.keys.clear();
  }
  [Symbol.iterator]() {
    return new UnorderedMapIterator(this);
  }
  /**
   * Create a iterator on top of the default collection iterator using custom options.
   *
   * @param options - Options for retrieving and storing the data.
   */
  createIteratorWithOptions(options) {
    return {
      [Symbol.iterator]: () => new UnorderedMapIterator(this, options)
    };
  }
  /**
   * Return a JavaScript array of the data stored within the collection.
   *
   * @param options - Options for retrieving and storing the data.
   */
  toArray(options) {
    const array = [];
    const iterator = options ? this.createIteratorWithOptions(options) : this;
    for (const value of iterator) {
      array.push(value);
    }
    return array;
  }
  /**
   * Extends the current collection with the passed in array of key-value pairs.
   *
   * @param keyValuePairs - The key-value pairs to extend the collection with.
   */
  extend(keyValuePairs) {
    for (const [key, value] of keyValuePairs) {
      this.set(key, value);
    }
  }
  /**
   * Serialize the collection.
   *
   * @param options - Options for storing the data.
   */
  serialize(options) {
    return serializeValueWithOptions(this, options);
  }
  /**
   * Converts the deserialized data from storage to a JavaScript instance of the collection.
   *
   * @param data - The deserialized data to create an instance from.
   */
  static reconstruct(data) {
    const map = new UnorderedMap(data.prefix);
    // reconstruct keys Vector
    map.keys = new Vector(`${data.prefix}u`);
    map.keys.length = data.keys.length;
    // reconstruct values LookupMap
    map.values = new LookupMap(`${data.prefix}m`);
    return map;
  }
}
/**
 * An iterator for the UnorderedMap collection.
 */
class UnorderedMapIterator {
  /**
   * @param unorderedMap - The unordered map collection to create an iterator for.
   * @param options - Options for retrieving and storing data.
   */
  constructor(unorderedMap, options) {
    this.options = options;
    this.keys = new VectorIterator(unorderedMap.keys);
    this.map = unorderedMap.values;
  }
  next() {
    const key = this.keys.next();
    if (key.done) {
      return {
        value: [key.value, null],
        done: key.done
      };
    }
    const valueAndIndex = this.map.get(key.value);
    assert(valueAndIndex !== null, ERR_INCONSISTENT_STATE);
    return {
      done: key.done,
      value: [key.value, getValueWithOptions(valueAndIndex[0], this.options)]
    };
  }
}

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _class, _class2;
class Assertions {
  static hasAtLeastOneAttachedYocto() {
    assert(attachedDeposit() > BigInt(0), "Requires at least 1 yoctoNEAR to ensure signature");
  }
  static isLeftGreaterThanRight(left, right, message = null) {
    const msg = message || `Provided amount ${left} should be greater than ${right}`;
    assert(BigInt(left) > BigInt(right), msg);
  }
}
let DirectDebit = (_dec = NearBindgen({}), _dec2 = initialize(), _dec3 = call({
  payableFunction: true
}), _dec4 = call({
  payableFunction: true
}), _dec5 = call({
  payableFunction: true
}), _dec6 = call({
  payableFunction: true
}), _dec7 = call({}), _dec8 = call({}), _dec9 = call({}), _dec10 = view(), _dec11 = view(), _dec12 = view(), _dec13 = view(), _dec14 = view(), _dec15 = view(), _dec16 = view(), _dec17 = view(), _dec18 = view(), _dec(_class = (_class2 = class DirectDebit {
  // All the fees associated must be paid by the depositor by the person that has created this contract 
  // Meaning all storage cost associated

  // vvvvvvvvvvvvvvvv HELPER FUNCTIONS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  internalSendNEAR(receivingAccountId, amount) {
    Assertions.isLeftGreaterThanRight(amount, 0);
    Assertions.isLeftGreaterThanRight(accountBalance(), amount, `Not enough balance ${accountBalance()} to send ${amount}`);
    const promise = promiseBatchCreate(receivingAccountId);
    promiseBatchActionTransfer(promise, amount);
    promiseReturn(promise);
  }
  // ^^^^^^^^^^^^^^^^ HELPER FUNCTIONS ^^^^^^^^^^^^^^^^^^^^

  // vvvvvvvvvvvvvvvv CONSTRUCTOR vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
  constructor() {
    this.maxNumberVendor = 5;
    this.payLater = false;
    this.treasure = BigInt(0);
    this.owner = "";
    this.vendorsMaxLimit = new UnorderedMap("vendorsMaxLimit");
    this.vendorsInvoicesUsedLimit = new UnorderedMap("vendorsInvoicesUsedLimit");
    this.vendorsList = new Vector("");
  }
  // ^^^^^^^^^^^^^^^^ CONSTRUCTOR ^^^^^^^^^^^^^^^^^^^^

  init({
    maxNumberVendor,
    payLater
  }) {
    Assertions.isLeftGreaterThanRight(maxNumberVendor, 0);
    this.maxNumberVendor = maxNumberVendor;
    this.payLater = payLater;
    this.owner = predecessorAccountId();
  }

  // vvvvvvvvvvvvvvvv  CALL METHODS PAYABLE vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

  deposit_treasure() {
    log(`deposit_amount called `);
    //Anyone can deposit no restriction in place
    this.treasure = this.treasure + attachedDeposit();
  }
  // This method changes the state, for which it cost gas
  pay_vendor({
    vendorAddress
  }) {
    assert(predecessorAccountId() == this.owner, "Only owner can pay vendor");
    assert(this.payLater == true, "this function is available only for pay later enabled");
    assert(this.vendorsMaxLimit.get(vendorAddress, {
      defaultValue: BigInt(0)
    }) <= BigInt(0), "Not a vendor address.");
    assert(this.vendorsInvoicesUsedLimit.get(vendorAddress, {
      defaultValue: BigInt(0)
    }) <= BigInt(0), "No outstanding balance for vendor.");
    log(`pay_vendor called ${vendorAddress}`);
    validateAccountId(vendorAddress);
    log(`pay_vendor will pay ${this.vendorsInvoicesUsedLimit.get(vendorAddress, {
      defaultValue: BigInt(0)
    })}`);
    this.internalSendNEAR(vendorAddress, this.vendorsInvoicesUsedLimit.get(vendorAddress, {
      defaultValue: BigInt(0)
    }));
    this.vendorsInvoicesUsedLimit.set(vendorAddress, BigInt(0));
  }
  // This method changes the state, for which it cost gas
  pay_all_vendors() {
    assert(predecessorAccountId() == this.owner, "Only owner can pay all vendor");
    assert(this.payLater == true, "this function is available only for pay later enabled");
    log(`pay_all_vendors called.`);
    var i = 0;
    var address_vector;
    for (i = 0; i < this.vendorsList.length; i++) {
      address_vector = this.vendorsList.get(i, {
        defaultValue: ""
      });
      if (this.vendorsInvoicesUsedLimit.get(address_vector, {
        defaultValue: BigInt(0)
      }) > BigInt(0)) {
        log(`the amount ${this.vendorsInvoicesUsedLimit.get(address_vector, {
          defaultValue: BigInt(0)
        })} will be paid to ${address_vector}`);
        this.internalSendNEAR(address_vector, this.vendorsInvoicesUsedLimit.get(address_vector, {
          defaultValue: BigInt(0)
        }));
        this.vendorsInvoicesUsedLimit.set(address_vector, BigInt(0));
      } else {
        log(`the amount will be paid to ${address_vector} as used limit is not bigger than 0`);
      }
    }
  }
  withdraw_treasure({
    amount
  }) {
    assert(predecessorAccountId() == this.owner, "Only owner can add a new vendor");
    log(`withdraw_treasure called  ${amount}`);
    this.internalSendNEAR(this.owner, amount); //withdraw to owner only
  }

  // ^^^^^^^^^^^^^^^^  CALL METHODS PAYABLE ^^^^^^^^^^^^^^^^^^^^

  // vvvvvvvvvvvvvvvv CALL METHODS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

  // This method changes the state, for which it cost gas
  set_invoice({
    amount_in
  }) {
    assert(amount_in > BigInt(0), "Amount should be greater than 0");
    const vendorAddress = predecessorAccountId();
    // validateAccountId(vendorAddress);
    var address_vector;
    var i = 0;
    var whitelisted_poz = -1;
    log(`address ${vendorAddress} whats to set an invoice.`);
    for (i = 0; i < this.vendorsList.length; i++) {
      address_vector = this.vendorsList.get(i, {
        defaultValue: ""
      });
      if (address_vector == vendorAddress) {
        whitelisted_poz = i;
        break;
      }
    }
    assert(whitelisted_poz >= 0, "Address not in vendor whitelist.");
    const amount_used_so_far = this.vendorsInvoicesUsedLimit.get(vendorAddress, {
      defaultValue: BigInt(0)
    });
    const new_amount_used = amount_used_so_far + amount_in;
    assert(new_amount_used <= this.vendorsMaxLimit.get(vendorAddress, {
      defaultValue: BigInt(0)
    }), "You have reach your limit");
    this.vendorsInvoicesUsedLimit.set(vendorAddress, new_amount_used);
    if (this.payLater == false) {
      this.internalSendNEAR(vendorAddress, amount_in);
    }
  }
  // This method changes the state, for which it cost gas
  add_vendor({
    vendorAddress,
    limitAmount
  }) {
    assert(predecessorAccountId() == this.owner, "Only owner can add a new vendor");
    assert(limitAmount > BigInt(0), "Amount should be greater than 0");
    log(`add_vendor called ${vendorAddress}`);
    validateAccountId(vendorAddress);
    this.vendorsList.push(vendorAddress);
    this.vendorsMaxLimit.set(vendorAddress, limitAmount);
  }
  // This method changes the state, for which it cost gas
  remove_vendor({
    vendorAddress
  }) {
    assert(predecessorAccountId() == this.owner, "Only owner can remove a vendor");
    assert(this.vendorsMaxLimit.get(vendorAddress, {
      defaultValue: BigInt(0)
    }) <= BigInt(0), "Not a vendor address.");
    assert(this.vendorsInvoicesUsedLimit.get(vendorAddress, {
      defaultValue: BigInt(0)
    }) <= BigInt(0), "Outstanding balance should be 0.");
    log(`remove_vendor called ${vendorAddress}`);
    var address_vector;
    var i = 0;
    for (i = 0; i < this.vendorsList.length; i++) {
      address_vector = this.vendorsList.get(i, {
        defaultValue: ""
      });
      if (address_vector == vendorAddress) {
        this.vendorsList.swapRemove(i); // The last element is replaced by this removed one the vector must not be order so no issues here
        break;
      }
    }
    this.vendorsMaxLimit.set(vendorAddress, BigInt(0));
  }

  // ^^^^^^^^^^^^^^^^ CALL METHODS ^^^^^^^^^^^^^^^^^^^^

  // vvvvvvvvvvvvvvvv VIEW METHODS vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

  // get values for this contract
  get_maxNumberVendor() {
    return this.maxNumberVendor;
  }
  // get values for this contract
  get_payLater() {
    return this.payLater;
  }
  // get values for this contract
  get_owner() {
    return this.owner;
  }
  // get values for this contract
  get_treasure() {
    return this.treasure;
  }
  // get values for this contract
  get_vendorsList() {
    return this.vendorsList;
  }
  // get values for this contract
  get_vendor_amount_used({
    vendorAddress
  }) {
    if (vendorAddress != "") {
      return this.vendorsInvoicesUsedLimit.get(vendorAddress, {
        defaultValue: BigInt(0)
      });
    } else {
      return BigInt(0);
    }
  }
  // get values for this contract
  get_vendor_max_amount({
    vendorAddress
  }) {
    if (vendorAddress != "") {
      return this.vendorsMaxLimit.get(vendorAddress, {
        defaultValue: BigInt(0)
      });
    } else {
      return BigInt(0);
    }
  }
  // get values for this contract
  get_vendors_amount_used() {
    var i = 0;
    var address_vector;
    var all_vendors_amount_used = BigInt(0);
    for (i = 0; i < this.vendorsList.length; i++) {
      address_vector = this.vendorsList.get(i, {
        defaultValue: ""
      });
      if (address_vector == "") {
        all_vendors_amount_used = all_vendors_amount_used + this.vendorsInvoicesUsedLimit.get(address_vector, {
          defaultValue: BigInt(0)
        });
      }
    }
    return all_vendors_amount_used;
  }
  // get values for this contract
  get_vendors_max_amount() {
    var i = 0;
    var address_vector;
    var all_vendors_amount_used = BigInt(0);
    for (i = 0; i < this.vendorsList.length; i++) {
      address_vector = this.vendorsList.get(i, {
        defaultValue: ""
      });
      if (address_vector == "") {
        all_vendors_amount_used = all_vendors_amount_used + this.vendorsMaxLimit.get(address_vector, {
          defaultValue: BigInt(0)
        });
      }
    }
    return all_vendors_amount_used;
  }

  // ^^^^^^^^^^^^^^^^^^^^ VIEW METHODS ^^^^^^^^^^^^^^^^^^^^
}, (_applyDecoratedDescriptor(_class2.prototype, "init", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "init"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "deposit_treasure", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "deposit_treasure"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "pay_vendor", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "pay_vendor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "pay_all_vendors", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "pay_all_vendors"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "withdraw_treasure", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "withdraw_treasure"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "set_invoice", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "set_invoice"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add_vendor", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "add_vendor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "remove_vendor", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "remove_vendor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "get_maxNumberVendor", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "get_maxNumberVendor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "get_payLater", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "get_payLater"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "get_owner", [_dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "get_owner"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "get_treasure", [_dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "get_treasure"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "get_vendorsList", [_dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "get_vendorsList"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "get_vendor_amount_used", [_dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "get_vendor_amount_used"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "get_vendor_max_amount", [_dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "get_vendor_max_amount"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "get_vendors_amount_used", [_dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "get_vendors_amount_used"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "get_vendors_max_amount", [_dec18], Object.getOwnPropertyDescriptor(_class2.prototype, "get_vendors_max_amount"), _class2.prototype)), _class2)) || _class);
function get_vendors_max_amount() {
  const _state = DirectDebit._getState();
  if (!_state && DirectDebit._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = DirectDebit._create();
  if (_state) {
    DirectDebit._reconstruct(_contract, _state);
  }
  const _args = DirectDebit._getArgs();
  const _result = _contract.get_vendors_max_amount(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(DirectDebit._serialize(_result, true));
}
function get_vendors_amount_used() {
  const _state = DirectDebit._getState();
  if (!_state && DirectDebit._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = DirectDebit._create();
  if (_state) {
    DirectDebit._reconstruct(_contract, _state);
  }
  const _args = DirectDebit._getArgs();
  const _result = _contract.get_vendors_amount_used(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(DirectDebit._serialize(_result, true));
}
function get_vendor_max_amount() {
  const _state = DirectDebit._getState();
  if (!_state && DirectDebit._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = DirectDebit._create();
  if (_state) {
    DirectDebit._reconstruct(_contract, _state);
  }
  const _args = DirectDebit._getArgs();
  const _result = _contract.get_vendor_max_amount(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(DirectDebit._serialize(_result, true));
}
function get_vendor_amount_used() {
  const _state = DirectDebit._getState();
  if (!_state && DirectDebit._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = DirectDebit._create();
  if (_state) {
    DirectDebit._reconstruct(_contract, _state);
  }
  const _args = DirectDebit._getArgs();
  const _result = _contract.get_vendor_amount_used(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(DirectDebit._serialize(_result, true));
}
function get_vendorsList() {
  const _state = DirectDebit._getState();
  if (!_state && DirectDebit._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = DirectDebit._create();
  if (_state) {
    DirectDebit._reconstruct(_contract, _state);
  }
  const _args = DirectDebit._getArgs();
  const _result = _contract.get_vendorsList(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(DirectDebit._serialize(_result, true));
}
function get_treasure() {
  const _state = DirectDebit._getState();
  if (!_state && DirectDebit._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = DirectDebit._create();
  if (_state) {
    DirectDebit._reconstruct(_contract, _state);
  }
  const _args = DirectDebit._getArgs();
  const _result = _contract.get_treasure(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(DirectDebit._serialize(_result, true));
}
function get_owner() {
  const _state = DirectDebit._getState();
  if (!_state && DirectDebit._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = DirectDebit._create();
  if (_state) {
    DirectDebit._reconstruct(_contract, _state);
  }
  const _args = DirectDebit._getArgs();
  const _result = _contract.get_owner(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(DirectDebit._serialize(_result, true));
}
function get_payLater() {
  const _state = DirectDebit._getState();
  if (!_state && DirectDebit._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = DirectDebit._create();
  if (_state) {
    DirectDebit._reconstruct(_contract, _state);
  }
  const _args = DirectDebit._getArgs();
  const _result = _contract.get_payLater(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(DirectDebit._serialize(_result, true));
}
function get_maxNumberVendor() {
  const _state = DirectDebit._getState();
  if (!_state && DirectDebit._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = DirectDebit._create();
  if (_state) {
    DirectDebit._reconstruct(_contract, _state);
  }
  const _args = DirectDebit._getArgs();
  const _result = _contract.get_maxNumberVendor(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(DirectDebit._serialize(_result, true));
}
function remove_vendor() {
  const _state = DirectDebit._getState();
  if (!_state && DirectDebit._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = DirectDebit._create();
  if (_state) {
    DirectDebit._reconstruct(_contract, _state);
  }
  const _args = DirectDebit._getArgs();
  const _result = _contract.remove_vendor(_args);
  DirectDebit._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(DirectDebit._serialize(_result, true));
}
function add_vendor() {
  const _state = DirectDebit._getState();
  if (!_state && DirectDebit._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = DirectDebit._create();
  if (_state) {
    DirectDebit._reconstruct(_contract, _state);
  }
  const _args = DirectDebit._getArgs();
  const _result = _contract.add_vendor(_args);
  DirectDebit._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(DirectDebit._serialize(_result, true));
}
function set_invoice() {
  const _state = DirectDebit._getState();
  if (!_state && DirectDebit._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = DirectDebit._create();
  if (_state) {
    DirectDebit._reconstruct(_contract, _state);
  }
  const _args = DirectDebit._getArgs();
  const _result = _contract.set_invoice(_args);
  DirectDebit._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(DirectDebit._serialize(_result, true));
}
function withdraw_treasure() {
  const _state = DirectDebit._getState();
  if (!_state && DirectDebit._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = DirectDebit._create();
  if (_state) {
    DirectDebit._reconstruct(_contract, _state);
  }
  const _args = DirectDebit._getArgs();
  const _result = _contract.withdraw_treasure(_args);
  DirectDebit._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(DirectDebit._serialize(_result, true));
}
function pay_all_vendors() {
  const _state = DirectDebit._getState();
  if (!_state && DirectDebit._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = DirectDebit._create();
  if (_state) {
    DirectDebit._reconstruct(_contract, _state);
  }
  const _args = DirectDebit._getArgs();
  const _result = _contract.pay_all_vendors(_args);
  DirectDebit._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(DirectDebit._serialize(_result, true));
}
function pay_vendor() {
  const _state = DirectDebit._getState();
  if (!_state && DirectDebit._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = DirectDebit._create();
  if (_state) {
    DirectDebit._reconstruct(_contract, _state);
  }
  const _args = DirectDebit._getArgs();
  const _result = _contract.pay_vendor(_args);
  DirectDebit._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(DirectDebit._serialize(_result, true));
}
function deposit_treasure() {
  const _state = DirectDebit._getState();
  if (!_state && DirectDebit._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = DirectDebit._create();
  if (_state) {
    DirectDebit._reconstruct(_contract, _state);
  }
  const _args = DirectDebit._getArgs();
  const _result = _contract.deposit_treasure(_args);
  DirectDebit._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(DirectDebit._serialize(_result, true));
}
function init() {
  const _state = DirectDebit._getState();
  if (_state) {
    throw new Error("Contract already initialized");
  }
  const _contract = DirectDebit._create();
  const _args = DirectDebit._getArgs();
  const _result = _contract.init(_args);
  DirectDebit._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(DirectDebit._serialize(_result, true));
}

export { add_vendor, deposit_treasure, get_maxNumberVendor, get_owner, get_payLater, get_treasure, get_vendor_amount_used, get_vendor_max_amount, get_vendorsList, get_vendors_amount_used, get_vendors_max_amount, init, pay_all_vendors, pay_vendor, remove_vendor, set_invoice, withdraw_treasure };
//# sourceMappingURL=direct_debit.js.map

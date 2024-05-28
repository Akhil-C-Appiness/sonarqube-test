

export default function isRTL(str) {
    const rtlChars = '\u0590-\u05FF\u0600-\u06FF\u0700-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF';
    const rtlDirCheck = new RegExp(`[${rtlChars}]`);
    return rtlDirCheck.test(str);
  }
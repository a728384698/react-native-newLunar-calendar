/*
 * MIT License
 *
 * Copyright (c) 2017 Tang Xiaozhe.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

"use strict";

let madd = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
let tgString = "甲乙丙丁戊己庚辛壬癸";
let dzString = "子丑寅卯辰巳午未申酉戌亥";
let numString = "一二三四五六七八九十";
let monString = "正二三四五六七八九十冬腊";
let weekString = "日一二三四五六";
let sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
let calendarData = [0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957,
  0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E,
  0x92E,
  0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D,
  0x2192B,
  0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B,
  0x8152A,
  0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95,
  0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5,
  0xB54,
  0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4,
  0x615B4,
  0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6,
  0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B,
  0x25D,
  0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B,
  0x60A57,
  0x52B, 0xA93, 0x40E95
];

function getBit(m, n) {
  return (m >> n) & 1;
}

function e2c(date) {
  let total, m, n, k, isEnd;
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  total = (year - 1921) * 365 + Math.floor((year - 1921) / 4) + madd[month] +
    day - 38;

  if (date.getYear() % 4 === 0 && month > 1) total++;

  for (m = 0, isEnd = false; ; m++) {
    k = (calendarData[m] < 0xfff) ? 11 : 12;
    for (n = k; n >= 0; n--) {
      if (total <= 29 + getBit(calendarData[m], n)) {
        isEnd = true;
        break;
      }
      total = total - 29 - getBit(calendarData[m], n);
    }
    if (isEnd) break;
  }
  year = 1921 + m;
  month = k - n + 1;
  day = total;
  if (k === 12 && month == Math.floor(calendarData[m] / 0x10000) + 1)
    month = 1 - month;
  if (k === 12 && month > Math.floor(calendarData[m] / 0x10000) + 1)
    month--;
  return {
    year: year,
    month: month,
    day: day
  };
}

function getLunarDate(date) {
  let year = date.getFullYear();
  let month;
  let day;
  if (year < 1921 || year > 2100) {
    return {};
  }
  date = e2c(date);
  year = date.year;
  month = date.month;
  day = date.day;

  let isLeapYear = month < 1;
  let lunarDay = '';
  if (day < 11) lunarDay += "初";
  else if (day < 20) lunarDay += "十";
  else if (day < 30) lunarDay += "廿";
  else lunarDay += "三十";
  if (day % 10 || day === 10) lunarDay += numString.charAt((day - 1) % 10);
  return {
    year: tgString.charAt((year - 4) % 10) + dzString.charAt((year - 4) % 12),
    zodiac: sx.charAt((year - 4) % 12),
    isLeapYear: isLeapYear,
    month: isLeapYear ? monString.charAt(-month - 1) : monString.charAt(month -
      1),
    day: lunarDay
  };
}

module.exports = getLunarDate;





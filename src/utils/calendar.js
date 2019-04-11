import fecha from 'fecha'

export const weeks = ['日', '一', '二', '三', '四', '五', '六']

export const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

export const getDayCountOfMonth = function (year, month) {
  if (month === 3 || month === 5 || month === 8 || month === 10) {
    return 30
  }

  if (month === 1) {
    if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
      return 29
    } else {
      return 28
    }
  }

  return 31
}

export const getFirstDayOfMonth = function (date) {
  const temp = new Date(date.getTime())
  temp.setDate(1)
  return temp.getDay()
}

export const prevMonth = function (date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  return month === 0
    ? changeYearMonthAndClampDate(date, year - 1, 11)
    : changeYearMonthAndClampDate(date, year, month - 1)
}

export const nextMonth = function (date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  return month === 11
    ? changeYearMonthAndClampDate(date, year + 1, 0)
    : changeYearMonthAndClampDate(date, year, month + 1)
}

export const prevDate = function (date, amount = 1) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - amount)
}

export const nextDate = function (date, amount = 1) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)
}

export const getStartDateOfMonth = function (year, month) {
  const result = new Date(year, month, 1)
  const day = result.getDay()

  if (day === 0) {
    return prevDate(result, 7)
  } else {
    return prevDate(result, day)
  }
}

export const isDate = function (date) {
  if (date === null || date === undefined) return false
  if (isNaN(new Date(date).getTime())) return false
  if (Array.isArray(date)) return false
  return true
}

export const range = function (n) {
  // see https://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
  return Array.apply(null, {length: n}).map((_, n) => n)
}

export const modifyDate = function (date, y, m, d) {
  return new Date(y, m, d, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds())
}

export const clearTime = function (date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export const changeYearMonthAndClampDate = function (date, year, month) {
  // clamp date to the number of days in `year`, `month`
  // eg: (2010-1-31, 2010, 2) => 2010-2-28
  const monthDate = Math.min(date.getDate(), getDayCountOfMonth(year, month))
  return modifyDate(date, year, month, monthDate)
}

export const nowYear = function (date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  return changeYearMonthAndClampDate(date, year, month)
}

export const nextYear = function (date, amount = 1) {
  const year = date.getFullYear()
  const month = date.getMonth()
  return changeYearMonthAndClampDate(date, year + amount, month)
}

export const prevYear = function (date, amount = 1) {
  const year = date.getFullYear()
  const month = date.getMonth()
  return changeYearMonthAndClampDate(date, year - amount, month)
}

export const toDate = function (date) {
  return isDate(date) ? new Date(date) : null
}

export const formatDate = function (date, format) {
  date = toDate(date)
  if (!date) return ''
  return fecha.format(date, format || 'YYYY-MM-DD')
}

export const parseDate = function (string, format) {
  return fecha.parse(string, format || 'YYYY-MM-DD')
}

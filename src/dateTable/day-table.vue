<template lang="pug">
  table.cl-day-content(
    cellspacing="0"
    cellpadding="0"
    @click="handleClick"
  )
    tbody
      tr
        th(
          v-for="(week, key) in weeks"
          :key="key"
        ) {{ week }}
      tr(
        v-for="(row, key) in rows"
        :key="key"
      )
        td(
          v-for="(cell, key) in row"
          :key="key"
          :class="getCellClasses(cell)"
        )
          div
            span {{ cell.text }}
</template>
<script>
import { weeks, getFirstDayOfMonth, getDayCountOfMonth, getStartDateOfMonth, nextDate, clearTime as _clearTime } from '../utils/calendar'

const getDateTimestamp = function (time) {
  if (typeof time === 'number' || typeof time === 'string') {
    return _clearTime(new Date(time)).getTime()
  } else if (time instanceof Date) {
    return _clearTime(time).getTime()
  } else {
    return NaN
  }
}

export default {
  props: {
    firstDayOfWeek: {
      default: 7,
      type: Number,
      validator: val => val >= 1 && val <= 7
    },
    value: {},
    date: {},
    disabledDate: {}
  },

  data () {
    return {
      weeks: weeks,
      tableRows: [ [], [], [], [], [], [] ]
    }
  },

  computed: {
    offsetDay () {
      const week = this.firstDayOfWeek
      // 周日为界限，左右偏移的天数，3217654 例如周一就是 -1，目的是调整前两行日期的位置
      return week > 3 ? 7 - week : -week
    },
    year () {
      return this.date.getFullYear()
    },
    month () {
      return this.date.getMonth()
    },
    startDate () {
      return getStartDateOfMonth(this.year, this.month)
    },
    rows () {
      const date = new Date(this.year, this.month, 1)
      // 寻找当月第一天
      let day = getFirstDayOfMonth(date)
      const dateCountOfMonth = getDayCountOfMonth(date.getFullYear(), date.getMonth())
      const dateCountOfLastMonth = getDayCountOfMonth(date.getFullYear(), (date.getMonth() === 0 ? 11 : date.getMonth() - 1))

      day = (day === 0 ? 7 : day)

      const offset = this.offsetDay
      const rows = this.tableRows
      let count = 1

      const startDate = this.startDate
      const disabledDate = this.disabledDate
      const now = getDateTimestamp(new Date())

      for (let i = 0; i < 6; i++) {
        const row = rows[i]
        for (let j = 0; j < 7; j++) {
          let cell = row[j]
          if (!cell) {
            cell = { row: i, column: j, type: 'normal', inRange: false, start: false, end: false }
          }

          cell.type = 'normal'

          const index = i * 7 + j
          const time = nextDate(startDate, index - offset).getTime()
          const isToday = time === now

          if (isToday) {
            cell.type = 'today'
          }

          if (i >= 0 && i <= 1) {
            const numberOfDaysFromPreviousMonth = day + offset < 0 ? 7 + day + offset : day + offset
            if (j + i * 7 >= numberOfDaysFromPreviousMonth) {
              cell.text = count++
            } else {
              cell.text = dateCountOfLastMonth - (numberOfDaysFromPreviousMonth - j % 7) + 1 + i * 7
              cell.type = 'prev-month'
            }
          } else {
            if (count <= dateCountOfMonth) {
              cell.text = count++
            } else {
              cell.text = count++ - dateCountOfMonth
              cell.type = 'next-month'
            }
          }

          let cellDate = new Date(time)
          cell.disabled = typeof disabledDate === 'function' && disabledDate(cellDate)
          this.$set(row, this.showWeekNumber ? j + 1 : j, cell)
        }
      }

      return rows
    }
  },

  methods: {
    cellMatchesDate (cell, date) {
      const value = new Date(date)
      return this.year === value.getFullYear() && this.month === value.getMonth() && Number(cell.text) === value.getDate()
    },
    getCellClasses (cell) {
      let classes = []
      if ((cell.type === 'normal' || cell.type === 'today') && !cell.disabled) {
        classes.push('available')
        if (cell.type === 'today') {
          classes.push('today')
        }
      } else {
        classes.push(cell.type)
      }

      if ((cell.type === 'normal' || cell.type === 'today') && this.cellMatchesDate(cell, this.value)) {
        classes.push('current')
      }

      if (cell.disabled) {
        classes.push('disabled')
      }

      return classes.join(' ')
    },
    getDateOfCell (row, column) {
      const offsetFromStart = row * 7 + column - this.offsetDay
      return nextDate(this.startDate, offsetFromStart)
    },
    handleClick (event) {
      let target = event.target
      if (target.tagName === 'SPAN') {
        target = target.parentNode.parentNode
      }
      if (target.tagName === 'DIV') {
        target = target.parentNode
      }

      if (target.tagName !== 'TD') return

      const row = target.parentNode.rowIndex - 1
      const column = target.cellIndex
      const cell = this.rows[row][column]
      if (cell.disabled) return

      const newDate = this.getDateOfCell(row, column)
      this.$emit('pick', newDate)
    }
  }
}
</script>
<style lang="less" scoped>
@color-primary-user: #FF4511;
@color-disabled: #D9D9D9;

.cl-day-content{
  width: 100%;
  & th{
    padding: 5px;
    color: #606266;
    font-weight: 400;
    border-bottom: 1px solid #ebeef5;
  }
  & td{
    width: 32px;
    height: 30px;
    padding: 4px 0;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    position: relative;

    & > div{
      height: 30px;
      padding: 3px 0;
      box-sizing: border-box;
      & > span {
        width: 24px;
        height: 24px;
        display: block;
        margin: 0 auto;
        line-height: 24px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
      }
    }

    &.today span{
      color: @color-primary-user;
    }

    &.disabled div{
      cursor: not-allowed;
      color: @color-disabled;
    }

    &.current:not(.disabled) span {
      color: #fff;
      background-color: @color-primary-user;
    }

    &.next-month, &.prev-month{
      color: @color-disabled;
    }
  }
}
</style>

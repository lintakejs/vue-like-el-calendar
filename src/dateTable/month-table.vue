<template lang="pug">
  table.cl-month-content
    tbody
      tr(
        v-for="(row, rowIndex) in rows"
        :key="rowIndex"
      )
        td(
          v-for="(cell, cellIndex) in row"
          :key="cellIndex"
          :class="getCellStyle(cell)"
          @click="handleMonthTableClick(rowIndex, cellIndex)"
        )
          div
            slot(:data="cell")
</template>
<script>
import { getDayCountOfMonth, nextDate, range } from '../utils/calendar'
import { hasClass } from '../utils/dom'
import { arrayFindIndex, coerceTruthyValueToArray } from '../utils/array'

const datesInMonth = (year, month) => {
  const numOfDays = getDayCountOfMonth(year, month)
  const firstDay = new Date(year, month, 1)
  return range(numOfDays).map(n => nextDate(firstDay, n))
}

const clearDate = (date) => {
  return new Date(date.getFullYear(), date.getMonth())
}

const getMonthTimestamp = function (time) {
  if (typeof time === 'number' || typeof time === 'string') {
    return clearDate(new Date(time)).getTime()
  } else if (time instanceof Date) {
    return clearDate(time).getTime()
  } else {
    return NaN
  }
}

export default {
  props: {
    value: {},
    date: {},
    disabledDate: {}
  },

  data () {
    return {
      tableRows: [ [], [], [] ]
    }
  },

  computed: {
    // 需要渲染的行
    rows () {
      const rows = this.tableRows
      const disabledDate = this.disabledDate
      const now = getMonthTimestamp(new Date())

      for (let i = 0; i < 3; i++) {
        const row = rows[i]
        for (let j = 0; j < 4; j++) {
          let cell = row[j]
          if (!cell) {
            cell = { row: i, column: j, type: 'normal', inRange: false, start: false, end: false }
          }

          cell.type = 'normal'

          const index = i * 4 + j
          const time = new Date(this.date.getFullYear(), index).getTime()
          cell.inRange = time >= getMonthTimestamp(this.minDate) && time <= getMonthTimestamp(this.maxDate)
          cell.start = this.minDate && time === getMonthTimestamp(this.minDate)
          cell.end = this.maxDate && time === getMonthTimestamp(this.maxDate)
          const isToday = time === now

          if (isToday) {
            cell.type = 'today'
          }

          cell.text = index

          let cellDate = new Date(time)
          cell.disabled = typeof disabledDate === 'function' && disabledDate(cellDate)
          this.$set(row, j, cell)
        }
      }
      return rows
    }
  },

  methods: {
    getCellStyle (cell) {
      const style = {}
      const year = this.date.getFullYear()
      const month = cell.text
      const today = new Date()
      style.disabled = typeof this.disabledDate === 'function'
        ? datesInMonth(year, month).every(this.disabledDate)
        : false
      style.current = arrayFindIndex(coerceTruthyValueToArray(this.value), date => date.getFullYear() === year && date.getMonth() === month) >= 0
      style.today = today.getFullYear() === year && today.getMonth() === month

      return style
    },
    getMonthOfCell (month) {
      const year = this.date.getFullYear()
      return new Date(year, month, 1)
    },
    handleMonthTableClick (rowIndex, cellIndex) {
      const row = rowIndex
      const column = cellIndex
      const cell = this.rows[row][column]
      if (cell.disabled) return
      const month = cell.text
      this.$emit('pick', month)
    }
  }
}
</script>
<style lang="less" scoped>
@color-primary-user: #FF4511;
@color-disabled: #D9D9D9;

.cl-month-content{
  width: 100%;
  & td {
    text-align: center;
    padding: 8px 3px;

    & .cell{
      width: 48px;
      height: 32px;
      display: block;
      line-height: 32px;
      color: #606266;
      margin: 0 auto;
      cursor: pointer;
    }

    & .cell:hover, &.current:not(.disabled) .cell, &.today .cell {
      color: @color-primary-user;
    }

    &.disabled .cell{
      cursor: not-allowed;
      color: @color-disabled;
    }
  }
}
</style>

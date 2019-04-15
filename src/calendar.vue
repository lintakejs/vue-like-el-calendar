<template lang="pug">
  div.cl-container
    div.cl-container-header.main-between.cross-center
      i.prev-trangle(
        @click="prevAction"
      )
      div.middle-content
        span.haeder-label {{ year }}年
        span.haeder-label.month-label(
          v-show="currentView === 'day'"
          @click="currentView = 'month'"
        ) {{ month + 1 }}月
      i.next-trangle(
        @click="nextAction"
      )
    day-table(
      v-show="currentView === 'day'"
      :value="chooseValue"
      :date="date"
      :disabled-date="disabledDate"
      :renderCell="renderDayCell"
      @pick="handleDayPick"
    )
      template(slot-scope="dayCell")
        slot(
          name="days"
          v-if="!!$scopedSlots.days"
          :data="dayCell.data"
        )
        div(v-else)
          span {{ dayCell.data.text }}
    month-table(
      v-show="currentView === 'month'"
      :value="chooseValue"
      :date="date"
      :disabled-date="disabledDate"
      :renderCell="renderMonthCell"
      @pick="handleMonthPick"
    )
      template(slot-scope="monthCell")
        slot(
          name="months"
          v-if="!!$scopedSlots.months"
          :data="monthCell.data"
        )
        div(v-else)
          a.cell {{ months[monthCell.data.text] }}
</template>
<script>
import monthTable from './dateTable/month-table.vue'
import dayTable from './dateTable/day-table.vue'
import { months, parseDate, formatDate, modifyDate, nowYear, prevYear, nextYear, prevMonth, nextMonth } from './utils/calendar'

export default {
  components: {
    'month-table': monthTable,
    'day-table': dayTable
  },

  props: {
    value: {
      type: [String, Number, Date],
      default: ''
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    selectMode: {
      type: String,
      default: 'day',
      validator: function (value) {
        return ['month', 'day'].indexOf(value) >= 0
      }
    },
    disabledDate: {
      type: Function,
      default: () => {}
    },
    renderDayCell: Function,
    renderMonthCell: Function
  },

  data () {
    return {
      months: months,
      currentView: this.selectMode,
      chooseValue: this.valueFormatDate(this.value),
      date: this.value ? nowYear(this.valueFormatDate(this.value)) : nowYear(new Date())
    }
  },

  computed: {
    year () {
      return this.date.getFullYear()
    },
    month () {
      return this.date.getMonth()
    }
  },

  methods: {
    valueFormatDate (value) {
      if (value instanceof Date) {
        return value
      }
      return parseDate(value)
    },
    // 左右切换动作
    prevAction () {
      if (this.currentView === 'month') {
        this.prevYear()
      } else {
        this.prevMonth()
      }
    },
    nextAction () {
      if (this.currentView === 'month') {
        this.nextYear()
      } else {
        this.nextMonth()
      }
    },
    // 年份切换
    prevYear () {
      this.date = prevYear(this.date)
    },
    nextYear () {
      this.date = nextYear(this.date)
    },
    // 月份切换
    prevMonth () {
      this.date = prevMonth(this.date)
    },
    nextMonth () {
      this.date = nextMonth(this.date)
    },
    // 月份选择
    handleMonthPick (month) {
      this.date = modifyDate(this.date, this.year, month, 1)
      if (this.selectMode === 'month') {
        this.chooseValue = this.date
        this.$emit('pickDate', formatDate(this.chooseValue, 'YYYY-MM'))
      } else {
        this.currentView = 'day'
      }
    },
    // 天选择
    handleDayPick (value) {
      this.chooseValue = modifyDate(this.chooseValue ? this.chooseValue : new Date(), value.getFullYear(), value.getMonth(), value.getDate())
      this.date = this.chooseValue
      this.$emit('pickDate', formatDate(this.chooseValue, this.format))
    }
  }
}
</script>
<style lang="less" scoped>
@color-white: #ffffff;
@color-primary-user: #FF4511;

.main-between{
 display: flex;
 justify-content: space-between;
}

.cross-center{
  display: flex;
  align-items: center;
}

.cl-container{
  min-width: 216px;
  margin: auto;
  padding: 24px 12px;
  background-color: @color-white;

  &-header{
    padding-bottom: 24px;
    & .yaar-content{
      font-size: 14px;
      color: rgba(0, 0, 0, .75);
      cursor: pointer;
    }

    & .prev-trangle{
      background-image: url("./assets/images/trangleLeft.png");
      background-size: cover;
      background-repeat: no-repeat;
      width: 5px;
      height: 8px;
      cursor: pointer;
    }

    & .next-trangle{
      background-image: url("./assets/images/trangleRight.png");
      background-size: cover;
      background-repeat: no-repeat;
      width: 5px;
      height: 8px;
      cursor: pointer;
    }

    & .haeder-label{
      font-size: 16px;
      font-weight: 500;
      padding: 0 5px;
      line-height: 22px;
      text-align: center;
      color: #606266;
      &.month-label{
        cursor: pointer;
        &:hover{
          color: @color-primary-user;
        }
      }
    }
  }
}
</style>

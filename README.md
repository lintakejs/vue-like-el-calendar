# vue-like-el-calendar
___

一个仿element datePicker样式的日历组件

## Usage
___

You can install with npm.

    npm install vue-like-el-calendar


```javascript
import vueLikeElCalendar from 'vue-like-el-calendar'
``` 

## API
___

### Props

| name           | type                               | default         | description |
| --------------- | ------------------------------ | --------------- | ------------- |
| value           | String,Number,Date        |                     | 选中的日期 |
| format         | String                             | YYYY-MM-DD | https://github.com/taylorhakes/fecha   |
| selectMode  | String                             | day              | 目前只支持月份以及日期选择, month / day |
| disabledDate| Function (time):Boolean |                      | 禁止选择的日期 |

### Events

| event      | description       | callback           |
| ----------- | ------------------- | ------------------ |
| pickDate | 当选中日期触发 | Function(time) |
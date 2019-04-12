<script>
export default {
  name: 'calendar-expand',

  functional: true,

  props: {
    cell: Object,
    render: Function
  },

  render: (h, ctx) => {
    const params = {
      cell: ctx.props.cell
    }
    if (ctx.props.cell) params.cell = ctx.props.cell
    return ctx.props.render(h, params)
  }
}
</script>

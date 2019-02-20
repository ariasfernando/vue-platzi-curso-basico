export default {
  methods: {
    setModuleHeight() {
      const firstRow = this.module.structure.rows[0];
      const setModuleHeight = (rowId, value)=>{
        this.$store.commit('module/setModuleHeight', {
          key:`row-${rowId}`,
          value,
        });
      }
      const setModuleHeightByRow = (row, type) => {
        let value = 0;
        const $row = $(`${type === 'multyRows' ? '[data-row-id=' + row.id + '] ' : ''}.column-draggable.has-component`)
        const $columns = $row.parents('[column-id]').length ? $row.parents('[column-id]') : $row;
        $columns.each((index, item) => {
          value = Math.max(value, $(item).height());
        });
        if (row.columns.filter(column => column.components.length === 0).length > 0) {
          value = Math.max(value, 150);
        }
        setModuleHeight(row.id, value);
      };

      if (this.module.structure.rows.length === 1 && this.module.structure.rows[0].columns.length === 1 ){
        const value = $('.module-wrapper').height();
        setModuleHeight(firstRow.id, value)
      } else if (this.module.structure.rows.length === 1) {
        setModuleHeightByRow(firstRow)
      } else if (this.module.structure.rows.length > 1) {
        _.forEach(this.module.structure.rows, (row)=>setModuleHeightByRow(row, 'multyRows'))
      };
    },
  },
};

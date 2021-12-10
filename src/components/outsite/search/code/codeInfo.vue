<script type="text/jsx">
  export default {
    props: {
      inOrderType: Object,
      outOrderType: Object,
      boxLabelSpan: Number,
      formatTime: Function,
      formatDate: Function,
      render: String,
      info: Object
    },
    methods: {
      renderCol(label, value) {
        const {boxLabelSpan} = this;
        return (
          <oms-col label={label} isShow={true} rowSpan={boxLabelSpan}>{value}</oms-col>
        );
      },
      renderPurchaseInfo(info) {
        const {inOrderType, renderCol, formatTime, formatDate} = this;
        const type = inOrderType[info.bizType];
        return (
          <div>
            {renderCol('货主', info.orgName)}
            {renderCol(`${type}订单`, info.orderNo)}
            {renderCol(`${type}日期`, formatDate(info.purchasingDate))}
            {renderCol('物流方式', <dict dict-group="transportationMeans" dict-key={info.logisticsMode}/>)}
            {
              info.temperatureQualifiedFlag !== null ? renderCol('温度是否合格', info.temperatureQualifiedFlag ? '合格' : '不合格') : ''
            }
          </div>
        );
      },
      renderSalesInfo(info) {
        const {outOrderType, formatTime, renderCol} = this;
        const type = outOrderType[info.bizType];
        return (
          <div>
            {renderCol('医疗机构', info.povName)}
            {renderCol(`${type}订单`, info.orderNo)}
            {renderCol('物流方式', <dict dict-group="outTransportMeans" dict-key={info.logisticsMode}/>)}
            {renderCol('签收时间', formatTime(info.signTime))}
            {
              info.temperatureQualifiedFlag !== null ? renderCol('温度是否合格', info.temperatureQualifiedFlag ? '合格' : '不合格') : ''
            }
          </div>
        );
      },
      renderPovInfo(list) {
        const {formatTime, renderCol} = this;
        const info = list[0];
        return (
          <div>
            {renderCol('医疗机构', info.povName)}
            {renderCol('接种时间', formatTime(info.createTime))}
            {renderCol('共注射', `${list.length}次`)}
          </div>
        );
      }
    },
    render() {
      const {render, info} = this;
      return this[render](info);
    }
  };
</script>



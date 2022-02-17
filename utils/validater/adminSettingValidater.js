import rules from './rules'
export default {
  data(){
    return {
      rules: {
        name: [
          { required: true, message: this.$t("请输入名称"), trigger: 'blur' },
          { validator: rules.FormValidate.Form().validatenall1_20Reg, trigger: 'blur' }
        ],
        deviceList: [
          { required: true, type: 'array', min: 1,message: this.$t("请选择信息"), trigger: 'change' },
        ],
        partUserIds: [
          { required: true, type: 'array', min: 1,message: this.$t("请选择信息"), trigger: 'change' },
        ],
        auditUserIds: [
          { required: true, type: 'array', min: 1,message: this.$t("请选择信息"), trigger: 'change' },
        ]
      }
    }
  }
}

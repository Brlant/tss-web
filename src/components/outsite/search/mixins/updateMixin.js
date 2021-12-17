import {http} from '@/resources';
export default {
  created() {
    this.updateApi(); //刷新接口，保持登录状态
  },
  methods: {
    updateApi() {
      setInterval(()=>{
        http.get('/codes/yaojian/refresh').then(res=>{})
      },60000)
    }
  }
}

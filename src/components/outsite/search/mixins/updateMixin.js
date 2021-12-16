import {http} from '@/resources';
export default {
  created() {
    this.updateApi();
  },
  methods: {
    updateApi() {
      setInterval(()=>{
        http.get('/codes/yaojian/refresh').then(res=>{})
      },60000)
    }
  }
}

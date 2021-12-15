import {http} from '@/resources';
export default {
  created() {
    this.updateApi();

  },
  methods: {
    updateApi() {
      setInterval(()=>{
        http.get('/codes/refresh').then(res=>{})
      },60000)
    }
  }
}

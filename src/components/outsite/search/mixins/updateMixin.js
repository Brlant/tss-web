import {http} from '@/resources';
export default {
  create() {
    this.updateApi();
  },
  methods: {
    updateApi() {
      setInterval(()=>{
        http.get('/codes/refresh').then(res=>{})
      },1000)
    }
  }
}

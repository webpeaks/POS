import Vue from 'vue';
import Router from 'vue-router';
import Pos from '@/components/page/Pos';
// import LeftNav from '@/components/common/leftNav';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path     : '/',
      name     : 'Pos',
      component: Pos
    },
    // {
    //   path     : '/common/leftNav',
    //   name     : 'leftNav',
    //   component: LeftNav
    // }
  ]
});

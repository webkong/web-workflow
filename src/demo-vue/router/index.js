import Vue from 'vue';
import Router from 'vue-router';
import Index from '../components/Index';
import List from '../components/List';

Vue.use(Router);

const router = new Router({
  routes: [
    {path: '/', component: Index, name: 'index'},
    {path: '/list/:id', component: List, name: 'list'}
  ]
});

export default router;

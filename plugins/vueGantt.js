import Vue from 'vue';
import {gantt} from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css"
export default ({ app, store, req }) => {
  Vue.prototype.$gantt = gantt;
}

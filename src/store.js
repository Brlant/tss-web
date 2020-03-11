import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//  需要维护的状态
const state = {
  uploadUrl: 'https:// jsonplaceholder.typicode.com/posts/',
  user: {},
  dict: {},
  permissions: [],
  permList: {},
  roleList: {},
  attachmentDialog: {attachmentId: 0, open: false, attachmentList: [], objectId: '', objectType: ''},
  windowSize: {width: 1000, height: 500},
  form: {},
  bodyHeight: 0,
  domainInfo: {},
  orgRelationLevel: [],
  requestingDictAry: [],
  bottomLoading: false,
  menuParentIds: [], // 所有非叶子节点菜单
  print: {
    isPrinting: false,
    text: '正在下载'
  },
  goodsTypeList: [
    {key: '1', label: '疫苗（国产）'},
    {key: '2', label: '疫苗（进口）'},
    {key: '3', label: '一般药品（国产）'},
    {key: '4', label: '一般药品（进口）'},
    {key: '5', label: '特殊药品（国产）'},
    {key: '6', label: '特殊药品（进口）'},
    {key: '7', label: '国产医疗器械'},
    {key: '8', label: '进口医疗器械'},
    {key: '9', label: '其他'}
  ],
  orgRelationType: [
    {key: '1', label: '境内药品生产企业'},
    {key: '2', label: '境外药品生产企业'},
    {key: '3', label: '境内医疗器械生产企业'},
    {key: '4', label: '境外医疗器械生产企业'},
    {key: '5', label: '药品经营企业'},
    {key: '6', label: '医疗器械经营企业'},
    {key: '7', label: '进口代理企业'},
    {key: '8', label: '疾病预防控制机构'},
    {key: '9', label: '配送单位'},
    {key: '10', label: '疫苗接种单位'},
    {key: '11', label: '医疗机构'},
    {key: '12', label: '其他'}
  ],
  allPermission: {
    unit: 'query-all-supervise-unit',
    goods: 'query-all-supervise-goods',
  }
};

const mutations = {
  initUser(state, data) {
    try {
      if (data && data.userId) {
        window.localStorage.setItem('user', JSON.stringify(data));
        state.user = data;
      }
    } catch (e) {

    }
  },
  initDict(state, data) {
    state.dict = data;
  },
  initPermissions(state, data) {
    state.permissions = data;
  },
  initPermList(state, data) {
    state.permList = data;
  },
  changeAttachment(state, data) {
    let currentId;
    if (typeof data === 'object') {
      currentId = data.currentId;
      state.attachmentDialog.attachmentList = data.attachmentList;
    } else {
      currentId = data;
      state.attachmentDialog.attachmentList = [];
    }
    if (state.attachmentDialog.attachmentId === currentId) {
      state.attachmentDialog.open = true;
    } else {
      state.attachmentDialog.attachmentId = currentId;
    }
  },
  openAttachmentDialog(state) {
    state.attachmentDialog.open = true;
  },
  closeAttachmentDialog(state) {
    state.attachmentDialog.open = false;
  },
  setBodyHeight(state, data) {
    state.bodyHeight = data.height;
    state.windowSize = data.window;
  },
  initDomainInfo(state, data) {
    state.domainInfo = data;
    let title = document.getElementById('codesTitle');
    if (data.id) {
      title.innerHTML = data.name ? data.name : 'TSS 追溯监控系统';
    } else {
      title.innerHTML = 'TSS 追溯监控系统';
    }
  },
  initPrint(state, data) {
    data.text = data.text || '正在下载';
    state.print = data;
  },
  inItOrgRelationLevel(state, data) {
    state.orgRelationLevel = data;
  },
  initRequestingDictAry(state, data) {
    state.requestingDictAry = data;
  },
  initMenuParentIds(state, data) {
    state.menuParentIds = data;
  },
  initBottomLoading(state, data) {
    state.bottomLoading = data;
  }
};

export default new Vuex.Store({
  state,
  mutations
});

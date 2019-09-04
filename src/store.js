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

'use strict';

/* global $ */

/****************************************
* Login Panel Manager
****************************************/
var JM_userNamePanelMgr = function (args) {
  this.container_id = args.containerId;
  this.input_id = args.textInputId;
  this.loading_id = args.loadingId;
  this.alert_id = args.alertId;

  var self = this;
  $(document).ready(function () {
    self.getLoadingEle().hide();
    self.getAlertEle().hide();
  });
};
JM_userNamePanelMgr.prototype = {
  alert_duration: 5000,

  getEle: function () {
    return $('#' + this.input_id);
  },
  getLoadingEle: function () {
    return $('#' + this.loading_id);
  },
  getContainerEle: function () {
    return $('#' + this.container_id);
  },
  getAlertEle: function () {
    return $('#' + this.alert_id);
  },

  getEleValue: function () {
    return this.getEle().val();
  },
  clear: function () {
    this.getEle().val('');
  },

  showLoading: function () {
    this.getEle().parent().hide();
    this.getLoadingEle().show();
  },
  hideLoading: function () {
    this.getEle().parent().show();
    this.getLoadingEle().hide();
  },

  alert: function (message) {
    var ele = this.getAlertEle();
    ele.text(message);
    ele.show();
    var self = this;
    setTimeout(function () {
      self.getAlertEle().hide();
    }, this.alert_duration);
  },

  hide: function () {
    this.getContainerEle().hide();
  },
  show: function () {
    this.getContainerEle().show();
  },

  go: function () {
    this.showLoading();
    return this.getEleValue();
  },
  ungo: function () {
    this.clear();
    this.hideLoading();
  },
};

var JM_rosterListPanelMgr = function (args) {
  this.container_id = args.containerId;
  this.list_container_id = args.listContainerId;
  this.buttonClass = args.buttonClass;
  this.loading_id = args.loadingId;
  this.alert_id = args.alertId;

  var self = this;
  $(document).ready(function () {
    self.getLoadingEle().hide();
    self.getAlertEle().hide();
  });
};
JM_rosterListPanelMgr.prototype = {
  button_template: '<button class="btn btn-default"></button>',
  alert_duration: 5000,

  getListContainerEle: function () {
    return $('#' + this.list_container_id);
  },
  getContainerEle: function () {
    return $('#' + this.container_id);
  },

  getLoadingEle: function () {
    return $('#' + this.loading_id);
  },

  getAlertEle: function () {
    return $('#' + this.alert_id);
  },

  showLoading: function () {
    this.getListContainerEle().hide();
    this.getLoadingEle().show();
  },
  hideLoading: function () {
    this.getListContainerEle().show();
    this.getLoadingEle().hide();
  },

  alert: function (message) {
    var ele = this.getAlertEle();
    ele.text(message);
    ele.show();
    var self = this;
    setTimeout(function () {
      self.getAlertEle().hide();
    }, this.alert_duration);
  },

  clear: function () {
    this.getListContainerEle().empty();
  },

  addRoster: function (rosterName, onclick) {
    var newButton = $(this.button_template);
    newButton.addClass(this.buttonClass);
    newButton.text(rosterName);
    newButton.click(onclick);
    this.getListContainerEle().append(newButton);
  },

  addRosterList: function (rosterList, callbackReturner, clearFirst) {
    if (clearFirst) {
      this.clear();
    }

    var i;
    for (i = 0; i < rosterList.length; i++) {
      var rosterObj = rosterList[i];
      var onclick = callbackReturner(rosterObj);
      this.addRoster(rosterObj.name, onclick);
    }
  },

  go: function () {
    this.showLoading();
  },
  ungo: function () {
    this.hideLoading();
  },

  hide: function () {
    this.getContainerEle().hide();
  },

  show: function () {
    this.getContainerEle().show();
  },
};

var JM_rosterPanelMgr = function (args) {
  this.container_id = args.containerId;
};
JM_rosterPanelMgr.prototype = {
  getContainerEle: function () {
    return $('#' + this.container_id);
  },

  hide: function () {
    this.getContainerEle().hide();
  },

  show: function () {
    this.getContainerEle().show();
  },
};

/****************************************
* UI interaction Manager
****************************************/
var JM_uiMgr = function (jm, userNameMgr, rosterListMgr, rosterPanelMgr) {
  this.jm = jm;
  this.userNameMgr = userNameMgr;
  this.rosterListMgr = rosterListMgr;
  this.rosterMgr = rosterPanelMgr;

  var self = this;
  $(document).ready(function () {
    self.rosterListMgr.hide();
    self.rosterMgr.hide();
  });
};
JM_uiMgr.prototype = {
  login: function () {
    var userName = this.userNameMgr.go();
    if (!userName) {
      this.userNameMgr.ungo();
      return;
    }
    var self = this;
    this.jm.getUserId(userName, function (err, data) {
      if (err) {
        self.userNameMgr.alert('Unable to retrieve user id');
        self.userNameMgr.ungo();
        return;
      }

      if (!data.user_id) {
        self.userNameMgr.alert('User not found');
        self.userNameMgr.ungo();
        return;
      }

      var userId = data.user_id;
      self.jm.getRosterList(userId, function (err, data) {
        if (err) {
          self.userNameMgr.alert('Unable to retrieve roster list');
          self.userNameMgr.ungo();
          return;
        }

        self.userNameMgr.hide();
        self.userNameMgr.ungo();

        self.rosterListMgr.addRosterList(data, function (rosterObj) {
          return function () {
            self.showRoster(rosterObj.roster_id);
          };
        }, true);
        self.rosterListMgr.show();
      });
    });
  },

  showRoster: function (rosterId) {
    this.rosterListMgr.go();

    var self = this;
    this.jm.getRoster(rosterId, function (err, data) {
      self.rosterListMgr.ungo();
      if (err) {
        self.rosterListMgr.alert('Unable to retrieve roster');
        return;
      }

      if (!data) {
        self.rosterListMgr.alert('Roster not found');
        return;
      }

      self.roster_data = data;
      self.rosterListMgr.hide();
      self.rosterMgr.show();
    });
  },
};
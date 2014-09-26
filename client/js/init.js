'use strict';

/* global JerseyMapper */
/* global JM_userNamePanelMgr */
/* global JM_rosterListPanelMgr */
/* global JM_rosterPanelMgr */
/* global JM_uiMgr */

var jm = new JerseyMapper(); //jshint ignore:line

var jm_loginMgr = new JM_userNamePanelMgr({ //jshint ignore:line
  containerId: 'jm_login',
  textInputId: 'jm_login_input',
  loadingId: 'jm_login_loading',
  alertId: 'jm_login_alert',
}); 

var jm_rosterListMgr = new JM_rosterListPanelMgr({
  containerId: 'jm_roster_list',
  listContainerId: 'jm_roster_list_container',
  buttonClass: 'jm_btn-roster',
  loadingId: 'jm_roster_list_loading',
  alertId: 'jm_roster_list_alert',
});

var jm_rosterMgr = new JM_rosterPanelMgr({
	containerId: 'jm_roster',
});

var jm_uiMgr = new JM_uiMgr(jm, jm_loginMgr, jm_rosterListMgr, jm_rosterMgr); // jshint ignore:line

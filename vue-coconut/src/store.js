import Vue from 'vue';
import Vuex from 'vuex';
import * as forge from 'node-forge';
const fs = require('fs');
import axios from 'axios';
import main from './main';

Vue.use(Vuex);

const resourceHost = 'http://localhost:3000'

export default new Vuex.Store({
    state: {
        sToken: null,
        pToken: null,
    },
    getters: {
        LoggedIn : function (state) {
        }
    },
    mutations: {
        GET_TOKENS : function(state, payload) {
            state.sToken = localStorage.getItem('sToken');
            state.pToken = localStorage.getItem('pToken');
        },
        LOGIN : function (state, payload) {
            state.sToken = payload.data.stoken;
            state.pToken = payload.data.ptoken;
            localStorage.setItem('pToken', payload.data.ptoken);
            localStorage.setItem('sToken', payload.data.stoken);
            let result = true;
            return result;
        },
        LOGOUT : function (state) {
            state.sToken = null;
            state.pToken = null;
            localStorage.removeItem('sToken');
            localStorage.removeItem('pToken');
        }
    },
    actions: {
        LOGIN : function (context, payload) {
            return axios.post( resourceHost+'/users/authenticate', payload);
            //return axios.post( '/users/authenticate', payload);
        },
        LOGOUT : function (context) {
            context.commit('LOGOUT');
        },
        GetProfile : function (context, payload) {
            return axios.get(
                resourceHost+'/users/profile',
                { headers: {
                    "Authorization" : payload.ptoken,
                        "Ctime" : payload.currT,
                        "Auth" : payload.auth,
                        "Content-Type" : 'application/json'
                    }
                });
        },
        GetProfile2 : function (context) {
            let currTime = new Date().getTime();
            let pt = localStorage.getItem('pToken');
            let st = localStorage.getItem('sToken');

            var md = forge.md.sha256.create();
            md.update(currTime + st);
            let auth = md.digest().toHex();

            return axios.get(
                resourceHost+'/users/profile',
                { headers: {
                        "Authorization" : pt,
                        "Ctime" : currTime,
                        "Auth" : auth,
                        "Content-Type" : 'application/json'
                    }
                });
        },
    }
})
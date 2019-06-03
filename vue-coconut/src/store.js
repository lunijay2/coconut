import Vue from 'vue';
import Vuex from 'vuex';
import * as forge from 'node-forge';
const fs = require('fs');
import axios from 'axios';
import main from './main';

Vue.use(Vuex);

const resourceHost = 'http://localhost:3000';

export default new Vuex.Store({
    state: {
        sToken: null,
        pToken: null,
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
        REGISTER : function (context, payload) {
            return axios.post( resourceHost+payload.path, payload.user);
            //return axios.post( payload.path, payload.user);
        },
        GetProfile : function (context) {
            let currTime = new Date().getTime();
            let pt = localStorage.getItem('pToken');
            let st = localStorage.getItem('sToken');

            var md = forge.md.sha256.create();
            md.update(currTime + st);
            let auth = md.digest().toHex();

            return axios.get(
                resourceHost+'/users/profile',
                //'/users/profile',
                { headers: {
                        "Authorization" : pt,
                        "Ctime" : currTime,
                        "Auth" : auth,
                        "Content-Type" : 'application/json'
                    }
                });
        },
        PAY : function (context, payload) {
            return axios.post( resourceHost+'/Pay/procpay', payload);
            //return axios.post( '/Pay/procpay', payload);
        },
        GetProduct : function (context) {
            return axios.post(resourceHost+'/stores/Product');
        },
        GetStore : function (context) {
            return axios.post(resourceHost+'/stores/Store');
        },
        FoundEnt : function (context, payload) {
            return axios.post(resourceHost+'/stores/FoundEnt', payload);
        },
        FindProduct : function (context, payload) {
            return axios.post(resourceHost+'/stores/FindProduct', payload);
        }
    }
})
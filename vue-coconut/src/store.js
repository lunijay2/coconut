import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);

const resourceHost = 'http://localhost:3000'

export default new Vuex.Store({
    state: {
        sToken: null,
        pToken: null
    },
    getters: {

    },
    mutations: {
        LOGIN : function (state, payload) {
            state.Tokens = payload;
            localStorage.setItem('pToken', payload.ptoken);
            localStorage.setItem('sToken', payload.stoken);
            let data = { success : true };
            return data;
        },
        LOGOUT : function (state) {
            state.Tokens = null;
            localStorage.removeItem('sToken');
            localStorage.removeItem('pToken');
        },
        LoggedIn : function (state) {
            return tokenNotExpired('pToken');
        }
    },
    actions: {
        LOGIN : function (context, payload) {
            return axios.post( resourceHost+'/users/authenticate', payload)
                .then(function (data) {
                    return data;
                });
        },
        LOGOUT : function (context) {
            context.commit('LOGOUT');
        },
    }
})

export default function ({ store, $axios, redirect, app, $storage, error }) {
    let trycount = 0

    $axios.onRequest((config) => {
        const token = store.state.auth.accessToken
        if (token) {
            config.headers.common.Authorization = `Bearer ${token}`
        }
    });

    $axios.onError(async (error) => {
        const refreshToken = app.$storage.getUniversal('_refresh_token.local')
        let response = null

        let refresh = async () => {
            if (refreshToken) {
                if (trycount > 3) {
                    trycount = 0
                    return Promise.resolve(response)
                }
                trycount++
                let isRefresh = false
                await $axios.post('/auth/refresh', {
                    refreshToken: refreshToken
                })
                    .then(res => {
                        if (res.data) {
                            app.$auth.$storage.setUniversal('_token.local', 'Bearer ' + res.data.token)
                            $axios.setToken(res.data.token, 'Bearer')
                            error.config.headers['Authorization'] = 'Bearer ' + res.data.token
                            isRefresh = true
                        }
                        //redirect(location.href)
                    }).catch(err => {
                        store.commit('logout')
                        app.$auth.logout();
                        redirect('/auth/login')
                        console.log(err)
                    })

                if (isRefresh) {
                    await $axios.request(error.config)
                        .then(res => {
                            trycount = 0
                            response = res
                        })
                }
            } else {
                store.commit('logout')
                app.$auth.logout();
                // redirect('/auth/login')
            }
        }

        const code = parseInt(error.response && error.response.status);
        if (code === 401) {
            await refresh()
        } else {
            //TODO 왜 에러코드를 확인할 수 없는지 확인 해야함
            if (error.code === 'ECONNABORTED') {
                console.error('요청 타임 아웃', error.message)
                return Promise.reject(error)
            }
            let networkError = error.toString().indexOf('Network Error') !== -1
            if (networkError) {
                await refresh()
            }
        }
        if (response) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(error);
        }
    });
}

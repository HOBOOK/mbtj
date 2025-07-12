

class AuthManager {
    constructor(axios, store) {
        this.axios = axios
        this.store = store
    }

    check(role, requireLevel) {

    }

}

export default ({ $axios, store }, inject) => {
    const authManager = new AuthManager($axios, store)
    inject('authManager', authManager)
}
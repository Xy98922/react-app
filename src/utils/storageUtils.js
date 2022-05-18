const USER_KEY='user_key';
export default {
    saveuser(user){
        localStorage.setItem(USER_KEY,JSON.stringify(user));
    },
    getuser(){
        return JSON.parse(localStorage.getItem(USER_KEY)||'{}');
    },
    removeuser(){
        localStorage.removeItem(USER_KEY);
    },
}
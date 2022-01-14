export default class global{
    constructor(){

    }

    private static _userInfor:any={};

    public static get userInfor():any{
        return this._userInfor;
    }

    public static set userInfor(data:any) {
        this._userInfor=data;
    }
}

import global from 'GGGLOBAL';
export default function (initialState:any) {
    // const { userId,userPwd, role } = initialState;

    console.log(`##initialState##`);
    return {
        canReadFoo: true,
        // canUpdateFoo: role === 'admin',
        // canDeleteFoo: (foo:any) => {
        //     // console.log(foo);
        //     return foo.ownerId === userId;
        //     // return foo.ownerId="123";
        // },
        // canReadPageA: (foo: any) => {
        //     console.log(foo);
        //     console.log(`foo.ownerId=${foo.ownerId}`);
        //     console.log(`userId=${userId}`);
        //     if (foo.ownerId === userId) return true;
        //     return false;
        // },
        canLogin: (route: any) => {
            console.error('##canLogin##');
            if (!global || !global.userInfor || !global.userInfor.userRole) return false;
            if (global.userInfor.userRole === 'R' || global.userInfor.userRole === 'P') return true;
            return false;

            // if (!userInfor) return false;
            // if (userInfor.userRole === 'R' || userInfor.userRole === 'P') return true;
            // return false;
        },
        justAdmin: (route: any)=>{
            console.error('##justAdmin##'); 
            // console.log(global.userInfor);
            // return true;
            if (!global || !global.userInfor || !global.userInfor.userRole) return false;
            if (global.userInfor.userRole === 'R') return true;
            return false;

            // if (!userInfor) return false;
            // if (userInfor.userRole === 'R') return true;
            return false;
        }
    };
}
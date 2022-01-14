import axios from 'axios';

const Request = async (
    tradeCode:string, 
    params:any,
    scallback: Function, 
    fcallback: Function)=> {
    let ret = { data: {}, error: null };
    
    await axios.post(tradeCode, params, {
        // headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).then((res: any) => {
        scallback(res.data);
    }).catch((error: any) => {
        fcallback(error);
        console.error('[Trade Error]');
        console.log(error);
    });


    // await axios({
    //     url: tradeCode,
    //     method: 'post',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     data: params
    // }).then((res: any) => {
    //     scallback(res.data);
    // }).catch((error: any) => {
    //     fcallback(error);
    //     console.log(error);
    // });
}

export { Request }
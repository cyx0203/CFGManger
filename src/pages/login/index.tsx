import React, { useEffect, useState } from 'react';
import { useAccess, useRequest, history, useModel } from 'umi';
import { Form, Input, Button, message } from 'antd';
import css from './index.less';
import { Md5 } from 'ts-md5/dist/md5';
import axios from 'axios';
import global from 'GGGLOBAL';

const Login = (props: any) => {
  const [form] = Form.useForm();
  const { initialState, loading, error, refresh, setInitialState } =
    useModel('@@initialState');
  const access = useAccess(); // access 的成员: canReadFoo, canUpdateFoo, canDeleteFoo
  const [state, setState] = useState({
    loginBtnLoad: false,
  });

  useEffect(() => {
    global.userInfor = {};
    return () => {};
  }, []);

  const userLogin = (data: any, sCallBack: Function) => {
    const pwd = Md5.hashStr(`${data.userPwd}`);
    //用户登录
    axios
      .post('/Sys/userLogin', {
        userId: data.userId,
        password: pwd,
      })
      .then((res: any) => {
        const resCode = res.data.code;
        const resMsg = res.data.msg;
        const resRole = res.data.roleId;
        form.resetFields();

        if (resCode === '00') {
          message.success(`${resMsg}`);
          global.userInfor = {
            userId: data.userId,
            userPwd: data.userPwd,
            userRole: resRole,
            userName: '',
          };
          if (sCallBack) sCallBack(data);
        } else {
          message.error(`${resMsg}`);
        }

        setState({
          loginBtnLoad: false,
        });
      })
      .catch((error) => {
        form.resetFields();
        message.error(`${error}`);
        setState({
          loginBtnLoad: false,
        });
      });
  };

  const userQuery = (data: any) => {
    axios
      .post('/Sys/selectUsers', {
        userId: data.userId,
      })
      .then((res: any) => {
        const resCode = res.data.code;
        const resMsg = res.data.msg;
        const resUserName = res.data.listInfo[0].userName;
        console.log('!!!!');
        console.log(res.data);
        if (resCode === '00') {
          // message.success(`${resMsg}`);
          global.userInfor.userName = resUserName;
          // console.log(global.userInfor);
          setState({
            loginBtnLoad: false,
          });
          //刷新菜单、权限配置等内容
          refresh();
          history.push({
            pathname: '/welcome',
            query: {
              // userId: data.userId,
              // userPwd: data.userPwd,
              // userRole: resRole
            },
          });
        } else {
          message.error(`${resMsg}`);
          setState({
            loginBtnLoad: false,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        message.error(`${error}`);
        setState({
          loginBtnLoad: false,
        });
      });
  };

  //登录操作
  const onFinish = (data: any) => {
    setState({
      loginBtnLoad: true,
    });
    message.destroy();
    userLogin(data, userQuery);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={css.main}>
      {/* @ts-ignore */}
      <div className={css.title}>
        {MAIN_TITLE}
        <span className={css.version}>{VERSION}</span>
      </div>
      <div className={css.loginBlock}>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="用户名"
            name="userId"
            style={{ width: 282 }}
            rules={[{ required: true, message: '请输入您的用户名!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="userPwd"
            rules={[{ required: true, message: '请输入您的登录密码!' }]}
          >
            <Input.Password />
          </Form.Item>

          {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              loading={state.loginBtnLoad}
              type="primary"
              htmlType="submit"
              style={{ width: 188 }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;

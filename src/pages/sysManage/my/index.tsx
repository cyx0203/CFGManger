import React, { useEffect } from 'react';
import { useAccess, Access, history, useParams, useModel } from 'umi';
import {
  Tabs,
  Form,
  Input,
  Button,
  Select,
  message,
  Table,
  Tag,
  Space,
} from 'antd';
import { Md5 } from 'ts-md5/dist/md5';
import axios from 'axios';
import global from 'GGGLOBAL';

const My = (props: any) => {
  const { refresh } = useModel('@@initialState');
  const { TabPane } = Tabs;
  const { Option } = Select;
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onFinish = (data: any) => {
    const password = Md5.hashStr(`${data.password}`);
    axios
      .post('/Sys/resetPassword', {
        userId: data.userId,
        userName: data.userName,
        password: password,
      })
      .then((res: any) => {
        const resCode = res.data.code;
        const resMsg = res.data.msg;

        if (resCode === '00') {
          message.success(`${resMsg}`);
          global.userInfor.userName = data.userName;
          refresh();
        } else {
          message.error(`${resMsg}`);
        }
        onReset();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onFinishFailed = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    return () => {};
  });

  const callback = (data: any) => {
    console.log(data);
    onReset();
  };

  return (
    <div style={{ backgroundColor: '#fff' }}>
      <Tabs onChange={callback} type="card">
        <TabPane tab="修改密码" key="1">
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
              label="登录账号"
              name="userId"
              initialValue={global.userInfor.userId}
              style={{ width: 282 }}

              // rules={[{ required: true, message: '请输入您的登录账号!' }]}
            >
              <Input disabled={true} />
            </Form.Item>

            <Form.Item
              label="用户名"
              name="userName"
              style={{ width: 282 }}
              initialValue={global.userInfor.userName}
              rules={[{ required: true, message: '请输入您的用户名!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              style={{ width: 282 }}
              rules={[{ required: true, message: '请输入您的登录密码!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="重复密码"
              name="password2"
              dependencies={['userPwd']}
              style={{ width: 282 }}
              rules={[
                { required: true, message: '请再次输入您的登录密码!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次密码不一致!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 2, span: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: 188, marginLeft: 10 }}
              >
                修改信息
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default My;

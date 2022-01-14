import React, { useEffect, useRef, useState } from 'react';
import { useAccess, Access, history, useParams } from 'umi';
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
  Switch,
} from 'antd';
import { Md5 } from 'ts-md5/dist/md5';
import axios from 'axios';

const User = (props: any) => {
  const [state, setState] = useState({
    userListInfor: [],
  });
  const { TabPane } = Tabs;
  const { Option } = Select;
  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const userListCol = [
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      render: (text: string) => (
        <div style={{ fontWeight: 'bold' }}>{text}</div>
      ),
    },
    {
      title: '登录账号',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '角色',
      key: 'roleId',
      dataIndex: 'roleId',
      render: (data: string) => (
        <div>
          {data === 'P' ? (
            <Tag color={'green'}>普通用户</Tag>
          ) : (
            <Tag color={'magenta'}>管理员</Tag>
          )}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'status',
      dataIndex: 'status',
      render: (data: string, item: any) => (
        <Space size="middle">
          <Switch
            disabled={item.userId === 'root' ? true : false}
            checkedChildren="启用"
            unCheckedChildren="禁用"
            defaultChecked={data === '1' ? true : false}
            size="default"
            onChange={(date: any) => {
              console.log(item);
              let current_status = item.status;
              if (current_status === '1') current_status = '0';
              else current_status = '1';
              axios
                .post('/Sys/stopSysUser', {
                  userId: item.userId,
                  status: current_status,
                })
                .then((res: any) => {
                  const resCode = res.data.code;
                  const resMsg = res.data.msg;

                  if (resCode === '00') {
                    message.success(`${resMsg}`);
                    queryUserList();
                  } else {
                    message.error(`${resMsg}`);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
          />
        </Space>
      ),
    },
  ];

  const queryUserList = () => {
    axios
      .post('/Sys/selectUsers', {})
      .then((res: any) => {
        const resCode = res.data.code;
        const resMsg = res.data.msg;

        if (resCode === '00') {
          const resListInfo = res.data.listInfo;
          setState({
            userListInfor: resListInfo,
          });
          console.log(resListInfo);
          message.success(`${resMsg}`);
        } else {
          message.error(`${resMsg}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onGenderChange = (value: string) => {
    switch (value) {
      case 'P':
        form.setFieldsValue({ role: 'P' });
        return;
      case 'R':
        form.setFieldsValue({ role: 'R' });
        return;
      case 'other':
        form.setFieldsValue({ role: '' });
    }
  };

  const onFinish = (data: any) => {
    const password = Md5.hashStr(`${data.password}`);
    axios
      .post('/Sys/insertSysUser', {
        userId: data.userId,
        userName: data.userName,
        password: password,
        roleId: data.roleId,
      })
      .then((res: any) => {
        const resCode = res.data.code;
        const resMsg = res.data.msg;

        if (resCode === '00') {
          message.success(`${resMsg}`);
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

  const onFill = () => {
    form.setFieldsValue({
      note: 'Hello world!',
      gender: 'male',
    });
  };
  useEffect(() => {
    return () => {};
  });

  const tabChange = (data: any) => {
    const funcType = data;
    if (funcType === 'userList') {
      onReset();
      queryUserList();
    }
  };

  return (
    <div style={{ backgroundColor: '#fff' }}>
      <Tabs onChange={tabChange} type="card">
        <TabPane tab="新增用户" key="addUser" disabled={false}>
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
              style={{ width: 282 }}
              rules={[{ required: true, message: '请输入您的登录账号!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="用户名"
              name="userName"
              style={{ width: 282 }}
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

            <Form.Item
              name="roleId"
              label="角色"
              style={{ width: 282 }}
              rules={[{ required: true, message: '请选择用户角色!' }]}
            >
              <Select
                placeholder="请选择用户角色"
                // defaultValue='普通用户'
                onChange={onGenderChange}
                allowClear={false}
              >
                <Option value="P">普通用户</Option>
                <Option value="R">管理员</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginLeft: '95px', width: '188px' }}
              >
                注册
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="用户列表" key="userList">
          <Table
            size="small"
            columns={userListCol}
            dataSource={state.userListInfor}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default User;

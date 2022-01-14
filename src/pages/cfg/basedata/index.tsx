import React, { useEffect, useState } from 'react';
import { useAccess, useRequest, history, useModel } from 'umi';
import {
  Form,
  Input,
  Button,
  message,
  Tabs,
  Modal,
  Table,
  Popconfirm,
} from 'antd';
import css from './index.less';
import { Md5 } from 'ts-md5/dist/md5';
import axios from 'axios';
import global from 'GGGLOBAL';
import { Request } from 'GGService';

const BaseData = (props: any) => {
  const [formType_FORM] = Form.useForm();
  const [formTypeEdit_FORM] = Form.useForm();
  const { TabPane } = Tabs;
  const { confirm } = Modal;
  const { initialState, loading, error, refresh, setInitialState } =
    useModel('@@initialState');

  const form_type_menu: any = [
    {
      title: '设备型号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: any) => (
        <div>
          <a
            style={{ marginRight: 10 }}
            onClick={() => {
              let newName = '';
              formTypeEdit_FORM.setFieldsValue({
                id: record.id,
                name: record.name,
              });
              confirm({
                title: '请修改设备信息',
                // icon: <ExclamationCircleOutlined />,
                content: (
                  <div>
                    <Form
                      name="basic"
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 24 }}
                      // initialValues={{ remember: false }}
                      onFinish={onFinish_formTypeEdit}
                      autoComplete="off"
                      // layout='inline'
                      form={formTypeEdit_FORM}
                      initialValues={{}}
                    >
                      <Form.Item
                        label="设备型号"
                        name="id"
                        rules={[
                          { required: false, message: '请输入设备型号!' },
                        ]}
                      >
                        {/* <Input placeholder='' disabled={true} /> */}
                        <Input placeholder="" />
                      </Form.Item>
                      <Form.Item
                        label="设备名称"
                        name="name"
                        rules={[{ required: true, message: '请输入设备名称!' }]}
                      >
                        <Input placeholder="" />
                      </Form.Item>
                      <Form.Item wrapperCol={{ offset: 15, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                          修改
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                ),
                okText: '修改',
                cancelText: '取消',
                closable: true,
                maskClosable: true,
                onOk() {},
                onCancel() {},
              });
            }}
          >
            修改
          </a>
          <Popconfirm
            title="是否要删除?"
            onConfirm={() => {
              const delId: string = record.id;
              req_del_form_type(delId);
            }}
          >
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const [state, setState] = useState({
    form_type_data: [],
  });

  useEffect(() => {
    req_query_form_type();
    return () => {};
  }, []);

  const onFinish_formTypeEdit = (values: any) => {
    // let subId = formTypeEdit_FORM.getFieldValue('select_assembly_sub');
    // console.log(values, subId);
    req_edit_form_type(values);
    Modal.destroyAll();
  };

  const req_query_form_type = () => {
    Request(
      'Common/selectBaseDevice',
      {},
      (data: any) => {
        setState({
          ...state,
          form_type_data: data.listInfo,
        });
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const req_edit_form_type = (value: any) => {
    Request(
      'Common/updateBaseDevice',
      {
        id: value.id,
        name: value.name,
      },
      (data: any) => {
        req_query_form_type();
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const req_add_form_type = (value: any) => {
    Request(
      'Common/insertBaseDevice',
      {
        id: value.id,
        name: value.name,
      },
      (data: any) => {
        message.success('新增成功!');
        formType_FORM.resetFields();
        req_query_form_type();
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const req_del_form_type = (delId: string) => {
    Request(
      'Common/deleteBaseDevice',
      {
        id: delId,
      },
      (data: any) => {
        message.success('删除成功!');
        req_query_form_type();
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const tabChange = (key: any) => {
    console.log(`tabChange:${key}`);
  };

  const onFinish_addFormType = (values: any) => {
    req_add_form_type(values);
  };

  return (
    <div className={css.main}>
      <Tabs onChange={tabChange} type="card">
        <TabPane tab="设备型号" key="allview">
          <Form
            style={{ height: '55px' }}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: false }}
            onFinish={onFinish_addFormType}
            // onFinishFailed={onFinishFailed_main}
            autoComplete="off"
            layout="inline"
            form={formType_FORM}
          >
            <Form.Item
              label="设备型号"
              name="id"
              rules={[{ required: true, message: '请输入设备型号!' }]}
            >
              <Input placeholder="请输入设备型号!" allowClear />
            </Form.Item>
            <Form.Item
              label="设备名称"
              name="name"
              rules={[{ required: true, message: '请输入设备名称!' }]}
            >
              <Input placeholder="请输入设备名称!" allowClear />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                新增
              </Button>
            </Form.Item>
          </Form>
          <Table
            size="small"
            pagination={{
              pageSize: 10,
            }}
            columns={form_type_menu}
            dataSource={state.form_type_data}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BaseData;

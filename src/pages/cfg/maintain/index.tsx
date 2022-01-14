import React, { useEffect, useState } from 'react';
import { useAccess, Access, history, useParams } from 'umi';
import {
  Avatar,
  Table,
  Select,
  Tag,
  Tabs,
  message,
  Form,
  Input,
  Button,
  Popconfirm,
  Modal,
  Switch,
  Spin,
} from 'antd';
import { Request } from 'GGService';
import { random } from 'lodash';
import styles from './index.less';
import {
  UsbOutlined,
  NodeExpandOutlined,
  UpCircleFilled,
  DownCircleFilled,
  CheckOutlined,
} from '@ant-design/icons';
import { attachTypeApi } from 'antd/lib/message';

const Maintain = (props: any) => {
  const { TabPane } = Tabs;
  const { Option } = Select;
  const { confirm } = Modal;
  const [state, setState] = useState({
    assembly_main: [],
    assembly_sub: [],
    assembly_model: [],
    assembly_main_dropdown: [],
    assembly_sub_dropdown: [],
    assembly_model_ports_dropdown: [
      { key: '0', value: '0', name: '无' },
      { key: '1', value: '1', name: '串口' },
      { key: '2', value: '2', name: 'USB' },
    ],
  });
  const [orderOptSpin, setOrderOptSpin] = useState(false);

  const [main_form] = Form.useForm();
  const [sub_form] = Form.useForm();
  const [model_form] = Form.useForm();
  const [model_add_form] = Form.useForm();
  const [model_edit_form] = Form.useForm();

  const menu_col_main: any = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id'
    // },
    {
      title: '类别',
      dataIndex: 'partType',
      key: 'partidType',
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
              confirm({
                title: '请修改模块大类名称',
                // icon: <ExclamationCircleOutlined />,
                content: (
                  <div>
                    <Input.Search
                      defaultValue={record.partType}
                      onChange={(e) => {
                        newName = e.target.value;
                      }}
                      enterButton="修改"
                      onSearch={() => {
                        req_edit_main(record.id, newName);
                        Modal.destroyAll();
                      }}
                    />
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
              console.log(_);
              console.log(record);
              const delId: string = record.id;
              Request(
                'Common/deletePartType',
                {
                  id: delId,
                },
                (data: any) => {
                  message.success('删除成功!');
                  main_form.resetFields();
                  req_query_main();
                },
                (error: any) => {
                  message.error(error.toString());
                },
              );
            }}
          >
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const menu_col_sub: any = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   // sortDirections: ['descend', 'ascend'],
    // },
    {
      title: '顺序',
      dataIndex: 'sort',
      key: 'sort',
      defaultSortOrder: 'descend',
      align: 'center',
      // sorter: (a: any, b: any) => {parseInt(a.sort) - parseInt(b.sort)},
      sorter: (a: any, b: any) => {
        a.sort - b.sort;
      },
      render: (text: any, record: any) => (
        <div>
          {
            <Avatar
              style={{ backgroundColor: '#8308f3', verticalAlign: 'middle' }}
              size="small"
            >
              {text}
            </Avatar>
          }
        </div>
      ),
    },
    {
      title: '部件名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '是否打印',
      dataIndex: 'tip',
      key: 'tip',
      render: (text: any, record: any) => (
        <div>
          {text === '1' ? <CheckOutlined style={{ color: 'blue' }} /> : ''}
        </div>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: any) => (
        <div>
          <a
            style={{ marginRight: 10 }}
            onClick={() => {
              let newName = record.name;
              let tip = record.tip;
              // console.log(record);
              confirm({
                title: '请修改部件名称',
                // icon: <ExclamationCircleOutlined />,
                content: (
                  <div>
                    <Input.Search
                      defaultValue={record.name}
                      onChange={(e) => {
                        newName = e.target.value;
                      }}
                      enterButton="修改"
                      onSearch={() => {
                        req_edit_sub(record.id, newName, record.partType, tip);
                        Modal.destroyAll();
                      }}
                    />
                    <div
                      style={{
                        marginTop: 5,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <label>是否要打印:</label>
                      <Switch
                        checkedChildren="是"
                        unCheckedChildren="否"
                        defaultChecked={record.tip === '1' ? true : false}
                        onChange={(checked) => {
                          if (checked) tip = '1';
                          else tip = '0';
                        }}
                      />
                    </div>
                  </div>
                ),

                closable: true,
                maskClosable: true,

                // <Input defaultValue={record.name} onChange={(e) => {
                //   newName = e.target.value;
                // }} />,
                okText: '修改',
                cancelText: '取消',
                onOk() {
                  // req_edit_sub(record.id, newName, record.partType);
                },
                onCancel() {},
              });
            }}
          >
            修改
          </a>
          <Popconfirm
            title="是否要删除?"
            onConfirm={() => {
              console.log(record);
              const select_assembly_main_id = sub_form.getFieldValue(
                'select_assembly_main',
              );
              console.log(`select_assembly_main_id:${select_assembly_main_id}`);

              const delId: string = record.id;
              Request(
                'Common/deletePartList',
                {
                  id: delId,
                },
                (data: any) => {
                  message.success('删除成功!');
                  req_query_sub(select_assembly_main_id, () => {});
                },
                (error: any) => {
                  message.error(error.toString());
                },
              );
            }}
          >
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    },
    {
      title: '顺序调整',
      dataIndex: 'operation2',
      align: 'center',
      render: (text: any, record: any) => (
        <Spin spinning={orderOptSpin}>
          <UpCircleFilled
            onClick={() => {
              orderUp(record);
            }}
          />
          &nbsp;&nbsp;
          <DownCircleFilled
            onClick={() => {
              orderDown(record);
            }}
          />
        </Spin>
      ),
    },
  ];

  const orderUp = (record: any) => {
    console.log(':: orderUp ::');
    console.log(record);
    req_edit_sort(record.id, record.partType, record.sort, '1');
  };

  const orderDown = (record: any) => {
    console.log(':: orderDown ::');
    console.log(record);
    req_edit_sort(record.id, record.partType, record.sort, '2');
  };

  // const portCN = (value: string) => {
  //   if (value === '0') return <Tag color="default">无</Tag>;
  //   if (value === '1') return <Tag icon={<NodeExpandOutlined />} color="magenta">
  //     串口
  //   </Tag>;
  //   if (value === '2') return <Tag icon={<UsbOutlined />} color="geekblue">
  //     USB
  //   </Tag>;
  //   return '';
  // }

  // const portICON = (value: string) => {
  //   if (value === '0') return '';
  //   if (value === '1') return <NodeExpandOutlined style={{ color:'	#4B0082',marginLeft:5}}/>;
  //   if (value === '2') return <UsbOutlined style={{ color: '	#4B0082', marginLeft: 5 }}/>;
  //   return '';
  // }

  const menu_col_model: any = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id'
    // },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '厂商',
      dataIndex: 'factory',
      key: 'factory',
    },
    // {
    //   title: '接口',
    //   dataIndex: 'ports',
    //   key: 'ports',
    //   render: (text: string) => <div>
    //     {portCN(text)}
    //     {/* {portICON(text)} */}
    //   </div>,
    // },
    {
      title: '备注',
      dataIndex: 'pad',
      key: 'pad',
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
              // confirm({
              //   title: '请修改部件名称',
              //   // icon: <ExclamationCircleOutlined />,
              //   content: <Input defaultValue={record.name} onChange={(e) => {
              //     newName = e.target.value;
              //   }} />,
              //   okText: '修改',
              //   cancelText: '取消',
              //   onOk() {
              //     req_edit_sub(record.id, newName, record.partType);
              //   },
              //   onCancel() {
              //   },
              // });
              // console.log(record.ports);
              // console.log(record.ports.toString());
              model_edit_form.setFieldsValue({
                new_assembly_model: record.model,
                new_assembly_factory: record.factory,
                // new_assembly_port: parseInt(record.ports),
                // new_assembly_port: record.ports.toString(),
                new_assembly_pad: record.pad,
                new_assembly_id: record.id,
              });
              confirm({
                title: '请修改部件型号信息',
                width: 600,
                closable: true,
                keyboard: true,
                maskClosable: true,
                bodyStyle: styles.model_aad_body,
                // icon: <ExclamationCircleOutlined />,
                // content: <Input defaultValue={record.partType} onChange={(e) => {
                //   newName = e.target.value;
                // }} />,
                content: (
                  <div>
                    <Form
                      name="basic"
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 12 }}
                      // initialValues={{ remember: false }}
                      onFinish={(value) =>
                        onFinish_model_edit(value, record.id)
                      }
                      onFinishFailed={onFinishFailed_model_edit}
                      autoComplete="off"
                      // layout='inline'
                      form={model_edit_form}
                      initialValues={{
                        new_assembly_model: record.model,
                        new_assembly_factory: record.factory,
                        // new_assembly_port: parseInt(record.ports),
                        // new_assembly_port: record.ports.toString(),
                        new_assembly_pad: record.pad,
                        // new_assembly_id: record.id,
                      }}
                    >
                      {/* <Form.Item
                        label="部件ID"
                        name="new_assembly_id"
                        rules={[{ required: false, message: '' }]}
                      >
                        <Input placeholder="" disabled={true} />
                      </Form.Item> */}
                      <Form.Item
                        label="部件型号"
                        name="new_assembly_model"
                        rules={[{ required: true, message: '请输入部件型号!' }]}
                      >
                        <Input placeholder="" />
                      </Form.Item>
                      <Form.Item
                        label="厂商"
                        name="new_assembly_factory"
                        rules={[{ required: true, message: '请输入厂商!' }]}
                      >
                        <Input placeholder="" />
                      </Form.Item>
                      {/* <Form.Item
                      label="接口"
                      name="new_assembly_port"
                      rules={[{ required: true, message: '请选择部件型号接口!' }]}
                    >
                      <Select
                        placeholder="请选择部件型号接口"
                        onChange={model_port_dropdown_change}
                        allowClear={false}
                        style={{ width: 250 }}
                      // defaultValue={}
                      >
                        <Option value={`0`}>{'无'}</Option>
                        <Option value={`1`}>{'串口'}</Option>
                        <Option value={`2`}>{'USB'}</Option>
                      </Select>
                    </Form.Item> */}
                      <Form.Item
                        label="备注"
                        name="new_assembly_pad"
                        rules={[{ required: false, message: '请输入厂商!' }]}
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
                okText: '新增',
                cancelText: '取消',
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
              console.log(record);
              // const select_assembly_main_id = sub_form.getFieldValue('select_assembly_main');
              let subId = model_form.getFieldValue('select_assembly_sub');
              console.log(`select_assembly_main_id:${subId}`);

              const delId: string = record.id;
              console.log('删除的delId:' + delId);
              Request(
                'Common/deletePartModel',
                {
                  id: delId,
                },
                (data: any) => {
                  message.success('删除成功!');
                  // req_query_sub(select_assembly_main_id, () => { });
                  req_query_model(subId);
                },
                (error: any) => {
                  message.error(error.toString());
                },
              );
            }}
          >
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
    },
  ];

  //标签切换事件
  const tabChange = (key: any) => {
    console.log(`tabChange:${key}`);

    //清空所有表单数据
    main_form.resetFields();
    sub_form.resetFields();
    model_form.resetFields();

    //清空表格数据
    setState({
      ...state,
      assembly_sub: [],
      assembly_model: [],
    });

    //重查模块大类数据
    if (key === 'sub' || key === 'model') {
      Request(
        'Common/selectPartType',
        {},
        (data: any) => {
          const listInfo = data.listInfo;
          let optList: any = [];
          for (let i = 0; i < listInfo.length; i++) {
            const item: any = listInfo[i];
            let optDom = <Option value={`${item.id}`}>{item.partType}</Option>;
            optList.push(optDom);
          }
          setState({
            ...state,
            // assembly_model: [],
            assembly_sub: [],
            assembly_model: [],
            assembly_main_dropdown: optList,
          });
        },
        (error: any) => {
          message.error(error.toString());
        },
      );
    }
    // if (key === 'model') {
    //   Request('Common/selectPartType', {},
    //     (data: any) => {
    //       const listInfo = data.listInfo;
    //       let optList: any = [];
    //       for (let i = 0; i < listInfo.length; i++) {
    //         const item = listInfo[i];
    //         let optDom = <Option value={`${item.id}`}>{item.partType}</Option>;
    //         optList.push(optDom);
    //       }
    //       setState({
    //         ...state,
    //         assembly_main_dropdown: optList
    //       });
    //     }, (error: any) => {
    //       message.error(error.toString());
    //     });
    // }
  };

  const onFinish_main = (values: any) => {
    console.log('Success:', values);
    Request(
      'Common/insertPartType',
      {
        partType: values.new_assembly_main,
      },
      (data: any) => {
        message.success('新增成功!');
        main_form.resetFields();
        req_query_main();
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const onFinishFailed_main = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish_model_add = (values: any) => {
    let subId = model_form.getFieldValue('select_assembly_sub');
    console.log(values, subId);
    req_add_model(values, subId);
  };
  const onFinishFailed_model_add = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish_model_edit = (values: any, id: any) => {
    let subId = model_form.getFieldValue('select_assembly_sub');
    console.log(values, subId, id);
    req_edit_model(values, subId, id);
  };
  const onFinishFailed_model_edit = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish_model = (values: any) => {
    model_add_form.resetFields();
    console.log('Success:', values.new_assembly_sub);
    // req_query_sub(values.select_assembly_main);
    // req_add_model(values.new_assembly_sub, values.select_assembly_main);
    let model = '';
    let factory = '';
    let ports = '';
    let pad = '';

    confirm({
      title: '请输入新增部件型号信息',
      width: 600,
      closable: true,
      keyboard: true,
      maskClosable: true,
      bodyStyle: styles.model_aad_body,
      // icon: <ExclamationCircleOutlined />,
      // content: <Input defaultValue={record.partType} onChange={(e) => {
      //   newName = e.target.value;
      // }} />,
      content: (
        <div>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            initialValues={{ remember: false }}
            onFinish={onFinish_model_add}
            onFinishFailed={onFinishFailed_model_add}
            autoComplete="off"
            // layout='inline'
            form={model_add_form}
          >
            <Form.Item
              label="新增部件型号"
              name="new_assembly_model"
              rules={[{ required: true, message: '请输入新的部件型号!' }]}
            >
              <Input placeholder="" />
            </Form.Item>
            <Form.Item
              label="厂商"
              name="new_assembly_factory"
              rules={[{ required: true, message: '请输入厂商!' }]}
            >
              <Input placeholder="" />
            </Form.Item>
            {/* <Form.Item
            label="接口"
            name="new_assembly_port"
            rules={[{ required: true, message: '请选择部件型号接口!' }]}
          >
            <Select
              placeholder="请选择部件型号接口"
              onChange={model_port_dropdown_change}
              allowClear={false}
              style={{ width: 250 }}
            >
              <Option value={`0`}>{'无'}</Option>
              <Option value={`1`}>{'串口'}</Option>
              <Option value={`2`}>{'USB'}</Option>
            </Select>
          </Form.Item> */}
            <Form.Item
              label="备注"
              name="new_assembly_pad"
              rules={[{ required: false, message: '请输入厂商!' }]}
            >
              <Input placeholder="" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 15, span: 16 }}>
              <Button type="primary" htmlType="submit">
                新增
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
      okText: '新增',
      cancelText: '取消',
      onOk() {},
      onCancel() {},
    });
  };
  const onFinishFailed_model = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish_sub = (values: any) => {
    console.log('Success:', values.new_assembly_sub);
    console.log(values);
    sub_form.setFieldsValue({
      new_assembly_sub: '',
    });
    // return;
    // req_query_sub(values.select_assembly_main);
    req_add_sub(
      values.new_assembly_sub,
      values.select_assembly_main,
      values.new_assembly_sub_tip,
    );
  };
  const onFinishFailed_sub = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const main_dropdown_change = (value: string) => {
    console.log(value);
    // model_form.setFields()
    model_form.setFieldsValue({
      select_assembly_sub: '',
    });
    req_query_sub(value, (assembly_sub: any) => {
      const listInfo = assembly_sub;
      console.error(listInfo);
      let optList: any = [];
      for (let i = 0; i < listInfo.length; i++) {
        const item: any = listInfo[i];
        let optDom = <Option value={`${item.id}`}>{item.name}</Option>;
        optList.push(optDom);
      }
      setState({
        ...state,
        assembly_model: [],
        assembly_sub_dropdown: optList,
      });
    });
  };

  const model_port_dropdown_change = (value: string) => {};

  const sub_dropdown_change = (value: string) => {
    console.log(value);
    req_query_sub(value, () => {});
  };

  const model_dropdown_change = (value: string) => {
    let mainId = model_form.getFieldValue('select_assembly_main');
    let subId = model_form.getFieldValue('select_assembly_sub');
    req_query_model(subId);
  };

  const req_query_main = () => {
    Request(
      'Common/selectPartType',
      {},
      (data: any) => {
        setState({
          ...state,
          assembly_main: data.listInfo,
        });
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const req_edit_main = (orgId: string, newName: string) => {
    Request(
      'Common/updatePartType',
      {
        id: orgId,
        partType: newName,
      },
      (data: any) => {
        req_query_main();
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const req_query_sub = (partType: string, callBack: Function) => {
    Request(
      'Common/selectPartList',
      {
        partType: partType,
      },
      (data: any) => {
        let temp = data.listInfo;
        for (let i = 0; i < temp.length; i++) temp[i].sort++;
        setState({
          ...state,
          assembly_sub: temp,
        });
        if (callBack) {
          callBack(data.listInfo);
        }
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const req_edit_sub = (
    orgId: string,
    newName: string,
    orgPartType: string,
    tip: string,
  ) => {
    Request(
      'Common/updatePartList',
      {
        id: orgId,
        name: newName,
        tip: tip,
      },
      (data: any) => {
        req_query_sub(orgPartType, () => {});
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const req_add_sub = (addName: string, orgPartType: string, tip: boolean) => {
    const _tip: string = tip === true ? '1' : '0';
    Request(
      'Common/insertPartList',
      {
        name: addName,
        partType: orgPartType,
        tip: _tip,
      },
      (data: any) => {
        req_query_sub(orgPartType, () => {});
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const req_add_model = (values: any, subId: string) => {
    Request(
      'Common/insertPartModel',
      {
        model: values.new_assembly_model,
        listId: subId,
        factory: values.new_assembly_factory,
        pad: values.new_assembly_pad,
        // "ports": values.new_assembly_port
      },
      (data: any) => {
        req_query_model(subId);
        Modal.destroyAll();
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const req_query_model = (subId: string) => {
    Request(
      'Common/selectPartModel',
      {
        listId: subId,
      },
      (data: any) => {
        setState({
          ...state,
          assembly_model: data.listInfo,
        });
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const req_edit_model = (values: any, subId: string, id: any) => {
    Request(
      'Common/updatePartModel',
      {
        model: values.new_assembly_model,
        listId: subId,
        factory: values.new_assembly_factory,
        pad: values.new_assembly_pad,
        // "ports": values.new_assembly_port,
        // id: values.new_assembly_id,
        id: id,
      },
      (data: any) => {
        console.log(data);
        req_query_model(subId);
        Modal.destroyAll();
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const req_edit_sort = (
    id: string,
    partType: string,
    orgSort: string,
    move: string,
  ) => {
    setOrderOptSpin(true);
    const subId = partType;
    Request(
      'Common/updateSort',
      {
        id: id,
        partType: partType,
        sort: orgSort,
        move: move,
      },
      (data: any) => {
        console.log(data);
        req_query_sub(subId, () => {});
        setOrderOptSpin(false);
        Modal.destroyAll();
      },
      (error: any) => {
        message.error(error.toString());
        setOrderOptSpin(false);
      },
    );
  };

  //##useEffect##
  useEffect(() => {
    console.error('::useEffect::');
    req_query_main();

    return () => {};
  }, []);

  return (
    <div>
      <Tabs onChange={tabChange} type="card">
        {/* 部件大类 */}
        <TabPane tab="模块大类" key="main">
          <Form
            style={{ height: '35px' }}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: false }}
            onFinish={onFinish_main}
            onFinishFailed={onFinishFailed_main}
            autoComplete="off"
            layout="inline"
            form={main_form}
          >
            <Form.Item
              label="模块大类"
              name="new_assembly_main"
              rules={[{ required: true, message: '请输入新的模块大类!' }]}
            >
              <Input placeholder="请输入模块大类!" allowClear />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                新增
              </Button>
            </Form.Item>
          </Form>
          <br />
          <Table
            size="small"
            rowKey={random(0, 999999)}
            columns={menu_col_main}
            dataSource={state.assembly_main}
          />
        </TabPane>
        {/* 部件 */}
        <TabPane tab="部件" key="sub">
          <Form
            style={{ height: '35px' }}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ new_assembly_sub_tip: true }}
            onFinish={onFinish_sub}
            onFinishFailed={onFinishFailed_sub}
            autoComplete="off"
            layout="inline"
            form={sub_form}
          >
            <Form.Item
              label="模块大类"
              name="select_assembly_main"
              rules={[{ required: true, message: '请选择查询的模块大类!' }]}
            >
              <Select
                placeholder="请选择查询的模块大类"
                onChange={sub_dropdown_change}
                allowClear={false}
                style={{ width: 250 }}
              >
                {state.assembly_main_dropdown}
              </Select>
            </Form.Item>
            <Form.Item
              label="新增部件名"
              name="new_assembly_sub"
              rules={[{ required: true, message: '请输入新的部件名!' }]}
            >
              <Input placeholder="请输入部件名!" allowClear />
            </Form.Item>
            <Form.Item
              wrapperCol={{ offset: 6, span: 14 }}
              label="是否打印"
              style={{ width: 180 }}
              name="new_assembly_sub_tip"
              // rules={[{ required: true, message: '请输入新的部件名!' }]}
            >
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                defaultChecked
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                新增
              </Button>
            </Form.Item>
          </Form>
          <br />
          <Table
            size="small"
            pagination={{
              pageSize: 10,
            }}
            rowKey={random(0, 999999)}
            // summary={()=>{return <div>111</div>}}
            columns={menu_col_sub}
            dataSource={state.assembly_sub}
          />
        </TabPane>

        {/* 部件型号 */}
        <TabPane tab="部件型号" key="model">
          <Form
            style={{ height: '35px' }}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: false }}
            onFinish={onFinish_model}
            onFinishFailed={onFinishFailed_model}
            autoComplete="off"
            layout="inline"
            form={model_form}
          >
            <Form.Item
              label="模块大类"
              name="select_assembly_main"
              rules={[{ required: true, message: '请选择查询的模块大类!' }]}
            >
              <Select
                placeholder="请选择查询的模块大类"
                onChange={main_dropdown_change}
                allowClear={false}
                style={{ width: 250 }}
              >
                {state.assembly_main_dropdown}
              </Select>
            </Form.Item>
            <Form.Item
              label="部件"
              name="select_assembly_sub"
              rules={[{ required: true, message: '请输入新的部件名!' }]}
            >
              <Select
                placeholder="请选择查询的部件"
                onChange={model_dropdown_change}
                allowClear={false}
                style={{ width: 250 }}
                // disabled={true}
              >
                {state.assembly_sub_dropdown}
              </Select>
            </Form.Item>

            {/* <Form.Item
              label="部件型号"
              name="new_assembly_model"
              rules={[{ required: true, message: '请输入新的部件型号!' }]}
            >
              <Input placeholder='请输入部件大类!' />
            </Form.Item> */}

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                新增
              </Button>
            </Form.Item>
          </Form>
          <br />
          <Table
            size="small"
            pagination={{
              pageSize: 10,
            }}
            rowKey={random(0, 999999)}
            // summary={()=>{return <div>111</div>}}
            columns={menu_col_model}
            dataSource={state.assembly_model}
          />
        </TabPane>
        <TabPane tab="总览" key="allview"></TabPane>
      </Tabs>
    </div>
  );
};

export default Maintain;

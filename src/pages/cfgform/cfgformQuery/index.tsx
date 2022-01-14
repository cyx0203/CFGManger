import React, { useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { useAccess, Access, history, useParams } from 'umi';
import {
  Button,
  message,
  Table,
  Space,
  Modal,
  Popconfirm,
  Row,
  Col,
  Input,
  Drawer,
} from 'antd';
import css from './index.less';
import {
  CheckOutlined,
  CopyTwoTone,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Request } from 'GGService';

const Welcome = (props: any) => {
  useEffect(() => {
    showList();
    return () => {};
  }, []);

  const [visible, setVisible] = useState(false);

  const [pageIndex, setPage] = useState(1);

  const [deleteVisible, setDeleteVisible]: any[] = useState([]);

  const [showData, setShowData] = useState([]); // 列表展示的数据

  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const showColumns = [
    // {
    //   title: 'id',
    //   dataIndex: 'id',
    //   defaultSortOrder: 'descend',
    //   sorter: (a: any, b: any) => a.id - b.id,
    // },
    {
      title: '用户单位',
      align: 'center',
      width: 150,
      dataIndex: 'projName',
    },
    {
      title: '设备型号',
      align: 'center',
      width: 150,
      dataIndex: 'dev',
    },
    {
      title: '编号',
      align: 'center',
      width: 75,
      dataIndex: 'id',
    },
    {
      title: '创建时间',
      align: 'center',
      width: 150,
      dataIndex: 'createTime',
    },
    {
      title: '创建人',
      align: 'center',
      width: 100,
      dataIndex: 'createUser',
    },
    {
      title: '操作',
      align: 'center',
      width: 100,
      render: (value: any, row: any, index: any) => (
        <Space size="middle">
          {/* <Button type="primary" onClick={() => showDetail(value, index)}>
            显示详情
          </Button> */}
          <a
            onClick={() => {
              showDetail(value, index);
            }}
          >
            显示详情
          </a>
          <Popconfirm
            title="确定删除?"
            visible={deleteVisible[index]}
            onConfirm={() => deleteList(value, index)}
            okButtonProps={{ loading: confirmLoading }}
            onCancel={() => setDeleteVisible(false)}
          >
            {/* <Button type="primary" onClick={() => setDeleteVisible(true)}>
              删除
            </Button> */}
            <a onClick={() => setDeleteVisible(true)}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleShow = (value: any, index: any) => {};

  const deleteList = (value: any, index: any) => {
    console.log('value', value);
    let temp = [...showData];
    temp.splice(index % 10, 1);
    setShowData(temp);
    Request(
      'Main/deleteConfig',
      {
        id: value.id,
      },
      (Rdata: any) => {
        console.log('返显', Rdata);
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const [data, setData] = useState([
    // 表格数据
  ]);

  const [mainNumber, setMainN]: any[] = useState([]); // 用来统计大类里部件的个数

  // 渲染函数
  const renderContent = (value: any, row, index) => {
    const obj = {
      children: value,
      props: {},
    };
    return obj;
  };

  // 表头
  const columns = [
    {
      title: '部件名称',
      align: 'center',
      width: 75,
      colSpan: 2, // 合并两列，部件大类占第一列
      dataIndex: 'mainType',
      render: (value: any, row: any, index: any) => {
        const obj = {
          children: value,
          props: {},
        };

        // console.log('mainNumber:',mainNumber);
        let k = 0;
        for (let i = 0; i < mainNumber.length; i++) {
          if (index == k) {
            obj.props.rowSpan = mainNumber[i].number;
            // console.log('span1:' + obj.props.rowSpan);
            break;
          }
          if (index > k && index < k + mainNumber[i].number) {
            obj.props.rowSpan = 0;
            // console.log('span2' + obj.props.rowSpan);
            break;
          }
          k += mainNumber[i].number;
        }

        return obj;
      },
    },

    {
      title: '部件',
      align: 'center',
      width: 100,
      colSpan: 0,
      dataIndex: 'subType',
      render: renderContent,
    },
    {
      title: '型号',
      align: 'center',
      width: 220,
      dataIndex: 'type',
      render: renderContent,
    },
    {
      title: '厂家',
      align: 'center',
      width: 75,
      dataIndex: 'manufactory',
      render: renderContent,
    },
    {
      title: 'USB',
      align: 'center',
      width: 70,
      colSpan: 1,
      // dataIndex: 'usb',
      render: (value: any, row: any, index: any) =>
        row.usb && row.usb != '' ? (
          <CheckOutlined style={{ color: 'blue' }} />
        ) : (
          ''
        ),
    },
    {
      title: '串口',
      align: 'center',
      width: 70,
      colSpan: 1,
      dataIndex: 'ck',
      render: renderContent,
    },
    {
      title: 'VGA',
      align: 'center',
      width: 70,
      colSpan: 1,
      // dataIndex: 'vga',
      render: (value: any, row: any, index: any) =>
        row.vga && row.vga != '' ? (
          <CheckOutlined style={{ color: 'blue' }} />
        ) : (
          ''
        ),
    },
    {
      title: 'HDMI',
      align: 'center',
      width: 70,
      colSpan: 1,
      // dataIndex: 'hdmi',
      render: (value: any, row: any, index: any) =>
        row.hdmi && row.hdmi != '' ? (
          <CheckOutlined style={{ color: 'blue' }} />
        ) : (
          ''
        ),
    },
    {
      title: '指示灯',
      align: 'center',
      width: 70,
      colSpan: 1,
      dataIndex: 'light',
      render: renderContent,
    },
    {
      title: '标牌',
      align: 'center',
      width: 70,
      colSpan: 1,
      // dataIndex: 'bp',
      render: (value: any, row: any, index: any) =>
        row.bp && row.bp != '' ? (
          <CheckOutlined style={{ color: 'blue' }} />
        ) : (
          ''
        ),
    },
  ];

  const showList = (keyWord: any) => {
    setPage(1);
    // 展示表单
    Request(
      'Main/selectConfigList',
      {
        // createUser: "user-2",
        // startDate: "20211101",
        // endDate: "20211110",
        // id: "1",
        // projName: "xx项目",
        keyWord: keyWord,
      },
      (Rdata: any) => {
        //返显
        console.group('返现2');
        console.log(Rdata.listInfo);
        console.groupEnd();
        let list = Rdata.listInfo;
        let dataSource = [...showData];
        dataSource = [];
        for (let i = 0; i < list.length; i++) {
          let temp = {};
          temp.id = list[i].id;
          temp.projName = list[i].projName;
          temp.dev = list[i].dev;
          temp.signDevs = list[i].signDevs;
          temp.createTime =
            list[i].createTime.substring(0, 4) +
            '.' +
            list[i].createTime.substring(4, 6) +
            '.' +
            list[i].createTime.substring(6, 8) +
            ' ' +
            list[i].createTime.substring(8, 10) +
            ':' +
            list[i].createTime.substring(10, 12) +
            ':' +
            list[i].createTime.substring(12);
          temp.createUser = list[i].createUser;
          dataSource.push(temp);
        }
        setShowData(dataSource);
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const sortData = (dataS: any) => {
    let temp = [];
    if (dataS.length > 1) {
      let k = 0;
      for (let j = 0; j < 3; j++) {
        for (let i = 0; i < dataS.length; i++) {
          if (j === 0) {
            if (dataS[i].mainType === '主机') temp[k++] = dataS[i];
          } else if (j === 1) {
            if (dataS[i].mainType === '部件') temp[k++] = dataS[i];
          } else {
            if (dataS[i].mainType === '机箱') temp[k++] = dataS[i];
          }
        }
      }

      for (let i = 0; i < temp.length - 1; i++) {
        if (
          temp[i].mainType === temp[i + 1].mainType &&
          temp[i].sort > temp[i + 1].sort
        ) {
          // 大小不对交换
          let t: any = temp[i];
          temp[i] = temp[i + 1];
          temp[i + 1] = t;
        }
      }
      console.log('temp', temp);
      setData(temp);
    }
  };

  const sortMainNumber = (mainN: any) => {
    // console.log(mainN);
    let temp = [];
    if (mainN.length > 1) {
      let k = 0;
      for (let j = 0; j < 3; j++) {
        for (let i = 0; i < mainN.length; i++) {
          if (j === 0) {
            if (mainN[i].typeName === '主机') temp[k++] = mainN[i];
          } else if (j === 1) {
            if (mainN[i].typeName === '部件') temp[k++] = mainN[i];
          } else {
            if (mainN[i].typeName === '机箱') temp[k++] = mainN[i];
          }
        }
      }
      // console.log('tempMain',temp)
      setMainN(temp);
      // console.log(mainNumber);
    }
  };

  const [OPTIONS, setOpt] = useState([
    'COM1',
    'COM2',
    'COM3',
    'COM4',
    'COM5',
    'COM6',
    'COM7',
    'COM8',
    'COM9',
    'COM10',
  ]);
  const [optionsL, setOptl] = useState([
    'light1',
    'light2',
    'light3',
    'light4',
    'light5',
    'light6',
    'light7',
    'light8',
    'light9',
    'light10',
  ]);

  const showDetail = (value: any, index: any) => {
    // 展示表单细节
    setData([]);
    Request(
      'Main/selectConfigDetail',
      {
        configId: value.id,
      },
      (Rdata: any) => {
        //返显
        console.log('返显3', Rdata.listInfo);
        if (Rdata.listInfo) {
          setVisible(true);
          let list = [...Rdata.listInfo];
          let dataSource = [...data];
          dataSource = [];

          let tempMain = [...mainNumber];
          tempMain = [];

          for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < list[i].partList.length; j++) {
              let temp = {
                mainType: '显示失败',
                subType: 'error',
                type: 'error',
                manufactory: 'error',
                usb: '',
                ck: '',
                vga: '',
                hdmi: '',
                light: '',
                lightNo: -1,
                bp: '',
                sort: -1,
                listKey: '',
              };
              (temp.lightNo = list[i].partList[j].lightNo),
                (temp.sort = list[i].partList[j].sort);
              temp.tip = list[i].partList[j].tip;
              temp.mainType = list[i].typeName;
              (temp.subType = list[i].partList[j].listName),
                (temp.type = list[i].partList[j].model),
                (temp.manufactory = list[i].partList[j].factory);
              temp.vga = list[i].partList[j].vga === '1' ? '有' : '';
              temp.hdmi = list[i].partList[j].hdmi === '1' ? '有' : '';
              temp.bp = list[i].partList[j].sign === '1' ? '有' : '';
              if (list[i].partList[j].ports === '3')
                (temp.usb = '有'),
                  (temp.ck = OPTIONS[parseInt(list[i].partList[j].portNo)]);
              else if (list[i].partList[j].ports === '2') temp.usb = '有';
              else if (list[i].partList[j].ports === '1')
                temp.ck = OPTIONS[parseInt(list[i].partList[j].portNo)];
              if (list[i].partList[j].light === '1') {
                temp.light = optionsL[parseInt(list[i].partList[j].lightNo)];
              }
              temp.listKey = list[i].partList[j].listKey;
              dataSource.push(temp);
            }
            let temp0 = {
              typeName: '',
              number: 0,
            };
            temp0.typeName = list[i].typeName;
            temp0.number = list[i].partList.length;
            tempMain.push(temp0);
            setMainN(tempMain);
            sortMainNumber(tempMain);
          }
          console.log('已赋值:', dataSource);
          setData(dataSource);
          // sortData(dataSource);
          downLoadClick(value, dataSource);
        } else {
          message.info('无数据');
        }
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const { Search } = Input;

  const onSearch = (value: any) => {
    showList(value);
  };

  const [searchList, setSL] = useState('');

  const [downLoadTxt, setDownT]: any = useState({
    projName: '',
    id: -1,
    dev: '',
    list: [],
    // devlist: [],
    lightlist: [],
  });

  const downLoadClick = (value, data) => {
    console.log(1, data);
    console.log(2, value);
    let d = data;
    let d1 = value;
    let tempDownTxt: any = [];
    let tempLight: any = [];
    let k = 0;
    let k2 = 0;
    for (let i = 0; i < d.length; i++) {
      if (d[i].tip === '1') {
        let obj = {};
        obj.subType = d[i].subType;
        obj.type = d[i].type;
        obj.com = d[i].ck;
        obj.key = d[i].listKey;
        tempDownTxt[k++] = obj;
      }
      if (d[i].light) {
        let obj = {};
        obj.subType = d[i].subType;
        obj.light = parseInt(d[i].lightNo) + 1;
        tempLight[k2++] = obj;
      }
    }
    let tempD = {
      projName: '',
      dev: '',
      id: -1,
      list: [],
      lightlist: [],
    };
    (tempD.projName = d1.projName),
      (tempD.dev = d1.dev),
      (tempD.id = d1.id),
      (tempD.list = tempDownTxt),
      (tempD.lightlist = tempLight),
      setDownT(tempD);
  };

  const [loading, setLoading] = useState(false); // txt下载loading
  const [loadingWord, setLoadingW] = useState(false); // word下载loading
  const cpy = () => {
    if (copy(JSON.stringify(downLoadTxt))) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  };

  const downloadFile = () => {
    // 下载txt
    setLoading(true);
    console.log('d', downLoadTxt);
    var data = {
      message: JSON.stringify(downLoadTxt),
    };
    var element = document.createElement('a');
    var message = '';
    message += data.message + '\n';
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(message),
    );
    // element.setAttribute('download', downLoadTxt.id+'-'+downLoadTxt.projName+'-'+downLoadTxt.dev+"配置表");
    element.setAttribute('download', downLoadTxt.id);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setLoading(false);
  };

  const downloadWord = () => {
    // 下载word
    setLoadingW(true);
    let url = 'https://wx.ggzzrj.cn/kwj_dcms';
    let t = downLoadTxt;
    Request(
      'Main/downLoadConfig',
      {
        id: t.id,
      },
      (Rdata: any) => {
        console.log('下载返显', Rdata);
        window.open(url + Rdata.fileName);
        setLoadingW(false);
      },
      (error: any) => {
        message.error(error.toString());
        setLoadingW(false);
      },
    );
    setLoadingW(false);
  };

  return (
    <div>
      <Row>
        <Col>
          <Search
            style={{ width: '570px', marginBottom: '20px' }}
            allowClear
            value={searchList}
            onChange={(e) => setSL(e.target.value)}
            placeholder="请输入查询内容"
            onSearch={onSearch}
            enterButton
          />
        </Col>
      </Row>
      {/* <Button type="primary" onClick={showDetail} style={{marginBottom:'20px'}}>显示配置表详情</Button> */}
      <Table
        columns={showColumns}
        size="small"
        dataSource={showData}
        bordered
        pagination={{ current: pageIndex, onChange: (page) => setPage(page) }}
      />
      <Modal
        // className={css.drawer}
        title="配置表详情"
        centered
        visible={visible}
        // onOk={() => {
        //   console.log('dt', downLoadTxt);
        // }}
        onCancel={() => {
          setVisible(false), setMainN([]);
        }}
        width={1000}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setVisible(false), setMainN([]), setDownT({});
            }}
          >
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={downloadFile}
          >
            下载txt
          </Button>,
          <Button
            key="link"
            type="primary"
            loading={loadingWord}
            onClick={downloadWord}
          >
            下载word
          </Button>,
        ]}
      >
        <Table
          size="small"
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
        />
      </Modal>
    </div>
  );
};

export default Welcome;

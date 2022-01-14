import React, { useEffect, useState } from 'react';
import { useAccess, Access, history, useParams } from 'umi';
import {
  Table,
  Row,
  Col,
  Select,
  Button,
  Space,
  Form,
  message,
  Popconfirm,
  Switch,
  Input,
  Modal,
} from 'antd';
import css from './index.less';
import { Request } from 'GGService';
import global from 'GGGLOBAL';
// import { ifStatement } from '@babel/types';

const CFGform = (props: any) => {
  const [state, setState] = useState({
    option1: [], // 部件大类选择
    option2: [], // 部件选择
    option3: [], // 类型选择
    assembly_main: [], // 部件大类列表
    assembly_sub: [], // 部件列表
    assembly_model: [], // 部件型号列表
    // usb: [],
    // ck: [], // 控制串口是否选择
    // selectCk:[], // 每行串口选择的值
    // vga: [],
    // hdmi: [],
    // bp: [],
    // light: [],
    selectLight: [],
    dev: '', // 设备
  });

  const { Option } = Select;

  const [optionDev, setOpD] = useState([]);
  const [optionId, setOpId]: any[] = useState([]);
  const [optionIdValue, setOpIdValue]: any[] = useState(undefined);

  const [option4, setOp]: any[] = useState([]); // 编辑的选择框

  const [editable, setEditable]: any[] = useState([]);

  const [mainNumber, setMainN]: any[] = useState([]); // 记录大类种类和各自的数量

  const [select_form] = Form.useForm(); // 表格Form

  const [select_form1] = Form.useForm(); // 全局Form

  const [visible, setVisible]: any[] = useState([]);

  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const [data, setData] = useState([
    // 表格数据
    // {
    // mainType:'插入错误',
    // subType:'error',
    // type:'error',
    // manufactory:'error'
    // },
    // {
    //   mainType:'插入错误',
    //   subType:'error2',
    //   type:'error',
    //   manufactory:'error'
    // }
  ]);

  const [showData, setShowData] = useState([]); // 列表展示的数据

  // 渲染函数
  const renderContent = (value: any, row: any, index: any) => {
    const obj = {
      children: value,
      props: {},
    };
    return obj;
  };

  const renderContent1 = (value: any, row: any, index: any) => {
    // console.log(row)
    if (!editable[index]) {
      const obj = {
        children: value,
        props: {},
      };
      return obj;
    } else {
      return (
        <Select
          placeholder="请选择查询的型号"
          onChange={() => {
            // console.log('选择了部件型号');
          }}
          allowClear={false}
          style={{ width: '80px' }}
        >
          {option4[index]}
        </Select>
      );
    }
  };

  const [selectedItems, setSelectedItems]: any = useState([]); // 用于过滤选择过的选项
  const [selectIndex, setIndex]: any = useState([]); // 已选择的选项

  const sortSIndex = (index) => {
    // 冒泡排序
    for (let i = selectIndex.length - 1; i > 0; i--) {
      if (index < selectIndex[i - 1].Index) {
        let t = selectIndex[i];
        selectIndex[i] = selectIndex[i - 1];
        selectIndex[i - 1] = t;
      } else {
        break;
      }
    }
    console.log(selectIndex);
  };

  const handleChangeCk = (value: any, index: any, type: any) => {
    if (type === 'ck') {
      let flag = false;
      let temp = [...data];
      for (let i = 0; i < data.length; i++) {
        if (data[i].portN && data[i].portN === value) {
          message.info('此串口已选过!');
          temp[index].portN = null;
          flag = true;
          break;
        }
      }
      if (flag === false) {
        temp[index].portN = value;
      }
      console.log(temp[index].portN);
      setData(temp);
    } else {
      let flag = false;
      let temp = [...data];
      for (let i = 0; i < data.length; i++) {
        if (data[i].lightN && data[i].lightN === value) {
          message.info('此指示灯已选过!');
          temp[index].lightN = null;
          flag = true;
          break;
        }
      }
      if (flag === false) {
        temp[index].lightN = value;
      }
      console.log(temp[index].lightN);
      setData(temp);
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
  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o)); // 过滤选择过的选项
  const filterLight = optionsL.filter((o) => !selectedItems.includes(o));

  // 表头
  const columns = [
    {
      title: '部件名称',
      width: 65,
      colSpan: 2, // 合并两列，部件大类占第一列
      dataIndex: 'mainType',
      align: 'center',
      render: (value: any, row: any, index: any) => {
        const obj = {
          children: value,
          props: {},
        };

        let k = 0;
        for (let i = 0; i < mainNumber.length; i++) {
          if (value === mainNumber[i].mainT) {
            if (index === k) {
              obj.props.rowSpan = mainNumber[i].number;
              break;
            }
            if (index > k && index < k + mainNumber[i].number) {
              obj.props.rowSpan = 0;
              break;
            }
            k += mainNumber[i].number;
          } else k += mainNumber[i].number;
        }
        return obj;
      },
    },
    {
      title: '部件',
      width: 120,
      align: 'center',
      colSpan: 0,
      dataIndex: 'subType',
      editable: true,
      render: renderContent,
    },

    {
      title: '型号',
      align: 'center',
      width: 200,
      dataIndex: 'type',
      render: renderContent1,
    },
    {
      title: '厂家',
      align: 'center',
      width: 80,
      dataIndex: 'manufactory',
      render: renderContent,
    },
    {
      title: 'USB',
      align: 'center',
      width: 60,
      colSpan: 1,
      dataIndex: 'usb',
      render: (value: any, row: any, index: any) => {
        return (
          <Switch
            checked={data[index].usb}
            onChange={(checked) => {
              switchChange(checked, 'usb', index);
            }}
          />
        );
      },
    },
    {
      title: '串口',
      align: 'center',
      width: 180,
      colSpan: 1,
      dataIndex: 'ck',
      render: (value: any, row: any, index: any) => {
        let op = OPTIONS;
        console.log();
        return (
          <Row
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Switch
              checked={data[index].ck}
              onChange={(checked) => {
                switchChange(checked, 'ck', index);
              }}
            />
            <div
              style={{
                display: data[index].ck ? '' : 'none',
                marginLeft: '10px',
              }}
            >
              <Select
                // onBlur={(value)=>{setCkclass(value)}}
                placeholder="选择串口类型"
                value={data[index].portN}
                onChange={(value) => handleChangeCk(value, index, 'ck')}
                style={{ width: '100px' }}
              >
                {filteredOptions.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Row>
        );
      },
    },
    {
      title: 'VGA',
      align: 'center',
      width: 60,
      colSpan: 1,
      dataIndex: 'vga',
      render: (value: any, row: any, index: any) => {
        return (
          <Switch
            checked={data[index].vga}
            onChange={(checked) => switchChange(checked, 'vga', index)}
          />
        );
      },
    },
    {
      title: 'HDMI',
      align: 'center',
      width: 60,
      colSpan: 1,
      dataIndex: 'hdmi',
      render: (value: any, row: any, index: any) => {
        return (
          <Switch
            checked={data[index].hdmi}
            onChange={(checked) => switchChange(checked, 'hdmi', index)}
          />
        );
      },
    },
    {
      title: '指示灯',
      align: 'center',
      colSpan: 1,
      width: 180,
      dataIndex: 'light',
      render: (value: any, row: any, index: any) => {
        return (
          <Row
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Switch
              checked={data[index].light}
              onChange={(checked) => switchChange(checked, 'light', index)}
            />
            <div
              style={{
                display: data[index].light ? '' : 'none',
                marginLeft: '10px',
              }}
            >
              <Select
                placeholder="选择指示灯类型"
                value={data[index].lightN}
                onChange={(value) => handleChangeCk(value, index, 'light')}
                style={{ width: '100px' }}
              >
                {filterLight.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Row>
        );
      },
    },
    {
      title: '标牌',
      align: 'center',
      width: 60,
      colSpan: 1,
      dataIndex: 'bp',
      render: (value: any, row: any, index: any) => {
        return (
          <Switch
            checked={data[index].bp}
            onChange={(checked) => switchChange(checked, 'bp', index)}
          />
        );
      },
    },
    {
      title: '操作',
      align: 'center',
      width: 80,
      render: (value: any, row: any, index: any) => (
        <Space size="middle">
          <Popconfirm
            title="确定删除?"
            visible={visible[index]}
            onConfirm={() => handleDelete(value, index)}
            okButtonProps={{ loading: confirmLoading }}
            onCancel={() => setVisible(false)}
          >
            <a onClick={() => setVisible(true)}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    // 页面加载渲染部件大类
    initMainType();

    // 渲染基础设备
    initBaseDev();

    return () => {};
  }, [mainNumber]);

  const initMainType = () => {
    Request(
      'Common/selectPartType',
      {},
      (data: any) => {
        if (data.code === '00') {
          const listInfo = data.listInfo;
          let optList: any = [];
          for (let i = 0; i < listInfo.length; i++) {
            const item: any = listInfo[i];
            let optDom = <Option value={`${item.id}`}>{item.partType}</Option>;
            optList.push(optDom);
          }
          setState({
            ...state,
            assembly_main: data.listInfo,
            option1: optList,
          });
          console.log(state.option1);
        } else {
          message.error(data.msg);
        }
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const initBaseDev = () => {
    Request(
      'Common/selectBaseDevice',
      {
        selectBaseDeviceDTO: {},
      },
      (data: any) => {
        if (data.code === '00') {
          const listInfo = data.listInfo;
          let optList: any = [];
          for (let i = 0; i < listInfo.length; i++) {
            const item: any = listInfo[i];
            let optDom = <Option value={`${item.id}`}>{item.id}</Option>;
            optList.push(optDom);
          }
          setOpD(optList);
        } else {
          message.error(data.msg);
        }
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const setCkclass = (value: any) => {
    console.log('v', value);
  };

  const deleteCk = (index: any) => {
    for (let i = 0; i < selectedItems.length; i++) {
      if (
        data[index].ck === selectedItems[i] ||
        data[index].light === selectedItems[i]
      ) {
        selectedItems.splice(i, 1); // 删除串口行已选
      }
    }
    selectIndex.splice(index, 1);
    for (let i = index; i < selectIndex.length; i++) {
      // 删除后后面的Index减一个
      selectIndex[i].Index--;
    }
    state.selectCk.splice(index, 1); // 删除串口行的值
    state.selectLight.splice(index, 1);
    console.log(selectIndex);
  };

  const handleDelete = (value: any, index: any) => {
    let dataSource = [...data];
    dataSource.splice(index, 1);
    setData(dataSource);

    // let op4 = option4;
    // option4.splice(index, 1);
    // setOp(op4);
    // console.log(op4);

    let temp = [...mainNumber];

    for (let i = 0; i < temp.length; i++) {
      // 控制表头合并
      if (temp[i].mainT == value.mainType) {
        temp[i].number--;
        if (temp[i].number == 0) temp.splice(i, 1);
        setMainN(temp);
        break;
      }
    }

    console.log(value);
    // console.log(JSON.stringify(temp));
    console.log(JSON.stringify(mainNumber));
  };

  // 大类选择后渲染部件
  const mainChange = (value: string) => {
    select_form.setFieldsValue({
      selectSub: undefined,
      selectType: undefined,
    });
    state.option3 = [];
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
        assembly_sub: listInfo,
        option2: optList,
      });
    });
  };

  // 部件查询交易
  const req_query_sub = (partType: string, callBack: Function) => {
    Request(
      'Common/selectPartList',
      {
        partType: partType,
      },
      (data: any) => {
        // console.log('sub',data)
        setState({
          ...state,
          assembly_sub: data.listInfo,
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

  // 部件选择后渲染部件型号
  const subChange = (value: string) => {
    select_form.setFieldsValue({
      selectType: undefined,
    });
    setState({
      ...state,
      option3: [],
    });
    let is = false;
    let da = data;
    // console.log('da:' + JSON.stringify(da));
    for (let i = 0; i < da.length; i++) {
      // console.log(da[i].listId);
      if (value == da[i].listId) {
        is = true; // 已存在
        message.info('此部件已存在！');
        select_form.setFieldsValue({
          selectType: undefined,
        });
        setState({
          ...state,
          option3: [],
        });
        break;
      }
    }

    if (!is) {
      req_query_model(value, (assembly_model: any) => {
        const listInfo = assembly_model;
        console.error(listInfo);
        let optList: any = [];
        for (let i = 0; i < listInfo.length; i++) {
          const item: any = listInfo[i];
          let optDom = <Option value={`${item.id}`}>{item.model}</Option>;
          optList.push(optDom);
        }
        setState({
          ...state,
          assembly_model: listInfo,
          option3: optList,
        });
      });
    }
  };

  // 部件型号查询交易
  const req_query_model = (subId: string, callBack: Function) => {
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
        if (callBack) {
          callBack(data.listInfo);
        }
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const ssetData = (dataSource: any, temp: any) => {
    // 设置表格数据data
    let has0 = false;
    if (dataSource.length > 0) {
      for (let i = 0; i < dataSource.length; i++) {
        if (dataSource[i].mainType == temp.mainType) {
          // 大类已存在则在已存在后面添加
          dataSource.splice(i + 1, 0, temp);
          has0 = true;
          break;
        }
      }
    }
    if (!has0) {
      // 不存在加在数组最后面
      dataSource.push(temp);
    }
    setData(dataSource);
    sortData(dataSource);
  };

  const sortMainNumber = (mainN: any) => {
    // console.log(mainN)
    let temp = [];
    if (mainN.length > 1) {
      let k = 0;
      for (let j = 0; j < 3; j++) {
        for (let i = 0; i < mainN.length; i++) {
          if (j === 0) {
            if (mainN[i].mainT === '主机') temp[k++] = mainN[i];
          } else if (j === 1) {
            if (mainN[i].mainT === '部件') temp[k++] = mainN[i];
          } else {
            if (mainN[i].mainT === '机箱') temp[k++] = mainN[i];
          }
        }
      }
      // console.log('tempMain', temp);
      setMainN(temp);
    }
  };

  const ssetMainNumber = (temp: any) => {
    // 设置mainNumber

    let has = false; // 判断是否已包含大类
    for (let i = 0; i < mainNumber.length; i++) {
      if (temp.mainType == mainNumber[i].mainT) {
        let tempMain = [...mainNumber];
        tempMain[i].number++;
        setMainN(tempMain);
        has = true;
        sortMainNumber(tempMain);
        break;
      }
    }
    if (!has) {
      let tempMain = [...mainNumber];
      tempMain.push({ mainT: temp.mainType, number: 1 });
      setMainN(tempMain);
      sortMainNumber(tempMain);
    }
  };

  const submitSelect = (value: any) => {
    console.log('value', value);
    if (
      data.length === 0 &&
      (select_form1.getFieldValue('code') === '' ||
        select_form1.getFieldValue('code') === undefined)
    ) {
      message.info('请先导入配置表!');
    } else {
      setState({
        ...state,
        option2: [],
        option3: [],
      });
      select_form.setFieldsValue({
        selectMain: undefined,
        selectSub: undefined,
        selectType: undefined,
      });
      // 查询成功后回调函数
      let dataSource = [...data];
      let temp = {
        mainType: '插入错误',
        subType: 'error',
        type: 'error',
        manufactory: 'error',
        typeId: '',
        listId: '',
        modelId: '',
        usb: false,
        ck: false,
        vga: false,
        hdmi: false,
        light: false,
        bp: false,
        sort: -1,
      };

      for (let i = 0; i < state.assembly_main.length; i++) {
        if (state.assembly_main[i].id == value.selectMain) {
          temp.mainType = state.assembly_main[i].partType;
          temp.typeId = state.assembly_main[i].id;
          break;
        }
      }
      for (let i = 0; i < state.assembly_sub.length; i++) {
        if (state.assembly_sub[i].id == value.selectSub) {
          temp.subType = state.assembly_sub[i].name;
          temp.listId = state.assembly_sub[i].id;
          temp.sort = state.assembly_sub[i].sort;
          break;
        }
      }
      for (let i = 0; i < state.assembly_model.length; i++) {
        if (state.assembly_model[i].id == value.selectType) {
          temp.type = state.assembly_model[i].model;
          temp.manufactory = state.assembly_model[i].factory;
          temp.modelId = state.assembly_model[i].id;
          break;
        }
      }

      ssetData(dataSource, temp);

      ssetMainNumber(temp);

      // 控制删除
      let tempVisible = visible;
      tempVisible.push(false);
      setVisible(tempVisible);
    }
  };

  const subFail = (errorInfo: any) => {
    // 查询提交失败
    console.log('error:' + errorInfo);
  };

  const saveClick = () => {
    // 保存表单并上送
    setEVisible(false);
    console.log('表格数据:', data);
    if (
      data.length === 0 ||
      !select_form1.getFieldValue('code') ||
      !select_form1.getFieldValue('devIn') ||
      !select_form1.getFieldValue('selectDev')
    ) {
      message.error('请先导入配置表!');
    } else {
      let flag = true;
      for (let i = 0; i < data.length; i++) {
        if (data[i].ck && data[i].portN === undefined) {
          message.info(`第${i + 1}行串口未选择`);
          flag = false;
          break;
        }
        if (data[i].light && data[i].lightN === undefined) {
          message.info(`第${i + 1}行指示灯未选择`);
          flag = false;
          break;
        }
      }

      if (flag) {
        let templist: any[] = [];
        let tempDev = {};
        let tempLight = {};

        for (let i = 0; i < data.length; i++) {
          let temp = {};
          let lcode = 0;
          let pcode = 0;

          if (data[i].usb) {
            if (data[i].ck) {
              // 都为真
              for (let a = 0; a < OPTIONS.length; a++) {
                if (data[i].portN && data[i].portN === OPTIONS[a]) {
                  if (!tempDev.com1) tempDev.com1 = data[i].subType;
                  else if (!tempDev.com2) tempDev.com2 = data[i].subType;
                  else if (!tempDev.com3) tempDev.com3 = data[i].subType;
                  else if (!tempDev.com4) tempDev.com4 = data[i].subType;
                  else if (!tempDev.com5) tempDev.com5 = data[i].subType;
                  else if (!tempDev.com6) tempDev.com6 = data[i].subType;
                  else if (!tempDev.com7) tempDev.com7 = data[i].subType;
                  else if (!tempDev.com8) tempDev.com8 = data[i].subType;
                  else if (!tempDev.com9) tempDev.com9 = data[i].subType;
                  else tempDev.com10 = data[i].subType;
                  pcode = 3;
                  temp.portNo = a;
                  break;
                }
              }
            } else pcode = 2; //u真c假
          } else {
            //无usb仅串口
            if (data[i].ck) {
              // if(data[i].ck===true) {message.info(`第${i}行串口未选择`),flag=false}
              // else{
              for (let a = 0; a < OPTIONS.length; a++) {
                if (data[i].portN === OPTIONS[a]) {
                  if (!tempDev.com1) tempDev.com1 = data[i].subType;
                  else if (!tempDev.com2) tempDev.com2 = data[i].subType;
                  else if (!tempDev.com3) tempDev.com3 = data[i].subType;
                  else if (!tempDev.com4) tempDev.com4 = data[i].subType;
                  else if (!tempDev.com5) tempDev.com5 = data[i].subType;
                  else if (!tempDev.com6) tempDev.com6 = data[i].subType;
                  else if (!tempDev.com7) tempDev.com7 = data[i].subType;
                  else if (!tempDev.com8) tempDev.com8 = data[i].subType;
                  else if (!tempDev.com9) tempDev.com9 = data[i].subType;
                  else tempDev.com10 = data[i].subType;
                  pcode = 1;
                  temp.portNo = a;
                  break;
                }
              }
              // }
            }
          }
          console.log(data[i].light);
          if (data[i].light) {
            for (let a = 0; a < optionsL.length; a++) {
              if (data[i].lightN === optionsL[a]) {
                if (!tempLight.light1) tempLight.light1 = data[i].subType;
                else if (!tempLight.light2) tempLight.light2 = data[i].subType;
                else tempLight.light3 = data[i].subType;
                lcode = 1;
                temp.lightNo = a;
                break;
              }
            }
          }
          temp.light = lcode;
          temp.ports = pcode;
          // temp.lightNo =  data[i].light;
          // temp.portNo = data[i].ck;
          temp.hdmi = data[i].hdmi ? 1 : 0;
          temp.vga = data[i].vga ? 1 : 0;
          temp.sign = data[i].bp ? 1 : 0;
          // temp.num = data
          (temp.typeId = data[i].typeId),
            (temp.listId = data[i].listId),
            (temp.modelId = data[i].modelId);
          templist.push(temp);
        }
        console.log('templist:', templist);
        console.log(tempDev);
        console.log(tempLight);
        Request(
          'Main/updateConfig',
          {
            id: select_form1.getFieldValue('code'),
            lightDevs: tempLight,
            list: templist,
            portDevs: tempDev,
            projName: select_form1.getFieldValue('devIn'),
            dev: select_form1.getFieldValue('selectDev'),
            createUser: global.userInfor.userName,
            signDevs: '标牌',
          },
          (data: any) => {
            //返显
            console.log('返显:' + JSON.stringify(data));
            if (data.code === '00') {
              setData([]);
              setMainN([]);
              select_form.resetFields();
              select_form1.resetFields();
              setState({
                ...state,
                option2: [],
                option3: [],
              });
              message.success('修改成功');
              handleSaveClose();
            } else if (data.code === '99') message.error('修改失败');
            else message.error(data.msg);
          },
          (error: any) => {
            message.error(error.toString());
          },
        );
      }
    }
  };

  const showClick = (value: any) => {
    // console.log('v', value);
    select_form.resetFields(); // 清空选择框
    select_form1.resetFields();
    setData([]);
    setMainN([]);
    Request(
      'Main/selectConfigDetail',
      {
        configId: value.id,
      },
      (Rdata: any) => {
        //返显
        console.log('返显3:', Rdata.listInfo);
        if (Rdata.listInfo) {
          let list = [...Rdata.listInfo];
          let dataSource = [...data];
          dataSource = [];

          let tempMain = [...mainNumber];
          tempMain = [];

          let count = 0;
          for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < list[i].partList.length; j++) {
              let temp = {
                mainType: '显示失败',
                subType: 'error',
                type: 'error',
                manufactory: 'error',
                typeId: -1,
                listId: -1,
                modelId: -1,
                usb: false,
                ck: false,
                vga: false,
                hdmi: false,
                light: false,
                bp: false,
                sort: -1,
              };
              temp.sort = list[i].partList[j].sort;
              temp.vga = list[i].partList[j].vga === '1' ? true : false;
              temp.hdmi = list[i].partList[j].hdmi === '1' ? true : false;
              temp.bp = list[i].partList[j].sign === '1' ? true : false;
              temp.mainType = list[i].typeName;
              (temp.subType = list[i].partList[j].listName),
                (temp.type = list[i].partList[j].model),
                (temp.manufactory = list[i].partList[j].factory);
              temp.listId = list[i].partList[j].listId;
              temp.modelId = list[i].partList[j].modelId;
              temp.typeId = list[i].typeId;
              if (list[i].partList[j].ports === '3')
                (temp.usb = true),
                  (temp.ck = true),
                  (temp.portN = OPTIONS[parseInt(list[i].partList[j].portNo)]);
              else if (list[i].partList[j].ports === '2') temp.usb = true;
              else if (list[i].partList[j].ports === '1')
                (temp.ck = true),
                  (temp.portN = OPTIONS[parseInt(list[i].partList[j].portNo)]);
              if (list[i].partList[j].light === '1')
                (temp.light = true),
                  (temp.lightN =
                    optionsL[parseInt(list[i].partList[j].lightNo)]);
              dataSource.push(temp);
            }
            let temp0 = {
              mainT: '',
              number: 0,
            };
            temp0.mainT = list[i].typeName;
            temp0.number = list[i].partList.length;
            tempMain.push(temp0);
            setMainN((preMainN: any) => [...preMainN, ...tempMain]);
            sortMainNumber(tempMain);
          }
          setData(dataSource);
          // sortData(dataSource);
          select_form1.setFieldsValue({
            selectDev: value.dev,
            devIn: value.projName,
            code: value.id,
          });
          handleClose();
        } else {
          message.info('无数据');
        }
      },
      (error: any) => {
        message.error(error.toString());
      },
    );
  };

  const switchChange = (checked: any, type: any, index: any) => {
    console.log(checked);
    let dataSource = [...data];
    let t;
    switch (type) {
      case 'usb':
        dataSource[index].usb = checked;
        setData(dataSource);
        break;
      case 'ck':
        dataSource[index].ck = checked;
        if (!checked) {
          // for(let i=0;i<selectedItems.length;i++){
          //   if(selectedItems[i]===selectIndex[index].Value)
          //   selectedItems.splice(i,1)
          // }
          // if(selectIndex[index]) selectIndex[index].Value = '';
          // console.log(selectIndex)
          dataSource[index].portN = undefined;
        }
        setData(dataSource);
        // dataSource[index].ck = checked;
        break;
      case 'vga':
        dataSource[index].vga = checked;
        setData(dataSource);
        break;
      case 'hdmi':
        dataSource[index].hdmi = checked;
        setData(dataSource);
        break;
      case 'light':
        dataSource[index].light = checked;
        if (!checked) {
          dataSource[index].lightN = undefined;
        }
        setData(dataSource);
        break;
      case 'bp':
        dataSource[index].bp = checked;
        setData(dataSource);
        break;
      default:
    }
  };

  const devChange = (value: any) => {
    setState({
      ...state,
      dev: value,
    });
  };

  const sortData = (dataS: any) => {
    let temp = [];
    let ck = [];
    let light = [];
    let bp = [];
    let hdmi = [];
    let vga = [];
    let usb = [];
    let selectCk = [];
    let selectLight = [];
    let sIndex = [...selectIndex];
    if (dataS.length > 1) {
      let k = 0;
      for (let j = 0; j < 3; j++) {
        for (let i = 0; i < dataS.length; i++) {
          if (j === 0) {
            if (dataS[i].mainType === '主机') {
              temp[k] = dataS[i];
              k++;
            }
          } else if (j === 1) {
            if (dataS[i].mainType === '部件') temp[k++] = dataS[i];
          } else {
            if (dataS[i].mainType === '机箱') temp[k++] = dataS[i];
          }
        }
      }

      for (let i = 0, high = -1; i < temp.length - 1; i++) {
        let low = high + 1;
        if (temp[i].mainType != temp[i + 1].mainType || i === temp.length - 2) {
          if (i === temp.length - 2) high = temp.length - 1;
          else high = i;
          bubbleSort(temp, low, high);
        }
      }
      setData(temp);
    }
  };

  const bubbleSort = (temp: any, low, high) => {
    // 冒泡排序
    console.log(low, high);
    for (let i = low; i < high; i++) {
      for (let j = high; j > i; j--) {
        if (temp[j].sort < temp[j - 1].sort) sortTemp(temp, j - 1);
      }
    }
  };

  const sortTemp = (temp: any, i: any) => {
    let t: any = temp[i];
    temp[i] = temp[i + 1];
    temp[i + 1] = t;
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [saveVisible, setSaveVisible] = useState(false);

  const [search, setSearch] = useState('');

  const showList = (value: any) => {
    setPage(1);
    // 展示表单
    Request(
      'Main/selectConfigList',
      {
        // createUser: global.userInfor.userName,
        keyWord: value,
      },
      (Rdata: any) => {
        let list = [...Rdata.listInfo];
        console.log('list', list);
        // let optList: any = [];
        // for (let i = 0; i < list.length; i++) {
        //   const item: any = list[i];
        //   let optDom = <Option value={`${item.id}`}>{item.id}</Option>;
        //   optList.push(optDom);
        // }
        // setOpId(optList);
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

  const handleClose = () => {
    setPage(1);
    setSearch(''), setIsModalVisible(false);
    setOpIdValue(undefined);
  };

  const handleSaveClose = () => {
    // select_form1.resetFields();
    setSaveVisible(false);
  };

  const DevInChange = (e) => {
    // console.log(e)
  };

  const codeChange = (e) => {};

  const { Search } = Input;
  const onSearch = (value: any) => showList(value);

  const showColumns = [
    {
      title: '用户单位',
      align: 'center',
      width: 200,
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
      width: 150,
      dataIndex: 'id',
    },
    {
      title: '创建时间',
      align: 'center',
      width: 250,
      dataIndex: 'createTime',
    },
    {
      title: '创建人',
      align: 'center',
      width: 200,
      dataIndex: 'createUser',
    },
    {
      title: '操作',
      align: 'center',
      width: 100,
      render: (value: any, row: any, index: any) => (
        <Space size="middle">
          {/* <Button
            type="primary"
            onClick={() => {
              showClick(row);
            }}
          >
            导入
          </Button> */}
          <a
            onClick={() => {
              showClick(row);
            }}
          >
            导入
          </a>
        </Space>
      ),
    },
  ];

  const [pageIndex, setPage] = useState(1);

  const [editVisible, setEVisible] = useState(false);

  return (
    <div>
      <Row>
        <Col>
          <Button
            type="primary"
            onClick={() => {
              setIsModalVisible(true), showList();
            }}
          >
            导入配置表(修改)
          </Button>
        </Col>
      </Row>
      <Row style={{ marginBottom: '20px', marginTop: '10px' }}>
        <Form
          style={{ height: '40px' }}
          name="select"
          // labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          initialValues={{ remember: false }}
          onFinish={submitSelect}
          onFinishFailed={subFail}
          autoComplete="off"
          layout="inline"
          form={select_form}
        >
          <Col>
            <Form.Item
              // label="部件大类"
              key={0}
              name="selectMain"
              rules={[{ required: true, message: '请选择部件大类!' }]}
            >
              <Select
                placeholder="请选择查询的部件大类"
                onChange={mainChange}
                // allowClear={true}
                style={{ width: '180px' }}
              >
                {state.option1}
              </Select>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              key={1}
              name="selectSub"
              rules={[{ required: true, message: '请选择部件类型!' }]}
            >
              <Select
                placeholder="请选择查询的部件"
                onChange={subChange}
                allowClear={false}
                style={{ width: '180px' }}
              >
                {state.option2}
              </Select>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item
              // label="型号"
              key={2}
              name="selectType"
              rules={[{ required: true, message: '请选择型号!' }]}
            >
              <Select
                placeholder="请选择查询的型号"
                onChange={() => {
                  // console.log('选择了部件型号');
                }}
                allowClear={false}
                style={{ width: '180px' }}
              >
                {state.option3}
              </Select>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item key={3}>
              <Button type="primary" htmlType="submit">
                新增
              </Button>
            </Form.Item>
          </Col>
        </Form>

        <Col
        // style={{ marginLeft: '15px' }}
        >
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => setSaveVisible(true)}
          >
            保存修改
          </Button>
        </Col>
      </Row>
      <Modal
        footer={false}
        centered
        width={1000}
        title="请选择配置表"
        visible={isModalVisible}
        onOk={() => {
          // showClick(optionIdValue),
          handleClose();
        }}
        onCancel={() => {
          handleClose();
        }}
      >
        {/* <Row>
            <Select
              placeholder="请选择配置表"
              value={optionIdValue}
              onChange={(value) => {
                setOpIdValue(value);
              }}
              style={{ width: '180px' }}
            >
              {optionId}
            </Select>
            </Row>
            <br/> */}
        <Row>
          <Search
            allowClear
            value={search}
            onChange={(e: any) => {
              setSearch(e.target.value);
            }}
            style={{ width: '570px', marginBottom: '10px' }}
            placeholder="请输入查询内容"
            onSearch={onSearch}
            enterButton
          />
        </Row>
        <Table
          columns={showColumns}
          size="small"
          dataSource={showData}
          bordered
          pagination={{ current: pageIndex, onChange: (page) => setPage(page) }}
        />
      </Modal>
      <Modal
        title="请完善配置表"
        visible={saveVisible}
        width={800}
        footer={false}
        onOk={() => {
          handleSaveClose();
          // saveClick();
        }}
        onCancel={() => {
          handleSaveClose();
          // setEVisible(false);
          // console.log('e',editVisible)
        }}
      >
        <Form
          style={{ height: '45px' }}
          name="select1"
          initialValues={{ remember: false }}
          autoComplete="off"
          layout="inline"
          form={select_form1}
        >
          <Row style={{ marginBottom: '20px' }}>
            <Col>
              <Form.Item
                key={0}
                name="devIn"
                rules={[{ required: true, message: '请输入用户单位!' }]}
              >
                <Input
                  style={{ width: '180px' }}
                  allowClear
                  onChange={DevInChange}
                  placeholder="请输入用户单位"
                ></Input>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                key={1}
                name="selectDev"
                rules={[{ required: true, message: '请选择查询的设备!' }]}
              >
                <Select
                  placeholder="请选择查询的设备"
                  onChange={devChange}
                  allowClear
                  style={{ width: '180px' }}
                >
                  {optionDev}
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                key={2}
                name="code"
                rules={[{ required: true, message: '请输入编号!' }]}
              >
                <Input
                  disabled
                  style={{ width: '180px' }}
                  allowClear
                  onChange={codeChange}
                  placeholder="请输入编号"
                ></Input>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                {/* <Popconfirm
            title="确定修改?"
            visible={editVisible}
            onConfirm={saveClick}
            okButtonProps={{ loading: confirmLoading }}
            onCancel={() => setEVisible(false)}
          > */}
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={saveClick}
                  // onClick={() => setEVisible(true)}
                >
                  修改配置表
                </Button>
                {/* </Popconfirm> */}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Table
        size="small"
        pagination={false}
        columns={columns}
        dataSource={data}
        bordered
      />
    </div>
  );
};

export default CFGform;

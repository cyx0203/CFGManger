import React, { useEffect } from 'react';
import { useAccess, Access, history, useParams } from 'umi';
import { Result, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

const Welcome = (props: any) => {
  useEffect(() => {
    return () => {};
  });

  return (
    // <div>
    //   <div>欢迎使用配置单管理平台</div>
    //   {/* @ts-ignore */}
    //   <div>当前版本:{VERSION}</div>
    // </div>
    <Result
      icon={<SmileOutlined />}
      title="欢迎使用配置单管理平台"
      //@ts-ignore
      subTitle={<div>当前版本:{VERSION}</div>}
      // extra={<Button type="primary">Next</Button>}
    />
  );
};

export default Welcome;

import React, { useState, useEffect } from 'react';
import type { ProSettings } from '@ant-design/pro-layout';
import ProLayout, {
  PageContainer,
  MenuDataItem,
  ProBreadcrumb,
} from '@ant-design/pro-layout';
// import { IconMap } from '@/utils/iconsMap';
import {
  useModel,
  Link,
  useAccess,
  Access,
  history,
  useParams,
  useLocation,
} from 'umi';
import { message, Avatar, Menu, Dropdown, Tag } from 'antd';
import axios from 'axios';
import global from 'GGGLOBAL';
import {
  OrderedListOutlined,
  UnorderedListOutlined,
  FileAddOutlined,
  SmileOutlined,
  HeartOutlined,
  AppstoreOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  ToolOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import { random } from 'lodash';

const BasicLayout: React.FC<{}> = (props: any) => {
  const { route } = props;
  //@ts-ignore
  const title = MAIN_TITLE;

  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    title: title,
  });
  const IconMap: any = {
    smile: <SmileOutlined />,
    heart: <HeartOutlined />,
    item: <AppstoreOutlined />,
    user: <UsergroupAddOutlined />,
    my: <UserOutlined />,
    maintain: <ToolOutlined />,
    add: <FileAddOutlined />,
    list: <UnorderedListOutlined />,
    detail: <OrderedListOutlined />,
  };
  // 菜单 loop
  const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] =>
    menus.map(({ icon, children, ...item }) => ({
      ...item,
      icon: icon && IconMap[icon as string],
      children: children && loopMenuItem(children),
    }));

  const handleMenuClick = (data: any) => {
    const funcType = data.key;
    console.log(funcType);
    global.userInfor = null;
    if (funcType === 'logout') {
      history.push({
        pathname: '/login',
        query: {},
      });
      message.success('用户已登出');
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="logout">登出</Menu.Item>
    </Menu>
  );
  const _useLocation = useLocation();
  const access = useAccess();

  const [pathname, setPathname] = useState('/');
  const [pathCN, setPathCN] = useState('欢迎');

  useEffect(() => {
    authentication(route);
    return () => {};
  }, [_useLocation.pathname]);

  const authentication = (route: any) => {
    console.log('##authentication##');
    // console.log(route);

    const userInfor = global.userInfor;

    if (access.canLogin(route)) {
      console.info('ACCESS');
      // access.justAdmin(userInfor);
    } else {
      console.error('NO ACCESS');
      history.push({
        pathname: '/login',
        query: {},
      });
    }
  };

  return (
    <ProLayout
      headerContentRender={(routes) => {
        // console.log('headerContentRender');
        // console.log(routes);
        return (
          <div className={styles.headerLocation}>
            <FolderOpenOutlined />
            &nbsp;{pathCN}
          </div>
        );
      }}
      breadcrumbProps={{
        itemRender: (route) => {
          return <span>{route.breadcrumbName}</span>;
        },
      }}
      // style={{display:'none'}}
      location={{
        pathname,
      }}
      logo={'./assets/img/logo.svg'}
      contentStyle={{ height: 'calc(100vh - 100px)' }}
      menuDataRender={() => loopMenuItem(route.routes)}
      menuItemRender={(item, dom) => (
        <Link
          to={item.path ?? '/index'}
          onClick={() => {
            // alert(item.path);
            console.log(item);
            setPathCN(item.name || '');
            setPathname(item.path || '/index');
          }}
        >
          {dom}
        </Link>
      )}
      onMenuHeaderClick={(e) => console.log(e)}
      rightContentRender={() => (
        <div>
          <Dropdown
            overlay={menu}
            // onVisibleChange={handleVisibleChange}
            // visible={this.state.visible}
          >
            <div className={styles.rightContent}>
              <div style={{ marginRight: 15 }}>{`你好，${
                global.userInfor && global.userInfor.userName
                  ? global.userInfor.userName
                  : '游客'
              }`}</div>
              {global.userInfor.userRole === 'P' ? (
                <Tag color={'green'}>普通用户</Tag>
              ) : (
                <Tag color={'magenta'}>管理员</Tag>
              )}
              <Avatar shape="square" size="small" icon={<UserOutlined />} />
            </div>
          </Dropdown>
          {/*  */}
        </div>
      )}
      waterMarkProps={{
        content: title,
      }}
      breadcrumbRender={false}
      // footerRender={'<div>123</div>}
      {...settings}
    >
      <PageContainer
        // pageHeaderRender={()=>{
        //     return ''
        // }}
        title={false}
        // breadcrumbRender={false}

        // key={`PageContainer_${random(0, 999999)}`}
        className={styles.container}
      >
        {props.children}
      </PageContainer>
    </ProLayout>
  );
};

export default BasicLayout;

import React, { useEffect } from 'react';
import { Menu, Divider, ConfigProvider, Avatar, Button } from 'antd';
import {
  DashboardOutlined,
  DollarCircleOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import { WalletOutlined } from '@ant-design/icons';
import zhCN from 'antd/lib/locale/zh_CN';
import styles from './index.less';
import { currencyFormat } from '../utils/utility';
import avatarImg from '../assets/avatar.png';
import { history } from 'umi';
import useAsync from '@/utils/use-async';
import { getTotal } from '@/services/transactions';

const Profile: React.FC = () => {
  const nickName = 'doubj:)';

  const { run, data, isLoading } = useAsync<{ balance: number }>();

  useEffect(() => {
    run(getTotal());
  }, []);

  return (
    <div className={styles.profile}>
      <Avatar size={100} src={avatarImg} />
      <span className={styles.nickName}>{nickName}</span>
      <Button
        loading={isLoading}
        style={{ width: '130px', borderRadius: '30px' }}
        type="default"
        icon={<WalletOutlined />}
        size={'large'}
        onClick={() => {
          history.push(`/transactions`);
        }}
      >
        <span>{currencyFormat().format(data?.balance || 0)}</span>
      </Button>
    </div>
  );
};

const RouteMap: any = {
  dashboard: {
    key: 'dashboard',
    name: '综合统计',
    icon: DashboardOutlined,
  },
  transactions: {
    key: 'transactions',
    name: '交易记录',
    icon: DollarCircleOutlined,
  },
  templates: {
    key: 'templates',
    name: '记录模板',
    icon: CodeOutlined,
  },
};

const BaseLayout: React.FC = (props: any) => {
  const { children, location } = props;

  const menuSelected = (selected: any) => {
    history.push(`/${selected.key}`);
  };

  return (
    <>
      <ConfigProvider locale={zhCN}>
        <section className={styles.layoutContainer}>
          <aside className={styles.layoutSider}>
            <div className={styles.title}>
              <p className="text-colorful">Money Tracing</p>
            </div>
            <Profile />
            <Divider />
            <Menu
              selectedKeys={[location.pathname.substring(1)]}
              mode="inline"
              onSelect={menuSelected}
            >
              {Object.keys(RouteMap).map((k) => {
                const route = RouteMap[k];
                return (
                  <Menu.Item key={route.key} icon={<route.icon />}>
                    {route.name}
                  </Menu.Item>
                );
              })}
            </Menu>
            <Divider />
          </aside>
          <section className={styles.layoutContent}>{children}</section>
        </section>
      </ConfigProvider>
    </>
  );
};

export default BaseLayout;

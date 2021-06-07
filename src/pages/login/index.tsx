import React from 'react';
import { Form, Input, Card, Button } from 'antd';
import styles from './index.less';
import { LoginParamsType, login } from '@/services/login';
import useAsync from '@/utils/use-async';
import { history } from 'umi';

const Login: React.FC = () => {
  const [form] = Form.useForm();

  const { run, isLoading } = useAsync<{ token: string }>();

  const handleLogin = () => {
    form.validateFields().then(async (values: LoginParamsType) => {
      const result = await run(login(values));
      if (result) {
        localStorage.setItem('token', result.token as string);
        history.push('/dashboard');
      }
    });
  };

  return (
    <div className={styles.container}>
      <Card
        className={styles.loginWrapper}
        bodyStyle={{ padding: 0, height: '100%', display: 'flex' }}
      >
        <div className={styles.leftImage} />
        <div className={styles.rightForm}>
          <h1 className={'text-colorful'}>Money Tracing</h1>
          <Form form={form} name="loginForm" initialValues={{}}>
            <Form.Item
              name="userName"
              rules={[{ required: true, message: '用户名不能为空!' }]}
            >
              <Input size="large" placeholder="用户名" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                size="large"
                placeholder="密码"
                onPressEnter={handleLogin}
              />
            </Form.Item>
          </Form>
          <Button loading={isLoading} onClick={handleLogin}>
            登录
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;

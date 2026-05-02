import {
  AlipayOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoOutlined,
  UserOutlined,
  WeiboOutlined,
} from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import {
  FormattedMessage,
  Helmet,
  SelectLang,
  useIntl,
  useModel,
} from '@umijs/max';
import { Alert, App, Button, Divider, Space, Tabs, message, theme } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import Settings from '../../../../config/defaultSettings';
import { SYSTEM_LOGENT_URL } from '@/constants';

const iconStyles = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

type LoginType = 'phone' | 'account';

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('/生成水产养殖设备图片.png')",
      backgroundSize: '100% 100%',
    },
  };
});

const ActionIcons = () => {
  const { token } = theme.useToken();
  
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Divider plain>
        <span
          style={{
            color: token.colorTextPlaceholder,
            fontWeight: 'normal',
            fontSize: 14,
          }}
        >
          其他登录方式
        </span>
      </Divider>
      <Space align="center" size={24}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: 40,
            width: 40,
            border: '1px solid ' + token.colorPrimaryBorder,
            borderRadius: '50%',
          }}
        >
          <AlipayOutlined style={{ ...iconStyles, color: '#1677FF' }} />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: 40,
            width: 40,
            border: '1px solid ' + token.colorPrimaryBorder,
            borderRadius: '50%',
          }}
        >
          <TaobaoOutlined style={{ ...iconStyles, color: '#FF6A10' }} />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: 40,
            width: 40,
            border: '1px solid ' + token.colorPrimaryBorder,
            borderRadius: '50%',
          }}
        >
          <WeiboOutlined style={{ ...iconStyles, color: '#1890ff' }} />
        </div>
      </Space>
    </div>
  );
};

const Lang = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.lang} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.Login>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const { message } = App.useApp();
  const intl = useIntl();

  // 获取用户信息
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
        // 登录
        const msg = await login({ ...values, type });
        console.log('msg:', msg);

        if(msg) {

            console.log('登录成功，用户数据:', msg);
        
            // // 保存 token
            // if (msg.token) {
            //   localStorage.setItem('token', msg.token);
            // }
        
            const defaultLoginSuccessMessage = intl.formatMessage({
              id: 'pages.login.success',
              defaultMessage: '登录成功！',
            });

            message.success(defaultLoginSuccessMessage);
          

            // 获取用户信息
            await fetchUserInfo();

            const urlParams = new URL(window.location.href).searchParams;
            window.location.href = urlParams.get('redirect') || '/';
            return;
        }
   

 
  };
  const { status, type: loginType } = userLoginState;
  const { token } = theme.useToken();

  return (
    <ProConfigProvider>
      <div
        style={{
          backgroundColor: 'white',
          height: '100vh',
        }}
      >
        <Helmet>
          <title>
            {`${intl.formatMessage({
              id: 'menu.login',
              defaultMessage: '登录页',
            })}${Settings.title ? ` - ${Settings.title}` : ''}`}
          </title>
        </Helmet>
        <Lang />
        <LoginFormPage
          // backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
          logo={<img alt="logo" src={SYSTEM_LOGENT_URL} />}
          backgroundVideoUrl="/wallpaper-dynamic_Working_c.mp4"
          title="ArtSail"
          containerStyle={{
            backgroundColor: 'rgba(239, 237, 237, 0.65)',
            backdropFilter: 'blur(4px)',
          }}
          subTitle="最好的管理系统"
          // activityConfig={{
          //   style: {
          //     boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
          //     color: token.colorTextHeading,
          //     borderRadius: 8,
          //     backgroundColor: 'rgba(255,255,255,0.25)',
          //     backdropFilter: 'blur(4px)',
          //   },
          //   title: '活动标题，可配置图片',
          //   subTitle: '活动介绍说明文字',
          //   action: (
          //     <Button
          //       size="large"
          //       style={{
          //         borderRadius: 20,
          //         background: token.colorBgElevated,
          //         color: token.colorPrimary,
          //         width: 120,
          //       }}
          //     >
          //       去看看
          //     </Button>
          //   ),
          // }}
          actions={
            <ActionIcons />
          }
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: '账户密码登录',
                }),
              },
              {
                key: 'mobile',
                label: intl.formatMessage({
                  id: 'pages.login.phoneLogin.tab',
                  defaultMessage: '手机号登录',
                }),
              },
            ]}
          />

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/ant.design)',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <UserOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                placeholder="用户名: admin 或 user"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.userAccount.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <LockOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                placeholder="密码: ant.design"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.userPassword.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                  {
                    message: (
                      <FormattedMessage
                        id="pages.login.userPassword.length"
                        defaultMessage="密码至少6位"
                      />
                    ),
                    type: 'string',
                    min: 6,
                  }
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && (
            <LoginMessage content="验证码错误" />
          )}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: (
                    <MobileOutlined
                      style={{
                        color: token.colorText,
                      }}
                      className={'prefixIcon'}
                    />
                  ),
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  const result = await getFakeCaptcha({
                    phone,
                  });
                  if (!result) {
                    return;
                  }
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage
                id="pages.login.rememberMe"
                defaultMessage="自动登录"
              />
            </ProFormCheckbox>
            
            <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage
                id="pages.login.forgotPassword"
                defaultMessage="忘记密码"
              />
            </a>

            <a
              style={{
                float: 'right',
                marginRight: 24,
              }}
              href="/user/register"
            >
              <FormattedMessage
                id="pages.login.registerAccount"
                defaultMessage="注册账户"
              />
            </a>
          </div>
        </LoginFormPage>
      </div>
    </ProConfigProvider>
  );
};

export default Login;

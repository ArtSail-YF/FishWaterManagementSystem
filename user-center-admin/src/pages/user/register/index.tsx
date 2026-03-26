import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormText,
} from '@ant-design/pro-components';
import {
  FormattedMessage,
  Helmet,
  SelectLang,
  useIntl,
  useModel,
} from '@umijs/max';
import { Alert, App, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { Footer } from '@/components';
import { register } from '@/services/ant-design-pro/api';
import Settings from '../../../../config/defaultSettings';
import { SYSTEM_LOGENT_URL } from '@/constants';
import { history } from 'umi';

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
        "url('https://ts1.tc.mm.bing.net/th/id/R-C.ba89cab7a601143ff59f2c5e5f9f32fe?rik=MjhMhfZ%2fku0Nbg&riu=http%3a%2f%2fimg.52desk.com%2ftp%2f235534nSvWn.jpg&ehk=IW1740oJAQyLPrm2ZFtNw4WfXclBHxTB4V5bopZJiXA%3d&risl=1&pid=ImgRaw&r=0')",
      backgroundSize: '100% 100%',
    },
  };
});

const ActionIcons = () => { 
  const { styles } = useStyles();

  return (
    <>
      <AlipayCircleOutlined
        key="AlipayCircleOutlined"
        className={styles.action}
      />
      <TaobaoCircleOutlined
        key="TaobaoCircleOutlined"
        className={styles.action}
      />
      <WeiboCircleOutlined
        key="WeiboCircleOutlined"
        className={styles.action}
      />
    </>
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

const Register: React.FC = () => {

  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const { message } = App.useApp();
  const intl = useIntl();

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


  //注册逻辑
  const handleSubmit = async (values: API.RegisterParams) => {

    //校验两次输入的密码是否一致
    const{userAccount, userPassword, checkPassword} = values;
      if(userPassword !== checkPassword){
        message.error('两次输入的密码不一致！');
        return;
      }
    

    try {
      // 注册
      const msg = await register({ ...values, type });

   
        const id = msg.id;

          if(id > 0){
              const defaultLoginSuccessMessage = intl.formatMessage({
              id: 'pages.register.success',
              defaultMessage: '注册成功！',
              });

              message.success(defaultLoginSuccessMessage);
              
      
              // await fetchUserInfo();
              // const urlParams = new URL(window.location.href).searchParams;
              // window.location.href = urlParams.get('redirect') || '/';

              if(!history) return;
              const redirect = new URL(window.location.href).searchParams.get('redirect');
              history.replace(
                      redirect
                        ? `/user/login?redirect=${encodeURIComponent(redirect)}`
                        : '/user/login'
                    );     

                return;
                
                  }

  

    } catch (error : any) {

      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.register.failure',
        defaultMessage: '注册失败，请重试！',
      });
      console.log(error);
      message.error(error.message ?? defaultLoginFailureMessage);
    }

  };

  // const { status, type: registerType } = userLoginState;


  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.register',
            defaultMessage: '注册页',
          })}
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      <Lang />
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          submitter={{
            searchConfig: {
              submitText:'注册'
            }
          }}
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src={ SYSTEM_LOGENT_URL} />}
          title="ArtSail"
          subTitle={'最好的管理系统'}
          initialValues={{
            autoLogin: false,
          }}
          actions={[
            <FormattedMessage
              key="registerWith"
              id="pages.register.registerWith"
              defaultMessage="其他注册方式"
            />,
            <ActionIcons key="icons" />,
          ]}
          
          //执行注册逻辑
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
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
                  id: 'pages.register.accountLogin.tab',
                  defaultMessage: '账户密码注册',
                }),
              },
              {
                key: 'mobile',
                label: intl.formatMessage({
                  id: 'pages.register.phoneLogin.tab',
                  defaultMessage: '手机号注册',
                }),
              },
            ]}
          />


          {status === 'error' && registerType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.register.accountLogin.errorMessage',
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
                  prefix: <UserOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.register.userAccount.placeholder',
                  defaultMessage: '请输入账户',
                })}
                rules={[
                  {
                 
                    message: (
                      <FormattedMessage
                        id="pages.register.userAccount.required"
                        defaultMessage="不包含特殊符号，至少4位"
                      />
                    ),
                    min: 4,
                    pattern: /^[a-zA-Z0-9_]+$/,
                  },
                  
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.register.userPassword.placeholder',
                  defaultMessage: '请输入密码',
                })}
                rules={[
            
                  {
                  
                    message: (
                      <FormattedMessage
                        id="pages.register.userPassword.length"
                        defaultMessage="密码至少6位"
                      />
                    ),
                    type: 'string',
                    min: 6,
                  }
                ]}
              />
                 <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                //提示语
                placeholder={intl.formatMessage({
                  id: 'pages.register.checkPassword.placeholder',
                  defaultMessage: '请输入确认密码',
                })}
                rules={[
             
                  {
                    
                    message: (
                      <FormattedMessage
                        id="pages.register.checkPassword.length"
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



          {status === 'error' && registerType === 'mobile' && (
            <LoginMessage content="验证码错误" />
          )}
 
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined />,
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.register.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.register.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.register.phoneNumber.invalid"
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
                  id: 'pages.register.captcha.placeholder',
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
                    id: 'pages.register.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.register.captcha.required"
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
   
             
        </LoginForm>
      </div>
      <Footer />

    </div>
  );
};

export default Register;

/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    static: true,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
      {
        name: 'register',
        path: '/user/register',
        component: './user/register',

      }
    ],

  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    routes: [
      {
        path: '/dashboard',
        redirect: '/dashboard/base-distribution',
      },
      {
        path: '/dashboard/base-distribution',
        name: 'base-distribution',
        component: './dashboard/BaseDistribution',
      },
      {
        path: '/dashboard/water-quality',
        name: 'water-quality',
        component: './dashboard/WaterQuality',
      },
      {
        path: '/dashboard/production-plan',
        name: 'production-plan',
        component: './dashboard/ProductionPlan',
      },
      {
        path: '/dashboard/business-analysis',
        name: 'business-analysis',
        component: './dashboard/BusinessAnalysis',
      },
    ],
  },
  {
    path: '/warning',
    name: 'warning',
    icon: 'warning',
    routes: [
      {
        path: '/warning',
        redirect: '/warning/comprehensive',
        // component: './warning/Comprehensive',
      },
      {
        path: '/warning/comprehensive',
        name: 'comprehensive',
        component: './warning/Comprehensive',
      },
      {
        path: '/warning/records',
        name: 'records',
        component: './warning/Records',
      },
    ],
  },
  {
    path: '/weather',
    name: 'weather',
    icon: 'cloud',
    routes: [
      {
        path: '/weather',
        redirect: '/weather/disaster',
        // component: './weather/Disaster',
      },
      {
        path: '/weather/real-time',
        name: 'real-time',
        component: './weather/RealTime',
      },
      {
        path: '/weather/disaster',
        name: 'disaster',
        component: './weather/Disaster',
      },
      {
        path: '/weather/history',
        name: 'history',
        component: './weather/History',
      },
    ],
  },
  {
    path: '/production',
    name: 'production',
    icon: 'setting',
    routes: [
      {
        path: '/production',
        redirect: '/production/logs',
        // component: './production/Logs',
      },
      {
        path: '/production/logs',
        name: 'logs',
        routes: [
          {
            path: '/production/logs',
            redirect: '/production/logs/feeding',
          },
          {
            path: '/production/logs/feeding',
            name: 'feeding',
            component: './production/logs/Feeding',
          },
          {
            path: '/production/logs/medicine',
            name: 'medicine',
            component: './production/logs/Medicine',
          },
        ],
      },
      {
        path: '/production/pond-archives',
        name: 'pond-archives',
        component: './production/PondArchives',
      },
      {
        path: '/production/input-records',
        name: 'input-records',
        component: './production/InputRecords',
      },
    ],
  },
  {
    path: '/info-nav',
    name: 'info-nav',
    icon: 'infoCircle',
    routes: [
      {
        path: '/info-nav',
        redirect: '/info-nav/market',
        // component: './info-nav/Market',
      },
      {
        path: '/info-nav/market',
        name: 'market',
        component: './info-nav/Market',
      },
      {
        path: '/info-nav/suppliers',
        name: 'suppliers',
        component: './info-nav/Suppliers',
      },
      {
        path: '/info-nav/contacts',
        name: 'contacts',
        component: './info-nav/Contacts',
      },
      {
        path: '/info-nav/knowledge',
        name: 'knowledge',
        component: './info-nav/Knowledge',
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/userManage',
      },
      {
        path: '/admin/userManage',
        name: 'UserManage',
        component: './admin/userManage',
      },
    ],
  },

  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
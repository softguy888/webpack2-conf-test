export default (ngModuleRef, angularRef) => {
  ngModuleRef.config([
      '$urlRouterProvider',
      '$locationProvider',
      '$stateProvider',
      '$logProvider',
      '$qProvider',
      '$compileProvider',
      '$ocLazyLoadProvider',
      (
        $urlRouterProvider,
        $locationProvider,
        $stateProvider,
        $logProvider,
        $qProvider,
        $compileProvider,
        $ocLazyLoadProvider
      ) => {

        $locationProvider.html5Mode(false); // 开启H5模式URI
        $logProvider.debugEnabled(true); //log 日志
        $locationProvider.hashPrefix('!');

        $qProvider.errorOnUnhandledRejections(false);
        $compileProvider.debugInfoEnabled(false);

        $ocLazyLoadProvider.config({
          debug: true,
          events: true
        });

        $stateProvider
          .state({
            name: 'index',
            url: '',
            controller: 'AppHomeCtrl',
            templateProvider: ['$q', ($q) => {

              const deferred = $q.defer();

              require.ensure(['../app-home/index.html'], () => {
                const template = require('../app-home/index.html');
                deferred.resolve(template);
              });

              return deferred.promise;
            }],
            resolve: {
              appHome: ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {

                const deferred = $q.defer();

                require.ensure([], () => {
                  const module = require('../app-home/index.js').default(angularRef);
                  $ocLazyLoad.load({
                    name: 'app-home'
                  });
                  deferred.resolve(module);
                });

                return deferred.promise;
              }]
            }
          });

        $urlRouterProvider.when('', '');
        $urlRouterProvider.otherwise(''); //错误路由重定向

      }
    ])
    .run(['$templateCache', ($templateCache) => {
      $templateCache.removeAll();
    }]);
};

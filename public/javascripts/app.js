"use strict";

var app = angular.module('MyApp', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/asset/:assetId', {
            templateUrl: '/partials/asset.html',
            controller: 'AssetController',
            resolve: {
                asset: {}
            }
        })
        .when('/', {
            templateUrl: '/partials/assets.html',
            controller: 'AssetsController',
            resolve: {
                assetsData: function (api) {
                    return api.getAssets();
                }
            }
        })
        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.controller('MainController', function ($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$routeParams = $routeParams;
    $scope.$location = $location;
});

app.controller('AssetsController', function ($scope, assetsData, api) {
    function mapAssetsToDescriptions(assetsData) {
        return assetsData.assets.map(function (asset) {
            var description = assetsData.descriptions.find(function (description) {
                return description.classid === asset.classid;
            });
            asset.description = description;
            return asset;
        });
    }

    $scope.assetsData = assetsData;
    $scope.assets = mapAssetsToDescriptions(assetsData);

    $scope.loadMore = function (loadAll) {
        var count;

        if (typeof loadAll !== 'undefined') {
            count = $scope.assetsData.total_inventory_count - $scope.assets.length;
        }

        api.getAssets($scope.assetsData.last_assetid, count)
            .then(function (data) {
                var newAssets = mapAssetsToDescriptions(data);

                $scope.assets = $scope.assets.concat(newAssets);
                $scope.assetsData = data;
            });
    };
});

app.controller('AssetController', function ($scope, $routeParams) {
    $scope.params = $routeParams;
});

app.service('api', function ($q) {
    return {
        getAssets: function (startAssetId, count) {
            var getData = $q.defer();

            var settings = {
                async: true,
                url: '/api/assets',
                method: 'GET',
                dataType: 'JSON'
            };

            if (typeof startAssetId !== 'undefined') {
                settings.data = {
                    start_assetid: startAssetId
                };
            }

            if (typeof count !== 'undefined') {
                settings.data.count = count;
            }

            $.ajax(settings).done(function (response) {
                getData.resolve(response);
            });

            return getData.promise;
        },
        getItemNameId: function (marketHashName) {
            var getData = $q.defer();

            var settings = {
                async: true,
                url: '/api/item_nameid/' + marketHashName,
                method: 'GET',
                dataType: 'JSON'
            };

            $.ajax(settings).done(function (response) {
                getData.resolve(response);
            });

            return getData.promise;
        },
        getOrders: function (itemNameId) {
            var getData = $q.defer();

            var settings = {
                async: true,
                url: '/api/orders/' + itemNameId,
                method: 'GET',
                dataType: 'JSON'
            };

            $.ajax(settings).done(function (response) {
                getData.resolve(response);
            });

            return getData.promise;
        }
    };
});
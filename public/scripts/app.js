"use strict";

function config($routeProvider, $locationProvider) {
  $routeProvider
    .when("/asset/:assetId", {
      templateUrl: "/partials/asset.html",
      controller: "AssetController",
      resolve: {
        asset: {}
      }
    })
    .when("/", {
      templateUrl: "/partials/assets.html",
      controller: "AssetsController",
      resolve: {
        assetsData: function(api) {
          return api.getAssets();
        }
      }
    })
    .otherwise({
      redirectTo: "/"
    });

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}

function MainController($scope, $route, $routeParams, $location) {
  $scope.$route = $route;
  $scope.$routeParams = $routeParams;
  $scope.$location = $location;
}

function AssetsController() {
  return function($scope, assetsData, api) {
    function mapAssetsToDescriptions(assetsData) {
      if (!assetsData || !assetsData.assets) {
        return [];
      }

      return assetsData.assets.map(asset => {
        return {
          asset: asset,
          description: assetsData.descriptions.find(
            description => description.classid === asset.classid
          )
        };
      });
    }

    $scope.assetsData = assetsData;
    $scope.assets = mapAssetsToDescriptions(assetsData);
    $scope.loadMore = function(loadAll) {
      var count;

      if (typeof loadAll !== "undefined") {
        count = $scope.assetsData.total_inventory_count - $scope.assets.length;
      }

      api.getAssets($scope.assetsData.last_assetid, count).then(function(data) {
        var newAssets = mapAssetsToDescriptions(data);
        $scope.assets = $scope.assets.concat(newAssets);
        $scope.assetsData = data;
      });
    };
  };
}

function AssetController() {
  return function($scope, $routeParams) {
    $scope.params = $routeParams;
  };
}

function ApiService() {
  return function($q, $http) {
    return {
      getAssets: function(startAssetId, count) {
        var getData = $q.defer();
        
        var settings = {
          async: true,
          url: "/api/assets",
          method: "GET",
          dataType: "JSON"
        };

        if (typeof startAssetId !== "undefined") {
          settings.data = {
            start_assetid: startAssetId
          };
        }

        if (typeof count !== "undefined") {
          settings.data.count = count;
        }

        $http(settings).then(function(response) {
          getData.resolve(response.data);
        });

        return getData.promise;
      },
      getItemNameId: function(marketHashName) {
        var getData = $q.defer();

        $http({
          async: true,
          url: "/api/item_nameid/" + marketHashName,
          method: "GET",
          dataType: "JSON"
        }).then(function(response) {
          getData.resolve(response.data);
        });

        return getData.promise;
      },
      getOrders: function(itemNameId) {
        var getData = $q.defer();

        $http({
          async: true,
          url: "/api/orders/" + itemNameId,
          method: "GET",
          dataType: "JSON"
        }).then(function(response) {
          getData.resolve(response.data);
        });

        return getData.promise;
      }
    };
  };
}

angular
  .module("MyApp", ["ngRoute"])
  .config(config)
  .controller("MainController", MainController)
  .controller("AssetsController", AssetsController())
  .controller("AssetController", AssetController())
  .service("api", ApiService());
